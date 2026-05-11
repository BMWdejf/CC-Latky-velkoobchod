import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { AccountSidebar } from "@/components/account/sidebar";
import { AccountTopbar } from "@/components/account/topbar";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  if (!session) redirect("/auth/login");
  if (session.user.role !== USER_ROLES.CUSTOMER) redirect("/dashboard");

  const userName = session.user.name ?? session.user.email;
  const userEmail = session.user.email;

  return (
    <div className="flex h-screen">
      <AccountSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AccountTopbar userName={userName} userEmail={userEmail} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
