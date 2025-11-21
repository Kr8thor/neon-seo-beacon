// Improved background audit processing with proper job management and database integration
import type { H3Event } from "h3";
import { createClient } from "@supabase/supabase-js";
import { logger } from "./logger";

interface AuditJob {
  id: string;
  auditId: string;
  url: string;
  type: string;
  status: "pending" | "processing" | "completed" | "failed";
  attempts: number;
  maxAttempts: number;
  nextRetry?: number;
  error?: string;
  createdAt: number;
}

// In-memory job queue (use Redis/Bull in production)
const jobQueue: AuditJob[] = [];
const activeJobs = new Map<string, boolean>();
const maxConcurrentJobs = 3;

// Create Supabase client for database operations
function createSupabaseClient() {
  const config = useRuntimeConfig();
  return createClient(
    config.supabaseUrl || config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
  );
}

// Process jobs with retry logic and error handling
export async function processAuditQueue() {
  // Process pending jobs
  const pendingJobs = jobQueue
    .filter(
      (job) =>
        job.status === "pending" &&
        (job.nextRetry === undefined || job.nextRetry <= Date.now()),
    )
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, maxConcurrentJobs - activeJobs.size);

  for (const job of pendingJobs) {
    if (activeJobs.size >= maxConcurrentJobs) break;

    processJobAsync(job);
  }

  // Clean up completed/failed jobs older than 1 hour
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const indexesToRemove = jobQueue
    .map((job, index) => ({ job, index }))
    .filter(
      ({ job }) =>
        (job.status === "completed" || job.status === "failed") &&
        job.createdAt < oneHourAgo,
    )
    .map(({ index }) => index)
    .reverse(); // Remove from end to avoid index issues

  for (const index of indexesToRemove) {
    jobQueue.splice(index, 1);
  }
}

async function processJobAsync(job: AuditJob) {
  if (activeJobs.has(job.id)) return;

  activeJobs.set(job.id, true);
  job.status = "processing";
  job.attempts++;

  logger.info(
    `Audit processor starting job ${job.id} for audit ${job.auditId} (attempt ${job.attempts}/${job.maxAttempts})`,
  );

  const startTime = Date.now();

  try {
    // Update audit status to processing
    await updateAuditStatus(job.auditId, "processing");

    // Add progress tracking
    await addAuditProgress(job.auditId, 1, 5, "Starting SEO analysis...");

    // Perform SEO analysis using the existing API logic
    const analysisResult = await performSEOAnalysis(job.url);
    await addAuditProgress(job.auditId, 3, 5, "Analyzing page content...");

    // Generate AI-powered recommendations
    const recommendations = await generateRecommendations(analysisResult);
    await addAuditProgress(job.auditId, 4, 5, "Generating recommendations...");

    // Calculate final score
    const score = calculateSEOScore(analysisResult);
    const processingTime = Date.now() - startTime;

    const results = {
      ...analysisResult,
      recommendations,
      score,
      processingTime,
    };

    // Update audit with results
    await updateAuditResults(job.auditId, results, score, processingTime);
    await addAuditProgress(job.auditId, 5, 5, "Analysis complete!");

    job.status = "completed";
    logger.info(
      `Audit processor job ${job.id} completed successfully (score: ${score})`,
    );
  } catch (error: any) {
    logger.error(`Audit processor job ${job.id} failed`, { error });

    job.error = error.message;

    if (job.attempts >= job.maxAttempts) {
      // Mark as permanently failed
      job.status = "failed";
      await updateAuditStatus(job.auditId, "failed", error.message);
      await addAuditProgress(
        job.auditId,
        5,
        5,
        `Analysis failed: ${error.message}`,
      );
    } else {
      // Schedule retry with exponential backoff
      job.status = "pending";
      job.nextRetry = Date.now() + Math.pow(2, job.attempts - 1) * 5000; // 5s, 10s, 20s, 40s...
      logger.info(
        `Audit processor job ${job.id} will retry in ${(job.nextRetry - Date.now()) / 1000}s`,
      );
    }
  } finally {
    activeJobs.delete(job.id);
  }
}

export function addAuditJob(
  auditId: string,
  url: string,
  type: string = "full",
): string {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const job: AuditJob = {
    id: jobId,
    auditId,
    url,
    type,
    status: "pending",
    attempts: 0,
    maxAttempts: 3,
    createdAt: Date.now(),
  };

  jobQueue.push(job);
  logger.info(`Audit processor added job ${jobId} for audit ${auditId}`);

  // Start processing if needed
  setTimeout(() => processAuditQueue(), 100);

  return jobId;
}

export function getJobStatus(jobId: string): AuditJob | null {
  return jobQueue.find((job) => job.id === jobId) || null;
}

export function getQueueStats() {
  return {
    total: jobQueue.length,
    pending: jobQueue.filter((job) => job.status === "pending").length,
    processing: jobQueue.filter((job) => job.status === "processing").length,
    completed: jobQueue.filter((job) => job.status === "completed").length,
    failed: jobQueue.filter((job) => job.status === "failed").length,
    activeJobs: activeJobs.size,
  };
}

// Database helper functions - properly implemented
async function updateAuditStatus(
  auditId: string,
  status: string,
  error?: string,
) {
  try {
    const supabase = createSupabaseClient();
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (error) {
      updateData.error = error;
    }

    if (status === "completed" || status === "failed") {
      updateData.completed_at = new Date().toISOString();
    }

    const { error: dbError } = await supabase
      .from("audits")
      .update(updateData)
      .eq("id", auditId);

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    logger.info(`Audit processor updated audit ${auditId} status to ${status}`);
  } catch (error) {
    logger.error("Audit processor failed to update audit status", { error, auditId });
    throw error;
  }
}

async function addAuditProgress(
  auditId: string,
  step: number,
  totalSteps: number,
  message: string,
  data?: any,
) {
  try {
    const supabase = createSupabaseClient();

    const { error } = await supabase.from("audit_progress").insert({
      audit_id: auditId,
      step,
      total_steps: totalSteps,
      message,
      data: data || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    logger.debug(`Audit ${auditId} progress: ${step}/${totalSteps} - ${message}`);
  } catch (error) {
    logger.error("Audit processor failed to add progress", { error, auditId });
    // Don't throw here - progress tracking failures shouldn't stop the audit
  }
}

async function performSEOAnalysis(url: string) {
  // Import and use the existing SEO analysis logic
  const axios = require("axios");
  const cheerio = require("cheerio");

  logger.info(`Audit processor performing SEO analysis for ${url}`);

  try {
    // Fetch the webpage
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        "User-Agent":
          "Marden SEO Audit Bot/2.0 (+https://audit.mardenseo.com/bot)",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Basic page analysis
    const analysis = {
      url,
      title: $("title").text() || "",
      metaDescription: $('meta[name="description"]').attr("content") || "",
      h1Tags: $("h1")
        .map((i: number, el: any) => $(el).text())
        .get(),
      h2Tags: $("h2")
        .map((i: number, el: any) => $(el).text())
        .get(),
      metaTags: extractMetaTags($),
      images: analyzeImages($),
      links: analyzeLinks($, url),
      performance: await analyzePerformance(url),
      technical: analyzeTechnicalSEO($, html),
      score: 0, // Will be calculated later
      processingTime: 0,
    };

    return analysis;
  } catch (error) {
    throw new Error(`Failed to analyze ${url}: ${(error as Error).message}`);
  }
}

// Helper functions for SEO analysis (simplified versions)
function extractMetaTags($: any): Record<string, string> {
  const metaTags: Record<string, string> = {};

  $("meta").each((i: number, element: any) => {
    const name = $(element).attr("name") || $(element).attr("property");
    const content = $(element).attr("content");

    if (name && content) {
      metaTags[name] = content;
    }
  });

  return metaTags;
}

function analyzeImages($: any) {
  const images: any[] = [];

  $("img").each((i: number, element: any) => {
    const src = $(element).attr("src");
    const alt = $(element).attr("alt");
    const title = $(element).attr("title");

    images.push({
      src,
      alt: alt || "",
      title: title || "",
      hasAlt: !!alt,
      hasTitle: !!title,
    });
  });

  return {
    total: images.length,
    withAlt: images.filter((img) => img.hasAlt).length,
    withoutAlt: images.filter((img) => !img.hasAlt).length,
    images: images.slice(0, 50),
  };
}

function analyzeLinks($: any, baseUrl: string) {
  const links = {
    internal: 0,
    external: 0,
    nofollow: 0,
    total: 0,
  };

  $("a[href]").each((i: number, element: any) => {
    const href = $(element).attr("href");
    const rel = $(element).attr("rel");

    if (href) {
      links.total++;

      if (rel && rel.includes("nofollow")) {
        links.nofollow++;
      }

      try {
        const baseHostname = new URL(baseUrl).hostname;
        if (href.startsWith("http") && !href.includes(baseHostname)) {
          links.external++;
        } else if (!href.startsWith("http") || href.includes(baseHostname)) {
          links.internal++;
        }
      } catch (error) {
        // Invalid URL, skip
      }
    }
  });

  return links;
}

async function analyzePerformance(url: string) {
  const axios = require("axios");
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 5,
      headers: {
        "User-Agent": "Marden SEO Audit Performance Bot/2.0",
      },
    });
    const loadTime = Date.now() - startTime;

    return {
      loadTime,
      status: response.status,
      size: response.headers["content-length"] || 0,
      compression: response.headers["content-encoding"] || "none",
    };
  } catch (error) {
    return {
      loadTime: Date.now() - startTime,
      status: "error",
      error: (error as Error).message,
    };
  }
}

function analyzeTechnicalSEO($: any, html: string) {
  return {
    hasRobotsMeta: !!$('meta[name="robots"]').length,
    hasCanonical: !!$('link[rel="canonical"]').length,
    hasViewport: !!$('meta[name="viewport"]').length,
    hasCharset: /charset=/i.test(html),
    hasLangAttribute: !!$("html[lang]").length,
    structuredData: analyzeStructuredData($),
    openGraph: analyzeOpenGraph($),
    twitterCard: analyzeTwitterCard($),
  };
}

function analyzeStructuredData($: any) {
  const structuredData: any[] = [];

  $('script[type="application/ld+json"]').each((i: number, element: any) => {
    try {
      const data = JSON.parse($(element).html() || "{}");
      structuredData.push(data);
    } catch (error) {
      // Invalid JSON
    }
  });

  return {
    count: structuredData.length,
    types: structuredData.map((data) => data["@type"]).filter(Boolean),
  };
}

function analyzeOpenGraph($: any): Record<string, string> {
  const ogTags: Record<string, string> = {};

  $('meta[property^="og:"]').each((i: number, element: any) => {
    const property = $(element).attr("property");
    const content = $(element).attr("content");

    if (property && content) {
      ogTags[property] = content;
    }
  });

  return ogTags;
}

function analyzeTwitterCard($: any): Record<string, string> {
  const twitterTags: Record<string, string> = {};

  $('meta[name^="twitter:"]').each((i: number, element: any) => {
    const name = $(element).attr("name");
    const content = $(element).attr("content");

    if (name && content) {
      twitterTags[name] = content;
    }
  });

  return twitterTags;
}

async function generateRecommendations(analysisResult: any) {
  logger.info("Audit processor generating AI recommendations");

  // Placeholder for AI recommendations - can integrate Claude API here
  const recommendations = [];

  // Title recommendations
  if (!analysisResult.title) {
    recommendations.push({
      category: "Title Tag",
      priority: "high",
      issue: "Missing title tag",
      recommendation: "Add a descriptive title tag between 30-60 characters",
      impact: "High SEO impact",
    });
  } else if (
    analysisResult.title.length < 30 ||
    analysisResult.title.length > 60
  ) {
    recommendations.push({
      category: "Title Tag",
      priority: "medium",
      issue: "Title length not optimal",
      recommendation:
        "Optimize title length to 30-60 characters for better search visibility",
      impact: "Medium SEO impact",
    });
  }

  // Meta description recommendations
  if (!analysisResult.metaDescription) {
    recommendations.push({
      category: "Meta Description",
      priority: "high",
      issue: "Missing meta description",
      recommendation:
        "Add a compelling meta description between 120-160 characters",
      impact: "High SEO impact",
    });
  }

  // Image alt text recommendations
  if (analysisResult.images && analysisResult.images.withoutAlt > 0) {
    recommendations.push({
      category: "Image SEO",
      priority: "medium",
      issue: `${analysisResult.images.withoutAlt} images missing alt text`,
      recommendation:
        "Add descriptive alt text to all images for accessibility and SEO",
      impact: "Medium SEO impact",
    });
  }

  // Technical SEO recommendations
  if (!analysisResult.technical.hasViewport) {
    recommendations.push({
      category: "Technical SEO",
      priority: "high",
      issue: "Missing viewport meta tag",
      recommendation: "Add viewport meta tag for mobile responsiveness",
      impact: "High mobile SEO impact",
    });
  }

  return recommendations;
}

function calculateSEOScore(analysisResult: any): number {
  let score = 0;
  const maxScore = 100;

  // Title tag (15 points)
  if (analysisResult.title) {
    if (
      analysisResult.title.length >= 30 &&
      analysisResult.title.length <= 60
    ) {
      score += 15;
    } else if (analysisResult.title.length > 0) {
      score += 8;
    }
  }

  // Meta description (15 points)
  if (analysisResult.metaDescription) {
    if (
      analysisResult.metaDescription.length >= 120 &&
      analysisResult.metaDescription.length <= 160
    ) {
      score += 15;
    } else if (analysisResult.metaDescription.length > 0) {
      score += 8;
    }
  }

  // H1 tags (10 points)
  if (analysisResult.h1Tags && analysisResult.h1Tags.length === 1) {
    score += 10;
  } else if (analysisResult.h1Tags && analysisResult.h1Tags.length > 1) {
    score += 5;
  }

  // Images with alt text (10 points)
  if (analysisResult.images) {
    const altPercentage =
      analysisResult.images.total > 0
        ? (analysisResult.images.withAlt / analysisResult.images.total) * 100
        : 100;
    score += Math.round((altPercentage / 100) * 10);
  }

  // Technical SEO (25 points)
  const technical = analysisResult.technical;
  if (technical.hasViewport) score += 5;
  if (technical.hasCanonical) score += 5;
  if (technical.hasCharset) score += 3;
  if (technical.hasLangAttribute) score += 3;
  if (technical.structuredData && technical.structuredData.count > 0)
    score += 5;
  if (technical.openGraph && Object.keys(technical.openGraph).length > 3)
    score += 4;

  // Performance (15 points)
  if (analysisResult.performance && analysisResult.performance.loadTime) {
    if (analysisResult.performance.loadTime < 2000) {
      score += 15;
    } else if (analysisResult.performance.loadTime < 4000) {
      score += 10;
    } else if (analysisResult.performance.loadTime < 6000) {
      score += 5;
    }
  }

  // Content structure (10 points)
  if (analysisResult.h2Tags && analysisResult.h2Tags.length > 0) score += 5;
  if (analysisResult.links && analysisResult.links.internal > 0) score += 5;

  return Math.min(score, maxScore);
}

async function updateAuditResults(
  auditId: string,
  results: any,
  score: number,
  processingTime: number,
) {
  try {
    const supabase = createSupabaseClient();

    const { error } = await supabase
      .from("audits")
      .update({
        status: "completed",
        score,
        results,
        processing_time_ms: processingTime,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", auditId);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    logger.info(`Audit processor updated audit ${auditId} with results (score: ${score})`);
  } catch (error) {
    logger.error("Audit processor failed to update audit results", { error, auditId });
    throw error;
  }
}

// Start the queue processor
if (process.env.NODE_ENV !== "test") {
  setInterval(processAuditQueue, 5000); // Process queue every 5 seconds
  logger.info("Audit processor queue processor started");
}
