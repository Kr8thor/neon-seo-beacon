// List all scheduled audits
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    const { data: schedules, error } = await supabase
      .from("scheduled_audits")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: schedules || [],
    };
  } catch (error: any) {
    logger.error("Failed to list scheduled audits", { error });

    throw createError({
      statusCode: 500,
      message: "Failed to list scheduled audits",
    });
  }
});
