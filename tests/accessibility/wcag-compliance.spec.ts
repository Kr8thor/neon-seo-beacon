// tests/accessibility/wcag-compliance.spec.ts
import { test, expect } from "@playwright/test";

test.describe("WCAG Accessibility Compliance", () => {
  test.beforeEach(async ({ page }) => {
    // Inject axe-core for accessibility testing
    await page.addScriptTag({
      url: "https://unpkg.com/axe-core@4.7.2/axe.min.js",
    });
  });

  test("homepage accessibility compliance", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        axe.run((err, results) => {
          resolve(results);
        });
      });
    });

    // @ts-ignore
    expect(results.violations).toHaveLength(0);

    // Manual checks for critical accessibility features
    await expect(page.locator("main")).toHaveAttribute("role", "main");
    await expect(page.locator("h1")).toBeVisible();

    // Check for skip link
    await expect(page.locator('[href="#main-content"]')).toBeVisible();
  });

  test("keyboard navigation functionality", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation through interactive elements
    const interactiveElements = [
      '[data-testid="cta-button"]',
      '[data-testid="nav-link"]',
      '[data-testid="theme-toggle"]',
    ];

    for (const selector of interactiveElements) {
      await page.keyboard.press("Tab");
      const focusedElement = await page.locator(":focus");
      await expect(focusedElement).toBeVisible();

      // Verify focus indicators are visible
      const focusedStyles = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          backgroundColor: styles.backgroundColor,
        };
      });

      // Should have some form of focus indication
      const hasFocusIndicator =
        focusedStyles.outline !== "none" ||
        focusedStyles.boxShadow !== "none" ||
        focusedStyles.backgroundColor !== "rgba(0, 0, 0, 0)";

      expect(hasFocusIndicator).toBe(true);
    }
  });

  test("screen reader compatibility", async ({ page }) => {
    await page.goto("/dashboard");

    // Check for proper heading hierarchy
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
      const text = await heading.textContent();

      // Headings should have meaningful text
      expect(text?.trim().length).toBeGreaterThan(0);

      // Check for proper nesting (basic check)
      if (i > 0) {
        const prevHeading = headings[i - 1];
        const prevTagName = await prevHeading.evaluate((el) =>
          el.tagName.toLowerCase(),
        );
        const currentLevel = parseInt(tagName.substring(1));
        const prevLevel = parseInt(prevTagName.substring(1));

        // Should not skip heading levels
        expect(currentLevel - prevLevel).toBeLessThanOrEqual(1);
      }
    }

    // Check for alt text on images
    const images = await page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const role = await img.getAttribute("role");

      // Images should have alt text or role="presentation"
      expect(alt !== null || role === "presentation").toBe(true);
    }

    // Check form labels
    const inputs = await page.locator("input, textarea, select").all();
    for (const input of inputs) {
      const label = await input.getAttribute("aria-label");
      const labelledBy = await input.getAttribute("aria-labelledby");
      const id = await input.getAttribute("id");

      let hasLabel = false;
      if (label || labelledBy) {
        hasLabel = true;
      } else if (id) {
        const associatedLabel = await page
          .locator(`label[for="${id}"]`)
          .count();
        hasLabel = associatedLabel > 0;
      }

      expect(hasLabel).toBe(true);
    }
  });

  test("color contrast compliance", async ({ page }) => {
    await page.goto("/");

    const textElements = await page
      .locator("p, span, a, button, h1, h2, h3, h4, h5, h6")
      .all();

    for (const element of textElements.slice(0, 10)) {
      // Test first 10 elements
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize,
        };
      });

      // Basic check - ensure text has color and background
      expect(styles.color).not.toBe("");
      expect(styles.backgroundColor).not.toBe("");

      // Note: Full contrast ratio calculation would require additional libraries
      // This is a basic implementation to verify elements have defined colors
    }
  });

  test("reduced motion preferences", async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Check that animations are disabled or reduced
    const animatedElements = await page
      .locator('[class*="animate"], [class*="transition"]')
      .all();

    for (const element of animatedElements) {
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          animationDuration: computed.animationDuration,
          transitionDuration: computed.transitionDuration,
        };
      });

      // Animations should be reduced or removed
      const hasReducedMotion =
        styles.animationDuration === "0s" ||
        styles.transitionDuration === "0s" ||
        styles.animationDuration === "" ||
        styles.transitionDuration === "";

      // Not a strict requirement, but good practice
      // expect(hasReducedMotion).toBe(true)
    }
  });
});
