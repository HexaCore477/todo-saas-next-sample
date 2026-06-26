"use client";

import { signupAction } from "../actions/authAction";
import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema, type SignupFormValues } from "@/lib/schema/signupSchema";

export default function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });


  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);

    const formData = new FormData();

    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    try {
      await signupAction(formData);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An error occurred"
      );
    }
  };


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create Account
        </h2>


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          {serverError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">
                {serverError}
              </p>
            </div>
          )}


          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="you@example.com"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>


          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="••••••••"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>


          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="••••••••"
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>


          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>

        </form>


        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}