/**
 * Audit Store
 * Core audit data management with caching and filtering
 */

import { defineStore } from 'pinia'

export interface Finding {
  id: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  category: string
  affectedElements: number
  impact: number
  recommendation?: string
  learnMoreUrl?: string
}

export interface Audit {
  id: string
  url: string
  score: number
  status: 'queued' | 'processing' | 'completed' | 'failed'
  findings: Finding[]
  createdAt: Date
  updatedAt: Date
  metadata: Record<string, any>
  categoryScores?: Record<string, number>
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface AuditState {
  audits: Map<string, Audit>
  filter: {
    status: string[]
    severity: string[]
    category: string[]
    dateRange: { from: Date | null; to: Date | null }
    search: string
  }
  sort: {
    by: 'date' | 'score' | 'status' | 'url'
    order: 'asc' | 'desc'
  }
  cache: Map<string, CacheEntry<any>>
  loading: boolean
  error: string | null
  currentAuditId: string | null
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const useAuditStore = defineStore('audits', {
  state: (): AuditState => ({
    audits: new Map(),
    filter: {
      status: [],
      severity: [],
      category: [],
      dateRange: { from: null, to: null },
      search: '',
    },
    sort: {
      by: 'date',
      order: 'desc',
    },
    cache: new Map(),
    loading: false,
    error: null,
    currentAuditId: null,
  }),

  getters: {
    // Get all audits as array
    allAudits: (state): Audit[] => Array.from(state.audits.values()),

    // Get filtered and sorted audits
    filteredAudits(state): Audit[] {
      let results = Array.from(state.audits.values())

      // Apply search filter
      if (state.filter.search) {
        const search = state.filter.search.toLowerCase()
        results = results.filter(a =>
          a.url.toLowerCase().includes(search) ||
          a.findings.some(f =>
            f.title.toLowerCase().includes(search) ||
            f.description.toLowerCase().includes(search)
          )
        )
      }

      // Apply status filter
      if (state.filter.status.length > 0) {
        results = results.filter(a => state.filter.status.includes(a.status))
      }

      // Apply severity filter
      if (state.filter.severity.length > 0) {
        results = results.filter(a =>
          a.findings.some(f => state.filter.severity.includes(f.severity))
        )
      }

      // Apply category filter
      if (state.filter.category.length > 0) {
        results = results.filter(a =>
          a.findings.some(f => state.filter.category.includes(f.category))
        )
      }

      // Apply date range filter
      if (state.filter.dateRange.from) {
        results = results.filter(a => a.createdAt >= state.filter.dateRange.from!)
      }
      if (state.filter.dateRange.to) {
        results = results.filter(a => a.createdAt <= state.filter.dateRange.to!)
      }

      // Apply sorting
      results.sort((a, b) => {
        let comparison = 0
        switch (state.sort.by) {
          case 'date':
            comparison = b.createdAt.getTime() - a.createdAt.getTime()
            break
          case 'score':
            comparison = b.score - a.score
            break
          case 'status':
            comparison = a.status.localeCompare(b.status)
            break
          case 'url':
            comparison = a.url.localeCompare(b.url)
            break
        }
        return state.sort.order === 'asc' ? -comparison : comparison
      })

      return results
    },

    // Dashboard statistics
    statistics(state) {
      const audits = Array.from(state.audits.values())
      const completed = audits.filter(a => a.status === 'completed')
      const allFindings = audits.flatMap(a => a.findings)

      return {
        total: audits.length,
        completed: completed.length,
        processing: audits.filter(a => a.status === 'processing').length,
        queued: audits.filter(a => a.status === 'queued').length,
        failed: audits.filter(a => a.status === 'failed').length,
        avgScore: completed.length
          ? Math.round(completed.reduce((sum, a) => sum + a.score, 0) / completed.length)
          : 0,
        totalFindings: allFindings.length,
        criticalFindings: allFindings.filter(f => f.severity === 'critical').length,
        highFindings: allFindings.filter(f => f.severity === 'high').length,
      }
    },

    // Top critical issues across all audits
    criticalIssues(state): (Finding & { auditId: string; auditUrl: string })[] {
      return Array.from(state.audits.values())
        .flatMap(a => a.findings.map(f => ({
          ...f,
          auditId: a.id,
          auditUrl: a.url,
        })))
        .filter(f => f.severity === 'critical' || f.severity === 'high')
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 10)
    },

    // Recent audits
    recentAudits(state): Audit[] {
      return Array.from(state.audits.values())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
    },

    // Get current audit
    currentAudit(state): Audit | undefined {
      return state.currentAuditId ? state.audits.get(state.currentAuditId) : undefined
    },

    // Get audit by ID
    getAudit: (state) => (id: string): Audit | undefined => {
      return state.audits.get(id)
    },

    // Check if cache is valid
    isCacheValid: (state) => (key: string): boolean => {
      const cached = state.cache.get(key)
      return cached ? Date.now() - cached.timestamp < CACHE_TTL : false
    },
  },

  actions: {
    // Fetch all audits
    async fetchAudits(forceRefresh = false) {
      const cacheKey = 'audits_list'

      if (!forceRefresh && this.isCacheValid(cacheKey)) {
        const cached = this.cache.get(cacheKey)!
        this.audits = new Map(cached.data)
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{ audits: any[] }>('/api/sites/audits')
        const data = response.audits || []

        this.audits = new Map(data.map((a: any) => [
          a.id,
          {
            ...a,
            createdAt: new Date(a.created_at || a.createdAt),
            updatedAt: new Date(a.updated_at || a.updatedAt),
            findings: a.findings || [],
          },
        ]))

        this.cache.set(cacheKey, {
          data: Array.from(this.audits.entries()),
          timestamp: Date.now(),
        })
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch audits'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Fetch single audit
    async fetchAudit(id: string) {
      const cacheKey = `audit_${id}`

      if (this.isCacheValid(cacheKey)) {
        const cached = this.cache.get(cacheKey)!
        this.audits.set(id, cached.data)
        return cached.data
      }

      try {
        const data = await $fetch<any>(`/api/sites/${id}/results`)
        const audit: Audit = {
          id: data.id || id,
          url: data.url,
          score: data.score,
          status: data.status,
          findings: data.findings || [],
          createdAt: new Date(data.created_at || data.createdAt),
          updatedAt: new Date(data.updated_at || data.updatedAt),
          metadata: data.metadata || {},
          categoryScores: data.categoryScores,
        }

        this.audits.set(id, audit)
        this.cache.set(cacheKey, {
          data: audit,
          timestamp: Date.now(),
        })

        return audit
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch audit'
        throw err
      }
    },

    // Create new audit
    async createAudit(url: string, options: Record<string, any> = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<any>('/api/sites/audit', {
          method: 'POST',
          body: { url, ...options },
        })

        const audit: Audit = {
          id: response.auditId || response.id,
          url,
          score: 0,
          status: 'queued',
          findings: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: options,
        }

        this.audits.set(audit.id, audit)
        this.cache.delete('audits_list')

        return audit
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to create audit'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Optimistic update
    updateAuditOptimistic(id: string, update: Partial<Audit>) {
      const audit = this.audits.get(id)
      if (audit) {
        this.audits.set(id, { ...audit, ...update, updatedAt: new Date() })
        this.cache.delete(`audit_${id}`)
      }
    },

    // Set current audit
    setCurrentAudit(id: string | null) {
      this.currentAuditId = id
    },

    // Filter actions
    setSearchQuery(query: string) {
      this.filter.search = query
    },

    setStatusFilter(statuses: string[]) {
      this.filter.status = statuses
    },

    setSeverityFilter(severities: string[]) {
      this.filter.severity = severities
    },

    setCategoryFilter(categories: string[]) {
      this.filter.category = categories
    },

    setDateRange(from: Date | null, to: Date | null) {
      this.filter.dateRange = { from, to }
    },

    // Sort actions
    setSort(by: 'date' | 'score' | 'status' | 'url', order: 'asc' | 'desc') {
      this.sort.by = by
      this.sort.order = order
    },

    // Reset filters
    resetFilters() {
      this.filter = {
        status: [],
        severity: [],
        category: [],
        dateRange: { from: null, to: null },
        search: '',
      }
    },

    // Clear expired cache
    clearExpiredCache() {
      const now = Date.now()
      Array.from(this.cache.entries()).forEach(([key, value]) => {
        if (now - value.timestamp > CACHE_TTL) {
          this.cache.delete(key)
        }
      })
    },

    // Clear all data
    reset() {
      this.audits.clear()
      this.cache.clear()
      this.currentAuditId = null
      this.error = null
      this.resetFilters()
    },
  },
})
