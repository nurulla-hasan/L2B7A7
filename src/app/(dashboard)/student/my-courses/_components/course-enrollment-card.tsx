"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  CreditCard,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { useDropEnrollment } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import type { EnrollmentItem, EnrollmentStatus } from "@/types";
import { CourseDetailsModal } from "./course-details-modal";

interface CourseEnrollmentCardProps {
  enrollment: EnrollmentItem;
}

const statusConfig: Record<
  EnrollmentStatus,
  {
    variant: "success" | "warning" | "destructive" | "default" | "secondary";
    icon: typeof CheckCircle2;
    label: string;
  }
> = {
  ENROLLED: {
    variant: "success",
    icon: CheckCircle2,
    label: "Enrolled",
  },
  PENDING_PAYMENT: {
    variant: "warning",
    icon: AlertCircle,
    label: "Pending Payment",
  },
  DROPPED: {
    variant: "destructive",
    icon: XCircle,
    label: "Dropped",
  },
};

export function CourseEnrollmentCard({ enrollment }: CourseEnrollmentCardProps) {
  const { mutate: dropCourse, isPending: isDropping } = useDropEnrollment();

  const offering = enrollment.courseOffering;
  const course = offering.course;
  const semester = offering.semester;
  const teacher = offering.teacher;

  const status = statusConfig[enrollment.status] || {
    variant: "secondary" as const,
    icon: AlertCircle,
    label: enrollment.status,
  };
  const StatusIcon = status.icon;

  const isDropped = enrollment.status === "DROPPED";
  const isPaymentPending = enrollment.status === "PENDING_PAYMENT";

  const handleDrop = () => {
    dropCourse(enrollment.id, {
      onSuccess: () => {
        successToast(
          "Course dropped",
          `You have successfully dropped ${course.code} Section ${offering.section}.`
        );
      },
      onError: (error) => {
        errorToast(getErrorMessage(error, "Failed to drop course"));
      },
    });
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline">
              {course.code}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {course.credits} Credits
            </span>
          </div>

          <Badge variant={status.variant}>
            <StatusIcon className="size-3" />
            {status.label}
          </Badge>
        </div>

        <div>
          <CardTitle>
            {course.title}
          </CardTitle>
          <CardDescription>
            Instructor:{" "}
            <strong className="text-foreground font-medium">
              {teacher.name}
            </strong>{" "}
            • Section {offering.section}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Academic Session & Section Info */}
        <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              Semester:
            </span>
            <span className="font-medium text-foreground">
              {semester.name} {semester.year}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" />
              Capacity:
            </span>
            <span className="font-medium text-foreground">
              {offering.capacity} Students
            </span>
          </div>
        </div>

        {/* Tuition Fee */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-muted-foreground">Tuition Fee:</span>
          <span className="font-mono font-semibold text-foreground">
            ৳ {offering.fee ? Number(offering.fee).toLocaleString() : "0"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <CourseDetailsModal enrollment={enrollment} />

        <div className="flex items-center gap-2">
          {isPaymentPending && (
            <Button
              size="sm"
              render={<Link href="/student/payments" />}
            >
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
                <Button
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 />
                  Drop
                </Button>
              }
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default CourseEnrollmentCard;
