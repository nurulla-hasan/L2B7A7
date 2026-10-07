"use client";

import * as React from "react";
import {
  Eye,
  GraduationCap,
  Clock,
  User,
  Mail,
  Award,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetResultById } from "@/services";
import { formatDate, getInitials } from "@/lib/utils";
import { getGradePoint } from "./result-grade-badge";
import { ResultStatusBadge } from "./result-status-badge";
import type { ResultItem } from "@/types";

interface ResultDetailsModalProps {
  result: ResultItem;
  trigger?: React.ReactNode;
}

export function ResultDetailsModal({
  result: initialResult,
  trigger,
}: ResultDetailsModalProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const { data: response, isLoading } = useGetResultById(
    initialResult.id,
    open
  );

  const result = response?.data ?? initialResult;
  const enrollment = result.enrollment;
  const student = enrollment?.student;
  const offering = enrollment?.courseOffering;
  const course = offering?.course;
  const semester = offering?.semester;
  const teacher = result.teacher;
  const gradePoint = getGradePoint(result.grade);

  const handleCopyId = () => {
    if (result.id) {
      navigator.clipboard.writeText(result.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      title="View Details"
    >
      <Eye />
      <span className="sr-only">View result details</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Examination Scorecard"
      description="Official student academic performance and grading evaluation record."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      {isLoading ? (
        <div className="flex h-56 flex-col items-center justify-center gap-3">
          <Spinner className="size-6 text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading scorecard details...
          </p>
        </div>
      ) : (
        <div className="space-y-6 pt-1">
          {/* Top Grade Highlight Banner */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted/40 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Award className="size-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Final Evaluation
                    </span>
                    <ResultStatusBadge published={result.published} size="sm" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">
                      {result.marks}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      / 100 Marks
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-3 sm:border-0 sm:pt-0">
                <div className="rounded-lg border border-border bg-card px-3.5 py-2 text-center">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Letter Grade
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {result.grade}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card px-3.5 py-2 text-center">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Grade Point (GPA)
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {gradePoint.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <User className="size-3.5" />
              Student Information
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-14 border border-border">
                {student?.imageUrl ? (
                  <AvatarImage
                    src={student.imageUrl}
                    alt={student.name ?? "Student"}
                  />
                ) : null}
                <AvatarFallback className="bg-primary/10 font-bold text-primary">
                  {getInitials(student?.name || "Student")}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {student?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Student ID</p>
                  <p className="font-mono text-sm font-medium text-foreground">
                    {student?.studentProfile?.studentId || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>{student?.email || "N/A"}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Department & Batch</p>
                  <p className="text-sm text-foreground">
                    {student?.studentProfile?.department
                      ? `${student.studentProfile.department} (Batch ${student.studentProfile.batch})`
                      : "General Academic"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course & Faculty Specs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Course Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <BookOpen className="size-3.5" />
                Course Details
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Course Title</p>
                  <p className="font-medium text-foreground">
                    {course?.title || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {course?.code || "N/A"}
                  </Badge>
                  {offering?.section && (
                    <Badge variant="secondary" className="text-xs">
                      Sec {offering.section}
                    </Badge>
                  )}
                  {course?.credits && (
                    <span className="text-xs text-muted-foreground">
                      {course.credits} Credits
                    </span>
                  )}
                </div>
                {semester && (
                  <div>
                    <p className="text-xs text-muted-foreground">Semester Term</p>
                    <p className="text-sm text-foreground">
                      {semester.name} {semester.year}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Evaluator Faculty Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <GraduationCap className="size-3.5" />
                Evaluating Faculty
              </div>

              <div className="space-y-2.5 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Teacher Name</p>
                  <p className="font-medium text-foreground">
                    {teacher?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Faculty Contact</p>
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>{teacher?.email || "N/A"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    Course Instructor Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit & Timestamps */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="size-3.5" />
              Audit Timestamps & Record ID
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div>
                <p className="text-muted-foreground">Created / Evaluated</p>
                <p className="mt-0.5 font-medium text-foreground">
                  {formatDate(result.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Published Date</p>
                <p className="mt-0.5 font-medium text-foreground">
                  {result.publishedAt ? formatDate(result.publishedAt) : "Pending release"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Record ID</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="font-mono text-muted-foreground">
                    {result.id.slice(0, 10)}...
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopyId}
                    className="size-5 cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Copy Result ID"
                  >
                    {copied ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

export default ResultDetailsModal;
