import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  GetPaymentsQuery,
  PaymentItem,
} from "@/types";

export function getAllPayments(
  params?: GetPaymentsQuery | Record<string, unknown>
) {
  return apiClient<ApiResponse<PaymentItem[]>>("/payments", {
    query: params,
  });
}

export function getPaymentById(id: string) {
  return apiClient<ApiResponse<PaymentItem>>(`/payments/${id}`);
}

export function getMyPayments(params?: Record<string, unknown>) {
  return apiClient<ApiResponse<PaymentItem[]>>("/payments/my", {
    query: params,
  });
}
