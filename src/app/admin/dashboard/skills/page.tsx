import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Skills",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.skills;

export default function SkillsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Skills"
        description="The tools and disciplines in your toolkit — grouped, weighted, and shown on the capabilities section."
      />
      <CollectionManager {...config} />
    </div>
  );
}
