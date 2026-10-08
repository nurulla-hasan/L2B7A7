"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2, Users, Calendar } from "lucide-react";

import type { CourseOfferingItem } from "@/types";
import { useDeleteCourseOffering } from "@/services";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { CourseOfferingModal } from "./course-offering-modal";
import { CourseOfferingDetailsModal } from "./course-offering-details-modal";

function CourseOfferingActionsCell({
  offering,
}: {
  offering: CourseOfferingItem;
}) {
  const { mutateAsync: deleteOffering, isPending: isDeleting } =
    useDeleteCourseOffering();

  const handleDelete = async () => {
    try {
      await deleteOffering(offering.id);
      successToast(
        "Course offering deleted",
        `${offering.course.code} Section ${offering.section} has been successfully deleted.`
      );
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to delete course offering"));
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <CourseOfferingDetailsModal offering={offering} />
      <CourseOfferingModal mode="edit" offering={offering} />

      <ConfirmationModal
        title="Delete Course Offering"
        description={`Are you sure you want to delete ${offering.course.code} (${offering.course.title}) Section ${offering.section}? This action will soft-delete the offering.`}
        confirmText="Delete Offering"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-destructive hover:bg-destructive/10"
            title="Delete Course Offering"
          >
            <Trash2 />
            <span className="sr-only">Delete course offering</span>
          </Button>
        }
      />
    </div>
  );
}

export const courseOfferingColumns: ColumnDef<CourseOfferingItem>[] = [
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const offering = row.original;
      return (
        <div className="space-y-1 min-w-50">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="font-mono text-xs">
              {offering.course.code}
            </Badge>
            <Badge variant="secondary" size="sm">
              {offering.course.credits} Credits
            </Badge>
          </div>
          <p className="font-medium text-foreground text-sm line-clamp-1">
            {offering.course.title}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => {
      const sem = row.original.semester;
      return (
        <div className="flex items-center gap-1.5 text-xs text-foreground">
          <Calendar className="size-3.5 text-primary shrink-0" />
          <span>
            {sem.name} {sem.year}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => {
      return (
        <Badge variant="default" size="sm" className="font-mono">
          Sec {row.original.section}
        </Badge>
      );
    },
  },
  {
    accessorKey: "teacher",
    header: "Assigned Faculty",
    cell: ({ row }) => {
      const teacher = row.original.teacher;
      return (
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-foreground">{teacher.name}</p>
          <p className="text-[11px] text-muted-foreground">{teacher.email}</p>
        </div>
      );
    },
  },
  {
    id: "capacity",
    header: "Enrolled / Capacity",
    cell: ({ row }) => {
      const enrolled = row.original._count?.enrollments ?? 0;
      const capacity = row.original.capacity;
      const isFull = enrolled >= capacity;

      return (
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5 text-muted-foreground shrink-0" />
          <Badge
            variant={isFull ? "destructive" : enrolled > 0 ? "secondary" : "outline"}
            size="sm"
          >
            {enrolled} / {capacity} Enrolled
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => {
      const fee = row.original.fee;
      return (
        <span className="font-medium text-sm text-foreground">
          ৳{fee.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <CourseOfferingActionsCell offering={row.original} />,
  },
];

export default courseOfferingColumns;
