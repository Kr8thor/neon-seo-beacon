// tests/utils/visual-regression.ts
import { Page } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import fs from "fs";

export class VisualRegressionTester {
  private baselineDir = "tests/visual-baselines";
  private resultsDir = "test-results/visual-diffs";

  async captureBaseline(page: Page, name: string) {
    const screenshotPath = `${this.baselineDir}/${name}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Baseline captured: ${screenshotPath}`);
  }

  async compareWithBaseline(page: Page, name: string, threshold = 0.1) {
    const baselinePath = `${this.baselineDir}/${name}.png`;
    const currentPath = `${this.resultsDir}/${name}-current.png`;
    const diffPath = `${this.resultsDir}/${name}-diff.png`;

    // Ensure directories exist
    fs.mkdirSync(this.resultsDir, { recursive: true });

    // Take current screenshot
    await page.screenshot({ path: currentPath, fullPage: true });

    // Compare if baseline exists
    if (!fs.existsSync(baselinePath)) {
      console.warn(`No baseline found for ${name}, creating one`);
      await this.captureBaseline(page, name);
      return { match: true, diff: 0 };
    }

    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));
    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      { threshold },
    );

    const totalPixels = width * height;
    const diffPercentage = numDiffPixels / totalPixels;

    // Save diff image if there are differences
    if (numDiffPixels > 0) {
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
    }

    return {
      match: diffPercentage <= threshold,
      diff: diffPercentage,
      numDiffPixels,
      totalPixels,
    };
  }
}
