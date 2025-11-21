// Export audit data as CSV or JSON
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const auditId = getRouterParam(event, 'id');
  const query = getQuery(event);
  const format = (query.format as string) || 'csv';

  if (!auditId) {
    throw createError({
      statusCode: 400,
      message: "Audit ID is required",
    });
  }

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Get audit data
    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .select("*")
      .eq("id", auditId)
      .single();

    if (auditError || !audit) {
      throw createError({
        statusCode: 404,
        message: "Audit not found",
      });
    }

    // Get issues
    const { data: issues } = await supabase
      .from("audit_issues")
      .select("*")
      .eq("audit_id", auditId)
      .order("severity", { ascending: true });

    // Get pages
    const { data: pages } = await supabase
      .from("audit_pages")
      .select("*")
      .eq("audit_id", auditId);

    if (format === 'json') {
      setResponseHeader(event, 'Content-Type', 'application/json');
      setResponseHeader(event, 'Content-Disposition', `attachment; filename="audit-${auditId}.json"`);

      return {
        audit: {
          id: audit.id,
          url: audit.url,
          score: audit.score,
          status: audit.status,
          created_at: audit.created_at,
          completed_at: audit.completed_at,
        },
        issues: issues || [],
        pages: pages || [],
        results: audit.results,
      };
    }

    // CSV format
    const csvRows: string[] = [];

    // Audit summary
    csvRows.push('SEO Audit Report');
    csvRows.push(`URL,${audit.url}`);
    csvRows.push(`Score,${audit.score}`);
    csvRows.push(`Status,${audit.status}`);
    csvRows.push(`Date,${audit.created_at}`);
    csvRows.push('');

    // Issues section
    csvRows.push('Issues');
    csvRows.push('Severity,Category,Title,Description,Recommendation');

    (issues || []).forEach((issue: any) => {
      csvRows.push([
        issue.severity,
        issue.category,
        `"${(issue.title || '').replace(/"/g, '""')}"`,
        `"${(issue.description || '').replace(/"/g, '""')}"`,
        `"${(issue.recommendation || '').replace(/"/g, '""')}"`,
      ].join(','));
    });
    csvRows.push('');

    // Pages section
    if (pages && pages.length > 0) {
      csvRows.push('Pages Analyzed');
      csvRows.push('URL,Status Code,Title,Load Time (ms),Word Count');

      pages.forEach((page: any) => {
        csvRows.push([
          `"${page.url}"`,
          page.status_code,
          `"${(page.title || '').replace(/"/g, '""')}"`,
          page.load_time_ms || '',
          page.word_count || '',
        ].join(','));
      });
    }

    const csv = csvRows.join('\n');

    setResponseHeader(event, 'Content-Type', 'text/csv');
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="audit-${auditId}.csv"`);

    return csv;
  } catch (error: any) {
    if (error.statusCode) throw error;

    logger.error("Failed to export audit", { error, auditId });

    throw createError({
      statusCode: 500,
      message: "Failed to export audit",
    });
  }
});
