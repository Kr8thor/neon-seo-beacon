import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/unit/**/*.test.ts",
      // Exclude live integration tests for CI - they require running server
    ],
    exclude: [
      "tests/e2e/**/*",
      "tests/performance/**/*",
      "tests/visual-baselines/**/*",
      "tests/integration/api/**/*.test.ts", // Exclude all @nuxt/test-utils dependent tests
      "node_modules/**/*",
    ],
    css: {
      // Mock CSS imports for testing
      include: [],
    },
    transformMode: {
      web: [/\.[jt]sx?$/, /\.vue$/],
    },
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/e2e/",
        "tests/performance/",
        "tests/visual-baselines/",
        ".nuxt/",
        "coverage/",
        "**/*.d.ts",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "~": resolve(__dirname, "."),
    },
  },
});
