// tests/e2e/cross-browser/browser-compatibility.spec.ts
import { test, expect, devices } from '@playwright/test'

test.describe('Cross-Browser Compatibility', () => {
  const browsers = ['chromium', 'firefox', 'webkit']
  const testUrl = 'https://example.com'

  browsers.forEach(browserName => {
    test(`audit creation works in ${browserName}`, async ({ page }) => {
      await page.goto('/dashboard')
      
      // Test basic audit creation across browsers
      await page.click('[data-testid="create-audit-btn"]')
      await page.fill('[data-testid="url-input"]', testUrl)
      await page.click('[data-testid="submit-audit-btn"]')
      
      // Verify processing starts
      await expect(page.locator('[data-testid="processing-status"]')).toBeVisible()
      
      // Check browser-specific features
      if (browserName === 'webkit') {
        // Safari-specific checks
        await expect(page.locator('body')).toHaveCSS('font-family', /system-ui/)
      } else if (browserName === 'firefox') {
        // Firefox-specific checks
        const userAgent = await page.evaluate(() => navigator.userAgent)
        expect(userAgent).toContain('Firefox')
      }
    })
  })

  test('responsive design works across devices', async ({ page }) => {
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')
      
      // Check navigation works on all screen sizes
      if (viewport.width < 768) {
        // Mobile: should have hamburger menu
        await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible()
      } else {
        // Desktop/Tablet: should have full navigation
        await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible()
      }
      
      // Check key elements are visible and properly positioned
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()
      await expect(page.locator('[data-testid="cta-button"]')).toBeVisible()
      
      // Test button interactions
      const ctaButton = page.locator('[data-testid="cta-button"]')
      await expect(ctaButton).toBeVisible()
      await expect(ctaButton).toBeEnabled()
    }
  })
})
