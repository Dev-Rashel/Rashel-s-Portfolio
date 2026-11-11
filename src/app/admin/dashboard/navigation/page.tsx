"use client";

import Link from "next/link";
import type { AdminField } from "@/lib/admin-fields";
import { AdminButton } from "@/components/admin/ui";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const SETTINGS_ENDPOINT = "/api/admin/settings";

const NAV_FIELDS: AdminField[] = [
  { name: "label", label: "Label", type: "text", placeholder: "Projects" },
  { name: "href", label: "Destination", type: "text", placeholder: "/#projects", help: "Use /#section for homepage sections, or a full path." },
  { name: "visible", label: "Visible", type: "boolean", colSpan: 2 },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "Primary navigation",
    description: "Order the journey through the site. Hidden items stay saved but disappear from the header.",
    endpoint: SETTINGS_ENDPOINT,
    fields: [
      {
        name: "navItems",
        label: "Navigation items",
        type: "repeater",
        colSpan: 2,
        itemLabel: "Navigation item",
        addLabel: "Add navigation item",
        help: "The header shows up to eight items on desktop; the mobile menu shows every visible item.",
        itemFields: NAV_FIELDS,
      },
    ],
  },
];

export default function NavigationPage() {
  return (
    <SingletonForm
      endpoint={SETTINGS_ENDPOINT}
      eyebrow="Website"
      title="Navigation"
      description="The route through your story. Reorder, rename, hide, or add destinations."
      groups={GROUPS}
      headerActions={
        <Link href="/admin/dashboard/settings">
          <AdminButton variant="soft">Section visibility</AdminButton>
        </Link>
      }
    />
  );
}
