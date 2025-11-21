/**
 * Dashboard Layout Composable
 * Handles grid positioning, drag-to-reorder, and layout persistence
 */

import { ref, computed } from 'vue'

export interface WidgetPosition {
  id: string
  x: number
  y: number
  w: number
  h: number
  minimized?: boolean
  visible?: boolean
}

export interface LayoutPreset {
  name: string
  widgets: WidgetPosition[]
  created: number
}

const GRID_COLUMNS = 12
const GRID_ROW_HEIGHT = 80

export function useDashboardLayout(storageKey = 'dashboard_layout') {
  const widgets = ref<WidgetPosition[]>([])
  const dragging = ref<string | null>(null)
  const dragOverCell = ref<{ x: number; y: number } | null>(null)
  const history = ref<WidgetPosition[][]>([])
  const historyIndex = ref(-1)

  // Default layout for new users
  const getDefaultLayout = (): WidgetPosition[] => [
    { id: 'score-overview', x: 0, y: 0, w: 4, h: 2, visible: true },
    { id: 'recent-audits', x: 4, y: 0, w: 4, h: 2, visible: true },
    { id: 'issues-summary', x: 8, y: 0, w: 4, h: 2, visible: true },
    { id: 'trend-chart', x: 0, y: 2, w: 8, h: 3, visible: true },
    { id: 'top-issues', x: 8, y: 2, w: 4, h: 3, visible: true },
  ]

  // Load layout from storage
  const load = () => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        widgets.value = JSON.parse(saved)
      } else {
        widgets.value = getDefaultLayout()
      }
      // Initialize history
      history.value = [JSON.parse(JSON.stringify(widgets.value))]
      historyIndex.value = 0
    } catch (e) {
      console.error('Failed to load dashboard layout:', e)
      widgets.value = getDefaultLayout()
    }
  }

  // Save layout to storage
  const save = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(widgets.value))
      // Add to history for undo
      const current = JSON.parse(JSON.stringify(widgets.value))
      if (historyIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, historyIndex.value + 1)
      }
      history.value.push(current)
      historyIndex.value = history.value.length - 1
      // Limit history size
      if (history.value.length > 50) {
        history.value.shift()
        historyIndex.value--
      }
    } catch (e) {
      console.error('Failed to save dashboard layout:', e)
    }
  }

  // Undo last change
  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--
      widgets.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      localStorage.setItem(storageKey, JSON.stringify(widgets.value))
    }
  }

  // Redo last undo
  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      widgets.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      localStorage.setItem(storageKey, JSON.stringify(widgets.value))
    }
  }

  // Check if position has collision with other widgets
  const hasCollision = (position: { x: number; y: number; w: number; h: number }, excludeId?: string): boolean => {
    for (const widget of widgets.value) {
      if (widget.id === excludeId || !widget.visible) continue

      const overlapsX = position.x < widget.x + widget.w && position.x + position.w > widget.x
      const overlapsY = position.y < widget.y + widget.h && position.y + position.h > widget.y

      if (overlapsX && overlapsY) return true
    }
    return false
  }

  // Find first available position for a widget
  const findAvailablePosition = (w: number, h: number): { x: number; y: number } | null => {
    for (let y = 0; y < 100; y++) {
      for (let x = 0; x <= GRID_COLUMNS - w; x++) {
        if (!hasCollision({ x, y, w, h })) {
          return { x, y }
        }
      }
    }
    return null
  }

  // Drag handlers
  const onDragStart = (id: string) => {
    dragging.value = id
  }

  const onDragOver = (e: DragEvent, gridElement: HTMLElement) => {
    e.preventDefault()
    if (!dragging.value) return

    const rect = gridElement.getBoundingClientRect()
    const cellWidth = rect.width / GRID_COLUMNS
    const x = Math.floor((e.clientX - rect.left) / cellWidth)
    const y = Math.floor((e.clientY - rect.top) / GRID_ROW_HEIGHT)

    dragOverCell.value = { x: Math.max(0, Math.min(x, GRID_COLUMNS - 1)), y: Math.max(0, y) }
  }

  const onDragEnd = (id: string, newPosition?: { x: number; y: number }) => {
    if (!newPosition && dragOverCell.value) {
      newPosition = dragOverCell.value
    }

    if (newPosition) {
      const widget = widgets.value.find(w => w.id === id)
      if (widget) {
        const proposedPosition = {
          x: Math.min(newPosition.x, GRID_COLUMNS - widget.w),
          y: newPosition.y,
          w: widget.w,
          h: widget.h,
        }

        if (!hasCollision(proposedPosition, id)) {
          widget.x = proposedPosition.x
          widget.y = proposedPosition.y
          save()
        }
      }
    }

    dragging.value = null
    dragOverCell.value = null
  }

  // Add widget to layout
  const addWidget = (id: string, w: number, h: number, title?: string) => {
    if (widgets.value.find(widget => widget.id === id)) {
      // Widget exists, just make it visible
      const existing = widgets.value.find(widget => widget.id === id)
      if (existing) existing.visible = true
      save()
      return
    }

    const position = findAvailablePosition(w, h)
    if (position) {
      widgets.value.push({
        id,
        x: position.x,
        y: position.y,
        w,
        h,
        visible: true,
      })
      save()
    }
  }

  // Remove widget from layout
  const removeWidget = (id: string) => {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.visible = false
      save()
    }
  }

  // Toggle widget visibility
  const toggleWidget = (id: string) => {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.visible = !widget.visible
      save()
    }
  }

  // Resize widget
  const resizeWidget = (id: string, w: number, h: number) => {
    const widget = widgets.value.find(wgt => wgt.id === id)
    if (widget) {
      const proposedPosition = { x: widget.x, y: widget.y, w, h }
      if (!hasCollision(proposedPosition, id)) {
        widget.w = w
        widget.h = h
        save()
      }
    }
  }

  // Reset to default layout
  const resetLayout = () => {
    widgets.value = getDefaultLayout()
    save()
  }

  // Computed properties
  const visibleWidgets = computed(() =>
    widgets.value.filter(w => w.visible !== false)
  )

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  const gridMaxY = computed(() => {
    let maxY = 0
    for (const widget of visibleWidgets.value) {
      maxY = Math.max(maxY, widget.y + widget.h)
    }
    return maxY
  })

  return {
    widgets,
    visibleWidgets,
    dragging,
    dragOverCell,
    gridMaxY,
    canUndo,
    canRedo,
    load,
    save,
    undo,
    redo,
    onDragStart,
    onDragOver,
    onDragEnd,
    addWidget,
    removeWidget,
    toggleWidget,
    resizeWidget,
    resetLayout,
    hasCollision,
    findAvailablePosition,
    GRID_COLUMNS,
    GRID_ROW_HEIGHT,
  }
}
