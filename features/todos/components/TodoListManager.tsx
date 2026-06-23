"use client";

import { useState, useEffect } from "react";
import { getTodoListsAction, createTodoListAction, deleteTodoListAction } from "../actions/todoAction";
import { TodoList } from "../models/todo";

interface TodoListManagerProps {
  onListSelect: (listId: string) => void;
  selectedListId?: string;
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
];

export default function TodoListManager({ onListSelect, selectedListId }: TodoListManagerProps) {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);

  const loadLists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTodoListsAction();
      setLists(data);
      if (data.length > 0 && !selectedListId) {
        onListSelect(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lists");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    setIsCreating(true);
    setError(null);
    try {
      const newList = await createTodoListAction({
        name: newListName,
        color: selectedColor,
      });
      setLists([newList, ...lists]);
      onListSelect(newList.id);
      setNewListName("");
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create list");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm("Delete this list and all its todos?")) return;

    try {
      await deleteTodoListAction(listId);
      setLists(lists.filter((l) => l.id !== listId));
      if (selectedListId === listId && lists.length > 1) {
        const nextList = lists.find((l) => l.id !== listId);
        if (nextList) onListSelect(nextList.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete list");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">My Lists</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          + New
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreateList} className="bg-white dark:bg-slate-900 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full transition ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isCreating || !newListName.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded font-medium transition"
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-2 rounded font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {lists.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No lists yet. Create one to get started!</p>
        ) : (
          lists.map((list) => (
            <div
              key={list.id}
              onClick={() => onListSelect(list.id)}
              className={`p-3 rounded-lg cursor-pointer transition flex items-center justify-between ${
                selectedListId === list.id
                  ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"
                  : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: list.color }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{list.name}</p>
                  {list.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{list.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList(list.id);
                }}
                className="ml-2 px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
