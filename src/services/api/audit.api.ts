import { apiClient } from "@/lib/api-client";
import type { AuditLogsApiResponse, GetAuditLogsQuery } from "@/types";

export function getAllAuditLogs(
  params?: GetAuditLogsQuery | Record<string, unknown>
) {
  return apiClient<AuditLogsApiResponse>("/audit-logs", {
    query: params,
  });
}
