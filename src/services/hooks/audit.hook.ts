import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllAuditLogs } from "../api/audit.api";
import type { GetAuditLogsQuery } from "@/types";

export function useGetAllAuditLogs(
  params?: GetAuditLogsQuery | Record<string, unknown>
) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAllAuditLogs(params),
    placeholderData: keepPreviousData,
  });
}
