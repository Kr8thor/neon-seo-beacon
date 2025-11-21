// Get all pages crawled for an audit with pagination
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const auditId = getRouterParam(event, 'id');
  const query = getQuery(event);

  if (!auditId) {
    throw createError({
      statusCode: 400,
      message: "Audit ID is required",
    });
  }

  // Pagination parameters
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 50));
  const offset = (page - 1) * limit;

  // Filter parameters
  const statusCode = query.status_code as string | undefined;
  const sortBy = (query.sort_by as string) || 'created_at';
  const sortOrder = (query.sort_order as string) === 'asc';

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Build query
    let dbQuery = supabase
      .from("audit_pages")
      .select("*", { count: 'exact' })
      .eq("audit_id", auditId);

    // Filter by status code range (e.g., "4xx" or "5xx" or specific "404")
    if (statusCode) {
      if (statusCode.endsWith('xx')) {
        const base = parseInt(statusCode.charAt(0)) * 100;
        dbQuery = dbQuery.gte('status_code', base).lt('status_code', base + 100);
      } else {
        dbQuery = dbQuery.eq('status_code', parseInt(statusCode));
      }
    }

    // Apply sorting and pagination
    dbQuery = dbQuery
      .order(sortBy, { ascending: sortOrder })
      .range(offset, offset + limit - 1);

    const { data: pages, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    // Get status code breakdown
    const { data: statusCounts } = await supabase
      .from("audit_pages")
      .select("status_code")
      .eq("audit_id", auditId);

    const statusBreakdown = {
      '2xx': 0,
      '3xx': 0,
      '4xx': 0,
      '5xx': 0,
    };

    statusCounts?.forEach((page: any) => {
      const code = page.status_code;
      if (code >= 200 && code < 300) statusBreakdown['2xx']++;
      else if (code >= 300 && code < 400) statusBreakdown['3xx']++;
      else if (code >= 400 && code < 500) statusBreakdown['4xx']++;
      else if (code >= 500) statusBreakdown['5xx']++;
    });

    const totalPages = count ? Math.ceil(count / limit) : 1;

    return {
      success: true,
      data: pages || [],
      summary: {
        total: count || 0,
        by_status: statusBreakdown,
      },
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };
  } catch (error: any) {
    logger.error("Failed to fetch audit pages", { error, auditId });

    throw createError({
      statusCode: 500,
      message: "Failed to fetch audit pages",
    });
  }
});
