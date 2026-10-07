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

export function SemesterModal({
  mode,
  semester,
  trigger,
}: SemesterModalProps) {
  const [open, setOpen] = React.useState(false);

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
    onSubmit: ({ value }) => {
      if (mode === "create") {
        createMutation.mutate(
          {
            name: value.name.trim(),
            year: Number(value.year),
            startDate: value.startDate,
            endDate: value.endDate,
          },
          {
            onSuccess: () => {
              successToast(
                "Semester created",
                `${value.name} ${value.year} semester has been successfully created.`
              );
              setOpen(false);
            },
            onError: (error) => {
              errorToast(getErrorMessage(error, "Failed to create semester"));
            },
          }
        );
      } else if (semester) {
        updateMutation.mutate(
          {
            id: semester.id,
            payload: {
              name: value.name.trim(),
              year: Number(value.year),
              startDate: value.startDate,
              endDate: value.endDate,
            },
          },
          {
            onSuccess: () => {
              successToast(
                "Semester updated",
                `${value.name} ${value.year} semester has been successfully updated.`
              );
              setOpen(false);
            },
            onError: (error) => {
              errorToast(getErrorMessage(error, "Failed to update semester"));
            },
          }
        );
      }
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      form.setFieldValue("name", semester?.name ?? "Spring");
      form.setFieldValue("year", semester?.year ?? new Date().getFullYear());
      form.setFieldValue(
        "startDate",
        semester?.startDate ? formatDateToInput(semester.startDate) : ""
      );
      form.setFieldValue(
        "endDate",
        semester?.endDate ? formatDateToInput(semester.endDate) : ""
      );
    }
  };

  const defaultTrigger =
    mode === "create" ? (
      <Button className="cursor-pointer w-full sm:w-auto">
        <Plus />
        Add Semester
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        title="Edit Semester"
      >
        <Pencil />
        <span className="sr-only">Edit semester</span>
      </Button>
    );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={handleOpenChange}
      title={mode === "create" ? "Create New Semester" : "Edit Semester"}
      description={
        mode === "create"
          ? "Add a new academic semester term with its start and end dates."
          : "Update academic term dates and semester details."
      }
      actionTrigger={trigger ?? defaultTrigger}
    >
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
            onClick={() => handleOpenChange(false)}
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
    </ModalWrapper>
  );
}

export default SemesterModal;
