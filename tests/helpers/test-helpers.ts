// tests/helpers/test-helpers.ts
import { Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { TEST_USERS } from '../fixtures/test-data'

export class TestHelpers {
  private supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY!
  )

  async createTestUser(userData = TEST_USERS.validUser) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    })

    if (error) throw error
    return data.user
  }

  async cleanupTestUser(userId: string) {
    await this.supabase.auth.admin.deleteUser(userId)
  }

  async loginUser(page: Page, credentials = TEST_USERS.validUser) {
    await page.goto('/auth/login')
    await page.fill('[data-testid="email-input"]', credentials.email)
    await page.fill('[data-testid="password-input"]', credentials.password)
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/dashboard')
  }

  async createTestAudit(userId: string, url = 'https://example.com') {
    const { data, error } = await this.supabase
      .from('audits')
      .insert({
        user_id: userId,
        url,
        status: 'completed',
        score: 85,
        results: {
          title: { score: 85, content: 'Example Domain' },
          score: 85
        }
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async waitForAuditCompletion(page: Page, timeout = 30000) {
    await page.waitForSelector('[data-testid="audit-completed"]', { timeout })
  }

  async takeScreenshotOnFailure(page: Page, testName: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `failure-${testName}-${timestamp}.png`
    await page.screenshot({ 
      path: `test-results/screenshots/${filename}`,
      fullPage: true 
    })
    console.log(`Screenshot saved: ${filename}`)
  }

  async checkAccessibility(page: Page) {
    // Inject axe-core for accessibility testing
    await page.addScriptTag({ url: 'https://unpkg.com/axe-core@4.7.2/axe.min.js' })
    
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        axe.run((err, results) => {
          resolve(results)
        })
      })
    })

    return results
  }
}
