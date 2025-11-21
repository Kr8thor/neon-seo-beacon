# Claude Desktop Project Instructions

**For**: Claude Desktop chat interface  
**Purpose**: Context and guidance for Claude when working on neon-seo-beacon  
**Last Updated**: November 21, 2025

---

## Project Context

You're working on **Neon SEO Beacon** - a professional SEO analysis tool being upgraded to production quality. The focus is on **UI/UX advancement** to match industry tools like Ahrefs and SEMrush.

**Repository**: https://github.com/Kr8thor/neon-seo-beacon  
**Tech Stack**: Nuxt 3, Vue 3, Tailwind CSS, Chart.js, Supabase, Pinia

---

## Current Focus: UI/UX Enhancement Phase

**Goal**: Transform functional dashboard into production-grade interface with:
- Advanced data visualization
- Professional polish and micro-interactions  
- High-performance virtualized components
- Keyboard shortcuts and power-user features
- Mobile-responsive data layouts

**Timeline**: 4 weeks of focused sprints

---

## What You Should Know About This Project

### Architecture Principles
- **Design Tokens First**: All styling uses CSS custom properties (no magic colors)
- **TypeScript Strict**: No `any` types, all interfaces explicitly defined
- **Component-Driven**: Reusable, tested components in `/components`
- **State Management**: Pinia stores for shared state with caching
- **Performance-First**: Virtual scrolling for lists, lazy loading, code splitting

### File Organization
```
components/
├── dashboard/     # Dashboard widgets and cards
├── audit/         # Audit detail page components
├── charts/        # Data visualizations (Chart.js)
├── tables/        # Data tables with virtual scroll
└── ui/            # Base UI elements (buttons, inputs, etc)

stores/            # Pinia state management
composables/       # Reusable logic (useXxx pattern)
assets/css/        # Global styles and design tokens
pages/             # Routes (auto-indexed by Nuxt)
```

### Development Commands
```bash
npm run dev         # Start dev server (localhost:3000)
npm run type-check  # TypeScript validation (run before committing)
npm run lint        # Code quality check
npm run build       # Production build verification
npm run lint:fix    # Auto-fix linting issues
```

---

## Sprint 1: Foundation (Week 1-2)

### Priority 1: Design Tokens System ⭐⭐⭐⭐⭐
**Why**: Everything else depends on this  
**File**: `assets/css/design-tokens.css`  
**What to create**:
- Semantic color tokens (score colors: excellent/good/poor, severity: critical/warning/info)
- Typography scale (xs, sm, base, lg, xl, 2xl with line heights)
- Spacing scale (8px base unit: 1, 2, 3, 4, 6, 8, 12, 16, 20)
- Shadow system (sm, md, lg, elevated)
- Transition timings (fast: 150ms, base: 200ms, slow: 300ms)
- Border radius tokens

**Expected outcome**: All components will use `var(--color-score-excellent)` instead of hardcoded colors

---

### Priority 2: KPI Card Component
**Why**: User's first impression of dashboard  
**File**: `components/dashboard/KPICard.vue`  
**Props**: `title` (string), `value` (string|number), `trend` (string, optional), `severity` (string, optional)  
**Features**:
- Displays large metric value with label
- Shows trend indicator (e.g., "↑ 4" in green)
- Responsive grid (4 columns desktop, 2 tablet, 1 mobile)
- Hover animation (scale 1.02x, shadow elevation)
- Uses design tokens for colors

**Test**: Dashboard should show 4 KPI cards at top (Avg Score, Sites Audited, Critical Issues, Recommendations)

---

### Priority 3: Score Gauge Component
**Why**: Core visualization appearing throughout app  
**File**: `components/charts/ScoreGauge.vue`  
**Props**: `score` (0-100), `label` (string), `size` ('sm'|'md'|'lg')  
**Tech**: Chart.js doughnut chart with custom center label  
**Features**:
- Animated score changes (smooth 300ms transition)
- Color auto-selects based on score range (excellent/good/poor)
- Center shows score number and label
- Responsive sizing

**Test**: Score changes should animate smoothly, color changes based on value

---

## When You're Ready to Help with Specific Tasks

### If asked about component architecture:
Point to: `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md` → "Component Organization"  
Key principle: Define interfaces first, then template, then styles using tokens

### If asked about design system:
Point to: `UI_UX_SPRINT_ROADMAP.md` → "Current Sprint"  
Reference file: `assets/css/design-tokens.css` (or create it if missing)

### If asked what to build next:
Point to: `UI_UX_SPRINT_ROADMAP.md`  
Status: Design tokens → KPI Cards → Score Gauge (Week 1), then Findings List → Virtualized Table (Week 2)

### If there's a TypeScript error:
- Run: `npm run type-check` to see exact errors
- Solution: Define interface, add types to props/emits
- Reference: `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md` → "Component Organization"

### If styling isn't working:
- Check: Design token exists in `assets/css/design-tokens.css`
- Use: `color: var(--color-token-name)` not hardcoded hex
- Scope styles: Add `scoped` to `<style>` tag
- Reference: `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md` → "Design Token Usage"

### If component renders but looks wrong:
- Check DevTools inspector (F12)
- Verify Tailwind classes or CSS actually applies
- Check for specificity conflicts
- Make sure component is imported in parent

### If performance is bad:
- For lists > 50 items: Use virtual scrolling
- Profile in DevTools Performance tab
- Reference: `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md` → "Performance Optimization"

---

## Key Things About This Project

### What's Already Done
- ✅ Nuxt 3 setup with TypeScript
- ✅ Tailwind CSS configured
- ✅ Chart.js installed and working
- ✅ Pinia stores set up
- ✅ Supabase integration ready
- ✅ Development environment stable

### What Needs Building (in order)
1. **Design tokens CSS** - Foundation for all styling
2. **KPI Cards** - Dashboard top section
3. **Score Gauge** - Metric visualization
4. **Findings List** - Audit results display
5. **Virtualized Table** - Handle 1000+ rows
6. **Real-time updates** - WebSocket integration
7. **Keyboard shortcuts** - Power user features

### Common Pitfalls to Avoid
- ❌ Don't build components before design tokens exist
- ❌ Don't use hardcoded colors (use tokens instead)
- ❌ Don't forget TypeScript types
- ❌ Don't skip responsive testing (check mobile!)
- ❌ Don't render 100+ items without virtual scroll

---

## Quick Reference: Design Tokens Pattern

### Using Tokens in Components
```vue
<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p class="score">{{ value }}</p>
  </div>
</template>

<style scoped>
.card {
  /* Use CSS variables, not hardcoded values */
  background: var(--color-surface);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.score {
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-2xl);
  color: var(--color-score-excellent); /* if score 80+ */
  margin-top: var(--space-2);
}
</style>
```

### Responsive Pattern
```vue
<style scoped>
.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

---

## Documentation References

**For Claude Code working on the project**:
- Main guide: `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md` (30-min read)
- Quick priorities: `UI_UX_SPRINT_ROADMAP.md` (5-min read)
- Navigation hub: `CLAUDE_CODE_DOCUMENTATION_INDEX.md`

**For understanding project scope**:
- Technical architecture: `TECHNICAL_ARCHITECTURE.md`
- Project status: `PROJECT_STATUS.md`
- Implementation details: `FRONTEND_IMPLEMENTATION_PLAN.md`

---

## When Asking Me to Work on Something

**Best way to request changes**:

```
I need you to build a KPI Card component with:
- Props: title, value, trend (optional), severity (optional)
- Features: responsive grid, hover effect, semantic colors from tokens
- File: components/dashboard/KPICard.vue
- Should integrate into pages/dashboard.vue showing 4 metrics

Reference: CLAUDE_CODE_UI_UX_INSTRUCTIONS.md section "Specific UI/UX Enhancements"
```

**What I'll do**:
1. ✅ Create the component with TypeScript types
2. ✅ Use design tokens (not hardcoded colors)
3. ✅ Make it responsive (mobile/tablet/desktop)
4. ✅ Add it to the dashboard page
5. ✅ Commit with clear message
6. ✅ Tell you what to test

---

## Current Project Status

**Last Verified**: November 21, 2025

| Component | Status | File |
|-----------|--------|------|
| Design Tokens | ⏳ To Do | `assets/css/design-tokens.css` |
| KPI Cards | ⏳ To Do | `components/dashboard/KPICard.vue` |
| Score Gauge | ⏳ To Do | `components/charts/ScoreGauge.vue` |
| Findings List | ❌ Not Started | `components/audit/FindingsList.vue` |
| Virtualized Table | ❌ Not Started | `components/tables/VirtualizedAuditTable.vue` |

---

## Repository Information

**Owner**: Kr8thor  
**Repository**: neon-seo-beacon  
**Branch**: main (for UI/UX work)  
**Live Site**: https://audit.mardenseo.com (production)  
**Node Version**: 18+ (see `.nvmrc`)

---

## Quick Troubleshooting

| Issue | Check | Command |
|-------|-------|---------|
| Types not working | TypeScript validation | `npm run type-check` |
| Build errors | Lint issues | `npm run lint` |
| Styles not applied | Token exists, CSS scope | DevTools inspector |
| Component missing | Auto-import working | Check `nuxt.config.ts` |
| Dev server won't start | Port 3000 free | `lsof -i :3000` |

---

## For Easy Reference

**Copy these when asking me to help**:

### Sprint 1 Complete Checklist
- [ ] Design tokens system created and tested
- [ ] KPI Cards component working and integrated
- [ ] Score Gauge component working and integrated
- [ ] All components responsive (tested on mobile)
- [ ] No TypeScript errors: `npm run type-check` ✅
- [ ] No lint errors: `npm run lint` ✅
- [ ] Build succeeds: `npm run build` ✅

### Component Template
```
Component Name: [Name]
File: components/[category]/[Name].vue
Props: [list with types]
Emits: [list with types]
Features: [bullet list]
Depends on: [what must exist first]
```

---

## One More Thing

**Before asking me to build something**, check:

1. ✅ Is design tokens system done? (if not, do that first)
2. ✅ Have you read `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md`?
3. ✅ Are you clear on what "done" means? (see acceptance criteria in sprint roadmap)
4. ✅ Did you test TypeScript/lint locally first?

This ensures we build things in the right order and nothing breaks.

---

**Ready to build the best SEO tool UI? Let's go! 🚀**
