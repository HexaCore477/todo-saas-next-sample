"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createTodoAction } from "../actions/todoAction";
import { Priority } from "../models/todo";

import { todoSchema, type TodoFormValues } from "@/lib/schema/todoSchema";

interface TodoFormProps {
  listId?: string;
  onTodoCreated?: () => void;
}

export default function TodoForm({
  listId,
  onTodoCreated,
}: TodoFormProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),

    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "general",
      due_date: today,
    },
  });


  const onSubmit = async (data: TodoFormValues) => {

    if (!listId) {
      setServerError("Please select a list first");
      return;
    }

    setIsLoading(true);
    setServerError(null);


    try {

      await createTodoAction({
        list_id: listId,

        title: data.title,

        description:
          data.description || "",

        priority: data.priority as Priority,

        category: data.category,

        due_date:
          data.due_date || undefined,
      });

      reset({
        title: "",
        description: "",
        priority: "medium",
        category: "general",
        due_date: new Date().toISOString().split("T")[0],
      });
      onTodoCreated?.();
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Failed to create todo"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-6"
    >

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Add New Task
      </h3>


      {serverError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-700 dark:text-red-400 text-sm">
            {serverError}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div>

          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Title *
          </label>


          <input
            id="title"
            {...register("title")}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800"
            placeholder="What needs to be done?"
          />


          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}

        </div>



        {/* Description */}
        <div>

          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Description
          </label>


          <textarea
            id="description"
            {...register("description")}
            rows={2}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800"
            placeholder="Add more details..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        {/* Priority + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800"
            >
              <option value="low">
                Low
              </option>
              <option value="medium">
                Medium
              </option>
              <option value="high">
                High
              </option>
              <option value="urgent">
                Urgent
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            <input
              {...register("category")}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800"
              placeholder="work, personal"
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>
        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Due Date
          </label>
          <input
            type="date"
            {...register("due_date")}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800"
          />
        </div>





        <button
          type="submit"
          disabled={
            isLoading ||
            !listId
          }
          className="
            w-full 
            bg-blue-600 
            hover:bg-blue-700 
            disabled:bg-gray-400
            text-white
            font-semibold
            py-2
            px-4
            rounded-lg
          "
        >

          {
            isLoading
              ? "Creating..."
              : "Add Task"
          }

        </button>


      </div>

    </form>
  );
}