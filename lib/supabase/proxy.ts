import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: {user}} = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  
  // Allow public routes
  const publicRoutes = ["/", "/marketing", "/login", "/signup", "/forgot-password", "/reset-password"];
  
  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Role-based redirection
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = profile?.role || "user";

    // Redirect admins away from /todos
    if (pathname === "/todos" && userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Redirect non-admins away from /admin
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/todos", request.url));
    }
  }

  return response;
}