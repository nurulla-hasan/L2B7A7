"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2, CreditCard } from "lucide-react";

import type { EnrollmentItem } from "@/types";
import { useDropEnrollment } from "@/services";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { CourseDetailsModal } from "./course-details-modal";

function MyCourseActionsCell({
  enrollment,
}: {
  enrollment: EnrollmentItem;
}) {
  const { mutateAsync: dropCourse, isPending: isDropping } = useDropEnrollment();

  const offering = enrollment.courseOffering;
  const course = offering.course;
  const isDropped = enrollment.status === "DROPPED";
  const isPendingPayment = enrollment.status === "PENDING_PAYMENT";

  const handleDrop = async () => {
    try {
      await dropCourse(enrollment.id);
      successToast(
        "Course dropped",
        `You have successfully dropped ${course.code} Section ${offering.section}.`
      );
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to drop course"));
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <CourseDetailsModal enrollment={enrollment} />

      {isPendingPayment && (
        <Button render={<Link href="/student/payments" />}>
          <CreditCard />
          Pay Fee
        </Button>
      )}

      {!isDropped && (
        <ConfirmationModal
          title="Drop Enrolled Course"
          description={`Are you sure you want to drop ${course.code} (${course.title}) Section ${offering.section}? This action will release your reserved seat.`}
          confirmText="Drop Course"
          variant="destructive"
          isLoading={isDropping}
          onConfirm={handleDrop}
          trigger={
            <Button variant="destructive">
              <Trash2 />
              Drop
            </Button>
          }
        />
      )}
    </div>
  );
}

export const myCoursesColumns: ColumnDef<EnrollmentItem>[] = [
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.courseOffering.course;
      return (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{course.code}</Badge>
            <span className="font-medium text-foreground">
              {course.title}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {course.credits} Credits
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => (
      <Badge variant="outline">
        Sec {row.original.courseOffering.section}
      </Badge>
    ),
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => {
      const semester = row.original.courseOffering.semester;
      return (
        <span className="text-sm text-foreground">
          {semester.name} {semester.year}
        </span>
      );
    },
  },
  {
    accessorKey: "teacher",
    header: "Instructor",
    cell: ({ row }) => {
      const teacher = row.original.courseOffering.teacher;
      return (
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">
            {teacher.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {teacher.email}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === "ENROLLED") {
        return <Badge variant="success">Enrolled</Badge>;
      }
      if (status === "PENDING_PAYMENT") {
        return <Badge variant="warning">Pending Payment</Badge>;
      }
      return <Badge variant="destructive">Dropped</Badge>;
    },
  },
  {
    accessorKey: "fee",
    header: "Tuition Fee",
    cell: ({ row }) => {
      const fee = row.original.courseOffering.fee;
      return (
        <span className="font-mono text-sm font-semibold text-foreground">
          ৳ {fee ? Number(fee).toLocaleString() : "0"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => <MyCourseActionsCell enrollment={row.original} />,
  },
];
