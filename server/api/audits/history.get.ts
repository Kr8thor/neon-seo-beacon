// Get historical audit trends for a URL
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const url = query.url as string;
  const days = Math.min(365, Math.max(7, parseInt(query.days as string) || 30));

  if (!url) {
    throw createError({
      statusCode: 400,
      message: "URL parameter is required",
    });
  }

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Normalize URL for matching
    const normalizedUrl = new URL(url).origin;

    // Get historical data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: history, error } = await supabase
      .from("audit_history")
      .select("audit_id, score, recorded_at")
      .ilike("url", `${normalizedUrl}%`)
      .gte("recorded_at", startDate.toISOString())
      .order("recorded_at", { ascending: true });

    if (error) {
      throw error;
    }

    // Calculate trend statistics
    const scores = history?.map(h => h.score) || [];
    const trend = {
      current: scores[scores.length - 1] || 0,
      previous: scores[scores.length - 2] || scores[0] || 0,
      change: 0,
      direction: 'stable' as 'up' | 'down' | 'stable',
      average: 0,
      min: 0,
      max: 0,
    };

    if (scores.length > 0) {
      trend.average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      trend.min = Math.min(...scores);
      trend.max = Math.max(...scores);
      trend.change = trend.current - trend.previous;
      trend.direction = trend.change > 0 ? 'up' : trend.change < 0 ? 'down' : 'stable';
    }

    // Group by date for chart
    const chartData = history?.reduce((acc: any[], h) => {
      const date = new Date(h.recorded_at).toISOString().split('T')[0];
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.score = h.score; // Take latest for that day
      } else {
        acc.push({ date, score: h.score, auditId: h.audit_id });
      }
      return acc;
    }, []) || [];

    return {
      success: true,
      data: {
        url: normalizedUrl,
        period: { days, start: startDate.toISOString(), end: new Date().toISOString() },
        trend,
        history: chartData,
        totalAudits: history?.length || 0,
      },
    };
  } catch (error: any) {
    logger.error("Failed to fetch audit history", { error, url });

    throw createError({
      statusCode: 500,
      message: "Failed to fetch audit history",
    });
  }
});
