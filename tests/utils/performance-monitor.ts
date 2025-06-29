// tests/utils/performance-monitor.ts
import { Page } from "@playwright/test";

export class PerformanceMonitor {
  private metrics: Array<{ name: string; value: number; timestamp: number }> =
    [];

  async measurePageLoad(page: Page, url: string) {
    const startTime = Date.now();

    await page.goto(url);
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    this.recordMetric("page-load-time", loadTime);

    // Get additional metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstPaint:
          performance.getEntriesByName("first-paint")[0]?.startTime || 0,
        firstContentfulPaint:
          performance.getEntriesByName("first-contentful-paint")[0]
            ?.startTime || 0,
      };
    });

    Object.entries(performanceMetrics).forEach(([key, value]) => {
      this.recordMetric(key, value);
    });

    return { loadTime, ...performanceMetrics };
  }

  async measureApiResponse(url: string, method = "GET", body?: any) {
    const startTime = Date.now();

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseTime = Date.now() - startTime;
    this.recordMetric(`api-${method.toLowerCase()}-${url}`, responseTime);

    return { response, responseTime };
  }

  recordMetric(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });
  }

  getMetrics() {
    return this.metrics;
  }

  getAverageMetric(name: string) {
    const values = this.metrics
      .filter((m) => m.name === name)
      .map((m) => m.value);

    return values.length ? values.reduce((a, b) => a + b) / values.length : 0;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        totalMetrics: this.metrics.length,
        averagePageLoad: this.getAverageMetric("page-load-time"),
        averageApiResponse: this.getAverageMetric("api-response"),
      },
    };

    return report;
  }
}
