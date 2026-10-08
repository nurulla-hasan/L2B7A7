import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  GetResultsQuery,
  PublishResultsPayload,
  ResultItem,
  ResultsApiResponse,
  SubmitResultPayload,
  UpdateResultPayload,
} from "@/types";

export function getAllResults(params?: GetResultsQuery) {
  return apiClient<ResultsApiResponse>("/results", {
    query: params,
  });
}

export function getResultById(id: string) {
  return apiClient<ApiResponse<ResultItem>>(`/results/${id}`);
}

export function getOfferingResults(offeringId: string) {
  return apiClient<ApiResponse<ResultItem[]>>(`/results/offering/${offeringId}`);
}

export function updateResult(id: string, payload: UpdateResultPayload) {
  return apiClient<ApiResponse<ResultItem>>(`/results/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function publishResults(payload: PublishResultsPayload) {
  return apiClient<ApiResponse<null>>("/results/publish", {
    method: "PATCH",
    body: payload,
  });
}

export function submitResult(payload: SubmitResultPayload) {
  return apiClient<ApiResponse<ResultItem>>("/results", {
    method: "POST",
    body: payload,
  });
}

export function getMyResults() {
  return apiClient<ApiResponse<ResultItem[]>>("/results/my");
}
