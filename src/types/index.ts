export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export interface StudentProfile {
  studentId: string;
  department: string;
  batch: string;
  semester?: string;
}

export interface TeacherProfile {
  designation: string;
  department: string;
  employeeId: string;
  bio?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  emailVerified: boolean;
  phone?: string | null;
  imageUrl?: string | null;
  studentProfile?: StudentProfile | null;
  teacherProfile?: TeacherProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T;
}
