import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  CourseOfferingItem,
  CreateCourseOfferingPayload,
  GetCourseOfferingsQuery,
  UpdateCourseOfferingPayload,
} from "@/types";

export function getCourseOfferings(
  params?: GetCourseOfferingsQuery | Record<string, unknown>
) {
  return apiClient<ApiResponse<CourseOfferingItem[]>>("/course-offerings", {
    query: params,
  });
}

export function getCourseOfferingById(id: string) {
  return apiClient<ApiResponse<CourseOfferingItem>>(`/course-offerings/${id}`);
}

export function createCourseOffering(payload: CreateCourseOfferingPayload) {
  return apiClient<ApiResponse<CourseOfferingItem>>("/course-offerings", {
    method: "POST",
    body: payload,
  });
}

export function updateCourseOffering(
  id: string,
  payload: UpdateCourseOfferingPayload
) {
  return apiClient<ApiResponse<CourseOfferingItem>>(`/course-offerings/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCourseOffering(id: string) {
  return apiClient<ApiResponse<{ message: string }>>(`/course-offerings/${id}`, {
    method: "DELETE",
  });
}
