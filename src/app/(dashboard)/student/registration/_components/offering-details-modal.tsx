"use client";

import * as React from "react";
import {
  Eye,
  Calendar,
  GraduationCap,
  Mail,
  Users,
  Banknote,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { CourseOfferingItem } from "@/types";

interface OfferingDetailsModalProps {
  offering: CourseOfferingItem;
  trigger?: React.ReactNode;
}

export function OfferingDetailsModal({
  offering,
  trigger,
}: OfferingDetailsModalProps) {
  const [open, setOpen] = React.useState(false);

  const course = offering.course;
  const semester = offering.semester;
  const teacher = offering.teacher;

  const enrolled = offering._count?.enrollments ?? 0;
  const capacity = offering.capacity;
  const remaining = Math.max(0, capacity - enrolled);
  const isFull = remaining === 0;

  const defaultTrigger = (
    <Button variant="outline">
      <Eye />
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title={`${course.code} - Section ${offering.section}`}
      description="Detailed course offering syllabus, instructor profile, and seat availability."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      <div className="space-y-5 py-2">
        {/* Header Summary */}
        <div className="space-y-1.5 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{course.code}</Badge>
            <Badge variant="secondary">{course.credits} Credits</Badge>
            <Badge variant={isFull ? "destructive" : "success"}>
              {isFull ? "Class Full" : `${remaining} Seats Available`}
            </Badge>
          </div>

          <h3 className="text-base font-semibold text-foreground pt-1">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            Section {offering.section} • {semester.name} {semester.year}
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
              <span>Seat Allocation</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {enrolled} / {capacity} Enrolled
              </p>
              <p className="text-xs text-muted-foreground">
                {isFull ? "No seats left" : `${remaining} seats remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* Course Instructor */}
        <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <GraduationCap className="size-3.5 text-primary" />
            <span>Assigned Instructor</span>
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

        {/* Tuition Fee */}
        <div className="rounded-xl border border-border bg-muted/40 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Tuition Fee
            </span>
          </div>
          <span className="font-mono text-base font-bold text-foreground">
            ৳ {offering.fee ? Number(offering.fee).toLocaleString() : "0"}
          </span>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default OfferingDetailsModal;
