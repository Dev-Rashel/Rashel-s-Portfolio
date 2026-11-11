"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "./toast";

type ImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  folder?: string;
  className?: string;
  aspect?: string;
  allowUrl?: boolean;
};

export function ImageUploader({
  value,
  onChange,
  label,
  folder = "portfolio",
  className = "",
  aspect = "aspect-[16/10]",
  allowUrl = true,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url);
      toast("Image uploaded.");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) upload(file);
    event.target.value = "";
  };

  return (
    <div className={className}>
      {label && <label className="field-label">{label}</label>}
      <div
        className={`relative overflow-hidden rounded-xl border border-dashed bg-black/20 transition-colors ${
          dragging ? "border-[#b794f6]" : "border-white/12 hover:border-white/25"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
      >
        {value ? (
          <div className={`relative w-full ${aspect}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Upload preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100" />
            <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 transition-opacity hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1.5 text-[0.5rem] uppercase tracking-[0.1em] text-white backdrop-blur-md"
              >
                <UploadCloud size={11} /> Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="grid h-7 w-7 place-items-center rounded-full bg-black/70 text-red-300 backdrop-blur-md"
                aria-label="Remove image"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 px-4 py-8 text-center"
          >
            {uploading ? <Loader2 size={20} className="animate-spin text-[#b794f6]" /> : <ImagePlus size={20} className="text-white/25" />}
            <span className="text-[0.62rem] text-white/45">{uploading ? "Uploading…" : "Click or drop an image"}</span>
            <span className="text-[0.5rem] uppercase tracking-[0.12em] text-white/20">JPG, PNG, WebP · max 8MB</span>
          </button>
        )}
        {uploading && value && (
          <div className="absolute inset-0 grid place-items-center bg-black/50">
            <Loader2 size={20} className="animate-spin text-[#b794f6]" />
          </div>
        )}
      </div>

      {allowUrl && (
        <div className="relative mt-2">
          <Link2 size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="…or paste an image URL"
            className="field !py-2 !pl-7 !text-[0.68rem]"
          />
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={onFile} className="hidden" />
    </div>
  );
}

export function MultiImageUploader({
  values,
  onChange,
  folder = "gallery",
  label = "Gallery",
}: {
  values: string[];
  onChange: (values: string[]) => void;
  folder?: string;
  label?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {values.map((image, index) => (
          <div key={`${image}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={`Gallery item ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-red-300 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove gallery image"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <ImageUploader value="" onChange={(url) => url && onChange([...values, url])} folder={folder} allowUrl={false} aspect="aspect-[4/3]" />
      </div>
      <div className="mt-2">
        <input
          placeholder="Paste an image URL and press Enter"
          className="field !py-2 !text-[0.68rem]"
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            const input = event.currentTarget;
            const url = input.value.trim();
            if (url) {
              onChange([...values, url]);
              input.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}

export function FileUploader({
  value,
  onChange,
  label = "File",
  folder = "resume",
  accept = "application/pdf",
  fileName,
}: {
  value: string;
  onChange: (url: string, publicId?: string, fileName?: string) => void;
  label?: string;
  folder?: string;
  accept?: string;
  fileName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url, data.publicId, file.name);
      toast("File uploaded.");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-white/12 bg-black/20 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#b794f6]/10 text-[#b794f6]">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-white/65">{fileName || (value ? value.split("/").pop() : "No file uploaded")}</p>
          <p className="mt-0.5 text-[0.5rem] uppercase tracking-[0.12em] text-white/22">PDF · max 8MB</p>
        </div>
        <div className="flex items-center gap-2">
          {value && (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-[0.55rem] uppercase tracking-[0.12em] text-[#b794f6] underline underline-offset-2">
              View
            </a>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-white/12 px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.1em] text-white/60 hover:border-white/30 hover:text-white"
          >
            {value ? "Replace" : "Upload"}
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
