import type { PaginationMeta } from "./api.types";

export interface CourseOfferingCourse {
  id: string;
  title: string;
  code: string;
  credits: number;
  images?: string[];
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseOfferingSemester {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseOfferingTeacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface CourseOfferingItem {
  id: string;
  courseId: string;
  semesterId: string;
  teacherId: string;
  section: string;
  capacity: number;
  fee: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  course: CourseOfferingCourse;
  semester: CourseOfferingSemester;
  teacher: CourseOfferingTeacher;
  _count?: {
    enrollments: number;
  };
}

export type CourseOfferingSortBy =
  | "newest"
  | "oldest"
  | "fee_asc"
  | "fee_desc"
  | "capacity_asc"
  | "capacity_desc";

export interface GetCourseOfferingsQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  semesterId?: string;
  courseId?: string;
  teacherId?: string;
  section?: string;
  sortBy?: CourseOfferingSortBy;
}

export interface CreateCourseOfferingPayload {
  courseId: string;
  semesterId: string;
  teacherId: string;
  section: string;
  capacity: number;
  fee: number;
}

export interface UpdateCourseOfferingPayload {
  teacherId?: string;
  section?: string;
  capacity?: number;
  fee?: number;
}

export interface CourseOfferingsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: CourseOfferingItem[];
}

export interface SingleCourseOfferingApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CourseOfferingItem;
}
