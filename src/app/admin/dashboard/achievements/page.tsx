import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Achievements",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.achievements;

export default function AchievementsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Achievements"
        description="Milestones and recognition worth remembering — competitions, academics, and personal wins."
      />
      <CollectionManager {...config} />
    </div>
  );
}
