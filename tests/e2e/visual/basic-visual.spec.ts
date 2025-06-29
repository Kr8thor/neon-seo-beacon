// tests/e2e/visual/basic-visual.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Basic Visual Regression Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure consistent viewport for visual testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("homepage visual consistency", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load completely
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("homepage-basic.png", {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 1000,
    });
  });

  test("dashboard page visual consistency", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for page to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Take screenshot regardless of what's on the page
    await expect(page).toHaveScreenshot("dashboard-basic.png", {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 1500,
    });
  });

  test("pricing page visual consistency", async ({ page }) => {
    await page.goto("/pricing");

    // Wait for page to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("pricing-basic.png", {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 800,
    });
  });

  test("mobile responsive homepage", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("mobile-homepage.png", {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 500,
    });
  });
});
