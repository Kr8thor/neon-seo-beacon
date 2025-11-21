# Claude Code Prompt Library - SEO Tool Frontend

This directory contains modular Claude Code prompts for implementing the production-level frontend upgrade.

## Phase 1: Foundation (Week 1-2)

### Prompt 1.1: Design System Tokens
**File**: `.claudecode/prompts/phase1-design-tokens.md`
**Execution**: `claude-code < .claudecode/prompts/phase1-design-tokens.md`

Creates the semantic design token system across:
- `assets/css/tokens.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind extensions
- `composables/useDesignTokens.ts` - TypeScript utilities

### Prompt 1.2: Dashboard Widget System
**File**: `.claudecode/prompts/phase1-widget-system.md`

Builds reusable widget architecture:
- `components/widgets/DashboardWidget.vue` - Base component
- `composables/useDashboardLayout.ts` - Grid/drag logic
- `stores/dashboardStore.ts` - Widget configuration persistence

### Prompt 1.3: Score Visualization Components
**File**: `.claudecode/prompts/phase1-chart-components.md`

Creates Chart.js integrated components:
- `components/charts/ScoreGauge.vue`
- `components/charts/TrendChart.vue`
- `components/charts/WaterfallChart.vue`
- `composables/useChartConfig.ts`

### Prompt 1.4: Pinia Store Architecture
**File**: `.claudecode/prompts/phase1-pinia-stores.md`

Sets up state management:
- `stores/auditStore.ts` - Audit CRUD + caching
- `stores/dashboardStore.ts` - Dashboard state
- `stores/filterStore.ts` - Global filter state

---

## Phase 2: Core Features (Week 2-3)

### Prompt 2.1: Dashboard Page Rebuild
**File**: `.claudecode/prompts/phase2-dashboard-page.md`

Replaces `pages/dashboard.vue` with:
- KPI cards row
- Widget grid layout
- Real-time audit list
- Keyboard shortcuts

### Prompt 2.2: Audit Results Page
**File**: `.claudecode/prompts/phase2-audit-detail-page.md`

Creates `pages/audits/[id].vue` with:
- Score breakdown header (sticky)
- Tabbed navigation
- Overview tab with score waterfalls
- Findings tab with virtualized list
- Comparison tab

### Prompt 2.3: Virtualized Data Table
**File**: `.claudecode/prompts/phase2-virtualized-table.md`

Builds `components/tables/VirtualizedDataTable.vue`:
- 1000+ rows without lag
- Column resizing/reordering
- Keyboard navigation
- Inline editing support

### Prompt 2.4: Findings List Component
**File**: `.claudecode/prompts/phase2-findings-list.md`

Creates `components/audit/FindingsList.vue`:
- Severity grouping
- Inline previews
- Quick fix suggestions
- Batch selection

---

## Phase 3: Polish & Performance (Week 3-4)

### Prompt 3.1: Performance Optimization
**File**: `.claudecode/prompts/phase3-performance.md`

Implements:
- Code splitting configuration
- Image lazy loading
- Intersection Observer patterns
- Bundle size analysis

### Prompt 3.2: Real-time WebSocket Integration
**File**: `.claudecode/prompts/phase3-websocket.md`

Adds:
- WebSocket audit updates
- Optimistic UI updates
- Automatic reconnection
- Background sync

### Prompt 3.3: Keyboard Shortcuts & Power User
**File**: `.claudecode/prompts/phase3-keyboard-shortcuts.md`

Implements:
- Vim-style navigation
- Global command palette
- Action shortcuts
- Accessibility features

### Prompt 3.4: Comparison Views
**File**: `.claudecode/prompts/phase3-comparison-view.md`

Creates:
- Audit vs previous audit
- Audit vs benchmark
- Competitive comparison
- Trend analysis

---

## Phase 4: Advanced Features (Ongoing)

### Prompt 4.1: PDF Export
**File**: `.claudecode/prompts/phase4-pdf-export.md`

Implements:
- Report generation
- Custom branding
- Data visualization in PDF

### Prompt 4.2: Dark Mode
**File**: `.claudecode/prompts/phase4-dark-mode.md`

Adds:
- Dark theme colors
- System preference detection
- User preference persistence

### Prompt 4.3: Accessibility
**File**: `.claudecode/prompts/phase4-accessibility.md`

Ensures:
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard-only navigation
- High contrast mode

---

## How to Use

### For Individual Prompts:
```bash
# Read specific prompt
cat .claudecode/prompts/phase1-design-tokens.md

# Copy prompt and use with Claude Code CLI
claude-code "$(cat .claudecode/prompts/phase1-design-tokens.md)"
```

### For Sequential Execution:
Use the master orchestrator prompt: `.claudecode/ORCHESTRATOR.md`

### For Custom Sequences:
Create execution file:
```bash
cat > .claudecode/custom-execution.sh << 'EOF'
#!/bin/bash
PROMPTS=(
  ".claudecode/prompts/phase1-design-tokens.md"
  ".claudecode/prompts/phase1-widget-system.md"
  ".claudecode/prompts/phase1-chart-components.md"
)

for prompt in "${PROMPTS[@]}"; do
  echo "Executing: $prompt"
  claude-code "$(cat $prompt)"
  echo "---"
done
EOF
```

---

## Status Tracking

- [ ] Phase 1.1: Design Tokens
- [ ] Phase 1.2: Widget System
- [ ] Phase 1.3: Chart Components
- [ ] Phase 1.4: Pinia Stores
- [ ] Phase 2.1: Dashboard Page
- [ ] Phase 2.2: Audit Detail Page
- [ ] Phase 2.3: Virtualized Table
- [ ] Phase 2.4: Findings List
- [ ] Phase 3.1: Performance
- [ ] Phase 3.2: WebSocket
- [ ] Phase 3.3: Keyboard Shortcuts
- [ ] Phase 3.4: Comparison Views
- [ ] Phase 4.1: PDF Export
- [ ] Phase 4.2: Dark Mode
- [ ] Phase 4.3: Accessibility

---

## Notes

- Each prompt is self-contained and can run independently
- Later phases assume earlier phases are complete
- All prompts include error handling and testing patterns
- Prompts reference exact file paths matching the codebase structure
