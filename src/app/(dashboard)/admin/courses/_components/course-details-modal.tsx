"use client";

import * as React from "react";
import Image from "next/image";
import { Eye, Calendar, GraduationCap, Clock, Layers } from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useGetCourseById } from "@/services";
import { formatDate } from "@/lib/utils";
import type { CourseItem } from "@/types";

interface CourseDetailsModalProps {
  course: CourseItem;
  trigger?: React.ReactNode;
}

export function CourseDetailsModal({
  course: initialCourse,
  trigger,
}: CourseDetailsModalProps) {
  const [open, setOpen] = React.useState(false);
  const [activeImage, setActiveImage] = React.useState<string | null>(null);

  const { data: response, isLoading } = useGetCourseById(
    initialCourse.id,
    open
  );

  const course = response?.data ?? initialCourse;
  const offerings = course.courseOfferings ?? [];
  const images = course.images ?? [];

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      title="View Course Details"
    >
      <Eye  />
      <span className="sr-only">View course details</span>
    </Button>
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Course Details"
      description="Comprehensive curriculum overview and assigned semester offerings."
      actionTrigger={trigger ?? defaultTrigger}
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner className="size-6 text-primary" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Info Card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {course.code}
                  </Badge>
                  <Badge variant="default" size="sm">
                    {course.credits} Credits
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {course.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                <span>Added {formatDate(course.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Images Gallery */}
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

          {/* Offerings History */}
          <div className="space-y-2.5">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <GraduationCap className="size-3.5" />
              Course Offerings ({offerings.length})
            </h4>

            {offerings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No active semester offerings configured yet.
              </div>
            ) : (
              <div className="space-y-2">
                {offerings.map((offering) => (
                  <div
                    key={offering.id}
                    className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {offering.semester.name} {offering.semester.year}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDate(offering.semester.startDate)} -{" "}
                          {formatDate(offering.semester.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" size="sm">
                        Faculty: {offering.teacher.name}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

export default CourseDetailsModal;
