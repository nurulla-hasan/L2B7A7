"use client";

import * as React from "react";
import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { PaymentItem, PaymentStatus } from "@/types";

interface StudentOverviewRecentPaymentsProps {
  payments: PaymentItem[];
  isLoading?: boolean;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "PAID":
      return <Badge variant="success">Paid</Badge>;
    case "PENDING":
      return <Badge variant="warning">Pending</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>;
    case "CANCELLED":
      return <Badge variant="outline">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function StudentOverviewRecentPayments({
  payments,
  isLoading,
}: StudentOverviewRecentPaymentsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Recent Tuition Payments
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest bKash checkout receipts and invoices
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/student/payments" />}
        >
          View All Invoices
          <ArrowRight />
        </Button>
      </CardHeader>

      <CardContent>
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <CreditCard className="size-5" />
            </div>
            <p className="text-xs text-muted-foreground">
              No payment transactions recorded yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {payments.slice(0, 4).map((p) => {
              const offering = p.enrollment?.courseOffering;

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {p.transactionId}
                      </span>
                      {offering?.course?.code && (
                        <Badge variant="outline">{offering.course.code}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(p.createdAt)} • bKash Gateway
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      ৳ {Number(p.amount).toLocaleString()}
                    </span>
                    <PaymentStatusBadge status={p.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
