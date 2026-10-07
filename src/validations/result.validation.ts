import { z } from "zod";

export const updateResultMarksSchema = z.object({
  marks: z.coerce
    .number({
      error: "Marks must be a valid number",
    })
    .min(0, "Marks cannot be less than 0")
    .max(100, "Marks cannot exceed 100"),
  published: z.boolean().optional(),
});

export type UpdateResultMarksFormValues = z.infer<
  typeof updateResultMarksSchema
>;
