"use server";

import { getAdminStats, getRecentActivity } from "../repositories/adminRepository";

export async function getAdminStatsService() {
  return getAdminStats();
}

export async function getRecentActivityService() {
  return getRecentActivity();
}
