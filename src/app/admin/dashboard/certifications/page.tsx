import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Certifications",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.certifications;

export default function CertificationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Certifications"
        description="Credentials and continued learning. Feature the ones that best represent your craft."
      />
      <CollectionManager {...config} />
    </div>
  );
}
