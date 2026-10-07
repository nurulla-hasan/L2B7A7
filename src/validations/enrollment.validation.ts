import { z } from "zod";

export const updateEnrollmentStatusSchema = z.object({
  status: z.enum(["PENDING_PAYMENT", "ENROLLED", "DROPPED"], {
    error: "Status must be PENDING_PAYMENT, ENROLLED, or DROPPED",
  }),
});

export type UpdateEnrollmentStatusFormValues = z.infer<
  typeof updateEnrollmentStatusSchema
>;
