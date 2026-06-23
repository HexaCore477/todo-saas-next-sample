"use client";

import { useEffect, useState } from "react";
import { getCurrentUserData } from "@/features/auth/services/authService";
import Link from "next/link";

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await getCurrentUserData();
        setIsAdmin(user?.role === "admin");
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You do not have permission to access the admin dashboard. Only administrators can view this page.
          </p>
          <Link
            href="/todos"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Go to Todos
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
