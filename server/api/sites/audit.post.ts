// Start a comprehensive site audit with multi-page crawling
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { logger } from "~/server/utils/logger";
import {
  addSiteCrawlJob,
  DEFAULT_CRAWL_CONFIG,
  CrawlConfig,
} from "~/server/utils/queue";

// Request validation schema
const AuditRequestSchema = z.object({
  url: z.string().url("Invalid URL format"),
  config: z
    .object({
      maxDepth: z.number().min(1).max(10).optional(),
      maxPages: z.number().min(1).max(1000).optional(),
      respectRobotsTxt: z.boolean().optional(),
      includeSubdomains: z.boolean().optional(),
      urlPatterns: z.array(z.string()).optional(),
      excludePatterns: z.array(z.string()).optional(),
      rateLimit: z.number().min(0.1).max(10).optional(),
      renderJavaScript: z.boolean().optional(),
    })
    .optional(),
  includePerformance: z.boolean().optional().default(true),
  includeAIRecommendations: z.boolean().optional().default(true),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // Parse and validate request body
    const body = await readBody(event);
    const validatedData = AuditRequestSchema.parse(body);

    // Normalize URL
    const url = new URL(validatedData.url);
    const normalizedUrl = url.origin + url.pathname;

    // Create Supabase client
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Get user from session (if authenticated)
    const authHeader = getHeader(event, "authorization");
    let userId: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const {
        data: { user },
      } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Create or update site record
    const { data: site, error: siteError } = await supabase
      .from("sites")
      .upsert(
        {
          url: url.origin,
          name: url.hostname,
          user_id: userId || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "url",
        }
      )
      .select()
      .single();

    if (siteError) {
      logger.error("Failed to create site record", { error: siteError });
      throw createError({
        statusCode: 500,
        message: "Failed to create site record",
      });
    }

    // Create audit record
    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .insert({
        site_id: site.id,
        user_id: userId || null,
        url: normalizedUrl,
        status: "pending",
        config: {
          ...DEFAULT_CRAWL_CONFIG,
          ...validatedData.config,
          includePerformance: validatedData.includePerformance,
          includeAIRecommendations: validatedData.includeAIRecommendations,
        },
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (auditError) {
      logger.error("Failed to create audit record", { error: auditError });
      throw createError({
        statusCode: 500,
        message: "Failed to create audit record",
      });
    }

    // Merge configs
    const crawlConfig: CrawlConfig = {
      ...DEFAULT_CRAWL_CONFIG,
      ...validatedData.config,
    };

    // Add job to queue
    const job = await addSiteCrawlJob({
      siteId: site.id,
      url: normalizedUrl,
      userId,
      config: crawlConfig,
    });

    logger.info("Site audit started", {
      auditId: audit.id,
      siteId: site.id,
      url: normalizedUrl,
      jobId: job.id,
    });

    // Return audit details
    return {
      success: true,
      data: {
        auditId: audit.id,
        siteId: site.id,
        jobId: job.id,
        url: normalizedUrl,
        status: "pending",
        config: crawlConfig,
        estimatedTime: estimateCrawlTime(crawlConfig),
        createdAt: audit.created_at,
      },
      message: "Site audit started successfully",
    };
  } catch (error: any) {
    if (error.name === "ZodError") {
      throw createError({
        statusCode: 400,
        message: "Invalid request data",
        data: error.errors,
      });
    }

    if (error.statusCode) {
      throw error;
    }

    logger.error("Site audit error", { error });
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to start site audit",
    });
  }
});

function estimateCrawlTime(config: CrawlConfig): string {
  // Estimate based on pages and rate limit
  const estimatedPages = Math.min(config.maxPages, 100);
  const timePerPage = 1000 / config.rateLimit; // ms per page
  const totalMs = estimatedPages * timePerPage;

  if (totalMs < 60000) {
    return `~${Math.ceil(totalMs / 1000)} seconds`;
  } else {
    return `~${Math.ceil(totalMs / 60000)} minutes`;
  }
}
