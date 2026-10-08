"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { ResultItem } from "@/types";
import { getGradePoint } from "./student-result-summary-cards";
import { StudentResultDetailsModal } from "./student-result-details-modal";

function StudentGradeBadge({ grade }: { grade: string }) {
  const point = getGradePoint(grade);
  let variant: "success" | "info" | "warning" | "destructive" | "outline" =
    "outline";

  if (["A+", "A", "A-"].includes(grade)) {
    variant = "success";
  } else if (["B+", "B", "B-"].includes(grade)) {
    variant = "info";
  } else if (["C+", "C", "D"].includes(grade)) {
    variant = "warning";
  } else if (grade === "F") {
    variant = "destructive";
  }

  return (
    <Badge variant={variant}>
      {grade} ({point.toFixed(2)})
    </Badge>
  );
}

export const studentResultColumns: ColumnDef<ResultItem>[] = [
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const offering = row.original.enrollment?.courseOffering;
      const course = offering?.course;
      return (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{course?.code ?? "—"}</Badge>
            <span className="font-medium text-foreground">
              {course?.title ?? "Course"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {course?.credits ?? 3} Credits • Section {offering?.section ?? "A"}
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
        <span className="text-sm text-foreground">
          {semester?.name ? `${semester.name} ${semester.year}` : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
    cell: ({ row }) => {
      const teacher = row.original.teacher;
      return (
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">
            {teacher?.name ?? "Assigned Faculty"}
          </p>
          <p className="text-xs text-muted-foreground">
            {teacher?.email ?? "—"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "marks",
    header: "Marks",
    cell: ({ row }) => {
      const marks = row.original.marks;
      return (
        <div className="space-y-0.5">
          <span className="font-mono text-sm font-semibold text-foreground">
            {marks} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "grade",
    header: "Grade & GPA",
    cell: ({ row }) => <StudentGradeBadge grade={row.original.grade} />,
  },
  {
    accessorKey: "publishedAt",
    header: "Published Date",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.publishedAt
          ? formatDate(row.original.publishedAt)
          : formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <StudentResultDetailsModal result={row.original} />
      </div>
    ),
  },
];
