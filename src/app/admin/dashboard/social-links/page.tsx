"use client";

import type { AdminField } from "@/lib/admin-fields";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const PROFILE_ENDPOINT = "/api/admin/profile";

const SOCIAL_FIELDS: AdminField[] = [
  {
    name: "platform",
    label: "Platform",
    type: "select",
    options: [
      { label: "GitHub", value: "github" },
      { label: "LinkedIn", value: "linkedin" },
      { label: "X / Twitter", value: "x" },
      { label: "Instagram", value: "instagram" },
      { label: "Dribbble", value: "dribbble" },
      { label: "Facebook", value: "facebook" },
      { label: "YouTube", value: "youtube" },
      { label: "Email", value: "email" },
      { label: "Website", value: "website" },
      { label: "Other", value: "link" },
    ],
  },
  { name: "label", label: "Display label", type: "text", placeholder: "GitHub" },
  { name: "url", label: "URL", type: "text", colSpan: 2, placeholder: "https://github.com/your-handle" },
  {
    name: "icon",
    label: "Icon",
    type: "select",
    options: [
      { label: "GitHub", value: "github" },
      { label: "LinkedIn", value: "linkedin" },
      { label: "X / Twitter", value: "twitter" },
      { label: "Instagram", value: "instagram" },
      { label: "Dribbble", value: "dribbble" },
      { label: "Facebook", value: "facebook" },
      { label: "YouTube", value: "youtube" },
      { label: "Mail", value: "mail" },
      { label: "Globe", value: "website" },
      { label: "Link", value: "link" },
    ],
  },
  { name: "visible", label: "Visible on site", type: "boolean" },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "Social links",
    description: "Where the conversation continues. Reorder entries to shape the hero and footer.",
    endpoint: PROFILE_ENDPOINT,
    fields: [
      {
        name: "socials",
        label: "Links",
        type: "repeater",
        colSpan: 2,
        itemLabel: "Social link",
        addLabel: "Add social link",
        help: "Hidden entries stay saved but do not appear on the public site.",
        itemFields: SOCIAL_FIELDS,
      },
    ],
  },
];

export default function SocialLinksPage() {
  return (
    <SingletonForm
      endpoint={PROFILE_ENDPOINT}
      eyebrow="Identity"
      title="Social links"
      description="The places people can find you — ordered and toggled without touching code."
      groups={GROUPS}
    />
  );
}
