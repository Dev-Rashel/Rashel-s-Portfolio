"use client";

import type { AdminField } from "@/lib/admin-fields";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const PROFILE_ENDPOINT = "/api/admin/profile";

const IDENTITY_FIELDS: AdminField[] = [
  { name: "fullName", label: "Full name", type: "text", required: true, placeholder: "Rashel Mahmud" },
  { name: "designation", label: "Designation", type: "text", placeholder: "Junior Full-Stack Developer" },
  { name: "email", label: "Public email", type: "text", placeholder: "hello@example.com" },
  { name: "phone", label: "Phone", type: "text", placeholder: "Optional" },
  { name: "location", label: "Location", type: "text", placeholder: "Dhaka, Bangladesh" },
  { name: "availability", label: "Availability line", type: "text", help: "Shown in the hero, header, and footer." },
  { name: "available", label: "Available for work", type: "boolean", colSpan: 2, help: "Controls the availability dot across the site." },
];

const VOICE_FIELDS: AdminField[] = [
  { name: "tagline", label: "Tagline", type: "textarea", rows: 2, colSpan: 2, help: "Pulled as a pull-quote in the about section." },
  { name: "shortBio", label: "Short bio", type: "textarea", rows: 4, colSpan: 2, help: "Used for previews, meta descriptions, and as a fallback lead." },
];

const PORTRAIT_FIELDS: AdminField[] = [
  { name: "profileImage", label: "Portrait image", type: "image", colSpan: 2, folder: "profile", help: "Appears in the hero and as a fallback in the about section." },
  { name: "signatureImage", label: "Signature image", type: "image", colSpan: 2, folder: "profile", help: "Optional. A handwritten mark used in editorial moments." },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "Identity",
    description: "The person behind the pixels — name, role, and the details that travel with it.",
    endpoint: PROFILE_ENDPOINT,
    fields: IDENTITY_FIELDS,
  },
  {
    title: "Voice",
    description: "A short introduction used across cards, previews, and search results.",
    endpoint: PROFILE_ENDPOINT,
    fields: VOICE_FIELDS,
  },
  {
    title: "Portrait",
    description: "The images that give the story a face.",
    endpoint: PROFILE_ENDPOINT,
    fields: PORTRAIT_FIELDS,
  },
];

export default function ProfilePage() {
  return (
    <SingletonForm
      endpoint={PROFILE_ENDPOINT}
      eyebrow="Identity"
      title="Profile"
      description="The person behind the pixels. These details follow you across the hero, about section, contact form, and footer."
      groups={GROUPS}
    />
  );
}
