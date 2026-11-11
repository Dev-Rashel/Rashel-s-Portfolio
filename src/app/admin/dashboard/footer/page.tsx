"use client";

import type { AdminField } from "@/lib/admin-fields";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const SETTINGS_ENDPOINT = "/api/admin/settings";

const COPY_FIELDS: AdminField[] = [
  { name: "footer.tagline", label: "Tagline", type: "textarea", rows: 2, colSpan: 2, placeholder: "Designed and engineered with intention." },
  { name: "footer.bigText", label: "Marquee text", type: "text", colSpan: 2, help: "The large scrolling line above the copyright." },
  { name: "footer.copyright", label: "Copyright name", type: "text", placeholder: "Rashel Mahmud" },
  { name: "footer.showSocials", label: "Show social links", type: "boolean", help: "Social links come from the Social links page." },
];

const LINK_FIELDS: AdminField[] = [
  { name: "label", label: "Label", type: "text", placeholder: "Archive" },
  { name: "href", label: "Destination", type: "text", placeholder: "/projects" },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "Footer copy",
    description: "The last word — a closing line, a marquee, and the name that signs it.",
    endpoint: SETTINGS_ENDPOINT,
    fields: COPY_FIELDS,
  },
  {
    title: "Footer links",
    description: "A short list of places worth exploring.",
    endpoint: SETTINGS_ENDPOINT,
    fields: [
      {
        name: "footer.links",
        label: "Links",
        type: "repeater",
        colSpan: 2,
        itemLabel: "Footer link",
        addLabel: "Add link",
        itemFields: LINK_FIELDS,
      },
    ],
  },
];

export default function FooterPage() {
  return (
    <SingletonForm
      endpoint={SETTINGS_ENDPOINT}
      eyebrow="Website"
      title="Footer"
      description="The last word and the next step — copy, links, and the marquee that closes the page."
      groups={GROUPS}
    />
  );
}
