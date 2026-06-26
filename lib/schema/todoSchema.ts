import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  priority: z.enum(["low", "medium", "high", "urgent"]),

  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),

  due_date: z.string().optional(),
});

export type TodoFormValues = z.infer<typeof todoSchema>;