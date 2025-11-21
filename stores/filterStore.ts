/**
 * Filter Store
 * Global filter state management
 */

import { defineStore } from 'pinia'

interface FilterState {
  global: {
    search: string
    dateRange: { from: Date | null; to: Date | null }
  }
  audit: {
    status: string[]
    severity: string[]
    category: string[]
    scoreRange: { min: number; max: number }
  }
  comparison: {
    baselineAuditId: string | null
    compareAuditId: string | null
  }
  view: {
    showOnlyIssues: boolean
    groupBy: 'severity' | 'category' | 'page' | 'none'
    expandedGroups: string[]
  }
}

export const useFilterStore = defineStore('filters', {
  state: (): FilterState => ({
    global: {
      search: '',
      dateRange: { from: null, to: null },
    },
    audit: {
      status: [],
      severity: [],
      category: [],
      scoreRange: { min: 0, max: 100 },
    },
    comparison: {
      baselineAuditId: null,
      compareAuditId: null,
    },
    view: {
      showOnlyIssues: false,
      groupBy: 'severity',
      expandedGroups: [],
    },
  }),

  getters: {
    hasActiveFilters(state): boolean {
      return (
        state.global.search !== '' ||
        state.global.dateRange.from !== null ||
        state.global.dateRange.to !== null ||
        state.audit.status.length > 0 ||
        state.audit.severity.length > 0 ||
        state.audit.category.length > 0 ||
        state.audit.scoreRange.min > 0 ||
        state.audit.scoreRange.max < 100
      )
    },

    activeFilterCount(state): number {
      let count = 0
      if (state.global.search) count++
      if (state.global.dateRange.from || state.global.dateRange.to) count++
      count += state.audit.status.length
      count += state.audit.severity.length
      count += state.audit.category.length
      if (state.audit.scoreRange.min > 0 || state.audit.scoreRange.max < 100) count++
      return count
    },

    isComparing(state): boolean {
      return state.comparison.baselineAuditId !== null && state.comparison.compareAuditId !== null
    },
  },

  actions: {
    // Global filters
    setSearchQuery(query: string) {
      this.global.search = query
    },

    setDateRange(from: Date | null, to: Date | null) {
      this.global.dateRange = { from, to }
    },

    // Audit filters
    setAuditStatusFilter(statuses: string[]) {
      this.audit.status = statuses
    },

    toggleAuditStatus(status: string) {
      const index = this.audit.status.indexOf(status)
      if (index >= 0) {
        this.audit.status.splice(index, 1)
      } else {
        this.audit.status.push(status)
      }
    },

    setAuditSeverityFilter(severities: string[]) {
      this.audit.severity = severities
    },

    toggleAuditSeverity(severity: string) {
      const index = this.audit.severity.indexOf(severity)
      if (index >= 0) {
        this.audit.severity.splice(index, 1)
      } else {
        this.audit.severity.push(severity)
      }
    },

    setAuditCategoryFilter(categories: string[]) {
      this.audit.category = categories
    },

    toggleAuditCategory(category: string) {
      const index = this.audit.category.indexOf(category)
      if (index >= 0) {
        this.audit.category.splice(index, 1)
      } else {
        this.audit.category.push(category)
      }
    },

    setScoreRange(min: number, max: number) {
      this.audit.scoreRange = {
        min: Math.max(0, Math.min(min, 100)),
        max: Math.max(0, Math.min(max, 100)),
      }
    },

    // Comparison
    setBaselineAudit(id: string | null) {
      this.comparison.baselineAuditId = id
    },

    setCompareAudit(id: string | null) {
      this.comparison.compareAuditId = id
    },

    clearComparison() {
      this.comparison.baselineAuditId = null
      this.comparison.compareAuditId = null
    },

    // View settings
    setShowOnlyIssues(show: boolean) {
      this.view.showOnlyIssues = show
    },

    setGroupBy(groupBy: 'severity' | 'category' | 'page' | 'none') {
      this.view.groupBy = groupBy
    },

    toggleGroup(groupId: string) {
      const index = this.view.expandedGroups.indexOf(groupId)
      if (index >= 0) {
        this.view.expandedGroups.splice(index, 1)
      } else {
        this.view.expandedGroups.push(groupId)
      }
    },

    expandAllGroups(groupIds: string[]) {
      this.view.expandedGroups = [...groupIds]
    },

    collapseAllGroups() {
      this.view.expandedGroups = []
    },

    // Reset
    resetGlobalFilters() {
      this.global = {
        search: '',
        dateRange: { from: null, to: null },
      }
    },

    resetAuditFilters() {
      this.audit = {
        status: [],
        severity: [],
        category: [],
        scoreRange: { min: 0, max: 100 },
      }
    },

    resetViewSettings() {
      this.view = {
        showOnlyIssues: false,
        groupBy: 'severity',
        expandedGroups: [],
      }
    },

    reset() {
      this.resetGlobalFilters()
      this.resetAuditFilters()
      this.clearComparison()
      this.resetViewSettings()
    },
  },
})
