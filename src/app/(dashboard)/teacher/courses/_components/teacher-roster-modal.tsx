"use client";

import * as React from "react";
import Link from "next/link";
import { Users, Mail, ArrowRight, UserCheck, AlertCircle } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOfferingEnrollments } from "@/services";
import { formatDate, getInitials } from "@/lib/utils";
import type { CourseOfferingItem } from "@/types";

interface TeacherRosterModalProps {
  offering: CourseOfferingItem;
  trigger?: React.ReactNode;
}

export function TeacherRosterModal({
  offering,
  trigger,
}: TeacherRosterModalProps) {
  const [open, setOpen] = React.useState(false);

  const { data: response, isLoading, isError } = useGetOfferingEnrollments(
    offering.id,
    open
  );

  const enrollments = response?.data ?? [];
  const course = offering.course;

  const defaultTrigger = (
    <Button variant="outline" title="Student Roster">
      <Users />
      Roster
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title={`Class Roster • ${course.code} (Section ${offering.section})`}
      description={`Official student enrollment roll for ${offering.semester.name} ${offering.semester.year}.`}
      actionTrigger={trigger ?? defaultTrigger}
      showClose
    >
      <div className="space-y-4 text-xs">
        {/* Header summary */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span className="font-semibold text-foreground">
              {course.title}
            </span>
          </div>
          <Badge variant="outline" className="font-mono">
            {enrollments.length} / {offering.capacity} Enrolled
          </Badge>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-2 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <AlertCircle className="size-8 text-destructive mb-2" />
            <p className="font-medium text-foreground">
              Failed to load class roster
            </p>
            <p className="text-[11px]">
              Please check your connection and try again.
            </p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            <UserCheck className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-medium text-foreground">
              No students enrolled yet
            </p>
            <p className="text-[11px]">
              Students who register for Section {offering.section} will appear
              here automatically.
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {enrollments.map((item, index) => {
              const student = item.student;
              const profile = student?.studentProfile;
              const isEnrolled = item.status === "ENROLLED";

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-muted-foreground w-4 text-right shrink-0">
                      {index + 1}.
                    </span>

                    <Avatar size="sm">
                      {student?.imageUrl && (
                        <AvatarImage
                          src={student.imageUrl}
                          alt={student.name}
                        />
                      )}
                      <AvatarFallback>
                        {getInitials(student?.name ?? "Student")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {student?.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {profile?.studentId && (
                          <span className="font-mono font-medium text-primary">
                            ID: {profile.studentId}
                          </span>
                        )}
                        {student?.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="size-3 shrink-0" />
                            {student.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge
                      variant={
                        isEnrolled
                          ? "success"
                          : item.status === "PENDING_PAYMENT"
                          ? "pending"
                          : "destructive"
                      }
                      size="sm"
                    >
                      {item.status === "PENDING_PAYMENT"
                        ? "Pending"
                        : item.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-border">
          <Button
            render={<Link href={`/teacher/grades?offeringId=${offering.id}`} />}
          >
            Enter Grades
            <ArrowRight />
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default TeacherRosterModal;
