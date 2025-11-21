// List all scheduled audits for authenticated user
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";
import { requireAuth } from "~/server/utils/authMiddleware";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // Require authentication
    const user = await requireAuth(event);

    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    const { data: schedules, error } = await supabase
      .from("scheduled_audits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: schedules || [],
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    logger.error("Failed to list scheduled audits", { error });

    throw createError({
      statusCode: 500,
      message: "Failed to list scheduled audits",
    });
  }
});
