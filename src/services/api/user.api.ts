import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  CreateAdminPayload,
  GetUsersQuery,
  UpdatedUserResponse,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
  UploadProfileImageResponse,
  UserDashboardStats,
  UserItem,
} from "@/types";

export function getUsers(params?: GetUsersQuery | Record<string, unknown>) {
  return apiClient<ApiResponse<UserItem[]>>("/users", {
    query: params,
  });
}

export function getUserById(id: string) {
  return apiClient<ApiResponse<UserItem>>(`/users/${id}`);
}

export function getUserDashboardStats() {
  return apiClient<ApiResponse<UserDashboardStats>>("/users/admin/dashboard-stats");
}

export function createAdmin(payload: CreateAdminPayload) {
  return apiClient<ApiResponse<UserItem>>("/users/create-admin", {
    method: "POST",
    body: payload,
  });
}

export function updateUserStatus(id: string, payload: UpdateUserStatusPayload) {
  return apiClient<ApiResponse<UpdatedUserResponse>>(`/users/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateUserRole(id: string, payload: UpdateUserRolePayload) {
  return apiClient<ApiResponse<UpdatedUserResponse>>(`/users/${id}/role`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteUser(id: string) {
  return apiClient<ApiResponse<{ message: string }>>(`/users/${id}`, {
    method: "DELETE",
  });
}

export function uploadProfileImage(formData: FormData) {
  return apiClient<ApiResponse<UploadProfileImageResponse>>("/users/profile-image", {
    method: "PATCH",
    body: formData,
  });
}
