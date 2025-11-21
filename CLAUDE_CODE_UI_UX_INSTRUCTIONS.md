# Claude Code UI/UX Advancement Instructions

**Last Updated**: November 21, 2025
**Purpose**: Guide Claude Code to systematically advance the frontend UI/UX to production-quality standards
**Status**: Active Development - UI/UX Enhancement Phase

---

## Executive Summary

This document provides Claude Code with focused, actionable instructions for advancing Neon SEO Beacon's frontend to match industry-leading SEO tools (Ahrefs, SEMrush, Google Search Console).

**Current State**: Functional UI with legacy components
**Target State**: Production-grade dashboard with:
- Advanced data visualization
- Professional polish and micro-interactions
- High-performance virtualized tables
- Keyboard shortcuts and power-user features
- Real-time updates without UI jank
- Mobile-responsive data-dense layouts

**Timeline**: Implement in focused sprints (1-2 week cycles)

---

## Quick Start for Claude Code Sessions

### Session Opening Checklist

Before starting any UI/UX work:

```bash
# 1. Verify environment
npm run type-check     # Must pass
npm run lint          # Must pass
npm run dev           # Must run without errors

# 2. Check current branch
git status            # Should be clean
git branch -v         # Note current branch

# 3. Update this document if needed
# Review "Current Focus" section below
```

### After Each Work Session

```bash
# 1. Validate work
npm run type-check
npm run lint
npm run build        # Verify production build

# 2. Test in browser
npm run dev
# Manually test the changes you made

# 3. Commit with context
git add .
git commit -m "UI/UX: [Feature] - [What changed and why]"
git push origin [branch-name]
```

---

## Current Focus Areas

### Active: UI/UX Enhancement Phase

**Priority 1 (Immediate - This Week)**
1. **Design Tokens System** - Semantic colors, typography, spacing, shadows
   - File: `assets/css/design-tokens.css`
   - Impact: High (affects all other components)
   - Status: Plan structure, then implement

2. **Dashboard KPI Cards** - High-visibility metrics at top of dashboard
   - File: `components/dashboard/KPICard.vue`
   - Impact: High (user's first impression)
   - Features: Score display with sparkline, trend indicator, click-to-drill

3. **Score Gauge Visualization** - Semantic score display (0-100)
   - File: `components/charts/ScoreGauge.vue`
   - Impact: High (core metric display)
   - Tech: Chart.js doughnut chart with custom center label

**Priority 2 (Week 2)**
4. **Findings List with Severity Grouping** - Organize audit results by severity
   - File: `components/audit/FindingsList.vue`
   - Impact: Medium (usability improvement)
   - Features: Collapsible groups, batch selection, inline actions

5. **Virtualized Data Table** - Display 1000+ audit results without lag
   - File: `components/tables/VirtualizedAuditTable.vue`
   - Impact: High (performance critical)
   - Tech: Dynamic row rendering with scroll detection

**Priority 3 (Week 3)**
6. **Real-time Updates** - WebSocket integration for live audit progress
   - File: `composables/useAuditUpdates.ts`
   - Impact: Medium (user experience polish)
   - Features: Optimistic UI updates, progress tracking

7. **Keyboard Shortcuts** - Power user navigation
   - File: `composables/useKeyboardShortcuts.ts`
   - Impact: Low (advanced users) but high polish factor

---

## Architecture Guidelines for Claude Code

### Component Organization

All new components follow this structure:

```vue
<script setup lang="ts">
/**
 * ComponentName - One-line description
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * 
 * @example
 * <ComponentName :prop="value" @event="handler" />
 */

interface Props {
  // Explicitly typed props
  title: string;
  disabled?: boolean;
}

interface Emits {
  // Explicitly typed emits
  'update:modelValue': [value: string];
  'action': [id: string];
}

defineProps<Props>();
defineEmits<Emits>();

// Composition API logic
const state = ref(initial);
function handler() { }
</script>

<template>
  <!-- Template with semantic HTML -->
  <div class="component-root">
    <!-- Content -->
  </div>
</template>

<style scoped>
/* Scoped styles using design tokens */
.component-root {
  color: var(--text-primary);
  transition: all var(--transition-base);
}
</style>
```

### Design Token Usage

For all styling, use design tokens defined in `assets/css/design-tokens.css`:

```vue
<style scoped>
.card {
  /* Colors */
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  
  /* Spacing */
  padding: var(--space-4);
  margin-bottom: var(--space-8);
  
  /* Typography */
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  
  /* Shadows */
  box-shadow: var(--shadow-md);
  
  /* Animations */
  transition: all var(--transition-base);
}
</style>
```

### State Management Pattern

Use Pinia stores for shared state:

```typescript
// stores/auditStore.ts
export const useAuditStore = defineStore('audits', {
  state: () => ({
    audits: new Map<string, Audit>(),
    selectedId: null as string | null,
    filters: { severity: [] as string[] },
  }),

  getters: {
    current: (state) => state.audits.get(state.selectedId || ''),
    filtered: (state) =>
      Array.from(state.audits.values()).filter(audit =>
        !state.filters.severity.length ||
        audit.findings.some(f => state.filters.severity.includes(f.severity))
      ),
  },

  actions: {
    async loadAudits() {
      const data = await $fetch('/api/audits');
      this.audits = new Map(data.map(a => [a.id, a]));
    },
  },
});
```

### Composable Pattern

For reusable logic:

```typescript
// composables/useAuditSorting.ts
export function useAuditSorting(audits: Ref<Audit[]>) {
  const sortBy = ref<'date' | 'score'>('date');
  const order = ref<'asc' | 'desc'>('desc');

  const sorted = computed(() => {
    const copy = [...audits.value];
    copy.sort((a, b) => {
      const comparison = sortBy.value === 'date'
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : a.score - b.score;
      return order.value === 'asc' ? comparison : -comparison;
    });
    return copy;
  });

  return { sorted, sortBy, order };
}
```

---

## Specific UI/UX Enhancements

### 1. Design Tokens System

**Goal**: Establish consistent design language across app
**Files to create/modify**:
- `assets/css/design-tokens.css` (NEW)
- `tailwind.config.ts` (UPDATE)
- `composables/useDesignTokens.ts` (NEW)

**What to implement**:
```css
/* Design tokens categories */
:root {
  /* Color System - Semantic */
  --color-score-excellent: hsl(120, 100%, 45%);  /* 80-100 */
  --color-score-good: hsl(48, 100%, 50%);        /* 60-79 */
  --color-score-poor: hsl(0, 100%, 50%);         /* <60 */
  --color-score-unknown: hsl(0, 0%, 60%);        /* N/A */

  --color-severity-critical: #dc2626;
  --color-severity-warning: #f59e0b;
  --color-severity-info: #3b82f6;
  --color-severity-success: #10b981;

  /* Neutral Colors */
  --color-surface: #ffffff;
  --color-surface-alt: #f9fafb;
  --color-border: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;

  /* Typography Scale (modular 1.125 ratio) */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --line-height-xs: 1rem;
  --line-height-sm: 1.25rem;
  --line-height-base: 1.5rem;
  --line-height-lg: 1.75rem;
  --line-height-xl: 1.75rem;
  --line-height-2xl: 2rem;

  /* Spacing Scale (8px base) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-elevated: 0 20px 40px rgba(0, 0, 0, 0.15);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}
```

**Expected outcome**: All colors semantic, consistent spacing, smooth animations

---

### 2. KPI Cards Component

**Goal**: Display 4 key metrics at dashboard top (Score, Sites, Issues, Recommendations)
**File**: `components/dashboard/KPICard.vue`

**Requirements**:
- Props: `title`, `value`, `trend` (e.g., "↑ 4" or "-2"), `severity` (optional), `actionable` (optional)
- Display: Large value, trend indicator, optional mini sparkline
- Interactions: Hover effect, click to drill-down
- Performance: Must render 4+ cards instantly
- Responsive: Stack on mobile, 4-up on desktop

**Implementation hints**:
- Use CSS grid for 4-column layout
- Add subtle hover scale (1.02x)
- Color value by score if severity prop provided
- Show trend with semantic color (green for up, red for down)

---

### 3. Score Gauge Component

**Goal**: Visual representation of 0-100 score with semantic color
**File**: `components/charts/ScoreGauge.vue`

**Requirements**:
- Props: `score` (number 0-100), `label` (string), `size` (small/medium/large)
- Display: Doughnut chart from Chart.js with score percentage filled
- Color: Auto-select based on score range (excellent/good/poor)
- Center label: Show score number and label
- Animated: Smoothly animate on score change

**Implementation hints**:
- Use Chart.js doughnut type
- Set `circumference: 180`, `rotation: 270` for semi-circle effect
- Custom plugin to render center label
- Add transition on score update

---

### 4. Audit Findings List

**Goal**: Display audit findings grouped by severity, sortable, selectable
**File**: `components/audit/FindingsList.vue`

**Requirements**:
- Grouping: By severity (Critical → Warning → Info)
- Features:
  - Collapsible groups
  - Batch selection (checkboxes)
  - Inline severity badge
  - Impact score visual
  - Click to see affected elements
- Performance: Virtual scroll for 100+ findings
- Responsive: Collapse severity details on mobile

**Implementation hints**:
- Group using `Array.group()` (or manual reduce)
- Track expanded state per group
- Use `v-model` with `Set<string>` for selected IDs
- Emit `@select` event when finding clicked

---

### 5. Virtualized Audit Table

**Goal**: Display 1000+ audit results without performance degradation
**File**: `components/tables/VirtualizedAuditTable.vue`

**Requirements**:
- Virtual scroll: Only render visible rows (~50 rows max)
- Features:
  - Column headers with sort/filter
  - Responsive: Hide columns on mobile
  - Inline actions (view, edit, delete)
  - Multi-select with bulk actions
- Performance: < 50ms render time for 1000 rows
- Keyboard: Arrow keys to navigate, Enter to select

**Implementation hints**:
- Calculate `rowHeight` (typically 60px with padding)
- Detect scroll position, calculate visible range
- Use `transform: translateY()` to position rows
- Cache rendered rows to avoid re-renders

---

## Testing Checklist for Each Component

After implementing any component, verify:

```
Component: [Name]

Visual:
- [ ] Renders without console errors
- [ ] Responsive on mobile (320px), tablet (768px), desktop (1920px)
- [ ] Correct colors using design tokens
- [ ] Typography hierarchy visible
- [ ] Spacing consistent with design scale
- [ ] Dark mode compatible

Functionality:
- [ ] Props validated with TypeScript
- [ ] Events emitted correctly
- [ ] Click/hover interactions work
- [ ] Keyboard accessible (if applicable)
- [ ] Loading states show (if async)
- [ ] Error states handled

Performance:
- [ ] Initial render < 200ms
- [ ] No layout thrashing on scroll
- [ ] Memory stable after 100 interactions
- [ ] No console warnings/errors

Accessibility:
- [ ] Semantic HTML used
- [ ] Proper ARIA labels
- [ ] Color not only means of communication
- [ ] Focus visible on interactive elements
```

---

## File Organization for UI/UX Work

```
neon-seo-beacon/
├── components/
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── KPICard.vue        # ✨ NEW: Metric card
│   │   ├── Widget.vue         # Dashboard widget wrapper
│   │   └── DashboardGrid.vue  # Widget grid layout
│   │
│   ├── audit/                  # Audit detail page components
│   │   ├── ScoreHeader.vue    # Top section with score
│   │   ├── FindingsList.vue   # ✨ NEW: Findings display
│   │   ├── ComparisonView.vue # Side-by-side comparison
│   │   └── AuditTabs.vue      # Tab navigation
│   │
│   ├── charts/                 # Data visualizations
│   │   ├── ScoreGauge.vue     # ✨ NEW: Doughnut score
│   │   ├── TrendChart.vue     # Line chart with forecast
│   │   ├── WaterfallChart.vue # Score breakdown
│   │   └── HeatmapMatrix.vue  # Performance heatmap
│   │
│   ├── tables/                 # Data tables
│   │   ├── VirtualizedAuditTable.vue # ✨ NEW: 1000+ rows
│   │   └── SortableTable.vue   # Base sortable table
│   │
│   ├── ui/                     # Base UI elements
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Badge.vue
│   │   └── Tooltip.vue
│   │
│   └── FunctionalSeoDashboard.vue  # Legacy (being replaced)
│
├── assets/css/
│   ├── design-tokens.css       # ✨ NEW: Semantic tokens
│   ├── main.css                # Global styles
│   └── animations.css
│
├── composables/
│   ├── useDesignTokens.ts      # ✨ NEW: Token utilities
│   ├── useChartConfig.ts       # Chart.js configurations
│   ├── useVirtualScroll.ts     # Virtual scroll logic
│   ├── useKeyboardShortcuts.ts # ✨ NEW: Keyboard nav
│   └── useAuditUpdates.ts      # WebSocket updates
│
├── stores/
│   ├── auditStore.ts           # Audit data
│   ├── dashboardStore.ts       # Dashboard state
│   └── filterStore.ts          # Global filters
│
└── pages/
    ├── dashboard.vue            # ✨ BEING REBUILT
    ├── audits/[id].vue         # ✨ BEING REBUILT
    └── ...
```

---

## Workflow for Implementing New Features

### When Adding a New Component

1. **Create base component structure**
   ```bash
   # Example: Creating KPI Card
   mkdir -p components/dashboard
   touch components/dashboard/KPICard.vue
   ```

2. **Define TypeScript interfaces** (props/emits first)
   ```typescript
   interface Props {
     title: string;
     value: string | number;
     trend?: string;
   }
   ```

3. **Implement template and styles** (use design tokens)
   ```vue
   <style scoped>
   .card {
     padding: var(--space-4);
     background: var(--color-surface);
     border: 1px solid var(--color-border);
   }
   </style>
   ```

4. **Test in a page**
   ```vue
   <!-- In pages/dashboard.vue -->
   <KPICard title="Avg Score" value="72" trend="↑ 4" />
   ```

5. **Validate**
   ```bash
   npm run type-check
   npm run lint
   npm run dev
   # Test in browser
   ```

6. **Commit**
   ```bash
   git add components/dashboard/KPICard.vue
   git commit -m "UI: Add KPI Card component with trend indicator"
   ```

---

## Common Patterns & Code Snippets

### Pattern: Loading State with Skeleton

```vue
<template>
  <div v-if="loading" class="card-skeleton">
    <div class="skeleton-line w-24"></div>
    <div class="skeleton-line w-32 mt-2"></div>
  </div>
  <div v-else class="card">
    <!-- Content -->
  </div>
</template>

<style scoped>
.skeleton-line {
  height: 1rem;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.05) 25%,
    rgba(0,0,0,0.1) 50%,
    rgba(0,0,0,0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

### Pattern: Click-to-Drill Navigation

```typescript
const router = useRouter();

function drillDown(itemId: string) {
  router.push({
    name: 'audit-detail',
    params: { id: itemId },
    query: { from: 'dashboard' }
  });
}
```

### Pattern: Responsive Grid

```vue
<style scoped>
.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

### Pattern: API Fetching with Error Handling

```typescript
const { data: audits, pending, error } = await useFetch(
  '/api/audits',
  {
    onResponse({ response }) {
      if (response.ok) {
        auditStore.setAudits(response._data);
      }
    },
    onResponseError({ response }) {
      console.error(`API error: ${response.status}`);
      // Show error toast to user
    }
  }
);
```

---

## Performance Optimization Guidelines

### Image Loading
```vue
<img
  :src="`/images/optimized/${file}`"
  :alt="description"
  loading="lazy"
  @load="onImageLoad"
/>
```

### Code Splitting by Route
```typescript
// pages/audits/[id].vue - Auto-code-split by Nuxt
export default defineNuxtRouteMiddleware((to, from) => {
  // Only loaded when this route accessed
});
```

### Computed Property Caching
```typescript
const expensiveComputation = computed(() => {
  // Auto-memoized, only recalc when dependencies change
  return data.value.filter(...).map(...).sort(...);
});
```

---

## Debugging Guide for Claude Code

### TypeScript Errors
```bash
npm run type-check
# Look for file:line numbers, fix them
```

### Component Not Rendering
1. Check console for errors
2. Verify component registered: `npm run dev` and check DevTools
3. Check props are passed correctly
4. Verify template syntax

### Styling Issues
1. Check `.scoped` keyword on `<style>` tag
2. Verify design tokens exist: `assets/css/design-tokens.css`
3. Check selector specificity
4. Use DevTools to inspect computed styles

### Performance Issues
1. Profile in browser: DevTools > Performance tab
2. Look for long tasks (>50ms)
3. Check for unnecessary re-renders (Vue DevTools)
4. Use virtualization for lists >100 items

---

## Git Workflow for UI/UX Tasks

### Create a feature branch
```bash
git checkout -b feature/ui-kpi-cards
# or
git checkout -b ui/design-tokens
```

### Commit frequently with descriptive messages
```bash
git commit -m "UI: Implement KPI Card component with responsive grid"
git commit -m "UI: Add design tokens for semantic colors"
git commit -m "UI: Integrate KPI Cards into dashboard"
```

### Before merging to main
```bash
npm run type-check
npm run lint
npm run build
npm run dev
# Manual testing in browser
```

### Merge and push
```bash
git checkout main
git merge feature/ui-kpi-cards
git push origin main
```

---

## Communication Checklist

After significant UI/UX work, document:

**For each component added:**
- [ ] Filename and location
- [ ] Purpose and features
- [ ] Props/Emits documented
- [ ] Responsive behavior
- [ ] Accessibility features
- [ ] Performance characteristics

**For design token updates:**
- [ ] New tokens added
- [ ] Components using them
- [ ] Visual preview (screenshot)

**For performance improvements:**
- [ ] Metrics: before/after load time
- [ ] Virtual scrolling row count
- [ ] Bundle size impact

---

## Next Actions for Claude Code

### Immediate (Start Here)
1. Create `assets/css/design-tokens.css` with full token system
2. Update `tailwind.config.ts` to reference new tokens
3. Create `components/dashboard/KPICard.vue` component
4. Test KPI Cards in `pages/dashboard.vue`

### Follow-up (After tokens + KPI cards working)
5. Create `components/charts/ScoreGauge.vue` with Chart.js
6. Create `components/audit/FindingsList.vue` with virtual scroll
7. Create `components/tables/VirtualizedAuditTable.vue`

### Polish Phase
8. Add keyboard shortcuts composable
9. Integrate WebSocket for real-time updates
10. Final responsive and accessibility audit

---

## References & Resources

**Documentation**:
- Vue 3 Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- Nuxt 3 Guide: https://nuxt.com
- Tailwind CSS: https://tailwindcss.com
- Chart.js: https://www.chartjs.org
- Pinia: https://pinia.vuejs.org

**Design References**:
- Ahrefs Dashboard: https://ahrefs.com (UX inspiration)
- SEMrush Interface: https://semrush.com (layout patterns)
- Google Lighthouse: https://chromewebstore.google.com/detail/lighthouse (report design)

**Local Project Files**:
- Component guidelines: This file
- Type definitions: `/types`
- Existing components: `/components`
- Page layouts: `/pages`

---

## Notes for Ongoing Development

**Current Blockers**: None known - all systems operational

**High-Impact Quick Wins**:
1. Design tokens (affects everything downstream)
2. KPI Cards (immediate visual improvement)
3. Score Gauge (core metric display)

**Known Challenges**:
- Virtual scrolling performance on older devices
- Mobile responsiveness for data-dense views
- Real-time updates without UI flicker

**Tech Debt to Address** (lower priority):
- Remove legacy `FunctionalSeoDashboard.vue` after replacement
- Consolidate Tailwind config (both .js and .ts exist)
- Clean up test files in root directory

---

**Questions or blockers?** Check the `.claudecode/` directory or main documentation files listed at the bottom of this repo.

Happy coding! 🚀