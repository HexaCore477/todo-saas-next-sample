import SignupForm from "@/features/auth/components/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TodoSaaS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get organized and boost your productivity
          </p>
        </div>

        <SignupForm />

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
