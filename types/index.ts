/**
 * Global TypeScript types for Neon SEO Beacon
 */

// User types
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  plan: 'free' | 'pro' | 'agency'
  created_at: string
  updated_at: string
}

// Audit types
export interface SEOAudit {
  id: string
  user_id: string
  url: string
  status: 'processing' | 'completed' | 'failed'
  score: number
  results: SEOAuditResults
  error?: string
  processing_time_ms: number
  created_at: string
  completed_at?: string
  updated_at: string
}

export interface SEOAuditResults {
  url: string
  title: string
  metaDescription: string
  h1Tags: string[]
  h2Tags: string[]
  metaTags: Record<string, string>
  images: ImageAnalysis
  links: LinkAnalysis
  performance: PerformanceAnalysis
  technical: TechnicalSEOAnalysis
  score: number
  processingTime: number
  recommendations: AIRecommendation[]
}

// Analysis types
export interface ImageAnalysis {
  total: number
  withAlt: number
  withoutAlt: number
  images: Array<{
    src: string
    alt: string
    title: string
    hasAlt: boolean
    hasTitle: boolean
  }>
}

export interface LinkAnalysis {
  internal: number
  external: number
  nofollow: number
  total: number
}

export interface PerformanceAnalysis {
  loadTime: number
  status: number | string
  size: number
  compression: string
  coreWebVitals?: {
    lcp: number
    fid: number
    cls: number
  }
}

export interface TechnicalSEOAnalysis {
  hasRobotsMeta: boolean
  hasCanonical: boolean
  hasViewport: boolean
  hasCharset: boolean
  hasLangAttribute: boolean
  structuredData: {
    count: number
    types: string[]
  }
  openGraph: Record<string, string>
  twitterCard: Record<string, string>
}

export interface AIRecommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'technical' | 'content' | 'performance' | 'mobile'
  implementation: string
  resources: string[]
}

// Content types
export interface ContentMeta {
  title: string
  description: string
  category?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  readTime?: string
  tags?: string[]
  publishedAt?: string
  updatedAt?: string
  featured?: boolean
  author?: string
  image?: string
}

export interface ContentPage extends ContentMeta {
  _path: string
  _draft?: boolean
  body: {
    toc: {
      links: Array<{
        id: string
        text: string
        depth: number
        children?: Array<{
          id: string
          text: string
          depth: number
        }>
      }>
    }
  }
}

// Navigation types
export interface NavigationItem {
  title: string
  to: string
  auth?: boolean
  children?: NavigationItem[]
}

// API types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface ContactForm {
  name: string
  email: string
  company?: string
  message: string
  subject: string
}

export interface AuditRequest {
  url: string
  options: {
    includeImages: boolean
    checkMobile: boolean
    includePerformance: boolean
  }
}

// Notification types
export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  timestamp: number
}

// Usage tracking
export interface Usage {
  id: string
  user_id: string
  date: string
  count: number
  plan_at_time: string
  created_at: string
}

// Plan types
export interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  limits: {
    audits: number
    api_calls?: number
    team_members?: number
  }
  popular?: boolean
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type NonEmptyArray<T> = [T, ...T[]]

export type Maybe<T> = T | null | undefined