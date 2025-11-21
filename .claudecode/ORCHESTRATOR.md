# Master Orchestrator: Production SEO Tool Frontend Implementation

## Overview
This is the master control prompt for implementing the production-level frontend upgrade for Neon SEO Beacon. All prompts are stored in `.claudecode/prompts/` and organized by phase.

## Quick Start

### Execute Individual Phase
```bash
# Phase 1.1: Design Tokens
claude-code "$(cat .claudecode/prompts/phase1-design-tokens.md)"

# Phase 1.2: Widget System
claude-code "$(cat .claudecode/prompts/phase1-widget-system.md)"

# Phase 1.3: Chart Components
claude-code "$(cat .claudecode/prompts/phase1-chart-components.md)"

# Phase 1.4: Pinia Stores
claude-code "$(cat .claudecode/prompts/phase1-pinia-stores.md)"

# Phase 2.1: Dashboard Page
claude-code "$(cat .claudecode/prompts/phase2-dashboard-page.md)"
```

### Execute Full Phase (Sequential)
```bash
# Run all Phase 1 prompts
for prompt in phase1-*.md; do
  echo "Executing $prompt..."
  claude-code "$(cat .claudecode/prompts/$prompt)"
  sleep 2
done
```

---

## Phase 1: Foundation (Week 1-2)

Establishes the core architecture and reusable components.

### 1.1 Design System Tokens
**File**: `.claudecode/prompts/phase1-design-tokens.md`
**Time**: ~1 hour
**Creates**:
- `assets/css/tokens.css` - Semantic design tokens
- `tailwind.config.js` - Tailwind extensions
- `composables/useDesignTokens.ts` - Runtime token access

**Status**: ⬜ Not Started

### 1.2 Dashboard Widget System
**File**: `.claudecode/prompts/phase1-widget-system.md`
**Time**: ~2 hours
**Creates**:
- `components/widgets/DashboardWidget.vue` - Base widget
- `composables/useDashboardLayout.ts` - Grid + drag logic
- `stores/dashboardStore.ts` - Widget state
- Example widgets (RecentAudits, AverageScore)

**Dependencies**: Phase 1.1
**Status**: ⬜ Not Started

### 1.3 Chart Components
**File**: `.claudecode/prompts/phase1-chart-components.md`
**Time**: ~2 hours
**Creates**:
- `components/charts/ScoreGauge.vue`
- `components/charts/TrendChart.vue`
- `components/charts/WaterfallChart.vue`
- `components/charts/HeatmapMatrix.vue`
- `composables/useChartConfig.ts`
- `composables/useChartAnimations.ts`

**Dependencies**: Phase 1.1
**Status**: ⬜ Not Started

### 1.4 Pinia Store Architecture
**File**: `.claudecode/prompts/phase1-pinia-stores.md`
**Time**: ~2 hours
**Creates**:
- `stores/auditStore.ts` - Audit CRUD + caching
- `stores/dashboardStore.ts` - Dashboard state
- `stores/filterStore.ts` - Global filters

**Dependencies**: None (can run in parallel)
**Status**: ⬜ Not Started

**Phase 1 Total**: ~7 hours

---

## Phase 2: Core Features (Week 2-3)

Implements primary application pages and complex components.

### 2.1 Dashboard Page Rebuild
**File**: `.claudecode/prompts/phase2-dashboard-page.md`
**Time**: ~3 hours
**Replaces**: `pages/dashboard.vue`
**Creates**:
- KPI cards (4-up grid)
- Widget grid with drag-to-reorder
- Recent audits table
- Keyboard shortcuts
- Search + filter UI

**Dependencies**: Phase 1 (all)
**Status**: ⬜ Not Started

### 2.2 Audit Results Page
**File**: `.claudecode/prompts/phase2-audit-detail-page.md`
**Time**: ~3 hours
**Creates/Replaces**: `pages/audits/[id].vue`
**Includes**:
- Score header (sticky)
- Tabbed interface (Overview/Findings/Comparison)
- Score breakdown waterfall
- Virtualized findings list
- Comparison view

**Dependencies**: Phase 1 (all), Phase 2.1
**Status**: ⬜ Not Started

### 2.3 Virtualized Data Table
**File**: `.claudecode/prompts/phase2-virtualized-table.md`
**Time**: ~2 hours
**Creates**: `components/tables/VirtualizedDataTable.vue`
**Features**:
- 1000+ rows without lag (virtual scrolling)
- Column resizing/reordering
- Multi-sort + filtering
- Keyboard navigation (arrow keys, enter to edit)
- Inline editing for editable columns

**Dependencies**: Phase 1.1
**Status**: ⬜ Not Started

### 2.4 Findings List Component
**File**: `.claudecode/prompts/phase2-findings-list.md`
**Time**: ~1.5 hours
**Creates**: `components/audit/FindingsList.vue`
**Features**:
- Severity-based grouping
- Inline preview on hover
- Quick fix suggestions
- Batch selection

**Dependencies**: Phase 2.3
**Status**: ⬜ Not Started

**Phase 2 Total**: ~9.5 hours

---

## Phase 3: Polish & Performance (Week 3-4)

Optimizes for production performance and adds advanced features.

### 3.1 Performance Optimization
**File**: `.claudecode/prompts/phase3-performance.md`
**Time**: ~2 hours
**Implements**:
- Code splitting by route
- Image lazy loading
- Intersection Observer patterns
- Bundle size analysis

**Dependencies**: Phase 2 (all)
**Status**: ⬜ Not Started

### 3.2 WebSocket Real-time Updates
**File**: `.claudecode/prompts/phase3-websocket.md`
**Time**: ~1.5 hours
**Creates**: `composables/useAuditUpdates.ts`
**Features**:
- WebSocket client for audit updates
- Optimistic UI updates
- Automatic reconnection
- Background sync

**Dependencies**: Phase 1.4
**Status**: ⬜ Not Started

### 3.3 Keyboard Shortcuts & Power Users
**File**: `.claudecode/prompts/phase3-keyboard-shortcuts.md`
**Time**: ~1 hour
**Creates**: `composables/useKeyboardShortcuts.ts`
**Includes**:
- Vim-style navigation (j/k)
- Global shortcuts (Ctrl+K search, Ctrl+N new)
- Command palette
- Accessibility features

**Dependencies**: Phase 2.1
**Status**: ⬜ Not Started

### 3.4 Comparison Views
**File**: `.claudecode/prompts/phase3-comparison-view.md`
**Time**: ~2 hours
**Creates**: `components/audit/ComparisonView.vue`
**Features**:
- Audit vs previous audit
- Audit vs benchmark
- Competitive comparison
- Trend sparklines

**Dependencies**: Phase 1.3, Phase 2.2
**Status**: ⬜ Not Started

**Phase 3 Total**: ~6.5 hours

---

## Phase 4: Advanced Features (Ongoing)

Optional features for premium functionality.

### 4.1 PDF Export
**File**: `.claudecode/prompts/phase4-pdf-export.md`
- Report generation with branding
- Data visualization in PDF
- Custom templates

### 4.2 Dark Mode
**File**: `.claudecode/prompts/phase4-dark-mode.md`
- Dark theme colors
- System preference detection
- User preference persistence

### 4.3 Accessibility
**File**: `.claudecode/prompts/phase4-accessibility.md`
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard-only navigation
- High contrast mode

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] 1.1 Design Tokens
  - [ ] Tokens.css created
  - [ ] Tailwind config updated
  - [ ] TypeScript utilities working
  - [ ] Dark mode colors defined
  - [ ] Build successful, no errors

- [ ] 1.2 Widget System
  - [ ] DashboardWidget component rendering
  - [ ] Drag-to-reorder working
  - [ ] Layout persisting
  - [ ] Example widgets created
  - [ ] No jank on drag

- [ ] 1.3 Chart Components
  - [ ] All 5 chart types rendering
  - [ ] Animations smooth
  - [ ] Responsive on all sizes
  - [ ] Dark mode colors correct
  - [ ] Accessibility verified

- [ ] 1.4 Pinia Stores
  - [ ] All 3 stores created
  - [ ] Caching working with TTL
  - [ ] No memory leaks
  - [ ] localStorage persistence
  - [ ] TypeScript types working

### Phase 2: Core Features
- [ ] 2.1 Dashboard Page
  - [ ] Page loads in < 2s
  - [ ] All data displaying
  - [ ] Filters working
  - [ ] Keyboard shortcuts functional
  - [ ] Mobile responsive

- [ ] 2.2 Audit Detail Page
  - [ ] All tabs rendering
  - [ ] Score breakdown visible
  - [ ] Findings list virtualized
  - [ ] Comparison working
  - [ ] Share/export buttons

- [ ] 2.3 Virtualized Table
  - [ ] 1000+ rows don't lag
  - [ ] Column resize working
  - [ ] Sorting/filtering fast
  - [ ] Keyboard nav working
  - [ ] Accessibility compliant

- [ ] 2.4 Findings List
  - [ ] Severity grouping correct
  - [ ] Inline previews working
  - [ ] Batch selection working
  - [ ] Performance good

### Phase 3: Polish & Performance
- [ ] 3.1 Performance
  - [ ] Code splitting working
  - [ ] Images lazy loading
  - [ ] Lighthouse score > 80
  - [ ] Bundle size reduced

- [ ] 3.2 WebSocket
  - [ ] Real-time updates working
  - [ ] Optimistic UI functioning
  - [ ] Reconnection automatic
  - [ ] No errors in console

- [ ] 3.3 Keyboard Shortcuts
  - [ ] All shortcuts working
  - [ ] Command palette functional
  - [ ] Vim-style nav working
  - [ ] Accessibility tested

- [ ] 3.4 Comparison Views
  - [ ] Comparison modal opening
  - [ ] Charts displaying correctly
  - [ ] Trends showing
  - [ ] Performance good

---

## Running the Full Pipeline

### Automated Execution Script
Create `scripts/execute-frontend-upgrade.sh`:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Neon SEO Beacon Frontend Upgrade${NC}"
echo "=============================================="

# Phase 1
echo -e "\n${BLUE}PHASE 1: Foundation${NC}"

for i in 1 2 3 4; do
  prompt_file=".claudecode/prompts/phase1-*.md" | sed -n "${i}p"
  echo -e "Executing Phase 1.${i}..."
  claude-code "$(cat .claudecode/prompts/phase1-$i*.md)"
  sleep 2
done

# Phase 2
echo -e "\n${BLUE}PHASE 2: Core Features${NC}"

for i in 1 2 3 4; do
  echo -e "Executing Phase 2.${i}..."
  claude-code "$(cat .claudecode/prompts/phase2-$i*.md)"
  sleep 2
done

# Phase 3
echo -e "\n${BLUE}PHASE 3: Polish & Performance${NC}"

for i in 1 2 3 4; do
  echo -e "Executing Phase 3.${i}..."
  claude-code "$(cat .claudecode/prompts/phase3-$i*.md)"
  sleep 2
done

echo -e "\n${GREEN}Frontend Upgrade Complete!${NC}"
```

### Manual Execution
Execute one prompt at a time, testing after each phase.

---

## Testing Strategy

### After Each Phase
1. `npm run dev` - Verify no build errors
2. `npm run lint` - Check code quality
3. Manual testing - Navigate key flows
4. `npm run test:unit` - Unit tests pass

### Full Test Suite
```bash
npm run test:all          # All tests
npm run test:performance  # Lighthouse
npm run test:accessibility # A11y audit
```

---

## Expected Timeline

- **Phase 1**: 2 days (foundation)
- **Phase 2**: 3 days (core features)
- **Phase 3**: 2 days (polish)
- **Total**: ~7 business days

---

## Support & Debugging

### Common Issues

**Build errors after Phase 1.1?**
- Clear Nuxt cache: `npm run clean`
- Reinstall deps: `rm -rf node_modules && npm install`

**Components not rendering?**
- Verify file paths match exactly
- Check component auto-import in nuxt.config.ts
- Run `npm run type-check`

**Performance degradation?**
- Check bundle size: `npm run build --analyze`
- Profile in DevTools Performance tab
- Check for memory leaks with DevTools heap snapshots

### Getting Help
1. Check the acceptance criteria for each phase
2. Review any error messages in the console
3. Verify previous phases completed successfully
4. Run individual component test files

---

## Next Steps After Completion

1. **Staging Deployment**: Deploy to staging environment
2. **User Testing**: Get feedback from team
3. **Performance Profiling**: Measure real-world performance
4. **Bug Fixes**: Address any issues found
5. **Production Release**: Deploy to production

---

## Version History

- **v1.0** (Nov 21, 2025): Initial implementation plan
- Prompts location: https://github.com/Kr8thor/neon-seo-beacon/tree/main/.claudecode/prompts