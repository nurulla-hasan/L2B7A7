import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createSemester,
  deleteSemester,
  getSemesterById,
  getSemesters,
  updateSemester,
} from "../api/semester.api";
import type {
  CreateSemesterPayload,
  GetSemestersQuery,
  UpdateSemesterPayload,
} from "@/types";

export function useGetSemesters(
  params?: GetSemestersQuery | Record<string, unknown>
) {
  return useQuery({
    queryKey: ["semesters", params],
    queryFn: () => getSemesters(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetSemesterById(id: string) {
  return useQuery({
    queryKey: ["semesters", id],
    queryFn: () => getSemesterById(id),
    enabled: Boolean(id),
  });
}

export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSemesterPayload) => createSemester(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSemesterPayload;
    }) => updateSemester(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
}
