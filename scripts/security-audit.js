#!/usr/bin/env node

/**
 * Security Testing Suite for Neon SEO Beacon
 * Tests all security implementations and configurations
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";

class SecurityAuditor {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
  }

  async runAllTests() {
    console.log("🛡️  Starting Security Audit for Neon SEO Beacon\n");

    const checks = [
      {
        name: "Environment Variables",
        description: "Check for secure environment configuration",
        check: () => this.checkEnvironmentSecurity(),
        severity: "HIGH",
      },
      {
        name: "Secure Logging",
        description: "Verify no sensitive data logging in production",
        check: () => this.checkSecureLogging(),
        severity: "HIGH",
      },
      {
        name: "Rate Limiting",
        description: "Verify rate limiting implementation",
        check: () => this.checkRateLimiting(),
        severity: "HIGH",
      },
      {
        name: "CSRF Protection",
        description: "Check CSRF token implementation",
        check: () => this.checkCSRFProtection(),
        severity: "MEDIUM",
      },
      {
        name: "Input Validation",
        description: "Verify input sanitization and validation",
        check: () => this.checkInputValidation(),
        severity: "HIGH",
      },
      {
        name: "Security Headers",
        description: "Check security headers configuration",
        check: () => this.checkSecurityHeaders(),
        severity: "MEDIUM",
      },
    ];

    for (const check of checks) {
      await this.runSecurityCheck(check);
    }

    this.printSummary();
  }

  async runSecurityCheck(check) {
    try {
      console.log(`📋 Testing: ${check.name}`);
      console.log(`   ${check.description}`);

      const result = check.check();

      if (result) {
        console.log(`   ✅ PASS\n`);
        this.passed++;
      } else {
        const icon = check.severity === "HIGH" ? "❌" : "⚠️";
        console.log(`   ${icon} FAIL (${check.severity})\n`);

        if (check.severity === "HIGH") {
          this.failed++;
        } else {
          this.warnings++;
        }
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}\n`);
      this.failed++;
    }
  }

  checkEnvironmentSecurity() {
    // Check for production env file
    if (!existsSync(".env.production")) {
      console.log("   ⚠️  No production environment file found");
      return false;
    }

    // Check for weak secrets in .env if it exists
    if (existsSync(".env")) {
      const envContent = readFileSync(".env", "utf8");

      const weakPatterns = [
        "your_secret_here",
        "changeme",
        "default",
        "test123",
        "password",
      ];

      for (const pattern of weakPatterns) {
        if (envContent.includes(pattern)) {
          console.log(`   ⚠️  Weak secret detected: ${pattern}`);
          return false;
        }
      }
    }

    return true;
  }

  checkSecureLogging() {
    const filesToCheck = [
      "server/utils/auth.ts",
      "server/api/audits/public.post.ts",
      "server/utils/rateLimit.ts",
    ];

    let hasSecureLogging = true;

    for (const file of filesToCheck) {
      if (existsSync(file)) {
        const content = readFileSync(file, "utf8");

        // Check for direct console statements (logger.ts is allowed to use console)
        if (
          content.includes("console.log") ||
          content.includes("console.error")
        ) {
          // Allow if using logger properly
          if (
            !content.includes("import { logger }") &&
            !content.includes("logger.")
          ) {
            console.log(`   ⚠️  Found console statements in ${file}`);
            hasSecureLogging = false;
          }
        }
      }
    }

    // Check that logger.ts exists
    if (!existsSync("server/utils/logger.ts")) {
      console.log("   ⚠️  Secure logger utility not found");
      return false;
    }

    return hasSecureLogging;
  }

  checkRateLimiting() {
    const rateLimitFile = "server/utils/secureRateLimit.ts";

    if (!existsSync(rateLimitFile)) {
      console.log("   ⚠️  Rate limiting utility not found");
      return false;
    }

    const content = readFileSync(rateLimitFile, "utf8");

    // Check for proper fail-closed behavior
    if (content.includes("allowed: false") && content.includes("catch")) {
      return true;
    }

    console.log("   ⚠️  Rate limiting may not fail closed properly");
    return false;
  }

  checkCSRFProtection() {
    const securityFile = "server/utils/security.ts";

    if (!existsSync(securityFile)) {
      console.log("   ⚠️  CSRF protection utility not found");
      return false;
    }

    const content = readFileSync(securityFile, "utf8");

    const requiredFeatures = [
      "generateCSRFToken",
      "validateCSRFToken",
      "timingSafeEqual",
    ];

    for (const feature of requiredFeatures) {
      if (!content.includes(feature)) {
        console.log(`   ⚠️  Missing CSRF feature: ${feature}`);
        return false;
      }
    }

    return true;
  }

  checkInputValidation() {
    const publicAPIFile = "server/api/audits/public.post.ts";

    if (!existsSync(publicAPIFile)) {
      console.log("   ⚠️  Public API file not found");
      return false;
    }

    const content = readFileSync(publicAPIFile, "utf8");

    const requiredValidations = [
      "sanitizeUrl",
      "isValidUrl",
      "isPrivateIP",
      "MAX_REQUEST_SIZE",
    ];

    for (const validation of requiredValidations) {
      if (!content.includes(validation)) {
        console.log(`   ⚠️  Missing validation: ${validation}`);
        return false;
      }
    }

    return true;
  }

  checkSecurityHeaders() {
    const middlewareFile = "server/middleware/security.ts";

    if (!existsSync(middlewareFile)) {
      console.log("   ⚠️  Security middleware not found");
      return false;
    }

    const content = readFileSync(middlewareFile, "utf8");

    const requiredHeaders = [
      "X-Content-Type-Options",
      "X-Frame-Options",
      "X-XSS-Protection",
      "Content-Security-Policy",
    ];

    for (const header of requiredHeaders) {
      if (!content.includes(header)) {
        console.log(`   ⚠️  Missing security header: ${header}`);
        return false;
      }
    }

    return true;
  }

  printSummary() {
    console.log("🛡️  Security Audit Summary");
    console.log("=".repeat(50));
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`⚠️  Warnings: ${this.warnings}`);
    console.log("");

    if (this.failed === 0) {
      console.log("🎉 All critical security checks passed!");
      console.log("Your application is ready for production deployment.");
    } else {
      console.log("🚨 Critical security issues found!");
      console.log("Please fix all HIGH severity issues before deploying.");
    }

    if (this.warnings > 0) {
      console.log(
        `⚠️  ${this.warnings} warnings should be addressed for optimal security.`,
      );
    }
  }
}

// Run the security audit
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new SecurityAuditor();
  auditor.runAllTests().catch(console.error);
}

export default SecurityAuditor;
