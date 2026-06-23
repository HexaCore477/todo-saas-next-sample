"use server";

import { login, signup, logout, getCurrentUserData } from "../services/authService";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
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
