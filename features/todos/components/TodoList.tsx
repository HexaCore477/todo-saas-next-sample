"use client";

import { useState, useEffect } from "react";
import { getTodosByListAction, updateTodoAction, deleteTodoAction } from "../actions/todoAction";
import { Todo, Status, Priority } from "../models/todo";

interface TodoListProps {
  listId?: string;
  refreshTrigger?: number;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  high: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  urgent: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const STATUS_COLORS: Record<Status, string> = {
  todo: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
  in_progress: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  done: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
};

export default function TodoList({ listId, refreshTrigger }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    if (!listId) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getTodosByListAction(listId);
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [listId, refreshTrigger]);

  const handleStatusChange = async (todo: Todo, newStatus: Status) => {
    try {
      await updateTodoAction(todo.id, { status: newStatus });
      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTodoAction(todoId);
      setTodos(todos.filter((t) => t.id !== todoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  };

  if (!listId) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Select a list to view its tasks
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
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

  if (todos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No tasks yet. Create one to get started!
        </p>
      </div>
    );
  }

  const todosByStatus = {
    todo: todos.filter((t) => t.status === "todo"),
    in_progress: todos.filter((t) => t.status === "in_progress"),
    done: todos.filter((t) => t.status === "done"),
  };

  return (
    <div className="space-y-6">
      {(["todo", "in_progress", "done"] as const).map((status) => (
        <div key={status}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">
            {status === "in_progress" ? "In Progress" : status}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({todosByStatus[status].length})
            </span>
          </h3>

          <div className="space-y-3">
            {todosByStatus[status].length === 0 ? (
              <p className="text-gray-400 dark:text-gray-600 text-sm italic">
                No tasks in this status
              </p>
            ) : (
              todosByStatus[status].map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {todo.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[todo.priority]}`}>
                          {todo.priority}
                        </span>
                      </div>

                      {todo.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {todo.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-gray-500 dark:text-gray-500">
                          {todo.category}
                        </span>
                        {todo.due_date && (
                          <span className="text-gray-500 dark:text-gray-500">
                            Due: {new Date(todo.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span className="text-gray-500 dark:text-gray-500">
                          {new Date(todo.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <select
                        value={todo.status}
                        onChange={(e) => handleStatusChange(todo, e.target.value as Status)}
                        className={`text-xs px-2 py-1 rounded font-medium border-0 cursor-pointer ${STATUS_COLORS[todo.status]}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded font-medium text-xs transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
