"use client";

import * as React from "react";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2, BookOpen, ImageIcon } from "lucide-react";

import type { CourseItem } from "@/types";
import { useDeleteCourse } from "@/services";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/utils";
import { CourseModal } from "./course-modal";
import { CourseDetailsModal } from "./course-details-modal";

function CourseActionsCell({ course }: { course: CourseItem }) {
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const handleDelete = () => {
    deleteCourse(course.id, {
      onSuccess: () => {
        successToast(
          "Course deleted",
          `Course "${course.title}" (${course.code}) has been successfully deleted.`
        );
      },
      onError: (error) => {
        errorToast(getErrorMessage(error, "Failed to delete course"));
      },
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <CourseDetailsModal course={course} />
      <CourseModal mode="edit" course={course} />

      <ConfirmationModal
        title="Delete Course"
        description={`Are you sure you want to delete "${course.title}" (${course.code})? This action will soft-delete the course.`}
        confirmText="Delete Course"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-destructive hover:bg-destructive/10"
            title="Delete Course"
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete course</span>
          </Button>
        }
      />
    </div>
  );
}

export const courseColumns: ColumnDef<CourseItem>[] = [
  {
    accessorKey: "title",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original;
      const firstImage = course.images?.[0];

      return (
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/60">
            {firstImage ? (
              <Image
                src={firstImage}
                alt={course.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <BookOpen className="size-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {course.title}
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {course.code}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Course Code",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-mono text-xs">
          {row.original.code}
        </Badge>
      );
    },
  },
  {
    accessorKey: "credits",
    header: "Credits",
    cell: ({ row }) => {
      const credits = row.original.credits;
      return (
        <Badge variant="default" size="sm">
          {credits} {credits === 1 ? "Credit" : "Credits"}
        </Badge>
      );
    },
  },
  {
    id: "materials",
    header: "Materials",
    cell: ({ row }) => {
      const count = row.original.images?.length ?? 0;
      return (
        <Badge variant="secondary" size="sm" className="gap-1">
          <ImageIcon className="size-3 text-muted-foreground" />
          <span>{count} {count === 1 ? "Image" : "Images"}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <CourseActionsCell course={row.original} />,
  },
];

export default courseColumns;
