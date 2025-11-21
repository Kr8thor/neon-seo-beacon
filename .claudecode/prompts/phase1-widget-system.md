# Phase 1.2: Dashboard Widget System

## Context
Build the reusable widget architecture that enables dashboard customization with drag-to-reorder, minimize, and removal.

## Deliverables

### 1. Create `components/widgets/DashboardWidget.vue`
Base widget component with:
- Configurable size (1x1, 1x2, 2x2, 2x3, 3x3)
- Minimize/maximize toggle
- Remove button
- Drag handle (for drag-to-reorder)
- Loading skeleton state
- Error boundary per widget
- Slot-based content

```vue
<template>
  <div 
    class="dashboard-widget"
    :class="[`widget-${widget.sizeX}x${widget.sizeY}`, { minimized }]"
    draggable
  >
    <header class="widget-header">
      <h3>{{ widget.title }}</h3>
      <div class="widget-controls">
        <button @click="toggleMinimize">{{ minimized ? '▼' : '▲' }}</button>
        <button @click="$emit('remove')">✕</button>
      </div>
    </header>
    <div v-if="!minimized" class="widget-content">
      <Suspense>
        <template #default>
          <slot />
        </template>
        <template #fallback>
          <div class="skeleton-loader" />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Widget {
  id: string;
  title: string;
  sizeX: number;
  sizeY: number;
  minimized?: boolean;
}

defineProps<{ widget: Widget }>();
defineEmits<{ remove: [] }>();

const minimized = ref(false);
const toggleMinimize = () => minimized.value = !minimized.value;
</script>
```

### 2. Create `composables/useDashboardLayout.ts`
Grid layout and drag-to-reorder logic:
- Grid positioning (CSS Grid 12-column)
- Collision detection for widget placement
- Drag event handling
- Layout persistence to localStorage/DB
- Undo/redo support

```typescript
export function useDashboardLayout(storageKey = 'dashboard_layout') {
  const widgets = ref<WidgetPosition[]>([]);
  const dragging = ref<string | null>(null);

  // Load saved layout
  function load() {
    const saved = localStorage.getItem(storageKey);
    widgets.value = saved ? JSON.parse(saved) : getDefaultLayout();
  }

  // Save layout
  function save() {
    localStorage.setItem(storageKey, JSON.stringify(widgets.value));
  }

  // Handle drag
  function onDragStart(id: string) {
    dragging.value = id;
  }

  function onDragEnd(id: string, newPosition: { x: number; y: number }) {
    const widget = widgets.value.find(w => w.id === id);
    if (widget && !hasCollision(newPosition, id)) {
      widget.x = newPosition.x;
      widget.y = newPosition.y;
      save();
    }
    dragging.value = null;
  }

  return { widgets, load, save, onDragStart, onDragEnd };
}
```

### 3. Create `stores/dashboardStore.ts`
Pinia store for dashboard state:
- Widget configuration (visibility, order, size, position)
- Layout presets (saved configurations)
- User preferences
- Widget refresh status

```typescript
export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    widgets: [] as Widget[],
    layouts: [] as Layout[],
    currentLayout: 'default',
    autoRefresh: true,
    refreshInterval: 60000,
  }),

  getters: {
    visibleWidgets: (state) => state.widgets.filter(w => w.visible),
    gridPositions: (state) => {
      const map = new Map();
      state.widgets.forEach(w => {
        map.set(w.id, { x: w.posX, y: w.posY, w: w.sizeX, h: w.sizeY });
      });
      return map;
    },
  },

  actions: {
    loadLayout(name: string) {
      const layout = this.layouts.find(l => l.name === name);
      if (layout) {
        this.widgets = JSON.parse(JSON.stringify(layout.widgets));
        this.currentLayout = name;
      }
    },

    saveLayout(name: string) {
      const existing = this.layouts.findIndex(l => l.name === name);
      const layout = {
        name,
        widgets: JSON.parse(JSON.stringify(this.widgets)),
        created: Date.now(),
      };
      if (existing >= 0) {
        this.layouts[existing] = layout;
      } else {
        this.layouts.push(layout);
      }
    },

    toggleWidget(id: string) {
      const widget = this.widgets.find(w => w.id === id);
      if (widget) widget.visible = !widget.visible;
    },

    removeWidget(id: string) {
      this.widgets = this.widgets.filter(w => w.id !== id);
    },
  },
});
```

### 4. Create `components/widgets/RecentAuditsWidget.vue`
Example widget showing recent audits:
- Uses DashboardWidget wrapper
- Displays 5 most recent audits
- Status badges
- Click to view full audit

### 5. Create `components/widgets/AverageScoreWidget.vue`
Shows average SEO score with trend:
- 30-day sparkline chart
- Current vs previous period comparison
- Color coded (excellent/good/poor)

## Tailwind Classes
Widget styling (add to `assets/css/main.css`):
```css
@layer components {
  .dashboard-widget {
    @apply rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md transition-all;
  }
  
  .dashboard-widget.widget-1x1 { grid-column: span 1; grid-row: span 1; }
  .dashboard-widget.widget-2x1 { grid-column: span 2; grid-row: span 1; }
  .dashboard-widget.widget-2x2 { grid-column: span 2; grid-row: span 2; }
  .dashboard-widget.widget-3x2 { grid-column: span 3; grid-row: span 2; }
}
```

## Testing
- Drag widgets and verify position updates
- Remove widget and verify it's gone
- Minimize/maximize toggle
- Refresh page and verify layout persists
- Create layout preset and load it

## Acceptance Criteria
- ✅ Base widget component renders with all controls
- ✅ Drag-to-reorder works without jank (transform/GPU acceleration)
- ✅ Layout persists across page reloads
- ✅ Multiple layout presets can be created/deleted
- ✅ Minimize functionality works
- ✅ Error boundaries prevent one widget crash from breaking dashboard