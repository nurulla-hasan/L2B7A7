"use client";

import * as React from "react";
import {
  Eye,
  Calendar,
  GraduationCap,
  Clock,
  User,
  Mail,
  Phone,
  CreditCard,
  Building2,
  Hash,
  Copy,
  Check,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetPaymentById } from "@/services";
import { formatDate, getInitials } from "@/lib/utils";
import { PaymentStatusBadge } from "./payment-status-badge";
import { PaymentGatewayBadge } from "./payment-gateway-badge";
import type { PaymentItem } from "@/types";

interface PaymentDetailsModalProps {
  payment: PaymentItem;
  trigger?: React.ReactNode;
}

export function PaymentDetailsModal({
  payment: initialPayment,
  trigger,
}: PaymentDetailsModalProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const { data: response, isLoading } = useGetPaymentById(
    initialPayment.id,
    open
  );

  const payment = response?.data ?? initialPayment;
  const enrollment = payment.enrollment;
  const student = enrollment.student;
  const offering = enrollment.courseOffering;
  const course = offering.course;
  const semester = offering.semester;
  const teacher = offering.teacher;

  const handleCopyTx = () => {
    if (payment.transactionId) {
      navigator.clipboard.writeText(payment.transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      title="View Payment Receipt"
    >
      <Eye />
      <span className="sr-only">View payment details</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Payment Receipt & Audit"
      description="Detailed financial transaction record, student identity, and gateway metadata."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner className="size-6 text-primary" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Receipt Banner Card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    ৳{payment.amount.toLocaleString()}
                  </span>
                  <PaymentStatusBadge status={payment.status} />
                  <PaymentGatewayBadge gateway={payment.gateway} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    TxID: {payment.transactionId}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={handleCopyTx}
                    title="Copy Transaction ID"
                  >
                    {copied ? (
                      <Check className="size-3 text-primary" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    <span className="sr-only">Copy TxID</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <Clock className="size-3.5" />
                <span>
                  {payment.paidAt
                    ? `Paid on ${formatDate(payment.paidAt)}`
                    : `Initiated on ${formatDate(payment.createdAt)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="size-3.5 text-primary" />
              <span>Student Account</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar size="lg">
                {student.imageUrl && (
                  <AvatarImage src={student.imageUrl} alt={student.name} />
                )}
                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
              </Avatar>

              <div className="space-y-1 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {student.name}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3 shrink-0" />
                  <a
                    href={`mailto:${student.email}`}
                    className="hover:underline hover:text-primary"
                  >
                    {student.email}
                  </a>
                </div>
                {student.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="size-3 shrink-0" />
                    <a
                      href={`tel:${student.phone}`}
                      className="hover:underline hover:text-primary"
                    >
                      {student.phone}
                    </a>
                  </div>
                )}
              </div>

              {student.studentProfile && (
                <div className="flex flex-wrap items-center gap-2 border-t sm:border-t-0 sm:border-l border-border pt-2 sm:pt-0 sm:pl-4 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Hash className="size-3 text-primary" />
                    <span>ID: {student.studentProfile.studentId}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Building2 className="size-3 text-primary" />
                    <span>Dept: {student.studentProfile.department}</span>
                  </div>
                  {student.studentProfile.batch && (
                    <Badge variant="outline" size="sm" className="text-[11px]">
                      Batch {student.studentProfile.batch}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enrolled Course & Academic Session */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Course & Section */}
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <GraduationCap className="size-3.5 text-primary" />
                <span>Course & Section</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" className="font-mono text-xs">
                    {course.code}
                  </Badge>
                  <Badge variant="secondary" size="sm" className="font-mono text-xs">
                    Sec {offering.section}
                  </Badge>
                  <Badge variant="outline" size="sm" className="text-xs">
                    {course.credits} Credits
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {course.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Faculty: {teacher.name} ({teacher.email})
                </p>
              </div>
            </div>

            {/* Semester Details */}
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Calendar className="size-3.5 text-primary" />
                <span>Academic Semester</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {semester.name} {semester.year}
                </p>
                <p className="text-xs text-muted-foreground">
                  Regular Academic Cohort Session
                </p>
              </div>
            </div>
          </div>

          {/* Gateway Audit Metadata */}
          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <CreditCard className="size-3.5 text-primary" />
              <span>Gateway Audit Record</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-border bg-muted/30 p-2.5 space-y-0.5">
                <span className="text-muted-foreground text-[11px]">Gateway Provider</span>
                <p className="font-medium text-foreground">{payment.gateway}</p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-2.5 space-y-0.5">
                <span className="text-muted-foreground text-[11px]">Gateway Payment ID</span>
                <p className="font-mono text-[11px] text-foreground">
                  {payment.bkashPaymentId || "N/A"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-2.5 space-y-0.5">
                <span className="text-muted-foreground text-[11px]">System Transaction ID</span>
                <p className="font-mono text-[11px] text-foreground">
                  {payment.transactionId}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-2.5 space-y-0.5">
                <span className="text-muted-foreground text-[11px]">Created Timestamp</span>
                <p className="text-[11px] text-foreground">
                  {formatDate(payment.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

export default PaymentDetailsModal;
