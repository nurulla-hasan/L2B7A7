"use client";

import * as React from "react";
import {
  Calendar,
  CreditCard,
  Eye,
  GraduationCap,
  Mail,
  Users,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { EnrollmentItem } from "@/types";

interface CourseDetailsModalProps {
  enrollment: EnrollmentItem;
  trigger?: React.ReactNode;
}

export function CourseDetailsModal({
  enrollment,
  trigger,
}: CourseDetailsModalProps) {
  const [open, setOpen] = React.useState(false);

  const offering = enrollment.courseOffering;
  const course = offering.course;
  const semester = offering.semester;
  const teacher = offering.teacher;
  const payments = enrollment.payments ?? [];

  const defaultTrigger = (
    <Button
      variant="outline"
      title="View Course Details"
    >
      <Eye />
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Course Enrollment Details"
      description="Detailed syllabus, academic session, faculty contact, and payment history."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      <div className="space-y-4 text-xs">
        {/* Course Banner */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {course.code}
            </Badge>
            <Badge variant="default" size="sm">
              {course.credits} Credits
            </Badge>
            <Badge variant="secondary" size="sm">
              Section {offering.section}
            </Badge>
            <Badge
              variant={
                enrollment.status === "ENROLLED"
                  ? "success"
                  : enrollment.status === "PENDING_PAYMENT"
                    ? "warning"
                    : "destructive"
              }
              size="sm"
            >
              {enrollment.status.replace("_", " ")}
            </Badge>
          </div>

          <h3 className="text-base font-semibold text-foreground pt-1">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            Enrolled on {formatDate(enrollment.createdAt)}
          </p>
        </div>

        {/* Academic Term & Section Capacity */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Calendar className="size-3.5 text-primary" />
              <span>Academic Term</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {semester.name} {semester.year}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Users className="size-3.5 text-primary" />
              <span>Section Capacity</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Section {offering.section}
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum {offering.capacity} Students
              </p>
            </div>
          </div>
        </div>

        {/* Course Faculty */}
        <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <GraduationCap className="size-3.5 text-primary" />
            <span>Course Faculty</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {teacher.name}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3 text-primary" />
              <a
                href={`mailto:${teacher.email}`}
                className="hover:underline hover:text-primary"
              >
                {teacher.email}
              </a>
            </div>
          </div>
        </div>

        {/* Tuition Fee & Payment History */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <CreditCard className="size-3.5 text-primary" />
              <span>Tuition & Payment History</span>
            </div>
            <span className="font-mono text-sm font-bold text-foreground">
              ৳ {offering.fee ? Number(offering.fee).toLocaleString() : "0"}
            </span>
          </div>

          {payments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
              {enrollment.status === "PENDING_PAYMENT"
                ? "Tuition payment pending."
                : "No payment transactions recorded."}
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">
                      ৳ {Number(p.amount).toLocaleString()}
                    </span>
                    {p.transactionId && (
                      <p className="font-mono text-[11px] text-muted-foreground">
                        TxID: {p.transactionId}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      p.status === "PAID"
                        ? "default"
                        : p.status === "FAILED"
                          ? "destructive"
                          : p.status === "PENDING"
                            ? "warning"
                            : "outline"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

export default CourseDetailsModal;
