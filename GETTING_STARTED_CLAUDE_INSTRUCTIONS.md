# 🎯 Getting Started with Neon SEO Beacon

**For**: Anyone working on this project (Claude Desktop or Claude Code)  
**Updated**: November 21, 2025  
**Repository**: https://github.com/Kr8thor/neon-seo-beacon

---

## 📖 Where to Start Based on Your Role

### 🤖 If you're Claude Desktop (Chat Interface)
**You help with**: Analysis, planning, guidance, asking questions  
**Start with**: `CLAUDE_DESKTOP_PROJECT_CONTEXT.md`
- Learn project context in 5 minutes
- Understand architecture and design system
- Know what to reference when asked to help
- Get quick answers to common questions

### 💻 If you're Claude Code (Terminal/IDE)
**You help with**: Building components, coding, implementing features  
**Start with**: `UI_UX_SPRINT_ROADMAP.md` → then `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md`
- See this week's priorities (5 min)
- Deep dive into architecture patterns (30 min)
- Start building!

### 👤 If you're a Human User/Project Owner
**You help with**: Directing work, reviewing, planning  
**Start with**: `PROJECT_STATUS.md` → then `UI_UX_SPRINT_ROADMAP.md`
- Check overall project progress
- See what Claude is building this week
- Review component requirements

---

## 🚀 Quick Start (5 minutes)

### What is this project?
**Neon SEO Beacon** - A professional SEO analysis tool being upgraded to match industry leaders (Ahrefs, SEMrush).

### What's happening now?
**UI/UX Enhancement Phase** - Building beautiful, production-grade dashboard components.

### Tech Stack
- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS + Design Tokens
- **Charts**: Chart.js
- **State**: Pinia
- **Database**: Supabase
- **Hosting**: Railway

### How to Clone & Setup
```bash
git clone https://github.com/Kr8thor/neon-seo-beacon.git
cd neon-seo-beacon
npm install
npm run dev
# Opens http://localhost:3000
```

---

## 📁 Documentation Map

```
📚 DOCUMENTATION HUB
│
├─ 🎯 QUICK START (START HERE)
│  ├─ CLAUDE_DESKTOP_PROJECT_CONTEXT.md      (If you're Claude Desktop)
│  ├─ UI_UX_SPRINT_ROADMAP.md               (If you're Claude Code)
│  └─ PROJECT_STATUS.md                      (If you're project owner)
│
├─ 📋 DETAILED GUIDES
│  ├─ CLAUDE_CODE_UI_UX_INSTRUCTIONS.md     (Deep dive for builders)
│  ├─ TECHNICAL_ARCHITECTURE.md             (System design)
│  └─ FRONTEND_IMPLEMENTATION_PLAN.md       (Complete plan)
│
├─ 🗺️ NAVIGATION & REFERENCE
│  ├─ CLAUDE_CODE_DOCUMENTATION_INDEX.md    (Find anything)
│  └─ DOCUMENTATION_INDEX.md                (Full reference)
│
├─ ✅ TESTING & DEPLOYMENT
│  ├─ TESTING_MASTER_GUIDE.md               (How to test)
│  ├─ AUTOMATED_TESTING_PLAN.md             (Test strategy)
│  ├─ PRODUCTION_DEPLOYMENT_CHECKLIST.md    (Pre-deploy)
│  └─ RAILWAY_DEPLOYMENT_GUIDE_COMPLETE.md  (Deploy)
│
└─ 📊 STATUS & TRACKING
   ├─ PROJECT_STATUS.md                      (Overall progress)
   ├─ IMPLEMENTATION-STATUS.md               (Feature checklist)
   └─ PROJECT_COMPLETION_REPORT.md           (Final report)
```

---

## 🎯 This Week's Priorities

**Sprint 1 Focus**: Foundation & Core Components

### 1️⃣ Design Tokens System (HIGHEST PRIORITY)
- **Why**: Everything else depends on this
- **File**: `assets/css/design-tokens.css`
- **Time**: 1-2 hours
- **Status**: ⏳ To Do
- **Next**: Can't start other components until this exists

### 2️⃣ KPI Card Component
- **Why**: User's first dashboard impression
- **File**: `components/dashboard/KPICard.vue`
- **Time**: 2-3 hours
- **Status**: ⏳ Waiting for tokens
- **What**: 4-column grid showing Avg Score, Sites, Issues, Recommendations

### 3️⃣ Score Gauge Component
- **Why**: Core visualization used everywhere
- **File**: `components/charts/ScoreGauge.vue`
- **Time**: 2-3 hours
- **Status**: ⏳ Waiting for tokens
- **What**: Doughnut chart showing 0-100 score with semantic color

---

## 🔗 Key Workflows

### "I want to work on the project"
1. Read: `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md`
2. Check: `UI_UX_SPRINT_ROADMAP.md` for this week's tasks
3. Start building: Design tokens first → KPI Cards → Score Gauge
4. Test: Use checklists in the instructions
5. Commit: Follow git workflow from instructions

### "I want to understand what Claude is building"
1. Read: `PROJECT_STATUS.md` (overall progress)
2. Check: `UI_UX_SPRINT_ROADMAP.md` (this week's work)
3. Reference: `CLAUDE_DESKTOP_PROJECT_CONTEXT.md` (technical details)

### "I need Claude to build something"
1. Read: `CLAUDE_DESKTOP_PROJECT_CONTEXT.md` (understand architecture)
2. Check: `UI_UX_SPRINT_ROADMAP.md` (see dependencies)
3. Ask clearly: Reference the sprint roadmap
4. Wait: Claude will build with proper testing

### "Something isn't working"
1. Check: `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md` → "Debugging Guide"
2. Run: `npm run type-check`, `npm run lint`, `npm run dev`
3. Inspect: DevTools (F12) to see what's wrong
4. Reference: Specific documentation section for your issue

---

## 🎓 Architecture Quick Reference

### Component Pattern
```vue
<script setup lang="ts">
// Define types first
interface Props {
  title: string;
  value: number;
}

defineProps<Props>();
defineEmits<{ click: [id: string] }>();

// Component logic here
</script>

<template>
  <!-- Template using semantic HTML -->
</template>

<style scoped>
/* Styles using design tokens */
.component {
  color: var(--color-text-primary);
  padding: var(--space-4);
}
</style>
```

### State Management Pattern
```typescript
// stores/myStore.ts
export const useMyStore = defineStore('my-store', {
  state: () => ({ data: [] }),
  getters: { filtered: (state) => state.data.filter(...) },
  actions: { async fetch() { /* load data */ } }
});
```

### Composable Pattern
```typescript
// composables/useMyLogic.ts
export function useMyLogic(param: Ref<string>) {
  const result = computed(() => /* computation */);
  return { result };
}
```

---

## ⚡ Common Commands

**Development**
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Test prod build locally
```

**Quality**
```bash
npm run type-check       # TypeScript validation ← run before commits
npm run lint             # Code quality check
npm run lint:fix         # Auto-fix lint issues
```

**Testing**
```bash
npm run test:unit        # Unit tests
npm run test:e2e         # End-to-end tests
npm run test:performance # Lighthouse audit
```

---

## ✅ Before You Start

Make sure you have:
- [ ] Repository cloned locally
- [ ] Node 18+ installed (check `.nvmrc`)
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server working (`npm run dev` opens http://localhost:3000)
- [ ] TypeScript checks pass (`npm run type-check`)
- [ ] Read your role-specific doc above ☝️

---

## 🚦 Status at a Glance

| Component | Status | Dependencies | File |
|-----------|--------|--------------|------|
| Design Tokens | ⏳ Next | None | `assets/css/design-tokens.css` |
| KPI Cards | ⏳ Week 1 | Tokens ✓ | `components/dashboard/KPICard.vue` |
| Score Gauge | ⏳ Week 1 | Tokens ✓ | `components/charts/ScoreGauge.vue` |
| Findings List | ❌ Week 2 | Tokens, KPI | `components/audit/FindingsList.vue` |
| Virtualized Table | ❌ Week 2-3 | Tokens | `components/tables/VirtualizedAuditTable.vue` |

---

## 🎯 Success Metrics

**For Each Component**:
- ✅ No TypeScript errors
- ✅ No lint warnings
- ✅ Responsive (tested mobile/tablet/desktop)
- ✅ Uses design tokens
- ✅ Acceptance criteria met
- ✅ Git commit with clear message

**For Sprints**:
- ✅ All components working
- ✅ No console errors
- ✅ Performance targets met
- ✅ Tests passing

---

## 🤝 How We Work

**Claude Desktop** asks Claude Code what to build, provides guidance, reviews plans.  
**Claude Code** implements features, runs tests, commits changes.  
**You** review progress, make decisions, guide direction.

**Everyone** references the same documentation to stay aligned.

---

## 🆘 Getting Help

**Documentation first**: Check the relevant guide for your role above.  
**Quick reference**: `CLAUDE_CODE_DOCUMENTATION_INDEX.md` for finding anything.  
**Stuck?**: Check "Debugging Guide" in `CLAUDE_CODE_UI_UX_INSTRUCTIONS.md`.  
**Not sure**: Ask Claude Desktop - that's what I'm here for!

---

## 🎉 Ready?

**Pick your path**:

→ **Claude Desktop**: Read `CLAUDE_DESKTOP_PROJECT_CONTEXT.md`  
→ **Claude Code**: Read `UI_UX_SPRINT_ROADMAP.md`  
→ **Project Owner**: Read `PROJECT_STATUS.md`

Then let's build something great! 🚀

---

**Questions?** Everything you need is in one of the docs linked above.  
**Ready to go?** Follow your role's starting doc.  
**Let's make this the best SEO tool UI out there.** 💪
