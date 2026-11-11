"use client";

import type { AdminField } from "@/lib/admin-fields";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const PROFILE_ENDPOINT = "/api/admin/profile";

const STORY_FIELDS: AdminField[] = [
  { name: "tagline", label: "Pull quote", type: "textarea", rows: 2, colSpan: 2, help: "The large italic quote inside the about section." },
  {
    name: "aboutBio",
    label: "About bio",
    type: "textarea",
    rows: 8,
    colSpan: 2,
    help: "Separate paragraphs with a blank line. The first paragraph is the lead; the rest become body copy.",
  },
  { name: "shortBio", label: "Short bio", type: "textarea", rows: 3, colSpan: 2, help: "Fallback lead and preview text." },
  { name: "journey", label: "The journey", type: "textarea", rows: 5, colSpan: 2 },
  { name: "goals", label: "What’s next", type: "textarea", rows: 4, colSpan: 2 },
  { name: "educationSummary", label: "Education summary", type: "textarea", rows: 3, colSpan: 2 },
];

const DETAIL_FIELDS: AdminField[] = [
  { name: "interests", label: "Interests", type: "list", colSpan: 2, rows: 5, help: "One interest per line. The first four appear as pills beside the portrait." },
  { name: "achievements", label: "Selected recognition", type: "list", colSpan: 2, rows: 5, help: "One recognition per line. The first three appear in the about section." },
  { name: "aboutImage", label: "About image", type: "image", colSpan: 2, folder: "about", help: "Falls back to the portrait when empty." },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "The story",
    description: "Tell it with intention. Short paragraphs, honest detail, and a clear point of view.",
    endpoint: PROFILE_ENDPOINT,
    fields: STORY_FIELDS,
  },
  {
    title: "Interests & recognition",
    description: "The wider texture around the work.",
    endpoint: PROFILE_ENDPOINT,
    fields: DETAIL_FIELDS,
  },
];

export default function AboutPage() {
  return (
    <SingletonForm
      endpoint={PROFILE_ENDPOINT}
      eyebrow="Identity"
      title="About"
      description="Tell the story with intention — the lead, the journey, what comes next, and the details that make it yours."
      groups={GROUPS}
    />
  );
}
