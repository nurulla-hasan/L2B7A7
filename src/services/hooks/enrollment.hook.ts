import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAllEnrollments,
  getEnrollmentById,
  getOfferingEnrollments,
  updateEnrollmentStatus,
} from "../api/enrollment.api";
import type {
  GetEnrollmentsQuery,
  UpdateEnrollmentStatusPayload,
} from "@/types";

export function useGetAllEnrollments(
  params?: GetEnrollmentsQuery | Record<string, unknown>
) {
  return useQuery({
    queryKey: ["enrollments", params],
    queryFn: () => getAllEnrollments(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetEnrollmentById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["enrollments", id],
    queryFn: () => getEnrollmentById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useGetOfferingEnrollments(offeringId: string, enabled = true) {
  return useQuery({
    queryKey: ["enrollments", "offering", offeringId],
    queryFn: () => getOfferingEnrollments(offeringId),
    enabled: Boolean(offeringId) && enabled,
  });
}

export function useUpdateEnrollmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEnrollmentStatusPayload;
    }) => updateEnrollmentStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
    },
  });
}
