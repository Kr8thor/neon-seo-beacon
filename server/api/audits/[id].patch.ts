// Update an audit (status, cancel, retry)
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const auditId = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!auditId) {
    throw createError({
      statusCode: 400,
      message: "Audit ID is required",
    });
  }

  // Validate allowed fields
  const allowedFields = ['status', 'metadata'];
  const updateData: Record<string, any> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw createError({
      statusCode: 400,
      message: "No valid fields to update",
    });
  }

  // Validate status transitions
  const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
  if (updateData.status && !validStatuses.includes(updateData.status)) {
    throw createError({
      statusCode: 400,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Get current audit state
    const { data: currentAudit, error: fetchError } = await supabase
      .from("audits")
      .select("id, status")
      .eq("id", auditId)
      .single();

    if (fetchError || !currentAudit) {
      throw createError({
        statusCode: 404,
        message: "Audit not found",
      });
    }

    // Validate status transitions
    if (updateData.status) {
      const invalidTransitions: Record<string, string[]> = {
        'completed': ['processing', 'pending'], // Can't go back to processing/pending
        'cancelled': ['completed'], // Can't cancel completed audits
      };

      const blocked = invalidTransitions[currentAudit.status];
      if (blocked && blocked.includes(updateData.status)) {
        throw createError({
          statusCode: 409,
          message: `Cannot change status from '${currentAudit.status}' to '${updateData.status}'`,
        });
      }
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // If cancelling, set error message
    if (updateData.status === 'cancelled') {
      updateData.error_message = 'Audit cancelled by user';
    }

    // Perform update
    const { data: updatedAudit, error: updateError } = await supabase
      .from("audits")
      .update(updateData)
      .eq("id", auditId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    logger.info("Audit updated successfully", { auditId, updates: Object.keys(updateData) });

    return {
      success: true,
      data: updatedAudit,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    logger.error("Failed to update audit", { error, auditId });

    throw createError({
      statusCode: 500,
      message: "Failed to update audit",
    });
  }
});
