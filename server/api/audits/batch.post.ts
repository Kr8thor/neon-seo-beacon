// Batch analyze multiple URLs
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";
import { z } from "zod";

const batchSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(50),
  options: z.object({
    priority: z.enum(["low", "normal", "high"]).default("normal"),
  }).default({}),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    const { urls, options } = batchSchema.parse(body);

    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Create audit records for all URLs
    const audits = urls.map(url => ({
      url,
      status: "pending",
      score: 0,
      metadata: {
        batch: true,
        priority: options.priority,
        batch_size: urls.length,
      },
    }));

    const { data: createdAudits, error } = await supabase
      .from("audits")
      .insert(audits)
      .select("id, url, status");

    if (error) {
      throw error;
    }

    // Queue all jobs (in real implementation, would use job queue)
    const batchId = crypto.randomUUID();

    logger.info("Batch audit created", {
      batchId,
      count: createdAudits?.length,
      urls: urls.slice(0, 3),
    });

    return {
      success: true,
      data: {
        batch_id: batchId,
        total: createdAudits?.length || 0,
        audits: createdAudits || [],
        status: "queued",
        message: `${urls.length} URLs queued for analysis`,
      },
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Invalid request data",
        data: error.errors,
      });
    }

    logger.error("Failed to create batch audit", { error });

    throw createError({
      statusCode: 500,
      message: "Failed to create batch audit",
    });
  }
});
