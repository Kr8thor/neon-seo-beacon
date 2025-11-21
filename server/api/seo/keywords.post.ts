// Analyze keyword density and usage
import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "~/server/utils/logger";
import { z } from "zod";

const keywordSchema = z.object({
  url: z.string().url(),
  target_keywords: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const { url, target_keywords } = keywordSchema.parse(body);

    // Fetch the page
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        "User-Agent": "Marden SEO Keyword Analyzer/1.0",
      },
    });

    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $("script, style, noscript").remove();

    // Extract text content
    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const h1Text = $("h1").map((_, el) => $(el).text()).get().join(" ");
    const h2Text = $("h2").map((_, el) => $(el).text()).get().join(" ");
    const bodyText = $("body").text();

    // Clean and tokenize text
    const cleanText = (text: string) =>
      text.toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const allText = cleanText(`${title} ${metaDescription} ${h1Text} ${h2Text} ${bodyText}`);
    const words = allText.split(" ").filter(w => w.length > 2);

    // Count word frequency
    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Get top keywords (excluding common stop words)
    const stopWords = new Set([
      "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her",
      "was", "one", "our", "out", "has", "have", "been", "this", "that", "with",
      "they", "will", "from", "what", "there", "when", "your", "which", "their",
      "more", "some", "them", "than", "into", "only", "other", "also", "just",
    ]);

    const topKeywords = Object.entries(wordCount)
      .filter(([word]) => !stopWords.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / words.length) * 100).toFixed(2) + "%",
      }));

    // Analyze 2-word phrases
    const phrases: Record<string, number> = {};
    for (let i = 0; i < words.length - 1; i++) {
      if (!stopWords.has(words[i]) || !stopWords.has(words[i + 1])) {
        const phrase = `${words[i]} ${words[i + 1]}`;
        phrases[phrase] = (phrases[phrase] || 0) + 1;
      }
    }

    const topPhrases = Object.entries(phrases)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([phrase, count]) => ({
        phrase,
        count,
        density: ((count / (words.length - 1)) * 100).toFixed(2) + "%",
      }));

    // Analyze target keywords if provided
    let targetAnalysis: any[] = [];
    if (target_keywords && target_keywords.length > 0) {
      targetAnalysis = target_keywords.map(keyword => {
        const kw = keyword.toLowerCase();
        const inTitle = title.toLowerCase().includes(kw);
        const inMeta = metaDescription.toLowerCase().includes(kw);
        const inH1 = h1Text.toLowerCase().includes(kw);
        const inH2 = h2Text.toLowerCase().includes(kw);
        const count = (allText.match(new RegExp(kw, "g")) || []).length;
        const density = ((count / words.length) * 100).toFixed(2);

        return {
          keyword,
          count,
          density: density + "%",
          locations: {
            title: inTitle,
            meta_description: inMeta,
            h1: inH1,
            h2: inH2,
          },
          score: calculateKeywordScore(inTitle, inMeta, inH1, parseFloat(density)),
        };
      });
    }

    return {
      success: true,
      data: {
        url,
        word_count: words.length,
        unique_words: Object.keys(wordCount).length,
        top_keywords: topKeywords,
        top_phrases: topPhrases,
        target_keywords: targetAnalysis,
        recommendations: generateKeywordRecommendations(topKeywords, targetAnalysis),
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

    logger.error("Failed to analyze keywords", { error });

    throw createError({
      statusCode: 500,
      message: "Failed to analyze keywords",
    });
  }
});

function calculateKeywordScore(inTitle: boolean, inMeta: boolean, inH1: boolean, density: number): number {
  let score = 0;
  if (inTitle) score += 30;
  if (inMeta) score += 20;
  if (inH1) score += 25;
  if (density >= 0.5 && density <= 2.5) score += 25;
  else if (density > 0 && density < 0.5) score += 10;
  else if (density > 2.5) score += 5; // Over-optimization penalty
  return Math.min(100, score);
}

function generateKeywordRecommendations(topKeywords: any[], targetAnalysis: any[]): string[] {
  const recommendations: string[] = [];

  // Check if top keywords are too generic
  const genericWords = ["page", "home", "site", "website", "click", "here"];
  const genericFound = topKeywords.slice(0, 5).filter(k => genericWords.includes(k.word));
  if (genericFound.length > 0) {
    recommendations.push("Top keywords include generic terms - consider using more specific, targeted keywords");
  }

  // Check target keyword optimization
  targetAnalysis.forEach(kw => {
    if (!kw.locations.title) {
      recommendations.push(`Add "${kw.keyword}" to the page title`);
    }
    if (!kw.locations.h1) {
      recommendations.push(`Include "${kw.keyword}" in an H1 heading`);
    }
    if (parseFloat(kw.density) < 0.5) {
      recommendations.push(`Increase usage of "${kw.keyword}" - current density is low`);
    }
    if (parseFloat(kw.density) > 3) {
      recommendations.push(`Reduce usage of "${kw.keyword}" - may be over-optimized`);
    }
  });

  return recommendations.slice(0, 5);
}
