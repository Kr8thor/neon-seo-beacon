import { createSupabaseClient } from "~/server/utils/supabase";
import { logger } from "~/server/utils/logger";

export default defineEventHandler(async (event) => {
  try {
    const supabase = createSupabaseClient();

    // Try to get existing users (first 5)
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email")
      .limit(5);

    if (error) {
      logger.warn("Profiles table error", { error });

      // Try auth.users table instead
      const { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();

      if (authError) {
        return {
          error: "Could not access users",
          details: authError.message,
        };
      }

      return {
        message: "Available users from auth.users",
        users: authUsers.users.map((u) => ({ id: u.id, email: u.email })),
      };
    }

    return {
      message: "Available users from profiles",
      users,
    };
  } catch (error: any) {
    return {
      error: "Server error",
      details: error.message,
    };
  }
});
