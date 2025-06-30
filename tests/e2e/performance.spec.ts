// tests/performance/core-web-vitals.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Performance Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("homepage performance metrics", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);

    // Test Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: {
          fcp?: number;
          lcp?: number;
          cls?: number;
          fid?: number;
        } = {};

        // Measure FCP (First Contentful Paint)
        const fcpEntry = performance.getEntriesByName(
          "first-contentful-paint",
        )[0];
        if (fcpEntry) {
          vitals.fcp = fcpEntry.startTime;
        }

        // Measure LCP using PerformanceObserver
        let lcpValue = 0;
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcpValue = lastEntry.startTime;
          });
          observer.observe({ entryTypes: ["largest-contentful-paint"] });

          // Wait a bit for LCP measurement
          setTimeout(() => {
            observer.disconnect();
            vitals.lcp = lcpValue;

            // Measure CLS
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                }
              }
            });
            clsObserver.observe({ entryTypes: ["layout-shift"] });

            setTimeout(() => {
              clsObserver.disconnect();
              vitals.cls = clsValue;
              resolve(vitals);
            }, 1000);
          }, 2000);
        } catch (error) {
          console.log("Performance measurement not supported");
          resolve(vitals);
        }
      });
    });

    console.log("Core Web Vitals:", vitals);

    // Performance assertions
    expect(loadTime).toBeLessThan(5000); // 5 second max load time

    if ((vitals as any).fcp) {
      expect((vitals as any).fcp).toBeLessThan(2000); // FCP < 2s
    }

    if ((vitals as any).lcp) {
      expect((vitals as any).lcp).toBeLessThan(3000); // LCP < 3s
    }

    if ((vitals as any).cls !== undefined) {
      expect((vitals as any).cls).toBeLessThan(0.1); // CLS < 0.1
    }
  });

  test("dashboard performance metrics", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    console.log(`Dashboard load time: ${loadTime}ms`);

    // Dashboard should load reasonably fast
    expect(loadTime).toBeLessThan(5000);
  });

  test("pricing page performance metrics", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    console.log(`Pricing page load time: ${loadTime}ms`);

    // Pricing page should load fast
    expect(loadTime).toBeLessThan(4000);
  });

  test("mobile performance", async ({ page }) => {
    // Test mobile performance
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    console.log(`Mobile load time: ${loadTime}ms`);

    // Mobile should still perform well
    expect(loadTime).toBeLessThan(6000);
  });

  test("api performance", async ({ page }) => {
    const startTime = Date.now();

    const response = await page.request.get("/api/health");

    const responseTime = Date.now() - startTime;
    console.log(`API response time: ${responseTime}ms`);

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(1000); // API should respond in < 1s
  });
});
