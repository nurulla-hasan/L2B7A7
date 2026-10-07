import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { EnrollmentStatus } from "@/types";

interface EnrollmentStatusBadgeProps {
  status: EnrollmentStatus;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function EnrollmentStatusBadge({
  status,
  size = "sm",
  className,
}: EnrollmentStatusBadgeProps) {
  switch (status) {
    case "ENROLLED":
      return (
        <Badge variant="default" size={size} className={className}>
          Enrolled
        </Badge>
      );
    case "PENDING_PAYMENT":
      return (
        <Badge variant="secondary" size={size} className={className}>
          Pending Payment
        </Badge>
      );
    case "DROPPED":
      return (
        <Badge variant="destructive" size={size} className={className}>
          Dropped
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

export default EnrollmentStatusBadge;
