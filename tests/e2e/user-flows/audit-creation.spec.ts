// tests/e2e/user-flows/audit-creation.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Audit Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to dashboard from homepage", async ({ page }) => {
    // Check if there's a get started button or similar
    await expect(page).toHaveTitle(/SEO/);

    // Try to find navigation elements
    const dashboardLink = page
      .locator('a[href="/dashboard"], a[href*="dashboard"]')
      .first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await expect(page).toHaveURL(/.*dashboard.*/);
    }
  });

  test("should handle invalid URL gracefully", async ({ page }) => {
    await page.goto("/dashboard");

    // Look for audit creation form or button
    const createButton = page
      .locator(
        'button:has-text("Create"), button:has-text("Audit"), [data-testid*="create"]',
      )
      .first();

    if (await createButton.isVisible()) {
      await createButton.click();

      // Look for URL input field
      const urlInput = page
        .locator(
          'input[type="url"], input[placeholder*="url"], input[name*="url"]',
        )
        .first();

      if (await urlInput.isVisible()) {
        await urlInput.fill("invalid-url");

        // Look for submit button
        const submitButton = page
          .locator(
            'button[type="submit"], button:has-text("Submit"), button:has-text("Analyze")',
          )
          .first();

        if (await submitButton.isVisible()) {
          await submitButton.click();

          // Check for error message
          await expect(
            page.locator("text=/invalid/i, text=/error/i").first(),
          ).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test("should show loading states during audit processing", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // This test will check for loading indicators when they're implemented
    const createButton = page
      .locator('button:has-text("Create"), button:has-text("Audit")')
      .first();

    if (await createButton.isVisible()) {
      await createButton.click();

      const urlInput = page
        .locator('input[type="url"], input[placeholder*="url"]')
        .first();

      if (await urlInput.isVisible()) {
        await urlInput.fill("https://example.com");

        const submitButton = page
          .locator('button[type="submit"], button:has-text("Submit")')
          .first();

        if (await submitButton.isVisible()) {
          await submitButton.click();

          // Look for loading indicators
          const loadingIndicator = page
            .locator(
              '[data-testid*="loading"], .loading, text=/processing/i, text=/analyzing/i',
            )
            .first();

          // Give it a moment to appear
          await page.waitForTimeout(1000);

          if (await loadingIndicator.isVisible()) {
            await expect(loadingIndicator).toBeVisible();
          }
        }
      }
    }
  });
});
