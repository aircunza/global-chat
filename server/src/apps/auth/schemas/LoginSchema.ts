import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(4, {
    message: "Password is required. It should be at least 4 characters",
  }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
