import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          } catch {
            // ignore in Server Components if needed
          }
        },
      },
    }
  );
}

export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    // Fallback to anon key if service key is not available
    // In production, SUPABASE_SERVICE_ROLE_KEY must be set
    return createClient();
  }

  return createServerClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        getAll() { return []; },
        setAll() { },
      },
    }
  );
}