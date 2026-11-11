export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "boolean"
  | "date"
  | "month"
  | "tags"
  | "list"
  | "image"
  | "images"
  | "editor"
  | "url"
  | "color"
  | "range"
  | "file"
  | "repeater";

export type AdminOption = { label: string; value: string };

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  placeholder?: string;
  help?: string;
  required?: boolean;
  colSpan?: 1 | 2;
  options?: AdminOption[];
  min?: number;
  max?: number;
  step?: number;
  folder?: string;
  rows?: number;
  accept?: string;
  itemFields?: AdminField[];
  itemLabel?: string;
  addLabel?: string;
  defaultValue?: unknown;
  autoSlugFrom?: string;
};

export type AdminColumn = {
  key: string;
  label: string;
  type?: "primary" | "text" | "boolean" | "badge" | "date" | "number" | "tags" | "image";
  secondaryKey?: string;
  imageKey?: string;
  hideBelow?: "sm" | "md" | "lg";
  align?: "left" | "right";
  trueLabel?: string;
  falseLabel?: string;
  trueTone?: "success" | "warning" | "danger" | "neutral" | "accent";
  falseTone?: "success" | "warning" | "danger" | "neutral" | "accent";
  width?: string;
};

export type AdminFilter = {
  key: string;
  label: string;
  options: AdminOption[];
};

const WIDE_TYPES: AdminFieldType[] = ["textarea", "editor", "images", "list", "repeater", "file"];

export function isWideField(field: AdminField) {
  return field.colSpan === 2 || WIDE_TYPES.includes(field.type);
}

export function fieldDefaultValue(field: AdminField): unknown {
  if (field.defaultValue !== undefined) {
    return cloneValue(field.defaultValue);
  }
  switch (field.type) {
    case "boolean":
      return false;
    case "number":
      return field.min ?? 0;
    case "range":
      return field.min ?? 0;
    case "tags":
    case "list":
    case "images":
    case "repeater":
      return [];
    case "file":
      return { url: "", publicId: "", fileName: "" };
    default:
      return "";
  }
}

export function cloneValue<T>(value: T): T {
  if (value === undefined) return value;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export function normalizeFieldValue(field: AdminField, raw: unknown): unknown {
  if (raw === undefined || raw === null) return fieldDefaultValue(field);

  switch (field.type) {
    case "boolean":
      return Boolean(raw);
    case "number":
    case "range": {
      const value = Number(raw);
      return Number.isFinite(value) ? value : fieldDefaultValue(field);
    }
    case "tags":
    case "list":
    case "images":
      return Array.isArray(raw) ? raw.map(String) : raw ? [String(raw)] : [];
    case "repeater": {
      if (!Array.isArray(raw)) return [];
      const itemFields = field.itemFields || [];
      return raw.map((entry) => {
        if (!entry || typeof entry !== "object") return {};
        const item: Record<string, unknown> = { ...(entry as Record<string, unknown>) };
        for (const itemField of itemFields) {
          item[itemField.name] = normalizeFieldValue(itemField, item[itemField.name]);
        }
        return item;
      });
    }
    case "file": {
      if (typeof raw === "string") return { url: raw, publicId: "", fileName: "" };
      if (typeof raw === "object") {
        const file = raw as Record<string, unknown>;
        return {
          url: String(file.url || ""),
          publicId: String(file.publicId || ""),
          fileName: String(file.fileName || ""),
          ...(file.updatedAt ? { updatedAt: file.updatedAt } : {}),
        };
      }
      return fieldDefaultValue(field);
    }
    case "date":
      return String(raw).slice(0, 10);
    case "month":
      return String(raw).slice(0, 7);
    case "image":
    case "url":
    case "color":
    case "text":
    case "textarea":
    case "editor":
    case "select":
      return String(raw);
    default:
      return raw;
  }
}

export function buildFieldValues(
  fields: AdminField[],
  source: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    values[field.name] = normalizeFieldValue(field, source ? getPath(source, field.name) : undefined);
  }
  return values;
}

export function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

export function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let current = target;
  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    const existing = current[key];
    if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return target;
}

export function normalizeArrayOrders<T extends Record<string, unknown>>(payload: T) {
  for (const value of Object.values(payload)) {
    if (!Array.isArray(value)) continue;
    value.forEach((item, index) => {
      if (item && typeof item === "object" && "order" in item) {
        (item as Record<string, unknown>).order = index;
      }
    });
  }
  return payload;
}
