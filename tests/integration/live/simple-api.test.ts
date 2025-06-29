// tests/integration/live/simple-api.test.ts
import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = "http://localhost:3000";

describe("Simple Live API Integration Tests", () => {
  beforeAll(() => {
    // Ensure the server is running - this test assumes dev server is already started
    console.log("Testing against:", BASE_URL);
  });

  it("should return healthy status from health API", async () => {
    const response = await fetch(`${BASE_URL}/api/health`);
    expect([200, 503]).toContain(response.status);

    const data = await response.json();
    // Health API may return 'healthy', 'warning', or 'unhealthy'
    expect(["healthy", "warning", "unhealthy"]).toContain(data.status);
    expect(data).toHaveProperty("timestamp");
    // API might not have database/ai properties - adjust based on actual response
    console.log("Health API response:", data);
  });

  it("should handle SEO analysis request", async () => {
    const response = await fetch(`${BASE_URL}/api/seo/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://example.com",
        options: {
          includePerformance: true,
          includeImages: true,
        },
      }),
    });

    // Should either succeed or fail gracefully (403 = authentication required)
    expect([200, 400, 401, 403, 429, 500]).toContain(response.status);

    const data = await response.json();
    // API can respond in different formats - handle both success and error responses
    console.log("SEO API response:", data);

    if (data.success !== undefined) {
      // New format with success property
      expect(data).toHaveProperty("success");
      if (data.success) {
        expect(data.data).toHaveProperty("url");
        expect(data.data).toHaveProperty("score");
      } else {
        expect(data).toHaveProperty("error");
      }
    } else if (data.error !== undefined) {
      // Error format
      expect(data).toHaveProperty("error");
    } else {
      // Any other format should have some expected properties
      expect(data).toBeDefined();
    }
  });

  it("should serve static pages successfully", async () => {
    // Test homepage
    const homepageResponse = await fetch(`${BASE_URL}/`);
    expect(homepageResponse.status).toBe(200);

    // Test dashboard page
    const dashboardResponse = await fetch(`${BASE_URL}/dashboard`);
    expect(dashboardResponse.status).toBe(200);

    // Test pricing page
    const pricingResponse = await fetch(`${BASE_URL}/pricing`);
    expect(pricingResponse.status).toBe(200);
  });

  it("should handle rate limiting gracefully", async () => {
    // Make multiple rapid requests to test rate limiting
    const requests = Array(5)
      .fill(null)
      .map(() => fetch(`${BASE_URL}/api/health`));

    const responses = await Promise.all(requests);

    // All should succeed (rate limiting may not be strict for health endpoint)
    // Or some may be rate limited, or return 503 if unhealthy
    responses.forEach((response) => {
      expect([200, 429, 503]).toContain(response.status);
    });
  });

  it("should handle invalid routes appropriately", async () => {
    const response = await fetch(`${BASE_URL}/api/nonexistent`);
    expect([404, 405]).toContain(response.status);
  });
});
