import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
  const config = useRuntimeConfig()
  
  return createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )
}

export async function getUser(userId: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    throw new Error(`Failed to get user: ${error.message}`)
  }
  
  return data
}

export async function createAudit(auditData: any) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('audits')
    .insert(auditData)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to create audit: ${error.message}`)
  }
  
  return data
}

export async function updateAudit(auditId: string, updates: any) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('audits')
    .update(updates)
    .eq('id', auditId)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to update audit: ${error.message}`)
  }
  
  return data
}

export async function getUserAudits(userId: string, limit = 10) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    throw new Error(`Failed to get user audits: ${error.message}`)
  }
  
  return data
}

export async function trackUsage(userId: string, date: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('usage')
    .upsert(
      {
        user_id: userId,
        date,
        count: 1
      },
      {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      }
    )
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to track usage: ${error.message}`)
  }
  
  return data
}