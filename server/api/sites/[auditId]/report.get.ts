// Generate PDF report for audit results
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const auditId = getRouterParam(event, "auditId");
  const query = getQuery(event);
  const format = (query.format as string) || "json";

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
      .select(`
        *,
        site:sites(url, name)
      `)
      .eq("id", auditId)
      .single();

    if (auditError || !audit) {
      throw createError({
        statusCode: 404,
        message: "Audit not found",
      });
    }

    // Get pages
    const { data: pages } = await supabase
      .from("audit_pages")
      .select("url, score, issues_count, response_time")
      .eq("audit_id", auditId)
      .order("score", { ascending: true });

    // Get issues grouped
    const { data: issues } = await supabase
      .from("audit_issues")
      .select("issue_id, severity, category, title, description, recommendation")
      .eq("audit_id", auditId);

    // Group issues by type
    const issueGroups = new Map();
    for (const issue of issues || []) {
      if (!issueGroups.has(issue.issue_id)) {
        issueGroups.set(issue.issue_id, { ...issue, count: 0 });
      }
      issueGroups.get(issue.issue_id).count++;
    }

    const groupedIssues = Array.from(issueGroups.values())
      .sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        return (order[a.severity] || 5) - (order[b.severity] || 5);
      });

    // Build report data
    const report = {
      generatedAt: new Date().toISOString(),
      audit: {
        id: audit.id,
        url: audit.url,
        score: audit.score,
        status: audit.status,
        createdAt: audit.created_at,
        completedAt: audit.completed_at,
        processingTime: audit.processing_time_ms,
      },
      summary: {
        totalPages: pages?.length || 0,
        totalIssues: issues?.length || 0,
        issuesBySeverity: {
          critical: groupedIssues.filter(i => i.severity === "critical").length,
          high: groupedIssues.filter(i => i.severity === "high").length,
          medium: groupedIssues.filter(i => i.severity === "medium").length,
          low: groupedIssues.filter(i => i.severity === "low").length,
          info: groupedIssues.filter(i => i.severity === "info").length,
        },
      },
      issues: groupedIssues,
      pages: pages || [],
      recommendations: audit.results?.recommendations || null,
      performance: audit.results?.performance || null,
    };

    // Return based on format
    if (format === "pdf") {
      // For PDF, we'll generate HTML and let client handle PDF conversion
      // Or use a service like Puppeteer
      const html = generateReportHTML(report);

      setHeader(event, "Content-Type", "text/html");
      setHeader(event, "Content-Disposition", `attachment; filename="seo-report-${auditId}.html"`);

      return html;
    }

    // JSON format
    return {
      success: true,
      data: report,
    };

  } catch (error: any) {
    if (error.statusCode) throw error;

    logger.error("Failed to generate report", { error, auditId });
    throw createError({
      statusCode: 500,
      message: "Failed to generate report",
    });
  }
});

function generateReportHTML(report: any): string {
  const severityColors: Record<string, string> = {
    critical: "#dc2626",
    high: "#ea580c",
    medium: "#ca8a04",
    low: "#2563eb",
    info: "#6b7280",
  };

  const scoreColor = report.audit.score >= 80 ? "#16a34a" :
                     report.audit.score >= 60 ? "#ca8a04" :
                     report.audit.score >= 40 ? "#ea580c" : "#dc2626";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Audit Report - ${report.audit.url}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    h2 { font-size: 20px; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
    h3 { font-size: 16px; margin: 16px 0 8px; }
    .header { margin-bottom: 40px; }
    .url { color: #6b7280; font-size: 14px; }
    .date { color: #9ca3af; font-size: 12px; margin-top: 4px; }
    .score-card { background: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0; display: flex; align-items: center; gap: 24px; }
    .score { font-size: 48px; font-weight: 700; color: ${scoreColor}; }
    .score-label { font-size: 14px; color: #6b7280; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .stat { background: #f9fafb; padding: 16px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: 600; }
    .stat-label { font-size: 12px; color: #6b7280; }
    .issue { padding: 16px; border-left: 4px solid; margin: 12px 0; background: #f9fafb; }
    .issue-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .severity { font-size: 11px; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; color: white; }
    .issue-title { font-weight: 600; }
    .issue-desc { font-size: 14px; color: #4b5563; margin: 8px 0; }
    .issue-rec { font-size: 14px; color: #4f46e5; }
    .issue-count { font-size: 12px; color: #6b7280; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
    @media print { body { padding: 20px; } .issue { break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>SEO Audit Report</h1>
    <div class="url">${report.audit.url}</div>
    <div class="date">Generated: ${new Date(report.generatedAt).toLocaleString()}</div>
  </div>

  <div class="score-card">
    <div>
      <div class="score">${report.audit.score || 0}</div>
      <div class="score-label">Overall Score</div>
    </div>
    <div>
      <p><strong>${report.summary.totalPages}</strong> pages analyzed</p>
      <p><strong>${report.summary.totalIssues}</strong> issues found</p>
    </div>
  </div>

  <h2>Issues Summary</h2>
  <div class="stats">
    <div class="stat">
      <div class="stat-value" style="color: ${severityColors.critical}">${report.summary.issuesBySeverity.critical}</div>
      <div class="stat-label">Critical</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color: ${severityColors.high}">${report.summary.issuesBySeverity.high}</div>
      <div class="stat-label">High</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color: ${severityColors.medium}">${report.summary.issuesBySeverity.medium}</div>
      <div class="stat-label">Medium</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color: ${severityColors.low}">${report.summary.issuesBySeverity.low}</div>
      <div class="stat-label">Low</div>
    </div>
  </div>

  <h2>Issues Found</h2>
  ${report.issues.map((issue: any) => `
    <div class="issue" style="border-color: ${severityColors[issue.severity]}">
      <div class="issue-header">
        <span class="severity" style="background: ${severityColors[issue.severity]}">${issue.severity}</span>
        <span class="issue-title">${issue.title}</span>
        <span class="issue-count">(${issue.count} ${issue.count === 1 ? 'page' : 'pages'})</span>
      </div>
      <div class="issue-desc">${issue.description || ''}</div>
      <div class="issue-rec">${issue.recommendation || ''}</div>
    </div>
  `).join('')}

  <h2>Pages Analyzed</h2>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Score</th>
        <th>Issues</th>
        <th>Response Time</th>
      </tr>
    </thead>
    <tbody>
      ${report.pages.map((page: any) => `
        <tr>
          <td>${page.url}</td>
          <td>${page.score || '-'}</td>
          <td>${page.issues_count || 0}</td>
          <td>${page.response_time || '-'}ms</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated by Neon SEO Beacon</p>
  </div>
</body>
</html>`;
}
