import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const paginationValidation = zValidator('query', z.object({
  page: z.optional(z.number()),
  limit: z.optional(z.string().transform((val, ctx) => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Not a number",
      });
      return z.NEVER;
    }
    return parsed;
  }))
}))

export const idValidation = zValidator('param', z.object({ id: z.number() }))