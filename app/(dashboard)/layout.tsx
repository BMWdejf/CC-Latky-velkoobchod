import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.ADMIN) redirect("/account");

  const userName = session.user.name ?? session.user.email;
  const userEmail = session.user.email;

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar userName={userName} userEmail={userEmail} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
