"use server";

import * as repo from "../repositories/todoRepository";
import { 
  CreateTodoInput, 
  UpdateTodoInput, 
  CreateTodoListInput, 
  Todo,
  TodoList
} from "../models/todo";
import { UserRole } from "@/features/auth/models/user";

// --- Todo List Services ---

export async function createTodoListService(userId: string, input: CreateTodoListInput): Promise<TodoList> {
  if (!input.name?.trim()) throw new Error("List name is required");
  return repo.createTodoList(userId, {
    ...input,
    name: input.name.trim(),
    description: input.description?.trim(),
  });
}

export async function getTodoListsService(userId: string, role: UserRole): Promise<TodoList[]> {
  return repo.getTodoLists(userId, role);
}

export async function deleteTodoListService(listId: string, userId: string, role: UserRole): Promise<void> {
  return repo.deleteTodoList(listId, userId, role);
}

// --- Todo Services ---

export async function createTodoService(input: CreateTodoInput): Promise<Todo> {
  if (!input.title?.trim()) throw new Error("Todo title is required");
  if (!input.list_id) throw new Error("List ID is required");
  
  return repo.createTodo({
    ...input,
    title: input.title.trim(),
    description: input.description?.trim(),
  });
}

export async function getTodosByListService(listId: string, userId: string, role: UserRole): Promise<Todo[]> {
  return repo.getTodosByList(listId, userId, role);
}

export async function updateTodoService(todoId: string, input: UpdateTodoInput, userId: string, role: UserRole): Promise<Todo> {
  return repo.updateTodo(todoId, input, userId, role);
}

export async function deleteTodoService(todoId: string, userId: string, role: UserRole): Promise<void> {
  return repo.deleteTodo(todoId, userId, role);
}
