import { apiClient } from "@/lib/api-client";
import type { AuditLogsApiResponse, GetAuditLogsQuery } from "@/types";

export function getAllAuditLogs(params?: GetAuditLogsQuery) {
  return apiClient<AuditLogsApiResponse>("/audit-logs", {
    query: params,
  });
}
