// tests/e2e/user-flows/complete-user-journey.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Complete User Journey Testing", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "TestPassword123!";

  test("complete user registration to audit completion flow", async ({
    page,
  }) => {
    // Step 1: Homepage navigation
    await page.goto("/");
    await expect(page).toHaveTitle(/Neon SEO Beacon/);

    // Step 2: Navigate to registration
    await page.click('[data-testid="get-started-btn"]');
    await expect(page).toHaveURL(/auth\/register/);

    // Step 3: User registration
    await page.fill('[data-testid="email-input"]', testEmail);
    await page.fill('[data-testid="password-input"]', testPassword);
    await page.fill('[data-testid="confirm-password-input"]', testPassword);
    await page.click('[data-testid="register-btn"]');

    // Step 4: Verify successful registration and redirect
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();

    // Step 5: Create first audit
    await page.click('[data-testid="create-audit-btn"]');
    await page.fill('[data-testid="url-input"]', "https://example.com");
    await page.selectOption('[data-testid="audit-type"]', "comprehensive");
    await page.check('[data-testid="include-performance"]');
    await page.click('[data-testid="submit-audit-btn"]');

    // Step 6: Monitor audit progress
    await expect(
      page.locator('[data-testid="processing-status"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();

    // Verify progress updates
    await expect(page.locator('[data-testid="progress-step"]')).toContainText(
      "Fetching",
    );
    await page.waitForFunction(
      () => {
        const progressBar = document.querySelector(
          '[data-testid="progress-bar"]',
        );
        return (
          progressBar && parseInt(progressBar.getAttribute("value") || "0") > 20
        );
      },
      { timeout: 10000 },
    );

    // Step 7: Wait for completion and verify results
    await page.waitForSelector('[data-testid="audit-completed"]', {
      timeout: 60000,
    });

    // Verify all result sections are present
    await expect(page.locator('[data-testid="seo-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="meta-analysis"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="performance-metrics"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="technical-seo"]')).toBeVisible();

    // Step 8: Verify score is valid
    const scoreElement = page.locator('[data-testid="seo-score-value"]');
    const score = await scoreElement.textContent();
    expect(parseInt(score || "0")).toBeGreaterThanOrEqual(0);
    expect(parseInt(score || "0")).toBeLessThanOrEqual(100);

    // Step 9: Test audit history
    await page.click('[data-testid="audit-history-tab"]');
    await expect(page.locator('[data-testid="audit-item"]')).toHaveCount(1);

    // Step 10: Test account menu and logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-btn"]');
    await expect(page).toHaveURL("/");
  });

  test("authenticated user workflow - login and multiple audits", async ({
    page,
  }) => {
    // Assume user exists from previous test or setup
    await page.goto("/auth/login");

    await page.fill('[data-testid="email-input"]', testEmail);
    await page.fill('[data-testid="password-input"]', testPassword);
    await page.click('[data-testid="login-btn"]');

    await expect(page).toHaveURL(/dashboard/);

    // Create multiple audits to test dashboard functionality
    const urls = [
      "https://google.com",
      "https://github.com",
      "https://nuxt.com",
    ];

    for (let i = 0; i < urls.length; i++) {
      await page.click('[data-testid="create-audit-btn"]');
      await page.fill('[data-testid="url-input"]', urls[i]);
      await page.click('[data-testid="submit-audit-btn"]');

      // Wait for processing to start
      await expect(
        page.locator('[data-testid="processing-status"]'),
      ).toBeVisible();

      // Don't wait for completion, just verify it started
      await page.waitForTimeout(2000);

      // Go back to dashboard for next audit
      await page.click('[data-testid="dashboard-home"]');
    }

    // Verify multiple audits in history
    await page.click('[data-testid="audit-history-tab"]');
    const auditCount = await page.locator('[data-testid="audit-item"]').count();
    expect(auditCount).toBeGreaterThan(0);
  });
});
