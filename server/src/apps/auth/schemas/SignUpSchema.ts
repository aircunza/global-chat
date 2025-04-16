import { z } from "zod";

export const SignUpSchema = z.object({
  id: z
    .string()
    .uuid({ message: "It should be a valid UUID" })
    .min(1, { message: "Id is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(4, {
    message: "Password is required. It should be at least 4 characters",
  }),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
