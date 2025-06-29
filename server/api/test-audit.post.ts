import type { H3Event } from "h3";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const { url, type = "standard" } = body;

    // Simple URL validation
    if (!url || !url.includes(".")) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please enter a valid website URL",
      });
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = "https://" + formattedUrl;
    }

    // Return mock audit for testing
    return {
      success: true,
      audit: {
        id: "test-" + Date.now(),
        url: formattedUrl,
        status: "queued",
        created_at: new Date().toISOString(),
        is_public: true,
      },
    };
  } catch (error) {
    logger.error("Test audit error", error);
    return {
      success: false,
      error: "Failed to create audit",
    };
  }
});
