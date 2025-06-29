import type { H3Event } from "h3";
import { createSupabaseClient } from "~/server/utils/supabase";
import { logger } from "~/server/utils/logger";
import { getCurrentUser } from "~/server/utils/auth";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const auditId = getRouterParam(event, "id");

    if (!auditId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Audit ID is required",
      });
    }

    // Set headers for Server-Sent Events
    setHeader(event, "Content-Type", "text/event-stream");
    setHeader(event, "Cache-Control", "no-cache");
    setHeader(event, "Connection", "keep-alive");
    setHeader(event, "Access-Control-Allow-Origin", "*");
    setHeader(event, "Access-Control-Allow-Headers", "Cache-Control");

    // Get user from JWT token
    const user = await getCurrentUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authentication required",
      });
    }

    // Verify audit belongs to user
    const supabase = createSupabaseClient();
    const { data: audit, error } = await supabase
      .from("audits")
      .select("id, status, user_id")
      .eq("id", auditId)
      .eq("user_id", user.id)
      .single();

    if (error || !audit) {
      throw createError({
        statusCode: 404,
        statusMessage: "Audit not found",
      });
    }

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'));

        // Set up progress monitoring
        const progressInterval = setInterval(async () => {
          try {
            // Get latest progress from database
            const { data: progress } = await supabase
              .from("audit_progress")
              .select("*")
              .eq("audit_id", auditId)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            if (progress) {
              const progressData = {
                type: "progress",
                step: progress.step,
                totalSteps: progress.total_steps,
                message: progress.message,
                data: progress.data,
                timestamp: progress.created_at,
              };

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(progressData)}\n\n`),
              );

              // Check if audit is complete
              const { data: updatedAudit } = await supabase
                .from("audits")
                .select("status")
                .eq("id", auditId)
                .single();

              if (
                updatedAudit?.status === "completed" ||
                updatedAudit?.status === "error"
              ) {
                controller.enqueue(
                  encoder.encode(
                    `data: {"type":"complete","status":"${updatedAudit.status}"}\n\n`,
                  ),
                );
                clearInterval(progressInterval);
                controller.close();
              }
            }
          } catch (error) {
            logger.error("Progress monitoring error", error);
            clearInterval(progressInterval);
            controller.error(error);
          }
        }, 1000); // Check every second

        // Clean up on client disconnect
        event.node.req.on("close", () => {
          clearInterval(progressInterval);
          controller.close();
        });
      },
    });

    return stream;
  } catch (error: any) {
    logger.error("Progress stream error", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
