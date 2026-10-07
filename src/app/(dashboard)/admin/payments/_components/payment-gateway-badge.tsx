import { Badge } from "@/components/ui/badge";
import type { PaymentGateway } from "@/types";

interface PaymentGatewayBadgeProps {
  gateway: PaymentGateway;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function PaymentGatewayBadge({
  gateway,
  size = "sm",
  className,
}: PaymentGatewayBadgeProps) {
  return (
    <Badge variant="outline" size={size} className={className}>
      {gateway === "BKASH" ? "bKash" : "SSLCommerz"}
    </Badge>
  );
}

export default PaymentGatewayBadge;
