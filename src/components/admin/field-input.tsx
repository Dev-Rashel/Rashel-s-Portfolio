"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type AdminField,
  fieldDefaultValue,
  isWideField,
  normalizeFieldValue,
} from "@/lib/admin-fields";
import { FileUploader, ImageUploader, MultiImageUploader } from "./uploaders";
import { RichEditor } from "./rich-editor";

type FieldInputProps = {
  field: AdminField;
  value: unknown;
  onChange: (value: unknown) => void;
  compact?: boolean;
};

export function FieldInput({ field, value, onChange, compact = false }: FieldInputProps) {
  const wide = !compact && isWideField(field);

  return (
    <div className={cn("min-w-0", wide && "sm:col-span-2")}>
      {field.type === "boolean" ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold text-white/75">{field.label}</p>
            {field.help && <p className="mt-0.5 text-[0.56rem] leading-relaxed text-white/30">{field.help}</p>}
          </div>
          <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} />
        </div>
      ) : field.type === "repeater" ? (
        <RepeaterInput field={field} value={value} onChange={onChange} />
      ) : (
        <>
          <label className="field-label">
            {field.label}
            {field.required && <span className="ml-1 text-[#b794f6]">*</span>}
          </label>
          <FieldControl field={field} value={value} onChange={onChange} />
          {field.help && <p className="mt-1.5 text-[0.56rem] leading-relaxed text-white/30">{field.help}</p>}
        </>
      )}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: AdminField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const text = value === undefined || value === null ? "" : String(value);

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          className="field resize-y !text-[0.82rem]"
          rows={field.rows || 4}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "editor":
      return <RichEditor value={text} onChange={(next) => onChange(next)} placeholder={field.placeholder} folder={field.folder} />;

    case "number":
      return (
        <input
          type="number"
          className="field"
          value={value === undefined || value === null || value === "" ? "" : Number(value)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "range":
      return (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
          <input
            type="range"
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#b794f6]"
            value={Number(value) || 0}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          <span className="w-10 text-right text-[0.64rem] tabular-nums text-[#b794f6]">{Number(value) || 0}</span>
        </div>
      );

    case "select":
      return (
        <select className="field !text-[0.82rem]" value={text} onChange={(event) => onChange(event.target.value)} required={field.required}>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value} className="bg-[#151027]">
              {option.label}
            </option>
          ))}
        </select>
      );

    case "date":
      return (
        <input
          type="date"
          className="field"
          value={text.slice(0, 10)}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
        />
      );

    case "month":
      return (
        <input
          type="month"
          className="field"
          value={text.slice(0, 7)}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
        />
      );

    case "tags":
      return <TagInput value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={field.placeholder} />;

    case "list":
      return <ListInput value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={field.placeholder} rows={field.rows} />;

    case "image":
      return (
        <ImageUploader
          value={text}
          onChange={(next) => onChange(next)}
          folder={field.folder || "portfolio"}
          aspect="aspect-[16/10]"
        />
      );

    case "images":
      return (
        <MultiImageUploader
          values={Array.isArray(value) ? (value as string[]) : []}
          onChange={(next) => onChange(next)}
          folder={field.folder || "gallery"}
          label={field.label}
        />
      );

    case "file": {
      const fileValue = (value && typeof value === "object" ? value : { url: "" }) as {
        url?: string;
        fileName?: string;
      };
      return (
        <FileUploader
          value={fileValue.url || ""}
          fileName={fileValue.fileName}
          onChange={(url, publicId, fileName) =>
            onChange({
              url,
              publicId: publicId || "",
              fileName: fileName || "",
              updatedAt: new Date().toISOString(),
            })
          }
          label={field.label}
          folder={field.folder || "resume"}
          accept={field.accept || "application/pdf"}
        />
      );
    }

    case "color":
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={text || "#b794f6"}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-black/20 p-1"
            aria-label={`${field.label} colour`}
          />
          <input
            className="field"
            value={text}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder || "#b794f6"}
          />
        </div>
      );

    case "url":
    case "text":
    default:
      return (
        <input
          type="text"
          className="field"
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          autoComplete="off"
          spellCheck={false}
        />
      );
  }
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200",
        checked ? "border-[#b794f6]/40 bg-[#b794f6]" : "border-white/15 bg-white/10"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-[#0b0817] transition-transform duration-200",
          checked ? "translate-x-[1.15rem]" : "translate-x-0.5 bg-white/60"
        )}
      />
    </button>
  );
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw?: string) => {
    const next = (raw ?? draft)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (next.length === 0) return;
    const merged = [...value];
    for (const tag of next) {
      if (!merged.some((item) => item.toLowerCase() === tag.toLowerCase())) merged.push(tag);
    }
    onChange(merged);
    setDraft("");
  };

  return (
    <div
      className="flex min-h-[2.7rem] flex-wrap items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] px-2.5 py-2 transition-colors focus-within:border-[var(--accent)]"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full border border-[#b794f6]/20 bg-[#b794f6]/10 px-2 py-0.5 text-[0.58rem] text-[#b794f6]"
        >
          {tag}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onChange(value.filter((item) => item !== tag));
            }}
            className="text-[#b794f6]/60 hover:text-[#eadcff]"
            aria-label={`Remove ${tag}`}
          >
            <X size={9} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(event) => {
          const next = event.target.value;
          if (next.includes(",")) commit(next);
          else setDraft(next);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
          if (event.key === "Backspace" && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => commit()}
        placeholder={value.length === 0 ? placeholder || "Type and press Enter…" : ""}
        className="min-w-[7rem] flex-1 bg-transparent py-0.5 text-[0.75rem] text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
      />
    </div>
  );
}

function ListInput({
  value,
  onChange,
  placeholder,
  rows,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  rows?: number;
}) {
  const joined = value.join("\n");
  const [text, setText] = useState(joined);
  const lastJoined = useRef(joined);

  useEffect(() => {
    if (joined !== lastJoined.current) {
      lastJoined.current = joined;
      setText(joined);
    }
  }, [joined]);

  return (
    <textarea
      className="field resize-y !text-[0.78rem]"
      rows={rows || 4}
      value={text}
      placeholder={placeholder || "One item per line…"}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);
        const parsed = next
          .split(/\r?\n/)
          .map((line) => line.replace(/^\s*[-•]\s*/, "").trim())
          .filter(Boolean);
        lastJoined.current = parsed.join("\n");
        onChange(parsed);
      }}
    />
  );
}

function RepeaterInput({
  field,
  value,
  onChange,
}: {
  field: AdminField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const itemFields = field.itemFields || [];

  const updateItem = (index: number, name: string, next: unknown) => {
    const copy = items.map((item) => ({ ...item }));
    copy[index] = { ...copy[index], [name]: next };
    onChange(copy);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  const add = () => {
    const item: Record<string, unknown> = {};
    for (const itemField of itemFields) {
      item[itemField.name] = fieldDefaultValue(itemField);
    }
    if (typeof field.defaultValue === "object" && field.defaultValue && !Array.isArray(field.defaultValue)) {
      Object.assign(item, field.defaultValue);
    }
    // Keep repeatable collections (nav, socials, timeline items) in the order they
    // were added. normalizeArrayOrders then rewrites these on save.
    if (!("order" in item)) item.order = items.length;
    onChange([...items, item]);
  };

  const labelFor = (item: Record<string, unknown>, index: number) => {
    const labelField = itemFields.find((itemField) => itemField.type === "text" && itemField.label.toLowerCase().includes("label"));
    const nameField = itemFields.find((itemField) => itemField.name === "label" || itemField.name === "title" || itemField.name === "name");
    const valueText = String(item[nameField?.name || ""] || item[labelField?.name || ""] || "");
    return valueText || `${field.itemLabel || "Item"} ${index + 1}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="field-label !mb-0">{field.label}</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-full border border-[#b794f6]/25 bg-[#b794f6]/10 px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.12em] text-[#b794f6] transition-colors hover:bg-[#b794f6]/15"
        >
          <Plus size={10} /> {field.addLabel || "Add item"}
        </button>
      </div>
      {field.help && <p className="mt-1 text-[0.56rem] leading-relaxed text-white/30">{field.help}</p>}

      <div className="mt-3 space-y-3">
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-[0.64rem] text-white/28">
            Nothing added yet.
          </div>
        )}
        {items.map((item, index) => (
          <div key={String(item._id || index)} className="rounded-xl border border-white/8 bg-black/20 p-3.5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                {labelFor(item, index)}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="grid h-6 w-6 place-items-center rounded text-white/30 hover:bg-white/5 hover:text-white/70 disabled:opacity-20"
                  aria-label="Move up"
                >
                  <ArrowUp size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="grid h-6 w-6 place-items-center rounded text-white/30 hover:bg-white/5 hover:text-white/70 disabled:opacity-20"
                  aria-label="Move down"
                >
                  <ArrowDown size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                  className="grid h-6 w-6 place-items-center rounded text-white/25 hover:bg-red-400/10 hover:text-red-300"
                  aria-label="Remove item"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {itemFields.map((itemField) => (
                <FieldInput
                  key={itemField.name}
                  field={itemField}
                  value={normalizeFieldValue(itemField, item[itemField.name])}
                  onChange={(next) => updateItem(index, itemField.name, next)}
                  compact
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
