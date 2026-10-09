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

// Auth Payloads
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "STUDENT" | "TEACHER";
  phone?: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResendResetOtpPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

export interface UpdateMePayload {
  name?: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
}
