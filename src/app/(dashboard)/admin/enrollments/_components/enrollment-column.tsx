"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, UserMinus } from "lucide-react";

import type { EnrollmentItem } from "@/types";
import { useUpdateEnrollmentStatus } from "@/services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { formatDate, getInitials } from "@/lib/utils";
import { EnrollmentStatusBadge } from "./enrollment-status-badge";
import { EnrollmentDetailsModal } from "./enrollment-details-modal";

function EnrollmentActionsCell({
  enrollment,
}: {
  enrollment: EnrollmentItem;
}) {
  const { mutateAsync: updateStatus, isPending } = useUpdateEnrollmentStatus();

  const handleDrop = async () => {
    try {
      await updateStatus({
        id: enrollment.id,
        payload: { status: "DROPPED" },
      });
      successToast(
        "Enrollment dropped",
        `${enrollment.student.name} has been administratively dropped from ${enrollment.courseOffering.course.code} Section ${enrollment.courseOffering.section}.`
      );
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to drop enrollment"));
    }
  };

  const isDropped = enrollment.status === "DROPPED";

  return (
    <div className="flex items-center justify-end gap-1">
      <EnrollmentDetailsModal enrollment={enrollment} />

      {!isDropped && (
        <ConfirmationModal
          title="Drop Student Enrollment"
          description={`Are you sure you want to administratively drop ${enrollment.student.name} from ${enrollment.courseOffering.course.code} (Section ${enrollment.courseOffering.section})? This will mark their enrollment as DROPPED and release the reserved seat.`}
          confirmText="Drop Student"
          variant="destructive"
          isLoading={isPending}
          onConfirm={handleDrop}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer text-destructive hover:bg-destructive/10"
              title="Drop Enrollment"
            >
              <UserMinus />
              <span className="sr-only">Drop student enrollment</span>
            </Button>
          }
        />
      )}
    </div>
  );
}

export const enrollmentColumns: ColumnDef<EnrollmentItem>[] = [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original.student;

      return (
        <div className="flex items-center gap-2.5 min-w-50">
          <Avatar size="sm">
            {student.imageUrl && (
              <AvatarImage src={student.imageUrl} alt={student.name} />
            )}
            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="font-medium text-foreground text-sm leading-none">
              {student.name}
            </p>
            <p className="text-[11px] text-muted-foreground">{student.email}</p>
            {student.studentProfile?.studentId && (
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
    header: "Course & Section",
    cell: ({ row }) => {
      const offering = row.original.courseOffering;
      return (
        <div className="space-y-1 min-w-44">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="font-mono text-[11px]">
              {offering.course.code}
            </Badge>
            <Badge
              variant="secondary"
              size="sm"
              className="font-mono text-[11px]"
            >
              Sec {offering.section}
            </Badge>
          </div>
          <p className="font-medium text-foreground text-xs line-clamp-1">
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
      const sem = row.original.courseOffering.semester;
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
    accessorKey: "fee",
    header: "Tuition Fee",
    cell: ({ row }) => {
      const fee = row.original.courseOffering.fee;
      return (
        <span className="font-medium text-sm text-foreground">
          ৳{fee.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <EnrollmentStatusBadge status={row.original.status} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Enrolled On",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0" />
          <span>{formatDate(row.original.createdAt)}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <EnrollmentActionsCell enrollment={row.original} />,
  },
];

export default enrollmentColumns;
