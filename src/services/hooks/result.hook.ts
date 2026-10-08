import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAllResults,
  getMyResults,
  getOfferingResults,
  getResultById,
  publishResults,
  submitResult,
  updateResult,
} from "../api/result.api";
import type {
  GetResultsQuery,
  PublishResultsPayload,
  SubmitResultPayload,
  UpdateResultPayload,
} from "@/types";

export function useGetAllResults(params?: GetResultsQuery) {
  return useQuery({
    queryKey: ["results", params],
    queryFn: () => getAllResults(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetResultById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["results", id],
    queryFn: () => getResultById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useGetOfferingResults(offeringId: string, enabled = true) {
  return useQuery({
    queryKey: ["results", "offering", offeringId],
    queryFn: () => getOfferingResults(offeringId),
    enabled: Boolean(offeringId) && enabled,
  });
}

export function useGetMyResults() {
  return useQuery({
    queryKey: ["results", "my"],
    queryFn: () => getMyResults(),
  });
}

export function useUpdateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateResultPayload;
    }) => updateResult(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });
}

export function usePublishResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PublishResultsPayload) => publishResults(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });
}

export function useSubmitResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitResultPayload) => submitResult(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });
}
