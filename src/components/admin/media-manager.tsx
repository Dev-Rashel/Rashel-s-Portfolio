"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  ImageIcon,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { AdminButton, EmptyState, PageHeader } from "./ui";
import { toast } from "./toast";

type MediaItem = {
  _id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  type: string;
  format: string;
  name: string;
  width: number;
  height: number;
  bytes: number;
  alt: string;
  folder: string;
  createdAt: string;
};

const PAGE_SIZE = 24;

export function MediaManager() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [alt, setAlt] = useState("");
  const [savingAlt, setSavingAlt] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (typeFilter) params.set("type", typeFilter);
      const response = await fetch(`/api/admin/resources/media?${params.toString()}`, { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not load the media library.");
      setItems((body.data || []) as MediaItem[]);
      setPagination(body.pagination || { page: 1, pages: 1, total: 0 });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load the media library.");
    } finally {
      setLoading(false);
    }
  }, [router, page, debouncedQuery, typeFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const uploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setUploading(true);
    let success = 0;
    let failed = 0;
    let lastError = "";
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "library");
        const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || `Could not upload ${file.name}.`);
        success += 1;
      } catch (uploadError) {
        failed += 1;
        lastError = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      }
    }
    setUploading(false);
    if (success > 0) {
      toast(`${success} ${success === 1 ? "file" : "files"} uploaded.`);
      setPage(1);
      await load();
      router.refresh();
    }
    if (failed > 0) toast(lastError || `${failed} files could not be uploaded.`, "error");
  };

  const openAlt = (item: MediaItem) => {
    setEditing(item);
    setAlt(item.alt || "");
  };

  const saveAlt = async () => {
    if (!editing) return;
    setSavingAlt(true);
    try {
      const response = await fetch(`/api/admin/resources/media?id=${editing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt }),
      });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not update the asset.");
      setItems((current) => current.map((item) => (item._id === editing._id ? { ...item, alt } : item)));
      setEditing(null);
      toast("Alt text updated.");
    } catch (actionError) {
      toast(actionError instanceof Error ? actionError.message : "Could not update the asset.", "error");
    } finally {
      setSavingAlt(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/resources/media?id=${deleteTarget._id}`, { method: "DELETE" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not delete the asset.");
      setItems((current) => current.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast("Asset removed from the library.");
      router.refresh();
    } catch (actionError) {
      toast(actionError instanceof Error ? actionError.message : "Could not delete the asset.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.secureUrl || item.url);
      toast("URL copied to clipboard.");
    } catch {
      toast("Could not copy the URL. Open the asset and copy it from the address bar.", "error");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Website"
        title="Media library"
        description="Every visual asset in one place — uploaded, named, and ready to use."
        actions={
          <>
            <AdminButton variant="ghost" onClick={() => void load()}>
              <RefreshCw size={12} /> Refresh
            </AdminButton>
            <AdminButton onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
              {uploading ? "Uploading" : "Upload files"}
            </AdminButton>
          </>
        }
      />

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf"
        className="hidden"
        onChange={(event) => {
          if (event.target.files) void uploadFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files) void uploadFiles(event.dataTransfer.files);
        }}
        className={cn(
          "mb-4 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-7 text-center transition-colors",
          dragging ? "border-[#e9b25f] bg-[#e9b25f]/[0.04]" : "border-white/10 bg-white/[0.012]"
        )}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[#e9b25f]">
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
        </span>
        <p className="mt-2.5 text-xs text-white/55">
          {uploading ? "Uploading your files…" : "Drop images or PDFs here, or choose files above"}
        </p>
        <p className="mt-1 text-[0.5rem] uppercase tracking-[0.12em] text-white/22">
          JPG · PNG · WebP · AVIF · GIF · PDF · max 8MB each
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.018] p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, alt text, or folder…"
            className="field !py-2.5 !pl-9 !text-[0.72rem]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(event) => {
            setTypeFilter(event.target.value);
            setPage(1);
          }}
          className="field !w-auto !py-2.5 !text-[0.68rem]"
          aria-label="Filter media by type"
        >
          <option value="" className="bg-[#111826]">All media</option>
          <option value="image" className="bg-[#111826]">Images</option>
          <option value="raw" className="bg-[#111826]">Documents</option>
        </select>
        <span className="text-[0.52rem] uppercase tracking-[0.12em] text-white/25">{pagination.total} assets</span>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.018]">
              <div className="aspect-[4/3] animate-pulse bg-white/5" />
              <div className="space-y-2 p-3">
                <div className="h-2.5 w-2/3 animate-pulse rounded bg-white/5" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-white/[0.03]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/15 bg-red-400/[0.04] px-6 py-12 text-center">
          <p className="text-sm text-white/65">Could not load the media library.</p>
          <p className="mt-1 text-xs text-white/30">{error}</p>
          <AdminButton variant="ghost" className="mt-4" onClick={() => void load()}>
            Try again
          </AdminButton>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ImageIcon size={26} />}
          title={debouncedQuery ? "No assets match that search" : "The library is waiting"}
          description={
            debouncedQuery
              ? "Try a different name, folder, or alt text."
              : "Upload your first image or PDF. Every asset you add here is stored in Cloudinary and ready to be used across the site."
          }
          action={
            <AdminButton onClick={() => inputRef.current?.click()} disabled={uploading}>
              <UploadCloud size={12} /> Upload files
            </AdminButton>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const isImage = item.type === "image";
              return (
                <div key={item._id} className="group overflow-hidden rounded-xl border border-white/8 bg-white/[0.018] transition-colors hover:border-white/15">
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
                    {isImage ? (
                      <Image
                        src={item.secureUrl || item.url}
                        alt={item.alt || item.name || "Media asset"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <FileText size={30} className="text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/55 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => void copyUrl(item)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/40 text-white/80 hover:border-[#e9b25f]/50 hover:text-[#e9b25f]"
                        title="Copy URL"
                        aria-label="Copy URL"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openAlt(item)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/40 text-white/80 hover:border-[#e9b25f]/50 hover:text-[#e9b25f]"
                        title="Edit alt text"
                        aria-label="Edit alt text"
                      >
                        <Pencil size={12} />
                      </button>
                      <a
                        href={item.secureUrl || item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/40 text-white/80 hover:border-[#e9b25f]/50 hover:text-[#e9b25f]"
                        title="Open asset"
                        aria-label="Open asset"
                      >
                        <ImageIcon size={12} />
                      </a>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/40 text-red-300 hover:border-red-400/50"
                        title="Delete asset"
                        aria-label="Delete asset"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[0.44rem] uppercase tracking-[0.1em] text-white/55 backdrop-blur-md">
                      {item.format || item.type}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-[0.66rem] text-white/70" title={item.name}>
                      {item.name || item.publicId.split("/").pop()}
                    </p>
                    <p className="mt-0.5 truncate text-[0.52rem] text-white/25" title={item.alt}>
                      {item.alt || "No alt text"}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2 text-[0.48rem] uppercase tracking-[0.08em] text-white/20">
                      <span>{formatBytes(item.bytes)}</span>
                      <span>{formatDate(item.createdAt, { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-5 flex items-center justify-between px-1">
              <p className="text-[0.55rem] uppercase tracking-[0.12em] text-white/25">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/45 hover:border-white/25 hover:text-white disabled:opacity-25"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/45 hover:border-white/25 hover:text-white disabled:opacity-25"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[120] grid place-items-center px-4">
            <motion.div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !savingAlt && setEditing(null)}
            />
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111826] shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/8 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-[0.48rem] uppercase tracking-[0.18em] text-[#e9b25f]">Media details</p>
                  <h3 className="mt-1 truncate font-display text-2xl text-white">{editing.name || "Untitled asset"}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/40 hover:text-white"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="px-5 py-5">
                {editing.type === "image" ? (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-black/30">
                    <Image src={editing.secureUrl || editing.url} alt={editing.alt || editing.name} fill sizes="512px" className="object-cover" />
                  </div>
                ) : (
                  <a
                    href={editing.secureUrl || editing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-5 text-sm text-[#e9b25f]"
                  >
                    <FileText size={18} /> Open document
                  </a>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3 text-[0.58rem] text-white/35 sm:grid-cols-4">
                  <div>
                    <p className="uppercase tracking-[0.1em] text-white/20">Format</p>
                    <p className="mt-1 text-white/60">{editing.format || editing.type}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.1em] text-white/20">Size</p>
                    <p className="mt-1 text-white/60">{formatBytes(editing.bytes)}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.1em] text-white/20">Dimensions</p>
                    <p className="mt-1 text-white/60">{editing.width ? `${editing.width} × ${editing.height}` : "—"}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.1em] text-white/20">Folder</p>
                    <p className="mt-1 truncate text-white/60">{editing.folder || "—"}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <label className="field-label">Alt text</label>
                  <input
                    className="field"
                    value={alt}
                    onChange={(event) => setAlt(event.target.value)}
                    placeholder="Describe the image for screen readers and search engines"
                  />
                  <p className="mt-1.5 text-[0.56rem] leading-relaxed text-white/28">
                    Good alt text is specific and concise. It also helps with accessibility and SEO.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/8 px-5 py-4">
                <div className="flex items-center gap-2">
                  <AdminButton variant="ghost" onClick={() => void copyUrl(editing)}>
                    <Copy size={11} /> Copy URL
                  </AdminButton>
                  <a href={editing.secureUrl || editing.url} target="_blank" rel="noopener noreferrer">
                    <AdminButton variant="ghost">Open</AdminButton>
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <AdminButton variant="ghost" onClick={() => setEditing(null)} disabled={savingAlt}>
                    Cancel
                  </AdminButton>
                  <AdminButton onClick={() => void saveAlt()} disabled={savingAlt || alt === (editing.alt || "")}>
                    {savingAlt ? <Loader2 size={12} className="animate-spin" /> : null}
                    Save details
                  </AdminButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[120] grid place-items-center px-4">
            <motion.div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteTarget(null)}
            />
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111826] p-6 shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-300">
                <Trash2 size={16} />
              </div>
              <h3 className="mt-4 font-display text-2xl text-white">Delete this asset?</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                This removes the file from Cloudinary and the media library. Any content still referencing its URL may show a broken image.
              </p>
              <p className="mt-3 truncate rounded-lg border border-white/8 bg-black/30 px-3 py-2 text-[0.68rem] text-white/55">
                {deleteTarget.name || deleteTarget.publicId}
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <AdminButton variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Keep it
                </AdminButton>
                <AdminButton variant="danger" onClick={() => void remove()} disabled={deleting}>
                  {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={11} />}
                  Delete
                </AdminButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
