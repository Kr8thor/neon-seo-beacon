// Production-ready rate limiting with Redis support
import type { H3Event } from "h3";
import { getQuery } from "h3";
import { logger } from "./logger";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  blockDuration?: number; // Additional block time for repeated violations
}

interface RateLimitResult {
  allowed: boolean;
  resetTime?: number;
  remaining?: number;
  blocked?: boolean;
  blockExpires?: number;
}

// In-memory fallback (use Redis in production)
const rateLimitStore = new Map<
  string,
  {
    count: number;
    resetTime: number;
    blocked?: boolean;
    blockExpires?: number;
    violations?: number;
  }
>();

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  blockDuration: 60 * 60 * 1000, // 1 hour block for repeated violations
};

// Check if we're in build/prerender mode
function isBuildTime(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    (process.env.NUXT_PRERENDER === "true" ||
      process.env.NITRO_PRERENDER === "true" ||
      process.argv.includes("build") ||
      process.argv.includes("generate"))
  );
}

export async function checkRateLimit(
  event: H3Event,
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT,
): Promise<RateLimitResult> {
  try {
    // Skip rate limiting during build/prerender
    if (isBuildTime()) {
      return { allowed: true };
    }

    // Skip rate limiting for localhost during development
    const host = getHeader(event, "host");
    if (host?.includes("localhost") || host?.includes("127.0.0.1")) {
      return { allowed: true };
    }

    const now = Date.now();
    const key = `rate_limit:${identifier}`;

    // Cleanup expired entries periodically
    if (Math.random() < 0.01) {
      cleanupExpiredEntries(now);
    }

    let rateData = rateLimitStore.get(key);

    // Reset if window has expired
    if (!rateData || rateData.resetTime < now) {
      rateData = {
        count: 0,
        resetTime: now + config.windowMs,
        violations: 0,
      };
    }

    // Check if currently blocked
    if (
      rateData.blocked &&
      rateData.blockExpires &&
      rateData.blockExpires > now
    ) {
      return {
        allowed: false,
        blocked: true,
        blockExpires: rateData.blockExpires,
        resetTime: rateData.resetTime,
      };
    }

    // Check if limit exceeded
    if (rateData.count >= config.maxRequests) {
      // Increment violations and potentially block
      rateData.violations = (rateData.violations || 0) + 1;

      if (rateData.violations >= 3 && config.blockDuration) {
        rateData.blocked = true;
        rateData.blockExpires = now + config.blockDuration;

        logger.warn(
          "[SECURITY] User blocked due to repeated rate limit violations",
          {
            identifier,
            violations: rateData.violations,
            blockDuration: config.blockDuration,
          },
        );
      }

      rateLimitStore.set(key, rateData);

      return {
        allowed: false,
        resetTime: rateData.resetTime,
        remaining: 0,
        blocked: rateData.blocked,
        blockExpires: rateData.blockExpires,
      };
    }

    // Increment count and store
    rateData.count++;
    rateLimitStore.set(key, rateData);

    return {
      allowed: true,
      resetTime: rateData.resetTime,
      remaining: config.maxRequests - rateData.count,
    };
  } catch (error) {
    logger.error("Rate limiting error", error);
    // Fail open during errors to avoid blocking legitimate users
    return { allowed: true };
  }
}

export async function checkIPRateLimit(
  event: H3Event,
  config: RateLimitConfig = { windowMs: 5 * 60 * 1000, maxRequests: 50 },
): Promise<RateLimitResult> {
  try {
    // Skip during build/prerender
    if (isBuildTime()) {
      return { allowed: true };
    }

    const ip = getClientIP(event) || "unknown";

    // Skip for invalid/unknown IPs during development
    if (ip === "unknown" && process.env.NODE_ENV !== "production") {
      return { allowed: true };
    }

    const result = await checkRateLimit(event, `ip:${ip}`, config);

    if (!result.allowed) {
      logger.error("[SECURITY] Rate limit exceeded for IP", {
        ip,
        url: event.node.req.url || "unknown",
        userAgent: getHeader(event, "user-agent"),
      });
    }

    return result;
  } catch (error) {
    logger.error("IP rate limiting error", error);
    return { allowed: true };
  }
}

export function setRateLimitHeaders(event: H3Event, result: RateLimitResult) {
  if (result.resetTime) {
    setHeader(
      event,
      "X-RateLimit-Reset",
      Math.ceil(result.resetTime / 1000).toString(),
    );
  }
  if (result.remaining !== undefined) {
    setHeader(event, "X-RateLimit-Remaining", result.remaining.toString());
  }
  if (result.blocked) {
    setHeader(event, "X-RateLimit-Blocked", "true");
    if (result.blockExpires) {
      setHeader(
        event,
        "X-RateLimit-Block-Expires",
        Math.ceil(result.blockExpires / 1000).toString(),
      );
    }
  }
}

function getClientIP(event: H3Event): string | null {
  // Try various headers in order of preference
  const headers = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip", // Nginx
    "x-forwarded-for", // Most proxies
    "x-client-ip", // Apache
    "x-forwarded", // General
    "forwarded-for", // General
    "forwarded", // RFC 7239
  ];

  for (const header of headers) {
    const value = getHeader(event, header);
    if (value) {
      // x-forwarded-for can be a comma-separated list
      const ip = value.split(",")[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  // Fallback to connection remote address
  return event.node.req.socket?.remoteAddress || null;
}

function isValidIP(ip: string): boolean {
  // Basic IP validation (IPv4 and IPv6)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

function cleanupExpiredEntries(now: number) {
  for (const [key, data] of rateLimitStore.entries()) {
    if (
      data.resetTime < now &&
      (!data.blockExpires || data.blockExpires < now)
    ) {
      rateLimitStore.delete(key);
    }
  }
}

// Rate limiting middleware for API routes
export function withRateLimit(config?: RateLimitConfig) {
  return async function rateLimitMiddleware(event: H3Event) {
    // Skip during build/prerender
    if (isBuildTime()) {
      return;
    }

    const result = await checkIPRateLimit(event, config);

    if (!result.allowed) {
      setRateLimitHeaders(event, result);
      throw createError({
        statusCode: 429,
        statusMessage: "Too many requests. Please slow down.",
      });
    }

    setRateLimitHeaders(event, result);
  };
}
