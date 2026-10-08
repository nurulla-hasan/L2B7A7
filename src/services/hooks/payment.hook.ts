import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAllPayments,
  getPaymentById,
  getMyPayments,
  initiateBkashPayment,
} from "../api/payment.api";
import type { GetPaymentsQuery } from "@/types";

export function useGetAllPayments(params?: GetPaymentsQuery) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getAllPayments(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetPaymentById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => getPaymentById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useGetMyPayments(params?: GetPaymentsQuery) {
  return useQuery({
    queryKey: ["payments", "my", params],
    queryFn: () => getMyPayments(params),
    placeholderData: keepPreviousData,
  });
}

export function useInitiateBkashPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { enrollmentId: string }) =>
      initiateBkashPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}

