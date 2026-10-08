import type { PaginationMeta } from "./api.types";

export type AuditActionType =
  | "CREATE_SEMESTER"
  | "CREATE_COURSE"
  | "CREATE_COURSE_OFFERING"
  | "ENROLL_COURSE"
  | "DROP_COURSE"
  | "PAYMENT_SUCCESS"
  | "SUBMIT_RESULT"
  | "PUBLISH_RESULT"
  | "UPDATE_USER_STATUS";

export interface AuditLogUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLogItem {
  id: string;
  userId: string | null;
  action: AuditActionType;
  resource: string;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: AuditLogUser | null;
}

export interface GetAuditLogsQuery {
  page?: number | string;
  limit?: number | string;
  searchTerm?: string;
  action?: AuditActionType | string;
  resource?: string;
}

export interface AuditLogsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: AuditLogItem[];
}
