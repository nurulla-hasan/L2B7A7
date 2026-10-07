"use client";

import * as React from "react";
import Image from "next/image";
import {
  Eye,
  Calendar,
  GraduationCap,
  Clock,
  Layers,
  User,
  Mail,
  Phone,
  Users,
  Banknote,
  BookOpen,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetCourseOfferingById,
  useGetOfferingEnrollments,
} from "@/services";
import { formatDate } from "@/lib/utils";
import type { CourseOfferingItem } from "@/types";

interface CourseOfferingDetailsModalProps {
  offering: CourseOfferingItem;
  trigger?: React.ReactNode;
}

export function CourseOfferingDetailsModal({
  offering: initialOffering,
  trigger,
}: CourseOfferingDetailsModalProps) {
  const [open, setOpen] = React.useState(false);
  const [activeImage, setActiveImage] = React.useState<string | null>(null);

  const { data: response, isLoading } = useGetCourseOfferingById(
    initialOffering.id,
    open,
  );

  const { data: rosterRes, isLoading: isLoadingRoster } =
    useGetOfferingEnrollments(initialOffering.id, open);

  const offering = response?.data ?? initialOffering;
  const roster = rosterRes?.data ?? [];
  const course = offering.course;
  const semester = offering.semester;
  const teacher = offering.teacher;
  const images = course.images ?? [];

  const enrolled = offering._count?.enrollments ?? 0;
  const capacity = offering.capacity;
  const fillPercentage = Math.min(
    100,
    Math.round((enrolled / (capacity || 1)) * 100),
  );
  const isFull = enrolled >= capacity;

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      title="View Offering Details"
    >
      <Eye />
      <span className="sr-only">View course offering details</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Course Offering Details"
      description="Comprehensive curriculum overview, semester timeline, seat allocation, and faculty assignment."
      actionTrigger={trigger ?? defaultTrigger}
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner className="size-6 text-primary" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Course Card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {course.code}
                  </Badge>
                  <Badge variant="default" size="sm">
                    {course.credits} Credits
                  </Badge>
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="font-mono font-medium"
                  >
                    Section {offering.section}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {course.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <Clock className="size-3.5" />
                <span>Offered {formatDate(offering.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Seat Capacity Card */}
            <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="size-3.5 text-primary" />
                  Seat Allocation
                </span>
                <Badge
                  variant={isFull ? "destructive" : "outline"}
                  size="sm"
                  className="text-[10px]"
                >
                  {isFull ? "Class Full" : "Open"}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-foreground">
                    {enrolled}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {capacity}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {fillPercentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isFull ? "bg-destructive" : "bg-primary"
                    }`}
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tuition Fee Card */}
            <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Banknote className="size-3.5 text-emerald-500" />
                <span>Tuition Fee</span>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  ৳{offering.fee.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Per enrolled student
                </p>
              </div>
            </div>

            {/* Section Card */}
            <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <BookOpen className="size-3.5 text-blue-500" />
                <span>Section ID</span>
              </div>
              <div>
                <p className="text-lg font-bold font-mono text-foreground">
                  {offering.section}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Regular Academic Cohort
                </p>
              </div>
            </div>
          </div>

          {/* Academic Schedule & Assigned Faculty */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Semester Details */}
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Calendar className="size-3.5 text-primary" />
                <span>Academic Semester</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {semester.name} {semester.year}
                </p>
                <p className="text-xs text-muted-foreground">
                  Duration: {formatDate(semester.startDate)} -{" "}
                  {formatDate(semester.endDate)}
                </p>
              </div>
            </div>

            {/* Assigned Faculty */}
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <GraduationCap className="size-3.5 text-primary" />
                <span>Assigned Faculty</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <User className="size-3.5 text-muted-foreground shrink-0" />
                  <p className="text-sm font-semibold text-foreground">
                    {teacher.name}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3 text-muted-foreground shrink-0" />
                  <a
                    href={`mailto:${teacher.email}`}
                    className="hover:underline hover:text-primary"
                  >
                    {teacher.email}
                  </a>
                </div>
                {teacher.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="size-3 text-muted-foreground shrink-0" />
                    <a
                      href={`tel:${teacher.phone}`}
                      className="hover:underline hover:text-primary"
                    >
                      {teacher.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enrolled Students Roster */}
          <div className="space-y-2.5">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Users className="size-3.5 text-primary" />
              Enrolled Students Roster ({roster.length})
            </h4>

            {isLoadingRoster ? (
              <div className="flex h-16 items-center justify-center">
                <Spinner className="size-4 text-primary" />
              </div>
            ) : roster.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-3.5 text-center text-xs text-muted-foreground">
                No students currently enrolled in this course section.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {roster.map((enr) => (
                  <div
                    key={enr.id}
                    className="flex flex-col gap-2 rounded-lg border border-border bg-card p-2.5 sm:flex-row sm:items-center sm:justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        {enr.student.imageUrl && (
                          <AvatarImage
                            src={enr.student.imageUrl}
                            alt={enr.student.name}
                          />
                        )}
                        <AvatarFallback>
                          {enr.student.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {enr.student.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {enr.student.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {enr.student.studentProfile?.studentId && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          ID: {enr.student.studentProfile.studentId}
                        </span>
                      )}
                      <Badge
                        variant={
                          enr.status === "ENROLLED"
                            ? "default"
                            : enr.status === "PENDING_PAYMENT"
                              ? "secondary"
                              : "destructive"
                        }
                        size="sm"
                        className="text-[10px]"
                      >
                        {enr.status === "PENDING_PAYMENT"
                          ? "Pending"
                          : enr.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images Gallery if course has images */}
          {images.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Layers className="size-3.5" />
                Course Materials & Cover Images ({images.length})
              </h4>

              {activeImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                  <Image
                    src={activeImage}
                    alt={course.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {images.map((imgUrl, i) => (
                  <button
                    key={imgUrl + i}
                    type="button"
                    onClick={() =>
                      setActiveImage(activeImage === imgUrl ? null : imgUrl)
                    }
                    className={`group relative aspect-video cursor-pointer overflow-hidden rounded-lg border transition-all ${
                      activeImage === imgUrl
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

export default CourseOfferingDetailsModal;
