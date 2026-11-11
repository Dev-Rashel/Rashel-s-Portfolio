"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2, Mail, MapPin, Send } from "lucide-react";
import type { SectionCopy } from "@/lib/models/SiteSettings";
import { contactSchema, type ContactValues } from "@/lib/validators";
import { SectionHeading } from "./section-heading";
import { SocialIcon } from "./social-icon";
import { Reveal } from "./reveal";

type ContactProps = {
  copy: SectionCopy;
  contact: {
    email: string;
    phone: string;
    address: string;
    formTitle: string;
    formDescription: string;
    successMessage: string;
  };
  socials: { platform: string; label: string; url: string; icon?: string }[];
  available: boolean;
  availability: string;
};

export function Contact({ copy, contact, socials, available, availability }: ContactProps) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError("root", { message: data.error || "Something went wrong. Please try again." });
        return;
      }
      reset();
      setSent(true);
    } catch {
      setError("root", { message: "Network error. Please try again in a moment." });
    }
  };

  return (
    <section id="contact" className="section-shell relative overflow-hidden border-t border-[var(--line)]">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[rgba(var(--accent-rgb),0.09)] blur-[140px]" />
      <div className="frame relative">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} index="07" />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="max-w-lg text-[clamp(1.1rem,1.7vw,1.4rem)] font-light leading-relaxed text-[var(--foreground-soft)]">
                {contact.formDescription}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <a
                href={`mailto:${contact.email}`}
                className="group mt-9 flex w-fit items-center gap-3 border-b border-[var(--line-strong)] pb-3 transition-colors hover:border-[var(--accent)]"
              >
                <Mail size={16} className="text-[var(--accent)]" />
                <span className="font-display text-[clamp(1.5rem,2.8vw,2.4rem)] leading-none transition-colors group-hover:text-[var(--accent-soft)]">
                  {contact.email}
                </span>
                <ArrowUpRight size={18} className="text-[var(--muted)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            </Reveal>

            <div className="mt-10 grid gap-5 border-t border-[var(--line)] pt-7 sm:grid-cols-2">
              <Reveal>
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">Location</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-[var(--foreground-soft)]">
                    <MapPin size={12} className="text-[var(--accent)]" /> {contact.address}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">Availability</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-[var(--foreground-soft)]">
                    <span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-emerald-400" : "bg-[var(--muted)]"}`} />
                    {availability}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <div className="mt-9 flex flex-wrap items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.url + social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-2 text-[0.62rem] uppercase tracking-[0.12em] text-[var(--foreground-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <SocialIcon platform={social.platform} icon={social.icon} size={11} />
                    {social.label}
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-12 flex items-center gap-4 text-[0.55rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                <span className="h-px w-12 bg-[var(--line-strong)]" />
                Usually replies within 48 hours
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.08}>
              <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 backdrop-blur-md sm:p-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[rgba(var(--accent-rgb),0.09)] blur-3xl" />
                <div className="relative">
                  <p className="font-display text-2xl italic text-[var(--foreground)] sm:text-3xl">{contact.formTitle}</p>
                  {sent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex min-h-[340px] flex-col items-center justify-center text-center"
                    >
                      <span className="grid h-14 w-14 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                        <Check size={22} />
                      </span>
                      <h3 className="mt-5 font-display text-3xl">Message sent</h3>
                      <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">{contact.successMessage}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSent(false);
                          reset();
                        }}
                        className="mt-6 text-[0.6rem] uppercase tracking-[0.18em] text-[var(--accent)] underline underline-offset-4"
                      >
                        Send another note
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Your name" error={errors.name?.message}>
                          <input {...register("name")} className="field" placeholder="Your name" autoComplete="name" />
                        </Field>
                        <Field label="Email address" error={errors.email?.message}>
                          <input {...register("email")} type="email" className="field" placeholder="you@example.com" autoComplete="email" />
                        </Field>
                      </div>
                      <Field label="Subject" error={errors.subject?.message}>
                        <input {...register("subject")} className="field" placeholder="A role, project, or hello" />
                      </Field>
                      <Field label="Message" error={errors.message?.message}>
                        <textarea {...register("message")} rows={5} className="field resize-none" placeholder="Tell me a little about what you have in mind…" />
                      </Field>

                      <div className="hidden" aria-hidden>
                        <label htmlFor="website">Website</label>
                        <input id="website" {...register("website")} tabIndex={-1} autoComplete="off" />
                      </div>

                      {errors.root?.message && (
                        <p className="rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2 text-xs text-red-300">{errors.root.message}</p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                        <p className="max-w-[22ch] text-[0.54rem] leading-relaxed uppercase tracking-[0.14em] text-[var(--muted)]">
                          Your details stay private. No newsletters, ever.
                        </p>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileTap={{ scale: 0.97 }}
                          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          <span>{isSubmitting ? "Sending" : "Send message"}</span>
                        </motion.button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-[0.65rem] text-red-300">{error}</p>}
    </div>
  );
}
