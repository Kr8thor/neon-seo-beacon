# Phase 1.4: Pinia Store Architecture

## Context
Build the state management foundation with caching, filtering, and real-time sync capabilities.

## Deliverables

### 1. Create `stores/auditStore.ts`
Core audit data management with caching and filtering:

```typescript
import { defineStore } from 'pinia';

interface Audit {
  id: string;
  url: string;
  score: number;
  status: 'queued' | 'processing' | 'completed' | 'error';
  findings: Finding[];
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  affectedElements: number;
  impact: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useAuditStore = defineStore('audits', {
  state: () => ({
    audits: new Map<string, Audit>(),
    filter: {
      status: [] as string[],
      severity: [] as string[],
      dateRange: { from: null as Date | null, to: null as Date | null },
    },
    sort: {
      by: 'date' as 'date' | 'score' | 'status',
      order: 'desc' as 'asc' | 'desc',
    },
    cache: new Map<string, { data: any; timestamp: number }>(),
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get all audits (filtered and sorted)
     */
    filteredAudits(state): Audit[] {
      let results = Array.from(state.audits.values());

      // Apply filters
      if (state.filter.status.length > 0) {
        results = results.filter(a => 
          state.filter.status.includes(a.status)
        );
      }

      if (state.filter.severity.length > 0) {
        results = results.filter(a =>
          a.findings.some(f => 
            state.filter.severity.includes(f.severity)
          )
        );
      }

      // Apply sorting
      results.sort((a, b) => {
        let comparison = 0;
        switch (state.sort.by) {
          case 'date':
            comparison = b.createdAt.getTime() - a.createdAt.getTime();
            break;
          case 'score':
            comparison = b.score - a.score;
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
        }
        return state.sort.order === 'asc' ? -comparison : comparison;
      });

      return results;
    },

    /**
     * Get statistics for dashboard
     */
    statistics(state): Record<string, number> {
      const audits = Array.from(state.audits.values());
      const completed = audits.filter(a => a.status === 'completed');
      
      return {
        total: audits.length,
        avgScore: completed.length
          ? Math.round(completed.reduce((sum, a) => sum + a.score, 0) / completed.length)
          : 0,
        completed: completed.length,
        processing: audits.filter(a => a.status === 'processing').length,
        critical: audits.flatMap(a => a.findings)
          .filter(f => f.severity === 'critical').length,
      };
    },

    /**
     * Get top critical issues across all audits
     */
    criticalIssues(state): Finding[] {
      return Array.from(state.audits.values())
        .flatMap(a => a.findings.map(f => ({ ...f, auditId: a.id })))
        .filter(f => f.severity === 'critical')
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 10);
    },

    /**
     * Get audit by ID with offline fallback
     */
    getAudit: (state) => (id: string): Audit | undefined => {
      return state.audits.get(id);
    },
  },

  actions: {
    /**
     * Fetch all audits with cache
     */
    async fetchAudits(forceRefresh = false) {
      const cacheKey = 'audits_list';
      
      // Check cache
      if (!forceRefresh && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          this.audits = new Map(cached.data);
          return;
        }
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch('/api/audits');
        const data = response.audits as Audit[];
        
        this.audits = new Map(data.map(a => [
          a.id,
          {
            ...a,
            createdAt: new Date(a.createdAt),
            updatedAt: new Date(a.updatedAt),
          },
        ]));

        // Cache result
        this.cache.set(cacheKey, {
          data: Array.from(this.audits.entries()),
          timestamp: Date.now(),
        });
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch audits';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch single audit
     */
    async fetchAudit(id: string) {
      const cacheKey = `audit_${id}`;
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          const audit = cached.data as Audit;
          this.audits.set(id, audit);
          return audit;
        }
      }

      try {
        const data = await $fetch(`/api/audits/${id}`);
        const audit: Audit = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        };

        this.audits.set(id, audit);
        this.cache.set(cacheKey, {
          data: audit,
          timestamp: Date.now(),
        });

        return audit;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch audit';
        throw err;
      }
    },

    /**
     * Optimistic UI update (update immediately, confirm later)
     */
    updateAuditOptimistic(id: string, update: Partial<Audit>) {
      const audit = this.audits.get(id);
      if (audit) {
        this.audits.set(id, { ...audit, ...update });
        // Invalidate cache
        this.cache.delete(`audit_${id}`);
      }
    },

    /**
     * Create new audit
     */
    async createAudit(url: string, type: string) {
      try {
        const response = await $fetch('/api/audits', {
          method: 'POST',
          body: { url, type },
        });

        const audit: Audit = {
          ...response.audit,
          createdAt: new Date(response.audit.createdAt),
          updatedAt: new Date(response.audit.updatedAt),
        };

        this.audits.set(audit.id, audit);
        // Invalidate list cache
        this.cache.delete('audits_list');

        return audit;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to create audit';
        throw err;
      }
    },

    /**
     * Update filters
     */
    setStatusFilter(statuses: string[]) {
      this.filter.status = statuses;
    },

    setSeverityFilter(severities: string[]) {
      this.filter.severity = severities;
    },

    /**
     * Update sort
     */
    setSort(by: string, order: 'asc' | 'desc') {
      this.sort.by = by as any;
      this.sort.order = order;
    },

    /**
     * Clear old cache entries
     */
    clearExpiredCache() {
      const now = Date.now();
      Array.from(this.cache.entries()).forEach(([key, value]) => {
        if (now - value.timestamp > CACHE_TTL) {
          this.cache.delete(key);
        }
      });
    },
  },
});
```

### 2. Create `stores/dashboardStore.ts`
Dashboard layout and widget state:

```typescript
export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    widgets: [] as DashboardWidget[],
    layouts: [] as DashboardLayout[],
    currentLayout: 'default',
    autoRefresh: true,
    refreshInterval: 60000,
    lastRefresh: Date.now(),
  }),

  getters: {
    visibleWidgets: (state) => state.widgets.filter(w => !w.hidden),
    
    gridColumns: () => 12,
    
    layoutPresets: (state) => state.layouts.map(l => ({
      name: l.name,
      description: l.description,
      widgetCount: l.widgets.length,
    })),
  },

  actions: {
    loadLayout(name: string) {
      const layout = this.layouts.find(l => l.name === name);
      if (layout) {
        this.widgets = JSON.parse(JSON.stringify(layout.widgets));
        this.currentLayout = name;
      }
    },

    saveLayout(name: string, description?: string) {
      const existing = this.layouts.findIndex(l => l.name === name);
      const layout: DashboardLayout = {
        name,
        description: description || '',
        widgets: JSON.parse(JSON.stringify(this.widgets)),
        created: Date.now(),
      };

      if (existing >= 0) {
        this.layouts[existing] = layout;
      } else {
        this.layouts.push(layout);
      }

      // Persist to localStorage
      localStorage.setItem('dashboard_layouts', JSON.stringify(this.layouts));
    },

    toggleWidget(id: string) {
      const widget = this.widgets.find(w => w.id === id);
      if (widget) widget.hidden = !widget.hidden;
    },

    removeWidget(id: string) {
      this.widgets = this.widgets.filter(w => w.id !== id);
    },

    addWidget(widget: DashboardWidget) {
      this.widgets.push(widget);
    },

    updateWidgetPosition(id: string, x: number, y: number) {
      const widget = this.widgets.find(w => w.id === id);
      if (widget) {
        widget.posX = x;
        widget.posY = y;
      }
    },

    triggerRefresh() {
      this.lastRefresh = Date.now();
    },
  },
});
```

### 3. Create `stores/filterStore.ts`
Global filter state:

```typescript
export const useFilterStore = defineStore('filters', {
  state: () => ({
    global: {
      search: '',
      dateRange: { from: null as Date | null, to: null as Date | null },
    },
    audit: {
      status: [] as string[],
      severity: [] as string[],
    },
  }),

  actions: {
    setSearchQuery(query: string) {
      this.global.search = query;
    },

    setDateRange(from: Date | null, to: Date | null) {
      this.global.dateRange = { from, to };
    },

    setAuditStatusFilter(statuses: string[]) {
      this.audit.status = statuses;
    },

    setAuditSeverityFilter(severities: string[]) {
      this.audit.severity = severities;
    },

    reset() {
      this.global = {
        search: '',
        dateRange: { from: null, to: null },
      };
      this.audit = {
        status: [],
        severity: [],
      };
    },
  },
});
```

## Testing
- Fetch audits and verify caching works
- Update audit and verify optimistic UI
- Switch between layouts
- Verify filter changes update computed getter
- Test cache expiration (TTL)

## Acceptance Criteria
- ✅ All stores initialize without errors
- ✅ Caching works with TTL
- ✅ Optimistic updates don't break UI
- ✅ Filters compute correctly
- ✅ Persists to localStorage/sessionStorage
- ✅ No memory leaks from cache growth