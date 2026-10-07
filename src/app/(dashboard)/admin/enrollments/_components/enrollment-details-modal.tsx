"use client";

import * as React from "react";
import {
  Eye,
  Calendar,
  GraduationCap,
  Clock,
  User,
  Mail,
  CreditCard,
  Building2,
  Hash,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetEnrollmentById } from "@/services";
import { formatDate, getInitials } from "@/lib/utils";
import { EnrollmentStatusBadge } from "./enrollment-status-badge";
import type { EnrollmentItem } from "@/types";

interface EnrollmentDetailsModalProps {
  enrollment: EnrollmentItem;
  trigger?: React.ReactNode;
}

export function EnrollmentDetailsModal({
  enrollment: initialEnrollment,
  trigger,
}: EnrollmentDetailsModalProps) {
  const [open, setOpen] = React.useState(false);

  const { data: response, isLoading } = useGetEnrollmentById(
    initialEnrollment.id,
    open,
  );

  const enrollment = response?.data ?? initialEnrollment;
  const student = enrollment.student;
  const offering = enrollment.courseOffering;
  const course = offering.course;
  const semester = offering.semester;
  const teacher = offering.teacher;
  const payments = enrollment.payments ?? [];

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      title="View Enrollment Details"
    >
      <Eye className="size-3.5" />
      <span className="sr-only">View enrollment details</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Enrollment Record"
      description="Student registration record, course session, faculty, and payment status."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner className="size-6 text-primary" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Banner Card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {course.code}
                  </Badge>
                  <Badge variant="default" size="sm">
                    {course.credits} Credits
                  </Badge>
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="font-mono font-medium"
                  >
                    Section {offering.section}
                  </Badge>
                  <EnrollmentStatusBadge status={enrollment.status} />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {course.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <Clock className="size-3.5" />
                <span>Enrolled {formatDate(enrollment.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="size-3.5 text-primary" />
              <span>Student Information</span>
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
                  <Badge variant="outline" size="sm" className="text-[11px]">
                    Batch {student.studentProfile.batch}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Academic Schedule & Assigned Faculty */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  Timeline: {formatDate(semester.startDate)} -{" "}
                  {formatDate(semester.endDate)}
                </p>
              </div>
            </div>

            {/* Assigned Faculty */}
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <GraduationCap className="size-3.5 text-primary" />
                <span>Course Faculty</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {teacher.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  <a
                    href={`mailto:${teacher.email}`}
                    className="hover:underline hover:text-primary"
                  >
                    {teacher.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Payment & Fee Summary */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <CreditCard className="size-3.5 text-primary" />
                <span>Tuition & Payment History</span>
              </div>
              <span className="text-xs font-medium text-foreground">
                Offering Fee: ৳{offering.fee.toLocaleString()}
              </span>
            </div>

            {payments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-3.5 text-center text-xs text-muted-foreground">
                No payment transactions recorded yet.
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          ৳{p.amount.toLocaleString()}
                        </span>
                        <Badge
                          variant={
                            p.status === "PAID"
                              ? "default"
                              : p.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                          }
                          size="sm"
                          className="text-[10px]"
                        >
                          {p.status}
                        </Badge>
                      </div>
                      {p.transactionId && (
                        <p className="text-[11px] font-mono text-muted-foreground">
                          TxID: {p.transactionId}
                        </p>
                      )}
                    </div>

                    {p.createdAt && (
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

export default EnrollmentDetailsModal;
