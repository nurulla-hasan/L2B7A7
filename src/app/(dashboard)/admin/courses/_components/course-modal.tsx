"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { Plus, Pencil } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { useCreateCourse, useUpdateCourse } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { courseInputSchema } from "@/validations";
import type { CourseItem } from "@/types";
import { CourseImageUpload } from "./course-image-upload";

interface CourseModalProps {
  mode: "create" | "edit";
  course?: CourseItem;
  trigger?: React.ReactNode;
}

export function CourseModal({ mode, course, trigger }: CourseModalProps) {
  const [open, setOpen] = React.useState(false);
  const [images, setImages] = React.useState<File[]>([]);

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: {
      title: course?.title ?? "",
      code: course?.code ?? "",
      credits: course?.credits ?? 3,
    },
    validators: {
      onChange: courseInputSchema,
    },
    onSubmit: ({ value }) => {
      if (mode === "create") {
        createMutation.mutate(
          {
            title: value.title.trim(),
            code: value.code.trim().toUpperCase(),
            credits: Number(value.credits),
            images,
          },
          {
            onSuccess: () => {
              successToast(
                "Course created",
                `Course "${value.title}" (${value.code.toUpperCase()}) has been successfully created.`,
              );
              setOpen(false);
            },
            onError: (error) => {
              errorToast(getErrorMessage(error, "Failed to create course"));
            },
          },
        );
      } else if (course) {
        updateMutation.mutate(
          {
            id: course.id,
            payload: {
              title: value.title.trim(),
              code: value.code.trim().toUpperCase(),
              credits: Number(value.credits),
              images: images.length > 0 ? images : undefined,
            },
          },
          {
            onSuccess: () => {
              successToast(
                "Course updated",
                `Course "${value.title}" has been successfully updated.`,
              );
              setOpen(false);
            },
            onError: (error) => {
              errorToast(getErrorMessage(error, "Failed to update course"));
            },
          },
        );
      }
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      form.setFieldValue("title", course?.title ?? "");
      form.setFieldValue("code", course?.code ?? "");
      form.setFieldValue("credits", course?.credits ?? 3);
    }
    setImages([]);
  };

  const defaultTrigger =
    mode === "create" ? (
      <Button className="w-full cursor-pointer sm:w-auto">
        <Plus />
        Add Course
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer text-muted-foreground hover:text-foreground"
        title="Edit Course"
      >
        <Pencil />
        <span className="sr-only">Edit course</span>
      </Button>
    );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={handleOpenChange}
      title={mode === "create" ? "Create New Course" : "Edit Course"}
      description={
        mode === "create"
          ? "Add a new academic course, syllabus, credit hours, and course images."
          : "Update course curriculum details, credit hours, or upload materials."
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
          name="title"
          label="Course Title"
          placeholder="e.g. Introduction to Computer Science"
          disabled={isPending}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            form={form}
            name="code"
            label="Course Code"
            placeholder="e.g. CSE101"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="credits"
            label="Credit Hours"
            type="number"
            step="0.5"
            min="0.5"
            max="30"
            placeholder="e.g. 3.0"
            disabled={isPending}
          />
        </div>

        <CourseImageUpload
          files={images}
          onChange={setImages}
          existingImages={course?.images ?? []}
          disabled={isPending}
        />

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
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
            {mode === "create" ? "Create Course" : "Save Changes"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default CourseModal;
