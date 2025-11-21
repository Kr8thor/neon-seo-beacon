import type { H3Event } from "h3";
import { createSupabaseClient } from "~/server/utils/supabase";
import { getCurrentUser } from "~/server/utils/auth";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get user from JWT token
    const user = await getCurrentUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authentication required",
      });
    }

    // Get query parameters
    const query = getQuery(event);
    const limit = parseInt((query.limit as string) || "20") || 20;
    const offset = parseInt((query.offset as string) || "0") || 0;
    const status = query.status as string;

    // Build query
    const supabase = createSupabaseClient();
    let queryBuilder = supabase
      .from("audits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status) {
      queryBuilder = queryBuilder.eq("status", status);
    }

    const { data: audits, error } = await queryBuilder;

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch audits",
      });
    }

    return {
      success: true,
      data: audits || [],
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total: audits?.length || 0,
        total_pages: Math.ceil((audits?.length || 0) / limit) || 1,
        has_next: (audits?.length || 0) >= limit,
        has_prev: offset > 0,
      },
    };
  } catch (error: any) {
    logger.error("Audits fetch error", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
