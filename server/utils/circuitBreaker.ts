import { logger } from "./logger";

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  monitoringPeriod: number;
  fallbackFunction?: () => Promise<any>;
}

enum CircuitState {
  CLOSED = "CLOSED", // Normal operation
  OPEN = "OPEN", // Circuit is broken, rejecting calls
  HALF_OPEN = "HALF_OPEN", // Testing if service has recovered
}

interface CircuitStats {
  failures: number;
  successes: number;
  requests: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  state: CircuitState;
}

export class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private stats: CircuitStats;
  private nextAttempt: number = 0;
  private name: string;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = {
      failureThreshold: config.failureThreshold ?? 5,
      successThreshold: config.successThreshold ?? 2,
      timeout: config.timeout ?? 60000, // 1 minute
      monitoringPeriod: config.monitoringPeriod ?? 300000, // 5 minutes
    };

    // Handle fallbackFunction separately to avoid type issues
    if (config.fallbackFunction) {
      this.config.fallbackFunction = config.fallbackFunction;
    }

    this.stats = {
      failures: 0,
      successes: 0,
      requests: 0,
      state: CircuitState.CLOSED,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.stats.requests++;

    if (this.stats.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        logger.info(`Circuit breaker ${this.name} is OPEN, rejecting call`);
        return this.handleOpenCircuit();
      } else {
        // Try to transition to HALF_OPEN
        this.stats.state = CircuitState.HALF_OPEN;
        logger.info(`Circuit breaker ${this.name} transitioning to HALF_OPEN`);
      }
    }

    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error(`Circuit breaker timeout after ${this.config.timeout}ms`),
        );
      }, this.config.timeout);

      operation()
        .then((result) => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  private onSuccess(): void {
    this.stats.failures = 0;
    this.stats.successes++;
    this.stats.lastSuccessTime = Date.now();

    if (this.stats.state === CircuitState.HALF_OPEN) {
      if (this.stats.successes >= this.config.successThreshold) {
        this.stats.state = CircuitState.CLOSED;
        this.stats.successes = 0;
        logger.info(`Circuit breaker ${this.name} recovered, state: CLOSED`);
      }
    }
  }

  private onFailure(): void {
    this.stats.failures++;
    this.stats.lastFailureTime = Date.now();

    if (this.stats.state === CircuitState.HALF_OPEN) {
      // Go back to OPEN state
      this.openCircuit();
    } else if (this.stats.failures >= this.config.failureThreshold) {
      this.openCircuit();
    }
  }

  private openCircuit(): void {
    this.stats.state = CircuitState.OPEN;
    this.nextAttempt = Date.now() + this.config.timeout;
    this.stats.successes = 0;
    logger.warn(`Circuit breaker ${this.name} OPENED due to failures`);
  }

  private async handleOpenCircuit<T>(): Promise<T> {
    if (this.config.fallbackFunction) {
      logger.info(`Circuit breaker ${this.name} using fallback function`);
      return this.config.fallbackFunction();
    }
    throw new Error(
      `Service unavailable: ${this.name} circuit breaker is OPEN`,
    );
  }

  getStats() {
    return {
      name: this.name,
      state: this.stats.state,
      failures: this.stats.failures,
      successes: this.stats.successes,
      requests: this.stats.requests,
      lastFailureTime: this.stats.lastFailureTime,
      lastSuccessTime: this.stats.lastSuccessTime,
      nextAttempt: this.nextAttempt,
      config: this.config,
    };
  }

  reset(): void {
    this.stats = {
      failures: 0,
      successes: 0,
      requests: 0,
      state: CircuitState.CLOSED,
    };
    this.nextAttempt = 0;
    logger.info(`Circuit breaker ${this.name} manually reset`);
  }
}

// Circuit breaker registry
const circuitBreakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(
  name: string,
  config?: Partial<CircuitBreakerConfig>,
): CircuitBreaker {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker(name, config));
  }
  return circuitBreakers.get(name)!;
}

export function getAllCircuitBreakers(): CircuitBreaker[] {
  return Array.from(circuitBreakers.values());
}

export function resetAllCircuitBreakers(): void {
  for (const breaker of circuitBreakers.values()) {
    breaker.reset();
  }
}

// Helper function to wrap API calls with circuit breaker
export async function withCircuitBreaker<T>(
  name: string,
  operation: () => Promise<T>,
  config?: Partial<CircuitBreakerConfig>,
): Promise<T> {
  const breaker = getCircuitBreaker(name, config);
  return breaker.execute(operation);
}

// Common circuit breakers for external services
export const createExternalServiceBreakers = () => {
  // SEO Analysis Circuit Breaker
  getCircuitBreaker("seo-analysis", {
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 30000,
    fallbackFunction: async () => ({
      success: false,
      error: "SEO analysis service temporarily unavailable",
      data: {
        url: "",
        title: "",
        metaDescription: "",
        score: 0,
        technical: { hasViewport: false, hasCanonical: false },
        performance: null,
        message: "Service temporarily unavailable - using fallback response",
      },
    }),
  });

  // Google PageSpeed Circuit Breaker
  getCircuitBreaker("google-pagespeed", {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 45000,
    fallbackFunction: async () => ({
      performance: {
        loadTime: null,
        status: "unavailable",
        error: "PageSpeed service temporarily unavailable",
      },
    }),
  });

  // Anthropic API Circuit Breaker
  getCircuitBreaker("anthropic-api", {
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 30000,
    fallbackFunction: async () => ({
      recommendations: [
        "Service temporarily unavailable. Please try again later.",
        "Check your page title and meta description.",
        "Ensure your content is well-structured with proper headings.",
      ],
    }),
  });

  // Database Circuit Breaker
  getCircuitBreaker("database", {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 10000,
    // No fallback for database - let it fail
  });
};

// Initialize common circuit breakers
createExternalServiceBreakers();
