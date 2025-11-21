// Delete an audit and all related data
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";
import { requireAuth } from "~/server/utils/authMiddleware";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const auditId = getRouterParam(event, 'id');

  if (!auditId) {
    throw createError({
      statusCode: 400,
      message: "Audit ID is required",
    });
  }

  try {
    // Require authentication
    const user = await requireAuth(event);

    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Check if audit exists and user owns it
    const { data: audit, error: fetchError } = await supabase
      .from("audits")
      .select("id, status, user_id")
      .eq("id", auditId)
      .single();

    if (fetchError || !audit) {
      throw createError({
        statusCode: 404,
        message: "Audit not found",
      });
    }

    // Validate ownership
    if (audit.user_id && audit.user_id !== user.id) {
      throw createError({
        statusCode: 403,
        message: "Access denied",
      });
    }

    // Don't allow deleting audits that are currently processing
    if (audit.status === 'processing') {
      throw createError({
        statusCode: 409,
        message: "Cannot delete audit while it is processing. Please wait for completion or cancel first.",
      });
    }

    // Delete related data (cascading)
    // Order matters due to foreign key constraints

    // Delete audit_issues
    await supabase
      .from("audit_issues")
      .delete()
      .eq("audit_id", auditId);

    // Delete audit_pages
    await supabase
      .from("audit_pages")
      .delete()
      .eq("audit_id", auditId);

    // Delete audit_categories
    await supabase
      .from("audit_categories")
      .delete()
      .eq("audit_id", auditId);

    // Delete performance_metrics
    await supabase
      .from("performance_metrics")
      .delete()
      .eq("audit_id", auditId);

    // Delete audit_history
    await supabase
      .from("audit_history")
      .delete()
      .eq("audit_id", auditId);

    // Finally delete the audit itself
    const { error: deleteError } = await supabase
      .from("audits")
      .delete()
      .eq("id", auditId);

    if (deleteError) {
      throw deleteError;
    }

    logger.info("Audit deleted successfully", { auditId });

    return {
      success: true,
      message: "Audit deleted successfully",
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    logger.error("Failed to delete audit", { error, auditId });

    throw createError({
      statusCode: 500,
      message: "Failed to delete audit",
    });
  }
});
