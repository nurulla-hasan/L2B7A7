import type { PaginationMeta } from "./api.types";
import type { CourseOfferingItem } from "./course-offering.types";

export type EnrollmentStatus = "PENDING_PAYMENT" | "ENROLLED" | "DROPPED";

export interface EnrollmentPayment {
  id: string;
  amount: number;
  status: string;
  transactionId: string | null;
  createdAt?: string;
}

export interface EnrollmentStudentProfile {
  studentId: string;
  department: string;
  batch: string;
}

export interface EnrollmentStudent {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  studentProfile?: EnrollmentStudentProfile | null;
}

export interface EnrollmentItem {
  id: string;
  studentId: string;
  courseOfferingId: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  student: EnrollmentStudent;
  courseOffering: CourseOfferingItem;
  payments?: EnrollmentPayment[];
}

export type EnrollmentSortBy =
  | "newest"
  | "oldest"
  | "status_asc"
  | "status_desc";

export interface GetEnrollmentsQuery {
  page?: number | string;
  limit?: number | string;
  status?: EnrollmentStatus | string;
  studentId?: string;
  courseOfferingId?: string;
  semesterId?: string;
  searchTerm?: string;
  sortBy?: EnrollmentSortBy | string;
}

export interface UpdateEnrollmentStatusPayload {
  status: EnrollmentStatus;
}

export interface EnrollmentsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: EnrollmentItem[];
}

export interface SingleEnrollmentApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: EnrollmentItem;
}
