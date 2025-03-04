import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const authorValidation = zValidator('json',
  z.object({
    name: z.string(),
    email: z.string().email(),
    age: z.optional(z.number()),
    termsAccepted: z.boolean(),
    born: z.optional(z.string().transform(v => new Date(v))),
    books: z.optional(z.array(z.object({
      title: z.string(),
      pages: z.number(),
      metaObject: z.optional(z.object({ value: z.any() })),
      metaArray: z.optional(z.array(z.any())),
      metaArrayOfStrings: z.optional(z.string())
    }))),
    favouriteBook: z.optional(z.object({
      title: z.string(),
      pages: z.number(),
      metaObject: z.optional(z.object({ value: z.any() })),
      metaArray: z.optional(z.array(z.any())),
      metaArrayOfStrings: z.optional(z.string())
    }))
  })
)