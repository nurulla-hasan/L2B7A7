"use client";

import * as React from "react";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const myEnrolledCourses = [
  {
    id: "enr-1",
    code: "CSE-101",
    title: "Introduction to Computer Science & Programming",
    instructor: "Dr. Golap Hasan",
    credits: 3.0,
    section: "Section A",
    schedule: "Sun, Tue (10:00 AM - 11:30 AM)",
    room: "Room 402, Academic Bldg 2",
    attendance: "94%",
    status: "ENROLLED" as const,
  },
  {
    id: "enr-2",
    code: "CSE-202",
    title: "Data Structures & Algorithms",
    instructor: "Prof. Sarah Ahmed",
    credits: 3.0,
    section: "Section B",
    schedule: "Mon, Wed (01:00 PM - 02:30 PM)",
    room: "Lab 3, CS Department",
    attendance: "88%",
    status: "ENROLLED" as const,
  },
  {
    id: "enr-3",
    code: "MAT-101",
    title: "Calculus & Linear Algebra",
    instructor: "Dr. K. M. Rahman",
    credits: 3.0,
    section: "Section A",
    schedule: "Sun, Tue (08:30 AM - 10:00 AM)",
    room: "Room 301, Academic Bldg 1",
    attendance: "96%",
    status: "ENROLLED" as const,
  },
  {
    id: "enr-4",
    code: "PHY-102",
    title: "General Physics I",
    instructor: "Dr. Farhana Islam",
    credits: 3.0,
    section: "Section C",
    schedule: "Mon, Wed (10:00 AM - 11:30 AM)",
    room: "Science Bldg Lab 1",
    attendance: "90%",
    status: "ENROLLED" as const,
  },
];

export default function StudentMyCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Enrolled Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Spring 2026 Semester • 4 Courses • 12 Credit Hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {myEnrolledCourses.map((c) => (
          <Card key={c.id} className="shadow-xs hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs font-semibold">
                    {c.code}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{c.credits} Credits</span>
                </div>
                <Badge variant="success" className="gap-1 text-[11px]">
                  <CheckCircle2 className="size-3" /> Enrolled
                </Badge>
              </div>
              <CardTitle className="text-base font-semibold leading-snug mt-2">
                {c.title}
              </CardTitle>
              <CardDescription className="text-xs">
                Instructor: <strong className="text-foreground">{c.instructor}</strong> • {c.section}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2.5 text-xs pt-0">
              <div className="p-3 rounded-lg bg-muted/40 space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5 text-primary shrink-0" />
                  <span>{c.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span>{c.room}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Your Attendance:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {c.attendance}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
