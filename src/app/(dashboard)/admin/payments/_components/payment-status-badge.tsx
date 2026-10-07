import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function PaymentStatusBadge({
  status,
  size = "sm",
  className,
}: PaymentStatusBadgeProps) {
  switch (status) {
    case "PAID":
      return (
        <Badge variant="default" size={size} className={className}>
          Paid
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="secondary" size={size} className={className}>
          Pending
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive" size={size} className={className}>
          Failed
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="outline" size={size} className={className}>
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" size={size} className={className}>
          {status}
        </Badge>
      );
  }
}

export default PaymentStatusBadge;
