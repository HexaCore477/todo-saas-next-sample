"use client";

import { useState, useEffect } from "react";
import LogoutButton from "@/features/auth/components/LogoutButton";
import AdminStats from "@/features/admin/components/AdminStats";
import RecentActivity from "@/features/admin/components/RecentActivity";
import UserManagement from "@/features/admin/components/UserManagement";
import AdminProtected from "@/features/admin/components/AdminProtected";
import Link from "next/link";

export default function AdminPage() {
  return (
    <AdminProtected>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 shadow-md border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Platform Overview & Management
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {/* Stats Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Platform Statistics
              </h2>
              <AdminStats />
            </section>

            {/* Activity Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <RecentActivity />
            </section>

            {/* User Management Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                User Management
              </h2>
              <UserManagement />
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 TodoSaaS Admin. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AdminProtected>
  );
}
