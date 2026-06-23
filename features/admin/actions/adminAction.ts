"use server";

import { getCurrentUserData } from "@/features/auth/services/authService";
import { getAdminStatsService, getRecentActivityService } from "../services/adminService";

// This should be protected - only admins should access
export async function getAdminStatsAction() {
  const user = await getCurrentUserData();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // TODO: Add admin role check here
  return getAdminStatsService();
}

export async function getRecentActivityAction() {
  const user = await getCurrentUserData();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // TODO: Add admin role check here
  return getRecentActivityService();
}
