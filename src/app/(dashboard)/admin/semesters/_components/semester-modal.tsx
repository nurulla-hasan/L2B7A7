"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { Plus, Pencil } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { FormInput } from "@/components/common/form-input";
import { FormDatePicker } from "@/components/common/form-date-picker";
import { Button } from "@/components/ui/button";
import { useCreateSemester, useUpdateSemester } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { semesterFormSchema } from "@/validations";
import type { SemesterItem } from "@/types";

interface SemesterModalProps {
  mode: "create" | "edit";
  semester?: SemesterItem;
  trigger?: React.ReactNode;
}

const formatDateToInput = (dateString?: string) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0] || "";
  } catch {
    return "";
  }
};

function SemesterForm({
  mode,
  semester,
  onSuccess,
  onCancel,
}: {
  mode: "create" | "edit";
  semester?: SemesterItem;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const createMutation = useCreateSemester();
  const updateMutation = useUpdateSemester();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: {
      name: semester?.name ?? "Spring",
      year: semester?.year ?? new Date().getFullYear(),
      startDate: semester?.startDate ? formatDateToInput(semester.startDate) : "",
      endDate: semester?.endDate ? formatDateToInput(semester.endDate) : "",
    },
    validators: {
      onChange: semesterFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "create") {
          await createMutation.mutateAsync({
            name: value.name.trim(),
            year: Number(value.year),
            startDate: value.startDate,
            endDate: value.endDate,
          });

          successToast(
            "Semester created",
            `${value.name} ${value.year} semester has been successfully created.`
          );
        } else if (semester) {
          await updateMutation.mutateAsync({
            id: semester.id,
            payload: {
              name: value.name.trim(),
              year: Number(value.year),
              startDate: value.startDate,
              endDate: value.endDate,
            },
          });

          successToast(
            "Semester updated",
            `${value.name} ${value.year} semester has been successfully updated.`
          );
        }
        onSuccess();
      } catch (error) {
        errorToast(
          getErrorMessage(
            error,
            mode === "create"
              ? "Failed to create semester"
              : "Failed to update semester"
          )
        );
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FormInput
        form={form}
        name="name"
        label="Semester Name"
        placeholder="e.g. Spring, Summer, Fall"
      />

      <FormInput
        form={form}
        name="year"
        label="Academic Year"
        type="number"
        placeholder="e.g. 2026"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormDatePicker
          form={form}
          name="startDate"
          label="Start Date"
          placeholder="Select start date"
        />

        <FormDatePicker
          form={form}
          name="endDate"
          label="End Date"
          placeholder="Select end date"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isPending}
          loadingText={mode === "create" ? "Creating..." : "Saving..."}
        >
          {mode === "create" ? "Create Semester" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

export function SemesterModal({
  mode,
  semester,
  trigger,
}: SemesterModalProps) {
  const [open, setOpen] = React.useState(false);

  const defaultTrigger =
    mode === "create" ? (
      <Button className="cursor-pointer w-full sm:w-auto">
        <Plus className="mr-1.5 size-4" />
        Add Semester
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="icon-sm"
        className="cursor-pointer"
        title="Edit Semester"
      >
        <Pencil className="size-3.5" />
        <span className="sr-only">Edit semester</span>
      </Button>
    );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title={mode === "create" ? "Create New Semester" : "Edit Semester"}
      description={
        mode === "create"
          ? "Add a new academic semester term with its start and end dates."
          : "Update academic term dates and semester details."
      }
      actionTrigger={trigger ?? defaultTrigger}
    >
      {open && (
        <SemesterForm
          key={semester?.id ?? "create-semester-form"}
          mode={mode}
          semester={semester}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      )}
    </ModalWrapper>
  );
}
