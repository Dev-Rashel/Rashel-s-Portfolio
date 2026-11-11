"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, RotateCcw, Save } from "lucide-react";
import type { AdminField } from "@/lib/admin-fields";
import { getPath, normalizeArrayOrders, normalizeFieldValue, setPath } from "@/lib/admin-fields";
import { cn, toPlain } from "@/lib/utils";
import { AdminButton, PageHeader, Panel, SkeletonRows } from "./ui";
import { FieldInput } from "./field-input";
import { toast } from "./toast";

export type SingletonGroup = {
  title: string;
  description?: string;
  fields: AdminField[];
  endpoint?: string;
  className?: string;
};

type SingletonFormProps = {
  endpoint: string;
  eyebrow?: string;
  title: string;
  description?: string;
  groups: SingletonGroup[];
  saveLabel?: string;
  headerActions?: ReactNode;
};

type EndpointData = Record<string, Record<string, unknown>>;

export function SingletonForm({
  endpoint,
  eyebrow,
  title,
  description,
  groups,
  saveLabel = "Save changes",
  headerActions,
}: SingletonFormProps) {
  const router = useRouter();
  const endpoints = useMemo(() => {
    return Array.from(new Set(groups.map((group) => group.endpoint || endpoint)));
  }, [groups, endpoint]);

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [snapshot, setSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const applyData = useCallback(
    (data: EndpointData) => {
      const next: Record<string, unknown> = {};
      for (const group of groups) {
        const source = data[group.endpoint || endpoint] || {};
        for (const field of group.fields) {
          next[field.name] = normalizeFieldValue(field, getPath(source, field.name));
        }
      }
      setValues(next);
      setSnapshot(JSON.stringify(next));
    },
    [groups, endpoint]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const responses = await Promise.all(
        endpoints.map(async (url) => {
          const response = await fetch(url, { cache: "no-store" });
          if (response.status === 401) {
            router.replace("/admin");
            throw new Error("Unauthorized");
          }
          const body = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(body.error || "Could not load this content.");
          return [url, (body.data || {}) as Record<string, unknown>] as const;
        })
      );
      applyData(Object.fromEntries(responses));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load this content.");
    } finally {
      setLoading(false);
    }
  }, [endpoints, router, applyData]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = !loading && JSON.stringify(values) !== snapshot;

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payloads = new Map<string, Record<string, unknown>>();
      for (const group of groups) {
        const url = group.endpoint || endpoint;
        const payload = payloads.get(url) || {};
        for (const field of group.fields) {
          setPath(payload, field.name, values[field.name]);
        }
        payloads.set(url, normalizeArrayOrders(payload));
      }

      for (const [url, payload] of payloads) {
        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toPlain(payload)),
        });
        if (response.status === 401) {
          router.replace("/admin");
          return;
        }
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || "Could not save these changes.");
      }

      setSnapshot(JSON.stringify(values));
      toast("Changes saved and live.");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save these changes.");
      toast(saveError instanceof Error ? saveError.message : "Could not save these changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setValues(JSON.parse(snapshot) as Record<string, unknown>);
  };

  if (loading) {
    return (
      <div>
        <PageHeader eyebrow={eyebrow} title={title} description={description} />
        <Panel>
          <SkeletonRows rows={7} />
        </Panel>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            {dirty && (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-amber-300">
                <span className="h-1 w-1 rounded-full bg-amber-300" /> Unsaved
              </span>
            )}
            {headerActions}
            <AdminButton variant="ghost" onClick={reset} disabled={!dirty || saving} title="Discard changes">
              <RotateCcw size={12} /> Reset
            </AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving || !dirty}>
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={12} />}
              {saving ? "Saving" : saveLabel}
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
        {groups.map((group) => (
          <Panel
            key={group.title}
            title={group.title}
            description={group.description}
            className={group.className}
          >
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              {group.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  onChange={(next) => setValues((current) => ({ ...current, [field.name]: next }))}
                />
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <div
        className={cn(
          "sticky bottom-4 z-20 mt-5 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 backdrop-blur-xl transition-all",
          dirty
            ? "border-[#b794f6]/25 bg-[#151027]/95 shadow-2xl"
            : "pointer-events-none border-white/5 bg-[#0f0b20]/70 opacity-60"
        )}
      >
        <p className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.14em] text-white/35">
          {dirty ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-[#b794f6]" /> You have unsaved changes
            </>
          ) : (
            <>
              <Check size={11} className="text-emerald-300/70" /> Everything is up to date
            </>
          )}
        </p>
        <AdminButton onClick={() => void save()} disabled={saving || !dirty}>
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={12} />}
          {saving ? "Saving" : saveLabel}
        </AdminButton>
      </div>
    </div>
  );
}
