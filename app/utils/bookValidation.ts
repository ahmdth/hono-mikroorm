import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const bookValidation = zValidator('json',
  z.object({
    title: z.string(),
    authorId: z.number(),
    publisherId: z.optional(z.number()),
    metaObject: z.optional(z.object({ value: z.any() })),
    metaArray: z.optional(z.array(z.any())),
    metaArrayOfStrings: z.optional(z.string())
  })
)