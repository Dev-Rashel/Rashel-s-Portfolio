import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/lib/models/ContactMessage";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToaster } from "@/components/admin/toast";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin");

  let unread = 0;
  try {
    await connectDB();
    unread = await ContactMessage.countDocuments({ read: false, archived: false });
  } catch (error) {
    console.error("[dashboard-layout]", error);
  }

  return (
    <>
      <AdminShell session={session} unread={unread}>
        {children}
      </AdminShell>
      <AdminToaster />
    </>
  );
}
