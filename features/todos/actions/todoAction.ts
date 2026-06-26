"use server";

import { getCurrentUserData } from "@/features/auth/services/authService";
import * as service from "../services/todoService";
import { 
  CreateTodoInput, 
  UpdateTodoInput, 
  CreateTodoListInput 
} from "../models/todo";
import { revalidatePath } from "next/cache";
import { todoListSchema, todoSchema, updateTodoSchema } from "../schemas/todoSchema";

// --- Todo List Actions ---

export async function createTodoListAction(input: CreateTodoListInput) {
  const user = await getCurrentUserData();
  if (!user) throw new Error("User not authenticated");

  // Validate input
  const validation = todoListSchema.safeParse(input);
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }
  
  const list = await service.createTodoListService(user.id, input);
  revalidatePath("/todos");
  return list;
}

export async function getTodoListsAction() {
  const user = await getCurrentUserData();
  if (!user) throw new Error("User not authenticated");
  
  return service.getTodoListsService(user.id, user.role);
}

export async function deleteTodoListAction(listId: string) {
  const user = await getCurrentUserData();
  if (!user) throw new Error("User not authenticated");
  
  await service.deleteTodoListService(listId, user.id, user.role);
  revalidatePath("/todos");
}

// --- Todo Actions ---

export async function createTodoAction(input: CreateTodoInput) {
  console.log("🛠️ [Worker] Performing 'Create Todo' task (Server Action)");
  const user = await getCurrentUserData();
  if (!user) throw new Error("User not authenticated");

  // Validate input
  const validation = todoSchema.safeParse(input);
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }
  
  const todo = await service.createTodoService(input);
  revalidatePath("/todos");
  return todo;
}

export async function getTodosByListAction(listId: string) {
  const user = await getCurrentUserData();
  if (!user) throw new Error("User not authenticated");
  
  return service.getTodosByListService(listId, user.id, user.role);
}

export async function updateTodoAction(todoId: string, input: UpdateTodoInput) {
  const user = await getCurrentUserData();
  if (!user) throw new Error("User not authenticated");

  // Validate input
  const validation = updateTodoSchema.safeParse(input);
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }
  
  const todo = await service.updateTodoService(todoId, input, user.id, user.role);
  revalidatePath("/todos");
  return todo;
}

export async function deleteTodoAction(todoId: string) {
  const user = await getCurrentUserData();
  if (!user) throw new Error("User not authenticated");
  
  await service.deleteTodoService(todoId, user.id, user.role);
  revalidatePath("/todos");
}
