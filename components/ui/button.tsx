"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "teal" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-coral text-white hover:bg-coral-600 shadow-soft",
  teal: "bg-teal text-white hover:bg-teal-600 shadow-soft",
  outline: "border border-navy/15 bg-white text-navy hover:bg-navy-50",
  ghost: "text-navy hover:bg-navy-50",
  danger: "bg-alert text-white hover:opacity-90 shadow-soft",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] focus-ring disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
