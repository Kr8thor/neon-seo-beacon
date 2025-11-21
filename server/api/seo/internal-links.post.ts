// Analyze internal link structure of a page
import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "~/server/utils/logger";
import { z } from "zod";

const linkSchema = z.object({
  url: z.string().url(),
  depth: z.number().min(1).max(3).default(1), // How many levels to crawl
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const { url, depth } = linkSchema.parse(body);
    const baseUrl = new URL(url);
    const domain = baseUrl.hostname;

    // Crawl the page
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        "User-Agent": "Marden SEO Internal Link Analyzer/1.0",
      },
    });

    const $ = cheerio.load(response.data);
    const links: any[] = [];
    const linkMap = new Map<string, number>();

    // Extract all links
    $("a[href]").each((_, element) => {
      const href = $(element).attr("href") || "";
      const text = $(element).text().trim();
      const rel = $(element).attr("rel") || "";
      const title = $(element).attr("title") || "";

      try {
        let fullUrl: string;
        if (href.startsWith("http")) {
          fullUrl = href;
        } else if (href.startsWith("/")) {
          fullUrl = `${baseUrl.protocol}//${domain}${href}`;
        } else if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
          return; // Skip anchors and special links
        } else {
          fullUrl = new URL(href, url).toString();
        }

        const linkUrl = new URL(fullUrl);
        const isInternal = linkUrl.hostname === domain;

        if (isInternal) {
          // Count occurrences
          const count = linkMap.get(fullUrl) || 0;
          linkMap.set(fullUrl, count + 1);

          links.push({
            url: fullUrl,
            text: text.substring(0, 100),
            title,
            rel,
            is_nofollow: rel.includes("nofollow"),
            path: linkUrl.pathname,
          });
        }
      } catch (e) {
        // Invalid URL, skip
      }
    });

    // Analyze link distribution
    const uniqueLinks = Array.from(linkMap.entries()).map(([linkUrl, count]) => ({
      url: linkUrl,
      count,
      path: new URL(linkUrl).pathname,
    }));

    // Find issues
    const issues: any[] = [];

    // Check for orphan link potential (pages linked only once)
    const lowLinkedPages = uniqueLinks.filter(l => l.count === 1);
    if (lowLinkedPages.length > uniqueLinks.length * 0.5) {
      issues.push({
        type: "poor_distribution",
        message: "Many pages are linked only once - consider improving internal linking",
        affected: lowLinkedPages.length,
      });
    }

    // Check for too many links
    if (links.length > 100) {
      issues.push({
        type: "too_many_links",
        message: `Page has ${links.length} internal links - consider reducing for better link equity distribution`,
        count: links.length,
      });
    }

    // Check anchor text
    const emptyAnchors = links.filter(l => !l.text || l.text.length < 2);
    if (emptyAnchors.length > 0) {
      issues.push({
        type: "empty_anchors",
        message: `${emptyAnchors.length} links have empty or very short anchor text`,
        count: emptyAnchors.length,
      });
    }

    // Group by directory
    const byDirectory: Record<string, number> = {};
    uniqueLinks.forEach(link => {
      const parts = link.path.split("/").filter(Boolean);
      const dir = parts.length > 0 ? `/${parts[0]}` : "/";
      byDirectory[dir] = (byDirectory[dir] || 0) + link.count;
    });

    return {
      success: true,
      data: {
        url,
        total_links: links.length,
        unique_links: uniqueLinks.length,
        distribution: {
          by_directory: byDirectory,
          most_linked: uniqueLinks.sort((a, b) => b.count - a.count).slice(0, 10),
          least_linked: uniqueLinks.sort((a, b) => a.count - b.count).slice(0, 10),
        },
        issues,
        links: links.slice(0, 200), // Limit response size
      },
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Invalid request",
        data: error.errors,
      });
    }

    logger.error("Failed to analyze internal links", { error });

    throw createError({
      statusCode: 500,
      message: "Failed to analyze internal links",
    });
  }
});
