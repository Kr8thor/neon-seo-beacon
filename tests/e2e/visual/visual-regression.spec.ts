// tests/e2e/visual/visual-regression.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Visual Regression Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure consistent viewport for visual testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("homepage visual consistency", async ({ page }) => {
    await page.goto("/");

    // Wait for animations and loading to complete
    await page.waitForTimeout(2000);
    await page.waitForLoadState("networkidle");

    // Hide dynamic elements that change (timestamps, etc.)
    await page.addStyleTag({
      content: `
        [data-testid="timestamp"],
        [data-testid="dynamic-content"] {
          visibility: hidden !important;
        }
      `,
    });

    // Take full page screenshot
    await expect(page).toHaveScreenshot("homepage-full.png", {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 1000,
    });
  });

  test("dashboard visual consistency", async ({ page }) => {
    // Mock user session for dashboard access
    await page.goto("/dashboard");

    // Wait for dashboard to load completely
    await page.waitForSelector('[data-testid="dashboard-loaded"]', {
      timeout: 10000,
    });
    await page.waitForTimeout(1000);

    // Hide dynamic elements
    await page.addStyleTag({
      content: `
        [data-testid="last-updated"],
        [data-testid="real-time-data"],
        .animate-spin {
          visibility: hidden !important;
        }
      `,
    });

    await expect(page).toHaveScreenshot("dashboard-full.png", {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 1500,
    });
  });

  test("audit results visual consistency", async ({ page }) => {
    // Navigate to a sample audit result
    await page.goto("/dashboard");

    // Create or navigate to sample audit
    await page.click('[data-testid="create-audit-btn"]');
    await page.fill('[data-testid="url-input"]', "https://example.com");
    await page.click('[data-testid="submit-audit-btn"]');

    // Wait for audit completion
    await page.waitForSelector('[data-testid="audit-completed"]', {
      timeout: 30000,
    });

    // Take screenshot of results
    await expect(
      page.locator('[data-testid="audit-results"]'),
    ).toHaveScreenshot("audit-results.png", {
      threshold: 0.2,
      maxDiffPixels: 800,
    });
  });

  test("mobile responsive visuals", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 500,
    });
  });

  test("dark mode visual consistency", async ({ page }) => {
    await page.goto("/");

    // Toggle dark mode
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 1000,
    });
  });
});
