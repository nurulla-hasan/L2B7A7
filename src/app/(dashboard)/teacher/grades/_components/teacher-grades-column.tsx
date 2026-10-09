"use client";

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
import { ResultGradeBadge } from "@/app/(dashboard)/admin/results/_components/result-grade-badge";
import { TeacherEditMarksModal } from "./teacher-edit-marks-modal";

function QuickPublishButton({ result }: { result: ResultItem }) {
  const { mutate: updateMutation, isPending } = useUpdateResult();

  const handlePublish = () => {
    updateMutation(
      {
        id: result.id,
        payload: { published: true },
      },
      {
        onSuccess: () => {
          successToast(
            "Result published",
            `Result for ${result.enrollment?.student?.name || "Student"} is now visible.`
          );
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Failed to publish result"));
        },
      }
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePublish}
      loading={isPending}
      loadingText="Publishing..."
      title="Publish to student portal"
    >
      <Send />
      Publish
    </Button>
  );
}

function TeacherGradeActionsCell({ result }: { result: ResultItem }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {!result.published && <QuickPublishButton result={result} />}
      <TeacherEditMarksModal result={result} />
    </div>
  );
}

export const teacherGradesColumns: ColumnDef<ResultItem>[] = [
  // 1. Student Identity
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original.enrollment?.student;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 rounded-full border border-border">
            {student?.imageUrl && (
              <AvatarImage src={student.imageUrl} alt={student.name} />
            )}
            <AvatarFallback className="font-semibold text-xs text-primary">
              {getInitials(student?.name || "Student")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground truncate">
                {student?.name || "Unknown"}
              </span>
              {student?.studentProfile?.studentId && (
                <Badge variant="outline" className="font-mono text-2xs">
                  {student.studentProfile.studentId}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {student?.email}
            </p>
          </div>
        </div>
      );
    },
  },

  // 2. Course & Section
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.enrollment?.courseOffering?.course;
      const section = row.original.enrollment?.courseOffering?.section;

      return (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-2xs font-semibold">
              {course?.code || "N/A"}
            </Badge>
            {section && (
              <Badge variant="secondary" className="text-2xs">
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

  // 3. Semester
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

  // 4. Marks
  {
    accessorKey: "marks",
    header: "Marks",
    cell: ({ row }) => {
      return (
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-sm font-bold text-foreground">
            {row.original.marks}
          </span>
          <span className="text-2xs text-muted-foreground">/ 100</span>
        </div>
      );
    },
  },

  // 5. Letter Grade & GPA
  {
    accessorKey: "grade",
    header: "Grade / GPA",
    cell: ({ row }) => {
      return (
        <ResultGradeBadge
          grade={row.original.grade}
          showPoint={true}
          size="sm"
        />
      );
    },
  },

  // 6. Evaluation Status
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.published ? "success" : "pending"}>
          {row.original.published ? "Published" : "Draft"}
        </Badge>
      );
    },
  },

  // 7. Actions
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <TeacherGradeActionsCell result={row.original} />,
  },
];
