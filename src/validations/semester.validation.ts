import { z } from "zod";

const isValidDate = (val: string) => !Number.isNaN(Date.parse(val));

export const semesterFormSchema = z
  .object({
    name: z
      .string({
        error: "Semester name is required",
      })
      .min(2, "Semester name must be at least 2 characters"),
    year: z
      .number({
        error: "Year must be a number",
      })
      .int()
      .min(2020, "Year must be 2020 or later")
      .max(2099, "Year must be 2099 or earlier"),
    startDate: z
      .string({
        error: "Start date is required",
      })
      .refine(isValidDate, {
        message: "Start date must be a valid date (YYYY-MM-DD)",
      }),
    endDate: z
      .string({
        error: "End date is required",
      })
      .refine(isValidDate, {
        message: "End date must be a valid date (YYYY-MM-DD)",
      }),
  })
  .refine(
    (data) => new Date(data.startDate) < new Date(data.endDate),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type SemesterFormInput = z.infer<typeof semesterFormSchema>;
