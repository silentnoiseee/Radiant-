"use client";
import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {eyebrow && (
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-teal">{eyebrow}</div>
        )}
        <h1 className="font-display text-2xl font-extrabold text-navy">{title}</h1>
      </motion.div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
