"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, ArrowUp, Check, Eye, EyeOff, Loader2, RotateCcw, Save } from "lucide-react";
import type { AdminField } from "@/lib/admin-fields";
import { buildFieldValues, cloneValue, setPath } from "@/lib/admin-fields";
import { toPlain } from "@/lib/utils";
import { AdminButton, PageHeader, Panel, SkeletonRows } from "./ui";
import { FieldInput, Toggle } from "./field-input";
import { toast } from "./toast";

const SECTION_KEYS = ["about", "skills", "projects", "experience", "activities", "blog", "contact"] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

const SECTION_LABELS: Record<SectionKey, string> = {
  about: "About",
  skills: "Skills",
  projects: "Selected work",
  experience: "Experience & education",
  activities: "Activities & recognition",
  blog: "Journal",
  contact: "Contact",
};

const IDENTITY_FIELDS: AdminField[] = [
  { name: "siteName", label: "Site name", type: "text", required: true },
  { name: "logoMark", label: "Monogram", type: "text", help: "Short mark used in the header and footer.", placeholder: "RM" },
  { name: "siteTitle", label: "Site title", type: "text", help: "A short descriptor used alongside the name." },
  {
    name: "siteDescription",
    label: "Site description",
    type: "textarea",
    rows: 3,
    colSpan: 2,
    help: "Used as the base description across the site and social previews.",
  },
  { name: "keywords", label: "Keywords", type: "tags", colSpan: 2, help: "Press Enter or comma to add a keyword." },
  { name: "logo", label: "Logo image", type: "image", colSpan: 2, folder: "branding", help: "Optional. The monogram is used when no logo is set." },
];

const CONTACT_FIELDS: AdminField[] = [
  { name: "contact.email", label: "Public email", type: "text", placeholder: "hello@example.com" },
  { name: "contact.phone", label: "Phone", type: "text", placeholder: "Optional" },
  { name: "contact.address", label: "Location", type: "text" },
  { name: "contact.mapUrl", label: "Map URL", type: "text", help: "Optional link to Google Maps or similar." },
  { name: "contact.formTitle", label: "Form title", type: "text", colSpan: 2 },
  { name: "contact.formDescription", label: "Form description", type: "textarea", rows: 3, colSpan: 2 },
  { name: "contact.successMessage", label: "Success message", type: "textarea", rows: 2, colSpan: 2 },
];

type CopyValue = { eyebrow?: string; title?: string; description?: string };

export function SettingsManager() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [snapshot, setSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const applySettings = useCallback((data: Record<string, unknown>) => {
    const next = buildFieldValues([...IDENTITY_FIELDS, ...CONTACT_FIELDS], data);
    next.sectionVisibility = cloneValue(data.sectionVisibility || {});
    next.sectionCopy = cloneValue(data.sectionCopy || {});
    next.sectionOrder = normalizeSections(data.sectionOrder);
    setValues(next);
    setSnapshot(JSON.stringify(next));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/settings", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not load the website settings.");
      applySettings((body.data || {}) as Record<string, unknown>);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load the website settings.");
    } finally {
      setLoading(false);
    }
  }, [router, applySettings]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = !loading && JSON.stringify(values) !== snapshot;
  const sectionOrder = normalizeSections(values.sectionOrder);
  const visibility = (values.sectionVisibility || {}) as Record<string, boolean>;
  const copy = (values.sectionCopy || {}) as Record<string, CopyValue>;

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {};
      for (const field of [...IDENTITY_FIELDS, ...CONTACT_FIELDS]) {
        setPath(payload, field.name, values[field.name]);
      }
      payload.sectionVisibility = Object.fromEntries(SECTION_KEYS.map((key) => [key, Boolean(visibility[key])]));
      payload.sectionOrder = sectionOrder;
      payload.sectionCopy = Object.fromEntries(
        SECTION_KEYS.map((key) => [
          key,
          {
            eyebrow: copy[key]?.eyebrow || "",
            title: copy[key]?.title || "",
            description: copy[key]?.description || "",
          },
        ])
      );

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPlain(payload)),
      });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not save the website settings.");
      setSnapshot(JSON.stringify(values));
      toast("Website settings saved.");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the website settings.");
      toast(saveError instanceof Error ? saveError.message : "Could not save the website settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => setValues(JSON.parse(snapshot) as Record<string, unknown>);

  const updateCopy = (key: SectionKey, property: keyof CopyValue, value: string) => {
    setValues((current) => ({
      ...current,
      sectionCopy: {
        ...(current.sectionCopy as Record<string, CopyValue>),
        [key]: { ...((current.sectionCopy as Record<string, CopyValue>)?.[key] || {}), [property]: value },
      },
    }));
  };

  const toggleSection = (key: SectionKey) => {
    setValues((current) => ({
      ...current,
      sectionVisibility: {
        ...(current.sectionVisibility as Record<string, boolean>),
        [key]: !(current.sectionVisibility as Record<string, boolean>)?.[key],
      },
    }));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sectionOrder.length) return;
    const next = [...sectionOrder];
    [next[index], next[target]] = [next[target], next[index]];
    setValues((current) => ({ ...current, sectionOrder: next }));
  };

  if (loading) {
    return (
      <div>
        <PageHeader eyebrow="Website" title="Website settings" description="The essential details of your digital home." />
        <Panel>
          <SkeletonRows rows={7} />
        </Panel>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Website"
        title="Website settings"
        description="The essential details, contact information, and section flow of your digital home."
        actions={
          <div className="flex items-center gap-2">
            {dirty && (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-amber-300">
                <span className="h-1 w-1 rounded-full bg-amber-300" /> Unsaved
              </span>
            )}
            <AdminButton variant="ghost" onClick={reset} disabled={!dirty || saving}>
              <RotateCcw size={12} /> Reset
            </AdminButton>
            <AdminButton onClick={() => void save()} disabled={!dirty || saving}>
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={12} />}
              {saving ? "Saving" : "Save changes"}
            </AdminButton>
          </div>
        }
      />

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => void load()} className="text-red-200 underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      <div className="space-y-5">
        <Panel title="Identity" description="The name, mark, and description used across the site.">
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
            {IDENTITY_FIELDS.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(next) => setValues((current) => ({ ...current, [field.name]: next }))}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Contact details" description="Used by the contact section and footer.">
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
            {CONTACT_FIELDS.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(next) => setValues((current) => ({ ...current, [field.name]: next }))}
              />
            ))}
          </div>
        </Panel>

        <Panel
          title="Homepage sections"
          description="Order the journey, choose what is visible, and shape the words that introduce each section."
        >
          <div className="space-y-3 px-5 py-5">
            {sectionOrder.map((key, index) => {
              const sectionKey = key as SectionKey;
              const sectionCopy = copy[sectionKey] || {};
              const visible = Boolean(visibility[sectionKey]);
              return (
                <div key={sectionKey} className="rounded-xl border border-white/8 bg-black/20">
                  <div className="flex flex-wrap items-center gap-3 border-b border-white/7 px-4 py-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-[0.52rem] tabular-nums text-white/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.72rem] font-medium text-white/80">{SECTION_LABELS[sectionKey]}</p>
                      <p className="mt-0.5 text-[0.5rem] uppercase tracking-[0.14em] text-white/25">{sectionKey}</p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.46rem] font-bold uppercase tracking-[0.1em] ${
                        visible
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 bg-white/[0.03] text-white/30"
                      }`}
                    >
                      {visible ? <Eye size={8} /> : <EyeOff size={8} />} {visible ? "Visible" : "Hidden"}
                    </span>
                    <Toggle checked={visible} onChange={() => toggleSection(sectionKey)} label={`${SECTION_LABELS[sectionKey]} visibility`} />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveSection(index, -1)}
                        disabled={index === 0}
                        className="grid h-7 w-7 place-items-center rounded-md text-white/30 hover:bg-white/5 hover:text-white/70 disabled:opacity-20"
                        aria-label={`Move ${SECTION_LABELS[sectionKey]} up`}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(index, 1)}
                        disabled={index === sectionOrder.length - 1}
                        className="grid h-7 w-7 place-items-center rounded-md text-white/30 hover:bg-white/5 hover:text-white/70 disabled:opacity-20"
                        aria-label={`Move ${SECTION_LABELS[sectionKey]} down`}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
                    <div>
                      <label className="field-label">Eyebrow</label>
                      <input
                        className="field"
                        value={sectionCopy.eyebrow || ""}
                        onChange={(event) => updateCopy(sectionKey, "eyebrow", event.target.value)}
                        placeholder="01 — The person"
                      />
                    </div>
                    <div>
                      <label className="field-label">Title</label>
                      <input
                        className="field"
                        value={sectionCopy.title || ""}
                        onChange={(event) => updateCopy(sectionKey, "title", event.target.value)}
                        placeholder="A headline for this section"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="field-label">Description</label>
                      <textarea
                        className="field resize-y !text-[0.8rem]"
                        rows={2}
                        value={sectionCopy.description || ""}
                        onChange={(event) => updateCopy(sectionKey, "description", event.target.value)}
                        placeholder="A short supporting line"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div
        className={`sticky bottom-4 z-20 mt-5 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 backdrop-blur-xl transition-all ${
          dirty ? "border-[#ff7a6b]/25 bg-[#171024]/95 shadow-2xl" : "pointer-events-none border-white/5 bg-[#120c20]/70 opacity-60"
        }`}
      >
        <p className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.14em] text-white/35">
          {dirty ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a6b]" /> You have unsaved changes
            </>
          ) : (
            <>
              <Check size={11} className="text-emerald-300/70" /> Everything is up to date
            </>
          )}
        </p>
        <AdminButton onClick={() => void save()} disabled={!dirty || saving}>
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={12} />}
          {saving ? "Saving" : "Save changes"}
        </AdminButton>
      </div>
    </div>
  );
}

function normalizeSections(raw: unknown): SectionKey[] {
  const list = Array.isArray(raw) ? (raw.filter((key) => SECTION_KEYS.includes(key as SectionKey)) as SectionKey[]) : [];
  return [...list, ...SECTION_KEYS.filter((key) => !list.includes(key))];
}
