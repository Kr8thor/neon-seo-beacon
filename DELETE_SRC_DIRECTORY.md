# React Artifacts Removal

The following React/Vite files need to be deleted to fix GitHub Actions:

## Files to Delete:
- `src/` (entire directory)
- `tsconfig.app.json`
- `tsconfig.node.json` 
- `vite.config.ts`
- `index.html` (Vite entry point)

## Reason:
These files are causing conflicts with the Nuxt 3 architecture and breaking all CI/CD pipelines.

The Nuxt 3 structure (pages/, components/, app.vue, nuxt.config.ts) is correct and should be preserved.
