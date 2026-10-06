import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, AuthUser } from "@/types";

export * from "./useIsMobile";
export * from "./useInfiniteScroll";
export * from "./useNextFilter";
export * from "./useUtilityHooks";

export function useGetMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient<ApiResponse<AuthUser>>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
