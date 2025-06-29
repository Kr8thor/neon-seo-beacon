// tests/unit/components/Dashboard.test.ts
import { describe, it, expect, vi } from "vitest";

// Mock dashboard component logic
const createDashboardLogic = () => {
  const stats = {
    totalAudits: 0,
    averageScore: 0,
    sitesAnalyzed: 0,
    improvementSuggestions: 0,
  };

  const updateStats = (newStats: any) => {
    Object.assign(stats, newStats);
  };

  const calculateAverageScore = (scores: number[]) => {
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const formatStatValue = (value: number) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + "k";
    }
    return value.toString();
  };

  return {
    stats,
    updateStats,
    calculateAverageScore,
    formatStatValue,
  };
};

describe("Dashboard Component Logic", () => {
  it("should initialize with default stats", () => {
    const dashboard = createDashboardLogic();

    expect(dashboard.stats.totalAudits).toBe(0);
    expect(dashboard.stats.averageScore).toBe(0);
    expect(dashboard.stats.sitesAnalyzed).toBe(0);
    expect(dashboard.stats.improvementSuggestions).toBe(0);
  });

  it("should update stats correctly", () => {
    const dashboard = createDashboardLogic();

    dashboard.updateStats({
      totalAudits: 25,
      averageScore: 78,
      sitesAnalyzed: 12,
      improvementSuggestions: 45,
    });

    expect(dashboard.stats.totalAudits).toBe(25);
    expect(dashboard.stats.averageScore).toBe(78);
    expect(dashboard.stats.sitesAnalyzed).toBe(12);
    expect(dashboard.stats.improvementSuggestions).toBe(45);
  });

  it("should calculate average score correctly", () => {
    const dashboard = createDashboardLogic();

    expect(dashboard.calculateAverageScore([80, 90, 70])).toBe(80);
    expect(dashboard.calculateAverageScore([100, 90, 80, 70])).toBe(85);
    expect(dashboard.calculateAverageScore([])).toBe(0);
    expect(dashboard.calculateAverageScore([95])).toBe(95);
  });

  it("should format stat values correctly", () => {
    const dashboard = createDashboardLogic();

    expect(dashboard.formatStatValue(500)).toBe("500");
    expect(dashboard.formatStatValue(1000)).toBe("1.0k");
    expect(dashboard.formatStatValue(1500)).toBe("1.5k");
    expect(dashboard.formatStatValue(12000)).toBe("12.0k");
  });

  it("should handle empty and edge case data", () => {
    const dashboard = createDashboardLogic();

    dashboard.updateStats({});
    expect(dashboard.stats.totalAudits).toBe(0);

    dashboard.updateStats({ totalAudits: -1 });
    expect(dashboard.stats.totalAudits).toBe(-1); // Should handle negative values

    expect(dashboard.calculateAverageScore([0, 0, 0])).toBe(0);
    expect(dashboard.formatStatValue(0)).toBe("0");
  });
});
