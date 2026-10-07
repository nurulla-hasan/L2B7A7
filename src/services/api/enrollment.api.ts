import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  EnrollmentItem,
  GetEnrollmentsQuery,
  UpdateEnrollmentStatusPayload,
} from "@/types";

export function getAllEnrollments(
  params?: GetEnrollmentsQuery | Record<string, unknown>
) {
  return apiClient<ApiResponse<EnrollmentItem[]>>("/enrollments", {
    query: params,
  });
}

export function getEnrollmentById(id: string) {
  return apiClient<ApiResponse<EnrollmentItem>>(`/enrollments/${id}`);
}

export function getOfferingEnrollments(offeringId: string) {
  return apiClient<ApiResponse<EnrollmentItem[]>>(
    `/enrollments/offering/${offeringId}`
  );
}

export function updateEnrollmentStatus(
  id: string,
  payload: UpdateEnrollmentStatusPayload
) {
  return apiClient<ApiResponse<EnrollmentItem>>(`/enrollments/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}
