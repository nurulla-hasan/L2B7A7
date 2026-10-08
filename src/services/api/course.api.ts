import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  CourseItem,
  CreateCoursePayload,
  GetCoursesQuery,
  UpdateCoursePayload,
} from "@/types";

export function getCourses(params?: GetCoursesQuery) {
  return apiClient<ApiResponse<CourseItem[]>>("/courses", {
    query: params,
  });
}

export function getCourseById(id: string) {
  return apiClient<ApiResponse<CourseItem>>(`/courses/${id}`);
}

export function createCourse(payload: CreateCoursePayload) {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      title: payload.title,
      code: payload.code,
      credits: Number(payload.credits),
    })
  );

  if (payload.images && payload.images.length > 0) {
    for (const file of payload.images) {
      formData.append("images", file);
    }
  }

  return apiClient<ApiResponse<CourseItem>>("/courses", {
    method: "POST",
    body: formData,
  });
}

export function updateCourse(id: string, payload: UpdateCoursePayload) {
  const formData = new FormData();
  const dataPayload: Record<string, unknown> = {};
  if (payload.title !== undefined) dataPayload.title = payload.title;
  if (payload.code !== undefined) dataPayload.code = payload.code;
  if (payload.credits !== undefined) {
    dataPayload.credits = Number(payload.credits);
  }

  formData.append("data", JSON.stringify(dataPayload));

  if (payload.images && payload.images.length > 0) {
    for (const file of payload.images) {
      formData.append("images", file);
    }
  }

  return apiClient<ApiResponse<CourseItem>>(`/courses/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export function deleteCourse(id: string) {
  return apiClient<ApiResponse<{ message: string }>>(`/courses/${id}`, {
    method: "DELETE",
  });
}
