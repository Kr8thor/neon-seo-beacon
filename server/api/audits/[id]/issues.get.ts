// Get all issues for an audit with filtering and pagination
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

  // Pagination and filter parameters
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 50));
  const offset = (page - 1) * limit;

  const severity = query.severity as string | undefined;
  const category = query.category as string | undefined;
  const sortBy = (query.sort_by as string) || 'severity';
  const sortOrder = (query.sort_order as string) === 'asc';

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Build query
    let dbQuery = supabase
      .from("audit_issues")
      .select("*", { count: 'exact' })
      .eq("audit_id", auditId);

    // Apply filters
    if (severity) {
      dbQuery = dbQuery.eq('severity', severity);
    }

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    // Custom sort order for severity
    if (sortBy === 'severity') {
      // Sort by severity priority: critical > high > medium > low > info
      dbQuery = dbQuery
        .order('severity', { ascending: sortOrder })
        .order('created_at', { ascending: false });
    } else {
      dbQuery = dbQuery.order(sortBy, { ascending: sortOrder });
    }

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data: issues, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    // Get severity breakdown
    const { data: severityCounts } = await supabase
      .from("audit_issues")
      .select("severity")
      .eq("audit_id", auditId);

    const severityBreakdown = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    severityCounts?.forEach((issue: any) => {
      if (issue.severity in severityBreakdown) {
        severityBreakdown[issue.severity as keyof typeof severityBreakdown]++;
      }
    });

    const totalPages = count ? Math.ceil(count / limit) : 1;

    return {
      success: true,
      data: issues || [],
      summary: {
        total: count || 0,
        by_severity: severityBreakdown,
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
    logger.error("Failed to fetch audit issues", { error, auditId });

    throw createError({
      statusCode: 500,
      message: "Failed to fetch audit issues",
    });
  }
});
