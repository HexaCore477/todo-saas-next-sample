import { createClient } from "@/lib/supabase/server";

export async function loginUser(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signupUser(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signUp({
    email,
    password,
    // options: {
    //   emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    // },
  });
}

export async function logoutUser() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    ...user,
    role: profile?.role || 'user'
  };
}
