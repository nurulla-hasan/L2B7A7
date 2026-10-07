import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const courseInputSchema = z.object({
  title: z
    .string({
      error: "Course title is required",
    })
    .min(2, "Course title must be at least 2 characters")
    .max(100, "Course title must not exceed 100 characters")
    .trim(),
  code: z
    .string({
      error: "Course code is required",
    })
    .min(2, "Course code must be at least 2 characters")
    .max(20, "Course code must not exceed 20 characters")
    .trim(),
  credits: z
    .number({
      error: "Credits must be a number",
    })
    .min(0.5, "Credits must be at least 0.5")
    .max(30, "Credits cannot exceed 30"),
});

export const courseFormSchema = courseInputSchema.extend({
  images: z
    .array(
      z.custom<File>(
        (val) => typeof window !== "undefined" && val instanceof File,
        "Invalid file uploaded"
      )
    )
    .max(5, "Maximum 5 images allowed")
    .refine(
      (files) => files.every((f) => f.size <= MAX_IMAGE_SIZE),
      "Each image must be less than 5MB"
    )
    .refine(
      (files) => files.every((f) => ALLOWED_IMAGE_TYPES.includes(f.type)),
      "Only JPEG, PNG, and WebP images are allowed"
    )
    .optional(),
});

export type CourseInput = z.infer<typeof courseInputSchema>;
export type CourseFormInput = z.infer<typeof courseFormSchema>;
