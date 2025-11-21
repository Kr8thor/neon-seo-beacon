// Create a scheduled audit
import { createClient } from "@supabase/supabase-js";
import { logger } from "~/server/utils/logger";
import { z } from "zod";

const scheduleSchema = z.object({
  url: z.string().url("Invalid URL format"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  day_of_week: z.number().min(0).max(6).optional(), // 0 = Sunday
  day_of_month: z.number().min(1).max(28).optional(),
  hour: z.number().min(0).max(23).default(9),
  is_active: z.boolean().default(true),
  notify_email: z.string().email().optional(),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    const validated = scheduleSchema.parse(body);

    const supabase = createClient(
      config.supabaseUrl || config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    );

    // Calculate next run time
    const nextRun = calculateNextRun(validated);

    const { data: schedule, error } = await supabase
      .from("scheduled_audits")
      .insert({
        url: validated.url,
        frequency: validated.frequency,
        day_of_week: validated.day_of_week,
        day_of_month: validated.day_of_month,
        hour: validated.hour,
        is_active: validated.is_active,
        notify_email: validated.notify_email,
        next_run_at: nextRun.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Scheduled audit created", { scheduleId: schedule.id, url: validated.url });

    return {
      success: true,
      data: schedule,
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Invalid request data",
        data: error.errors,
      });
    }

    logger.error("Failed to create scheduled audit", { error });

    throw createError({
      statusCode: 500,
      message: "Failed to create scheduled audit",
    });
  }
});

function calculateNextRun(schedule: any): Date {
  const now = new Date();
  const next = new Date();
  next.setHours(schedule.hour, 0, 0, 0);

  switch (schedule.frequency) {
    case "daily":
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      break;

    case "weekly":
      const targetDay = schedule.day_of_week ?? 1; // Default Monday
      const currentDay = next.getDay();
      let daysUntil = targetDay - currentDay;
      if (daysUntil <= 0 || (daysUntil === 0 && next <= now)) {
        daysUntil += 7;
      }
      next.setDate(next.getDate() + daysUntil);
      break;

    case "monthly":
      const targetDate = schedule.day_of_month ?? 1;
      next.setDate(targetDate);
      if (next <= now) {
        next.setMonth(next.getMonth() + 1);
      }
      break;
  }

  return next;
}
