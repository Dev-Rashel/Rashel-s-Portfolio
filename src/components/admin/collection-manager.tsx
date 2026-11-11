"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { AdminColumn, AdminField, AdminFilter } from "@/lib/admin-fields";
import { buildFieldValues, cloneValue } from "@/lib/admin-fields";
import { cn, formatDate, toPlain } from "@/lib/utils";
import { AdminButton, EmptyState, SkeletonRows, StatusBadge } from "./ui";
import { FieldInput } from "./field-input";
import { toast } from "./toast";

type Row = Record<string, unknown> & { _id?: string };

type CollectionManagerProps = {
  resource: string;
  singular: string;
  createLabel?: string;
  searchPlaceholder?: string;
  fields: AdminField[];
  columns: AdminColumn[];
  filters?: AdminFilter[];
  defaults?: Record<string, unknown>;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
};

const HIDE_CLASS: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

export function CollectionManager({
  resource,
  singular,
  createLabel,
  searchPlaceholder,
  fields,
  columns,
  filters = [],
  defaults = {},
  emptyTitle,
  emptyDescription,
  pageSize = 20,
}: CollectionManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtersKey = JSON.stringify(activeFilters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (debouncedQuery) params.set("q", debouncedQuery);
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value !== "") params.set(key, value);
      }
      const response = await fetch(`/api/admin/resources/${resource}?${params.toString()}`, { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not load this collection.");
      setItems((data.data || []) as Row[]);
      setPagination(data.pagination || { page: 1, limit: pageSize, total: 0, pages: 1 });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load this collection.");
    } finally {
      setLoading(false);
    }
  }, [resource, page, pageSize, debouncedQuery, filtersKey, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setValues(cloneValue(buildFieldValues(fields, defaults)));
    setFormError("");
    setPanelOpen(true);
  };

  const openEdit = (item: Row) => {
    setEditing(item);
    setValues(cloneValue(buildFieldValues(fields, item)));
    setFormError("");
    setPanelOpen(true);
  };

  const closePanel = () => {
    if (saving) return;
    setPanelOpen(false);
    setEditing(null);
    setFormError("");
  };

  const save = async () => {
    setSaving(true);
    setFormError("");
    try {
      const payload: Record<string, unknown> = {};
      for (const field of fields) payload[field.name] = values[field.name];
      const url = editing?._id
        ? `/api/admin/resources/${resource}?id=${editing._id}`
        : `/api/admin/resources/${resource}`;
      const response = await fetch(url, {
        method: editing?._id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPlain(payload)),
      });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not save this item.");
      toast(`${singular} ${editing ? "updated" : "created"}.`);
      setPanelOpen(false);
      setEditing(null);
      await load();
      router.refresh();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Could not save this item.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/resources/${resource}?id=${deleteTarget._id}`, { method: "DELETE" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not delete this item.");
      toast(`${singular} deleted.`);
      setDeleteTarget(null);
      if (items.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await load();
      }
      router.refresh();
    } catch (deleteError) {
      toast(deleteError instanceof Error ? deleteError.message : "Could not delete this item.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const activeFilterCount = useMemo(
    () => Object.values(activeFilters).filter((value) => value !== "").length,
    [activeFilters]
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.018] p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder || `Search ${resource}…`}
            className="field !py-2.5 !pl-9 !text-[0.74rem]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {filters.map((filter) => (
          <select
            key={filter.key}
            value={activeFilters[filter.key] ?? ""}
            onChange={(event) => {
              setActiveFilters((current) => ({ ...current, [filter.key]: event.target.value }));
              setPage(1);
            }}
            className="field !w-auto !py-2.5 !text-[0.68rem]"
            aria-label={filter.label}
          >
            <option value="" className="bg-[#171024]">
              {filter.label}
            </option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#171024]">
                {option.label}
              </option>
            ))}
          </select>
        ))}

        <div className="flex items-center gap-2">
          <span className="hidden text-[0.52rem] uppercase tracking-[0.14em] text-white/25 xl:inline">
            {pagination.total} total
          </span>
          <AdminButton type="button" onClick={openCreate}>
            <Plus size={13} /> {createLabel || `New ${singular.toLowerCase()}`}
          </AdminButton>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.018]">
        {loading ? (
          <SkeletonRows rows={6} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <AlertCircle size={22} className="text-red-300/70" />
            <p className="mt-3 text-sm text-white/70">Something interrupted the connection.</p>
            <p className="mt-1 max-w-sm text-xs text-white/30">{error}</p>
            <AdminButton variant="ghost" className="mt-5" onClick={() => void load()}>
              Try again
            </AdminButton>
          </div>
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<Database size={26} />}
              title={emptyTitle || `No ${resource} yet`}
              description={
                emptyDescription ||
                `Create your first ${singular.toLowerCase()} and it will appear on the public site immediately.`
              }
              action={
                <AdminButton onClick={openCreate}>
                  <Plus size={13} /> {createLabel || `New ${singular.toLowerCase()}`}
                </AdminButton>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/7">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-[0.48rem] font-bold uppercase tracking-[0.16em] text-white/28",
                        column.hideBelow && HIDE_CLASS[column.hideBelow],
                        column.align === "right" && "text-right"
                      )}
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-[0.48rem] font-bold uppercase tracking-[0.16em] text-white/28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={String(item._id)} className="group transition-colors hover:bg-white/[0.025]">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-4 py-3 align-middle text-[0.72rem] text-white/60",
                          column.hideBelow && HIDE_CLASS[column.hideBelow],
                          column.align === "right" && "text-right"
                        )}
                      >
                        <Cell item={item} column={column} />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="grid h-7 w-7 place-items-center rounded-md text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/80"
                          aria-label={`Edit ${singular}`}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="grid h-7 w-7 place-items-center rounded-md text-white/25 transition-colors hover:bg-red-400/10 hover:text-red-300"
                          aria-label={`Delete ${singular}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !error && pagination.pages > 1 && (
        <div className="mt-4 flex items-center justify-between px-1">
          <p className="text-[0.55rem] uppercase tracking-[0.12em] text-white/25">
            Page {pagination.page} of {pagination.pages}
            {activeFilterCount > 0 && " · filtered"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/45 transition-colors hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/45 transition-colors hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-2xl flex-col border-l border-white/10 bg-[#0a0a08] shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 330, damping: 36 }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4">
                <div>
                  <p className="text-[0.48rem] uppercase tracking-[0.2em] text-[#ff7a6b]">
                    {editing ? "Editing" : "Creating"}
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-[#f6f1ff]">
                    {editing ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/40 hover:border-white/25 hover:text-white"
                  aria-label="Close panel"
                >
                  <X size={14} />
                </button>
              </div>

              <form
                className="flex min-h-0 flex-1 flex-col"
                onSubmit={(event) => {
                  event.preventDefault();
                  void save();
                }}
              >
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                  {formError && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-300">
                      <AlertCircle size={13} className="mt-0.5 shrink-0" />
                      {formError}
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {fields.map((field) => (
                      <FieldInput
                        key={field.name}
                        field={field}
                        value={values[field.name]}
                        onChange={(next) => setValues((current) => ({ ...current, [field.name]: next }))}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/8 bg-[#0a0a08] px-5 py-4">
                  <span className="text-[0.52rem] uppercase tracking-[0.14em] text-white/22">
                    {editing ? "Changes publish instantly" : "Saved to the live database"}
                  </span>
                  <div className="flex items-center gap-2">
                    <AdminButton type="button" variant="ghost" onClick={closePanel} disabled={saving}>
                      Cancel
                    </AdminButton>
                    <AdminButton type="submit" disabled={saving}>
                      {saving ? <Loader2 size={13} className="animate-spin" /> : null}
                      {saving ? "Saving" : editing ? "Update" : "Create"}
                    </AdminButton>
                  </div>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[110] grid place-items-center px-4">
            <motion.div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteTarget(null)}
            />
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#171024] p-6 shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-300">
                <Trash2 size={16} />
              </div>
              <h3 className="mt-4 font-display text-2xl text-white">Delete this {singular.toLowerCase()}?</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                This removes it from the database and the public site. This action cannot be undone.
              </p>
              <p className="mt-3 truncate rounded-lg border border-white/8 bg-black/30 px-3 py-2 text-[0.68rem] text-white/55">
                {String(deleteTarget.title || deleteTarget.name || deleteTarget.subject || deleteTarget._id || "")}
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <AdminButton variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Keep it
                </AdminButton>
                <AdminButton variant="danger" onClick={() => void confirmDelete()} disabled={deleting}>
                  {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={12} />}
                  {deleting ? "Deleting" : "Delete"}
                </AdminButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Cell({ item, column }: { item: Row; column: AdminColumn }) {
  const value = item[column.key];
  const type = column.type || "text";

  if (type === "primary") {
    const image = column.imageKey ? String(item[column.imageKey] || "") : "";
    return (
      <div className="flex items-center gap-3">
        <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] font-display text-sm text-[#ff7a6b]">
          {image ? (
            <Image src={image} alt="" fill sizes="36px" className="object-cover" />
          ) : (
            String(value || "?").slice(0, 1).toUpperCase()
          )}
        </span>
        <div className="min-w-0">
          <p className="max-w-[16rem] truncate text-[0.76rem] font-medium text-white/85">{String(value || "Untitled")}</p>
          {column.secondaryKey && (
            <p className="mt-0.5 max-w-[16rem] truncate text-[0.58rem] text-white/30">
              {String(item[column.secondaryKey] || "—")}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (type === "boolean") {
    const active = Boolean(value);
    return (
      <StatusBadge tone={active ? column.trueTone || "success" : column.falseTone || "neutral"}>
        {active ? column.trueLabel || "Yes" : column.falseLabel || "No"}
      </StatusBadge>
    );
  }

  if (type === "badge") {
    return <StatusBadge tone="accent">{String(value || "—")}</StatusBadge>;
  }

  if (type === "date") {
    return <span className="text-[0.66rem] text-white/45">{value ? formatDate(String(value)) : "—"}</span>;
  }

  if (type === "tags") {
    const tags = Array.isArray(value) ? value.slice(0, 2) : [];
    return (
      <div className="flex flex-wrap gap-1">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span key={String(tag)} className="rounded-full border border-white/10 px-2 py-0.5 text-[0.52rem] text-white/45">
              {String(tag)}
            </span>
          ))
        ) : (
          <span className="text-white/20">—</span>
        )}
      </div>
    );
  }

  if (type === "image") {
    const image = String(value || "");
    return image ? (
      <span className="relative block h-9 w-9 overflow-hidden rounded-lg border border-white/10">
        <Image src={image} alt="" fill sizes="36px" className="object-cover" />
      </span>
    ) : (
      <span className="text-white/20">—</span>
    );
  }

  if (type === "number") {
    return <span className="tabular-nums text-white/55">{typeof value === "number" ? value : String(value ?? "—")}</span>;
  }

  return (
    <span className={cn("block max-w-[15rem] truncate", type === "text" && !value && "text-white/20")}>
      {value === null || value === undefined || value === "" ? "—" : String(value)}
    </span>
  );
}
