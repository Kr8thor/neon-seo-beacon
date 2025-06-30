import type { H3Event } from "h3";
import { logger } from "~/server/utils/logger";
import { validateRequest, validateCSRFToken } from "~/server/utils/security";
import {
  checkIPRateLimit,
  setRateLimitHeaders,
} from "~/server/utils/secureRateLimit";

interface SecurityConfig {
  requireCSRF: boolean;
  rateLimitEnabled: boolean;
  validateInput: boolean;
  logRequests: boolean;
  blockSuspiciousRequests: boolean;
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  requireCSRF: true,
  rateLimitEnabled: true,
  validateInput: true,
  logRequests: true,
  blockSuspiciousRequests: true,
};

export default defineEventHandler(async (event: H3Event) => {
  // Only apply security to API routes
  if (!event.node.req.url?.startsWith("/api/")) {
    return;
  }

  const startTime = Date.now();
  const isTestEnv =
    process.env.NODE_ENV === "test" || process.env.VITEST === "true";
  const isDev = process.env.NODE_ENV === "development";
  
  const config = isTestEnv
    ? {
        requireCSRF: false,
        rateLimitEnabled: false,
        validateInput: false,
        logRequests: false,
        blockSuspiciousRequests: false,
      }
    : isDev
    ? {
        requireCSRF: false, // Temporarily disable CSRF in development for testing
        rateLimitEnabled: true,
        validateInput: true,
        logRequests: true,
        blockSuspiciousRequests: false, // Disable suspicious request blocking in dev
      }
    : DEFAULT_SECURITY_CONFIG;

  try {
    // Skip security for health check, public endpoints, and content API calls
    const isHealthCheck = event.node.req.url === "/api/health";
    const isPublicEndpoint = event.node.req.url?.includes("/public");
    const isContentAPI = event.node.req.url?.includes("/_mdc/") || 
                        event.node.req.url?.includes("/_content/");

    if (isHealthCheck || isContentAPI) {
      return;
    }

    // Request validation
    if (config.validateInput) {
      const validationResult = validateRequest(event);
      if (!validationResult.valid) {
        logger.security("Request validation failed", {
          url: event.node.req.url,
          error: validationResult.error,
          method: event.node.req.method,
          ip: getClientIP(event),
        });

        throw createError({
          statusCode: 400,
          statusMessage: validationResult.error || "Invalid request",
        });
      }
    }

    // Rate limiting (less strict for authenticated users)
    if (config.rateLimitEnabled && !isPublicEndpoint) {
      const rateLimitResult = await checkIPRateLimit(event, {
        windowMs: 5 * 60 * 1000, // 5 minutes
        maxRequests: 100, // Higher limit for API routes
        blockDuration: 15 * 60 * 1000, // 15 minutes
      });

      setRateLimitHeaders(event, rateLimitResult);

      if (!rateLimitResult.allowed) {
        logger.security("Rate limit exceeded for API route", {
          url: event.node.req.url,
          ip: getClientIP(event),
          blocked: rateLimitResult.blocked,
        });

        const statusMessage = rateLimitResult.blocked
          ? "IP temporarily blocked due to abuse"
          : "Too many requests. Please slow down.";

        throw createError({
          statusCode: 429,
          statusMessage,
        });
      }
    }

    // CSRF protection (skip for GET requests and public endpoints)
    if (config.requireCSRF && !isPublicEndpoint) {
      const method = event.node.req.method?.toLowerCase();
      const isStateChanging = ["post", "put", "patch", "delete"].includes(
        method || "",
      );

      if (isStateChanging && !validateCSRFToken(event)) {
        throw createError({
          statusCode: 403,
          statusMessage: "CSRF token validation failed",
        });
      }
    }

    // Log API requests for monitoring
    if (config.logRequests) {
      const method = event.node.req.method;
      const url = event.node.req.url;
      const userAgent = getHeader(event, "user-agent");
      const ip = getClientIP(event);

      logger.info("API request", {
        method,
        url,
        ip,
        userAgent: userAgent?.substring(0, 100),
        timestamp: new Date().toISOString(),
      });
    }

    // Security headers
    setSecurityHeaders(event);
  } catch (error: any) {
    const processingTime = Date.now() - startTime;

    logger.error("Security middleware error", error, {
      url: event.node.req.url,
      method: event.node.req.method,
      ip: getClientIP(event),
      processingTime,
    });

    // Re-throw the error to be handled by the route handler
    throw error;
  }
});

function setSecurityHeaders(event: H3Event): void {
  // Security headers
  setHeader(event, "X-Content-Type-Options", "nosniff");
  setHeader(event, "X-Frame-Options", "DENY");
  setHeader(event, "X-XSS-Protection", "1; mode=block");
  setHeader(event, "Referrer-Policy", "strict-origin-when-cross-origin");
  setHeader(
    event,
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // HSTS for HTTPS
  if (getHeader(event, "x-forwarded-proto") === "https") {
    setHeader(
      event,
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  // CSP (Content Security Policy)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.anthropic.com https://*.supabase.co",
    "frame-ancestors 'none'",
  ].join("; ");

  setHeader(event, "Content-Security-Policy", csp);
}

function getClientIP(event: H3Event): string {
  const headers = [
    "cf-connecting-ip",
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
  ];

  for (const header of headers) {
    const value = getHeader(event, header);
    if (value) {
      return value.split(",")[0].trim();
    }
  }

  return "unknown";
}
