# Claude Desktop Research Prompt: Production-Level SEO Tool Frontend

## Your Task

Research and create a comprehensive implementation plan to elevate this SEO analysis tool's frontend to production-level quality matching Ahrefs, SEMrush, and Google's developer tools.

## Step 1: Analyze Current State

Use Desktop Commander to clone and analyze:
```bash
git clone https://github.com/Kr8thor/neon-seo-beacon.git
cd neon-seo-beacon
git checkout claude/fix-todo-mi8uie8i50kv9q7s-01FM1TL9h5pET2X7BaYycZx7
```

Review these frontend files:
- `pages/` - All Vue pages
- `components/` - UI components
- `layouts/` - App layouts
- `assets/` - Styles
- `nuxt.config.ts` - Configuration

## Step 2: Research Production Standards

Analyze these aspects from top tools (Ahrefs, SEMrush, Google Search Console, Lighthouse):

### Data Visualization
- How do they display scores, metrics, trends?
- Chart types, color systems, data density
- Progressive disclosure of complex data
- Sparklines, gauges, heat maps

### Information Architecture
- Navigation patterns for complex data
- Dashboard layouts and widget systems
- Drill-down patterns (overview → detail)
- Filtering, sorting, comparison views

### Interaction Design
- Loading states, skeleton screens, optimistic UI
- Micro-interactions and feedback
- Keyboard shortcuts for power users
- Bulk actions and batch operations

### Performance Patterns
- Virtual scrolling for large datasets
- Lazy loading strategies
- Caching and state management
- Real-time updates without jank

### Professional Polish
- Typography hierarchy and spacing systems
- Color systems (semantic colors for scores/severity)
- Icon systems and visual consistency
- Empty states, error states, edge cases
- Responsive behavior for data-heavy views

## Step 3: Create Implementation Plan

Return a detailed prompt with:

1. **Component Architecture** - Specific components to build (with props/events)
2. **Design System** - Colors, typography, spacing tokens
3. **Page-by-Page Improvements** - Exact changes for each view
4. **Data Visualization Library** - Recommend and configure (Chart.js, D3, Apache ECharts)
5. **State Management** - Pinia stores structure
6. **Performance Optimizations** - Specific techniques
7. **Code Examples** - Key patterns to implement

## Output Format

Return a prompt that Claude Code can execute to implement these improvements. The prompt should be:
- Specific and actionable (not generic advice)
- Include exact file paths and component names
- Provide code snippets for complex patterns
- Prioritized by impact (what to build first)
- Production-ready (error handling, edge cases, accessibility)

Focus on:
- Functional density (show more useful data per screen)
- Scannability (users find what they need instantly)
- Professional credibility (looks like a $99/month tool)
- Speed (feels instant, never blocks the user)

Do NOT suggest:
- Generic UI libraries without specific usage
- Placeholder designs to "fill in later"
- Aesthetic-only changes without functional value
