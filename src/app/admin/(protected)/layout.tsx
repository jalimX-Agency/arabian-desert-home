import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
export const metadata = { title: "Admin — Arabian Desert Home" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
