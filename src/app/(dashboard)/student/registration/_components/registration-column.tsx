"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusCircle, CreditCard, Users } from "lucide-react";

import type { CourseOfferingItem } from "@/types";
import { useGetMyEnrollments, useEnrollCourse } from "@/services";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { OfferingDetailsModal } from "./offering-details-modal";

function RegistrationActionsCell({
  offering,
}: {
  offering: CourseOfferingItem;
}) {
  const { data: myEnrollmentsRes } = useGetMyEnrollments({ limit: 100 });
  const { mutateAsync: enroll, isPending: isEnrolling } = useEnrollCourse();

  const myEnrollments = myEnrollmentsRes?.data ?? [];

  // Check if student is already enrolled in this exact course offering
  const exactEnrollment = myEnrollments.find(
    (e) => e.courseOfferingId === offering.id && e.status !== "DROPPED"
  );

  // Check if student is already enrolled in another section of this course for this semester
  const conflictEnrollment = myEnrollments.find(
    (e) =>
      e.courseOffering.courseId === offering.course.id &&
      e.courseOffering.semesterId === offering.semester.id &&
      e.status !== "DROPPED" &&
      e.courseOfferingId !== offering.id
  );

  const enrolledCount = offering._count?.enrollments ?? 0;
  const isFull = enrolledCount >= offering.capacity;

  const handleRegister = async () => {
    try {
      await enroll({ courseOfferingId: offering.id });
      successToast(
        "Registration Successful",
        `You have registered for ${offering.course.code} Section ${offering.section}.`
      );
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to register for course"));
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {exactEnrollment ? (
        exactEnrollment.status === "ENROLLED" ? (
          <Badge variant="success">Enrolled</Badge>
        ) : (
          <div className="flex items-center gap-1.5">
            <Badge variant="warning">Pending Payment</Badge>
            <Button
              render={<Link href="/student/payments" />}
            >
              <CreditCard />
              Pay
            </Button>
          </div>
        )
      ) : conflictEnrollment ? (
        <Badge variant="secondary" title={`Already registered in Section ${conflictEnrollment.courseOffering.section}`}>
          Section {conflictEnrollment.courseOffering.section} Taken
        </Badge>
      ) : isFull ? (
        <Badge variant="destructive">Class Full</Badge>
      ) : (
        <ConfirmationModal
          title="Confirm Course Registration"
          description={`Are you sure you want to register for ${offering.course.code} (${offering.course.title}) Section ${offering.section}? Tuition fee: ৳${Number(offering.fee).toLocaleString()}.`}
          confirmText="Register Now"
          isLoading={isEnrolling}
          onConfirm={handleRegister}
          trigger={
            <Button>
              <PlusCircle />
              Register
            </Button>
          }
        />
      )}
      <OfferingDetailsModal offering={offering} />

    </div>
  );
}

export const registrationColumns: ColumnDef<CourseOfferingItem>[] = [
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.course;
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
        Sec {row.original.section}
      </Badge>
    ),
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => {
      const semester = row.original.semester;
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
      const teacher = row.original.teacher;
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
    accessorKey: "capacity",
    header: "Seats",
    cell: ({ row }) => {
      const enrolled = row.original._count?.enrollments ?? 0;
      const capacity = row.original.capacity;
      const remaining = Math.max(0, capacity - enrolled);
      const isFull = remaining === 0;

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3 text-muted-foreground" />
            <span>
              {enrolled} / {capacity}
            </span>
          </div>
          <Badge
            variant={
              isFull ? "destructive" : remaining <= 5 ? "warning" : "secondary"
            }
          >
            {isFull ? "Full" : `${remaining} left`}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "fee",
    header: "Tuition Fee",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold text-foreground">
        ৳ {Number(row.original.fee).toLocaleString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => <RegistrationActionsCell offering={row.original} />,
  },
];
