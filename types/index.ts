/**
 * Global TypeScript types for Neon SEO Beacon
 */

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: "free" | "pro" | "agency";
  created_at: string;
  updated_at: string;
}

// Audit types
export interface SEOAudit {
  id: string;
  user_id: string;
  url: string;
  status: "processing" | "completed" | "failed";
  score: number;
  results: SEOAuditResults;
  error?: string;
  processing_time_ms: number;
  created_at: string;
  completed_at?: string;
  updated_at: string;
}

// Import SEO types from dedicated file
export * from './seo';
import type { SEOAuditResults } from './seo';



// Content types
export interface ContentMeta {
  title: string;
  description: string;
  category?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  readTime?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  author?: string;
  image?: string;
}

export interface ContentPage extends ContentMeta {
  _path: string;
  _draft?: boolean;
  body: {
    toc: {
      links: Array<{
        id: string;
        text: string;
        depth: number;
        children?: Array<{
          id: string;
          text: string;
          depth: number;
        }>;
      }>;
    };
  };
}

// Navigation types
export interface NavigationItem {
  title: string;
  to: string;
  auth?: boolean;
  children?: NavigationItem[];
}

// API types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  message: string;
  subject: string;
}


// Notification types
export interface Notification {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  timestamp: number;
}

// Usage tracking
export interface Usage {
  id: string;
  user_id: string;
  date: string;
  count: number;
  plan_at_time: string;
  created_at: string;
}

// Plan types
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: {
    audits: number;
    api_calls?: number;
    team_members?: number;
  };
  popular?: boolean;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type NonEmptyArray<T> = [T, ...T[]];

export type Maybe<T> = T | null | undefined;
