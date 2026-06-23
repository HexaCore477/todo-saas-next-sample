"use client";

import { useEffect, useState } from "react";
import { getAllUsersAction, updateUserRoleAction, deleteUserAction } from "../actions/userAction";
import { UserData } from "../repositories/userRepository";
import { UserRole } from "@/features/auth/models/user";

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUsersAction();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRoleAction(userId, newRole);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user and all their data?")) return;

    try {
      await deleteUserAction(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          User Management
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Total Users: {users.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Lists
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Todos
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.full_name || "Unnamed User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {user.list_count}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {user.todo_count}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No users found
        </div>
      )}
    </div>
  );
}
