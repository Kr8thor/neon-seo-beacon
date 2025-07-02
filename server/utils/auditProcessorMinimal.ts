// Fixed audit processor - no immediate startup
import type { H3Event } from "h3";
import { createClient } from "@supabase/supabase-js";

interface AuditJob {
  id: string;
  auditId: string;
  url: string;
  type: string;
  status: "pending" | "processing" | "completed" | "failed";
  attempts: number;
  maxAttempts: number;
  nextRetry?: number;
  error?: string;
  createdAt: number;
}

// In-memory job queue
const jobQueue: AuditJob[] = [];
const activeJobs = new Map<string, boolean>();
const maxConcurrentJobs = 3;

// Create Supabase client for database operations
function createSupabaseClient() {
  const config = useRuntimeConfig();
  return createClient(
    config.supabaseUrl || config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
  );
}

export function getQueueStats() {
  return {
    total: jobQueue.length,
    pending: jobQueue.filter((job) => job.status === "pending").length,
    processing: jobQueue.filter((job) => job.status === "processing").length,
    completed: jobQueue.filter((job) => job.status === "completed").length,
    failed: jobQueue.filter((job) => job.status === "failed").length,
    activeJobs: activeJobs.size,
  };
}

export function addAuditJob(
  auditId: string,
  url: string,
  type: string = "full",
): string {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const job: AuditJob = {
    id: jobId,
    auditId,
    url,
    type,
    status: "pending",
    attempts: 0,
    maxAttempts: 3,
    createdAt: Date.now(),
  };

  jobQueue.push(job);
  console.log(`[AUDIT-PROCESSOR] Added job ${jobId} for audit ${auditId}`);

  return jobId;
}

export function getJobStatus(jobId: string): AuditJob | null {
  return jobQueue.find((job) => job.id === jobId) || null;
}

// Manual queue processing - no automatic interval
export async function processAuditQueue() {
  console.log("[AUDIT-PROCESSOR] Manual queue processing");
  // Implementation details removed for minimal startup
  return { processed: 0, pending: jobQueue.length };
}

// REMOVED: Automatic setInterval startup
// This was causing startup issues in Railway
console.log("[AUDIT-PROCESSOR] Module loaded (no auto-start)");