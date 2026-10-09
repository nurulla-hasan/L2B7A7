"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { EnrollmentItem } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, getInitials } from "@/lib/utils";
import { TeacherStudentDetailsModal } from "./teacher-student-details-modal";

export const teacherStudentsColumns: ColumnDef<EnrollmentItem>[] = [
  // 1. Student Identity
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original.student;
      const profile = student?.studentProfile;

      return (
        <div className="flex items-center gap-3 min-w-48">
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
              {profile?.studentId && (
                <Badge variant="outline" className="font-mono text-2xs">
                  {profile.studentId}
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

  // 2. Department & Batch
  {
    accessorKey: "department",
    header: "Dept / Batch",
    cell: ({ row }) => {
      const profile = row.original.student?.studentProfile;

      return (
        <div className="space-y-0.5">
          <Badge variant="secondary" className="text-2xs font-mono">
            {profile?.department || "General"}
          </Badge>
          {profile?.batch && (
            <p className="text-2xs text-muted-foreground font-mono">
              Batch {profile.batch}
            </p>
          )}
        </div>
      );
    },
  },

  // 3. Enrolled Course & Section
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.courseOffering?.course;
      const section = row.original.courseOffering?.section;

      return (
        <div className="space-y-0.5 min-w-44">
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

  // 4. Semester
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => {
      const semester = row.original.courseOffering?.semester;
      return (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {semester ? `${semester.name} ${semester.year}` : "—"}
        </span>
      );
    },
  },

  // 5. Enrollment Status
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant={
            status === "ENROLLED"
              ? "success"
              : status === "PENDING_PAYMENT"
              ? "pending"
              : "destructive"
          }
        >
          {status === "ENROLLED"
            ? "Enrolled"
            : status === "PENDING_PAYMENT"
            ? "Pending Payment"
            : "Dropped"}
        </Badge>
      );
    },
  },

  // 6. Registered Date
  {
    accessorKey: "createdAt",
    header: "Enrolled Date",
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
          {formatDate(row.original.createdAt)}
        </span>
      );
    },
  },

  // 7. Actions
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <TeacherStudentDetailsModal enrollment={row.original} />
      </div>
    ),
  },
];
