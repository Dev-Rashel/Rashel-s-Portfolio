"use client";

import type { AdminField } from "@/lib/admin-fields";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const PROFILE_ENDPOINT = "/api/admin/profile";

const HEADLINE_FIELDS: AdminField[] = [
  { name: "designation", label: "Designation", type: "text", placeholder: "Junior Full-Stack Developer" },
  { name: "availability", label: "Availability line", type: "text", help: "Shown beside the availability dot at the top of the hero." },
  { name: "heroIntro", label: "Hero introduction", type: "textarea", rows: 4, colSpan: 2, help: "The short paragraph beneath your name." },
  { name: "available", label: "Available for work", type: "boolean", colSpan: 2 },
  { name: "profileImage", label: "Hero portrait", type: "image", colSpan: 2, folder: "profile", help: "The tall portrait shown on the right of the hero." },
];

const STAT_FIELDS: AdminField[] = [
  { name: "value", label: "Value", type: "text", placeholder: "12" },
  { name: "suffix", label: "Suffix", type: "text", placeholder: "+" },
  { name: "label", label: "Label", type: "text", colSpan: 2, placeholder: "Projects built" },
];

const CTA_FIELDS: AdminField[] = [
  { name: "ctas.projects.label", label: "Projects button label", type: "text", placeholder: "View projects" },
  { name: "ctas.projects.url", label: "Projects button URL", type: "text", placeholder: "/#projects" },
  { name: "ctas.projects.enabled", label: "Show projects button", type: "boolean", colSpan: 2 },
  { name: "ctas.contact.label", label: "Contact button label", type: "text", placeholder: "Start a conversation" },
  { name: "ctas.contact.url", label: "Contact button URL", type: "text", placeholder: "/#contact" },
  { name: "ctas.contact.enabled", label: "Show contact button", type: "boolean", colSpan: 2 },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "First impression",
    description: "The words and portrait that greet every visitor.",
    endpoint: PROFILE_ENDPOINT,
    fields: HEADLINE_FIELDS,
  },
  {
    title: "Proof points",
    description: "A small set of numbers that say a lot. Keep it to three or four.",
    endpoint: PROFILE_ENDPOINT,
    fields: [
      {
        name: "stats",
        label: "Hero statistics",
        type: "repeater",
        colSpan: 2,
        itemLabel: "Stat",
        addLabel: "Add stat",
        itemFields: STAT_FIELDS,
      },
    ],
  },
  {
    title: "Call to action",
    description: "Where the eye should go next. Leave a URL blank to use the matching section.",
    endpoint: PROFILE_ENDPOINT,
    fields: CTA_FIELDS,
  },
];

export default function HeroPage() {
  return (
    <SingletonForm
      endpoint={PROFILE_ENDPOINT}
      eyebrow="Identity"
      title="Hero section"
      description="Craft the first impression — the name, the introduction, the portrait, and the two doors out."
      groups={GROUPS}
    />
  );
}
