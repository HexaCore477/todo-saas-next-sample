import { z } from "zod";

export const todoListSchema = z.object({
  name: z.string().min(1, "List name is required").max(50, "List name is too long"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
});

export const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  list_id: z.string().uuid("Invalid list ID"),
});

export const updateTodoSchema = todoSchema.partial().omit({ list_id: true });

export type TodoListInput = z.infer<typeof todoListSchema>;
export type TodoInput = z.infer<typeof todoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
