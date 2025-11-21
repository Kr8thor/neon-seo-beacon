// Compare two audits side by side
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { audit_ids, urls } = body;

  if (!audit_ids && !urls) {
    throw createError({
      statusCode: 400,
      message: "Either audit_ids or urls must be provided",
    });
  }

  try {
    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    let audits: any[] = [];

    if (audit_ids && audit_ids.length === 2) {
      // Compare specific audits
      const { data, error } = await supabase
        .from("audits")
        .select("id, url, score, status, results, created_at")
        .in("id", audit_ids);

      if (error) throw error;
      audits = data || [];
    } else if (urls && urls.length === 2) {
      // Get latest audit for each URL
      for (const url of urls) {
        const { data, error } = await supabase
          .from("audits")
          .select("id, url, score, status, results, created_at")
          .eq("url", url)
          .eq("status", "completed")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          audits.push(data);
        }
      }
    }

    if (audits.length !== 2) {
      throw createError({
        statusCode: 404,
        message: "Could not find both audits for comparison",
      });
    }

    // Build comparison data
    const comparison = {
      audits: audits.map(a => ({
        id: a.id,
        url: a.url,
        score: a.score,
        created_at: a.created_at,
      })),
      scores: {
        difference: audits[0].score - audits[1].score,
        winner: audits[0].score > audits[1].score ? 0 : audits[0].score < audits[1].score ? 1 : -1,
      },
      metrics: compareMetrics(audits[0].results, audits[1].results),
      issues: {
        audit_1: countIssues(audits[0].results),
        audit_2: countIssues(audits[1].results),
      },
    };

    return {
      success: true,
      data: comparison,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    logger.error("Failed to compare audits", { error });

    throw createError({
      statusCode: 500,
      message: "Failed to compare audits",
    });
  }
});

function compareMetrics(results1: any, results2: any) {
  const metrics: any = {};

  // Title comparison
  metrics.title = {
    audit_1: results1?.title?.length || 0,
    audit_2: results2?.title?.length || 0,
    optimal: "30-60 characters",
  };

  // Meta description
  metrics.meta_description = {
    audit_1: results1?.metaDescription?.length || 0,
    audit_2: results2?.metaDescription?.length || 0,
    optimal: "120-160 characters",
  };

  // Performance
  if (results1?.performance && results2?.performance) {
    metrics.load_time = {
      audit_1: results1.performance.loadTime || 0,
      audit_2: results2.performance.loadTime || 0,
      unit: "ms",
      winner: (results1.performance.loadTime || 0) < (results2.performance.loadTime || 0) ? 0 : 1,
    };
  }

  // Images
  if (results1?.images && results2?.images) {
    metrics.images_with_alt = {
      audit_1: results1.images.withAlt || 0,
      audit_2: results2.images.withAlt || 0,
      total_1: results1.images.total || 0,
      total_2: results2.images.total || 0,
    };
  }

  // Links
  if (results1?.links && results2?.links) {
    metrics.internal_links = {
      audit_1: results1.links.internal || 0,
      audit_2: results2.links.internal || 0,
    };
    metrics.external_links = {
      audit_1: results1.links.external || 0,
      audit_2: results2.links.external || 0,
    };
  }

  // Technical SEO
  const tech1 = results1?.technical || {};
  const tech2 = results2?.technical || {};

  metrics.technical = {
    audit_1: {
      viewport: tech1.hasViewport,
      canonical: tech1.hasCanonical,
      lang: tech1.hasLangAttribute,
      structured_data: tech1.structuredData?.count || 0,
    },
    audit_2: {
      viewport: tech2.hasViewport,
      canonical: tech2.hasCanonical,
      lang: tech2.hasLangAttribute,
      structured_data: tech2.structuredData?.count || 0,
    },
  };

  return metrics;
}

function countIssues(results: any) {
  // This is a simplified count - in real implementation, query audit_issues
  let critical = 0, high = 0, medium = 0, low = 0;

  if (!results?.title) critical++;
  else if (results.title.length < 30 || results.title.length > 60) medium++;

  if (!results?.metaDescription) high++;

  if (results?.h1Tags?.length === 0) high++;
  else if (results?.h1Tags?.length > 1) medium++;

  if (results?.images?.withoutAlt > 0) {
    if (results.images.withoutAlt > 5) high++;
    else medium++;
  }

  if (!results?.technical?.hasViewport) high++;
  if (!results?.technical?.hasCanonical) medium++;

  if (results?.performance?.loadTime > 6000) critical++;
  else if (results?.performance?.loadTime > 4000) high++;

  return { critical, high, medium, low, total: critical + high + medium + low };
}
