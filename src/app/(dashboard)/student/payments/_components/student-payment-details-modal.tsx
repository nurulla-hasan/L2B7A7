"use client";

import * as React from "react";
import {
  Eye,
  Calendar,
  CreditCard,
  Copy,
  Check,
  GraduationCap,
  Receipt,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useInitiateBkashPayment } from "@/services";
import { errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import type { PaymentItem, PaymentStatus } from "@/types";

interface StudentPaymentDetailsModalProps {
  payment: PaymentItem;
  trigger?: React.ReactNode;
}

function getStatusBadge(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return <Badge variant="success">Paid</Badge>;
    case "PENDING":
      return <Badge variant="warning">Pending Payment</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>;
    case "CANCELLED":
      return <Badge variant="outline">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function StudentPaymentDetailsModal({
  payment,
  trigger,
}: StudentPaymentDetailsModalProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { mutateAsync: initiateBkash, isPending: isInitiating } =
    useInitiateBkashPayment();

  const enrollment = payment.enrollment;
  const offering = enrollment.courseOffering;
  const course = offering.course;
  const semester = offering.semester;
  const teacher = offering.teacher;
  const isPending = payment.status === "PENDING";

  const handleCopyTx = () => {
    if (payment.transactionId) {
      navigator.clipboard.writeText(payment.transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePayNow = async () => {
    try {
      const response = await initiateBkash({ enrollmentId: payment.enrollmentId });
      if (response?.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to initiate bKash payment"));
    }
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Eye />
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Tuition Payment Invoice"
      description="Official tuition fee invoice, payment verification status, and transaction details."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      <div className="space-y-5 py-2">
        {/* Header Summary */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Invoice Reference
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {payment.transactionId}
                </span>
                <Button
                  variant="ghost"
                  onClick={handleCopyTx}
                  title="Copy Transaction ID"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
            {getStatusBadge(payment.status)}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border text-xs text-muted-foreground">
            <span>Created on {formatDate(payment.createdAt)}</span>
            {payment.paidAt && (
              <span>Paid on {formatDate(payment.paidAt)}</span>
            )}
          </div>
        </div>

        {/* Academic Course Info */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Receipt className="size-3.5 text-primary" />
            <span>Course Section Details</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{course.code}</Badge>
              <span className="font-medium text-foreground">
                {course.title}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Section {offering.section} • {course.credits} Credits
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-3.5 text-primary" />
              <span>
                {semester.name} {semester.year}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <GraduationCap className="size-3.5 text-primary" />
              <span>{teacher.name}</span>
            </div>
          </div>
        </div>

        {/* Fee Breakdown & Gateway */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Payment Method</span>
            <Badge variant="outline">bKash Gateway</Badge>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-foreground">
              Total Amount
            </span>
            <span className="font-mono text-lg font-bold text-foreground">
              ৳ {Number(payment.amount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Pay Now Button (if pending) */}
        {isPending && (
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={handlePayNow}
              disabled={isInitiating}
            >
              <CreditCard />
              {isInitiating ? "Connecting to bKash..." : "Pay Now with bKash"}
            </Button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

export default StudentPaymentDetailsModal;
