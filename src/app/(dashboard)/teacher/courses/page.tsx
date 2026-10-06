"use client";

import * as React from "react";
import Link from "next/link";
import { Users, Clock, MapPin, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockTeacherCourses = [
  {
    id: "off-1",
    code: "CSE-101",
    title: "Introduction to Computer Science & Programming",
    section: "Section A",
    credits: 3.0,
    semester: "Spring 2026",
    enrolled: 40,
    capacity: 40,
    schedule: "Sun, Tue (10:00 AM - 11:30 AM)",
    room: "Room 402, Academic Bldg 2",
    syllabus: "Variables, Conditionals, Loops, Functions, Arrays, Pointers & Recursion in C/C++.",
  },
  {
    id: "off-2",
    code: "CSE-202",
    title: "Data Structures & Algorithms",
    section: "Section B",
    credits: 3.0,
    semester: "Spring 2026",
    enrolled: 38,
    capacity: 40,
    schedule: "Mon, Wed (01:00 PM - 02:30 PM)",
    room: "Lab 3, CS Department",
    syllabus: "Linked Lists, Stacks, Queues, Trees, Graphs, Sorting algorithms, Big-O Analysis.",
  },
  {
    id: "off-3",
    code: "CSE-305",
    title: "Computer Architecture",
    section: "Section A",
    credits: 3.0,
    semester: "Spring 2026",
    enrolled: 36,
    capacity: 35,
    schedule: "Sun, Tue (02:00 PM - 03:30 PM)",
    room: "Room 501, Academic Bldg 1",
    syllabus: "Instruction set design, ALU, Datapath & Control, Pipelining, Memory hierarchy & Cache.",
  },
];

export default function TeacherCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Teaching Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Course sections assigned to you for the Spring 2026 semester.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeacherCourses.map((c) => (
          <Card key={c.id} className="shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs font-semibold">
                  {c.code}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {c.section}
                </Badge>
              </div>
              <CardTitle className="text-base font-semibold leading-snug mt-2">
                {c.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {c.semester} • {c.credits} Credits
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <p className="text-muted-foreground line-clamp-2">{c.syllabus}</p>

              <div className="space-y-1.5 p-2.5 rounded-lg bg-muted/40">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5 text-primary shrink-0" />
                  <span>{c.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span>{c.room}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-3.5 text-primary shrink-0" />
                  <span className="font-medium text-foreground">
                    {c.enrolled} / {c.capacity} Students Enrolled
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <Button size="sm" variant="outline" render={<Link href={`/teacher/students?offeringId=${c.id}`} />}>
                  Student Roster
                </Button>
                <Button size="sm" render={<Link href={`/teacher/grades?offeringId=${c.id}`} />}>
                  Enter Grades <ArrowRight className="size-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
