"use client";
import { motion } from "framer-motion";
import { Pill, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Badge } from "@/components/ui/badge";
import { MedCard } from "@/components/radiant/MedCard";
import { useDemoStore } from "@/lib/store";

export default function MedicationsPage() {
  const admins = useDemoStore((s) => s.administrations);
  const due = admins.filter((a) => a.status === "due");
  const upcoming = admins.filter((a) => a.status === "upcoming");
  const completed = admins.filter((a) => ["given", "refused", "held"].includes(a.status));
  const givenCount = admins.filter((a) => a.status === "given").length;
  const total = admins.length;
  const pct = Math.round((givenCount / total) * 100);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Sunrise House" title="Medication pass">
        <Badge tone="ok"><CheckCircle2 className="h-3.5 w-3.5" /> {givenCount}/{total} given</Badge>
      </PageHeader>

      {/* progress */}
      <div className="rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
        <div className="flex items-center justify-between text-xs font-semibold text-navy/60">
          <span>Round progress</span><span>{pct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-navy-50">
          <motion.div className="h-full rounded-full bg-ok"
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>

      {due.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy">
            <span className="flex h-2.5 w-2.5 rounded-full bg-due animate-pulse" /> Due now
          </h2>
          <div className="space-y-3">{due.map((a, i) => <MedCard key={a.id} admin={a} index={i} />)}</div>
        </section>
      )}

      {due.length === 0 && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#E7F2EC] p-5 text-sm font-semibold text-ok">
          <CheckCircle2 className="h-5 w-5" /> Nothing due right now — beautiful work.
        </div>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-navy/70">Later today</h2>
          <div className="space-y-3">{upcoming.map((a, i) => <MedCard key={a.id} admin={a} index={i} />)}</div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-navy/70">Completed</h2>
          <div className="space-y-3 opacity-90">{completed.map((a, i) => <MedCard key={a.id} admin={a} index={i} />)}</div>
        </section>
      )}
    </div>
  );
}
