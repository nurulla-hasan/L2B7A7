import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import {
  changePassword,
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resendResetOtp,
  resendVerificationOtp,
  resetPassword,
  updateMe,
  verifyEmail,
} from "../api/auth.api";

export function useGetMe() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSuspenseGetMe() {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: resendVerificationOtp,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResendResetOtp() {
  return useMutation({
    mutationFn: resendResetOtp,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, null);
      queryClient.clear();
    },
  });
}
