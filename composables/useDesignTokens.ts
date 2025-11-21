/**
 * Design Tokens Composable
 * Provides programmatic access to design system tokens for runtime use
 */

export type ScoreLevel = 'excellent' | 'good' | 'average' | 'poor' | 'critical'
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info'

interface ScoreThresholds {
  excellent: number
  good: number
  average: number
  poor: number
}

const DEFAULT_THRESHOLDS: ScoreThresholds = {
  excellent: 90,
  good: 70,
  average: 50,
  poor: 25,
}

export const useDesignTokens = () => {
  /**
   * Get the score level based on a numeric score
   */
  const getScoreLevel = (score: number, thresholds = DEFAULT_THRESHOLDS): ScoreLevel => {
    if (score >= thresholds.excellent) return 'excellent'
    if (score >= thresholds.good) return 'good'
    if (score >= thresholds.average) return 'average'
    if (score >= thresholds.poor) return 'poor'
    return 'critical'
  }

  /**
   * Get CSS variable value for a score
   */
  const getScoreColor = (score: number, thresholds = DEFAULT_THRESHOLDS): string => {
    const level = getScoreLevel(score, thresholds)
    return `var(--color-score-${level})`
  }

  /**
   * Get background CSS variable for a score
   */
  const getScoreBgColor = (score: number, thresholds = DEFAULT_THRESHOLDS): string => {
    const level = getScoreLevel(score, thresholds)
    return `var(--color-score-${level}-bg)`
  }

  /**
   * Get Tailwind class for a score
   */
  const getScoreClass = (score: number, thresholds = DEFAULT_THRESHOLDS): string => {
    const level = getScoreLevel(score, thresholds)
    return `text-score-${level}`
  }

  /**
   * Get Tailwind background class for a score
   */
  const getScoreBgClass = (score: number, thresholds = DEFAULT_THRESHOLDS): string => {
    const level = getScoreLevel(score, thresholds)
    return `bg-score-${level}-bg`
  }

  /**
   * Get CSS variable value for severity
   */
  const getSeverityColor = (severity: SeverityLevel): string => {
    return `var(--color-severity-${severity})`
  }

  /**
   * Get background CSS variable for severity
   */
  const getSeverityBgColor = (severity: SeverityLevel): string => {
    return `var(--color-severity-${severity}-bg)`
  }

  /**
   * Get Tailwind class for severity
   */
  const getSeverityClass = (severity: SeverityLevel): string => {
    return `text-severity-${severity}`
  }

  /**
   * Get Tailwind background class for severity
   */
  const getSeverityBgClass = (severity: SeverityLevel): string => {
    return `bg-severity-${severity}-bg`
  }

  /**
   * Get severity level from string (handles variations)
   */
  const normalizeSeverity = (severity: string): SeverityLevel => {
    const normalized = severity.toLowerCase()
    if (['critical', 'error', 'danger'].includes(normalized)) return 'critical'
    if (['high', 'warning'].includes(normalized)) return 'high'
    if (['medium', 'moderate'].includes(normalized)) return 'medium'
    if (['low', 'minor'].includes(normalized)) return 'low'
    return 'info'
  }

  /**
   * Get spacing value in rem
   */
  const spacing = (multiplier: number): string => {
    return `${multiplier * 0.25}rem`
  }

  /**
   * Get CSS variable for spacing token
   */
  const getSpacing = (size: number): string => {
    return `var(--space-${size})`
  }

  /**
   * Format score with appropriate label
   */
  const formatScore = (score: number): { value: number; label: string; level: ScoreLevel } => {
    const level = getScoreLevel(score)
    const labels: Record<ScoreLevel, string> = {
      excellent: 'Excellent',
      good: 'Good',
      average: 'Needs Work',
      poor: 'Poor',
      critical: 'Critical',
    }
    return {
      value: Math.round(score),
      label: labels[level],
      level,
    }
  }

  /**
   * Get severity icon name (for icon libraries)
   */
  const getSeverityIcon = (severity: SeverityLevel): string => {
    const icons: Record<SeverityLevel, string> = {
      critical: 'alert-circle',
      high: 'alert-triangle',
      medium: 'alert-triangle',
      low: 'info',
      info: 'info',
    }
    return icons[severity]
  }

  /**
   * Get severity sort order (for sorting issues)
   */
  const getSeverityOrder = (severity: SeverityLevel): number => {
    const order: Record<SeverityLevel, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      info: 4,
    }
    return order[severity]
  }

  /**
   * Generate gradient stops for a score gauge
   */
  const getScoreGradientStops = () => {
    return [
      { offset: 0, color: 'var(--color-score-critical)' },
      { offset: 25, color: 'var(--color-score-poor)' },
      { offset: 50, color: 'var(--color-score-average)' },
      { offset: 70, color: 'var(--color-score-good)' },
      { offset: 90, color: 'var(--color-score-excellent)' },
    ]
  }

  /**
   * Get transition CSS for animations
   */
  const getTransition = (property = 'all', speed: 'fast' | 'base' | 'slow' = 'base'): string => {
    return `${property} var(--transition-${speed}) var(--ease-in-out)`
  }

  return {
    // Score utilities
    getScoreLevel,
    getScoreColor,
    getScoreBgColor,
    getScoreClass,
    getScoreBgClass,
    formatScore,
    getScoreGradientStops,

    // Severity utilities
    getSeverityColor,
    getSeverityBgColor,
    getSeverityClass,
    getSeverityBgClass,
    normalizeSeverity,
    getSeverityIcon,
    getSeverityOrder,

    // Spacing utilities
    spacing,
    getSpacing,

    // Animation utilities
    getTransition,

    // Constants
    thresholds: DEFAULT_THRESHOLDS,
  }
}

// Type exports for external use
export type { ScoreThresholds }
