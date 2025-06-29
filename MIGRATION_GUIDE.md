# Migration Guide: Vite to Nuxt 3

## Overview

This document outlines the migration from the original Vite + React setup to the new Nuxt 3 + @nuxt/content architecture.

## Key Changes

### Framework Migration

- **From**: Vite + React + TypeScript
- **To**: Nuxt 3 + Vue 3 + TypeScript

### Content Management

- **From**: Static content management
- **To**: @nuxt/content with Markdown-based CMS

### Styling

- **From**: Tailwind CSS (maintained)
- **To**: Tailwind CSS with Nuxt integration

### Authentication

- **From**: Custom Supabase integration
- **To**: @nuxtjs/supabase module

## File Structure Changes

### Old Structure

```
src/
├── components/
├── pages/
├── hooks/
├── integrations/
└── lib/
```

### New Structure

```
├── components/
├── pages/
├── composables/     # Replaces hooks/
├── content/         # New: Markdown content
├── server/          # New: Server-side code
├── stores/          # New: Pinia stores
└── utils/           # Replaces lib/
```

## Component Migration

### React to Vue 3 Composition API

**Before (React):**

```jsx
import { useState, useEffect } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Effect logic
  }, [count]);

  return <div>{count}</div>;
}
```

**After (Vue 3):**

```vue
<template>
  <div>{{ count }}</div>
</template>

<script setup>
const count = ref(0);

watch(count, () => {
  // Watcher logic
});
</script>
```

### Routing Changes

**Before (React Router):**

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>;
```

**After (Nuxt Pages):**

```
pages/
├── index.vue      # /
└── about.vue      # /about
```

## State Management

### From React Context to Pinia

**Before (React Context):**

```jsx
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**After (Pinia):**

```typescript
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);

  function setUser(newUser) {
    user.value = newUser;
  }

  return { user, setUser };
});
```

## Content Management Migration

### Static to Dynamic Content

**Before**: Static JSX files for content
**After**: Markdown files with frontmatter

```markdown
---
title: "SEO Guide"
description: "Complete SEO guide"
category: "Technical SEO"
tags: ["seo", "technical"]
---

# Content here...
```

## API Route Changes

### From Custom API to Nuxt Server

**Before**: Express.js or custom API server
**After**: Nuxt server routes

```typescript
// server/api/audits.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // Handle audit creation
  return { success: true };
});
```

## Environment Variables

### Updated Variable Names

| Old                      | New                 |
| ------------------------ | ------------------- |
| `VITE_SUPABASE_URL`      | `SUPABASE_URL`      |
| `VITE_SUPABASE_ANON_KEY` | `SUPABASE_ANON_KEY` |
| `VITE_API_URL`           | `API_URL`           |

## Build and Deployment

### Build Commands

**Before**:

```bash
npm run build    # Vite build
npm run preview  # Preview build
```

**After**:

```bash
npm run build     # Nuxt build
npm run preview   # Preview build
npm run generate  # Static generation
```

### Deployment Changes

1. **Static Generation**: Now possible with `nuxt generate`
2. **Server-Side Rendering**: Built-in with Nuxt
3. **Edge Deployment**: Optimized for Vercel/Netlify

## Benefits of Migration

### Performance

- **Faster Initial Load**: SSR/SSG capabilities
- **Better SEO**: Server-side rendering
- **Optimized Bundles**: Automatic code splitting

### Developer Experience

- **Hot Module Replacement**: Faster development
- **TypeScript Integration**: Better type safety
- **Auto-imports**: Reduced boilerplate

### Content Management

- **Markdown Support**: Easy content creation
- **Git-based**: Version controlled content
- **Search**: Built-in content search

### SEO Improvements

- **Meta Management**: Automatic meta tags
- **Sitemap Generation**: Dynamic sitemap
- **Structured Data**: Built-in schema support

## Migration Checklist

### Pre-Migration

- [ ] Audit existing components
- [ ] Document current API endpoints
- [ ] Backup existing content
- [ ] Plan content structure

### During Migration

- [ ] Set up Nuxt 3 project
- [ ] Migrate components to Vue 3
- [ ] Convert content to Markdown
- [ ] Set up new API routes
- [ ] Configure environment variables

### Post-Migration

- [ ] Test all functionality
- [ ] Verify SEO improvements
- [ ] Update deployment scripts
- [ ] Train team on new structure

## Common Issues and Solutions

### Issue: Component Not Rendering

**Solution**: Check for proper Vue 3 Composition API syntax

### Issue: API Routes Not Working

**Solution**: Ensure server routes are in correct directory structure

### Issue: Content Not Loading

**Solution**: Verify Markdown frontmatter format

### Issue: Build Errors

**Solution**: Check TypeScript types and imports

## Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Nuxt Content Documentation](https://content.nuxt.com/)
- [Migration Examples](./examples/)

## Support

For migration assistance:

- Check the [troubleshooting guide](./TROUBLESHOOTING.md)
- Review [code examples](./examples/)
- Contact the development team

---

_Migration completed: December 2024_
