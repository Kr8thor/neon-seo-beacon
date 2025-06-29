// tests/performance/load-testing.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Advanced Performance Testing', () => {
  test('concurrent user load test', async ({ page, context }) => {
    // Test multiple concurrent audit requests
    const concurrentUsers = 5
    const testUrl = 'https://example.com'
    
    // Create multiple browser contexts to simulate different users
    const contexts = await Promise.all(
      Array(concurrentUsers).fill(null).map(() => 
        page.context().browser()!.newContext()
      )
    )
    
    const pages = await Promise.all(
      contexts.map(ctx => ctx.newPage())
    )
    
    const startTime = Date.now()
    
    // Start audits simultaneously
    const auditPromises = pages.map(async (userPage, index) => {
      await userPage.goto('/dashboard')
      
      // Simulate user creating audit
      await userPage.click('[data-testid="create-audit-btn"]')
      await userPage.fill('[data-testid="url-input"]', `${testUrl}?user=${index}`)
      await userPage.click('[data-testid="submit-audit-btn"]')
      
      // Wait for processing to start
      await userPage.waitForSelector('[data-testid="processing-status"]', { timeout: 10000 })
      
      return userPage
    })
    
    // Wait for all audits to start processing
    await Promise.all(auditPromises)
    
    const processingTime = Date.now() - startTime
    
    // Verify system can handle concurrent load
    expect(processingTime).toBeLessThan(10000) // Should start within 10 seconds
    
    // Monitor system doesn't crash under load
    for (const userPage of pages) {
      await expect(userPage.locator('[data-testid="processing-status"]')).toBeVisible()
    }
    
    // Cleanup
    await Promise.all(contexts.map(ctx => ctx.close()))
  })

  test('memory leak detection', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize
      } : null
    })
    
    // Perform multiple operations that could cause memory leaks
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="create-audit-btn"]')
      await page.fill('[data-testid="url-input"]', `https://example${i}.com`)
      await page.click('[data-testid="submit-audit-btn"]')
      
      // Wait a bit then cancel/reset
      await page.waitForTimeout(1000)
      await page.click('[data-testid="cancel-audit"]', { timeout: 5000 }).catch(() => {})
      await page.goto('/dashboard') // Reset page state
    }
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc()
      }
    })
    
    // Check final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize
      } : null
    })
    
    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100
      
      // Memory shouldn't increase by more than 50% after operations
      expect(memoryIncreasePercent).toBeLessThan(50)
    }
  })

  test('page load performance benchmarks', async ({ page }) => {
    const performanceMetrics = {
      homepage: '//',
      dashboard: '/dashboard',
      results: '/dashboard?tab=results'
    }
    
    for (const [pageName, url] of Object.entries(performanceMetrics)) {
      const startTime = Date.now()
      
      await page.goto(url)
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Get detailed performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        }
      })
      
      // Performance assertions
      expect(loadTime).toBeLessThan(5000) // Total load time < 5s
      expect(metrics.firstContentfulPaint).toBeLessThan(2000) // FCP < 2s
      expect(metrics.domContentLoaded).toBeLessThan(1000) // DOM ready < 1s
      
      console.log(`${pageName} performance:`, {
        totalLoad: loadTime,
        ...metrics
      })
    }
  })

  test('api response time monitoring', async ({ page }) => {
    const apiEndpoints = [
      { name: 'Health Check', url: '/api/health' },
      { name: 'SEO Analysis', url: '/api/seo/analyze', method: 'POST', body: { url: 'https://example.com' } }
    ]
    
    for (const endpoint of apiEndpoints) {
      const startTime = Date.now()
      
      let response
      if (endpoint.method === 'POST') {
        response = await page.request.post(endpoint.url, {
          data: endpoint.body
        })
      } else {
        response = await page.request.get(endpoint.url)
      }
      
      const responseTime = Date.now() - startTime
      
      // Verify response is successful and fast
      expect(response.status()).toBeLessThan(400)
      expect(responseTime).toBeLessThan(2000) // API responses < 2s
      
      console.log(`${endpoint.name} response time: ${responseTime}ms`)
    }
  })
})
