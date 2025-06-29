# Neon SEO Beacon - Automated Testing Implementation Plan

**Project**: Neon SEO Beacon - Enterprise SEO Audit Platform  
**Testing Strategy**: Comprehensive automated testing before manual QA  
**Estimated Time**: 6-8 hours implementation  
**Coverage Target**: >90% code coverage  
**Framework**: Vitest + Playwright + Custom SEO Testing

---

## 🎯 **Testing Strategy Overview**

### **Testing Pyramid Implementation**

```
     🔺 E2E Tests (Playwright)
       - User workflows
       - Cross-browser testing
       - SEO audit flows

    🔸 Integration Tests (Vitest + API)
      - API endpoint testing
      - Database operations
      - Supabase integration
      - Real-time SSE testing

  🔹 Unit Tests (Vitest + Vue Test Utils)
    - Component testing
    - Utility functions
    - State management
    - SEO analysis logic
```

### **Testing Categories**

1. **🧪 Unit Tests** - Individual components and functions
2. **🔗 Integration Tests** - API endpoints and database operations
3. **🌐 End-to-End Tests** - Complete user workflows
4. **⚡ Performance Tests** - Load times and Core Web Vitals
5. **♿ Accessibility Tests** - WCAG compliance
6. **🔍 SEO Tests** - SEO analysis algorithm accuracy
7. **👁️ Visual Regression Tests** - UI consistency

---

## 📋 **Phase 1: Testing Infrastructure Setup (1 hour)**

### **1.1 Install Additional Testing Dependencies**

```bash
# Navigate to project
cd C:\Users\Leo\neon-seo-beacon

# Install testing dependencies
npm install -D @testing-library/vue @testing-library/jest-dom @testing-library/user-event
npm install -D axe-core @axe-core/playwright lighthouse
npm install -D msw @mswjs/data
npm install -D start-server-and-test cross-env
npm install -D @percy/cli @percy/playwright
```

### **1.2 Configure Vitest for Component Testing**

**File**: `vitest.config.ts` (create new file)

```typescript
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "coverage/**",
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
      "~": resolve(__dirname, "."),
      "@": resolve(__dirname, "."),
    },
  },
});
```

### **1.3 Configure Playwright for E2E Testing**

**File**: `playwright.config.ts` (update existing)

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### **1.4 Setup Test Configuration**

**File**: `tests/setup.ts` (create new file)

```typescript
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Nuxt composables
vi.mock("#app", () => ({
  useHead: vi.fn(),
  useRuntimeConfig: vi.fn(() => ({
    public: {
      supabaseUrl: "https://test.supabase.co",
      supabaseAnonKey: "test-key",
    },
  })),
  navigateTo: vi.fn(),
  createError: vi.fn(),
}));

// Mock Supabase
vi.mock("@nuxtjs/supabase", () => ({
  serverSupabaseServiceRole: vi.fn(),
  serverSupabaseUser: vi.fn(),
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
```

---

## 📋 **Phase 2: Unit Testing Implementation (2 hours)**

### **2.1 Component Testing Framework**

**File**: `tests/unit/components/LoadingSpinner.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LoadingSpinner from "~/components/ui/LoadingSpinner.vue";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    const wrapper = mount(LoadingSpinner);

    expect(wrapper.find(".h-6.w-6")).toBeTruthy();
    expect(wrapper.find(".border-t-blue-600")).toBeTruthy();
  });

  it("renders different sizes correctly", () => {
    const wrapperSm = mount(LoadingSpinner, { props: { size: "sm" } });
    const wrapperLg = mount(LoadingSpinner, { props: { size: "lg" } });

    expect(wrapperSm.find(".h-4.w-4")).toBeTruthy();
    expect(wrapperLg.find(".h-8.w-8")).toBeTruthy();
  });

  it("displays text when provided", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { text: "Loading..." },
    });

    expect(wrapper.text()).toContain("Loading...");
  });

  it("applies correct variant styles", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { variant: "default" },
    });

    expect(wrapper.find(".border-t-gray-600")).toBeTruthy();
  });
});
```

### **2.2 SEO Analysis Logic Testing**

**File**: `tests/unit/utils/seo-analyzer.test.ts`

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import {
  analyzeTitleTag,
  analyzeMetaDescription,
  calculateSEOScore,
} from "~/server/utils/seo-analyzer";

describe("SEO Analyzer", () => {
  describe("analyzeTitleTag", () => {
    it("gives perfect score for optimal title length", () => {
      const result = analyzeTitleTag("Perfect Length SEO Title Here");

      expect(result.score).toBe(15);
      expect(result.length).toBe(33);
      expect(result.issues).toHaveLength(0);
    });

    it("penalizes titles that are too short", () => {
      const result = analyzeTitleTag("Short");

      expect(result.score).toBeLessThan(15);
      expect(result.issues).toContain("Title too short");
    });

    it("penalizes titles that are too long", () => {
      const longTitle =
        "This is a very long title that exceeds the recommended length for SEO optimization and user experience";
      const result = analyzeTitleTag(longTitle);

      expect(result.score).toBeLessThan(15);
      expect(result.issues).toContain("Title too long");
    });

    it("handles missing titles correctly", () => {
      const result = analyzeTitleTag("");

      expect(result.score).toBe(0);
      expect(result.issues).toContain("Missing title tag");
    });
  });

  describe("analyzeMetaDescription", () => {
    it("gives perfect score for optimal description", () => {
      const goodDescription =
        "This is a well-crafted meta description that provides clear information about the page content and is within the optimal length range for search engines.";
      const result = analyzeMetaDescription(goodDescription);

      expect(result.score).toBe(15);
      expect(result.issues).toHaveLength(0);
    });

    it("handles duplicate descriptions", () => {
      const description = "Some description";
      const result = analyzeMetaDescription(description, ["Some description"]);

      expect(result.issues).toContain("Duplicate meta description");
    });
  });

  describe("calculateSEOScore", () => {
    it("calculates total score correctly", () => {
      const analysisResults = {
        title: { score: 15, issues: [] },
        meta: { score: 12, issues: [] },
        headers: { score: 8, issues: [] },
        images: { score: 9, issues: [] },
        technical: { score: 20, issues: [] },
        performance: { score: 13, issues: [] },
      };

      const totalScore = calculateSEOScore(analysisResults);
      expect(totalScore).toBe(77);
    });

    it("handles missing analysis sections", () => {
      const partialResults = {
        title: { score: 15, issues: [] },
        meta: { score: 12, issues: [] },
      };

      const totalScore = calculateSEOScore(partialResults);
      expect(totalScore).toBeGreaterThan(0);
      expect(totalScore).toBeLessThan(100);
    });
  });
});
```

### **2.3 Utility Functions Testing**

**File**: `tests/unit/utils/helpers.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { formatDate, slugify, isValidUrl, sanitizeHtml } from "~/utils/helpers";

describe("Helper Functions", () => {
  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2025-06-27");
      const formatted = formatDate(date);

      expect(formatted).toMatch(/June 27, 2025/);
    });

    it("handles invalid dates", () => {
      const result = formatDate(null);
      expect(result).toBe("Invalid Date");
    });
  });

  describe("slugify", () => {
    it("converts text to URL-friendly slug", () => {
      expect(slugify("Hello World!")).toBe("hello-world");
      expect(slugify("SEO & Marketing Tips")).toBe("seo-marketing-tips");
      expect(slugify("  Spaced   Text  ")).toBe("spaced-text");
    });

    it("handles special characters", () => {
      expect(slugify("café & résumé")).toBe("cafe-resume");
      expect(slugify("100% Success Rate")).toBe("100-success-rate");
    });
  });

  describe("isValidUrl", () => {
    it("validates correct URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://localhost:3000")).toBe(true);
      expect(isValidUrl("https://sub.domain.com/path")).toBe(true);
    });

    it("rejects invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("ftp://example.com")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });
  });

  describe("sanitizeHtml", () => {
    it("removes dangerous scripts", () => {
      const dangerous = '<script>alert("xss")</script><p>Safe content</p>';
      const result = sanitizeHtml(dangerous);

      expect(result).not.toContain("<script>");
      expect(result).toContain("Safe content");
    });

    it("preserves safe HTML", () => {
      const safe = "<p>This is <strong>bold</strong> text</p>";
      const result = sanitizeHtml(safe);

      expect(result).toBe(safe);
    });
  });
});
```

---

## 📋 **Phase 3: Integration Testing (2 hours)**

### **3.1 API Endpoint Testing**

**File**: `tests/integration/api/health.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";

describe("Health API", () => {
  beforeAll(async () => {
    await setup({
      rootDir: process.cwd(),
    });
  });

  it("returns healthy status", async () => {
    const response = await $fetch("/api/health");

    expect(response.status).toBe("healthy");
    expect(response.timestamp).toBeDefined();
    expect(response.version).toBeDefined();
    expect(response.database).toBe("healthy");
  });

  it("includes proper headers", async () => {
    const response = await fetch("http://localhost:3001/api/health");

    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.status).toBe(200);
  });
});
```

### **3.2 SEO Analysis API Testing**

**File**: `tests/integration/api/seo-analyze.test.ts`

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";

describe("SEO Analysis API", () => {
  beforeAll(async () => {
    await setup({
      rootDir: process.cwd(),
    });
  });

  it("analyzes a valid URL successfully", async () => {
    const response = await $fetch("/api/seo/analyze", {
      method: "POST",
      body: {
        url: "https://example.com",
        options: {
          includeImages: true,
          checkMobile: true,
          includePerformance: true,
        },
      },
    });

    expect(response.success).toBe(true);
    expect(response.data.url).toBe("https://example.com");
    expect(response.data.score).toBeGreaterThanOrEqual(0);
    expect(response.data.score).toBeLessThanOrEqual(100);
    expect(response.data.processingTime).toBeGreaterThan(0);
  });

  it("rejects invalid URLs", async () => {
    try {
      await $fetch("/api/seo/analyze", {
        method: "POST",
        body: { url: "not-a-valid-url" },
      });
    } catch (error) {
      expect(error.statusCode).toBe(400);
      expect(error.statusMessage).toContain("Valid URL is required");
    }
  });

  it("handles network errors gracefully", async () => {
    try {
      await $fetch("/api/seo/analyze", {
        method: "POST",
        body: { url: "https://nonexistent-domain-12345.com" },
      });
    } catch (error) {
      expect(error.statusCode).toBe(500);
    }
  });

  it("returns comprehensive analysis results", async () => {
    const response = await $fetch("/api/seo/analyze", {
      method: "POST",
      body: { url: "https://example.com" },
    });

    expect(response.data.analysis).toBeDefined();
    expect(response.data.analysis.title).toBeDefined();
    expect(response.data.analysis.meta).toBeDefined();
    expect(response.data.analysis.headers).toBeDefined();
    expect(response.data.analysis.images).toBeDefined();
    expect(response.data.analysis.technical).toBeDefined();
  });
});
```

---

## 📋 **Phase 4: End-to-End Testing (2 hours)**

### **4.1 User Authentication Flow**

**File**: `tests/e2e/auth/authentication.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("User Authentication", () => {
  test("user can register successfully", async ({ page }) => {
    await page.goto("/");

    // Navigate to registration
    await page.click("text=Sign Up");

    // Fill registration form
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "testpassword123");
    await page.fill(
      '[data-testid="confirm-password-input"]',
      "testpassword123",
    );

    // Submit form
    await page.click('[data-testid="register-button"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("text=Welcome")).toBeVisible();
  });

  test("user can login with existing credentials", async ({ page }) => {
    await page.goto("/auth/login");

    // Fill login form
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "testpassword123");

    // Submit form
    await page.click('[data-testid="login-button"]');

    // Verify successful login
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test("displays error for invalid credentials", async ({ page }) => {
    await page.goto("/auth/login");

    // Fill with invalid credentials
    await page.fill('[data-testid="email-input"]', "invalid@example.com");
    await page.fill('[data-testid="password-input"]', "wrongpassword");

    // Submit form
    await page.click('[data-testid="login-button"]');

    // Verify error message
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });

  test("protected routes redirect to login", async ({ page }) => {
    await page.goto("/dashboard");

    // Should redirect to login
    await expect(page).toHaveURL("/auth/login");
  });

  test("user can logout successfully", async ({ page, context }) => {
    // Login first
    await page.goto("/auth/login");
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "testpassword123");
    await page.click('[data-testid="login-button"]');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click("text=Logout");

    // Verify redirect to home
    await expect(page).toHaveURL("/");

    // Verify session is cleared
    const cookies = await context.cookies();
    const authCookie = cookies.find((c) => c.name.includes("auth"));
    expect(authCookie).toBeUndefined();
  });
});
```

### **4.2 SEO Audit Workflow**

**File**: `tests/e2e/audit/audit-workflow.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("SEO Audit Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/auth/login");
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "testpassword123");
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("user can create new audit", async ({ page }) => {
    // Start audit creation
    await page.click('[data-testid="create-audit-button"]');

    // Fill audit form
    await page.fill('[data-testid="url-input"]', "https://example.com");
    await page.selectOption('[data-testid="audit-type-select"]', "standard");

    // Submit audit
    await page.click('[data-testid="start-audit-button"]');

    // Verify redirect to audit page
    await expect(page.url()).toMatch(/\/audits\/[a-f0-9-]+/);

    // Verify audit started
    await expect(page.locator("text=Analysis Progress")).toBeVisible();
  });

  test("displays real-time progress during audit", async ({ page }) => {
    // Create audit
    await page.click('[data-testid="create-audit-button"]');
    await page.fill('[data-testid="url-input"]', "https://example.com");
    await page.click('[data-testid="start-audit-button"]');

    // Wait for progress elements
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="progress-message"]'),
    ).toBeVisible();

    // Verify progress updates
    const progressText = page.locator('[data-testid="progress-message"]');
    await expect(progressText).not.toHaveText("", { timeout: 10000 });
  });

  test("displays audit results after completion", async ({ page }) => {
    // Navigate to completed audit
    await page.goto("/audits/completed-audit-id");

    // Verify results section
    await expect(page.locator('[data-testid="seo-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-breakdown"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="technical-results"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="content-results"]')).toBeVisible();

    // Verify score is valid
    const scoreElement = page.locator('[data-testid="seo-score"]');
    const score = await scoreElement.textContent();
    expect(Number(score)).toBeGreaterThanOrEqual(0);
    expect(Number(score)).toBeLessThanOrEqual(100);
  });

  test("user can view audit history", async ({ page }) => {
    await page.goto("/dashboard");

    // Verify audit history section
    await expect(page.locator('[data-testid="audit-history"]')).toBeVisible();

    // Check for audit items
    const auditItems = page.locator('[data-testid="audit-item"]');
    await expect(auditItems.first()).toBeVisible();

    // Click on audit item
    await auditItems.first().click();

    // Verify navigation to audit detail
    await expect(page.url()).toMatch(/\/audits\/[a-f0-9-]+/);
  });

  test("handles audit errors gracefully", async ({ page }) => {
    // Create audit with invalid URL
    await page.click('[data-testid="create-audit-button"]');
    await page.fill(
      '[data-testid="url-input"]',
      "https://invalid-domain-123456.com",
    );
    await page.click('[data-testid="start-audit-button"]');

    // Wait for error state
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({
      timeout: 30000,
    });

    // Verify error handling
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toContainText("Unable to analyze");

    // Verify retry option
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });
});
```

---

## 📋 **Phase 5: Performance & Accessibility Testing (1 hour)**

### **5.1 Performance Testing with Lighthouse**

**File**: `tests/performance/lighthouse.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";

test.describe("Performance Testing", () => {
  test("homepage meets performance standards", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Lighthouse only works with Chromium",
    );

    await page.goto("/");

    const audit = await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 95,
        "best-practices": 90,
        seo: 95,
        pwa: 50,
      },
      reports: {
        formats: {
          html: true,
          json: true,
        },
        directory: "./test-results/lighthouse",
      },
    });

    expect(audit.lhr.categories.performance.score * 100).toBeGreaterThanOrEqual(
      90,
    );
    expect(
      audit.lhr.categories.accessibility.score * 100,
    ).toBeGreaterThanOrEqual(95);
    expect(audit.lhr.categories.seo.score * 100).toBeGreaterThanOrEqual(95);
  });

  test("dashboard loads within performance budget", async ({ page }) => {
    // Login first
    await page.goto("/auth/login");
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "testpassword123");
    await page.click('[data-testid="login-button"]');

    // Measure dashboard load time
    const startTime = Date.now();
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("audit creation API responds quickly", async ({ page }) => {
    const startTime = Date.now();

    const response = await page.request.post("/api/seo/analyze", {
      data: {
        url: "https://example.com",
      },
    });

    const responseTime = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(5000); // 5 second timeout
  });
});
```

### **5.2 Accessibility Testing**

**File**: `tests/accessibility/a11y.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Testing", () => {
  test("homepage is accessible", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("dashboard is accessible", async ({ page }) => {
    // Login first
    await page.goto("/auth/login");
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "testpassword123");
    await page.click('[data-testid="login-button"]');

    await page.goto("/dashboard");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("forms have proper labels and error handling", async ({ page }) => {
    await page.goto("/auth/login");

    // Check form labels
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();

    // Test error states
    await page.click('[data-testid="login-button"]');

    // Should show validation errors
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test("keyboard navigation works correctly", async ({ page }) => {
    await page.goto("/");

    // Tab through navigation
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();

    // Should be able to activate focused elements
    await page.keyboard.press("Enter");

    // Verify navigation occurred
    await expect(page.url()).not.toBe("/");
  });

  test("screen reader compatibility", async ({ page }) => {
    await page.goto("/dashboard");

    // Check for proper heading hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Check for proper ARIA labels
    const buttons = page.locator("button");
    for (const button of await buttons.all()) {
      const ariaLabel = await button.getAttribute("aria-label");
      const text = await button.textContent();

      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test("color contrast meets WCAG standards", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .include(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

## 📋 **Phase 6: Test Automation & CI Integration (30 minutes)**

### **6.1 Package.json Scripts Update**

**File**: `package.json` (update scripts section)

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --coverage",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:performance": "playwright test tests/performance",
    "test:a11y": "playwright test tests/accessibility",
    "test:visual": "playwright test tests/visual",
    "test:all": "npm run test:unit && npm run test:e2e && npm run test:a11y",
    "test:ci": "npm run test:unit && npm run test:e2e -- --reporter=junit",
    "test:coverage": "vitest run --coverage && open coverage/index.html",
    "test:watch": "vitest",
    "test:debug": "vitest --inspect-brk --no-coverage"
  }
}
```

### **6.2 GitHub Actions Workflow**

**File**: `.github/workflows/test.yml` (create new file)

```yaml
name: Automated Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run accessibility tests
        run: npm run test:a11y
```

### **6.3 Test Reporting Configuration**

**File**: `tests/test-utils.ts` (create new file)

```typescript
import { vi } from "vitest";
import type { MockedFunction } from "vitest";

// Custom test utilities
export const createMockUser = () => ({
  id: "test-user-id",
  email: "test@example.com",
  created_at: new Date().toISOString(),
});

export const createMockAudit = () => ({
  id: "test-audit-id",
  url: "https://example.com",
  status: "completed",
  score: 85,
  results: {
    title: { score: 15, issues: [] },
    meta: { score: 12, issues: [] },
    headers: { score: 8, issues: [] },
    images: { score: 9, issues: [] },
    technical: { score: 20, issues: [] },
    performance: { score: 13, issues: [] },
  },
  created_at: new Date().toISOString(),
});

export const mockSupabaseClient = () => ({
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() =>
          Promise.resolve({ data: createMockAudit(), error: null }),
        ),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() =>
          Promise.resolve({ data: createMockAudit(), error: null }),
        ),
      })),
    })),
  })),
});

// Test data generators
export const generateRandomUrl = () =>
  `https://example-${Math.random().toString(36).substr(2, 9)}.com`;

export const generateSEOTestResults = (overrides = {}) => ({
  score: 85,
  analysis: {
    title: { score: 15, issues: [] },
    meta: { score: 12, issues: [] },
    headers: { score: 8, issues: [] },
    images: { score: 9, issues: [] },
    technical: { score: 20, issues: [] },
    performance: { score: 13, issues: [] },
  },
  processingTime: 1250,
  ...overrides,
});
```

---

## 📋 **Implementation Checklist**

### **Setup Phase**

- [ ] Install all testing dependencies
- [ ] Configure Vitest for unit testing
- [ ] Configure Playwright for E2E testing
- [ ] Set up test databases and mocks
- [ ] Create test utilities and helpers

### **Unit Testing**

- [ ] Test all Vue components
- [ ] Test SEO analysis algorithms
- [ ] Test utility functions
- [ ] Test composables and stores
- [ ] Achieve >90% code coverage

### **Integration Testing**

- [ ] Test all API endpoints
- [ ] Test database operations
- [ ] Test authentication flows
- [ ] Test real-time SSE connections
- [ ] Test error handling

### **End-to-End Testing**

- [ ] Test complete user workflows
- [ ] Test cross-browser compatibility
- [ ] Test mobile responsiveness
- [ ] Test error scenarios
- [ ] Test performance under load

### **Quality Assurance**

- [ ] Run accessibility audits
- [ ] Run performance tests
- [ ] Run visual regression tests
- [ ] Generate test reports
- [ ] Set up CI/CD pipeline

### **Documentation**

- [ ] Document test procedures
- [ ] Create test data management guide
- [ ] Document CI/CD setup
- [ ] Create troubleshooting guide

---

## 🎯 **Success Metrics**

### **Coverage Targets**

- **Unit Test Coverage**: >90%
- **API Test Coverage**: 100%
- **E2E Test Coverage**: All critical paths
- **Performance Tests**: All key pages < 3s load time
- **Accessibility**: WCAG 2.1 AA compliance

### **Quality Gates**

- **Zero Critical Bugs**: No P0/P1 issues in production
- **Performance**: Lighthouse scores >90
- **Accessibility**: No accessibility violations
- **Cross-Browser**: Works on Chrome, Firefox, Safari, Edge
- **Mobile**: Full functionality on mobile devices

### **Test Execution Times**

- **Unit Tests**: <30 seconds
- **Integration Tests**: <2 minutes
- **E2E Tests**: <10 minutes
- **Full Test Suite**: <15 minutes

---

## 🚀 **Final Implementation Command**

```bash
# Run complete test suite
npm run test:all

# Generate comprehensive test report
npm run test:coverage

# Run performance audit
npm run test:performance

# Run accessibility audit
npm run test:a11y

# Run visual regression tests
npm run test:visual
```

---

**This comprehensive testing plan ensures your Neon SEO Beacon is production-ready with enterprise-grade quality assurance. Follow this plan systematically to achieve 100% confidence in your platform before manual testing begins!** 🧪✅
