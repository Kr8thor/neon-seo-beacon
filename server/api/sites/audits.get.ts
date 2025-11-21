// List all audits with pagination and summary stats
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  // Pagination parameters
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  const offset = (page - 1) * limit;

  // Filter parameters
  const status = query.status as string | undefined;
  const search = query.search as string | undefined;
  const sortBy = (query.sort_by as string) || 'created_at';
  const sortOrder = (query.sort_order as string) === 'asc' ? true : false;

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Build query
    let dbQuery = supabase
      .from("audits")
      .select("id, url, status, score, created_at, completed_at, error_message", { count: 'exact' });

    // Apply filters
    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }

    if (search) {
      dbQuery = dbQuery.ilike('url', `%${search}%`);
    }

    // Apply sorting and pagination
    dbQuery = dbQuery
      .order(sortBy, { ascending: sortOrder })
      .range(offset, offset + limit - 1);

    const { data: audits, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    const totalPages = count ? Math.ceil(count / limit) : 1;

    return {
      success: true,
      data: audits || [],
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
    logger.error("Failed to list audits", { error });

    return {
      success: false,
      error: "Failed to retrieve audits",
      data: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      },
    };
  }
});
