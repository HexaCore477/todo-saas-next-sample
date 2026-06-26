import { z } from "zod";

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(["admin", "user"]),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
