"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { loginSchema, type LoginValues } from "@/lib/validators";

export function AdminLoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError("root", { message: data.error || "Unable to sign in." });
        return;
      }
      const destination = nextPath && nextPath.startsWith("/admin") ? nextPath : data.redirect || "/admin/dashboard";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("root", { message: "Network error. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="field-label">Email address</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          {...register("email")}
          className="field !bg-black/30 !border-white/10 !text-[#f4f0fc] placeholder:!text-white/25"
          placeholder="admin@example.com"
        />
        {errors.email && <p className="mt-1.5 text-xs text-red-300">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            className="field !bg-black/30 !border-white/10 !pr-11 !text-[#f4f0fc] placeholder:!text-white/25"
            placeholder="••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-white/70"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-xs text-red-300">{errors.password.message}</p>}
      </div>

      {errors.root?.message && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-300"
        >
          {errors.root.message}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.985 }}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b794f6] px-5 py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.17em] text-[#0b0817] transition-all duration-300 hover:bg-[#eadcff] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <LockKeyhole size={14} />}
        {isSubmitting ? "Verifying" : "Enter dashboard"}
        {!isSubmitting && <ArrowRight size={14} />}
      </motion.button>

      <p className="flex items-center justify-center gap-2 pt-1 text-center text-[0.56rem] uppercase tracking-[0.16em] text-white/25">
        <LockKeyhole size={9} /> Session expires after 8 hours
      </p>
    </form>
  );
}
