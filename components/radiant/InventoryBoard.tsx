"use client";
import { useEffect, useMemo, useState } from "react";
import { Boxes, Plus, Trash2, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  home_id: string;
  name: string;
  status: "ok" | "low" | "out";
  updated_by_name: string | null;
  updated_at: string;
};

const STATUS: { id: Item["status"]; label: string; pill: string; btn: string }[] = [
  { id: "ok", label: "In stock", pill: "bg-[#E7F2EC] text-ok", btn: "border-ok/40 bg-[#E7F2EC] text-ok" },
  { id: "low", label: "Low", pill: "bg-[#FBF3D8] text-due", btn: "border-due/40 bg-[#FBF3D8] text-due" },
  { id: "out", label: "Out", pill: "bg-[#F8E7E2] text-alert", btn: "border-alert/40 bg-[#F8E7E2] text-alert" },
];
const order: Record<Item["status"], number> = { out: 0, low: 1, ok: 2 };

function whenText(iso: string) {
  return new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function InventoryBoard({ homeId }: { homeId: string }) {
  const { profile } = useAuth();
  const isManager = profile?.role === "manager" || profile?.is_owner;
  const [items, setItems] = useState<Item[]>([]);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("inventory_items")
      .select("id, home_id, name, status, updated_by_name, updated_at")
      .eq("home_id", homeId);
    if (data) setItems(data as Item[]);
  }
  useEffect(() => { load(); }, [homeId]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name)),
    [items]
  );
  const lowCount = items.filter((i) => i.status === "low").length;
  const outCount = items.filter((i) => i.status === "out").length;

  async function setStatus(id: string, status: Item["status"]) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i))); // optimistic
    await supabase
      .from("inventory_items")
      .update({
        status,
        updated_by: profile?.id ?? null,
        updated_by_name: profile?.full_name ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    load();
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || busy) return;
    setBusy(true);
    await supabase.from("inventory_items").insert({
      home_id: homeId,
      name: newName.trim(),
      status: "low",
      updated_by: profile?.id ?? null,
      updated_by_name: profile?.full_name ?? null,
    });
    setNewName("");
    setBusy(false);
    load();
  }

  async function removeItem(id: string) {
    await supabase.from("inventory_items").delete().eq("id", id);
    load();
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
          <Boxes className="h-5 w-5 text-teal" /> Supply inventory
        </h2>
        <div className="flex items-center gap-2 text-2xs font-semibold">
          {outCount > 0 && <span className="rounded-full bg-[#F8E7E2] px-2.5 py-1 text-alert">{outCount} out</span>}
          {lowCount > 0 && <span className="rounded-full bg-[#FBF3D8] px-2.5 py-1 text-due">{lowCount} low</span>}
          {outCount === 0 && lowCount === 0 && <span className="rounded-full bg-[#E7F2EC] px-2.5 py-1 text-ok">All stocked</span>}
        </div>
      </div>
      <p className="mt-1 text-2xs text-navy/45">Caregivers: tap a status when you count supplies. Low &amp; out items alert the manager.</p>

      {/* Add item */}
      <form onSubmit={addItem} className="mt-4 flex items-center gap-2">
        <Input className="h-10" placeholder="Add an item (e.g. Milk, Gloves)…" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <Button type="submit" variant="outline" size="sm" disabled={busy || !newName.trim()}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>

      {/* Items */}
      <div className="mt-4 space-y-2">
        {sorted.length === 0 && <p className="text-sm text-navy/45">No items yet — add the first supply above.</p>}
        {sorted.map((item) => {
          const flagged = item.status !== "ok";
          return (
            <div key={item.id} className={cn("rounded-2xl border p-3", flagged ? "border-navy/10 bg-cream/60" : "border-navy/5 bg-white")}>
              <div className="flex items-center gap-3">
                {flagged && <AlertTriangle className={cn("h-4 w-4 shrink-0", item.status === "out" ? "text-alert" : "text-due")} />}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-navy">{item.name}</div>
                  <div className="text-2xs text-navy/45">
                    {item.updated_by_name ? `Updated by ${item.updated_by_name}` : "Updated"} · {whenText(item.updated_at)}
                  </div>
                </div>
                {isManager && (
                  <button onClick={() => removeItem(item.id)} className="text-navy/25 transition hover:text-alert focus-ring rounded" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="mt-2.5 flex gap-1.5">
                {STATUS.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatus(item.id, st.id)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-2xs font-semibold transition focus-ring",
                      item.status === st.id ? st.btn : "border-navy/10 text-navy/45 hover:bg-navy-50"
                    )}
                  >
                    {item.status === st.id && <Check className="h-3 w-3" />} {st.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
