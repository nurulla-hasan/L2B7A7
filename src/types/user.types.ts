import type { StudentProfile, TeacherProfile, UserRole, UserStatus } from "./auth.types";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string | null;
  imageUrl?: string | null;
  emailVerified: boolean;
  createdAt: string;
  teacherProfile?: TeacherProfile | null;
  studentProfile?: StudentProfile | null;
}

export interface GetUsersQuery {
  searchTerm?: string;
  role?: UserRole | string;
  status?: UserStatus | string;
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  role?: "ADMIN";
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}

export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface UserDashboardStats {
  users: {
    total: number;
    students: number;
    teachers: number;
    admins: number;
    blocked: number;
  };
  academics: {
    semesters: number;
    courses: number;
    courseOfferings: number;
  };
  enrollments: {
    total: number;
    enrolled: number;
    pendingPayment: number;
  };
  finance: {
    totalRevenueBDT: number;
    successfulTransactions: number;
  };
  results: {
    total: number;
    published: number;
    drafts: number;
  };
}

export interface UpdatedUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UploadProfileImageResponse {
  id: string;
  name: string;
  imageUrl: string;
}

