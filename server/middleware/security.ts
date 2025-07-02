import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  // TEMPORARILY DISABLED FOR RAILWAY DEBUGGING
  // Only apply minimal security to API routes
  if (!event.node.req.url?.startsWith("/api/")) {
    return;
  }

  // Skip all security checks for now - just basic headers
  try {
    // Basic security headers only
    setHeader(event, "X-Content-Type-Options", "nosniff");
    setHeader(event, "X-Frame-Options", "DENY");
    
    console.log(`[SECURITY] Minimal security applied to ${event.node.req.url}`);
  } catch (error: any) {
    console.error("[SECURITY] Error:", error.message);
    // Don't throw - let the request continue
  }
});