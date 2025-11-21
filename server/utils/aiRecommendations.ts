// AI-powered SEO recommendations using Claude
import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";
import { PageAnalysis, SEOIssue } from "./seoAnalyzer";
import { PageSpeedResult } from "./coreWebVitals";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIRecommendation {
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  implementation: string;
  estimatedImpact: string;
  effort: "low" | "medium" | "high";
  relatedIssues: string[];
}

export interface AIAnalysisResult {
  summary: string;
  keyFindings: string[];
  recommendations: AIRecommendation[];
  competitiveInsights?: string[];
  contentSuggestions?: string[];
  technicalPriorities?: string[];
}

export async function generateAIRecommendations(
  analysis: PageAnalysis,
  performance?: PageSpeedResult,
  additionalContext?: string
): Promise<AIAnalysisResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    logger.warn("No Anthropic API key configured, returning basic recommendations");
    return generateBasicRecommendations(analysis);
  }

  const prompt = buildAnalysisPrompt(analysis, performance, additionalContext);

  try {
    logger.info("Generating AI recommendations", { url: analysis.url });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system: `You are an expert SEO consultant with deep knowledge of technical SEO, content optimization, and Core Web Vitals. Your task is to analyze SEO audit data and provide actionable, prioritized recommendations.

When analyzing issues:
1. Group related issues together
2. Prioritize by impact on rankings and user experience
3. Provide specific, implementable solutions
4. Consider the effort required vs. the expected benefit
5. Include quick wins and long-term improvements

Always respond with valid JSON matching the required schema.`,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/) ||
      content.text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      logger.error("Failed to parse AI response as JSON", { response: content.text });
      return generateBasicRecommendations(analysis);
    }

    const result = JSON.parse(jsonMatch[1] || jsonMatch[0]) as AIAnalysisResult;

    logger.info("AI recommendations generated successfully", {
      url: analysis.url,
      recommendationCount: result.recommendations.length,
    });

    return result;
  } catch (error: any) {
    logger.error("Failed to generate AI recommendations", { error, url: analysis.url });
    return generateBasicRecommendations(analysis);
  }
}

function buildAnalysisPrompt(
  analysis: PageAnalysis,
  performance?: PageSpeedResult,
  additionalContext?: string
): string {
  const issuesSummary = analysis.issues.map(issue => ({
    id: issue.id,
    severity: issue.severity,
    title: issue.title,
    category: issue.category,
  }));

  const performanceData = performance
    ? {
        score: performance.performanceScore,
        lcp: performance.coreWebVitals.lcp,
        cls: performance.coreWebVitals.cls,
        fcp: performance.coreWebVitals.fcp,
        tbt: performance.coreWebVitals.tbt,
        opportunities: performance.opportunities.slice(0, 5).map(o => ({
          title: o.title,
          savings: o.savings,
        })),
      }
    : null;

  return `Analyze this SEO audit data and provide comprehensive recommendations.

## Page Information
URL: ${analysis.url}
Overall SEO Score: ${analysis.score.overall}/100

## Category Scores
${Object.entries(analysis.score.categories)
  .map(([cat, score]) => `- ${cat}: ${score}/100`)
  .join("\n")}

## Issues Found (${analysis.issues.length} total)
${JSON.stringify(issuesSummary, null, 2)}

## Passed Checks (${analysis.passedChecks.length})
${analysis.passedChecks.slice(0, 10).map(check => `- ${check}`).join("\n")}

## Page Metrics
- Word Count: ${analysis.metrics.wordCount}
- Response Time: ${analysis.metrics.responseTime}ms
- Images: ${analysis.metrics.imageCount} total, ${analysis.metrics.imagesWithoutAlt} missing alt
- Internal Links: ${analysis.metrics.internalLinks}
- External Links: ${analysis.metrics.externalLinks}

${performanceData ? `## Performance Data
- Performance Score: ${performanceData.score}/100
- LCP: ${performanceData.lcp.displayValue} (${performanceData.lcp.rating})
- CLS: ${performanceData.cls.displayValue} (${performanceData.cls.rating})
- FCP: ${performanceData.fcp.displayValue} (${performanceData.fcp.rating})
- TBT: ${performanceData.tbt.displayValue} (${performanceData.tbt.rating})

Top Opportunities:
${performanceData.opportunities.map(o => `- ${o.title}: ${o.savings}`).join("\n")}
` : ""}

${additionalContext ? `## Additional Context\n${additionalContext}\n` : ""}

Please provide your analysis in the following JSON format:

\`\`\`json
{
  "summary": "A 2-3 sentence executive summary of the page's SEO health",
  "keyFindings": [
    "Most important finding 1",
    "Most important finding 2",
    "Most important finding 3"
  ],
  "recommendations": [
    {
      "priority": "critical|high|medium|low",
      "category": "Category name",
      "title": "Short recommendation title",
      "description": "Detailed explanation of the issue and why it matters",
      "implementation": "Step-by-step implementation instructions",
      "estimatedImpact": "Expected improvement or benefit",
      "effort": "low|medium|high",
      "relatedIssues": ["issue-id-1", "issue-id-2"]
    }
  ],
  "technicalPriorities": [
    "Technical priority 1",
    "Technical priority 2"
  ],
  "contentSuggestions": [
    "Content improvement suggestion 1",
    "Content improvement suggestion 2"
  ]
}
\`\`\`

Provide 5-10 actionable recommendations, prioritized by impact. Focus on quick wins and high-impact changes first.`;
}

function generateBasicRecommendations(analysis: PageAnalysis): AIAnalysisResult {
  const recommendations: AIRecommendation[] = [];

  // Group issues by severity and create recommendations
  const criticalIssues = analysis.issues.filter(i => i.severity === "critical");
  const highIssues = analysis.issues.filter(i => i.severity === "high");

  // Add critical issues as recommendations
  for (const issue of criticalIssues) {
    recommendations.push({
      priority: "critical",
      category: issue.category,
      title: issue.title,
      description: issue.description,
      implementation: issue.recommendation,
      estimatedImpact: issue.impact,
      effort: "low",
      relatedIssues: [issue.id],
    });
  }

  // Add high severity issues
  for (const issue of highIssues.slice(0, 5)) {
    recommendations.push({
      priority: "high",
      category: issue.category,
      title: issue.title,
      description: issue.description,
      implementation: issue.recommendation,
      estimatedImpact: issue.impact,
      effort: "medium",
      relatedIssues: [issue.id],
    });
  }

  // Generate summary
  const summary = `This page has an SEO score of ${analysis.score.overall}/100. ` +
    `Found ${criticalIssues.length} critical and ${highIssues.length} high-priority issues ` +
    `that need attention to improve search visibility.`;

  const keyFindings = [
    `Overall SEO score: ${analysis.score.overall}/100`,
    `${analysis.issues.length} total issues found`,
    `${analysis.passedChecks.length} checks passed`,
  ];

  if (criticalIssues.length > 0) {
    keyFindings.push(`Critical issues: ${criticalIssues.map(i => i.title).join(", ")}`);
  }

  return {
    summary,
    keyFindings,
    recommendations,
    technicalPriorities: criticalIssues.map(i => i.recommendation),
  };
}

// Generate content suggestions based on analysis
export async function generateContentSuggestions(
  pageData: {
    url: string;
    title: string;
    metaDescription: string;
    h1Tags: string[];
    wordCount: number;
    textContent: string;
  },
  targetKeywords?: string[]
): Promise<{
  titleSuggestions: string[];
  metaDescriptionSuggestions: string[];
  contentGaps: string[];
  keywordSuggestions: string[];
}> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      titleSuggestions: [],
      metaDescriptionSuggestions: [],
      contentGaps: [],
      keywordSuggestions: [],
    };
  }

  const prompt = `Analyze this page content and provide SEO content suggestions.

URL: ${pageData.url}
Current Title: ${pageData.title}
Current Meta Description: ${pageData.metaDescription}
H1: ${pageData.h1Tags.join(", ")}
Word Count: ${pageData.wordCount}
${targetKeywords ? `Target Keywords: ${targetKeywords.join(", ")}` : ""}

Content Preview (first 1000 chars):
${pageData.textContent.substring(0, 1000)}

Provide suggestions in JSON format:
{
  "titleSuggestions": ["Better title 1", "Better title 2"],
  "metaDescriptionSuggestions": ["Better description 1"],
  "contentGaps": ["Topic to add 1", "Topic to add 2"],
  "keywordSuggestions": ["Related keyword 1", "Related keyword 2"]
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/) ||
      content.text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
  } catch (error) {
    logger.error("Failed to generate content suggestions", { error });
  }

  return {
    titleSuggestions: [],
    metaDescriptionSuggestions: [],
    contentGaps: [],
    keywordSuggestions: [],
  };
}

// Natural language query interface
export async function askSEOQuestion(
  question: string,
  analysisData: PageAnalysis,
  context?: string
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return "AI analysis is not available. Please configure an Anthropic API key.";
  }

  const prompt = `You are an SEO expert assistant. Answer this question about the analyzed page.

Question: ${question}

Page Analysis Data:
- URL: ${analysisData.url}
- SEO Score: ${analysisData.score.overall}/100
- Issues: ${analysisData.issues.length} found
- Top Issues: ${analysisData.issues.slice(0, 5).map(i => i.title).join(", ")}

${context ? `Additional Context: ${context}` : ""}

Provide a helpful, actionable answer.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    return content.type === "text" ? content.text : "Unable to generate response.";
  } catch (error) {
    logger.error("Failed to answer SEO question", { error, question });
    return "Sorry, I encountered an error processing your question.";
  }
}
