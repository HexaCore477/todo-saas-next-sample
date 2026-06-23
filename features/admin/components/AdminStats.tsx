"use client";

import { useEffect, useState } from "react";
import { getAdminStatsAction } from "../actions/adminAction";
import { AdminStats } from "../repositories/adminRepository";

export default function AdminStatsComponent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAdminStatsAction();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "blue" },
    { label: "Total Lists", value: stats.totalLists, color: "green" },
    { label: "Total Todos", value: stats.totalTodos, color: "purple" },
    { label: "Completed", value: stats.completedTodos, color: "emerald" },
    { label: "Pending", value: stats.pendingTodos, color: "orange" },
  ];

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((card) => (
        <div
          key={card.label}
          className={`rounded-lg shadow-md p-6 ${colorClasses[card.color]}`}
        >
          <p className="text-sm font-medium opacity-75">{card.label}</p>
          <p className="text-3xl font-bold mt-2">{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
