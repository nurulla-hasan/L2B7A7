import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResendOtpPayload,
  ResendResetOtpPayload,
  ResetPasswordPayload,
  UpdateMePayload,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from "@/types";

export function loginUser(payload: LoginPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function registerUser(payload: RegisterPayload) {
  return apiClient<ApiResponse<{ email: string }>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient<ApiResponse<VerifyEmailResponse>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function resendVerificationOtp(payload: ResendOtpPayload) {
  return apiClient<ApiResponse<null>>("/auth/resend-otp", {
    method: "POST",
    body: payload,
  });
}

export function getMe() {
  return apiClient<ApiResponse<{ user: AuthUser }>>("/auth/me");
}

export function updateMe(payload: UpdateMePayload) {
  return apiClient<ApiResponse<{ user: AuthUser }>>("/auth/me", {
    method: "PATCH",
    body: payload,
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resendResetOtp(payload: ResendResetOtpPayload) {
  return apiClient<ApiResponse<null>>("/auth/resend-reset-otp", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function logoutUser() {
  return apiClient<ApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
}
