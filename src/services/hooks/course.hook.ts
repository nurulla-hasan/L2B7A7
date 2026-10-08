import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../api/course.api";
import type {
  CreateCoursePayload,
  GetCoursesQuery,
  UpdateCoursePayload,
} from "@/types";

export function useGetCourses(params?: GetCoursesQuery) {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => getCourses(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetCourseById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => getCourseById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCoursePayload) => createCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCoursePayload;
    }) => updateCourse(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
