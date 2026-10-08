"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { EnrollmentItem } from "@/types";

interface StudentOverviewPendingAlertProps {
  pendingEnrollments: EnrollmentItem[];
}

export function StudentOverviewPendingAlert({
  pendingEnrollments,
}: StudentOverviewPendingAlertProps) {
  if (pendingEnrollments.length === 0) return null;

  const totalDue = pendingEnrollments.reduce(
    (sum, e) => sum + Number(e.courseOffering?.fee ?? 0),
    0
  );

  const courseCodes = pendingEnrollments
    .map((e) => e.courseOffering?.course?.code)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-amber-500/5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
          <AlertCircle className="size-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-foreground">
            Pending Tuition Fee Notice
          </h4>
          <p className="text-xs text-muted-foreground">
            You have outstanding tuition fees of{" "}
            <strong className="font-mono text-foreground">
              ৳ {totalDue.toLocaleString()}
            </strong>{" "}
            for {courseCodes}. Please clear the balance via bKash to confirm your
            registered course seats.
          </p>
        </div>
      </div>

      <Button
        size="sm"
        className="shrink-0"
        render={<Link href="/student/payments" />}
      >
        <CreditCard />
        Pay Tuition Fees
        <ArrowRight />
      </Button>
    </div>
  );
}
