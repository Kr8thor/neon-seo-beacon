import type { H3Event } from "h3";
import { createSupabaseClient } from "~/server/utils/supabase";

export default defineEventHandler(async (event: H3Event) => {
  const startTime = Date.now();
  const config = useRuntimeConfig();

  interface HealthCheck {
    status: string;
    responseTime: number;
    error?: string;
    usage?: number;
    limit?: number;
    percentage?: number;
    stats?: any;
  }

  interface HealthResponse {
    status: string;
    timestamp: string;
    version: string;
    environment: string;
    uptime: number;
    responseTime?: number;
    system?: {
      nodeVersion: string;
      platform: string;
      architecture: string;
      memory?: {
        used: number;
        total: number;
        percentage: number;
      };
    };
    dependencies?: {
      supabase: { status: string };
      anthropic: { status: string };
    };
    checks: {
      database: HealthCheck;
      ai: HealthCheck;
      memory: HealthCheck;
      queue: HealthCheck;
    };
  }

  const health: HealthResponse = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.1",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100),
      },
    },
    dependencies: {
      supabase: { status: "unknown" },
      anthropic: { status: "unknown" },
    },
    checks: {
      database: { status: "unknown", responseTime: 0 },
      ai: { status: "unknown", responseTime: 0 },
      memory: { status: "unknown", responseTime: 0, usage: 0, limit: 0 },
      queue: { status: "unknown", responseTime: 0, stats: {} },
    },
  };

  // Check database connectivity
  try {
    const dbStart = Date.now();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from("audits").select("id").limit(1);

    health.checks.database = {
      status: error ? "warning" : "healthy",
      responseTime: Date.now() - dbStart,
      ...(error && { error: error.message }),
    };

    health.dependencies!.supabase.status = error ? "warning" : "healthy";
  } catch (error: any) {
    health.checks.database = {
      status: "warning",
      responseTime: Date.now() - startTime,
      error: error.message,
    };
    health.dependencies!.supabase.status = "unhealthy";
  }

  // Check AI service
  try {
    const aiStart = Date.now();
    if (config.anthropicApiKey) {
      health.checks.ai = {
        status: "configured",
        responseTime: Date.now() - aiStart,
      };
      health.dependencies!.anthropic.status = "configured";
    } else {
      health.checks.ai = {
        status: "not_configured",
        responseTime: 0,
      };
      health.dependencies!.anthropic.status = "not_configured";
    }
  } catch (error: any) {
    const aiStart = Date.now();
    health.checks.ai = {
      status: "unhealthy",
      responseTime: Date.now() - aiStart,
      error: error.message,
    };
    health.dependencies!.anthropic.status = "unhealthy";
  }

  // Check memory usage
  try {
    const memUsage = process.memoryUsage();
    const used = memUsage.heapUsed / 1024 / 1024; // MB
    const total = memUsage.heapTotal / 1024 / 1024; // MB

    health.checks.memory = {
      status: used > total * 0.9 ? "warning" : "healthy",
      responseTime: 0,
      usage: Math.round(used),
      limit: Math.round(total),
      percentage: Math.round((used / total) * 100),
    };
  } catch (error: any) {
    health.checks.memory = {
      status: "unhealthy",
      responseTime: 0,
      error: error.message,
    };
  }

  // Check queue status - wrapped in try/catch to handle if audit processor fails
  try {
    const { getQueueStats } = await import("~/server/utils/auditProcessor");
    const queueStats = getQueueStats();

    health.checks.queue = {
      status: queueStats.failed > 10 ? "warning" : "healthy",
      responseTime: 0,
      stats: queueStats,
    };
  } catch (error: any) {
    health.checks.queue = {
      status: "warning",
      responseTime: 0,
      error: error.message || "Queue service not available",
    };
  }

  // Determine overall health
  const allChecks = Object.values(health.checks);
  const hasUnhealthy = allChecks.some((check) => check.status === "unhealthy");
  const hasWarning = allChecks.some((check) => check.status === "warning");

  if (hasUnhealthy) {
    health.status = "unhealthy";
    setResponseStatus(event, 503);
  } else if (hasWarning) {
    health.status = "warning";
  }

  health.responseTime = Date.now() - startTime;

  return health;
});
