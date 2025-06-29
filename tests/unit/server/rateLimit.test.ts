// tests/unit/server/rateLimit.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock rate limiting utility
class MockRateLimit {
  private requests: Map<string, number[]> = new Map()
  private limits = {
    seo_analysis: { count: 10, window: 60000 }, // 10 requests per minute
    audit_creation: { count: 5, window: 300000 }, // 5 audits per 5 minutes
    api_general: { count: 100, window: 60000 } // 100 requests per minute
  }

  checkLimit(key: string, type: keyof typeof this.limits): boolean {
    const now = Date.now()
    const limit = this.limits[type]
    
    if (!this.requests.has(key)) {
      this.requests.set(key, [])
    }

    const userRequests = this.requests.get(key)!
    
    // Remove expired requests
    const cutoff = now - limit.window
    const validRequests = userRequests.filter(time => time > cutoff)
    
    if (validRequests.length >= limit.count) {
      return false // Rate limited
    }

    validRequests.push(now)
    this.requests.set(key, validRequests)
    return true // Request allowed
  }

  getRemainingRequests(key: string, type: keyof typeof this.limits): number {
    const now = Date.now()
    const limit = this.limits[type]
    
    if (!this.requests.has(key)) {
      return limit.count
    }

    const userRequests = this.requests.get(key)!
    const cutoff = now - limit.window
    const validRequests = userRequests.filter(time => time > cutoff)
    
    return Math.max(0, limit.count - validRequests.length)
  }

  reset(key?: string): void {
    if (key) {
      this.requests.delete(key)
    } else {
      this.requests.clear()
    }
  }
}

describe('Rate Limiting Server Utils', () => {
  let rateLimit: MockRateLimit

  beforeEach(() => {
    rateLimit = new MockRateLimit()
  })

  describe('checkLimit', () => {
    it('should allow requests within limit', () => {
      const key = 'user_123'
      
      // Make requests within limit
      for (let i = 0; i < 5; i++) {
        expect(rateLimit.checkLimit(key, 'audit_creation')).toBe(true)
      }
    })

    it('should block requests over limit', () => {
      const key = 'user_123'
      
      // Exhaust the limit
      for (let i = 0; i < 5; i++) {
        rateLimit.checkLimit(key, 'audit_creation')
      }
      
      // Next request should be blocked
      expect(rateLimit.checkLimit(key, 'audit_creation')).toBe(false)
    })

    it('should handle different rate limit types', () => {
      const key = 'user_123'
      
      // SEO analysis has higher limit (10/min) than audit creation (5/5min)
      for (let i = 0; i < 8; i++) {
        expect(rateLimit.checkLimit(key, 'seo_analysis')).toBe(true)
      }
      
      // Should still allow more SEO analysis
      expect(rateLimit.checkLimit(key, 'seo_analysis')).toBe(true)
    })

    it('should handle different users independently', () => {
      const user1 = 'user_123'
      const user2 = 'user_456'
      
      // Exhaust limit for user1
      for (let i = 0; i < 5; i++) {
        rateLimit.checkLimit(user1, 'audit_creation')
      }
      
      // user2 should still be allowed
      expect(rateLimit.checkLimit(user2, 'audit_creation')).toBe(true)
      
      // user1 should be blocked
      expect(rateLimit.checkLimit(user1, 'audit_creation')).toBe(false)
    })
  })

  describe('getRemainingRequests', () => {
    it('should return full limit for new user', () => {
      const remaining = rateLimit.getRemainingRequests('new_user', 'seo_analysis')
      expect(remaining).toBe(10)
    })

    it('should decrease remaining requests', () => {
      const key = 'user_123'
      
      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        rateLimit.checkLimit(key, 'seo_analysis')
      }
      
      const remaining = rateLimit.getRemainingRequests(key, 'seo_analysis')
      expect(remaining).toBe(7)
    })

    it('should return 0 when limit exceeded', () => {
      const key = 'user_123'
      
      // Exhaust the limit
      for (let i = 0; i < 10; i++) {
        rateLimit.checkLimit(key, 'seo_analysis')
      }
      
      const remaining = rateLimit.getRemainingRequests(key, 'seo_analysis')
      expect(remaining).toBe(0)
    })
  })

  describe('reset', () => {
    it('should reset specific user limits', () => {
      const key = 'user_123'
      
      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        rateLimit.checkLimit(key, 'audit_creation')
      }
      
      expect(rateLimit.checkLimit(key, 'audit_creation')).toBe(false)
      
      // Reset and try again
      rateLimit.reset(key)
      expect(rateLimit.checkLimit(key, 'audit_creation')).toBe(true)
    })

    it('should reset all limits when no key provided', () => {
      const user1 = 'user_123'
      const user2 = 'user_456'
      
      // Exhaust limits for both users
      for (let i = 0; i < 5; i++) {
        rateLimit.checkLimit(user1, 'audit_creation')
        rateLimit.checkLimit(user2, 'audit_creation')
      }
      
      // Both should be blocked
      expect(rateLimit.checkLimit(user1, 'audit_creation')).toBe(false)
      expect(rateLimit.checkLimit(user2, 'audit_creation')).toBe(false)
      
      // Reset all
      rateLimit.reset()
      
      // Both should work again
      expect(rateLimit.checkLimit(user1, 'audit_creation')).toBe(true)
      expect(rateLimit.checkLimit(user2, 'audit_creation')).toBe(true)
    })
  })
})
