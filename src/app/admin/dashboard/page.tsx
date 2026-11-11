import type { Metadata } from "next";
import { Overview } from "@/components/admin/overview";

export const metadata: Metadata = {
  title: "Overview",
  robots: { index: false, follow: false },
};

export default function DashboardOverviewPage() {
  return <Overview />;
}
