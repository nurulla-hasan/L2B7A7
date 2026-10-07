import type { PaginationMeta } from "./api.types";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export type PaymentGateway = "BKASH" | "SSLCOMMERZ";

export type PaymentSortBy =
  | "newest"
  | "oldest"
  | "amount_desc"
  | "amount_asc";

export interface PaymentStudent {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  phone?: string;
  studentProfile?: {
    studentId: string;
    department: string;
    batch?: string;
  } | null;
}

export interface PaymentCourseOffering {
  id?: string;
  section: string;
  fee?: number;
  capacity?: number;
  course: {
    id: string;
    title: string;
    code: string;
    credits: number;
  };
  semester: {
    id: string;
    name: string;
    year: number;
  };
  teacher: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaymentEnrollment {
  id: string;
  studentId: string;
  courseOfferingId: string;
  student: PaymentStudent;
  courseOffering: PaymentCourseOffering;
}

export interface PaymentItem {
  id: string;
  enrollmentId: string;
  amount: number;
  transactionId: string;
  bkashPaymentId?: string | null;
  gateway: PaymentGateway;
  status: PaymentStatus;
  paymentDetails?: Record<string, unknown> | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  enrollment: PaymentEnrollment;
}

export interface GetPaymentsQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  gateway?: PaymentGateway;
  semesterId?: string;
  searchTerm?: string;
  sortBy?: PaymentSortBy;
}

export interface PaymentsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: PaymentItem[];
}

export interface SinglePaymentApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaymentItem;
}
