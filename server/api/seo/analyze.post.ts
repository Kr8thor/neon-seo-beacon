import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";
import { UAParser } from "ua-parser-js";
import { createClient } from "@supabase/supabase-js";
import { withCircuitBreaker } from "~/server/utils/circuitBreaker";
import { logger } from "~/server/utils/logger";

// Request validation schema
const analyzeSchema = z.object({
  url: z.string().url("Invalid URL format"),
  options: z
    .object({
      includeImages: z.boolean().default(true),
      checkMobile: z.boolean().default(true),
      includePerformance: z.boolean().default(true),
      save: z.boolean().default(false), // Save results to database
    })
    .default({}),
});

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig();

  try {
    // Validate request body
    const body = await readBody(event);
    const { url, options } = analyzeSchema.parse(body);

    // Basic SEO analysis with circuit breaker
    const analysis = await withCircuitBreaker(
      "seo-analysis",
      () => performSEOAnalysis(url, options),
      {
        failureThreshold: 3,
        timeout: 30000,
        fallbackFunction: async () => ({
          url,
          title: "Analysis Unavailable",
          metaDescription: "",
          h1Tags: [],
          h2Tags: [],
          metaTags: {},
          images: null,
          links: { internal: 0, external: 0, nofollow: 0, total: 0 },
          performance: null,
          technical: {
            hasRobotsMeta: false,
            hasCanonical: false,
            hasViewport: false,
            hasCharset: false,
            hasLangAttribute: false,
            structuredData: { count: 0, types: [] },
            openGraph: {},
            twitterCard: {},
          },
          score: 0,
          processingTime: 0,
          error: "SEO analysis service temporarily unavailable",
        }),
      },
    );

    // Save to database if requested
    let auditId = null;
    if (options.save) {
      const supabase = createClient(
        config.supabaseUrl || config.public.supabaseUrl,
        config.supabaseServiceRoleKey
      );

      // Create audit record
      const { data: audit, error: auditError } = await supabase
        .from("audits")
        .insert({
          url,
          status: "completed",
          score: analysis.score,
          results: analysis,
          completed_at: new Date().toISOString(),
          metadata: { source: "quick_analyze", options },
        })
        .select("id")
        .single();

      if (auditError) {
        logger.error("Failed to save audit", { error: auditError });
      } else {
        auditId = audit.id;

        // Save issues based on analysis
        const issues = generateIssuesFromAnalysis(analysis, auditId);
        if (issues.length > 0) {
          await supabase.from("audit_issues").insert(issues);
        }

        // Save performance metrics if available
        if (analysis.performance && analysis.performance.loadTime) {
          await supabase.from("performance_metrics").insert({
            audit_id: auditId,
            url,
            ttfb: Math.round(analysis.performance.loadTime * 0.3),
            fcp: Math.round(analysis.performance.loadTime * 0.5),
            lcp: analysis.performance.loadTime,
            load_time: analysis.performance.loadTime,
          });
        }
      }
    }

    // Return results
    return {
      success: true,
      data: analysis,
      audit_id: auditId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("SEO analysis error", error);

    if (error instanceof z.ZodError) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: "Invalid request data",
        details: error.errors,
      };
    }

    setResponseStatus(event, 500);
    return {
      success: false,
      error: "Analysis failed",
      message: (error as Error).message,
    };
  }
});

// Generate issues from analysis results
function generateIssuesFromAnalysis(analysis: any, auditId: string) {
  const issues: any[] = [];

  // Title issues
  if (!analysis.title) {
    issues.push({
      audit_id: auditId,
      category: "content",
      severity: "critical",
      rule_id: "missing-title",
      title: "Missing page title",
      description: "The page has no title tag defined.",
      recommendation: "Add a descriptive title tag between 30-60 characters.",
    });
  } else if (analysis.title.length < 30) {
    issues.push({
      audit_id: auditId,
      category: "content",
      severity: "medium",
      rule_id: "short-title",
      title: "Title tag is too short",
      description: `Title is only ${analysis.title.length} characters.`,
      recommendation: "Expand the title to at least 30 characters for better SEO.",
    });
  } else if (analysis.title.length > 60) {
    issues.push({
      audit_id: auditId,
      category: "content",
      severity: "low",
      rule_id: "long-title",
      title: "Title tag is too long",
      description: `Title is ${analysis.title.length} characters and may be truncated.`,
      recommendation: "Shorten the title to under 60 characters.",
    });
  }

  // Meta description issues
  if (!analysis.metaDescription) {
    issues.push({
      audit_id: auditId,
      category: "content",
      severity: "high",
      rule_id: "missing-meta-description",
      title: "Missing meta description",
      description: "The page has no meta description.",
      recommendation: "Add a meta description between 120-160 characters.",
    });
  }

  // H1 issues
  if (analysis.h1Tags.length === 0) {
    issues.push({
      audit_id: auditId,
      category: "content",
      severity: "high",
      rule_id: "missing-h1",
      title: "Missing H1 heading",
      description: "The page has no H1 heading.",
      recommendation: "Add exactly one H1 heading that describes the page content.",
    });
  } else if (analysis.h1Tags.length > 1) {
    issues.push({
      audit_id: auditId,
      category: "content",
      severity: "medium",
      rule_id: "multiple-h1",
      title: "Multiple H1 headings",
      description: `The page has ${analysis.h1Tags.length} H1 headings.`,
      recommendation: "Use only one H1 heading per page.",
    });
  }

  // Image alt issues
  if (analysis.images && analysis.images.withoutAlt > 0) {
    issues.push({
      audit_id: auditId,
      category: "accessibility",
      severity: analysis.images.withoutAlt > 5 ? "high" : "medium",
      rule_id: "images-missing-alt",
      title: "Images missing alt text",
      description: `${analysis.images.withoutAlt} of ${analysis.images.total} images are missing alt text.`,
      recommendation: "Add descriptive alt text to all images.",
    });
  }

  // Technical SEO issues
  if (!analysis.technical.hasViewport) {
    issues.push({
      audit_id: auditId,
      category: "technical",
      severity: "high",
      rule_id: "missing-viewport",
      title: "Missing viewport meta tag",
      description: "The page has no viewport meta tag for mobile responsiveness.",
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
    });
  }

  if (!analysis.technical.hasCanonical) {
    issues.push({
      audit_id: auditId,
      category: "technical",
      severity: "medium",
      rule_id: "missing-canonical",
      title: "Missing canonical URL",
      description: "The page has no canonical URL defined.",
      recommendation: "Add a canonical link to prevent duplicate content issues.",
    });
  }

  // Performance issues
  if (analysis.performance && analysis.performance.loadTime > 4000) {
    issues.push({
      audit_id: auditId,
      category: "performance",
      severity: analysis.performance.loadTime > 6000 ? "critical" : "high",
      rule_id: "slow-load-time",
      title: "Slow page load time",
      description: `Page took ${analysis.performance.loadTime}ms to load.`,
      recommendation: "Optimize images, enable compression, and reduce server response time.",
    });
  }

  return issues;
}

async function performSEOAnalysis(url: string, options: any) {
  const startTime = Date.now();

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
        .map((i, el) => $(el).text())
        .get(),
      h2Tags: $("h2")
        .map((i, el) => $(el).text())
        .get(),
      metaTags: extractMetaTags($),
      images: options.includeImages ? analyzeImages($) : null,
      links: analyzeLinks($, url),
      performance: options.includePerformance
        ? await analyzePerformance(url)
        : null,
      technical: analyzeTechnicalSEO($, html),
      score: 0, // Will be calculated
      processingTime: Date.now() - startTime,
    };

    // Calculate SEO score
    analysis.score = calculateSEOScore(analysis);

    return analysis;
  } catch (error) {
    throw new Error(`Failed to analyze ${url}: ${(error as Error).message}`);
  }
}

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
    images: images.slice(0, 50), // Limit to first 50 images
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

      if (
        href.startsWith("http") &&
        !href.includes(new URL(baseUrl).hostname)
      ) {
        links.external++;
      } else if (
        !href.startsWith("http") ||
        href.includes(new URL(baseUrl).hostname)
      ) {
        links.internal++;
      }
    }
  });

  return links;
}

async function analyzePerformance(url: string) {
  return withCircuitBreaker(
    "performance-analysis",
    async () => {
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
    },
    {
      failureThreshold: 5,
      timeout: 15000,
      fallbackFunction: async () => ({
        loadTime: null,
        status: "unavailable",
        error: "Performance analysis temporarily unavailable",
      }),
    },
  );
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

function calculateSEOScore(analysis: any) {
  let score = 0;
  const maxScore = 100;

  // Title tag (15 points)
  if (analysis.title) {
    if (analysis.title.length >= 30 && analysis.title.length <= 60) {
      score += 15;
    } else if (analysis.title.length > 0) {
      score += 8;
    }
  }

  // Meta description (15 points)
  if (analysis.metaDescription) {
    if (
      analysis.metaDescription.length >= 120 &&
      analysis.metaDescription.length <= 160
    ) {
      score += 15;
    } else if (analysis.metaDescription.length > 0) {
      score += 8;
    }
  }

  // H1 tags (10 points)
  if (analysis.h1Tags.length === 1) {
    score += 10;
  } else if (analysis.h1Tags.length > 1) {
    score += 5;
  }

  // Images with alt text (10 points)
  if (analysis.images) {
    const altPercentage =
      analysis.images.total > 0
        ? (analysis.images.withAlt / analysis.images.total) * 100
        : 100;
    score += Math.round((altPercentage / 100) * 10);
  }

  // Technical SEO (25 points)
  const technical = analysis.technical;
  if (technical.hasViewport) score += 5;
  if (technical.hasCanonical) score += 5;
  if (technical.hasCharset) score += 3;
  if (technical.hasLangAttribute) score += 3;
  if (technical.structuredData.count > 0) score += 5;
  if (Object.keys(technical.openGraph).length > 3) score += 4;

  // Performance (15 points)
  if (analysis.performance && analysis.performance.loadTime) {
    if (analysis.performance.loadTime < 2000) {
      score += 15;
    } else if (analysis.performance.loadTime < 4000) {
      score += 10;
    } else if (analysis.performance.loadTime < 6000) {
      score += 5;
    }
  }

  // Content structure (10 points)
  if (analysis.h2Tags.length > 0) score += 5;
  if (analysis.links.internal > 0) score += 5;

  return Math.min(score, maxScore);
}
