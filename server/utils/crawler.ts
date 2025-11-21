// Multi-page website crawler with rate limiting and depth control
import axios, { AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import robotsParser from "robots-parser";
import { logger } from "./logger";
import { CrawlConfig, DEFAULT_CRAWL_CONFIG } from "./queue";

export interface CrawlResult {
  url: string;
  statusCode: number;
  contentType: string;
  responseTime: number;
  html?: string;
  redirectUrl?: string;
  error?: string;
  headers: Record<string, string>;
}

export interface PageLinks {
  internal: string[];
  external: string[];
  resources: ResourceLink[];
}

export interface ResourceLink {
  url: string;
  type: "script" | "stylesheet" | "image" | "font" | "other";
  async?: boolean;
  defer?: boolean;
}

export interface ExtractedPageData {
  url: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string | null;
  h1Tags: string[];
  h2Tags: string[];
  h3Tags: string[];
  images: ImageData[];
  links: PageLinks;
  metaTags: Record<string, string>;
  structuredData: any[];
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  wordCount: number;
  textContent: string;
  language: string | null;
  charset: string | null;
  hasViewport: boolean;
  robots: string | null;
  responseTime: number;
  contentLength: number;
}

export interface ImageData {
  src: string;
  alt: string;
  title: string;
  width?: number;
  height?: number;
  loading?: string;
}

export class WebCrawler {
  private config: CrawlConfig;
  private axiosInstance: AxiosInstance;
  private robotsTxt: ReturnType<typeof robotsParser> | null = null;
  private visitedUrls: Set<string> = new Set();
  private baseUrl: URL;
  private lastRequestTime: number = 0;

  constructor(baseUrl: string, config: Partial<CrawlConfig> = {}) {
    this.config = { ...DEFAULT_CRAWL_CONFIG, ...config };
    this.baseUrl = new URL(baseUrl);

    this.axiosInstance = axios.create({
      timeout: this.config.timeout,
      maxRedirects: 5,
      validateStatus: () => true, // Don't throw on any status
      headers: {
        "User-Agent": this.config.userAgent || DEFAULT_CRAWL_CONFIG.userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
    });
  }

  async initialize(): Promise<void> {
    if (this.config.respectRobotsTxt) {
      await this.fetchRobotsTxt();
    }
  }

  private async fetchRobotsTxt(): Promise<void> {
    const robotsUrl = `${this.baseUrl.origin}/robots.txt`;
    try {
      const response = await this.axiosInstance.get(robotsUrl);
      if (response.status === 200) {
        this.robotsTxt = robotsParser(robotsUrl, response.data);
        logger.debug(`Loaded robots.txt from ${robotsUrl}`);
      }
    } catch (error) {
      logger.debug(`No robots.txt found at ${robotsUrl}`);
    }
  }

  private async rateLimit(): Promise<void> {
    const minInterval = 1000 / this.config.rateLimit;
    const elapsed = Date.now() - this.lastRequestTime;
    if (elapsed < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  private isAllowedByRobots(url: string): boolean {
    if (!this.robotsTxt) return true;
    return this.robotsTxt.isAllowed(url, this.config.userAgent || "NeonSEOBeacon");
  }

  private normalizeUrl(url: string, baseUrl: string): string | null {
    try {
      const absoluteUrl = new URL(url, baseUrl);

      // Remove fragment
      absoluteUrl.hash = "";

      // Normalize trailing slashes
      if (absoluteUrl.pathname !== "/" && absoluteUrl.pathname.endsWith("/")) {
        absoluteUrl.pathname = absoluteUrl.pathname.slice(0, -1);
      }

      return absoluteUrl.href;
    } catch {
      return null;
    }
  }

  private isInternalUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);

      if (this.config.includeSubdomains) {
        const baseDomain = this.baseUrl.hostname.split(".").slice(-2).join(".");
        const urlDomain = parsedUrl.hostname.split(".").slice(-2).join(".");
        return baseDomain === urlDomain;
      }

      return parsedUrl.hostname === this.baseUrl.hostname;
    } catch {
      return false;
    }
  }

  private shouldCrawl(url: string): boolean {
    // Check if already visited
    if (this.visitedUrls.has(url)) return false;

    // Check robots.txt
    if (!this.isAllowedByRobots(url)) return false;

    // Check URL patterns
    if (this.config.urlPatterns && this.config.urlPatterns.length > 0) {
      const matches = this.config.urlPatterns.some(pattern =>
        new RegExp(pattern).test(url)
      );
      if (!matches) return false;
    }

    // Check exclude patterns
    if (this.config.excludePatterns && this.config.excludePatterns.length > 0) {
      const excluded = this.config.excludePatterns.some(pattern =>
        new RegExp(pattern).test(url)
      );
      if (excluded) return false;
    }

    // Check protocol
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) return false;

    // Skip common non-HTML resources
    const skipExtensions = [
      ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp",
      ".css", ".js", ".json", ".xml", ".zip", ".tar", ".gz",
      ".mp3", ".mp4", ".avi", ".mov", ".wmv", ".doc", ".docx",
      ".xls", ".xlsx", ".ppt", ".pptx"
    ];

    const pathname = parsedUrl.pathname.toLowerCase();
    if (skipExtensions.some(ext => pathname.endsWith(ext))) return false;

    return true;
  }

  async crawlPage(url: string): Promise<CrawlResult> {
    await this.rateLimit();

    const startTime = Date.now();

    try {
      const response = await this.axiosInstance.get(url);
      const responseTime = Date.now() - startTime;

      const result: CrawlResult = {
        url,
        statusCode: response.status,
        contentType: response.headers["content-type"] || "",
        responseTime,
        headers: response.headers as Record<string, string>,
      };

      // Handle redirects
      if (response.request.res?.responseUrl && response.request.res.responseUrl !== url) {
        result.redirectUrl = response.request.res.responseUrl;
      }

      // Only store HTML content
      if (result.contentType.includes("text/html")) {
        result.html = response.data;
      }

      return result;
    } catch (error: any) {
      return {
        url,
        statusCode: 0,
        contentType: "",
        responseTime: Date.now() - startTime,
        headers: {},
        error: error.message,
      };
    }
  }

  extractPageData(url: string, html: string, responseTime: number): ExtractedPageData {
    const $ = cheerio.load(html);

    // Extract basic SEO data
    const title = $("title").text().trim();
    const metaDescription = $('meta[name="description"]').attr("content")?.trim() || "";
    const metaKeywords = $('meta[name="keywords"]').attr("content")?.trim() || "";
    const canonicalUrl = $('link[rel="canonical"]').attr("href") || null;

    // Extract headings
    const h1Tags = $("h1").map((_, el) => $(el).text().trim()).get();
    const h2Tags = $("h2").map((_, el) => $(el).text().trim()).get();
    const h3Tags = $("h3").map((_, el) => $(el).text().trim()).get();

    // Extract images
    const images: ImageData[] = [];
    $("img").each((_, el) => {
      const $img = $(el);
      images.push({
        src: $img.attr("src") || "",
        alt: $img.attr("alt") || "",
        title: $img.attr("title") || "",
        width: parseInt($img.attr("width") || "0") || undefined,
        height: parseInt($img.attr("height") || "0") || undefined,
        loading: $img.attr("loading"),
      });
    });

    // Extract links
    const links = this.extractLinks($, url);

    // Extract meta tags
    const metaTags: Record<string, string> = {};
    $("meta").each((_, el) => {
      const name = $(el).attr("name") || $(el).attr("property") || $(el).attr("http-equiv");
      const content = $(el).attr("content");
      if (name && content) {
        metaTags[name] = content;
      }
    });

    // Extract structured data
    const structuredData: any[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "{}");
        structuredData.push(data);
      } catch {
        // Invalid JSON
      }
    });

    // Extract Open Graph
    const openGraph: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr("property");
      const content = $(el).attr("content");
      if (property && content) {
        openGraph[property] = content;
      }
    });

    // Extract Twitter Card
    const twitterCard: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const name = $(el).attr("name");
      const content = $(el).attr("content");
      if (name && content) {
        twitterCard[name] = content;
      }
    });

    // Calculate word count
    const textContent = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

    // Get content length
    const contentLength = Buffer.byteLength(html, "utf8");

    return {
      url,
      title,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      h1Tags,
      h2Tags,
      h3Tags,
      images,
      links,
      metaTags,
      structuredData,
      openGraph,
      twitterCard,
      wordCount,
      textContent: textContent.substring(0, 5000), // Limit stored text
      language: $("html").attr("lang") || null,
      charset: $('meta[charset]').attr("charset") || null,
      hasViewport: $('meta[name="viewport"]').length > 0,
      robots: $('meta[name="robots"]').attr("content") || null,
      responseTime,
      contentLength,
    };
  }

  private extractLinks($: cheerio.CheerioAPI, baseUrl: string): PageLinks {
    const internal: string[] = [];
    const external: string[] = [];
    const resources: ResourceLink[] = [];

    // Extract anchor links
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      const normalizedUrl = this.normalizeUrl(href, baseUrl);
      if (!normalizedUrl) return;

      if (this.isInternalUrl(normalizedUrl)) {
        if (!internal.includes(normalizedUrl)) {
          internal.push(normalizedUrl);
        }
      } else {
        if (!external.includes(normalizedUrl)) {
          external.push(normalizedUrl);
        }
      }
    });

    // Extract resource links
    $("script[src]").each((_, el) => {
      const src = $(el).attr("src");
      if (src) {
        resources.push({
          url: this.normalizeUrl(src, baseUrl) || src,
          type: "script",
          async: $(el).attr("async") !== undefined,
          defer: $(el).attr("defer") !== undefined,
        });
      }
    });

    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        resources.push({
          url: this.normalizeUrl(href, baseUrl) || href,
          type: "stylesheet",
        });
      }
    });

    return { internal, external, resources };
  }

  async *crawlSite(startUrl?: string): AsyncGenerator<{
    url: string;
    depth: number;
    result: CrawlResult;
    data?: ExtractedPageData;
  }> {
    const queue: Array<{ url: string; depth: number }> = [
      { url: startUrl || this.baseUrl.href, depth: 0 },
    ];

    await this.initialize();

    let pagesProcessed = 0;

    while (queue.length > 0 && pagesProcessed < this.config.maxPages) {
      const { url, depth } = queue.shift()!;

      if (this.visitedUrls.has(url)) continue;
      if (!this.shouldCrawl(url)) continue;

      this.visitedUrls.add(url);
      pagesProcessed++;

      const result = await this.crawlPage(url);
      let data: ExtractedPageData | undefined;

      if (result.html) {
        data = this.extractPageData(url, result.html, result.responseTime);

        // Add internal links to queue if within depth limit
        if (depth < this.config.maxDepth) {
          for (const link of data.links.internal) {
            if (!this.visitedUrls.has(link) && this.shouldCrawl(link)) {
              queue.push({ url: link, depth: depth + 1 });
            }
          }
        }
      }

      yield { url, depth, result, data };
    }
  }

  getStats() {
    return {
      visitedUrls: this.visitedUrls.size,
      baseUrl: this.baseUrl.href,
      config: this.config,
    };
  }
}

// Helper function to create and run a crawl
export async function crawlWebsite(
  url: string,
  config: Partial<CrawlConfig> = {}
): Promise<ExtractedPageData[]> {
  const crawler = new WebCrawler(url, config);
  const results: ExtractedPageData[] = [];

  for await (const { data } of crawler.crawlSite()) {
    if (data) {
      results.push(data);
    }
  }

  return results;
}
