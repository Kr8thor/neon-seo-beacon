// Supabase client utility for server-side operations
import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  const config = useRuntimeConfig();

  const supabaseUrl = config.supabaseUrl || config.public.supabaseUrl;
  const supabaseServiceKey = config.supabaseServiceRoleKey;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createSupabaseUserClient(accessToken?: string) {
  const config = useRuntimeConfig();

  const supabaseUrl = config.supabaseUrl || config.public.supabaseUrl;
  const supabaseAnonKey =
    config.supabaseAnonKey || config.public.supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase configuration");
  }

  const client = createClient(supabaseUrl, supabaseAnonKey);

  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: "",
    });
  }

  return client;
}
