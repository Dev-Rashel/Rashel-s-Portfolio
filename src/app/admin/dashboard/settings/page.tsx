import type { Metadata } from "next";
import { SettingsManager } from "@/components/admin/settings-manager";

export const metadata: Metadata = {
  title: "Website settings",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <SettingsManager />;
}
