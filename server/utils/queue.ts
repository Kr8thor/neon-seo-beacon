// BullMQ Queue Configuration for distributed job processing
import { Queue, Worker, Job, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { logger } from "./logger";

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

// Create Redis connection
let redisConnection: IORedis | null = null;

export function getRedisConnection(): IORedis {
  if (!redisConnection) {
    redisConnection = new IORedis(redisConfig);

    redisConnection.on("connect", () => {
      logger.info("Redis connected successfully");
    });

    redisConnection.on("error", (error) => {
      logger.error("Redis connection error", { error });
    });
  }
  return redisConnection;
}

// Queue names
export const QUEUE_NAMES = {
  SITE_CRAWL: "site-crawl",
  PAGE_ANALYSIS: "page-analysis",
  AI_RECOMMENDATIONS: "ai-recommendations",
  REPORT_GENERATION: "report-generation",
} as const;

// Job types
export interface SiteCrawlJob {
  siteId: string;
  url: string;
  userId?: string;
  config: CrawlConfig;
}

export interface PageAnalysisJob {
  pageId: string;
  siteId: string;
  url: string;
  depth: number;
  parentPageId?: string;
}

export interface AIRecommendationsJob {
  auditId: string;
  siteId: string;
  analysisData: any;
}

export interface ReportGenerationJob {
  auditId: string;
  siteId: string;
  format: "pdf" | "json" | "csv";
  options?: ReportOptions;
}

export interface CrawlConfig {
  maxDepth: number;
  maxPages: number;
  respectRobotsTxt: boolean;
  includeSubdomains: boolean;
  urlPatterns?: string[];
  excludePatterns?: string[];
  rateLimit: number; // requests per second
  timeout: number; // ms per request
  userAgent?: string;
  renderJavaScript: boolean;
}

export interface ReportOptions {
  includeScreenshots?: boolean;
  includeTechnicalDetails?: boolean;
  executiveSummary?: boolean;
}

// Default crawl configuration
export const DEFAULT_CRAWL_CONFIG: CrawlConfig = {
  maxDepth: 3,
  maxPages: 100,
  respectRobotsTxt: true,
  includeSubdomains: false,
  rateLimit: 2,
  timeout: 30000,
  renderJavaScript: false,
  userAgent: "NeonSEOBeacon/1.0 (+https://neonseobeacon.com/bot)",
};

// Queue instances
const queues = new Map<string, Queue>();

export function getQueue(name: string): Queue {
  if (!queues.has(name)) {
    const queue = new Queue(name, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: {
          count: 1000,
          age: 24 * 3600, // 24 hours
        },
        removeOnFail: {
          count: 5000,
          age: 7 * 24 * 3600, // 7 days
        },
      },
    });

    queues.set(name, queue);
    logger.info(`Queue created: ${name}`);
  }

  return queues.get(name)!;
}

// Helper to add jobs
export async function addSiteCrawlJob(data: SiteCrawlJob, priority: number = 0): Promise<Job> {
  const queue = getQueue(QUEUE_NAMES.SITE_CRAWL);
  const job = await queue.add("crawl-site", data, {
    priority,
    jobId: `site-${data.siteId}-${Date.now()}`,
  });
  logger.info(`Added site crawl job`, { jobId: job.id, siteId: data.siteId, url: data.url });
  return job;
}

export async function addPageAnalysisJob(data: PageAnalysisJob, priority: number = 0): Promise<Job> {
  const queue = getQueue(QUEUE_NAMES.PAGE_ANALYSIS);
  const job = await queue.add("analyze-page", data, {
    priority,
    jobId: `page-${data.pageId}-${Date.now()}`,
  });
  return job;
}

export async function addAIRecommendationsJob(data: AIRecommendationsJob): Promise<Job> {
  const queue = getQueue(QUEUE_NAMES.AI_RECOMMENDATIONS);
  const job = await queue.add("generate-recommendations", data, {
    jobId: `ai-${data.auditId}-${Date.now()}`,
  });
  return job;
}

export async function addReportJob(data: ReportGenerationJob): Promise<Job> {
  const queue = getQueue(QUEUE_NAMES.REPORT_GENERATION);
  const job = await queue.add("generate-report", data, {
    jobId: `report-${data.auditId}-${Date.now()}`,
  });
  return job;
}

// Get queue statistics
export async function getQueueStats(queueName: string) {
  const queue = getQueue(queueName);

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return {
    name: queueName,
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + delayed,
  };
}

// Get all queue stats
export async function getAllQueueStats() {
  const stats = await Promise.all(
    Object.values(QUEUE_NAMES).map(name => getQueueStats(name))
  );
  return stats;
}

// Cleanup
export async function closeQueues(): Promise<void> {
  const closePromises = Array.from(queues.values()).map(q => q.close());
  await Promise.all(closePromises);

  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }

  queues.clear();
  logger.info("All queues closed");
}
