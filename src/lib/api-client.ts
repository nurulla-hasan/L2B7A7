import { FetchError, ofetch, type FetchOptions } from "ofetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const GUEST_AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/verify-email",
  "/auth/resend-otp",
  "/auth/forgot-password",
  "/auth/resend-reset-otp",
  "/auth/reset-password",
  "/auth/google",
];

const baseClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  retry: 0,
  headers: {
    Accept: "application/json",
  },
});

let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  try {
    const res = await baseClient<{ success: boolean }>("/auth/refresh-token", {
      method: "POST",
    });
    return !!res?.success;
  } catch {
    return false;
  }
}

export async function apiClient<T>(
  url: string,
  options?: FetchOptions<"json">
): Promise<T> {
  try {
    return await baseClient<T>(url, options);
  } catch (error) {
    const is401 = error instanceof FetchError && error.response?.status === 401;
    const isGuestRoute = GUEST_AUTH_ROUTES.some((route) => url.includes(route));

    if (!is401 || isGuestRoute) {
      throw error;
    }

    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (!refreshed) {
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
      throw error;
    }

    // Replay exactly once after successful refresh
    return baseClient<T>(url, options);
  }
}

export default apiClient;
