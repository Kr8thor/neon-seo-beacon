#!/usr/bin/env node

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

class Phase3TestRunner {
  constructor() {
    this.results = {
      setup: null,
      unit: null,
      integration: null,
      integrationLive: null,
      e2e: null,
      visual: null,
      accessibility: null,
      performance: null,
      crossBrowser: null,
    };
    this.startTime = Date.now();
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: "📊",
      success: "✅",
      error: "❌",
      warning: "⚠️",
    }[type];

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async executeTest(testName, command, timeout = 60000) {
    this.log(`Running ${testName}...`);

    try {
      const output = execSync(command, {
        encoding: "utf8",
        timeout,
        cwd: process.cwd(),
      });

      this.results[testName] = {
        status: "passed",
        output: output.substring(0, 500),
        executionTime: Date.now() - this.startTime,
      };

      this.log(`${testName} completed successfully`, "success");
      return true;
    } catch (error) {
      this.results[testName] = {
        status: "failed",
        error: error.message.substring(0, 500),
        executionTime: Date.now() - this.startTime,
      };

      this.log(`${testName} failed: ${error.message}`, "error");
      return false;
    }
  }

  async checkPrerequisites() {
    this.log("Checking prerequisites...");

    // Check if development server is running
    try {
      const response = await fetch("http://localhost:3000/api/health");
      if (response.ok) {
        this.log("Development server is running", "success");
        return true;
      }
    } catch (error) {
      this.log(
        "Development server not running. Please start with: npm run dev",
        "warning",
      );
      return false;
    }

    // Check if Playwright is installed
    try {
      execSync("npx playwright --version", { encoding: "utf8" });
      this.log("Playwright is installed", "success");
    } catch (error) {
      this.log("Playwright not properly installed", "error");
      return false;
    }

    return true;
  }

  async runPhase3Tests() {
    this.log("🚀 Starting Phase 3 Test Suite...");

    // Setup verification
    const setupOk = await this.checkPrerequisites();
    this.results.setup = setupOk ? { status: "passed" } : { status: "failed" };

    if (!setupOk) {
      this.log("Prerequisites check failed. Aborting.", "error");
      return;
    }

    // Run tests in sequence
    const tests = [
      { name: "unit", command: "npm run test:unit" },
      { name: "integration", command: "npm run test:integration" },
      { name: "integrationLive", command: "npm run test:integration:live" },
      { name: "e2e", command: "npm run test:e2e:user-flows" },
      { name: "visual", command: "npm run test:e2e:visual" },
      { name: "accessibility", command: "npm run test:accessibility" },
      { name: "performance", command: "npm run test:performance:load" },
      { name: "crossBrowser", command: "npm run test:e2e:cross-browser" },
    ];

    for (const test of tests) {
      await this.executeTest(test.name, test.command);
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    this.generateReport();
  }

  generateReport() {
    const endTime = Date.now();
    const totalTime = Math.round((endTime - this.startTime) / 1000);

    const report = {
      timestamp: new Date().toISOString(),
      environment: "Phase 3 Testing",
      totalExecutionTime: `${totalTime}s`,
      results: this.results,
      summary: {
        total: Object.keys(this.results).length,
        passed: Object.values(this.results).filter(
          (r) => r?.status === "passed",
        ).length,
        failed: Object.values(this.results).filter(
          (r) => r?.status === "failed",
        ).length,
      },
    };

    // Save report
    const reportPath = path.join(
      process.cwd(),
      "test-results",
      "phase3-report.json",
    );
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Display summary
    this.log("🎉 PHASE 3 TEST SUITE COMPLETE!");
    this.log(`📊 Total Tests: ${report.summary.total}`);
    this.log(`✅ Passed: ${report.summary.passed}`, "success");
    this.log(
      `❌ Failed: ${report.summary.failed}`,
      report.summary.failed > 0 ? "error" : "success",
    );
    this.log(`⏱️ Total Time: ${totalTime}s`);
    this.log(`📄 Report saved to: ${reportPath}`);

    if (report.summary.failed === 0) {
      this.log("🚀 ALL TESTS PASSED - PHASE 3 COMPLETE!", "success");
    } else {
      this.log(
        "⚠️ Some tests failed. Check the report for details.",
        "warning",
      );
    }
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new Phase3TestRunner();
  runner.runPhase3Tests().catch(console.error);
}

module.exports = Phase3TestRunner;
