import type { Metadata } from "next";
import { MediaManager } from "@/components/admin/media-manager";

export const metadata: Metadata = {
  title: "Media library",
  robots: { index: false, follow: false },
};

export default function MediaPage() {
  return <MediaManager />;
}
