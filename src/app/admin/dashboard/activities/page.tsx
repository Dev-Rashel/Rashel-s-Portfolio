import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Activities",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.activities;

export default function ActivitiesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Activities"
        description="Life beyond the code editor — competitions, workshops, community work, and events."
      />
      <CollectionManager {...config} />
    </div>
  );
}
