import { createClient } from "@/lib/supabase/server";
import { 
  Todo, 
  TodoList, 
  CreateTodoInput, 
  UpdateTodoInput, 
  CreateTodoListInput, 
  UpdateTodoListInput 
} from "../models/todo";
import { UserRole } from "@/features/auth/models/user";

const LISTS_TABLE = "todo_lists";
const TODOS_TABLE = "todos";

// --- Todo List Operations ---

export async function createTodoList(userId: string, input: CreateTodoListInput): Promise<TodoList> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(LISTS_TABLE)
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description || null,
      color: input.color || '#3b82f6',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getTodoLists(userId: string, role: UserRole): Promise<TodoList[]> {
  const supabase = await createClient();
  let query = supabase.from(LISTS_TABLE).select("*");
  
  // If not admin, restrict to own lists
  if (role !== 'admin') {
    query = query.eq("user_id", userId);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteTodoList(listId: string, userId: string, role: UserRole): Promise<void> {
  const supabase = await createClient();
  let query = supabase.from(LISTS_TABLE).delete().eq("id", listId);
  
  // If not admin, restrict to own lists
  if (role !== 'admin') {
    query = query.eq("user_id", userId);
  }
  
  const { error } = await query;
  if (error) throw new Error(error.message);
}

// --- Todo Operations ---

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TODOS_TABLE)
    .insert({
      list_id: input.list_id,
      title: input.title,
      description: input.description || null,
      priority: input.priority || 'medium',
      status: input.status || 'todo',
      category: input.category || 'general',
      due_date: input.due_date || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getTodosByList(listId: string, userId: string, role: UserRole): Promise<Todo[]> {
  const supabase = await createClient();
  
  // First verify list access if not admin
  if (role !== 'admin') {
    const { data: list, error: listError } = await supabase
      .from(LISTS_TABLE)
      .select("id")
      .eq("id", listId)
      .eq("user_id", userId)
      .single();
    
    if (listError || !list) throw new Error("Access denied to this list");
  }

  const { data, error } = await supabase
    .from(TODOS_TABLE)
    .select("*")
    .eq("list_id", listId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateTodo(
  todoId: string,
  input: UpdateTodoInput,
  userId: string,
  role: UserRole
): Promise<Todo> {
  const supabase = await createClient();
  
  // If not admin, verify ownership through list
  if (role !== 'admin') {
    const { data: todo, error: todoError } = await supabase
      .from(TODOS_TABLE)
      .select("list_id")
      .eq("id", todoId)
      .single();
    
    if (todoError || !todo) throw new Error("Todo not found");

    const { data: list, error: listError } = await supabase
      .from(LISTS_TABLE)
      .select("id")
      .eq("id", todo.list_id)
      .eq("user_id", userId)
      .single();
    
    if (listError || !list) throw new Error("Access denied");
  }

  const { data, error } = await supabase
    .from(TODOS_TABLE)
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", todoId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTodo(todoId: string, userId: string, role: UserRole): Promise<void> {
  const supabase = await createClient();
  
  // If not admin, verify ownership
  if (role !== 'admin') {
    const { data: todo, error: todoError } = await supabase
      .from(TODOS_TABLE)
      .select("list_id")
      .eq("id", todoId)
      .single();
    
    if (todoError || !todo) throw new Error("Todo not found");

    const { data: list, error: listError } = await supabase
      .from(LISTS_TABLE)
      .select("id")
      .eq("id", todo.list_id)
      .eq("user_id", userId)
      .single();
    
    if (listError || !list) throw new Error("Access denied");
  }

  const { error } = await supabase
    .from(TODOS_TABLE)
    .delete()
    .eq("id", todoId);

  if (error) throw new Error(error.message);
}
