import { z } from "zod";

export const signupSchema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;