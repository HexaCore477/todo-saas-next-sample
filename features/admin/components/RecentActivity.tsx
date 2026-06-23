"use client";

import { useEffect, useState } from "react";
import { getRecentActivityAction } from "../actions/adminAction";

interface RecentActivityData {
  recentLists: Array<{
    id: string;
    name: string;
    created_at: string;
    user_id: string;
  }>;
  recentTodos: Array<{
    id: string;
    title: string;
    status: string;
    updated_at: string;
  }>;
}

export default function RecentActivity() {
  const [activity, setActivity] = useState<RecentActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivity = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecentActivityAction();
        setActivity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load activity");
      } finally {
        setIsLoading(false);
      }
    };

    loadActivity();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          ))}
        </div>
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

  if (!activity) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Lists */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Lists
        </h3>
        <ul className="space-y-3">
          {activity.recentLists.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400 text-sm">No recent lists</li>
          ) : (
            activity.recentLists.map((list) => (
              <li key={list.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <span className="text-gray-900 dark:text-white font-medium">{list.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(list.created_at)}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Recent Todos */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <ul className="space-y-3">
          {activity.recentTodos.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</li>
          ) : (
            activity.recentTodos.map((todo) => (
              <li key={todo.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">{todo.title}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 capitalize">
                    {todo.status === "in_progress" ? "In Progress" : todo.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(todo.updated_at)}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
