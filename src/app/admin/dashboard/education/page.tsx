import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Education",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.education;

export default function EducationPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Education"
        description="The institutions and studies that built your foundation."
      />
      <CollectionManager {...config} />
    </div>
  );
}
