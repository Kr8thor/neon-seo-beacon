// Get queue statistics for monitoring
import { getAllQueueStats } from "~/server/utils/queue";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  try {
    const stats = await getAllQueueStats();

    const summary = {
      totalJobs: stats.reduce((sum, q) => sum + q.total, 0),
      activeJobs: stats.reduce((sum, q) => sum + q.active, 0),
      waitingJobs: stats.reduce((sum, q) => sum + q.waiting, 0),
      completedJobs: stats.reduce((sum, q) => sum + q.completed, 0),
      failedJobs: stats.reduce((sum, q) => sum + q.failed, 0),
    };

    return {
      success: true,
      data: {
        summary,
        queues: stats,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    logger.error("Failed to get queue stats", { error });

    // Return empty stats if Redis is not available
    return {
      success: false,
      error: "Queue system not available",
      data: {
        summary: {
          totalJobs: 0,
          activeJobs: 0,
          waitingJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
        },
        queues: [],
        timestamp: new Date().toISOString(),
      },
    };
  }
});
