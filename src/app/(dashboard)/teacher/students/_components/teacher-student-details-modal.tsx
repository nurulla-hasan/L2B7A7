"use client";

import { useState, type ReactNode } from "react";
import { Eye, GraduationCap, BookOpen, Calendar, Mail, User } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import type { EnrollmentItem } from "@/types";

interface TeacherStudentDetailsModalProps {
  enrollment: EnrollmentItem;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TeacherStudentDetailsModal({
  enrollment,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TeacherStudentDetailsModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const student = enrollment.student;
  const profile = student.studentProfile;
  const offering = enrollment.courseOffering;
  const course = offering.course;
  const semester = offering.semester;

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      title="View Student Details"
    >
      <Eye />
      <span className="sr-only">View Student Details</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Student Enrollment Profile"
      description="Detailed academic registration and contact profile for this enrolled student."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      <div className="space-y-4 pt-1 text-xs">
        {/* Student Profile Header Card */}
        <div className="flex items-center gap-3.5 rounded-xl border border-border bg-muted/40 p-4">
          <Avatar className="size-12 rounded-full border border-border">
            {student.imageUrl && (
              <AvatarImage src={student.imageUrl} alt={student.name} />
            )}
            <AvatarFallback className="font-bold text-sm text-primary">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-sm text-foreground truncate">
                {student.name}
              </h4>
              <Badge
                variant={
                  enrollment.status === "ENROLLED"
                    ? "success"
                    : enrollment.status === "PENDING_PAYMENT"
                    ? "pending"
                    : "destructive"
                }
              >
                {enrollment.status === "ENROLLED"
                  ? "Enrolled"
                  : enrollment.status === "PENDING_PAYMENT"
                  ? "Pending Payment"
                  : "Dropped"}
              </Badge>
            </div>
            <p className="flex items-center gap-1.5 text-muted-foreground truncate">
              <Mail className="size-3.5 shrink-0" />
              {student.email}
            </p>
          </div>
        </div>

        {/* Academic Profile Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <span className="text-2xs text-muted-foreground flex items-center gap-1">
              <User className="size-3" />
              Student Roll ID
            </span>
            <p className="font-mono text-sm font-bold text-foreground">
              {profile?.studentId || "Not Assigned"}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <span className="text-2xs text-muted-foreground flex items-center gap-1">
              <GraduationCap className="size-3" />
              Department & Batch
            </span>
            <p className="text-sm font-semibold text-foreground">
              {profile?.department || "General"}
              {profile?.batch ? ` • Batch ${profile.batch}` : ""}
            </p>
          </div>
        </div>

        {/* Enrolled Course Information Card */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <BookOpen className="size-4 text-primary" />
            <span>Enrolled Course Section</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
            <div>
              <p className="text-2xs text-muted-foreground">Course Title</p>
              <p className="font-medium text-foreground">{course.title}</p>
            </div>
            <div>
              <p className="text-2xs text-muted-foreground">Course Code & Section</p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Badge variant="outline" className="font-mono text-2xs">
                  {course.code}
                </Badge>
                <Badge variant="secondary" className="text-2xs">
                  Section {offering.section}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-2xs text-muted-foreground">Academic Term</p>
              <p className="font-medium text-foreground">
                {semester.name} {semester.year}
              </p>
            </div>
            <div>
              <p className="text-2xs text-muted-foreground">Course Credits</p>
              <p className="font-mono font-medium text-foreground">
                {course.credits} Credits
              </p>
            </div>
          </div>
        </div>

        {/* Enrolled Date */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Registration Timestamp
          </span>
          <span className="font-mono font-medium text-foreground">
            {formatDate(enrollment.createdAt, "dd MMM, yyyy • hh:mm a")}
          </span>
        </div>
      </div>
    </ModalWrapper>
  );
}
