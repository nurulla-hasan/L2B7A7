import * as React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResultStatusBadgeProps {
  published: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ResultStatusBadge({
  published,
  size = "sm",
  className,
}: ResultStatusBadgeProps) {
  if (published) {
    return (
      <Badge
        variant="default"
        size={size}
        className={`gap-1.5 ${className ?? ""}`}
      >
        <CheckCircle2 className="size-3" />
        Published
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      size={size}
      className={`gap-1.5 ${className ?? ""}`}
    >
      <Clock className="size-3 text-muted-foreground" />
      Draft (Unpublished)
    </Badge>
  );
}

export default ResultStatusBadge;
