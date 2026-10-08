"use client";

import * as React from "react";
import {
  Eye,
  GraduationCap,
  Award,
  User,
  CheckCircle2,
  XCircle,
  Printer,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getGradePoint } from "./student-result-summary-cards";
import type { ResultItem } from "@/types";

interface StudentResultDetailsModalProps {
  result: ResultItem;
  trigger?: React.ReactNode;
}

export function StudentResultDetailsModal({
  result,
  trigger,
}: StudentResultDetailsModalProps) {
  const [open, setOpen] = React.useState(false);

  const enrollment = result.enrollment;
  const offering = enrollment?.courseOffering;
  const course = offering?.course;
  const semester = offering?.semester;
  const teacher = result.teacher;
  const student = enrollment?.student;
  const profile = student?.studentProfile;

  const gradePoint = getGradePoint(result.grade);
  const isPassed = result.grade !== "F";

  const handlePrint = () => {
    window.print();
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      title="View Grade Sheet"
    >
      <Eye />
      <span className="sr-only">View Grade Sheet</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Official Grade Sheet"
      description="Institutional academic evaluation record and examination score summary."
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      <div className="space-y-6 pt-1">
        {/* Top Score Banner */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="size-8" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{course?.code ?? "COURSE"}</Badge>
                  <Badge variant={isPassed ? "success" : "destructive"}>
                    {isPassed ? (
                      <>
                        <CheckCircle2 className="size-3" /> Passed
                      </>
                    ) : (
                      <>
                        <XCircle className="size-3" /> Failed
                      </>
                    )}
                  </Badge>
                </div>
                <h4 className="font-heading text-lg font-semibold text-foreground">
                  {course?.title ?? "Course Examination"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {course?.credits ?? 3} Credit Hours • Section{" "}
                  {offering?.section ?? "A"} • {semester?.name ?? "Semester"}{" "}
                  {semester?.year ?? ""}
                </p>
              </div>
            </div>

            {/* Grade Display */}
            <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-3 sm:flex-col sm:items-end sm:gap-1">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Final Grade
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-extrabold text-foreground">
                  {result.grade}
                </span>
                <span className="font-mono text-sm font-semibold text-muted-foreground">
                  ({gradePoint.toFixed(2)} GP)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Score & Evaluation Breakdown */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Examination Marks Breakdown
          </h5>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-background p-3">
              <span className="text-xs text-muted-foreground">Marks Obtained</span>
              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                {result.marks} <span className="text-xs text-muted-foreground">/ 100</span>
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <span className="text-xs text-muted-foreground">Letter Grade</span>
              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                {result.grade}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <span className="text-xs text-muted-foreground">Grade Point</span>
              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                {gradePoint.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <span className="text-xs text-muted-foreground">Credits Earned</span>
              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                {isPassed ? (course?.credits ?? 3) : 0}{" "}
                <span className="text-xs text-muted-foreground">
                  / {course?.credits ?? 3}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Student & Course Academic Metadata */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Student Identity */}
          <div className="space-y-2 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <User className="size-3.5" /> Student Information
            </div>
            <div className="space-y-1.5 pt-1 text-sm">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">
                  {student?.name ?? "Student"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Student ID:</span>
                <span className="font-mono text-xs font-medium text-foreground">
                  {profile?.studentId ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Department:</span>
                <span className="text-xs text-foreground">
                  {profile?.department ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Email:</span>
                <span className="text-xs text-muted-foreground truncate max-w-40">
                  {student?.email ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Instructor & Verification */}
          <div className="space-y-2 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <GraduationCap className="size-3.5" /> Evaluated By
            </div>
            <div className="space-y-1.5 pt-1 text-sm">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Instructor:</span>
                <span className="font-medium text-foreground">
                  {teacher?.name ?? "Assigned Faculty"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Email:</span>
                <span className="text-xs text-muted-foreground truncate max-w-40">
                  {teacher?.email ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Published On:</span>
                <span className="text-xs text-foreground">
                  {result.publishedAt ? formatDate(result.publishedAt) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Badge variant="outline">Verified & Published</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" onClick={handlePrint}>
            <Printer />
            Print Grade Sheet
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
