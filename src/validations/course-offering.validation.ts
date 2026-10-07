import { z } from "zod";

export const courseOfferingFormSchema = z.object({
  courseId: z
    .string({
      error: "Please select a course",
    })
    .min(1, "Please select a course"),
  semesterId: z
    .string({
      error: "Please select a semester",
    })
    .min(1, "Please select a semester"),
  teacherId: z
    .string({
      error: "Please select a faculty member",
    })
    .min(1, "Please select a faculty member"),
  section: z
    .string({
      error: "Section name is required",
    })
    .min(1, "Section cannot be empty")
    .max(10, "Section name cannot exceed 10 characters")
    .trim(),
  capacity: z
    .number({
      error: "Capacity must be a number",
    })
    .int("Capacity must be an integer")
    .min(1, "Capacity must be at least 1")
    .max(500, "Capacity cannot exceed 500 seats"),
  fee: z
    .number({
      error: "Course fee must be a number",
    })
    .int("Fee must be an integer")
    .min(0, "Fee cannot be negative")
    .max(1000000, "Fee cannot exceed 1,000,000 BDT"),
});

export type CourseOfferingFormInput = z.infer<typeof courseOfferingFormSchema>;
