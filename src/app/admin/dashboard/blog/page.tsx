import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Journal",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.posts;

export default function BlogPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Journal"
        description="Words, notes, and the learning in between. Drafts stay hidden until you publish them."
      />
      <CollectionManager {...config} />
    </div>
  );
}
