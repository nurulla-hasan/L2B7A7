import * as React from "react";
import {
  CalendarPlus,
  BookOpen,
  Layers,
  UserCheck,
  UserMinus,
  CreditCard,
  FileSpreadsheet,
  CheckCircle2,
  UserCog,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AuditActionType } from "@/types";

interface ActionConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}

const ACTION_CONFIGS: Record<AuditActionType, ActionConfig> = {
  CREATE_SEMESTER: {
    label: "Create Semester",
    icon: CalendarPlus,
    className:
      "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  },
  CREATE_COURSE: {
    label: "Create Course",
    icon: BookOpen,
    className:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  },
  CREATE_COURSE_OFFERING: {
    label: "New Offering",
    icon: Layers,
    className:
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
  ENROLL_COURSE: {
    label: "Enroll Course",
    icon: UserCheck,
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  DROP_COURSE: {
    label: "Drop Course",
    icon: UserMinus,
    className:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
  PAYMENT_SUCCESS: {
    label: "Payment Success",
    icon: CreditCard,
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  SUBMIT_RESULT: {
    label: "Submit Marks",
    icon: FileSpreadsheet,
    className:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  PUBLISH_RESULT: {
    label: "Publish Result",
    icon: CheckCircle2,
    className:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
  UPDATE_USER_STATUS: {
    label: "Update Status",
    icon: UserCog,
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
};

export function AuditActionBadge({
  action,
  className,
}: {
  action: AuditActionType;
  className?: string;
}) {
  const config = ACTION_CONFIGS[action] || {
    label: action,
    icon: Shield,
    className: "bg-muted text-muted-foreground border-border",
  };

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium text-xs px-2.5 py-0.5 border shadow-2xs",
        config.className,
        className
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span>{config.label}</span>
    </Badge>
  );
}

export default AuditActionBadge;
