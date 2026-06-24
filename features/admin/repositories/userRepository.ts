import { createClient, createAdminClient } from "@/lib/supabase/server";
import { UserRole } from "@/features/auth/models/user";

export interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  list_count: number;
  todo_count: number;
}

export async function getAllUsers(): Promise<UserData[]> {
  // Use admin client to bypass RLS and see all profiles
  const supabase = await createAdminClient();

  // Fetch all profiles and filter in code to ensure visibility
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Filter for 'user' role in memory
  const filteredProfiles = (profiles || []).filter(p => p.role === "user");

  // Get user emails from auth
  const usersWithData: UserData[] = [];

  for (const profile of filteredProfiles) {
    // Get list count
    const { count: listCount } = await supabase
      .from("todo_lists")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id);

    // Get todo count via relational join
    const { count: todoCount } = await supabase
      .from("todos")
      .select("id, todo_lists!inner(user_id)", { count: "exact", head: true })
      .eq("todo_lists.user_id", profile.id);

    usersWithData.push({
      id: profile.id,
      email: "", // Will be fetched separately if needed
      full_name: profile.full_name,
      role: profile.role,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      list_count: listCount || 0,
      todo_count: todoCount || 0,
    });
  }

  return usersWithData;
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}

export async function deleteUser(userId: string): Promise<void> {
  const supabase = await createAdminClient();

  // Delete user's todos first (cascade should handle this)
  const { error: deleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (deleteError) throw new Error(deleteError.message);
}

export async function getUserStats(userId: string) {
  const supabase = await createAdminClient();

  // Get lists
  const { data: lists, error: listsError } = await supabase
    .from("todo_lists")
    .select("id")
    .eq("user_id", userId);

  if (listsError) throw new Error(listsError.message);

  const listIds = lists?.map((l) => l.id) || [];

  // Get todos
  const { data: todos, error: todosError } = await supabase
    .from("todos")
    .select("status")
    .in("list_id", listIds);

  if (todosError) throw new Error(todosError.message);

  const todoStats = {
    total: todos?.length || 0,
    completed: todos?.filter((t) => t.status === "done").length || 0,
    pending: todos?.filter((t) => t.status !== "done").length || 0,
  };

  return {
    listCount: listIds.length,
    todoStats,
  };
}
