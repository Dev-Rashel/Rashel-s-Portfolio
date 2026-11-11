"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, MapPin, Trophy } from "lucide-react";
import type { SectionCopy } from "@/lib/models/SiteSettings";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { formatDate, cn } from "@/lib/utils";

type ActivityItem = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  image: string;
  gallery: string[];
  date: string;
  location: string;
  externalUrl: string;
  organizer: string;
  featured?: boolean;
};

type AchievementItem = {
  _id?: string;
  title: string;
  description: string;
  date: string;
  category: string;
  link: string;
  issuer: string;
};

export function Activities({
  activities,
  achievements,
  copy,
}: {
  activities: ActivityItem[];
  achievements: AchievementItem[];
  copy: SectionCopy;
}) {
  return (
    <section id="activities" className="section-shell relative overflow-hidden border-t border-[var(--line)]">
      <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-[rgba(var(--accent-rgb),0.06)] blur-[130px]" />
      <div className="frame relative">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} index="05" />

        {activities.length > 0 ? (
          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            {activities.slice(0, 5).map((activity, index) => (
              <ActivityCard key={activity._id || activity.title} activity={activity} index={index} />
            ))}
          </div>
        ) : (
          <Reveal className="mt-14">
            <div className="rounded-2xl border border-dashed border-[var(--line-strong)] p-12 text-center">
              <p className="font-display text-3xl italic">Life beyond the editor is on its way.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
                Competitions, workshops, community work, and events added through the dashboard will appear here.
              </p>
            </div>
          </Reveal>
        )}

        {achievements.length > 0 && (
          <div className="mt-16 grid gap-8 border-t border-[var(--line)] pt-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="sticky top-28">
                <p className="eyebrow">Recognition</p>
                <h3 className="mt-4 font-display text-4xl italic">Milestones</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  Moments that marked the journey — and the people who made them possible.
                </p>
                <Trophy className="mt-6 text-[var(--accent)]" size={22} strokeWidth={1.2} />
              </div>
            </div>
            <div className="lg:col-span-9">
              {achievements.map((achievement, index) => (
                <Reveal key={achievement._id || achievement.title} delay={index * 0.05}>
                  <div className="group grid gap-3 border-b border-[var(--line)] py-5 sm:grid-cols-[90px_1fr_auto] sm:items-start sm:gap-6">
                    <span className="text-[0.58rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                      {formatDate(achievement.date, { day: undefined, month: "short" })}
                    </span>
                    <div>
                      <h4 className="text-base font-medium text-[var(--foreground)]">{achievement.title}</h4>
                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--muted)]">{achievement.description}</p>
                      <p className="mt-2 text-[0.55rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {achievement.issuer || achievement.category}
                      </p>
                    </div>
                    {achievement.link ? (
                      <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]" aria-label={`View ${achievement.title}`}>
                        <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      <span className="hidden h-8 w-8 sm:block" />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ActivityCard({ activity, index }: { activity: ActivityItem; index: number }) {
  const isLarge = index === 0;
  const isWide = index === 1 || index === 2;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.75, delay: Math.min(index * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]",
        isLarge ? "lg:col-span-7 lg:row-span-2" : isWide ? "lg:col-span-5" : "lg:col-span-4",
        isLarge ? "aspect-[4/5] lg:aspect-auto lg:min-h-[540px]" : isWide ? "aspect-[16/10]" : "aspect-[4/3]"
      )}
    >
      {activity.externalUrl ? (
        <Link
          href={activity.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
         
          aria-label={`${activity.title} — open in a new tab`}
        >
          <ActivityBody activity={activity} isLarge={isLarge} linked />
        </Link>
      ) : (
        <div className="block h-full">
          <ActivityBody activity={activity} isLarge={isLarge} />
        </div>
      )}
    </motion.article>
  );
}

function ActivityBody({
  activity,
  isLarge,
  linked = false,
}: {
  activity: ActivityItem;
  isLarge: boolean;
  linked?: boolean;
}) {
  return (
    <>
      {activity.image ? (
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          sizes={isLarge ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 42vw"}
          className="object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-rgb),0.2),transparent_60%),linear-gradient(140deg,var(--surface),var(--background))]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/10" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
          {activity.category}
        </span>
        <span className="text-[0.52rem] uppercase tracking-[0.16em] text-white/60">
          {formatDate(activity.date, { day: undefined, month: "short" })}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className={cn("font-display leading-[1.05] text-white", isLarge ? "text-[clamp(1.8rem,2.6vw,2.5rem)]" : "text-[clamp(1.2rem,1.7vw,1.55rem)]")}>
          {activity.title}
        </h3>
        {isLarge && <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">{activity.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.52rem] uppercase tracking-[0.14em] text-white/50">
          {activity.organizer && <span>{activity.organizer}</span>}
          {activity.location && (
            <span className="flex items-center gap-1">
              <MapPin size={9} /> {activity.location}
            </span>
          )}
          {linked && (
            <span className="flex items-center gap-1 text-[var(--accent-soft)]">
              <ExternalLink size={9} /> External
            </span>
          )}
        </div>
      </div>
      {linked && (
        <span className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/20 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
          <ArrowUpRight size={15} />
        </span>
      )}
    </>
  );
}
