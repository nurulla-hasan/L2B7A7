import type { PaginationMeta } from "./api.types";

export type CourseSortBy =
  | "newest"
  | "oldest"
  | "credits_asc"
  | "credits_desc"
  | "title_asc"
  | "title_desc"
  | "code_asc"
  | "code_desc";

export interface CourseOfferingDetail {
  id: string;
  semester: {
    id: string;
    name: string;
    year: number;
    startDate: string;
    endDate: string;
  };
  teacher: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CourseItem {
  id: string;
  title: string;
  code: string;
  credits: number;
  images: string[];
  courseOfferings?: CourseOfferingDetail[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetCoursesQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  credits?: number;
  sortBy?: CourseSortBy;
}

export interface CreateCoursePayload {
  title: string;
  code: string;
  credits: number;
  images?: File[];
}

export interface UpdateCoursePayload {
  title?: string;
  code?: string;
  credits?: number;
  images?: File[];
}

export interface CoursesApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: CourseItem[];
}

export interface SingleCourseApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CourseItem;
}
