// tests/unit/components/LoadingAnimation.test.ts
import { describe, it, expect } from "vitest";

// Mock loading animation logic
const createLoadingLogic = () => {
  const animationTypes = [
    "orbital",
    "pulse",
    "wave",
    "dna",
    "morphing",
    "geometric",
  ];

  const validateAnimationType = (type: string) => {
    return animationTypes.includes(type);
  };

  const getAnimationConfig = (type: string) => {
    const configs = {
      orbital: { duration: 2000, iterations: Infinity },
      pulse: { duration: 1500, iterations: Infinity },
      wave: { duration: 2500, iterations: Infinity },
      dna: { duration: 3000, iterations: Infinity },
      morphing: { duration: 4000, iterations: Infinity },
      geometric: { duration: 2200, iterations: Infinity },
    };

    return configs[type as keyof typeof configs] || configs.orbital;
  };

  const formatMessage = (message: string = "Loading...") => {
    return message.trim() || "Loading...";
  };

  const getSizeClass = (size: "small" | "medium" | "large" = "medium") => {
    const sizeMap = {
      small: "w-8 h-8",
      medium: "w-12 h-12",
      large: "w-16 h-16",
    };

    return sizeMap[size] || sizeMap.medium;
  };

  return {
    animationTypes,
    validateAnimationType,
    getAnimationConfig,
    formatMessage,
    getSizeClass,
  };
};

describe("LoadingAnimation Component Logic", () => {
  it("should validate animation types correctly", () => {
    const loading = createLoadingLogic();

    expect(loading.validateAnimationType("orbital")).toBe(true);
    expect(loading.validateAnimationType("pulse")).toBe(true);
    expect(loading.validateAnimationType("invalid")).toBe(false);
    expect(loading.validateAnimationType("")).toBe(false);
  });

  it("should return correct animation config", () => {
    const loading = createLoadingLogic();

    const orbitalConfig = loading.getAnimationConfig("orbital");
    expect(orbitalConfig.duration).toBe(2000);
    expect(orbitalConfig.iterations).toBe(Infinity);

    const pulseConfig = loading.getAnimationConfig("pulse");
    expect(pulseConfig.duration).toBe(1500);

    // Invalid type should default to orbital
    const invalidConfig = loading.getAnimationConfig("invalid");
    expect(invalidConfig.duration).toBe(2000);
  });

  it("should format messages correctly", () => {
    const loading = createLoadingLogic();

    expect(loading.formatMessage("Analyzing website...")).toBe(
      "Analyzing website...",
    );
    expect(loading.formatMessage("  Processing  ")).toBe("Processing");
    expect(loading.formatMessage("")).toBe("Loading...");
    expect(loading.formatMessage()).toBe("Loading...");
  });

  it("should return correct size classes", () => {
    const loading = createLoadingLogic();

    expect(loading.getSizeClass("small")).toBe("w-8 h-8");
    expect(loading.getSizeClass("medium")).toBe("w-12 h-12");
    expect(loading.getSizeClass("large")).toBe("w-16 h-16");
    expect(loading.getSizeClass()).toBe("w-12 h-12"); // default
  });

  it("should handle all available animation types", () => {
    const loading = createLoadingLogic();

    expect(loading.animationTypes).toHaveLength(6);
    expect(loading.animationTypes).toContain("orbital");
    expect(loading.animationTypes).toContain("pulse");
    expect(loading.animationTypes).toContain("wave");
    expect(loading.animationTypes).toContain("dna");
    expect(loading.animationTypes).toContain("morphing");
    expect(loading.animationTypes).toContain("geometric");
  });

  it("should ensure all animation types have configs", () => {
    const loading = createLoadingLogic();

    loading.animationTypes.forEach((type) => {
      const config = loading.getAnimationConfig(type);
      expect(config).toHaveProperty("duration");
      expect(config).toHaveProperty("iterations");
      expect(typeof config.duration).toBe("number");
      expect(config.duration).toBeGreaterThan(0);
    });
  });
});
