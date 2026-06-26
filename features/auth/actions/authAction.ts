"use server";

import { login, signup, logout, getCurrentUserData } from "../services/authService";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "../schemas/authSchema";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate input
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  try {
    await login(email, password);
    const user = await getCurrentUserData();
    
    // Redirect based on user role
    if (user?.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/todos");
    }
  } catch (error) {
    throw error;
  }
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate input
  const validation = signupSchema.safeParse({ email, password, confirmPassword });
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  try {
    await signup(email, password);
    redirect("/todos");
  } catch (error) {
    throw error;
  }
}

export async function logoutAction() {
  try {
    await logout();
    redirect("/login");
  } catch (error) {
    throw error;
  }
}
