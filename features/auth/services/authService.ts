"use server";

import { loginUser, signupUser, logoutUser, getCurrentUser } from "../repositories/authRepository";
import { User, UserRole } from "../models/user";

export async function login(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data, error } = await loginUser(email, password);
  if (error) throw new Error(error.message);
  return data;
}

export async function signup(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const { data, error } = await signupUser(email, password);
  if (error) throw new Error(error.message);
  return data;
}

export async function logout() {
  const { error } = await logoutUser();
  if (error) throw new Error(error.message);
}

export async function getCurrentUserData(): Promise<(User & { role: UserRole }) | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || "",
    user_metadata: user.user_metadata,
    created_at: user.created_at,
    role: (user as any).role || 'user',
  };
}
