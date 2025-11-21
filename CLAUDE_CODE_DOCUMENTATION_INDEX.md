# Claude Code Documentation Index

**Last Updated**: November 21, 2025  
**Purpose**: Central reference for all Claude Code guidance

---

## 📚 Documentation Hub

### 🎯 For Claude Code Sessions (Start Here)

**Quick Start** - Read this first:
- **[UI_UX_SPRINT_ROADMAP.md](UI_UX_SPRINT_ROADMAP.md)** ⭐ START HERE
  - Current priorities and sprint breakdown
  - Quick reference for what to build next
  - 5-minute read before each session
  - Status tracking and acceptance criteria

**Detailed Guidance** - Deep dive when needed:
- **[CLAUDE_CODE_UI_UX_INSTRUCTIONS.md](CLAUDE_CODE_UI_UX_INSTRUCTIONS.md)** 
  - Comprehensive guide for UI/UX advancement
  - Architecture patterns and best practices
  - Component specifications
  - Testing checklists
  - Git workflow

### 📋 General Project Context

**Project Overview**:
- **[README.md](README.md)** - Project vision and setup
- **[TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)** - System design
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Full doc index

**Current Project Status**:
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Overall progress
- **[IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md)** - Feature checklist

### 🚀 Deployment & Testing

**Before Going Live**:
- **[PRODUCTION_DEPLOYMENT_CHECKLIST.md](PRODUCTION_DEPLOYMENT_CHECKLIST.md)** - Preflight
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Detailed checklist
- **[RAILWAY_DEPLOYMENT_GUIDE_COMPLETE.md](RAILWAY_DEPLOYMENT_GUIDE_COMPLETE.md)** - Deploy to production

**Testing**:
- **[AUTOMATED_TESTING_PLAN.md](AUTOMATED_TESTING_PLAN.md)** - Test strategy
- **[TESTING_MASTER_GUIDE.md](TESTING_MASTER_GUIDE.md)** - Test execution

---

## 🔄 Recommended Reading Order

### For Your First Session
1. **UI_UX_SPRINT_ROADMAP.md** (5 min) - Understand priorities
2. **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** - Section: "Quick Start for Claude Code Sessions" (5 min)
3. **Start building!** 🎨

### Daily Check-In
1. **UI_UX_SPRINT_ROADMAP.md** - See "Current Sprint" section (2 min)
2. **Continue with yesterday's priorities** (or pick next item from roadmap)

### When Stuck
1. **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** - Find relevant section (architecture, testing, debugging)
2. **Common patterns** - Code snippets section
3. **Troubleshooting** - Debugging guide section

### Before Committing
1. **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** - Testing Checklist
2. **Git workflow** - Section in same document
3. **Run**:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   npm run dev
   ```

---

## 📖 Document Descriptions

### Primary UI/UX Guides

| Document | Purpose | Read Time | Status |
|----------|---------|-----------|--------|
| **UI_UX_SPRINT_ROADMAP.md** | Daily priorities & sprint planning | 5 min | ✅ Active |
| **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** | Detailed guidance & architecture | 30 min | ✅ Active |

### Technical References

| Document | Purpose | Use When |
|----------|---------|----------|
| TECHNICAL_ARCHITECTURE.md | System design & data flow | Understanding system design |
| TYPESCRIPT_FIXES.md | Type safety notes | Fixing TypeScript errors |
| CRITICAL_FIXES.md | Known issues & workarounds | Troubleshooting |

### Project Planning

| Document | Purpose | Use When |
|----------|---------|----------|
| PROJECT_STATUS.md | Overall project progress | Checking overall status |
| IMPLEMENTATION-STATUS.md | Feature completion tracking | Verifying what's done |
| PROJECT_COMPLETION_REPORT.md | Final project summary | Understanding full scope |

### Deployment

| Document | Purpose | Use When |
|----------|---------|----------|
| RAILWAY_DEPLOYMENT_GUIDE_COMPLETE.md | Deploy to production | Going live |
| PRODUCTION_DEPLOYMENT_CHECKLIST.md | Pre-deployment verification | Ready to ship |
| DEPLOYMENT_CHECKLIST.md | Detailed deployment steps | Step-by-step deploy |

### Testing

| Document | Purpose | Use When |
|----------|---------|----------|
| AUTOMATED_TESTING_PLAN.md | Test architecture | Planning tests |
| TESTING_MASTER_GUIDE.md | Running all tests | Before deployment |

---

## 🎯 Quick Navigation by Task

### "I need to add a new component"
1. Read: **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** → "Specific UI/UX Enhancements"
2. Find relevant component section
3. Use "Workflow for Implementing New Features" section
4. Follow "Testing Checklist"

### "I need to style something"
1. Check: **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** → "Design Token Usage"
2. Use tokens from `assets/css/design-tokens.css`
3. Avoid direct colors/spacing values

### "My component isn't rendering"
1. Check: **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** → "Debugging Guide"
2. Follow troubleshooting steps
3. Review component registration in `nuxt.config.ts`

### "I'm getting TypeScript errors"
1. Run: `npm run type-check` (shows file/line numbers)
2. Fix errors one by one
3. Reference: **TYPESCRIPT_FIXES.md** if stuck

### "Performance is bad"
1. Check: **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** → "Performance Optimization Guidelines"
2. Profile in browser DevTools
3. Consider virtual scrolling for lists > 100 items

### "Ready to deploy"
1. Run: Full test suite (see command in CLAUDE_CODE_UI_UX_INSTRUCTIONS.md)
2. Follow: **PRODUCTION_DEPLOYMENT_CHECKLIST.md**
3. Execute: **RAILWAY_DEPLOYMENT_GUIDE_COMPLETE.md**

---

## 🔗 External Resources

**Vue 3 & Nuxt**
- Vue 3 Docs: https://vuejs.org
- Nuxt 3 Guide: https://nuxt.com
- Composition API: https://vuejs.org/guide/extras/composition-api-faq.html

**Styling & Design**
- Tailwind CSS: https://tailwindcss.com
- Design Tokens: https://tokens.studio/

**Data Visualization**
- Chart.js Docs: https://www.chartjs.org
- Chart.js Vue Plugin: https://www.vue-chartjs.org/

**State Management**
- Pinia Docs: https://pinia.vuejs.org

**Database**
- Supabase Docs: https://supabase.io/docs

---

## 📱 File Structure Guide

```
neon-seo-beacon/
├── 📄 CLAUDE_CODE_UI_UX_INSTRUCTIONS.md     ← Main guide
├── 📄 UI_UX_SPRINT_ROADMAP.md               ← Daily priorities
├── 📄 CLAUDE_CODE_DOCUMENTATION_INDEX.md    ← You are here
│
├── components/                               ← Build here
│   ├── dashboard/
│   ├── audit/
│   ├── charts/
│   ├── tables/
│   └── ui/
│
├── assets/css/
│   └── design-tokens.css                    ← Create first
│
├── composables/                              ← Reusable logic
├── stores/                                   ← State management
├── pages/                                    ← Routes
│
└── ... (other project files)
```

---

## ✅ Pre-Session Checklist

Before starting your Claude Code session:

```
□ Opened correct repository (Kr8thor/neon-seo-beacon)
□ On main branch or feature branch
□ Working tree is clean (git status shows no changes)
□ Reviewed current sprint in UI_UX_SPRINT_ROADMAP.md
□ Environment verified (npm run dev works)
□ TypeScript check passes (npm run type-check)
```

---

## 💬 Quick Reference Commands

### Development
```bash
npm run dev                # Start dev server
npm run build             # Build for production
npm run preview           # Test production build
```

### Quality Checks
```bash
npm run type-check        # TypeScript validation
npm run lint             # Code linting
npm run lint:fix         # Auto-fix lint issues
```

### Testing
```bash
npm run test:unit        # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run test:performance # Lighthouse audit
```

### Git Workflow
```bash
git status               # Check status
git add .               # Stage changes
git commit -m "msg"     # Commit with message
git push origin branch  # Push to remote
```

---

## 🚨 Common Issues & Quick Fixes

| Issue | Solution | Docs |
|-------|----------|------|
| TypeScript errors | `npm run type-check` shows line numbers | TYPESCRIPT_FIXES.md |
| Component not showing | Check console (F12), verify auto-import | CLAUDE_CODE_UI_UX_INSTRUCTIONS.md → Debugging |
| Styling not applied | Verify tokens exist, check CSS specificity | CLAUDE_CODE_UI_UX_INSTRUCTIONS.md → Design Tokens |
| Build fails | Run `npm run clean` then `npm install` | README.md |
| Port 3000 in use | `lsof -i :3000` then kill process | Terminal help |

---

## 📞 Getting Help

**Lost?** → Read **UI_UX_SPRINT_ROADMAP.md** (quick overview)

**Architecture questions?** → Read **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** (patterns & guidelines)

**TypeScript errors?** → Check **TYPESCRIPT_FIXES.md** (common errors)

**Performance issues?** → See **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** → Performance section

**Ready to deploy?** → Follow **PRODUCTION_DEPLOYMENT_CHECKLIST.md**

---

## 🎓 Learning Path

**Week 1: Foundations**
1. Read UI_UX_SPRINT_ROADMAP.md
2. Build design tokens system
3. Build KPI Cards component
4. Build Score Gauge component

**Week 2: Core Features**
5. Build Findings List component
6. Build Virtualized Table component
7. Test all components thoroughly

**Week 3: Polish**
8. Add real-time WebSocket updates
9. Implement keyboard shortcuts
10. Responsive & accessibility audit

**Week 4: Deployment**
11. Pre-deployment checks
12. Deploy to production
13. Monitor and fix issues

---

## 📊 Progress Tracking

### Completed
- ✅ Project structure analyzed
- ✅ UI/UX guidance documented
- ✅ Sprint roadmap created
- ✅ Architecture patterns defined

### In Progress
- ⏳ Design tokens system
- ⏳ KPI Cards component
- ⏳ Score Gauge component

### Not Started
- ❌ Findings List component
- ❌ Virtualized Table
- ❌ Real-time WebSocket
- ❌ Keyboard shortcuts

---

## 🎉 You're Ready!

Start with:
1. **UI_UX_SPRINT_ROADMAP.md** - see what to build
2. **CLAUDE_CODE_UI_UX_INSTRUCTIONS.md** - understand how to build it
3. **Open your IDE and start coding!** 🚀

Questions? This document has all the references you need. Happy coding!

---

**Last Updated**: November 21, 2025  
**Maintained By**: Claude Code  
**Questions?** Refer to detailed documentation or check git history for context
