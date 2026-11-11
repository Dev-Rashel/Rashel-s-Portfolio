import type { Metadata } from "next";
import { CollectionManager } from "@/components/admin/collection-manager";
import { PageHeader } from "@/components/admin/ui";
import { collectionConfigs } from "@/lib/admin-configs";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

const config = collectionConfigs.projects;

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        description="Case studies, experiments, and shipped work. Published projects appear on the homepage and in the archive."
      />
      <CollectionManager {...config} />
    </div>
  );
}
