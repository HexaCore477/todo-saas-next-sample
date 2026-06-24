"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TodoForm from "@/features/todos/components/TodoForm";
import TodoList from "@/features/todos/components/TodoList";
import TodoListManager from "@/features/todos/components/TodoListManager";
import LogoutButton from "@/features/auth/components/LogoutButton";
import Link from "next/link";
import { getCurrentUserData } from "@/features/auth/services/authService";

export default function TodosPage() {
  const router = useRouter();
  const [selectedListId, setSelectedListId] = useState<string>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user = await getCurrentUserData();
        if (user?.role === "admin") {
          // Redirect admin users to admin page
          router.replace("/admin");
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserRole();
  }, [router]);

  const handleTodoCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              TodoSaaS
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Organize your tasks by lists and priorities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium">
                Admin
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lists */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 sticky top-8">
              <TodoListManager 
                onListSelect={setSelectedListId}
                selectedListId={selectedListId}
              />
            </div>
          </aside>

          {/* Main Content - Todos */}
          <div className="lg:col-span-3 space-y-6">
            {selectedListId && (
              <>
                <TodoForm listId={selectedListId} onTodoCreated={handleTodoCreated} />
                <TodoList listId={selectedListId} refreshTrigger={refreshTrigger} />
              </>
            )}
            {!selectedListId && (
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Create or select a list to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
