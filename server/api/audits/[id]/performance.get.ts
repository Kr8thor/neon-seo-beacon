// Get performance metrics for an audit (Core Web Vitals, load times, etc.)
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const auditId = getRouterParam(event, 'id');

  if (!auditId) {
    throw createError({
      statusCode: 400,
      message: "Audit ID is required",
    });
  }

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Get performance metrics for this audit
    const { data: metrics, error } = await supabase
      .from("performance_metrics")
      .select("*")
      .eq("audit_id", auditId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate summary statistics
    let summary = null;
    if (metrics && metrics.length > 0) {
      const avgMetrics = {
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
        fcp: 0,
        load_time: 0,
      };

      metrics.forEach((m: any) => {
        avgMetrics.lcp += m.lcp || 0;
        avgMetrics.fid += m.fid || 0;
        avgMetrics.cls += m.cls || 0;
        avgMetrics.ttfb += m.ttfb || 0;
        avgMetrics.fcp += m.fcp || 0;
        avgMetrics.load_time += m.load_time || 0;
      });

      const count = metrics.length;
      summary = {
        pages_analyzed: count,
        averages: {
          lcp_ms: Math.round(avgMetrics.lcp / count),
          fid_ms: Math.round(avgMetrics.fid / count),
          cls: (avgMetrics.cls / count).toFixed(3),
          ttfb_ms: Math.round(avgMetrics.ttfb / count),
          fcp_ms: Math.round(avgMetrics.fcp / count),
          load_time_ms: Math.round(avgMetrics.load_time / count),
        },
        scores: {
          lcp: getVitalScore('lcp', avgMetrics.lcp / count),
          fid: getVitalScore('fid', avgMetrics.fid / count),
          cls: getVitalScore('cls', avgMetrics.cls / count),
        },
      };
    }

    return {
      success: true,
      data: metrics || [],
      summary,
    };
  } catch (error: any) {
    logger.error("Failed to fetch performance metrics", { error, auditId });

    throw createError({
      statusCode: 500,
      message: "Failed to fetch performance metrics",
    });
  }
});

// Helper function to score Core Web Vitals
function getVitalScore(metric: string, value: number): 'good' | 'needs_improvement' | 'poor' {
  const thresholds: Record<string, { good: number; poor: number }> = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
  };

  const t = thresholds[metric];
  if (!t) return 'good';

  if (value <= t.good) return 'good';
  if (value <= t.poor) return 'needs_improvement';
  return 'poor';
}
