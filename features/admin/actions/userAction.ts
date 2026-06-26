"use server";

import { getCurrentUserData } from "@/features/auth/services/authService";
import * as service from "../services/userService";
import { UserRole } from "@/features/auth/models/user";
import { revalidatePath } from "next/cache";

export async function getAllUsersAction() {
  const user = await getCurrentUserData();
  if (!user || user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return service.getAllUsersService();
}

export async function updateUserRoleAction(userId: string, newRole: UserRole) {
  const user = await getCurrentUserData();
  if (!user || user.role !== "admin") {
    throw new Error("Admin access required");
  }

  await service.updateUserRoleService(userId, newRole);
  revalidatePath("/admin");
}

export async function deleteUserAction(userId: string) {
  const user = await getCurrentUserData();
  if (!user || user.role !== "admin") {
    throw new Error("Admin access required");
  }

  // Prevent self-deletion
  if (user.id === userId) {
    throw new Error("Cannot delete your own account");
  }

  await service.deleteUserService(userId);
  revalidatePath("/admin");
}

export async function getUserStatsAction(userId: string) {
  const user = await getCurrentUserData();
  if (!user || user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return service.getUserStatsService(userId);
}