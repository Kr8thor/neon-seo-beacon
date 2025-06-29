import { getAllCircuitBreakers } from "~/server/utils/circuitBreaker";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get all circuit breaker stats
    const breakers = getAllCircuitBreakers();
    const stats = breakers.map((breaker) => breaker.getStats());

    return {
      success: true,
      data: {
        total: breakers.length,
        circuitBreakers: stats,
        summary: {
          open: stats.filter((s) => s.state === "OPEN").length,
          closed: stats.filter((s) => s.state === "CLOSED").length,
          halfOpen: stats.filter((s) => s.state === "HALF_OPEN").length,
        },
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Circuit breaker status error:", error);

    setResponseStatus(event, 500);
    return {
      success: false,
      error: "Failed to get circuit breaker status",
      message: (error as Error).message,
    };
  }
});
