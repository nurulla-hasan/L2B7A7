"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { DataTable } from "@/components/common/data-table";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStateFilter } from "@/hooks";
import {
  useGetMyPayments,
  useGetMyEnrollments,
  useInitiateBkashPayment,
} from "@/services";
import { getErrorMessage } from "@/lib/error";
import { errorToast } from "@/lib/toast";
import type { EnrollmentItem, PaymentStatus } from "@/types";
import { studentPaymentColumns } from "./student-payment-column";

const STATUS_OPTIONS: { label: string; value: PaymentStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function PendingEnrollmentDues({
  enrollments,
}: {
  enrollments: EnrollmentItem[];
}) {
  const { mutateAsync: initiateBkash, isPending: isInitiating } =
    useInitiateBkashPayment();

  if (enrollments.length === 0) return null;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-foreground">
              Unpaid Course Registrations
            </h4>
            <Badge variant="warning">{enrollments.length} Pending</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete tuition fee payment via bKash to confirm your enrolled course seats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((item) => {
          const offering = item.courseOffering;
          const course = offering.course;
          const fee = Number(offering.fee);

          const handlePay = async () => {
            try {
              const res = await initiateBkash({ enrollmentId: item.id });
              if (res?.data?.paymentUrl) {
                window.location.href = res.data.paymentUrl;
              }
            } catch (err) {
              errorToast(getErrorMessage(err, "Failed to initiate bKash payment"));
            }
          };

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between space-y-3 rounded-lg border border-border bg-background p-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{course.code}</Badge>
                  <span className="font-mono text-base font-bold text-foreground">
                    ৳ {fee.toLocaleString()}
                  </span>
                </div>
                <h5 className="line-clamp-1 font-medium text-foreground">
                  {course.title}
                </h5>
                <p className="text-xs text-muted-foreground">
                  Sec {offering.section} • {course.credits} Credits • {offering.semester.name}{" "}
                  {offering.semester.year}
                </p>
              </div>

              <ConfirmationModal
                title="Pay Tuition Fee"
                description={`Pay tuition fee of ৳${fee.toLocaleString()} for ${course.code} (${course.title}) Section ${offering.section} via secure bKash checkout.`}
                confirmText="Pay with bKash"
                isLoading={isInitiating}
                onConfirm={handlePay}
                trigger={
                  <Button className="w-full">
                    <CreditCard />
                    Pay Fee (৳ {fee.toLocaleString()})
                  </Button>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StudentPaymentList() {
  const filter = useStateFilter();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMyPayments(filter.filters);

  const {
    data: pendingEnrollmentsRes,
    isLoading: isPendingLoading,
  } = useGetMyEnrollments({ status: "PENDING_PAYMENT", limit: 50 });

  const payments = response?.data ?? [];
  const meta = response?.meta;
  const pendingEnrollments = pendingEnrollmentsRes?.data ?? [];

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Tuition Fee Payments"
        description="Review tuition fee invoices, examine payment verification records, and pay pending fees via bKash."
        alignment="left"
        as="h3"
      >
        <Select
          value={filter.getFilter("status")}
          onValueChange={(val) =>
            filter.updateFilter("status", !val || val === "all" ? null : val)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status">
              {(val) =>
                STATUS_OPTIONS.find((opt) => opt.value === val)?.label ||
                "All Statuses"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SectionHeading>

      {/* Unpaid Pending Course Enrollments */}
      {!isPendingLoading && pendingEnrollments.length > 0 && (
        <PendingEnrollmentDues enrollments={pendingEnrollments} />
      )}

      {/* Payments DataTable */}
      <DataTable
        columns={studentPaymentColumns}
        data={payments}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(error, "Failed to load payment records")}
        onRetry={refetch}
      />
    </div>
  );
}

export default StudentPaymentList;
