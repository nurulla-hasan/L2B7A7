import type { UserRole } from "@/types";

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  ADMIN: "/admin/dashboard",
  TEACHER: "/teacher/dashboard",
  STUDENT: "/student/dashboard",
} as const;

/**
 * Returns the default dashboard path according to the user's role.
 * Falls back to "/admin/dashboard" if role is unrecognized, or "/login" if missing.
 */
export function getDashboardPathByRole(role?: string | null): string {
  if (!role) return "/login";
  const normalized = role.toUpperCase() as UserRole;
  return ROLE_DASHBOARD_PATHS[normalized] ?? "/admin/dashboard";
}
