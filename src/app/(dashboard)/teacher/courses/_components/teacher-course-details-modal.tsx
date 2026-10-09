"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Coins,
  GraduationCap,
  Layers,
  ArrowRight,
  Eye,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { CourseOfferingItem } from "@/types";

interface TeacherCourseDetailsModalProps {
  offering: CourseOfferingItem;
  trigger?: React.ReactNode;
}

export function TeacherCourseDetailsModal({
  offering,
  trigger,
}: TeacherCourseDetailsModalProps) {
  const [open, setOpen] = React.useState(false);

  const course = offering.course;
  const semester = offering.semester;
  const enrolledCount = offering._count?.enrollments ?? 0;
  const capacity = offering.capacity || 1;
  const fillPercentage = Math.min(
    100,
    Math.round((enrolledCount / capacity) * 100)
  );
  const isFull = enrolledCount >= capacity;

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      title="View Course Details"
    >
      <Eye />
      <span className="sr-only">View course details</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Course Offering Details"
      description="Detailed academic curriculum, enrolled seat metrics, and semester schedule."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      <div className="space-y-4 text-xs">
        {/* Course Header Banner */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {course.code}
            </Badge>
            <Badge variant="default" size="sm">
              {course.credits} Credits
            </Badge>
            <Badge variant="secondary" size="sm">
              Section {offering.section}
            </Badge>
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {course.title}
          </h3>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Semester & Term */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-3">
            <Calendar className="size-4 shrink-0 text-primary" />
            <div>
              <p className="text-muted-foreground">Academic Term</p>
              <p className="font-semibold text-foreground">
                {semester.name} {semester.year}
              </p>
            </div>
          </div>

          {/* Tuition Fee */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-3">
            <Coins className="size-4 shrink-0 text-primary" />
            <div>
              <p className="text-muted-foreground">Tuition Fee</p>
              <p className="font-semibold text-foreground font-mono">
                ৳{Number(offering.fee).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Semester Dates */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-3">
            <Layers className="size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Semester Duration</p>
              <p className="font-medium text-foreground">
                {semester.startDate ? formatDate(semester.startDate) : "—"} to{" "}
                {semester.endDate ? formatDate(semester.endDate) : "—"}
              </p>
            </div>
          </div>

          {/* Faculty Assignment */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-3">
            <GraduationCap className="size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Faculty Instructor</p>
              <p className="font-medium text-foreground">
                {offering.teacher?.name ?? "Assigned Faculty"}
              </p>
            </div>
          </div>
        </div>

        {/* Seat Capacity & Enrollment Progress */}
        <div className="space-y-2 rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" />
              Class Enrollment Capacity
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-foreground">
                {enrolledCount} / {capacity}
              </span>
              <Badge
                variant={isFull ? "destructive" : "success"}
                size="sm"
              >
                {isFull ? "Full" : `${fillPercentage}%`}
              </Badge>
            </div>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all ${
                isFull ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            {capacity - enrolledCount > 0
              ? `${capacity - enrolledCount} seat(s) remaining for registration.`
              : "This course section is currently at full capacity."}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end pt-2 border-t border-border">
          <Button
            size="sm"
            render={<Link href={`/teacher/grades?offeringId=${offering.id}`} />}
          >
            Enter Grades
            <ArrowRight />
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default TeacherCourseDetailsModal;
