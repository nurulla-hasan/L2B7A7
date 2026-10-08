"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import type { SemesterItem } from "@/types";
import { useDeleteSemester } from "@/services";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/utils";
import { SemesterModal } from "./semester-modal";

function SemesterActionsCell({ semester }: { semester: SemesterItem }) {
  const { mutateAsync: deleteSemester, isPending: isDeleting } = useDeleteSemester();

  const handleDelete = async () => {
    try {
      await deleteSemester(semester.id);
      successToast(
        "Semester deleted",
        `${semester.name} ${semester.year} has been successfully deleted.`
      );
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to delete semester"));
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <SemesterModal mode="edit" semester={semester} />

      <ConfirmationModal
        title="Delete Semester"
        description={`Are you sure you want to delete ${semester.name} ${semester.year}? This action will soft-delete the semester.`}
        confirmText="Delete Semester"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-destructive hover:bg-destructive/10"
            title="Delete Semester"
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete semester</span>
          </Button>
        }
      />
    </div>
  );
}

function getSemesterStatusBadge(startDate: string, endDate: string) {
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (now >= start && now <= end) {
    return (
      <Badge variant="active" size="sm">
        Active
      </Badge>
    );
  }

  if (now < start) {
    return (
      <Badge variant="info" size="sm">
        Upcoming
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" size="sm">
      Ended
    </Badge>
  );
}

export const semesterColumns: ColumnDef<SemesterItem>[] = [
  {
    accessorKey: "name",
    header: "Semester",
    cell: ({ row }) => {
      const semester = row.original;
      return (
        <div>
          <p className="font-medium text-foreground">{semester.name}</p>
          <p className="text-xs text-muted-foreground">{semester.year}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => {
      return (
        <span className="text-xs font-medium text-foreground">
          {row.original.year}
        </span>
      );
    },
  },
  {
    id: "dates",
    header: "Term Duration",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(startDate)} – {formatDate(endDate)}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      return getSemesterStatusBadge(row.original.startDate, row.original.endDate);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(row.original.createdAt)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <SemesterActionsCell semester={row.original} />,
  },
];
