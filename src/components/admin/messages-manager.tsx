"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArchiveRestore,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  RefreshCw,
  Reply,
  Search,
  Trash2,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { AdminButton, EmptyState, PageHeader, SkeletonRows, StatusBadge } from "./ui";
import { toast } from "./toast";

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
};

type Filter = "inbox" | "unread" | "archived" | "all";

const FILTERS: Array<{ key: Filter; label: string; icon: typeof Inbox }> = [
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "unread", label: "Unread", icon: Mail },
  { key: "archived", label: "Archived", icon: Archive },
  { key: "all", label: "All", icon: MailOpen },
];

export function MessagesManager() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("inbox");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Message | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "60" });
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (filter === "inbox") params.set("archived", "false");
      if (filter === "archived") params.set("archived", "true");
      if (filter === "unread") {
        params.set("archived", "false");
        params.set("read", "false");
      }
      const response = await fetch(`/api/admin/resources/messages?${params.toString()}`, { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not load messages.");
      const next = (body.data || []) as Message[];
      setMessages(next);
      setSelectedId((current) => (current && next.some((message) => message._id === current) ? current : next[0]?._id || null));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load messages.");
    } finally {
      setLoading(false);
    }
  }, [router, filter, debouncedQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchMessage = useCallback(
    async (message: Message, payload: { read?: boolean; archived?: boolean }) => {
      setBusy(message._id);
      try {
        const response = await fetch(`/api/admin/resources/messages?id=${message._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.status === 401) {
          router.replace("/admin");
          return;
        }
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || "Could not update the message.");
        setMessages((current) =>
          current
            .map((item) => (item._id === message._id ? { ...item, ...payload } : item))
            .filter((item) => {
              if (filter === "unread" && item.read) return false;
              if (filter === "inbox" && item.archived) return false;
              if (filter === "archived" && !item.archived) return false;
              return true;
            })
        );
        router.refresh();
      } catch (actionError) {
        toast(actionError instanceof Error ? actionError.message : "Could not update the message.", "error");
      } finally {
        setBusy(null);
      }
    },
    [router, filter]
  );

  const select = (message: Message) => {
    setSelectedId(message._id);
    if (!message.read) void patchMessage(message, { read: true });
  };

  const remove = async (message: Message) => {
    setBusy(message._id);
    try {
      const response = await fetch(`/api/admin/resources/messages?id=${message._id}`, { method: "DELETE" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not delete the message.");
      const remaining = messages.filter((item) => item._id !== message._id);
      setMessages(remaining);
      setSelectedId(remaining[0]?._id || null);
      setConfirmDelete(null);
      toast("Message deleted.");
      router.refresh();
    } catch (actionError) {
      toast(actionError instanceof Error ? actionError.message : "Could not delete the message.", "error");
    } finally {
      setBusy(null);
    }
  };

  const selected = messages.find((message) => message._id === selectedId) || null;
  const unreadCount = messages.filter((message) => !message.read && !message.archived).length;

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Messages"
        description="Every conversation that starts here — kept in one quiet place."
        actions={
          <AdminButton variant="ghost" onClick={() => void load()}>
            <RefreshCw size={12} /> Refresh
          </AdminButton>
        }
      />

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.018] p-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-1">
          {FILTERS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.54rem] font-bold uppercase tracking-[0.12em] transition-colors",
                  filter === item.key ? "bg-[#ff7a6b] text-[#0b0714]" : "text-white/35 hover:bg-white/5 hover:text-white/70"
                )}
              >
                <Icon size={10} /> {item.label}
                {item.key === "unread" && unreadCount > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[0.45rem]",
                      filter === "unread" ? "bg-[#0b0714]/15 text-[#0b0714]" : "bg-[#ff7a6b]/15 text-[#ff7a6b]"
                    )}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages…"
            className="field !py-2 !pl-8 !text-[0.7rem]"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.018]">
          {loading ? (
            <SkeletonRows rows={6} />
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-white/60">Could not load messages.</p>
              <p className="mt-1 text-xs text-white/30">{error}</p>
              <AdminButton variant="ghost" className="mt-4" onClick={() => void load()}>
                Try again
              </AdminButton>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={<Inbox size={24} />}
                title={filter === "archived" ? "The archive is empty" : "No messages here"}
                description={
                  filter === "archived"
                    ? "Messages you archive will be kept here, out of the way but never lost."
                    : "When someone writes through the contact form, their message will appear here."
                }
              />
            </div>
          ) : (
            <div className="max-h-[72vh] divide-y divide-white/5 overflow-y-auto">
              {messages.map((message) => (
                <button
                  key={message._id}
                  type="button"
                  onClick={() => select(message)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors",
                    selectedId === message._id ? "bg-white/[0.055]" : "hover:bg-white/[0.025]"
                  )}
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] font-display text-sm text-[#ff7a6b]">
                    {message.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("truncate text-[0.68rem]", message.read ? "text-white/55" : "font-semibold text-white/85")}>
                        {message.name}
                      </p>
                      <span className="shrink-0 text-[0.46rem] uppercase tracking-[0.08em] text-white/22">
                        {formatDate(message.createdAt, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className={cn("mt-0.5 truncate text-[0.64rem]", message.read ? "text-white/35" : "text-white/65")}>
                      {message.subject}
                    </p>
                    <p className="mt-1 truncate text-[0.56rem] leading-relaxed text-white/22">{message.message}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {!message.read && <span className="h-1 w-1 rounded-full bg-[#ff7a6b]" />}
                      {message.archived && <StatusBadge tone="neutral">Archived</StatusBadge>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-h-[420px] overflow-hidden rounded-xl border border-white/8 bg-white/[0.018]">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="border-b border-white/8 px-5 py-4 sm:px-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-2xl leading-tight text-white/90">{selected.subject}</h3>
                      {!selected.read && <StatusBadge tone="accent">Unread</StatusBadge>}
                      {selected.archived && <StatusBadge tone="neutral">Archived</StatusBadge>}
                    </div>
                    <p className="mt-1.5 text-[0.62rem] text-white/35">
                      From <span className="text-white/65">{selected.name}</span> ·{" "}
                      <a href={`mailto:${selected.email}`} className="text-[#ff7a6b] hover:text-[#ffc4ad]">
                        {selected.email}
                      </a>
                    </p>
                    <p className="mt-1 text-[0.5rem] uppercase tracking-[0.12em] text-white/22">
                      {formatDate(selected.createdAt, { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <a
                      href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#ff7a6b]/25 bg-[#ff7a6b]/10 px-3 py-1.5 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-[#ff7a6b] transition-colors hover:bg-[#ff7a6b]/15"
                    >
                      <Reply size={10} /> Reply
                    </a>
                    <button
                      type="button"
                      disabled={busy === selected._id}
                      onClick={() => void patchMessage(selected, { read: !selected.read })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-white/45 transition-colors hover:border-white/25 hover:text-white/80"
                    >
                      {busy === selected._id ? <Loader2 size={10} className="animate-spin" /> : selected.read ? <Mail size={10} /> : <MailOpen size={10} />}
                      {selected.read ? "Unread" : "Read"}
                    </button>
                    <button
                      type="button"
                      disabled={busy === selected._id}
                      onClick={() => void patchMessage(selected, { archived: !selected.archived })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-white/45 transition-colors hover:border-white/25 hover:text-white/80"
                    >
                      {selected.archived ? <ArchiveRestore size={10} /> : <Archive size={10} />}
                      {selected.archived ? "Restore" : "Archive"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(selected)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-red-300 transition-colors hover:bg-red-400/15"
                    >
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 px-5 py-6 sm:px-6">
                <p className="whitespace-pre-wrap text-[0.84rem] leading-[1.85] text-white/65">{selected.message}</p>
              </div>
              <div className="border-t border-white/8 px-5 py-3 sm:px-6">
                <p className="text-[0.5rem] uppercase tracking-[0.14em] text-white/22">
                  Delivered through the portfolio contact form
                </p>
              </div>
            </div>
          ) : (
            <div className="grid h-full min-h-[420px] place-items-center px-6 text-center">
              <div>
                <MailOpen size={26} className="mx-auto text-white/15" />
                <p className="mt-3 font-display text-2xl text-white/55">Select a message</p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-white/25">
                  Choose a conversation from the list to read it, reply, archive it, or clear it away.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[120] grid place-items-center px-4">
            <motion.div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
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
              <h3 className="mt-4 font-display text-2xl text-white">Delete this message?</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                This permanently removes the conversation from your inbox. This cannot be undone.
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <AdminButton variant="ghost" onClick={() => setConfirmDelete(null)} disabled={busy === confirmDelete._id}>
                  Keep it
                </AdminButton>
                <AdminButton variant="danger" onClick={() => void remove(confirmDelete)} disabled={busy === confirmDelete._id}>
                  {busy === confirmDelete._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={11} />}
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
