// Core Web Vitals and Performance Analysis via Google PageSpeed Insights API
import axios from "axios";
import { logger } from "./logger";

export interface CoreWebVitals {
  lcp: MetricResult; // Largest Contentful Paint
  fid: MetricResult; // First Input Delay
  cls: MetricResult; // Cumulative Layout Shift
  fcp: MetricResult; // First Contentful Paint
  ttfb: MetricResult; // Time to First Byte
  si: MetricResult; // Speed Index
  tbt: MetricResult; // Total Blocking Time
}

export interface MetricResult {
  value: number;
  score: number; // 0-100
  rating: "good" | "needs-improvement" | "poor";
  displayValue: string;
}

export interface PerformanceAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  details?: any;
}

export interface PageSpeedResult {
  url: string;
  fetchTime: string;
  strategy: "mobile" | "desktop";
  performanceScore: number;
  coreWebVitals: CoreWebVitals;
  audits: PerformanceAudit[];
  opportunities: PerformanceOpportunity[];
  diagnostics: PerformanceDiagnostic[];
}

export interface PerformanceOpportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  savings: string;
  details?: any;
}

export interface PerformanceDiagnostic {
  id: string;
  title: string;
  description: string;
  displayValue?: string;
  details?: any;
}

// Thresholds for Core Web Vitals ratings
const CWV_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 }, // ms
  fid: { good: 100, poor: 300 }, // ms
  cls: { good: 0.1, poor: 0.25 }, // unitless
  fcp: { good: 1800, poor: 3000 }, // ms
  ttfb: { good: 800, poor: 1800 }, // ms
  si: { good: 3400, poor: 5800 }, // ms
  tbt: { good: 200, poor: 600 }, // ms
};

function getRating(value: number, thresholds: { good: number; poor: number }): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

function calculateMetricScore(value: number, thresholds: { good: number; poor: number }): number {
  if (value <= thresholds.good) {
    return 90 + (10 * (1 - value / thresholds.good));
  }
  if (value <= thresholds.poor) {
    const range = thresholds.poor - thresholds.good;
    const position = value - thresholds.good;
    return 50 + (40 * (1 - position / range));
  }
  return Math.max(0, 50 - ((value - thresholds.poor) / thresholds.poor) * 50);
}

export async function analyzePageSpeed(
  url: string,
  strategy: "mobile" | "desktop" = "mobile",
  apiKey?: string
): Promise<PageSpeedResult> {
  const key = apiKey || process.env.GOOGLE_PAGESPEED_API_KEY;

  if (!key) {
    logger.warn("No PageSpeed API key configured, using limited API");
  }

  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("strategy", strategy);
  apiUrl.searchParams.set("category", "performance");
  apiUrl.searchParams.set("category", "accessibility");
  apiUrl.searchParams.set("category", "best-practices");
  apiUrl.searchParams.set("category", "seo");

  if (key) {
    apiUrl.searchParams.set("key", key);
  }

  try {
    logger.info(`Analyzing page speed for ${url} (${strategy})`);
    const startTime = Date.now();

    const response = await axios.get(apiUrl.toString(), {
      timeout: 60000, // 60 second timeout for PageSpeed API
    });

    const data = response.data;
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) {
      throw new Error("No Lighthouse results in PageSpeed response");
    }

    // Extract Core Web Vitals
    const audits = lighthouse.audits || {};

    const coreWebVitals: CoreWebVitals = {
      lcp: extractMetric(audits["largest-contentful-paint"], "lcp"),
      fid: extractMetric(audits["max-potential-fid"], "fid"),
      cls: extractMetric(audits["cumulative-layout-shift"], "cls"),
      fcp: extractMetric(audits["first-contentful-paint"], "fcp"),
      ttfb: extractMetric(audits["server-response-time"], "ttfb"),
      si: extractMetric(audits["speed-index"], "si"),
      tbt: extractMetric(audits["total-blocking-time"], "tbt"),
    };

    // Extract opportunities
    const opportunities: PerformanceOpportunity[] = [];
    const opportunityIds = [
      "render-blocking-resources",
      "unused-css-rules",
      "unused-javascript",
      "unminified-css",
      "unminified-javascript",
      "modern-image-formats",
      "uses-optimized-images",
      "uses-responsive-images",
      "efficient-animated-content",
      "offscreen-images",
    ];

    for (const id of opportunityIds) {
      const audit = audits[id];
      if (audit && audit.score !== null && audit.score < 1) {
        opportunities.push({
          id,
          title: audit.title,
          description: audit.description,
          score: Math.round(audit.score * 100),
          savings: audit.displayValue || "",
          details: audit.details,
        });
      }
    }

    // Extract diagnostics
    const diagnostics: PerformanceDiagnostic[] = [];
    const diagnosticIds = [
      "dom-size",
      "critical-request-chains",
      "mainthread-work-breakdown",
      "bootup-time",
      "font-display",
      "third-party-summary",
      "uses-long-cache-ttl",
    ];

    for (const id of diagnosticIds) {
      const audit = audits[id];
      if (audit) {
        diagnostics.push({
          id,
          title: audit.title,
          description: audit.description,
          displayValue: audit.displayValue,
          details: audit.details,
        });
      }
    }

    // Extract all relevant audits
    const performanceAudits: PerformanceAudit[] = Object.entries(audits)
      .filter(([_, audit]: [string, any]) => audit.score !== undefined)
      .map(([id, audit]: [string, any]) => ({
        id,
        title: audit.title,
        description: audit.description,
        score: audit.score !== null ? Math.round(audit.score * 100) : null,
        displayValue: audit.displayValue,
      }));

    const elapsed = Date.now() - startTime;
    logger.info(`PageSpeed analysis completed in ${elapsed}ms`, { url, strategy, score: lighthouse.categories?.performance?.score });

    return {
      url,
      fetchTime: lighthouse.fetchTime,
      strategy,
      performanceScore: Math.round((lighthouse.categories?.performance?.score || 0) * 100),
      coreWebVitals,
      audits: performanceAudits,
      opportunities: opportunities.sort((a, b) => a.score - b.score),
      diagnostics,
    };
  } catch (error: any) {
    logger.error("PageSpeed API error", { error, url, strategy });
    throw new Error(`Failed to analyze page speed: ${error.message}`);
  }
}

function extractMetric(
  audit: any,
  metricKey: keyof typeof CWV_THRESHOLDS
): MetricResult {
  if (!audit) {
    return {
      value: 0,
      score: 0,
      rating: "poor",
      displayValue: "N/A",
    };
  }

  const value = audit.numericValue || 0;
  const thresholds = CWV_THRESHOLDS[metricKey];
  const rating = getRating(value, thresholds);
  const score = Math.round(calculateMetricScore(value, thresholds));

  return {
    value,
    score,
    rating,
    displayValue: audit.displayValue || `${value}`,
  };
}

// Analyze both mobile and desktop
export async function analyzePageSpeedFull(
  url: string,
  apiKey?: string
): Promise<{ mobile: PageSpeedResult; desktop: PageSpeedResult }> {
  const [mobile, desktop] = await Promise.all([
    analyzePageSpeed(url, "mobile", apiKey),
    analyzePageSpeed(url, "desktop", apiKey),
  ]);

  return { mobile, desktop };
}

// Get performance recommendations based on results
export function getPerformanceRecommendations(result: PageSpeedResult): string[] {
  const recommendations: string[] = [];

  // Core Web Vitals recommendations
  if (result.coreWebVitals.lcp.rating !== "good") {
    recommendations.push(
      `Improve Largest Contentful Paint (${result.coreWebVitals.lcp.displayValue}): ` +
      "Optimize images, use a CDN, and preload critical resources."
    );
  }

  if (result.coreWebVitals.cls.rating !== "good") {
    recommendations.push(
      `Reduce Cumulative Layout Shift (${result.coreWebVitals.cls.displayValue}): ` +
      "Add dimensions to images and embeds, avoid inserting content above existing content."
    );
  }

  if (result.coreWebVitals.fcp.rating !== "good") {
    recommendations.push(
      `Improve First Contentful Paint (${result.coreWebVitals.fcp.displayValue}): ` +
      "Reduce server response time and eliminate render-blocking resources."
    );
  }

  if (result.coreWebVitals.tbt.rating !== "good") {
    recommendations.push(
      `Reduce Total Blocking Time (${result.coreWebVitals.tbt.displayValue}): ` +
      "Reduce JavaScript execution time and break up long tasks."
    );
  }

  // Opportunity-based recommendations
  for (const opportunity of result.opportunities.slice(0, 5)) {
    if (opportunity.savings) {
      recommendations.push(`${opportunity.title}: ${opportunity.savings}`);
    }
  }

  return recommendations;
}
