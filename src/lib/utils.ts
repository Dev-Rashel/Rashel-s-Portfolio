export type ClassValue = string | number | null | false | undefined | ClassValue[] | Record<string, boolean>;

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];
  const walk = (input: ClassValue) => {
    if (!input) return;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
      return;
    }
    if (Array.isArray(input)) {
      input.forEach(walk);
      return;
    }
    for (const [key, value] of Object.entries(input)) {
      if (value) classes.push(key);
    }
  };
  inputs.forEach(walk);
  return classes.join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function formatDate(value?: string | Date | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

export function stripHtml(html: string, length = 180) {
  const text = html
    .replace(/<style[^>]*>.*?<\/style>/gis, " ")
    .replace(/<script[^>]*>.*?<\/script>/gis, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export function readingTime(html: string) {
  const words = stripHtml(html, Number.MAX_SAFE_INTEGER).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date);
}

/**
 * Zod `.partial()` still applies field defaults in Zod v4. For partial updates
 * we only want keys the client explicitly sent, otherwise saving one group of a
 * singleton form could reset fields owned by another group. This keeps parsed
 * values only where the request body actually contains a key.
 */
export function pickPresentValues<T>(parsed: T, input: unknown): T {
  if (Array.isArray(parsed)) return parsed;
  if (isRecord(parsed) && isRecord(input)) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(input)) {
      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        result[key] = pickPresentValues((parsed as Record<string, unknown>)[key], input[key]);
      }
    }
    return result as T;
  }
  return parsed;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function absoluteUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function splitList(value: string | string[] | undefined | null) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function truncate(value: string, length: number) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trim()}…`;
}
