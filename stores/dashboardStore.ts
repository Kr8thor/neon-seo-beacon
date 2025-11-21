/**
 * Dashboard Store
 * Pinia store for managing dashboard state, widgets, and user preferences
 */

import { defineStore } from 'pinia'

export interface WidgetConfig {
  id: string
  title: string
  sizeX: number
  sizeY: number
  posX: number
  posY: number
  visible: boolean
  minimized: boolean
  refreshable: boolean
  removable: boolean
  lastRefresh?: number
}

export interface LayoutPreset {
  name: string
  widgets: WidgetConfig[]
  created: number
  isDefault?: boolean
}

export interface DashboardState {
  widgets: WidgetConfig[]
  layouts: LayoutPreset[]
  currentLayout: string
  autoRefresh: boolean
  refreshInterval: number
  compactMode: boolean
  showGridLines: boolean
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    widgets: [],
    layouts: [],
    currentLayout: 'default',
    autoRefresh: true,
    refreshInterval: 60000, // 1 minute
    compactMode: false,
    showGridLines: false,
  }),

  getters: {
    visibleWidgets: (state) => state.widgets.filter(w => w.visible),

    minimizedWidgets: (state) => state.widgets.filter(w => w.minimized),

    gridPositions: (state) => {
      const map = new Map<string, { x: number; y: number; w: number; h: number }>()
      state.widgets.forEach(w => {
        map.set(w.id, { x: w.posX, y: w.posY, w: w.sizeX, h: w.sizeY })
      })
      return map
    },

    widgetById: (state) => (id: string) => state.widgets.find(w => w.id === id),

    layoutByName: (state) => (name: string) => state.layouts.find(l => l.name === name),

    hasUnsavedChanges: (state) => {
      const currentPreset = state.layouts.find(l => l.name === state.currentLayout)
      if (!currentPreset) return false
      return JSON.stringify(state.widgets) !== JSON.stringify(currentPreset.widgets)
    },
  },

  actions: {
    // Initialize with default widgets
    initialize() {
      if (this.widgets.length === 0) {
        this.widgets = this.getDefaultWidgets()
      }
      if (this.layouts.length === 0) {
        this.layouts = [{
          name: 'default',
          widgets: this.getDefaultWidgets(),
          created: Date.now(),
          isDefault: true,
        }]
      }
    },

    getDefaultWidgets(): WidgetConfig[] {
      return [
        {
          id: 'score-overview',
          title: 'Overall Score',
          sizeX: 4,
          sizeY: 2,
          posX: 0,
          posY: 0,
          visible: true,
          minimized: false,
          refreshable: true,
          removable: true,
        },
        {
          id: 'recent-audits',
          title: 'Recent Audits',
          sizeX: 4,
          sizeY: 2,
          posX: 4,
          posY: 0,
          visible: true,
          minimized: false,
          refreshable: true,
          removable: true,
        },
        {
          id: 'issues-summary',
          title: 'Issues Summary',
          sizeX: 4,
          sizeY: 2,
          posX: 8,
          posY: 0,
          visible: true,
          minimized: false,
          refreshable: true,
          removable: true,
        },
        {
          id: 'trend-chart',
          title: 'Score Trend',
          sizeX: 8,
          sizeY: 3,
          posX: 0,
          posY: 2,
          visible: true,
          minimized: false,
          refreshable: true,
          removable: true,
        },
        {
          id: 'top-issues',
          title: 'Top Issues',
          sizeX: 4,
          sizeY: 3,
          posX: 8,
          posY: 2,
          visible: true,
          minimized: false,
          refreshable: true,
          removable: true,
        },
      ]
    },

    // Layout management
    loadLayout(name: string) {
      const layout = this.layouts.find(l => l.name === name)
      if (layout) {
        this.widgets = JSON.parse(JSON.stringify(layout.widgets))
        this.currentLayout = name
      }
    },

    saveLayout(name: string) {
      const existing = this.layouts.findIndex(l => l.name === name)
      const layout: LayoutPreset = {
        name,
        widgets: JSON.parse(JSON.stringify(this.widgets)),
        created: Date.now(),
      }

      if (existing >= 0) {
        this.layouts[existing] = layout
      } else {
        this.layouts.push(layout)
      }
      this.currentLayout = name
    },

    deleteLayout(name: string) {
      if (name === 'default') return // Can't delete default
      const index = this.layouts.findIndex(l => l.name === name)
      if (index >= 0) {
        this.layouts.splice(index, 1)
        if (this.currentLayout === name) {
          this.loadLayout('default')
        }
      }
    },

    // Widget management
    addWidget(config: Partial<WidgetConfig> & { id: string; title: string }) {
      const existing = this.widgets.find(w => w.id === config.id)
      if (existing) {
        existing.visible = true
        return
      }

      this.widgets.push({
        id: config.id,
        title: config.title,
        sizeX: config.sizeX || 4,
        sizeY: config.sizeY || 2,
        posX: config.posX || 0,
        posY: config.posY || 0,
        visible: true,
        minimized: false,
        refreshable: config.refreshable ?? true,
        removable: config.removable ?? true,
      })
    },

    removeWidget(id: string) {
      const widget = this.widgets.find(w => w.id === id)
      if (widget) {
        widget.visible = false
      }
    },

    toggleWidget(id: string) {
      const widget = this.widgets.find(w => w.id === id)
      if (widget) {
        widget.visible = !widget.visible
      }
    },

    toggleMinimize(id: string) {
      const widget = this.widgets.find(w => w.id === id)
      if (widget) {
        widget.minimized = !widget.minimized
      }
    },

    updateWidgetPosition(id: string, posX: number, posY: number) {
      const widget = this.widgets.find(w => w.id === id)
      if (widget) {
        widget.posX = posX
        widget.posY = posY
      }
    },

    updateWidgetSize(id: string, sizeX: number, sizeY: number) {
      const widget = this.widgets.find(w => w.id === id)
      if (widget) {
        widget.sizeX = sizeX
        widget.sizeY = sizeY
      }
    },

    refreshWidget(id: string) {
      const widget = this.widgets.find(w => w.id === id)
      if (widget) {
        widget.lastRefresh = Date.now()
      }
    },

    // Preferences
    setAutoRefresh(enabled: boolean) {
      this.autoRefresh = enabled
    },

    setRefreshInterval(ms: number) {
      this.refreshInterval = Math.max(10000, Math.min(ms, 300000)) // 10s to 5min
    },

    toggleCompactMode() {
      this.compactMode = !this.compactMode
    },

    toggleGridLines() {
      this.showGridLines = !this.showGridLines
    },

    // Reset
    resetToDefault() {
      this.widgets = this.getDefaultWidgets()
      this.currentLayout = 'default'
    },
  },
})
