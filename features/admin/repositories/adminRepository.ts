import { createClient } from "@/lib/supabase/server";

export interface AdminStats {
  totalUsers: number;
  totalLists: number;
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  // Get total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Get total lists
  const { count: totalLists } = await supabase
    .from("todo_lists")
    .select("*", { count: "exact", head: true });

  // Get total todos
  const { count: totalTodos } = await supabase
    .from("todos")
    .select("*", { count: "exact", head: true });

  // Get completed todos
  const { count: completedTodos } = await supabase
    .from("todos")
    .select("*", { count: "exact", head: true })
    .eq("status", "done");

  // Get pending todos
  const { count: pendingTodos } = await supabase
    .from("todos")
    .select("*", { count: "exact", head: true })
    .in("status", ["todo", "in_progress"]);

  return {
    totalUsers: totalUsers || 0,
    totalLists: totalLists || 0,
    totalTodos: totalTodos || 0,
    completedTodos: completedTodos || 0,
    pendingTodos: pendingTodos || 0,
  };
}

export async function getRecentActivity() {
  const supabase = await createClient();

  // Get recently created lists
  const { data: recentLists } = await supabase
    .from("todo_lists")
    .select("id, name, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get recently completed todos
  const { data: recentTodos } = await supabase
    .from("todos")
    .select("id, title, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(5);

  return {
    recentLists: recentLists || [],
    recentTodos: recentTodos || [],
  };
}
