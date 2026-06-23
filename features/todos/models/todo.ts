export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in_progress' | 'done';

export interface TodoList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: string;
  list_id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  category: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoListInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateTodoListInput {
  name?: string;
  description?: string;
  color?: string;
}

export interface CreateTodoInput {
  list_id: string;
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  category?: string;
  due_date?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  category?: string;
  due_date?: string;
}
