import { PaginationMeta } from "./api.types";


export interface ResultTeacher {
  id: string;
  name: string;
  email: string;
}

export interface ResultStudentProfile {
  studentId: string;
  department: string;
  batch: string;
}

export interface ResultStudent {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  studentProfile?: ResultStudentProfile | null;
}

export interface ResultCourse {
  id: string;
  title: string;
  code: string;
  credits: number;
}

export interface ResultSemester {
  id: string;
  name: string;
  year: number;
}

export interface ResultCourseOffering {
  id: string;
  section?: string;
  course: ResultCourse;
  semester: ResultSemester;
}

export interface ResultEnrollment {
  id: string;
  studentId: string;
  courseOfferingId: string;
  student: ResultStudent;
  courseOffering: ResultCourseOffering;
}

export interface ResultItem {
  id: string;
  enrollmentId: string;
  teacherId: string;
  marks: number;
  grade: string;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  teacher: ResultTeacher;
  enrollment: ResultEnrollment;
}

export interface GetResultsQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  published?: boolean | string;
}

export interface UpdateResultPayload {
  marks?: number;
  published?: boolean;
}

export interface ResultPaginationMeta extends PaginationMeta {
  draftCount?: number;
}

export interface PublishResultsPayload {
  resultIds?: string[];
  publishAll?: boolean;
}

export interface SubmitResultPayload {
  enrollmentId: string;
  marks: number;
  published?: boolean;
}

export interface ResultsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: ResultPaginationMeta;
  data: ResultItem[];
}

export interface SingleResultApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ResultItem;
}

export interface PublishResultsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}

export interface OfferingResultsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ResultItem[];
}

export interface MyResultsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ResultItem[];
}
