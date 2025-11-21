# Phase 1.1: Design System Tokens Implementation

## Context
You are implementing the semantic design token system for the Neon SEO Beacon frontend. This is the foundation for all UI consistency.

## Existing Code
- `assets/css/main.css` - Current Tailwind base styles
- `nuxt.config.ts` - Tailwind configuration
- `tailwind.config.js` - Theme customization (may not exist yet)

## Task
Create a production-grade design token system that will be referenced throughout the UI.

## Deliverables

### 1. Create `assets/css/tokens.css`
Define all semantic tokens:
- **Color tokens** for scores (excellent/good/poor)
- **Color tokens** for severity (critical/warning/info)
- **Typography scale** (xs through 2xl with line heights)
- **Spacing scale** (1-16 in 0.25rem increments)
- **Shadow system** (sm/md/lg/elevated for depth)
- **Transition timings** (fast/base/slow)
- **Border radius scale**
- **Z-index layers**

Example structure:
```css
:root {
  /* Score colors (semantic meaning) */
  --color-score-excellent: hsl(120, 100%, 40%);
  --color-score-good: hsl(48, 100%, 50%);
  --color-score-poor: hsl(0, 100%, 50%);
  
  /* Severity levels */
  --color-severity-critical: #dc2626;
  --color-severity-warning: #f59e0b;
  
  /* Typography */
  --text-xs: 0.75rem;
  --leading-xs: 1rem;
  
  /* Spacing (8px base) */
  --space-1: 0.25rem;
  --space-4: 1rem;
  
  /* Z-index */
  --z-dropdown: 40;
  --z-fixed: 50;
  --z-modal: 60;
}
```

### 2. Update `tailwind.config.js`
Extend Tailwind with custom tokens:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'score-excellent': 'var(--color-score-excellent)',
        'score-good': 'var(--color-score-good)',
        'score-poor': 'var(--color-score-poor)',
        'severity-critical': 'var(--color-severity-critical)',
      },
      spacing: {
        'token-1': 'var(--space-1)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'base': 'var(--transition-base)',
      }
    }
  }
}
```

### 3. Create `composables/useDesignTokens.ts`
TypeScript utilities for programmatic token access:
```typescript
// Export token getters for runtime access
export const useDesignTokens = () => ({
  getScoreColor: (score: number) => {...},
  getSeverityColor: (severity: string) => {...},
  spacing: (multiplier: number) => {...},
})
```

### 4. Update `assets/css/main.css`
Import tokens and apply globally:
```css
@import './tokens.css';

/* Component utilities using tokens */
.score-card-excellent {
  background: var(--color-score-excellent);
  transition: all var(--transition-base);
}
```

## Requirements

1. **All colors must be semantic** - not arbitrary hex values
2. **Tokens must be testable** - include console tests showing each token works
3. **Dark mode compatibility** - tokens adapt with prefers-color-scheme
4. **No magic numbers** - all values reference --space-x, --text-x variables
5. **Documentation** - include comments explaining design decisions

## Testing
After implementation:
1. Run `npm run build` and verify no Tailwind errors
2. Test token application: Create a test page using all token utilities
3. Verify dark mode: Check that color tokens adjust in dark mode
4. Performance check: Ensure CSS stays under 50KB

## Related Components
This enables: Phase 1.2 (Widget System), Phase 1.3 (Chart Components)

## Acceptance Criteria
- ✅ All token types defined (color, spacing, typography, shadow, transition)
- ✅ CSS file generates without errors
- ✅ Tailwind config extends properly
- ✅ TypeScript composable provides runtime access
- ✅ Dark mode variations work correctly
- ✅ No duplicate token definitions