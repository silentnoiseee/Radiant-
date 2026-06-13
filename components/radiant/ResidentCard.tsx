"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar } from "./Avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ChevronRight, MapPin } from "lucide-react";
import type { Resident } from "@/lib/types";

const statusTone = {
  stable: "ok",
  attention: "due",
  appointment: "teal",
} as const;
const statusLabel = {
  stable: "Stable",
  attention: "Monitor",
  appointment: "Appointment",
} as const;

export function ResidentCard({ resident, index = 0 }: { resident: Resident; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/app/residents/${resident.id}`}
        className="group block rounded-2xl bg-white p-5 shadow-soft border border-navy/5 transition-all hover:shadow-lift hover:-translate-y-1 focus-ring"
      >
        <div className="flex items-start gap-4">
          <Avatar name={resident.name} color={resident.photoColor} size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-display text-lg font-bold text-navy">{resident.name}</h3>
              <ChevronRight className="h-5 w-5 shrink-0 text-navy/25 transition group-hover:translate-x-1 group-hover:text-teal" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-navy/50">
              <MapPin className="h-3.5 w-3.5" /> Room {resident.room} · Age {resident.age}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone={statusTone[resident.status]}>{statusLabel[resident.status]}</Badge>
              {resident.allergies.length > 0 && (
                <Badge tone="alert">
                  <AlertTriangle className="h-3 w-3" /> {resident.allergies.length} allerg
                  {resident.allergies.length > 1 ? "ies" : "y"}
                </Badge>
              )}
            </div>
            <p className="mt-3 line-clamp-1 text-xs text-navy/55">{resident.statusNote}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
