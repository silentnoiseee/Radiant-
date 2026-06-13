"use client";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  decimals = 0,
  suffix = "",
  icon: Icon,
  tone = "navy",
  hint,
  index = 0,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  icon: LucideIcon;
  tone?: "navy" | "teal" | "coral" | "ok" | "due" | "alert";
  hint?: string;
  index?: number;
}) {
  const toneMap: Record<string, string> = {
    navy: "text-navy bg-navy-50",
    teal: "text-teal-700 bg-teal-50",
    coral: "text-coral-600 bg-[#FCEEE0]",
    ok: "text-ok bg-[#E7F2EC]",
    due: "text-due bg-[#FBF3D8]",
    alert: "text-alert bg-[#F8E7E2]",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-white p-6 shadow-soft border border-navy/5"
    >
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneMap[tone])}>
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <div className="mt-5 font-display text-3xl font-extrabold leading-none text-navy">
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </div>
      <div className="mt-2 text-xs font-semibold text-navy/55">{label}</div>
      {hint && <div className="mt-1 text-2xs text-navy/40">{hint}</div>}
    </motion.div>
  );
}
