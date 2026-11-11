import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.categories;

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Categories"
        description="A taxonomy for everything you publish across projects, journal entries, and activities."
      />
      <CollectionManager {...config} />
    </div>
  );
}
