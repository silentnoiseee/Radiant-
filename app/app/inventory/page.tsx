"use client";
import { PageHeader } from "@/components/radiant/PageHeader";
import { InventoryBoard } from "@/components/radiant/InventoryBoard";
import { homes } from "@/lib/mock/homes";

export default function InventoryPage() {
  const operational = homes.filter((h) => h.operational);
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader eyebrow="Supplies" title="Inventory" />
      {operational.length === 0 && (
        <div className="rounded-3xl border border-navy/5 bg-white p-10 text-center text-sm text-navy/50 shadow-soft">
          No operational homes yet.
        </div>
      )}
      {operational.map((h) => (
        <div key={h.id} className="space-y-2">
          {operational.length > 1 && <h2 className="px-1 font-display text-base font-bold text-navy">{h.name}</h2>}
          <InventoryBoard homeId={h.id} />
        </div>
      ))}
    </div>
  );
}
