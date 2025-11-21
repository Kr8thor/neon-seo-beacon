// Server-Sent Events endpoint for real-time audit progress
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const auditId = getRouterParam(event, "auditId");

  if (!auditId) {
    throw createError({
      statusCode: 400,
      message: "Audit ID is required",
    });
  }

  // Set up SSE headers
  setHeader(event, "Content-Type", "text/event-stream");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");

  const supabase = createClient(
    config.supabaseUrl || config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  // Send initial connection message
  const sendEvent = (eventType: string, data: any) => {
    const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    event.node.res.write(message);
  };

  sendEvent("connected", { auditId, timestamp: new Date().toISOString() });

  // Get initial audit status
  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("id, status, score, created_at")
    .eq("id", auditId)
    .single();

  if (auditError) {
    sendEvent("error", { message: "Audit not found" });
    event.node.res.end();
    return;
  }

  sendEvent("status", { status: audit.status, score: audit.score });

  // If already completed, send final state and close
  if (audit.status === "completed" || audit.status === "failed") {
    const { data: progress } = await supabase
      .from("audit_progress")
      .select("*")
      .eq("audit_id", auditId)
      .order("created_at", { ascending: true });

    if (progress) {
      for (const p of progress) {
        sendEvent("progress", {
          step: p.step,
          totalSteps: p.total_steps,
          message: p.message,
        });
      }
    }

    sendEvent("complete", { status: audit.status, score: audit.score });
    event.node.res.end();
    return;
  }

  // Poll for updates
  let lastProgressId: string | null = null;
  let isComplete = false;
  const pollInterval = 1000; // 1 second
  const maxDuration = 10 * 60 * 1000; // 10 minutes max
  const startTime = Date.now();

  const poll = async () => {
    if (isComplete || Date.now() - startTime > maxDuration) {
      sendEvent("timeout", { message: "Stream timeout" });
      event.node.res.end();
      return;
    }

    try {
      // Check audit status
      const { data: currentAudit } = await supabase
        .from("audits")
        .select("status, score")
        .eq("id", auditId)
        .single();

      if (currentAudit) {
        // Get new progress entries
        let query = supabase
          .from("audit_progress")
          .select("*")
          .eq("audit_id", auditId)
          .order("created_at", { ascending: true });

        if (lastProgressId) {
          query = query.gt("id", lastProgressId);
        }

        const { data: newProgress } = await query;

        if (newProgress && newProgress.length > 0) {
          for (const p of newProgress) {
            sendEvent("progress", {
              step: p.step,
              totalSteps: p.total_steps,
              message: p.message,
              data: p.data,
            });
            lastProgressId = p.id;
          }
        }

        // Check if complete
        if (currentAudit.status === "completed" || currentAudit.status === "failed") {
          isComplete = true;

          // Get final results summary
          const { data: pages } = await supabase
            .from("audit_pages")
            .select("id")
            .eq("audit_id", auditId);

          const { data: issues } = await supabase
            .from("audit_issues")
            .select("severity")
            .eq("audit_id", auditId);

          sendEvent("complete", {
            status: currentAudit.status,
            score: currentAudit.score,
            summary: {
              pagesAnalyzed: pages?.length || 0,
              totalIssues: issues?.length || 0,
              criticalIssues: issues?.filter(i => i.severity === "critical").length || 0,
              highIssues: issues?.filter(i => i.severity === "high").length || 0,
            },
          });

          event.node.res.end();
          return;
        }
      }

      // Schedule next poll
      setTimeout(poll, pollInterval);
    } catch (error) {
      logger.error("Stream polling error", { error, auditId });
      sendEvent("error", { message: "Polling error" });
      setTimeout(poll, pollInterval * 2);
    }
  };

  // Start polling
  setTimeout(poll, pollInterval);

  // Handle client disconnect
  event.node.req.on("close", () => {
    isComplete = true;
    logger.debug("Client disconnected from audit stream", { auditId });
  });
});
