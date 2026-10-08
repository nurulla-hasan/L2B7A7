import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAllEnrollments,
  getEnrollmentById,
  getMyEnrollments,
  getOfferingEnrollments,
  updateEnrollmentStatus,
  dropEnrollment,
  enrollCourse,
} from "../api/enrollment.api";
import type {
  GetEnrollmentsQuery,
  UpdateEnrollmentStatusPayload,
} from "@/types";

export function useGetAllEnrollments(params?: GetEnrollmentsQuery) {
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

export function useGetMyEnrollments(params?: GetEnrollmentsQuery) {
  return useQuery({
    queryKey: ["enrollments", "my", params],
    queryFn: () => getMyEnrollments(params),
    placeholderData: keepPreviousData,
  });
}

export function useDropEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dropEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { courseOfferingId: string }) => enrollCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
    },
  });
}

