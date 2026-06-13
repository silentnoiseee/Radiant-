import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "navy" | "teal" | "ok" | "due" | "alert" | "coral" | "muted";
const tones: Record<Tone, string> = {
  navy: "bg-navy-50 text-navy",
  teal: "bg-teal-50 text-teal-700",
  ok: "bg-[#E7F2EC] text-ok",
  due: "bg-[#FBF3D8] text-due",
  alert: "bg-[#F8E7E2] text-alert",
  coral: "bg-[#FCEEE0] text-coral-600",
  muted: "bg-navy-50 text-navy/60",
};

export function Badge({
  tone = "navy",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs font-semibold tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
