import type { H3Event, EventHandler } from "h3";
import { getCurrentUser } from "./auth";

interface AuthOptions {
  required?: boolean;
}

/**
 * Wraps an event handler with authentication check
 * Usage: export default withAuth(async (event, user) => { ... })
 */
export function withAuth<T>(
  handler: (event: H3Event, user: { id: string; email: string }) => Promise<T>,
  options: AuthOptions = { required: true }
): EventHandler {
  return defineEventHandler(async (event: H3Event) => {
    const user = await getCurrentUser(event);

    if (options.required && !user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authentication required",
      });
    }

    return handler(event, user!);
  });
}

/**
 * Validates that user owns the resource
 */
export async function validateOwnership(
  event: H3Event,
  resourceUserId: string
): Promise<void> {
  const user = await getCurrentUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  if (user.id !== resourceUserId) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied",
    });
  }
}

/**
 * Get user or throw 401
 */
export async function requireAuth(event: H3Event): Promise<{ id: string; email: string }> {
  const user = await getCurrentUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  return user;
}
