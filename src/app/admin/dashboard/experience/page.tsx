import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Experience",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.experience;

export default function ExperiencePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Experience"
        description="The professional timeline. Current roles and the chapters that shaped your journey."
      />
      <CollectionManager {...config} />
    </div>
  );
}
