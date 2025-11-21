# Neon SEO Beacon - Project Instructions

**Last Updated**: November 21, 2025
**Project**: Production-Level Frontend Upgrade
**Status**: Phase 1 Foundation (In Progress)

---

## Quick Start (5 minutes)

```bash
# Clone and setup
git clone https://github.com/Kr8thor/neon-seo-beacon.git
cd neon-seo-beacon
npm install

# Start development
npm run dev

# In another terminal, start Claude Code
claude-code

# Visit dashboard
open http://localhost:3000/dashboard
```

---

## Project Overview

**Neon SEO Beacon** is a professional SEO analysis tool built with Nuxt 3. We're upgrading the frontend from functional to production-quality, matching tools like Ahrefs, SEMrush, and Google Search Console.

**Key Technologies**:
- **Framework**: Nuxt 3 (Vue 3 Composition API)
- **Styling**: Tailwind CSS + custom design tokens
- **State**: Pinia (with caching)
- **Charts**: Chart.js + vue-chartjs
- **Database**: Supabase (PostgreSQL)
- **Backend**: Node.js + Nitro
- **Deployment**: Railway
- **IDE**: VS Code with Claude Code extension

---

## Directory Structure

```
neon-seo-beacon/
├── .claudecode/                    # Claude Code workspace
│   ├── PROMPTS.md                  # Prompt index & overview
│   ├── ORCHESTRATOR.md             # Master timeline & execution guide
│   ├── PROJECT_INSTRUCTIONS.md     # THIS FILE
│   └── prompts/
│       ├── phase1-design-tokens.md
│       ├── phase1-widget-system.md
│       ├── phase1-chart-components.md
│       ├── phase1-pinia-stores.md
│       ├── phase2-dashboard-page.md
│       └── ... more prompts
│
├── pages/
│   ├── index.vue                   # Landing page
│   ├── dashboard.vue               # ⭐ BEING REBUILT (Phase 2.1)
│   ├── pricing.vue
│   ├── audits/
│   │   └── [id].vue                # ⭐ BEING REBUILT (Phase 2.2)
│   └── ... other pages
│
├── components/
│   ├── FunctionalSeoDashboard.vue  # Current dashboard (legacy)
│   ├── ui/
│   │   ├── ErrorBoundary.vue
│   │   ├── SkeletonLoader.vue
│   │   └── LoadingSpinner.vue
│   ├── widgets/                    # ⭐ NEW (Phase 1.2)
│   │   ├── DashboardWidget.vue
│   │   ├── RecentAuditsWidget.vue
│   │   └── ...
│   ├── charts/                     # ⭐ NEW (Phase 1.3)
│   │   ├── ScoreGauge.vue
│   │   ├── TrendChart.vue
│   │   ├── WaterfallChart.vue
│   │   └── ...
│   ├── tables/                     # ⭐ NEW (Phase 2.3)
│   │   └── VirtualizedDataTable.vue
│   └── ...
│
├── composables/
│   ├── useDesignTokens.ts          # ⭐ NEW (Phase 1.1)
│   ├── useDashboardLayout.ts       # ⭐ NEW (Phase 1.2)
│   ├── useChartConfig.ts           # ⭐ NEW (Phase 1.3)
│   ├── useChartAnimations.ts       # ⭐ NEW (Phase 1.3)
│   ├── useKeyboardShortcuts.ts     # ⭐ NEW (Phase 3.3)
│   ├── useAuditUpdates.ts          # ⭐ NEW (Phase 3.2)
│   └── ...
│
├── stores/
│   ├── auditStore.ts               # ⭐ NEW (Phase 1.4)
│   ├── dashboardStore.ts           # ⭐ NEW (Phase 1.2 & 1.4)
│   ├── filterStore.ts              # ⭐ NEW (Phase 1.4)
│   └── ...
│
├── assets/
│   ├── css/
│   │   ├── main.css                # Base styles
│   │   ├── tokens.css              # ⭐ NEW (Phase 1.1)
│   │   ├── glassmorphism.css
│   │   └── animations.css
│   └── ...
│
├── nuxt.config.ts                  # Main config
├── tailwind.config.js              # ⭐ UPDATED (Phase 1.1)
├── package.json
└── README.md
```

**⭐ = New or being modified in this upgrade**

---

## Development Workflow

### Daily Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```

2. **Execute Claude Code Prompts** (when ready to build features)
   ```bash
   # Terminal 1: Development server
   npm run dev
   
   # Terminal 2: Claude Code
   claude-code "$(cat .claudecode/prompts/phase1-design-tokens.md)"
   ```

3. **Test After Changes**
   ```bash
   npm run lint        # Check code quality
   npm run type-check  # TypeScript validation
   npm run test:unit   # Unit tests (if available)
   ```

4. **Verify Build**
   ```bash
   npm run build
   npm run preview     # Test production build locally
   ```

### Feature Development Process

**For each prompt execution:**

1. **Read the prompt** to understand what's being built
2. **Execute** via Claude Code
3. **Wait** for completion (usually 5-15 minutes per prompt)
4. **Test immediately**:
   ```bash
   npm run dev
   # Check console for errors
   # Test the new feature in browser
   ```
5. **Run linting**:
   ```bash
   npm run lint
   npm run type-check
   ```
6. **Commit changes**:
   ```bash
   git add .
   git commit -m "Phase 1.1: Design tokens - semantic color system, typography scale, spacing tokens"
   git push
   ```

### Branching Strategy

```bash
# Main work branch (Phase 1)
git checkout -b phase/1-foundation

# After Phase 1 complete, merge to main
git checkout main
git merge phase/1-foundation
git push

# Start Phase 2 branch
git checkout -b phase/2-core-features
```

---

## Using Claude Code Prompts

### Quick Reference

All prompts are stored in `.claudecode/prompts/`

**Phase 1: Foundation** (Week 1-2)
- `phase1-design-tokens.md` - CSS tokens, Tailwind config
- `phase1-widget-system.md` - Dashboard widget architecture
- `phase1-chart-components.md` - Chart visualizations
- `phase1-pinia-stores.md` - State management

**Phase 2: Core Features** (Week 2-3)
- `phase2-dashboard-page.md` - Rebuild dashboard
- `phase2-audit-detail-page.md` - Audit results page
- `phase2-virtualized-table.md` - Virtual scrolling table
- `phase2-findings-list.md` - Findings list with grouping

**Phase 3: Polish** (Week 3-4)
- `phase3-performance.md` - Code splitting, lazy loading
- `phase3-websocket.md` - Real-time updates
- `phase3-keyboard-shortcuts.md` - Power user shortcuts
- `phase3-comparison-view.md` - Comparison views

### Executing a Prompt

**Option 1: Direct execution**
```bash
claude-code "$(cat .claudecode/prompts/phase1-design-tokens.md)"
```

**Option 2: View first, then execute**
```bash
# Read to understand what will be created
cat .claudecode/prompts/phase1-design-tokens.md

# Execute when ready
claude-code "$(cat .claudecode/prompts/phase1-design-tokens.md)"
```

**Option 3: Copy-paste method**
1. Open `.claudecode/prompts/phase1-design-tokens.md` in GitHub
2. Copy entire content
3. Paste into Claude Code
4. Let it execute

### After Each Prompt

**Always verify:**
```bash
# 1. Check for errors
npm run dev
# Look for red errors in terminal/browser console

# 2. Lint and type-check
npm run lint
npm run type-check

# 3. Test the new feature
# Navigate to relevant page and test manually

# 4. Build check
npm run build
# Should complete without errors

# 5. Commit
git add .
git commit -m "Phase X.Y: [Feature name] - [brief description]"
git push
```

---

## Common Development Tasks

### Task: Add a New Component

1. Create file in `components/` (or subdirectory)
2. Follow existing component patterns
3. Include TypeScript interfaces for props/emits
4. Document props in JSDoc comments
5. Test in development
6. Commit with clear message

Example:
```vue
<script setup lang="ts">
/**
 * MyComponent - Brief description
 * @example
 * <MyComponent title="Example" @click="handle" />
 */
interface Props {
  title: string;
  disabled?: boolean;
}

defineProps<Props>();
defineEmits<{ click: [id: string] }>();
</script>
```

### Task: Add a New Composable

1. Create in `composables/use*.ts`
2. Export function(s)
3. Include TypeScript types
4. Add JSDoc documentation
5. Use in components as `const { thing } = useMyComposable()`

Example:
```typescript
/**
 * useMyComposable - Description of what it does
 * @param options - Configuration
 * @returns Object with reactive state and methods
 */
export function useMyComposable(options = {}) {
  const state = ref(initial);
  
  function doSomething() { }
  
  return { state, doSomething };
}
```

### Task: Add a New Pinia Store

1. Create in `stores/*.ts`
2. Use `defineStore('unique-name', { ... })`
3. Organize with: state, getters, actions
4. Include caching for API calls
5. Type everything with TypeScript

Example:
```typescript
export const useMyStore = defineStore('my-store', {
  state: () => ({
    data: [] as MyData[],
  }),
  
  getters: {
    filteredData: (state) => state.data.filter(...),
  },
  
  actions: {
    async fetchData() {
      // With caching logic
    },
  },
});
```

### Task: Debug Performance Issue

```bash
# 1. Check bundle size
npm run build
# Look for large chunks

# 2. Profile in browser
# Open DevTools Performance tab
# Record interaction
# Check for jank/long tasks

# 3. Check console for warnings
npm run dev
# Watch for warnings about unoptimized components

# 4. Use Lighthouse
npm run test:performance
```

### Task: Update Styling System

1. Add token to `assets/css/tokens.css`:
   ```css
   --color-new-token: #hexvalue;
   ```

2. Add to Tailwind config:
   ```javascript
   colors: {
     'new-token': 'var(--color-new-token)',
   }
   ```

3. Update composable `composables/useDesignTokens.ts`

4. Use in components:
   ```vue
   <div class="text-new-token">Color text</div>
   <!-- or programmatic -->
   const color = useDesignTokens().getNewToken();
   ```

---

## Key Commands Reference

### Development
```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run preview          # Preview production build
npm run generate         # Generate static site

npm run clean            # Clear .nuxt, .output, dist cache
npm run postinstall      # Run after npm install
```

### Code Quality
```bash
npm run lint             # Check code quality (ESLint)
npm run lint:fix         # Auto-fix linting issues
npm run type-check       # TypeScript validation
npm run format:check     # Check formatting (Prettier)
npm run format:fix       # Auto-format code
```

### Testing
```bash
npm run test             # Run all tests
npm run test:unit        # Unit tests only
npm run test:unit:watch  # Watch mode
npm run test:e2e         # E2E tests (Playwright)
npm run test:e2e:ui      # E2E with UI
npm run test:performance # Lighthouse report
npm run test:accessibility # A11y audit
```

### Security & Maintenance
```bash
npm run security:audit   # Check vulnerabilities
npm run security:fix     # Auto-fix vulnerabilities
npm run security:check   # Audit + deps check
npm run production:check # Pre-production checks
```

---

## Git Workflow

### Commit Messages

Follow this format:
```
Phase X.Y: [Feature] - [Description]

Example:
Phase 1.1: Design Tokens - Add semantic color system and typography scale
Phase 1.2: Widget System - Implement drag-to-reorder dashboard widgets
Phase 2.1: Dashboard - Rebuild with KPI cards and widget grid
```

### Branch Names

```bash
# Feature branch
git checkout -b feature/brief-name

# Phase branch
git checkout -b phase/1-foundation
git checkout -b phase/2-core-features

# Fix branch
git checkout -b fix/issue-description
```

### Regular Commits

```bash
# After each prompt execution
git add .
git commit -m "Phase X.Y: [Feature] - [Changes made]"
git push

# Push to main when phase complete
git checkout main
git merge phase/X-branch-name
git push
```

---

## Troubleshooting Guide

### Problem: Build Errors After Prompt Execution

**Solution:**
```bash
# 1. Clear cache
npm run clean

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Try again
npm run build
npm run dev
```

### Problem: Components Not Rendering

**Checklist:**
- [ ] File path matches exactly (case-sensitive)
- [ ] Component is in correct directory
- [ ] Check for TypeScript errors: `npm run type-check`
- [ ] Verify auto-import working (check `nuxt.config.ts`)
- [ ] Restart dev server: `npm run dev`

### Problem: State Not Updating

**Debug:**
```bash
# 1. Check store creation
npm run type-check

# 2. Verify Pinia setup in nuxt.config.ts
grep -n "@pinia/nuxt" nuxt.config.ts

# 3. Check store in DevTools
# Install Vue DevTools extension
# Open DevTools > Vue tab > Stores

# 4. Add console logs
console.log(store.state);
```

### Problem: Slow Performance

**Diagnose:**
```bash
# 1. Build analysis
npm run build
# Shows chunk sizes

# 2. Lighthouse score
npm run test:performance

# 3. Profile in browser
# DevTools > Performance > Record user interactions

# 4. Check virtual scrolling implemented correctly
# Look for VirtualizedDataTable usage
```

### Problem: Styling Not Applied

**Checklist:**
- [ ] Token defined in `assets/css/tokens.css`
- [ ] Tailwind config updated
- [ ] Clear CSS cache: `npm run clean`
- [ ] Check dark mode (use browser devtools to toggle)
- [ ] Verify specificity not overridden elsewhere

---

## Testing Checklist

### Before Committing

- [ ] Code runs without errors: `npm run dev`
- [ ] Linting passes: `npm run lint`
- [ ] TypeScript valid: `npm run type-check`
- [ ] Component renders correctly
- [ ] Responsive on mobile (DevTools)
- [ ] Works in dark mode
- [ ] No console warnings/errors
- [ ] Keyboard navigation works (if applicable)

### After Phase Complete

- [ ] All phase tasks complete
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Tests pass: `npm run test:unit`
- [ ] Lighthouse score > 80
- [ ] Accessibility audit passes
- [ ] Ready to commit to main

### Before Production Deployment

```bash
# Run full test suite
npm run lint
npm run type-check
npm run test:all
npm run build
npm run test:performance
npm run test:accessibility
npm run security:check

# Verify everything works
npm run preview
# Test all critical flows manually
```

---

## Design System Reference

### Colors (Tokens)

**Score Colors** (Semantic Meaning):
- `--color-score-excellent` (80-100) - Green
- `--color-score-good` (60-79) - Yellow
- `--color-score-poor` (<60) - Red

**Severity Colors**:
- `--color-severity-critical` - Red (#dc2626)
- `--color-severity-warning` - Orange (#f59e0b)
- `--color-severity-info` - Blue (#3b82f6)

### Spacing (8px base)

```
--space-1: 0.25rem (2px)
--space-2: 0.5rem (4px)
--space-3: 0.75rem (6px)
--space-4: 1rem (8px)
--space-8: 2rem (16px)
--space-12: 3rem (24px)
--space-16: 4rem (32px)
```

### Typography

```
xs: 0.75rem / 1rem
sm: 0.875rem / 1.25rem
base: 1rem / 1.5rem
lg: 1.125rem / 1.75rem
xl: 1.25rem / 1.75rem
2xl: 1.5rem / 2rem
```

### Shadows

```
--shadow-sm: 0 1px 2px
--shadow-md: 0 4px 6px
--shadow-elevated: 0 20px 40px
```

### Transitions

```
--transition-fast: 150ms
--transition-base: 200ms
--transition-slow: 300ms
```

---

## Important Conventions

### Vue Components
- Use `<script setup>` syntax
- Define types with TypeScript interfaces
- Include JSDoc comments for props/emits
- One component per file
- Scoped styles only
- Use composables for logic

### Naming
- Components: PascalCase (`MyComponent.vue`)
- Composables: `useMyComposable.ts`
- Stores: `myStore.ts` with `defineStore('my-store')`
- Constants: UPPER_SNAKE_CASE
- Functions: camelCase

### File Organization
```
components/
├── ui/              # Base UI elements
├── widgets/         # Dashboard widgets
├── charts/          # Chart visualizations
├── tables/          # Complex tables
├── audit/           # Audit-specific components
└── App.vue          # Root component

composables/
├── use*.ts          # One composable per file

stores/
└── *.ts             # One store per file
```

### Props & Emits
```typescript
interface Props {
  title: string;
  count?: number;
  items: Array<Item>;
}

defineProps<Props>();
defineEmits<{ 
  update: [newValue: string];
  delete: [id: string];
}>();
```

---

## Keyboard Shortcuts (Phase 3.3)

Once Phase 3.3 is complete, these will be available:

```
Global:
  Ctrl+K / Cmd+K     - Search audits
  Ctrl+N / Cmd+N     - New audit
  Ctrl+R / Cmd+R     - Refresh dashboard
  Ctrl+, / Cmd+,     - Settings

Navigation:
  j                   - Next item
  k                   - Previous item
  o                   - Open selected
  Enter               - Confirm action

Table/List:
  Space               - Select row
  Shift+Space         - Select range
  Delete              - Delete selected
  e                   - Expand all
  c                   - Collapse all
```

---

## Current Implementation Status

### Phase 1: Foundation ⏳ In Progress

- [ ] **1.1 Design Tokens** - Starting
  - CSS custom properties
  - Tailwind config
  - TypeScript utilities
  
- [ ] **1.2 Widget System** - Next
  - Dashboard widget component
  - Drag-to-reorder layout
  - Widget persistence

- [ ] **1.3 Chart Components** - Next
  - Score gauge visualization
  - Trend charts with sparklines
  - Waterfall breakdown charts

- [ ] **1.4 Pinia Stores** - Next
  - Audit store with caching
  - Dashboard state
  - Filter state

**Expected Completion**: ~7 hours

### Phase 2: Core Features ⏳ Pending (Phase 1 complete)

- [ ] **2.1 Dashboard Page** - KPI cards + widget grid
- [ ] **2.2 Audit Results Page** - Detailed audit view
- [ ] **2.3 Virtualized Table** - 1000+ rows without lag
- [ ] **2.4 Findings List** - Severity grouping + batch ops

**Expected Completion**: ~9.5 hours (after Phase 1)

### Phase 3: Polish & Performance ⏳ Pending (Phase 2 complete)

- [ ] **3.1 Performance** - Code splitting, lazy loading
- [ ] **3.2 WebSocket** - Real-time audit updates
- [ ] **3.3 Keyboard Shortcuts** - Power user navigation
- [ ] **3.4 Comparison Views** - Audit comparisons

**Expected Completion**: ~6.5 hours (after Phase 2)

### Phase 4: Advanced ⏳ Optional (after Phase 3)

- [ ] PDF Export - Report generation
- [ ] Dark Mode - System preference + user toggle
- [ ] Accessibility - WCAG 2.1 AA compliance

**Total Time**: ~7 business days

---

## Getting Help

### When Something Breaks

1. **Check logs**
   ```bash
   npm run dev
   # Look at terminal and browser console
   ```

2. **Check TypeScript**
   ```bash
   npm run type-check
   ```

3. **Check linting**
   ```bash
   npm run lint
   ```

4. **Check git status**
   ```bash
   git status
   git diff
   ```

5. **Revert if needed**
   ```bash
   git reset --hard origin/main
   # Only if you can't fix it
   ```

### Documentation References

- [Nuxt 3 Docs](https://nuxt.com)
- [Vue 3 Docs](https://vuejs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org)
- [Chart.js](https://www.chartjs.org)
- [Supabase](https://supabase.io)

### Claude Code Prompts

- Overview: `.claudecode/PROMPTS.md`
- Orchestrator: `.claudecode/ORCHESTRATOR.md`
- Individual prompts: `.claudecode/prompts/`

---

## Next Steps

1. **Start with Phase 1.1**: Design Tokens
   ```bash
   claude-code "$(cat .claudecode/prompts/phase1-design-tokens.md)"
   ```

2. **Verify it works**
   ```bash
   npm run dev
   npm run lint
   npm run type-check
   ```

3. **Commit**
   ```bash
   git add .
   git commit -m "Phase 1.1: Design Tokens - semantic colors, typography, spacing"
   git push
   ```

4. **Continue through Phase 1**
   - Then Phase 2 (core features)
   - Then Phase 3 (polish)

---

## Project Contacts & Resources

**Repository**: https://github.com/Kr8thor/neon-seo-beacon
**Prompt Library**: `.claudecode/prompts/`
**Orchestrator**: `.claudecode/ORCHESTRATOR.md`
**Live App**: https://audit.mardenseo.com (production)

---

**Last Updated**: November 21, 2025
**Next Review**: After Phase 1 completion