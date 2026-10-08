import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  CreateSemesterPayload,
  GetSemestersQuery,
  SemesterItem,
  UpdateSemesterPayload,
} from "@/types";

export function getSemesters(params?: GetSemestersQuery) {
  return apiClient<ApiResponse<SemesterItem[]>>("/semesters", {
    query: params,
  });
}

export function getSemesterById(id: string) {
  return apiClient<ApiResponse<SemesterItem>>(`/semesters/${id}`);
}

export function createSemester(payload: CreateSemesterPayload) {
  return apiClient<ApiResponse<SemesterItem>>("/semesters", {
    method: "POST",
    body: payload,
  });
}

export function updateSemester(id: string, payload: UpdateSemesterPayload) {
  return apiClient<ApiResponse<SemesterItem>>(`/semesters/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteSemester(id: string) {
  return apiClient<ApiResponse<SemesterItem>>(`/semesters/${id}`, {
    method: "DELETE",
  });
}
