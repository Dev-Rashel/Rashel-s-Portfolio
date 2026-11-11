import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Fingerprint, ShieldCheck, Sparkles } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Private access",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#080b11] text-[#f4efe6]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(233,178,95,0.12),transparent_55%),radial-gradient(ellipse_at_80%_85%,rgba(84,179,163,0.08),transparent_55%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          maskImage: "radial-gradient(ellipse at center, black 10%, transparent 78%)",
        }}
      />

      <section className="relative z-10 hidden w-[56%] flex-col justify-between border-r border-white/10 p-10 lg:flex xl:p-14">
        <Link href="/" className="group flex w-fit items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/80">
          <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" /> Back to portfolio
        </Link>

        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15">
              <Fingerprint size={18} className="text-[#e9b25f]" />
            </span>
            <div className="text-[0.55rem] uppercase tracking-[0.26em] text-white/35">Private workspace</div>
          </div>
          <h1 className="mt-8 max-w-2xl font-display text-[clamp(4rem,7vw,7.5rem)] leading-[0.86] tracking-[-0.04em]">
            The quiet <br />
            <span className="italic text-[#e9b25f]">control room.</span>
          </h1>
          <p className="mt-7 max-w-sm text-sm leading-relaxed text-white/40">
            A private space for shaping the portfolio — every project, word, image, and detail. Authorised access only.
          </p>
        </div>

        <div className="grid max-w-lg grid-cols-3 gap-4">
          {[
            ["24/7", "Control"],
            ["100%", "Dynamic"],
            ["Secure", "Sessions"],
          ].map(([value, label]) => (
            <div key={label} className="border-t border-white/10 pt-4">
              <p className="font-display text-2xl text-white/80">{value}</p>
              <p className="mt-1 text-[0.52rem] uppercase tracking-[0.18em] text-white/28">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.18em] text-white/40">
              <ArrowLeft size={11} /> Portfolio
            </Link>
            <span className="text-[0.52rem] uppercase tracking-[0.2em] text-white/25">Admin</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[#e9b25f]/30 bg-[#e9b25f]/10 text-[#e9b25f]">
                <ShieldCheck size={19} />
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[0.48rem] uppercase tracking-[0.18em] text-white/30">
                <Sparkles size={8} /> Encrypted
              </span>
            </div>
            <h2 className="mt-6 font-display text-4xl">Welcome back.</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/35">
              Sign in with your administrator credentials to manage the site.
            </p>

            <div className="mt-7">
              <AdminLoginForm nextPath={next} />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-[0.5rem] uppercase tracking-[0.16em] text-white/22">
            <span>No public registration</span>
            <span>Authorised only</span>
          </div>
        </div>
      </section>
    </main>
  );
}
