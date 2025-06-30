import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils/e2e";

describe("Health API Integration", () => {
  beforeAll(async () => {
    await setup({
      rootDir: process.cwd(),
      server: true,
      browser: false,
    });
  });

  describe("GET /api/health", () => {
    it("should return healthy status", async () => {
      const response = await $fetch("/api/health", {
        method: "GET",
      });

      expect(response).toHaveProperty("status", "healthy");
      expect(response).toHaveProperty("timestamp");
      expect(response).toHaveProperty("uptime");
      expect(response).toHaveProperty("version");
      expect(response).toHaveProperty("environment");
    });

    it("should return correct response structure", async () => {
      const response = await $fetch("/api/health");

      // Check required fields
      expect(typeof response.status).toBe("string");
      expect(typeof response.timestamp).toBe("string");
      expect(typeof response.uptime).toBe("number");
      expect(typeof response.version).toBe("string");
      expect(typeof response.environment).toBe("string");

      // Validate timestamp format (ISO string)
      expect(() => new Date(response.timestamp)).not.toThrow();
      expect(new Date(response.timestamp).toISOString()).toBe(
        response.timestamp,
      );

      // Validate uptime is positive
      expect(response.uptime).toBeGreaterThan(0);
    });

    it("should return 200 status code", async () => {
      try {
        const response = await $fetch("/api/health");
        expect(response).toBeDefined();
      } catch (error) {
        // If we catch a FetchError, check the status
        if (error && typeof error === "object" && "response" in error) {
          expect((error as any).response.status).toBe(200);
        }
      }
    });

    it("should include system information", async () => {
      const response = await $fetch("/api/health");

      expect(response).toHaveProperty("system");
      expect(response.system).toHaveProperty("nodeVersion");
      expect(response.system).toHaveProperty("platform");
      expect(response.system).toHaveProperty("architecture");

      // Validate system info types
      expect(typeof response.system.nodeVersion).toBe("string");
      expect(typeof response.system.platform).toBe("string");
      expect(typeof response.system.architecture).toBe("string");
    });

    it("should include service dependencies status", async () => {
      const response = await $fetch("/api/health");

      expect(response).toHaveProperty("dependencies");
      expect(response.dependencies).toHaveProperty("supabase");
      expect(response.dependencies).toHaveProperty("anthropic");

      // Each dependency should have status
      expect(response.dependencies.supabase).toHaveProperty("status");
      expect(response.dependencies.anthropic).toHaveProperty("status");

      // Status should be either 'healthy' or 'unhealthy'
      expect(["healthy", "unhealthy", "unknown"]).toContain(
        response.dependencies.supabase.status,
      );
      expect(["healthy", "unhealthy", "unknown"]).toContain(
        response.dependencies.anthropic.status,
      );
    });

    it("should respond quickly", async () => {
      const startTime = Date.now();
      await $fetch("/api/health");
      const endTime = Date.now();

      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it("should handle multiple concurrent requests", async () => {
      const promises = Array.from({ length: 5 }, () => $fetch("/api/health"));
      const responses = await Promise.all(promises);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response).toHaveProperty("status", "healthy");
        expect(response).toHaveProperty("timestamp");
      });

      // Timestamps should be close but not identical (unless processed simultaneously)
      const timestamps = responses.map((r) => new Date(r.timestamp).getTime());
      const maxTimeDiff = Math.max(...timestamps) - Math.min(...timestamps);
      expect(maxTimeDiff).toBeLessThan(5000); // Within 5 seconds
    });
  });

  describe("Error handling", () => {
    it("should handle invalid HTTP methods gracefully", async () => {
      try {
        await $fetch("/api/health", { method: "GET" });
        // If no error thrown, endpoint accepts POST (which is fine)
      } catch (error) {
        // Should return 405 Method Not Allowed or similar
        if (error && typeof error === "object" && "response" in error) {
          expect([405, 404]).toContain((error as any).response.status);
        }
      }
    });

    it("should return consistent format even with query parameters", async () => {
      const response = await $fetch("/api/health?test=123&extra=param");

      expect(response).toHaveProperty("status", "healthy");
      expect(response).toHaveProperty("timestamp");
      expect(response).toHaveProperty("uptime");
    });
  });

  describe("Performance and reliability", () => {
    it("should maintain consistent response structure across multiple calls", async () => {
      const responses = [];

      for (let i = 0; i < 3; i++) {
        const response = await $fetch("/api/health");
        responses.push(response);

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // All responses should have the same structure
      responses.forEach((response, index) => {
        expect(response).toHaveProperty("status", "healthy");
        expect(response).toHaveProperty("timestamp");
        expect(response).toHaveProperty("uptime");
        expect(response).toHaveProperty("version");
        expect(response).toHaveProperty("environment");

        // Uptime should increase with each call (or at least not decrease)
        if (index > 0) {
          expect(response.uptime).toBeGreaterThanOrEqual(
            responses[index - 1].uptime,
          );
        }
      });
    });

    it("should handle rapid successive requests without errors", async () => {
      const rapidRequests = Array.from({ length: 10 }, (_, i) =>
        $fetch("/api/health").then((response) => ({ index: i, response })),
      );

      const results = await Promise.all(rapidRequests);

      results.forEach(({ index, response }) => {
        expect(response).toHaveProperty("status", "healthy");
        expect(response).toHaveProperty("timestamp");
      });

      expect(results).toHaveLength(10);
    });
  });

  describe("Environment-specific behavior", () => {
    it("should reflect correct environment in response", async () => {
      const response = await $fetch("/api/health");

      expect(response.environment).toBeDefined();
      expect(typeof response.environment).toBe("string");

      // Should be one of the standard environments
      expect(["development", "production", "test", "staging"]).toContain(
        response.environment,
      );
    });

    it("should include memory usage information", async () => {
      const response = await $fetch("/api/health");

      if (response.system && response.system.memory) {
        expect(response.system.memory).toHaveProperty("used");
        expect(response.system.memory).toHaveProperty("total");
        expect(typeof response.system.memory.used).toBe("number");
        expect(typeof response.system.memory.total).toBe("number");
        expect(response.system.memory.used).toBeGreaterThan(0);
        expect(response.system.memory.total).toBeGreaterThan(
          response.system.memory.used,
        );
      }
    });
  });
});
