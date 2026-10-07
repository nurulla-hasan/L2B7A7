"use client";

import * as React from "react";
import { Edit2, Award } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateResult } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { calculateGradeFromMarks } from "./result-grade-badge";
import type { ResultItem } from "@/types";

interface ResultEditModalProps {
  result: ResultItem;
  trigger?: React.ReactNode;
}

export function ResultEditModal({ result, trigger }: ResultEditModalProps) {
  const [open, setOpen] = React.useState(false);
  const [marks, setMarks] = React.useState<string>(String(result.marks));
  const [published, setPublished] = React.useState<boolean>(result.published);

  const updateMutation = useUpdateResult();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setMarks(String(result.marks));
      setPublished(result.published);
    }
  };

  const numMarks = Number(marks);
  const isValidMarks =
    !Number.isNaN(numMarks) && numMarks >= 0 && numMarks <= 100;
  const gradePreview = isValidMarks ? calculateGradeFromMarks(numMarks) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidMarks) return;

    updateMutation.mutate(
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
            "Marks updated",
            `Result for ${
              result.enrollment?.student?.name || "student"
            } updated to ${numMarks} (${gradePreview?.grade}).`
          );
          setOpen(false);
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Failed to update result"));
        },
      }
    );
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      title="Edit Marks"
    >
      <Edit2 className="size-4" />
      <span className="sr-only">Edit marks</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Examination Marks"
      description="Update student marks and adjust release/publication status."
      actionTrigger={trigger ?? defaultTrigger}
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Student & Course Quick Context */}
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1">
          <p className="font-semibold text-foreground">
            {result.enrollment?.student?.name || "Student"}{" "}
            <span className="font-mono text-muted-foreground">
              ({result.enrollment?.student?.studentProfile?.studentId || "No ID"})
            </span>
          </p>
          <p className="text-muted-foreground">
            {result.enrollment?.courseOffering?.course?.code} —{" "}
            {result.enrollment?.courseOffering?.course?.title}
          </p>
        </div>

        {/* Marks Input */}
        <div className="space-y-2">
          <Label htmlFor="marks" className="text-sm font-medium">
            Examination Marks (0 – 100)
          </Label>
          <Input
            id="marks"
            type="number"
            step="0.5"
            min="0"
            max="100"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Enter marks (e.g. 85)"
            required
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
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Calculated Grade Preview</span>
              <Award className="size-3.5 text-primary" />
            </div>
            <div className="flex items-baseline justify-between pt-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">
                  {gradePreview.grade}
                </span>
                <span className="text-xs text-muted-foreground">
                  GPA {gradePreview.gradePoint.toFixed(2)}
                </span>
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {gradePreview.grade === "F" ? "Failing Mark" : "Passing Grade"}
              </span>
            </div>
          </div>
        )}

        {/* Published Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3">
          <div className="space-y-0.5">
            <Label
              htmlFor="published-toggle"
              className="text-sm font-medium cursor-pointer"
            >
              Publish to Student
            </Label>
            <p className="text-xs text-muted-foreground">
              When enabled, student can view this result immediately in their
              portal.
            </p>
          </div>
          <input
            id="published-toggle"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 cursor-pointer rounded border-border text-primary focus:ring-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={updateMutation.isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={updateMutation.isPending}
            loadingText="Saving..."
            disabled={!isValidMarks}
            className="cursor-pointer"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default ResultEditModal;
