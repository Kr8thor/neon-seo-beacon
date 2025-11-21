// List all audits with summary stats
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Get audits with summary view
    const { data: audits, error } = await supabase
      .from("audit_summary")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      // Fallback to basic query if view doesn't exist
      const { data: basicAudits, error: basicError } = await supabase
        .from("audits")
        .select("id, url, status, score, created_at, completed_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (basicError) {
        throw basicError;
      }

      return {
        success: true,
        data: basicAudits || [],
      };
    }

    return {
      success: true,
      data: audits || [],
    };
  } catch (error: any) {
    logger.error("Failed to list audits", { error });

    return {
      success: false,
      error: "Failed to retrieve audits",
      data: [],
    };
  }
});
