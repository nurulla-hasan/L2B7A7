import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCourseOffering,
  deleteCourseOffering,
  getCourseOfferingById,
  getCourseOfferings,
  updateCourseOffering,
} from "../api/course-offering.api";
import type {
  CreateCourseOfferingPayload,
  GetCourseOfferingsQuery,
  UpdateCourseOfferingPayload,
} from "@/types";

export function useGetCourseOfferings(
  params?: GetCourseOfferingsQuery | Record<string, unknown>
) {
  return useQuery({
    queryKey: ["course-offerings", params],
    queryFn: () => getCourseOfferings(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetCourseOfferingById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["course-offerings", id],
    queryFn: () => getCourseOfferingById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateCourseOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCourseOfferingPayload) =>
      createCourseOffering(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
    },
  });
}

export function useUpdateCourseOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCourseOfferingPayload;
    }) => updateCourseOffering(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
    },
  });
}

export function useDeleteCourseOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourseOffering(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
    },
  });
}
