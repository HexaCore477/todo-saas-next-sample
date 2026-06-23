"use server";

import * as repo from "../repositories/userRepository";
import { UserRole } from "@/features/auth/models/user";

export async function getAllUsersService() {
  return repo.getAllUsers();
}

export async function updateUserRoleService(userId: string, newRole: UserRole) {
  return repo.updateUserRole(userId, newRole);
}

export async function deleteUserService(userId: string) {
  return repo.deleteUser(userId);
}

export async function getUserStatsService(userId: string) {
  return repo.getUserStats(userId);
}
