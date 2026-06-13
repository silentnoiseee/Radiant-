"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, PauseCircle, Pill, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/store";
import { medById } from "@/lib/mock/meds";
import { residentById } from "@/lib/mock/residents";
import { Avatar } from "./Avatar";
import type { MedAdministration } from "@/lib/types";

export function MedCard({ admin, index = 0 }: { admin: MedAdministration; index?: number }) {
  const med = medById(admin.medId);
  const resident = residentById(med.residentId)!;
  const setMedStatus = useDemoStore((s) => s.setMedStatus);
  const current = useDemoStore((s) => s.administrations.find((a) => a.id === admin.id))!;
  const [reasonFor, setReasonFor] = useState<"refused" | "held" | null>(null);
  const [reason, setReason] = useState("");

  const done = current.status === "given";
  const refused = current.status === "refused";
  const held = current.status === "held";
  const resolved = done || refused || held;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-soft border border-navy/5"
    >
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pointer-events-none absolute right-4 top-4"
          >
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ok text-white shadow-glow"
            >
              <Check className="h-5 w-5" strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Pill className="h-6 w-6" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-navy/40" />
            <span className="text-xs font-bold text-navy/60">{current.scheduledTime}</span>
            {current.status === "due" && <Badge tone="due">Due now</Badge>}
            {current.status === "upcoming" && <Badge tone="muted">Upcoming</Badge>}
            {done && <Badge tone="ok">Given {current.at}</Badge>}
            {refused && <Badge tone="alert">Refused</Badge>}
            {held && <Badge tone="navy">Held</Badge>}
          </div>
          <h3 className="mt-1.5 font-display text-lg font-bold text-navy">
            {med.name} <span className="text-navy/50 font-sans text-sm font-medium">{med.dose} · {med.route}</span>
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-navy/55">
            <Avatar name={resident.name} color={resident.photoColor} size={22} />
            {resident.name} · Room {resident.room}
          </div>
          {resident.allergies.length > 0 && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#F8E7E2] px-2.5 py-1 text-2xs font-semibold text-alert">
              <AlertTriangle className="h-3 w-3" /> Allergies: {resident.allergies.join(", ")}
            </div>
          )}

          {(reason && resolved && (refused || held)) ? (
            <p className="mt-3 text-xs italic text-navy/55">Reason: {current.reason}</p>
          ) : null}

          {!resolved && reasonFor === null && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="teal" onClick={() => setMedStatus(current.id, "given")}>
                <Check className="h-4 w-4" /> Give
              </Button>
              <Button size="sm" variant="outline" onClick={() => setReasonFor("refused")}>
                <X className="h-4 w-4" /> Refused
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setReasonFor("held")}>
                <PauseCircle className="h-4 w-4" /> Hold
              </Button>
            </div>
          )}

          <AnimatePresence>
            {reasonFor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <label className="text-2xs font-bold uppercase tracking-wide text-navy/50">
                  Reason for {reasonFor === "refused" ? "refusal" : "holding"}
                </label>
                <textarea
                  autoFocus
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Required — note what happened…"
                  className="mt-1.5 min-h-16 w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-sm focus-ring focus:border-teal"
                />
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant={reasonFor === "refused" ? "danger" : "primary"}
                    disabled={!reason.trim()}
                    onClick={() => {
                      setMedStatus(current.id, reasonFor, reason.trim());
                      setReasonFor(null);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setReasonFor(null); setReason(""); }}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
