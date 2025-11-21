// BullMQ Worker for processing site crawl jobs
import { Worker, Job } from "bullmq";
import { createClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger";
import { getRedisConnection, QUEUE_NAMES, SiteCrawlJob, addPageAnalysisJob } from "../utils/queue";
import { WebCrawler, ExtractedPageData } from "../utils/crawler";
import { analyzePageSEO, aggregateSiteIssues } from "../utils/seoAnalyzer";
import { analyzePageSpeed } from "../utils/coreWebVitals";
import { generateAIRecommendations } from "../utils/aiRecommendations";

// Create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Process a site crawl job
async function processSiteCrawl(job: Job<SiteCrawlJob>): Promise<void> {
  const { siteId, url, userId, config } = job.data;
  const supabase = createSupabaseClient();

  logger.info(`Starting site crawl`, { jobId: job.id, siteId, url });

  // Get audit record
  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("id")
    .eq("site_id", siteId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (auditError || !audit) {
    throw new Error(`No pending audit found for site ${siteId}`);
  }

  const auditId = audit.id;

  try {
    // Update audit status to processing
    await supabase
      .from("audits")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", auditId);

    // Add initial progress
    await addProgress(supabase, auditId, 1, 5, "Initializing crawler...");

    // Create crawler and start crawling
    const crawler = new WebCrawler(url, config);
    const pages: Array<{ url: string; depth: number; data: ExtractedPageData }> = [];
    const pageAnalyses: any[] = [];
    let pagesProcessed = 0;

    await addProgress(supabase, auditId, 2, 5, "Crawling website...");

    // Crawl the site
    for await (const { url: pageUrl, depth, result, data } of crawler.crawlSite()) {
      if (!data) continue;

      pagesProcessed++;
      pages.push({ url: pageUrl, depth, data });

      // Store page in database
      const { data: pageRecord, error: pageError } = await supabase
        .from("audit_pages")
        .insert({
          audit_id: auditId,
          url: pageUrl,
          depth,
          status_code: result.statusCode,
          content_type: result.contentType,
          response_time: result.responseTime,
          data: {
            title: data.title,
            metaDescription: data.metaDescription,
            h1Tags: data.h1Tags,
            wordCount: data.wordCount,
            imageCount: data.images.length,
            internalLinks: data.links.internal.length,
            externalLinks: data.links.external.length,
          },
        })
        .select("id")
        .single();

      if (pageError) {
        logger.error("Failed to store page", { error: pageError, url: pageUrl });
        continue;
      }

      // Analyze the page
      const analysis = analyzePageSEO(data);
      pageAnalyses.push(analysis);

      // Update page score
      await supabase
        .from("audit_pages")
        .update({
          score: analysis.score.overall,
          issues_count: analysis.issues.length,
        })
        .eq("id", pageRecord.id);

      // Store issues
      if (analysis.issues.length > 0) {
        const issueRecords = analysis.issues.map(issue => ({
          audit_id: auditId,
          page_id: pageRecord.id,
          issue_id: issue.id,
          severity: issue.severity,
          category: issue.category,
          title: issue.title,
          description: issue.description,
          recommendation: issue.recommendation,
          impact: issue.impact,
          affected_element: issue.affectedElement,
          current_value: issue.currentValue,
          expected_value: issue.expectedValue,
        }));

        await supabase.from("audit_issues").insert(issueRecords);
      }

      // Update progress periodically
      if (pagesProcessed % 5 === 0) {
        await job.updateProgress(Math.min(40, (pagesProcessed / config.maxPages) * 40));
      }
    }

    await addProgress(supabase, auditId, 3, 5, `Analyzed ${pagesProcessed} pages`);

    // Aggregate results
    const { issuesByType, overallScore, pageScores } = aggregateSiteIssues(pageAnalyses);

    // Get Core Web Vitals for main page (if enabled)
    let performanceData = null;
    const auditConfig = config as any;
    if (auditConfig.includePerformance !== false) {
      await addProgress(supabase, auditId, 4, 5, "Analyzing Core Web Vitals...");
      try {
        const performance = await analyzePageSpeed(url, "mobile");
        performanceData = performance;

        // Store performance metrics
        await supabase.from("performance_metrics").insert({
          audit_id: auditId,
          strategy: "mobile",
          performance_score: performance.performanceScore,
          lcp_value: performance.coreWebVitals.lcp.value,
          lcp_score: performance.coreWebVitals.lcp.score,
          fcp_value: performance.coreWebVitals.fcp.value,
          fcp_score: performance.coreWebVitals.fcp.score,
          cls_value: performance.coreWebVitals.cls.value,
          cls_score: performance.coreWebVitals.cls.score,
          tbt_value: performance.coreWebVitals.tbt.value,
          tbt_score: performance.coreWebVitals.tbt.score,
          ttfb_value: performance.coreWebVitals.ttfb.value,
          opportunities: performance.opportunities,
          diagnostics: performance.diagnostics,
        });
      } catch (error) {
        logger.warn("Failed to get Core Web Vitals", { error, url });
      }
    }

    // Generate AI recommendations (if enabled)
    let recommendations = null;
    if (auditConfig.includeAIRecommendations !== false && pageAnalyses.length > 0) {
      await addProgress(supabase, auditId, 4, 5, "Generating AI recommendations...");
      try {
        const mainPageAnalysis = pageAnalyses[0];
        recommendations = await generateAIRecommendations(
          mainPageAnalysis,
          performanceData || undefined
        );
      } catch (error) {
        logger.warn("Failed to generate AI recommendations", { error });
      }
    }

    // Calculate processing time
    const processingTime = Date.now() - (job.processedOn || Date.now());

    // Update audit with final results
    await supabase
      .from("audits")
      .update({
        status: "completed",
        score: overallScore,
        results: {
          summary: {
            pagesAnalyzed: pagesProcessed,
            totalIssues: Array.from(issuesByType.values()).reduce((sum, i) => sum + i.count, 0),
            issuesBySeverity: {
              critical: Array.from(issuesByType.values()).filter(i => i.severity === "critical").length,
              high: Array.from(issuesByType.values()).filter(i => i.severity === "high").length,
              medium: Array.from(issuesByType.values()).filter(i => i.severity === "medium").length,
              low: Array.from(issuesByType.values()).filter(i => i.severity === "low").length,
            },
          },
          pageScores,
          performance: performanceData,
          recommendations,
        },
        processing_time_ms: processingTime,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", auditId);

    await addProgress(supabase, auditId, 5, 5, "Audit complete!");

    logger.info(`Site crawl completed`, {
      jobId: job.id,
      auditId,
      pagesProcessed,
      score: overallScore,
      processingTime,
    });

  } catch (error: any) {
    logger.error(`Site crawl failed`, { jobId: job.id, auditId, error });

    // Update audit with error
    await supabase
      .from("audits")
      .update({
        status: "failed",
        error: error.message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auditId);

    throw error;
  }
}

async function addProgress(
  supabase: any,
  auditId: string,
  step: number,
  totalSteps: number,
  message: string
): Promise<void> {
  await supabase.from("audit_progress").insert({
    audit_id: auditId,
    step,
    total_steps: totalSteps,
    message,
    created_at: new Date().toISOString(),
  });
}

// Create and start the worker
export function startSiteCrawlWorker(): Worker {
  const worker = new Worker<SiteCrawlJob>(
    QUEUE_NAMES.SITE_CRAWL,
    processSiteCrawl,
    {
      connection: getRedisConnection(),
      concurrency: 2, // Process 2 sites at a time
      limiter: {
        max: 10,
        duration: 60000, // Max 10 jobs per minute
      },
    }
  );

  worker.on("completed", (job) => {
    logger.info(`Site crawl job completed`, { jobId: job.id });
  });

  worker.on("failed", (job, error) => {
    logger.error(`Site crawl job failed`, { jobId: job?.id, error: error.message });
  });

  worker.on("error", (error) => {
    logger.error(`Site crawl worker error`, { error });
  });

  logger.info("Site crawl worker started");
  return worker;
}

// Export for use in server startup
export { processSiteCrawl };
