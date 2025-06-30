/**
 * SEO Analysis Types for Neon SEO Beacon
 */

// Core SEO Analysis Result Interface
export interface SEOAuditResults {
  // Core properties
  id?: string;                        // Optional ID for audit tracking
  url: string;
  title: string;
  metaDescription: string;
  h1Tags: string[];
  h2Tags: string[];
  metaTags: Record<string, string>;
  score: number;
  processingTime: number;

  // Analysis data
  images: ImageAnalysis;
  links: LinkAnalysis;
  performance: PerformanceAnalysis;
  technical: TechnicalSEOAnalysis;
  recommendations: AIRecommendation[];

  // Top issues for quick display
  topIssues?: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
    recommendation: string;
  }>;

  // API response structure compatibility
  success?: boolean;
  audit?: any;
}

// Analysis sub-interfaces
export interface ImageAnalysis {
  total: number;
  withAlt: number;
  withoutAlt: number;
  images: Array<{
    src: string;
    alt: string;
    title: string;
    hasAlt: boolean;
    hasTitle: boolean;
  }>;
}

export interface LinkAnalysis {
  internal: number;
  external: number;
  nofollow: number;
  total: number;
}

export interface PerformanceAnalysis {
  loadTime: number;
  status: number | string;
  size: number;
  compression: string;
  coreWebVitals?: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

export interface TechnicalSEOAnalysis {
  hasRobotsMeta: boolean;
  hasCanonical: boolean;
  hasViewport: boolean;
  hasCharset: boolean;
  hasLangAttribute: boolean;
  structuredData: {
    count: number;
    types: string[];
  };
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard";
  category: "technical" | "content" | "performance" | "mobile";
  implementation: string;
  resources: string[];
}

// Top issue interface for quick display
export interface TopIssue {
  type: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  impact: string;
}

// Audit request interface
export interface AuditRequest {
  url: string;
  options: {
    includeImages: boolean;
    checkMobile: boolean;
    includePerformance: boolean;
  };
}