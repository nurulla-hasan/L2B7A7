import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  GetPaymentsQuery,
  PaymentItem,
} from "@/types";

export function getAllPayments(params?: GetPaymentsQuery) {
  return apiClient<ApiResponse<PaymentItem[]>>("/payments", {
    query: params,
  });
}

export function getPaymentById(id: string) {
  return apiClient<ApiResponse<PaymentItem>>(`/payments/${id}`);
}

export function getMyPayments(params?: GetPaymentsQuery) {
  return apiClient<ApiResponse<PaymentItem[]>>("/payments/my", {
    query: params,
  });
}

export function initiateBkashPayment(payload: { enrollmentId: string }) {
  return apiClient<
    ApiResponse<{
      paymentId: string;
      paymentUrl: string;
      bkashPaymentId: string;
      amount: number;
    }>
  >("/payments/bkash/initiate", {
    method: "POST",
    body: payload,
  });
}

