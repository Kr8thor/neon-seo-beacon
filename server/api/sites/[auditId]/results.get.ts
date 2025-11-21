// Get comprehensive audit results with pages, issues, and recommendations
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const auditId = getRouterParam(event, "auditId");

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

    // Get audit with related data
    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .select(`
        *,
        site:sites(*),
        pages:audit_pages(
          id,
          url,
          depth,
          status_code,
          score,
          issues_count,
          response_time,
          created_at
        ),
        issues:audit_issues(
          id,
          page_id,
          issue_id,
          severity,
          category,
          title,
          description,
          recommendation
        )
      `)
      .eq("id", auditId)
      .single();

    if (auditError) {
      if (auditError.code === "PGRST116") {
        throw createError({
          statusCode: 404,
          message: "Audit not found",
        });
      }
      throw auditError;
    }

    // Calculate summary statistics
    const pages = audit.pages || [];
    const issues = audit.issues || [];

    const summary = {
      totalPages: pages.length,
      averageScore: pages.length > 0
        ? Math.round(pages.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / pages.length)
        : 0,
      totalIssues: issues.length,
      issuesBySeverity: {
        critical: issues.filter((i: any) => i.severity === "critical").length,
        high: issues.filter((i: any) => i.severity === "high").length,
        medium: issues.filter((i: any) => i.severity === "medium").length,
        low: issues.filter((i: any) => i.severity === "low").length,
        info: issues.filter((i: any) => i.severity === "info").length,
      },
      issuesByCategory: issues.reduce((acc: any, issue: any) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1;
        return acc;
      }, {}),
    };

    // Get top issues (grouped by type)
    const issueGroups = new Map();
    for (const issue of issues) {
      const key = issue.issue_id;
      if (!issueGroups.has(key)) {
        issueGroups.set(key, {
          ...issue,
          count: 0,
          affectedPages: [],
        });
      }
      const group = issueGroups.get(key);
      group.count++;
      group.affectedPages.push(issue.page_id);
    }

    const topIssues = Array.from(issueGroups.values())
      .sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return b.count - a.count;
      })
      .slice(0, 20);

    // Build response
    const response = {
      success: true,
      data: {
        audit: {
          id: audit.id,
          url: audit.url,
          status: audit.status,
          score: audit.score,
          createdAt: audit.created_at,
          completedAt: audit.completed_at,
          processingTime: audit.processing_time_ms,
          config: audit.config,
        },
        site: audit.site,
        summary,
        topIssues,
        pages: pages.map((page: any) => ({
          id: page.id,
          url: page.url,
          depth: page.depth,
          statusCode: page.status_code,
          score: page.score,
          issuesCount: page.issues_count,
          responseTime: page.response_time,
        })),
        recommendations: audit.results?.recommendations || [],
        performance: audit.results?.performance || null,
      },
    };

    return response;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    logger.error("Failed to get audit results", { error, auditId });
    throw createError({
      statusCode: 500,
      message: "Failed to retrieve audit results",
    });
  }
});
