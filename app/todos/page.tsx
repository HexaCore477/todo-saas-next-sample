import { redirect } from "next/navigation";
import { getCurrentUserData } from "@/features/auth/services/authService";
import ClientTodos from "./ClientTodos";

export default async function TodosPage() {
  console.log("🏢 [Employee] Checking Role inside the Todo Room (Server Component)");
  const user = await getCurrentUserData();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  return <ClientTodos />;
}
