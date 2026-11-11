import type { Metadata } from "next";
import { MessagesManager } from "@/components/admin/messages-manager";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return <MessagesManager />;
}
