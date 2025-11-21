# UI/UX Sprint Roadmap - Quick Reference

**For Claude Code**: Start here for daily priorities

---

## 🎯 Current Sprint (Week 1-2)

### CRITICAL - Do This First
**Design Tokens System** - Foundation for everything
- **File**: `assets/css/design-tokens.css`
- **Time**: 1-2 hours
- **Impact**: ⭐⭐⭐⭐⭐ (Everything depends on this)
- **Blockers**: None
- **Next**: All following tasks wait on this

**Acceptance Criteria**:
- ✅ All semantic colors defined (score colors, severity colors)
- ✅ Typography scale complete (xs to 2xl)
- ✅ Spacing scale defined (8px base)
- ✅ Shadows and transitions defined
- ✅ Can import and use: `color: var(--color-score-excellent)`

**Test Command**:
```bash
npm run dev
# Open browser DevTools
# In console: getComputedStyle(document.documentElement).getPropertyValue('--color-score-excellent')
# Should return: rgb(value) or valid color
```

---

### HIGH PRIORITY - Week 1
**KPI Cards Component** - Visual dashboard refresh
- **File**: `components/dashboard/KPICard.vue`
- **Time**: 2-3 hours
- **Impact**: ⭐⭐⭐⭐ (First thing users see)
- **Depends on**: Design Tokens ✅
- **Props**: `title`, `value`, `trend`, `severity` (optional)
- **Features**:
  - Responsive 4-column grid
  - Semantic color based on score
  - Trend indicator (up/down arrows)
  - Hover animation (scale 1.02x)
  - Click to drill-down to details

**Acceptance Criteria**:
- ✅ Component renders with all props
- ✅ Colors use design tokens
- ✅ Responsive: stacks on mobile, 4-up on desktop
- ✅ Hover effect smooth and professional
- ✅ TypeScript types strict
- ✅ No console errors

**Integration Point**:
```vue
<!-- In pages/dashboard.vue -->
<div class="kpi-grid">
  <KPICard title="Avg SEO Score" value="72" trend="↑ 4" />
  <KPICard title="Sites Audited" value="24" trend="This month" />
  <KPICard title="Critical Issues" value="8" severity="critical" />
  <KPICard title="Recommendations" value="156" actionable />
</div>
```

---

### HIGH PRIORITY - Week 1-2
**Score Gauge Component** - Core visualization
- **File**: `components/charts/ScoreGauge.vue`
- **Time**: 2-3 hours
- **Impact**: ⭐⭐⭐⭐⭐ (Appears on every audit)
- **Depends on**: Design Tokens ✅, Chart.js (already installed)
- **Tech**: Chart.js doughnut chart
- **Props**: `score` (0-100), `label`, `size` ('sm'|'md'|'lg')
- **Features**:
  - Doughnut chart (semi-circle)
  - Animated on score change
  - Center label shows score + label
  - Color auto-selects (excellent/good/poor)
  - Responsive sizing

**Acceptance Criteria**:
- ✅ Chart renders correctly
- ✅ Score changes animate smoothly
- ✅ Color changes based on score ranges
- ✅ Center label properly positioned
- ✅ No flickering on re-render
- ✅ Responsive sizing works

**Test Data**:
```vue
<ScoreGauge :score="85" label="SEO" size="md" />
<ScoreGauge :score="42" label="Performance" size="lg" />
<ScoreGauge :score="95" label="Best Practices" size="sm" />
```

---

## 📋 Sprint 2 (Week 2-3)

### HIGH PRIORITY - Week 2
**Findings List Component** - Data organization
- **File**: `components/audit/FindingsList.vue`
- **Time**: 3-4 hours
- **Impact**: ⭐⭐⭐⭐ (Core audit view)
- **Depends on**: Design Tokens ✅
- **Features**:
  - Group by severity (Critical/Warning/Info)
  - Collapsible groups
  - Batch selection with checkboxes
  - Virtual scroll for 100+ items
  - Inline finding preview on hover
  - One-click actions (view/ignore/fix)

**Acceptance Criteria**:
- ✅ Renders 100+ findings without lag
- ✅ Groups collapse/expand smoothly
- ✅ Selection state persists
- ✅ Severity badges use semantic colors
- ✅ Mobile responsive (single column)
- ✅ Virtual scroll working (only ~20 rows in DOM)

---

### HIGH PRIORITY - Week 2-3
**Virtualized Audit Table** - Performance critical
- **File**: `components/tables/VirtualizedAuditTable.vue`
- **Time**: 4-5 hours
- **Impact**: ⭐⭐⭐⭐⭐ (Handles 1000+ rows)
- **Depends on**: Design Tokens ✅
- **Features**:
  - Virtual scroll (only visible rows rendered)
  - Sortable columns
  - Filterable data
  - Multi-select with bulk actions
  - Responsive: hide columns on mobile
  - Keyboard navigation (arrows, Enter)

**Performance Target**:
- Render 1000 rows in < 50ms
- Scroll smooth at 60 FPS
- Memory stable (no leaks)

**Acceptance Criteria**:
- ✅ 1000 rows render smoothly
- ✅ Scroll doesn't cause jank
- ✅ Sorting works efficiently
- ✅ Selection state correct
- ✅ Keyboard nav fully functional
- ✅ No console errors/warnings

---

## 🎨 Sprint 3 (Week 3-4)

### MEDIUM PRIORITY - Week 3
**Real-time Updates** - WebSocket integration
- **File**: `composables/useAuditUpdates.ts`
- **Time**: 2-3 hours
- **Impact**: ⭐⭐⭐ (UX polish)
- **Features**:
  - Connect to audit WebSocket
  - Optimistic UI updates
  - Server confirmation
  - Progress tracking
  - Auto-refresh when complete

---

### MEDIUM PRIORITY - Week 3
**Keyboard Shortcuts** - Power user features
- **File**: `composables/useKeyboardShortcuts.ts`
- **Time**: 1-2 hours
- **Impact**: ⭐⭐⭐ (Advanced users)
- **Shortcuts**:
  - `Ctrl+K` - Search
  - `Ctrl+N` - New audit
  - `j/k` - Navigate items
  - `o` - Open selected
  - `Space` - Select item
  - `e/c` - Expand/collapse all

---

## 📊 Status Tracking

### What's Done ✅
- [ ] Design Tokens System
- [ ] KPI Cards
- [ ] Score Gauge

### In Progress ⏳
- [ ] (Will update as work progresses)

### Not Started ❌
- [ ] Findings List
- [ ] Virtualized Table
- [ ] Real-time Updates
- [ ] Keyboard Shortcuts

---

## 🔗 Key Files to Know

| File | Purpose | Status |
|------|---------|--------|
| `assets/css/design-tokens.css` | Semantic colors/spacing | ⏳ First |
| `components/dashboard/KPICard.vue` | Metric cards | ⏳ Second |
| `components/charts/ScoreGauge.vue` | Score visualization | ⏳ Third |
| `components/audit/FindingsList.vue` | Findings display | ❌ Week 2 |
| `components/tables/VirtualizedAuditTable.vue` | Large dataset table | ❌ Week 2-3 |
| `composables/useAuditUpdates.ts` | WebSocket logic | ❌ Week 3 |
| `pages/dashboard.vue` | Dashboard page | ⏳ Being updated |
| `pages/audits/[id].vue` | Audit detail page | ⏳ Being updated |

---

## 🚀 Session Checklist

**Start of Session**:
```bash
git status                    # Clean working tree?
npm run type-check           # Any errors?
npm run dev                  # Dev server running?
```

**During Session**:
- [ ] Follow component architecture guidelines
- [ ] Use design tokens for all styling
- [ ] Add TypeScript types
- [ ] Test responsive behavior
- [ ] Check console for errors
- [ ] Commit frequently with clear messages

**End of Session**:
```bash
npm run type-check           # All good?
npm run lint                 # Any warnings?
npm run build               # Builds successfully?
npm run dev                 # Still running?
git add .
git commit -m "UI: [Feature] - [What changed]"
git push origin [branch]
```

---

## 💡 Pro Tips for Claude Code

1. **Design tokens first** - Don't style components until tokens exist
2. **Test responsive** - Check mobile (320px) while building
3. **Use semantic HTML** - `<button>`, `<nav>`, `<article>`, etc.
4. **TypeScript strict** - No `any` types, define interfaces
5. **Virtual scroll first** - Build with 100+ items in mind
6. **Commit often** - Small, logical commits are easier to revert

---

## ❓ Common Questions

**Q: Do I need to wait for tokens before starting components?**
A: YES! Tokens are the foundation. Everything after depends on them.

**Q: How do I test responsiveness?**
A: Use browser DevTools: F12 → toggle device toolbar (Ctrl+Shift+M)

**Q: Should I use Tailwind or CSS tokens?**
A: Use CSS tokens (they're more maintainable). Then if needed, add Tailwind for utility classes on top.

**Q: How many rows can I render before needing virtual scroll?**
A: ~50 rows max before noticeable slowdown. Use virtual scroll for 100+.

**Q: What's the rollback process if something breaks?**
A: `git reset --hard HEAD~1` (undo last commit) or `git checkout -- .` (undo unstaged changes)

---

## 📞 Getting Help

**TypeScript error?** → `npm run type-check` shows line numbers
**Component not showing?** → Check console (F12) for errors
**Styling wrong?** → Use DevTools inspector to see computed styles
**Performance bad?** → Record in DevTools Performance tab, look for long tasks

---

**Ready to build?** Start with Design Tokens! 🎨

Questions? Check `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md` for detailed guidance.
