// Comprehensive SEO analysis with issue detection and scoring
import { ExtractedPageData } from "./crawler";
import { logger } from "./logger";

export type IssueSeverity = "critical" | "high" | "medium" | "low" | "info";
export type IssueCategory =
  | "title"
  | "meta"
  | "headings"
  | "content"
  | "images"
  | "links"
  | "technical"
  | "performance"
  | "mobile"
  | "structured-data"
  | "social";

export interface SEOIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  description: string;
  recommendation: string;
  impact: string;
  affectedElement?: string;
  currentValue?: string;
  expectedValue?: string;
}

export interface SEOScore {
  overall: number;
  categories: {
    title: number;
    meta: number;
    headings: number;
    content: number;
    images: number;
    links: number;
    technical: number;
    performance: number;
    social: number;
  };
}

export interface PageAnalysis {
  url: string;
  score: SEOScore;
  issues: SEOIssue[];
  passedChecks: string[];
  metrics: PageMetrics;
}

export interface PageMetrics {
  titleLength: number;
  metaDescriptionLength: number;
  h1Count: number;
  wordCount: number;
  imageCount: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  responseTime: number;
  contentLength: number;
  structuredDataCount: number;
}

export function analyzePageSEO(pageData: ExtractedPageData): PageAnalysis {
  const issues: SEOIssue[] = [];
  const passedChecks: string[] = [];

  // Calculate metrics
  const metrics: PageMetrics = {
    titleLength: pageData.title.length,
    metaDescriptionLength: pageData.metaDescription.length,
    h1Count: pageData.h1Tags.length,
    wordCount: pageData.wordCount,
    imageCount: pageData.images.length,
    imagesWithAlt: pageData.images.filter(img => img.alt).length,
    imagesWithoutAlt: pageData.images.filter(img => !img.alt).length,
    internalLinks: pageData.links.internal.length,
    externalLinks: pageData.links.external.length,
    responseTime: pageData.responseTime,
    contentLength: pageData.contentLength,
    structuredDataCount: pageData.structuredData.length,
  };

  // Run all checks
  checkTitle(pageData, issues, passedChecks);
  checkMetaDescription(pageData, issues, passedChecks);
  checkHeadings(pageData, issues, passedChecks);
  checkContent(pageData, issues, passedChecks);
  checkImages(pageData, issues, passedChecks);
  checkLinks(pageData, issues, passedChecks);
  checkTechnical(pageData, issues, passedChecks);
  checkPerformance(pageData, issues, passedChecks);
  checkSocial(pageData, issues, passedChecks);
  checkStructuredData(pageData, issues, passedChecks);

  // Calculate scores
  const score = calculateScores(issues, passedChecks);

  return {
    url: pageData.url,
    score,
    issues,
    passedChecks,
    metrics,
  };
}

function checkTitle(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  // Missing title
  if (!data.title) {
    issues.push({
      id: "title-missing",
      category: "title",
      severity: "critical",
      title: "Missing title tag",
      description: "The page has no title tag.",
      recommendation: "Add a unique, descriptive title tag between 30-60 characters.",
      impact: "Title tags are one of the most important on-page SEO factors.",
    });
    return;
  }

  // Title too short
  if (data.title.length < 30) {
    issues.push({
      id: "title-too-short",
      category: "title",
      severity: "high",
      title: "Title tag too short",
      description: `Title is only ${data.title.length} characters.`,
      recommendation: "Expand the title to 30-60 characters with relevant keywords.",
      impact: "Short titles may not fully describe the page content to search engines.",
      currentValue: data.title,
      expectedValue: "30-60 characters",
    });
  } else if (data.title.length > 60) {
    issues.push({
      id: "title-too-long",
      category: "title",
      severity: "medium",
      title: "Title tag too long",
      description: `Title is ${data.title.length} characters and may be truncated.`,
      recommendation: "Shorten the title to under 60 characters.",
      impact: "Long titles get truncated in search results, reducing click-through rates.",
      currentValue: data.title,
      expectedValue: "30-60 characters",
    });
  } else {
    passed.push("Title tag length is optimal (30-60 characters)");
  }

  // Check for keyword stuffing
  const words = data.title.toLowerCase().split(/\s+/);
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    if (word.length > 3) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });
  const maxFreq = Math.max(...wordFreq.values(), 0);
  if (maxFreq > 2) {
    issues.push({
      id: "title-keyword-stuffing",
      category: "title",
      severity: "medium",
      title: "Potential keyword stuffing in title",
      description: "The same word appears multiple times in the title.",
      recommendation: "Use natural language and avoid repeating keywords.",
      impact: "Keyword stuffing can be seen as spam by search engines.",
      currentValue: data.title,
    });
  }
}

function checkMetaDescription(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  if (!data.metaDescription) {
    issues.push({
      id: "meta-description-missing",
      category: "meta",
      severity: "high",
      title: "Missing meta description",
      description: "The page has no meta description.",
      recommendation: "Add a compelling meta description between 120-160 characters.",
      impact: "Meta descriptions appear in search results and influence click-through rates.",
    });
    return;
  }

  if (data.metaDescription.length < 120) {
    issues.push({
      id: "meta-description-too-short",
      category: "meta",
      severity: "medium",
      title: "Meta description too short",
      description: `Meta description is only ${data.metaDescription.length} characters.`,
      recommendation: "Expand to 120-160 characters with a clear call-to-action.",
      impact: "Short descriptions may not provide enough information to users.",
      currentValue: data.metaDescription,
      expectedValue: "120-160 characters",
    });
  } else if (data.metaDescription.length > 160) {
    issues.push({
      id: "meta-description-too-long",
      category: "meta",
      severity: "low",
      title: "Meta description too long",
      description: `Meta description is ${data.metaDescription.length} characters.`,
      recommendation: "Shorten to under 160 characters to avoid truncation.",
      impact: "Long descriptions get truncated in search results.",
      currentValue: data.metaDescription,
      expectedValue: "120-160 characters",
    });
  } else {
    passed.push("Meta description length is optimal (120-160 characters)");
  }
}

function checkHeadings(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  // H1 checks
  if (data.h1Tags.length === 0) {
    issues.push({
      id: "h1-missing",
      category: "headings",
      severity: "high",
      title: "Missing H1 tag",
      description: "The page has no H1 heading.",
      recommendation: "Add a single, descriptive H1 tag that summarizes the page content.",
      impact: "H1 tags help search engines understand the main topic of the page.",
    });
  } else if (data.h1Tags.length > 1) {
    issues.push({
      id: "h1-multiple",
      category: "headings",
      severity: "medium",
      title: "Multiple H1 tags",
      description: `Page has ${data.h1Tags.length} H1 tags.`,
      recommendation: "Use only one H1 tag per page. Use H2-H6 for subsections.",
      impact: "Multiple H1s can confuse search engines about the page's main topic.",
      currentValue: data.h1Tags.join(", "),
      expectedValue: "Single H1 tag",
    });
  } else {
    passed.push("Page has exactly one H1 tag");
  }

  // Check for heading hierarchy
  if (data.h3Tags.length > 0 && data.h2Tags.length === 0) {
    issues.push({
      id: "heading-hierarchy-broken",
      category: "headings",
      severity: "low",
      title: "Broken heading hierarchy",
      description: "Page has H3 tags but no H2 tags.",
      recommendation: "Maintain proper heading hierarchy (H1 → H2 → H3).",
      impact: "Proper heading structure helps with accessibility and SEO.",
    });
  }

  // Check for empty headings
  const emptyH1 = data.h1Tags.filter(h => h.trim() === "").length;
  if (emptyH1 > 0) {
    issues.push({
      id: "h1-empty",
      category: "headings",
      severity: "high",
      title: "Empty H1 tag",
      description: "The page has an H1 tag with no content.",
      recommendation: "Add descriptive text to the H1 tag.",
      impact: "Empty headings provide no value to users or search engines.",
    });
  }
}

function checkContent(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  // Word count
  if (data.wordCount < 300) {
    issues.push({
      id: "content-thin",
      category: "content",
      severity: "high",
      title: "Thin content",
      description: `Page has only ${data.wordCount} words.`,
      recommendation: "Add more substantial content (aim for 500+ words for main pages).",
      impact: "Thin content pages often rank poorly in search results.",
      currentValue: `${data.wordCount} words`,
      expectedValue: "300+ words minimum",
    });
  } else if (data.wordCount >= 1000) {
    passed.push(`Substantial content (${data.wordCount} words)`);
  }

  // Check for language attribute
  if (!data.language) {
    issues.push({
      id: "language-missing",
      category: "content",
      severity: "low",
      title: "Missing language attribute",
      description: "The HTML tag has no lang attribute.",
      recommendation: 'Add lang attribute to <html> tag (e.g., lang="en").',
      impact: "Language attribute helps search engines and screen readers.",
    });
  } else {
    passed.push(`Language declared (${data.language})`);
  }
}

function checkImages(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  const imagesWithoutAlt = data.images.filter(img => !img.alt);

  if (imagesWithoutAlt.length > 0) {
    issues.push({
      id: "images-missing-alt",
      category: "images",
      severity: imagesWithoutAlt.length > 5 ? "high" : "medium",
      title: "Images missing alt text",
      description: `${imagesWithoutAlt.length} of ${data.images.length} images have no alt text.`,
      recommendation: "Add descriptive alt text to all meaningful images.",
      impact: "Alt text improves accessibility and helps search engines understand images.",
      currentValue: `${imagesWithoutAlt.length} images without alt`,
      expectedValue: "All images should have alt text",
    });
  } else if (data.images.length > 0) {
    passed.push(`All ${data.images.length} images have alt text`);
  }

  // Check for missing dimensions
  const imagesWithoutDimensions = data.images.filter(
    img => !img.width || !img.height
  );
  if (imagesWithoutDimensions.length > 3) {
    issues.push({
      id: "images-missing-dimensions",
      category: "images",
      severity: "low",
      title: "Images missing dimensions",
      description: `${imagesWithoutDimensions.length} images have no width/height attributes.`,
      recommendation: "Add width and height attributes to prevent layout shifts.",
      impact: "Missing dimensions can cause Cumulative Layout Shift (CLS) issues.",
    });
  }

  // Check for lazy loading
  const lazyLoadedImages = data.images.filter(img => img.loading === "lazy");
  if (data.images.length > 5 && lazyLoadedImages.length === 0) {
    issues.push({
      id: "images-no-lazy-loading",
      category: "images",
      severity: "info",
      title: "No lazy loading for images",
      description: "Images are not using lazy loading.",
      recommendation: 'Add loading="lazy" to images below the fold.',
      impact: "Lazy loading improves initial page load performance.",
    });
  }
}

function checkLinks(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  // Check internal links
  if (data.links.internal.length === 0) {
    issues.push({
      id: "no-internal-links",
      category: "links",
      severity: "medium",
      title: "No internal links",
      description: "The page has no internal links to other pages.",
      recommendation: "Add relevant internal links to improve site navigation and SEO.",
      impact: "Internal links help distribute page authority and improve crawlability.",
    });
  } else {
    passed.push(`${data.links.internal.length} internal links found`);
  }

  // Check for excessive links
  const totalLinks = data.links.internal.length + data.links.external.length;
  if (totalLinks > 100) {
    issues.push({
      id: "excessive-links",
      category: "links",
      severity: "low",
      title: "Too many links on page",
      description: `Page has ${totalLinks} links (${data.links.internal.length} internal, ${data.links.external.length} external).`,
      recommendation: "Consider reducing the number of links to improve user experience.",
      impact: "Too many links can dilute page authority and confuse users.",
      currentValue: `${totalLinks} links`,
      expectedValue: "Under 100 links",
    });
  }
}

function checkTechnical(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  // Viewport
  if (!data.hasViewport) {
    issues.push({
      id: "viewport-missing",
      category: "technical",
      severity: "critical",
      title: "Missing viewport meta tag",
      description: "The page has no viewport meta tag.",
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      impact: "Without viewport tag, mobile users will see a desktop-sized page.",
    });
  } else {
    passed.push("Viewport meta tag present");
  }

  // Canonical
  if (!data.canonicalUrl) {
    issues.push({
      id: "canonical-missing",
      category: "technical",
      severity: "medium",
      title: "Missing canonical tag",
      description: "The page has no canonical URL specified.",
      recommendation: "Add a canonical tag pointing to the preferred URL.",
      impact: "Canonical tags help prevent duplicate content issues.",
    });
  } else {
    passed.push("Canonical URL specified");
  }

  // Robots meta
  if (data.robots && data.robots.includes("noindex")) {
    issues.push({
      id: "robots-noindex",
      category: "technical",
      severity: "info",
      title: "Page set to noindex",
      description: "The page has a noindex robots meta tag.",
      recommendation: "Ensure this is intentional. Remove noindex if you want the page indexed.",
      impact: "This page will not appear in search results.",
      currentValue: data.robots,
    });
  }

  // Charset
  if (!data.charset) {
    issues.push({
      id: "charset-missing",
      category: "technical",
      severity: "low",
      title: "Missing charset declaration",
      description: "The page has no charset meta tag.",
      recommendation: 'Add <meta charset="UTF-8"> for proper character encoding.',
      impact: "Missing charset can cause character display issues.",
    });
  }
}

function checkPerformance(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  // Response time
  if (data.responseTime > 3000) {
    issues.push({
      id: "slow-response",
      category: "performance",
      severity: "high",
      title: "Slow server response time",
      description: `Server responded in ${data.responseTime}ms.`,
      recommendation: "Optimize server performance. Aim for under 200ms TTFB.",
      impact: "Slow response times negatively impact user experience and SEO.",
      currentValue: `${data.responseTime}ms`,
      expectedValue: "Under 200ms",
    });
  } else if (data.responseTime < 200) {
    passed.push(`Fast server response (${data.responseTime}ms)`);
  }

  // Page size
  if (data.contentLength > 3000000) {
    issues.push({
      id: "page-too-large",
      category: "performance",
      severity: "medium",
      title: "Large page size",
      description: `Page is ${(data.contentLength / 1024 / 1024).toFixed(2)}MB.`,
      recommendation: "Optimize images and minify code to reduce page size.",
      impact: "Large pages load slowly, especially on mobile networks.",
      currentValue: `${(data.contentLength / 1024 / 1024).toFixed(2)}MB`,
      expectedValue: "Under 3MB",
    });
  }
}

function checkSocial(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  // Open Graph
  const requiredOG = ["og:title", "og:description", "og:image"];
  const missingOG = requiredOG.filter(tag => !data.openGraph[tag]);

  if (missingOG.length > 0) {
    issues.push({
      id: "og-tags-missing",
      category: "social",
      severity: "medium",
      title: "Missing Open Graph tags",
      description: `Missing: ${missingOG.join(", ")}`,
      recommendation: "Add Open Graph tags for better social media sharing.",
      impact: "Social shares will have suboptimal appearance without OG tags.",
      expectedValue: requiredOG.join(", "),
    });
  } else {
    passed.push("All required Open Graph tags present");
  }

  // Twitter Card
  if (!data.twitterCard["twitter:card"]) {
    issues.push({
      id: "twitter-card-missing",
      category: "social",
      severity: "low",
      title: "Missing Twitter Card tags",
      description: "No Twitter Card meta tags found.",
      recommendation: "Add Twitter Card tags for better Twitter sharing.",
      impact: "Twitter shares will use Open Graph tags or defaults.",
    });
  }
}

function checkStructuredData(
  data: ExtractedPageData,
  issues: SEOIssue[],
  passed: string[]
): void {
  if (data.structuredData.length === 0) {
    issues.push({
      id: "no-structured-data",
      category: "structured-data",
      severity: "info",
      title: "No structured data found",
      description: "The page has no JSON-LD structured data.",
      recommendation: "Add relevant Schema.org structured data for rich results.",
      impact: "Structured data can enhance search appearance with rich snippets.",
    });
  } else {
    const types = data.structuredData
      .map(sd => sd["@type"])
      .filter(Boolean)
      .join(", ");
    passed.push(`Structured data found: ${types || "JSON-LD present"}`);
  }
}

function calculateScores(issues: SEOIssue[], passed: string[]): SEOScore {
  const categoryScores: Record<string, { points: number; maxPoints: number }> = {
    title: { points: 15, maxPoints: 15 },
    meta: { points: 15, maxPoints: 15 },
    headings: { points: 10, maxPoints: 10 },
    content: { points: 15, maxPoints: 15 },
    images: { points: 10, maxPoints: 10 },
    links: { points: 10, maxPoints: 10 },
    technical: { points: 15, maxPoints: 15 },
    performance: { points: 5, maxPoints: 5 },
    social: { points: 5, maxPoints: 5 },
  };

  // Deduct points based on issue severity
  const severityDeductions: Record<IssueSeverity, number> = {
    critical: 15,
    high: 10,
    medium: 5,
    low: 2,
    info: 0,
  };

  for (const issue of issues) {
    const category = issue.category === "structured-data" ? "technical" : issue.category;
    const score = categoryScores[category] || categoryScores.technical;
    const deduction = severityDeductions[issue.severity];
    score.points = Math.max(0, score.points - deduction);
  }

  const categories = {
    title: Math.round((categoryScores.title.points / categoryScores.title.maxPoints) * 100),
    meta: Math.round((categoryScores.meta.points / categoryScores.meta.maxPoints) * 100),
    headings: Math.round((categoryScores.headings.points / categoryScores.headings.maxPoints) * 100),
    content: Math.round((categoryScores.content.points / categoryScores.content.maxPoints) * 100),
    images: Math.round((categoryScores.images.points / categoryScores.images.maxPoints) * 100),
    links: Math.round((categoryScores.links.points / categoryScores.links.maxPoints) * 100),
    technical: Math.round((categoryScores.technical.points / categoryScores.technical.maxPoints) * 100),
    performance: Math.round((categoryScores.performance.points / categoryScores.performance.maxPoints) * 100),
    social: Math.round((categoryScores.social.points / categoryScores.social.maxPoints) * 100),
  };

  const totalPoints = Object.values(categoryScores).reduce((sum, cat) => sum + cat.points, 0);
  const maxPoints = Object.values(categoryScores).reduce((sum, cat) => sum + cat.maxPoints, 0);
  const overall = Math.round((totalPoints / maxPoints) * 100);

  return { overall, categories };
}

// Aggregate issues across multiple pages
export function aggregateSiteIssues(pageAnalyses: PageAnalysis[]): {
  issuesByType: Map<string, { count: number; severity: IssueSeverity; pages: string[] }>;
  overallScore: number;
  pageScores: Array<{ url: string; score: number }>;
} {
  const issuesByType = new Map<string, { count: number; severity: IssueSeverity; pages: string[] }>();

  for (const analysis of pageAnalyses) {
    for (const issue of analysis.issues) {
      if (!issuesByType.has(issue.id)) {
        issuesByType.set(issue.id, {
          count: 0,
          severity: issue.severity,
          pages: [],
        });
      }
      const existing = issuesByType.get(issue.id)!;
      existing.count++;
      existing.pages.push(analysis.url);
    }
  }

  const pageScores = pageAnalyses.map(a => ({
    url: a.url,
    score: a.score.overall,
  }));

  const overallScore = pageScores.length > 0
    ? Math.round(pageScores.reduce((sum, p) => sum + p.score, 0) / pageScores.length)
    : 0;

  return { issuesByType, overallScore, pageScores };
}
