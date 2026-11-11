"use client";

import type { AdminField } from "@/lib/admin-fields";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const PROFILE_ENDPOINT = "/api/admin/profile";

const FILE_FIELDS: AdminField[] = [
  {
    name: "resume",
    label: "Résumé file",
    type: "file",
    colSpan: 2,
    folder: "resume",
    accept: "application/pdf,.doc,.docx",
    help: "Upload a PDF or Word document. The hero and résumé links use this file automatically.",
  },
];

const BUTTON_FIELDS: AdminField[] = [
  { name: "ctas.resume.label", label: "Button label", type: "text", placeholder: "Download résumé" },
  { name: "ctas.resume.url", label: "Fallback URL", type: "text", placeholder: "https://…", help: "Used only when no file is uploaded." },
  { name: "ctas.resume.enabled", label: "Show résumé link", type: "boolean", colSpan: 2 },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "Latest résumé",
    description: "Keep your most recent story ready to download.",
    endpoint: PROFILE_ENDPOINT,
    fields: FILE_FIELDS,
  },
  {
    title: "Download link",
    description: "Control the label and the fallback destination.",
    endpoint: PROFILE_ENDPOINT,
    fields: BUTTON_FIELDS,
  },
];

export default function ResumePage() {
  return (
    <SingletonForm
      endpoint={PROFILE_ENDPOINT}
      eyebrow="Identity"
      title="Résumé"
      description="Keep your latest story ready to download — one file, one clear call to action."
      groups={GROUPS}
      saveLabel="Save résumé"
    />
  );
}
