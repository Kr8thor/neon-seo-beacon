import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "./logger";

interface PoolConfig {
  min: number;
  max: number;
  acquireTimeoutMillis: number;
  createTimeoutMillis: number;
  destroyTimeoutMillis: number;
  idleTimeoutMillis: number;
  reapIntervalMillis: number;
  createRetryIntervalMillis: number;
  maxUses: number;
}

interface PooledConnection {
  client: SupabaseClient;
  id: string;
  createdAt: number;
  lastUsed: number;
  useCount: number;
  inUse: boolean;
}

export class SupabaseConnectionPool {
  private config: PoolConfig;
  private pool: PooledConnection[] = [];
  private waitingQueue: Array<{
    resolve: (client: SupabaseClient) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = [];
  private supabaseUrl: string;
  private supabaseKey: string;
  private closed = false;
  private reapInterval: NodeJS.Timeout | null = null;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    config: Partial<PoolConfig> = {},
  ) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;

    this.config = {
      min: config.min || 2,
      max: config.max || 10,
      acquireTimeoutMillis: config.acquireTimeoutMillis || 30000,
      createTimeoutMillis: config.createTimeoutMillis || 10000,
      destroyTimeoutMillis: config.destroyTimeoutMillis || 5000,
      idleTimeoutMillis: config.idleTimeoutMillis || 300000, // 5 minutes
      reapIntervalMillis: config.reapIntervalMillis || 60000, // 1 minute
      createRetryIntervalMillis: config.createRetryIntervalMillis || 1000,
      maxUses: config.maxUses || 1000,
    };

    // Initialize minimum connections
    this.ensureMinConnections();

    // Start connection reaper
    this.startReaper();
  }

  async acquire(): Promise<SupabaseClient> {
    if (this.closed) {
      throw new Error("Connection pool is closed");
    }

    // Try to get an available connection
    const availableConnection = this.findAvailableConnection();
    if (availableConnection) {
      availableConnection.inUse = true;
      availableConnection.lastUsed = Date.now();
      availableConnection.useCount++;
      return availableConnection.client;
    }

    // If we haven't reached max connections, create a new one
    if (this.pool.length < this.config.max) {
      try {
        const connection = await this.createConnection();
        connection.inUse = true;
        this.pool.push(connection);
        return connection.client;
      } catch (error) {
        logger.error("Failed to create new connection", { error });
      }
    }

    // Wait for a connection to become available
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitingQueue.findIndex(
          (item) => item.resolve === resolve,
        );
        if (index !== -1) {
          this.waitingQueue.splice(index, 1);
        }
        reject(new Error("Timeout waiting for database connection"));
      }, this.config.acquireTimeoutMillis);

      this.waitingQueue.push({ resolve, reject, timeout });
    });
  }

  release(client: SupabaseClient): void {
    const connection = this.pool.find((conn) => conn.client === client);
    if (!connection) {
      logger.warn("Attempted to release unknown connection");
      return;
    }

    connection.inUse = false;
    connection.lastUsed = Date.now();

    // If there are waiting requests, fulfill the first one
    if (this.waitingQueue.length > 0) {
      const waiter = this.waitingQueue.shift()!;
      clearTimeout(waiter.timeout);
      connection.inUse = true;
      connection.useCount++;
      waiter.resolve(client);
      return;
    }

    // Check if connection should be destroyed due to max uses
    if (connection.useCount >= this.config.maxUses) {
      this.destroyConnection(connection);
    }
  }

  async close(): Promise<void> {
    this.closed = true;

    // Stop the reaper
    if (this.reapInterval) {
      clearInterval(this.reapInterval);
      this.reapInterval = null;
    }

    // Reject all waiting requests
    for (const waiter of this.waitingQueue) {
      clearTimeout(waiter.timeout);
      waiter.reject(new Error("Pool is closing"));
    }
    this.waitingQueue.length = 0;

    // Close all connections
    const closePromises = this.pool.map((conn) => this.destroyConnection(conn));
    await Promise.all(closePromises);
    this.pool.length = 0;
  }

  getStats() {
    return {
      totalConnections: this.pool.length,
      activeConnections: this.pool.filter((conn) => conn.inUse).length,
      idleConnections: this.pool.filter((conn) => !conn.inUse).length,
      waitingRequests: this.waitingQueue.length,
      config: this.config,
    };
  }

  private findAvailableConnection(): PooledConnection | null {
    return (
      this.pool.find((conn) => !conn.inUse && !this.isConnectionStale(conn)) ||
      null
    );
  }

  private isConnectionStale(connection: PooledConnection): boolean {
    const now = Date.now();
    return now - connection.lastUsed > this.config.idleTimeoutMillis;
  }

  private async createConnection(): Promise<PooledConnection> {
    const client = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

    // Test the connection
    try {
      await client.from("audits").select("id").limit(1);
    } catch (error) {
      throw new Error(`Failed to test database connection: ${error}`);
    }

    return {
      client,
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      useCount: 0,
      inUse: false,
    };
  }

  private async destroyConnection(connection: PooledConnection): Promise<void> {
    const index = this.pool.indexOf(connection);
    if (index !== -1) {
      this.pool.splice(index, 1);
    }

    try {
      // Supabase clients don't have explicit close methods
      // The connection will be garbage collected
      logger.debug(`Destroyed connection ${connection.id}`);
    } catch (error) {
      logger.error(`Error destroying connection ${connection.id}`, { error });
    }
  }

  private async ensureMinConnections(): Promise<void> {
    while (this.pool.length < this.config.min && !this.closed) {
      try {
        const connection = await this.createConnection();
        this.pool.push(connection);
      } catch (error) {
        logger.error("Failed to create minimum connection", { error });
        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.createRetryIntervalMillis),
        );
      }
    }
  }

  private startReaper(): void {
    this.reapInterval = setInterval(() => {
      this.reapStaleConnections();
    }, this.config.reapIntervalMillis);
  }

  private reapStaleConnections(): void {
    const now = Date.now();
    const staleConnections = this.pool.filter(
      (conn) =>
        !conn.inUse &&
        this.isConnectionStale(conn) &&
        this.pool.length > this.config.min,
    );

    for (const connection of staleConnections) {
      this.destroyConnection(connection);
    }

    // Ensure we maintain minimum connections
    this.ensureMinConnections();
  }
}

// Singleton pool instance
let poolInstance: SupabaseConnectionPool | null = null;

export function getSupabasePool(): SupabaseConnectionPool | null {
  return poolInstance;
}

export function initializeSupabasePool(
  supabaseUrl: string,
  supabaseKey: string,
  config?: Partial<PoolConfig>,
): SupabaseConnectionPool {
  if (!poolInstance) {
    poolInstance = new SupabaseConnectionPool(supabaseUrl, supabaseKey, config);
  }
  return poolInstance;
}

export async function closeSupabasePool(): Promise<void> {
  if (poolInstance) {
    await poolInstance.close();
    poolInstance = null;
  }
}

// Helper function for pool-aware Supabase client creation
export async function withPooledClient<T>(
  operation: (client: SupabaseClient) => Promise<T>,
): Promise<T> {
  const pool = getSupabasePool();
  if (!pool) {
    throw new Error("Supabase connection pool not initialized");
  }

  const client = await pool.acquire();
  try {
    return await operation(client);
  } finally {
    pool.release(client);
  }
}
