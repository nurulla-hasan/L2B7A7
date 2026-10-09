"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { PlusCircle, Award, CheckCircle } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  useGetCourseOfferings,
  useGetOfferingEnrollments,
  useSubmitResult,
} from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { calculateGradeFromMarks } from "@/app/(dashboard)/admin/results/_components/result-grade-badge";

interface TeacherSubmitMarksModalProps {
  initialOfferingId?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TeacherSubmitMarksModal({
  initialOfferingId,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TeacherSubmitMarksModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const [offeringId, setOfferingId] = useState<string>(initialOfferingId || "");
  const [enrollmentId, setEnrollmentId] = useState<string>("");
  const [marks, setMarks] = useState<string>("");
  const [published, setPublished] = useState<boolean>(false);

  // Load teacher assigned offerings
  const { data: offeringsRes } = useGetCourseOfferings({ limit: 100 });
  const offerings = offeringsRes?.data ?? [];

  const activeOfferingId = offeringId || initialOfferingId || offerings[0]?.id || "";

  // Load enrollments for chosen offering
  const { data: enrollmentsRes, isLoading: isEnrollmentsLoading } =
    useGetOfferingEnrollments(activeOfferingId, Boolean(activeOfferingId) && open);

  const enrollments = (enrollmentsRes?.data ?? []).filter(
    (e) => e.status !== "DROPPED"
  );

  const { mutate: submitMutation, isPending } = useSubmitResult();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      if (initialOfferingId) setOfferingId(initialOfferingId);
      setEnrollmentId("");
      setMarks("");
      setPublished(false);
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
    if (!isValidMarks || !enrollmentId) return;

    submitMutation(
      {
        enrollmentId,
        marks: numMarks,
        published,
      },
      {
        onSuccess: () => {
          successToast(
            "Grade submitted successfully",
            `Assigned ${numMarks} marks (${gradePreview?.grade}) to student.`
          );
          setOpen(false);
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Failed to submit marks"));
        },
      }
    );
  };

  const defaultTrigger = (
    <Button variant="default" size="sm">
      <PlusCircle />
      Submit Marks
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={handleOpenChange}
      title="Submit Student Grade"
      description="Enter official evaluation marks (0 - 100) for an enrolled student."
      actionTrigger={trigger ?? defaultTrigger}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Course Section Selector */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Course Section</Label>
          <Select
            value={activeOfferingId}
            onValueChange={(val) => {
              if (val) {
                setOfferingId(val);
                setEnrollmentId("");
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select course section">
                {(val) => {
                  const opt = offerings.find((o) => o.id === val);
                  return opt
                    ? `${opt.course.code} (Sec ${opt.section}) • ${opt.course.title}`
                    : "Select section";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {offerings.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.course.code} (Sec {opt.section}) • {opt.course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Student Selector */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Enrolled Student</Label>
          <Select
            value={enrollmentId}
            onValueChange={(val) => {
              if (val) setEnrollmentId(val);
            }}
            disabled={isEnrollmentsLoading || enrollments.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                isEnrollmentsLoading
                  ? "Loading enrolled students..."
                  : enrollments.length === 0
                  ? "No enrolled students found"
                  : "Select student"
              }>
                {(val) => {
                  const item = enrollments.find((e) => e.id === val);
                  return item
                    ? `${item.student.name} (${item.student.studentProfile?.studentId || "No ID"})`
                    : "Select student";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {enrollments.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex flex-col text-left py-0.5">
                    <span className="font-semibold text-foreground">
                      {item.student.name}
                    </span>
                    <span className="text-2xs text-muted-foreground">
                      ID: {item.student.studentProfile?.studentId || "N/A"} • {item.student.email}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Marks Input */}
        <div className="space-y-1.5">
          <Label htmlFor="submit-marks-input" className="text-sm font-medium">
            Evaluation Marks (0 – 100)
          </Label>
          <Input
            id="submit-marks-input"
            type="number"
            step="0.5"
            min="0"
            max="100"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="e.g. 85.5"
            required
            className="font-mono text-base"
          />
          {!isValidMarks && marks !== "" && (
            <p className="text-xs text-destructive">
              Marks must be a valid number between 0 and 100.
            </p>
          )}
        </div>

        {/* Grade Preview */}
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

        {/* Publish Immediately Toggle */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
          <Checkbox
            id="publish-submit-check"
            checked={published}
            onCheckedChange={(val) => setPublished(Boolean(val))}
            className="mt-0.5"
          />
          <div className="space-y-0.5 flex-1">
            <Label
              htmlFor="publish-submit-check"
              className="text-xs font-medium cursor-pointer text-foreground"
            >
              Publish Immediately
            </Label>
            <p className="text-2xs text-muted-foreground">
              If left unchecked, this result is saved as a <strong>Draft</strong> and
              can be published anytime before final semester deadline.
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
            loadingText="Submitting..."
            disabled={!isValidMarks || !enrollmentId}
          >
            <CheckCircle />
            {published ? "Submit & Publish" : "Save as Draft"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
