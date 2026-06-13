"use client";
import { useState } from "react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { ResidentCard } from "@/components/radiant/ResidentCard";
import { Badge } from "@/components/ui/badge";
import { residents } from "@/lib/mock/residents";
import { homes } from "@/lib/mock/homes";
import { cn } from "@/lib/utils";

export default function ResidentsPage() {
  const [home, setHome] = useState<string>("all");
  const filtered = home === "all" ? residents : residents.filter((r) => r.homeId === home);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Care" title="Residents" />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setHome("all")}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-semibold transition focus-ring",
            home === "all" ? "bg-navy text-white" : "bg-white text-navy/60 border border-navy/10 hover:bg-navy-50"
          )}
        >
          All homes · {residents.length}
        </button>
        {homes.map((h) => {
          const count = residents.filter((r) => r.homeId === h.id).length;
          return (
            <button
              key={h.id}
              onClick={() => setHome(h.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition focus-ring",
                home === h.id ? "bg-navy text-white" : "bg-white text-navy/60 border border-navy/10 hover:bg-navy-50"
              )}
            >
              {h.name} · {count}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r, i) => (
          <ResidentCard key={r.id} resident={r} index={i} />
        ))}
      </div>
    </div>
  );
}
