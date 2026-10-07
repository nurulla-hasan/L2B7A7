"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { Plus, Pencil, Calendar } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCourseOffering,
  useUpdateCourseOffering,
  useGetCourses,
  useGetSemesters,
  useGetUsers,
} from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { courseOfferingFormSchema } from "@/validations";
import type { CourseOfferingItem } from "@/types";

interface CourseOfferingModalProps {
  mode: "create" | "edit";
  offering?: CourseOfferingItem;
  trigger?: React.ReactNode;
}

export function CourseOfferingModal({
  mode,
  offering,
  trigger,
}: CourseOfferingModalProps) {
  const [open, setOpen] = React.useState(false);

  // Data sources for selectors
  const { data: coursesRes, isLoading: isLoadingCourses } = useGetCourses({
    limit: 100,
  });
  const { data: semestersRes, isLoading: isLoadingSemesters } = useGetSemesters({
    limit: 100,
  });
  const { data: teachersRes, isLoading: isLoadingTeachers } = useGetUsers({
    role: "TEACHER",
    status: "ACTIVE",
    limit: 100,
  });

  const courses = coursesRes?.data ?? [];
  const semesters = semestersRes?.data ?? [];
  const teachers = teachersRes?.data ?? [];

  const createMutation = useCreateCourseOffering();
  const updateMutation = useUpdateCourseOffering();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: {
      courseId: offering?.courseId ?? "",
      semesterId: offering?.semesterId ?? "",
      teacherId: offering?.teacherId ?? "",
      section: offering?.section ?? "A",
      capacity: offering?.capacity ?? 40,
      fee: offering?.fee ?? 0,
    },
    validators: {
      onChange: courseOfferingFormSchema,
    },
    onSubmit: ({ value }) => {
      if (mode === "create") {
        createMutation.mutate(
          {
            courseId: value.courseId,
            semesterId: value.semesterId,
            teacherId: value.teacherId,
            section: value.section.trim().toUpperCase(),
            capacity: Number(value.capacity),
            fee: Number(value.fee),
          },
          {
            onSuccess: () => {
              successToast(
                "Course offering created",
                `Section ${value.section.toUpperCase()} has been successfully created.`
              );
              setOpen(false);
            },
            onError: (error) => {
              errorToast(getErrorMessage(error, "Failed to create course offering"));
            },
          }
        );
      } else if (offering) {
        updateMutation.mutate(
          {
            id: offering.id,
            payload: {
              teacherId: value.teacherId,
              section: value.section.trim().toUpperCase(),
              capacity: Number(value.capacity),
              fee: Number(value.fee),
            },
          },
          {
            onSuccess: () => {
              successToast(
                "Course offering updated",
                `Offering for section ${value.section.toUpperCase()} has been successfully updated.`
              );
              setOpen(false);
            },
            onError: (error) => {
              errorToast(getErrorMessage(error, "Failed to update course offering"));
            },
          }
        );
      }
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      form.setFieldValue("courseId", offering?.courseId ?? "");
      form.setFieldValue("semesterId", offering?.semesterId ?? "");
      form.setFieldValue("teacherId", offering?.teacherId ?? "");
      form.setFieldValue("section", offering?.section ?? "A");
      form.setFieldValue("capacity", offering?.capacity ?? 40);
      form.setFieldValue("fee", offering?.fee ?? 0);
    }
  };

  const defaultTrigger =
    mode === "create" ? (
      <Button className="w-full cursor-pointer sm:w-auto">
        <Plus />
        Offer Course
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer text-muted-foreground hover:text-foreground"
        title="Edit Offering"
      >
        <Pencil />
        <span className="sr-only">Edit course offering</span>
      </Button>
    );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={handleOpenChange}
      title={mode === "create" ? "Offer New Course" : "Edit Course Offering"}
      description={
        mode === "create"
          ? "Assign a course to a semester session, assign faculty, configure section capacity, and tuition fee."
          : "Modify section assignment, assigned faculty member, capacity, or fees."
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
        {/* In edit mode, show current course & semester as read-only */}
        {mode === "edit" && offering ? (
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {offering.course.code}
              </Badge>
              <h4 className="text-sm font-semibold text-foreground">
                {offering.course.title}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="size-3.5 text-primary" />
              <span>
                Semester: {offering.semester.name} {offering.semester.year}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Course Selector */}
            <form.Field name="courseId">
              {(field) => {
                const error = field.state.meta.errors?.[0];
                const errorMessage = typeof error === "string" ? error : error?.message;
                const isInvalid = Boolean(field.state.meta.isTouched && errorMessage);

                return (
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Course <span className="text-destructive">*</span>
                    </label>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val ?? "")}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select course">
                          {(val) => {
                            const c = courses.find((item) => item.id === val);
                            return c ? `${c.code} — ${c.title}` : "Select course";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCourses ? (
                          <div className="p-2 text-xs text-muted-foreground text-center">
                            Loading courses...
                          </div>
                        ) : courses.length === 0 ? (
                          <div className="p-2 text-xs text-muted-foreground text-center">
                            No courses found
                          </div>
                        ) : (
                          courses.map((course) => (
                            <SelectItem
                              key={course.id}
                              value={course.id}
                              className="cursor-pointer"
                            >
                              <span className="font-mono font-medium mr-1.5">
                                {course.code}
                              </span>
                              <span>— {course.title}</span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <p className="text-xs text-destructive">{errorMessage}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Semester Selector */}
            <form.Field name="semesterId">
              {(field) => {
                const error = field.state.meta.errors?.[0];
                const errorMessage = typeof error === "string" ? error : error?.message;
                const isInvalid = Boolean(field.state.meta.isTouched && errorMessage);

                return (
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Semester <span className="text-destructive">*</span>
                    </label>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val ?? "")}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select semester">
                          {(val) => {
                            const s = semesters.find((item) => item.id === val);
                            return s ? `${s.name} ${s.year}` : "Select semester";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingSemesters ? (
                          <div className="p-2 text-xs text-muted-foreground text-center">
                            Loading semesters...
                          </div>
                        ) : semesters.length === 0 ? (
                          <div className="p-2 text-xs text-muted-foreground text-center">
                            No semesters found
                          </div>
                        ) : (
                          semesters.map((sem) => (
                            <SelectItem
                              key={sem.id}
                              value={sem.id}
                              className="cursor-pointer"
                            >
                              {sem.name} {sem.year}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <p className="text-xs text-destructive">{errorMessage}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>
          </div>
        )}

        {/* Teacher / Faculty Selector */}
        <form.Field name="teacherId">
          {(field) => {
            const error = field.state.meta.errors?.[0];
            const errorMessage = typeof error === "string" ? error : error?.message;
            const isInvalid = Boolean(field.state.meta.isTouched && errorMessage);

            return (
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Assigned Faculty / Teacher <span className="text-destructive">*</span>
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val ?? "")}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Assign faculty member">
                      {(val) => {
                        const t = teachers.find((item) => item.id === val);
                        return t ? `${t.name} (${t.email})` : "Assign faculty member";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingTeachers ? (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        Loading faculty members...
                      </div>
                    ) : teachers.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        No active teachers available
                      </div>
                    ) : (
                      teachers.map((teacher) => (
                        <SelectItem
                          key={teacher.id}
                          value={teacher.id}
                          className="cursor-pointer"
                        >
                          <span className="font-medium mr-1.5">{teacher.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({teacher.email})
                          </span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {isInvalid && (
                  <p className="text-xs text-destructive">{errorMessage}</p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Section, Capacity, Fee row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormInput
            form={form}
            name="section"
            label="Section"
            placeholder="e.g. A"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="capacity"
            label="Seat Capacity"
            type="number"
            step="1"
            min="1"
            max="500"
            placeholder="e.g. 40"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="fee"
            label="Course Fee (BDT)"
            type="number"
            step="100"
            min="0"
            placeholder="e.g. 4500"
            disabled={isPending}
          />
        </div>

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
            loadingText={mode === "create" ? "Offering..." : "Saving..."}
          >
            {mode === "create" ? "Offer Course" : "Save Changes"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default CourseOfferingModal;
