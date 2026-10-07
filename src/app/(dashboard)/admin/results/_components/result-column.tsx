"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Send } from "lucide-react";

import type { ResultItem } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUpdateResult } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { getInitials } from "@/lib/utils";
import { ResultGradeBadge } from "./result-grade-badge";
import { ResultStatusBadge } from "./result-status-badge";
import { ResultDetailsModal } from "./result-details-modal";
import { ResultEditModal } from "./result-edit-modal";

function ResultActionsCell({ result }: { result: ResultItem }) {
  const updateMutation = useUpdateResult();

  const handleQuickPublish = () => {
    updateMutation.mutate(
      {
        id: result.id,
        payload: {
          published: !result.published,
        },
      },
      {
        onSuccess: () => {
          successToast(
            result.published ? "Result unpublished" : "Result published",
            result.published
              ? "Result has been moved to draft state."
              : "Result has been published and is now visible to the student."
          );
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Failed to change publication status"));
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {/* View Details */}
      <ResultDetailsModal result={result} />

      {/* Edit Marks */}
      <ResultEditModal result={result} />

      {/* Quick Publish / Unpublish Toggle */}
      {!result.published ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleQuickPublish}
          loading={updateMutation.isPending}
          className="cursor-pointer text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
          title="Publish Result to Student"
        >
          <Send className="size-3.5" />
        </Button>
      ) : null}
    </div>
  );
}

export const resultColumns: ColumnDef<ResultItem>[] = [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original.enrollment?.student;

      return (
        <div className="flex items-center gap-2.5 min-w-44">
          <Avatar size="sm">
            {student?.imageUrl && (
              <AvatarImage src={student.imageUrl} alt={student.name} />
            )}
            <AvatarFallback>{getInitials(student?.name || "Student")}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="font-medium text-foreground text-sm leading-none">
              {student?.name || "Unknown Student"}
            </p>
            <p className="text-[11px] text-muted-foreground">{student?.email}</p>
            {student?.studentProfile?.studentId && (
              <p className="text-[10px] font-mono text-muted-foreground/80">
                ID: {student.studentProfile.studentId}
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.enrollment?.courseOffering?.course;
      const section = row.original.enrollment?.courseOffering?.section;

      return (
        <div className="space-y-1 min-w-40">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-[11px] font-semibold">
              {course?.code || "N/A"}
            </Badge>
            {section && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Sec {section}
              </Badge>
            )}
          </div>
          <p className="text-xs font-medium text-foreground line-clamp-1">
            {course?.title || "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => {
      const semester = row.original.enrollment?.courseOffering?.semester;
      return (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {semester ? `${semester.name} ${semester.year}` : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "teacher",
    header: "Instructor",
    cell: ({ row }) => {
      const teacher = row.original.teacher;
      return (
        <div className="space-y-0.5 min-w-32">
          <p className="text-xs font-medium text-foreground leading-none">
            {teacher?.name || "—"}
          </p>
          <p className="text-[10px] text-muted-foreground">{teacher?.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "marks",
    header: () => <span className="text-right block">Marks</span>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <span className="font-mono text-sm font-bold text-foreground">
            {row.original.marks}
          </span>
          <span className="text-[10px] text-muted-foreground block">/ 100</span>
        </div>
      );
    },
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => {
      return <ResultGradeBadge grade={row.original.grade} showPoint={true} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <ResultStatusBadge published={row.original.published} />;
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <ResultActionsCell result={row.original} />,
  },
];
