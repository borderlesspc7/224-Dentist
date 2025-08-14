import type { UserProfile } from "../types/user";

export function hasAccess(
  user: UserProfile | null,
  required?: string
): boolean {
  if (!required) return true;
  if (!user) return false;
  if (user.role === "admin") return true;
  return !!user.allowedPaths?.includes(required);
}
