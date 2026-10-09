"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Edit2, Award, CheckCircle } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUpdateResult } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { getInitials } from "@/lib/utils";
import { calculateGradeFromMarks } from "@/app/(dashboard)/admin/results/_components/result-grade-badge";
import type { ResultItem } from "@/types";

interface TeacherEditMarksModalProps {
  result: ResultItem;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TeacherEditMarksModal({
  result,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TeacherEditMarksModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const [marks, setMarks] = useState<string>(String(result.marks));
  const [published, setPublished] = useState<boolean>(result.published);

  const { mutate: updateMutation, isPending } = useUpdateResult();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setMarks(String(result.marks));
      setPublished(result.published);
    }
  };

  const numMarks = Number(marks);
  const isValidMarks =
    marks.trim() !== "" &&
    !Number.isNaN(numMarks) &&
    numMarks >= 0 &&
    numMarks <= 100;
  const gradePreview = isValidMarks ? calculateGradeFromMarks(numMarks) : null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidMarks) return;

    updateMutation(
      {
        id: result.id,
        payload: {
          marks: numMarks,
          published,
        },
      },
      {
        onSuccess: () => {
          successToast(
            "Marks updated successfully",
            `Result for ${result.enrollment?.student?.name || "Student"} updated to ${numMarks} (${gradePreview?.grade}).`
          );
          setOpen(false);
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Failed to update grade"));
        },
      }
    );
  };

  const student = result.enrollment?.student;
  const course = result.enrollment?.courseOffering?.course;
  const section = result.enrollment?.courseOffering?.section;

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Edit2 />
      Edit Marks
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Student Marks"
      description="Update evaluated marks or publish/unpublish result status."
      actionTrigger={trigger ?? defaultTrigger}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Student Overview Header */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
          <Avatar className="size-10 rounded-full border border-border">
            <AvatarImage
              src={student?.imageUrl ?? undefined}
              alt={student?.name || "Student"}
            />
            <AvatarFallback className="font-semibold text-xs text-primary">
              {getInitials(student?.name || "Student")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground truncate">
                {student?.name || "Student"}
              </p>
              {student?.studentProfile?.studentId && (
                <Badge variant="outline" className="font-mono text-2xs">
                  {student.studentProfile.studentId}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {student?.email}
            </p>
            {course && (
              <p className="text-2xs text-muted-foreground font-mono">
                {course.code} (Sec {section}) • {course.title}
              </p>
            )}
          </div>
        </div>

        {/* Current status summary */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2.5 text-xs">
          <span className="text-muted-foreground">Current Status</span>
          <Badge variant={result.published ? "success" : "pending"}>
            {result.published ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Marks Input Field */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-marks-input" className="text-sm font-medium">
            Evaluation Marks (0 – 100)
          </Label>
          <Input
            id="edit-marks-input"
            type="number"
            step="0.5"
            min="0"
            max="100"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="e.g. 90"
            required
            autoFocus
            className="font-mono text-base"
          />
          {!isValidMarks && marks !== "" && (
            <p className="text-xs text-destructive">
              Marks must be a valid number between 0 and 100.
            </p>
          )}
        </div>

        {/* Live Grade Preview Box */}
        {gradePreview && (
          <div className="rounded-xl border border-border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Calculated Letter Grade</span>
              <Award className="size-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">
                  {gradePreview.grade}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  GPA {gradePreview.gradePoint.toFixed(2)}
                </span>
              </div>
              <Badge
                variant={gradePreview.grade === "F" ? "destructive" : "default"}
              >
                {gradePreview.grade === "F" ? "Failing Mark" : "Passing Grade"}
              </Badge>
            </div>
          </div>
        )}

        {/* Publish / Visible to Student Toggle */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
          <Checkbox
            id="edit-publish-toggle"
            checked={published}
            onCheckedChange={(val) => setPublished(Boolean(val))}
            className="mt-0.5"
          />
          <div className="space-y-0.5 flex-1">
            <Label
              htmlFor="edit-publish-toggle"
              className="text-xs font-medium cursor-pointer text-foreground"
            >
              Published to Student Portal
            </Label>
            <p className="text-2xs text-muted-foreground">
              When checked, this result is visible to the student. When unchecked, it
              remains in faculty draft mode.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isPending}
            loadingText="Updating..."
            disabled={!isValidMarks}
          >
            <CheckCircle />
            Save Changes
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
