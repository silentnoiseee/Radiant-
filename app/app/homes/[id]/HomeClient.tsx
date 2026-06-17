"use client";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, ShieldCheck, Users, BedDouble, Construction,
  Sofa, Utensils, Bath, Pill, Briefcase, DoorOpen, ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/radiant/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/radiant/Avatar";
import { InventoryBoard } from "@/components/radiant/InventoryBoard";
import { homeById } from "@/lib/mock/homes";
import { residents } from "@/lib/mock/residents";
import { cn } from "@/lib/utils";

const commonRooms: { label: string; icon: typeof Sofa; span: number }[] = [
  { label: "Living Room", icon: Sofa, span: 2 },
  { label: "Kitchen", icon: Utensils, span: 1 },
  { label: "Dining", icon: Utensils, span: 1 },
  { label: "Bathroom", icon: Bath, span: 1 },
  { label: "Bathroom 2", icon: Bath, span: 1 },
  { label: "Medication Room", icon: Pill, span: 1 },
  { label: "Staff Office", icon: Briefcase, span: 1 },
  { label: "Entrance / Foyer", icon: DoorOpen, span: 2 },
];

export default function HomeClient() {
  const { id } = useParams<{ id: string }>();
  const home = homeById(id);
  if (!home) return notFound();

  const homeResidents = residents.filter((r) => r.homeId === home.id);

  // Locked / under construction
  if (!home.operational) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <Link href="/app/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/55 hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <div className="rounded-3xl border border-dashed border-navy/15 bg-white p-12 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FBF3D8] text-due">
            <Construction className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-navy">{home.name}</h1>
          <p className="mt-2 text-navy/60">This home is under construction and isn&apos;t operational yet. Check back once it opens.</p>
          <Badge tone="due" className="mt-5"><Construction className="h-3.5 w-3.5" /> Under construction</Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link href="/app/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/55 hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      <PageHeader eyebrow="Home" title={home.name}>
        <Badge tone="ok"><span className="h-1.5 w-1.5 rounded-full bg-ok" /> Operational</Badge>
      </PageHeader>

      {/* Info row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
          <MapPin className="h-5 w-5 text-teal" />
          <div className="mt-3 text-2xs font-bold uppercase tracking-wide text-navy/45">Address</div>
          <div className="mt-1 text-sm font-semibold text-navy">{home.address}</div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
          <Users className="h-5 w-5 text-teal" />
          <div className="mt-3 text-2xs font-bold uppercase tracking-wide text-navy/45">Occupancy</div>
          <div className="mt-1 font-display text-xl font-extrabold text-navy">{homeResidents.length}<span className="text-sm font-bold text-navy/40">/{home.capacity}</span></div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
          <ShieldCheck className="h-5 w-5 text-teal" />
          <div className="mt-3 text-2xs font-bold uppercase tracking-wide text-navy/45">License</div>
          <div className="mt-1 text-sm font-semibold text-navy">{home.licenseNo}</div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-soft border border-navy/5">
          <BedDouble className="h-5 w-5 text-teal" />
          <div className="mt-3 text-2xs font-bold uppercase tracking-wide text-navy/45">Beds available</div>
          <div className="mt-1 font-display text-xl font-extrabold text-navy">{Math.max(0, home.capacity - homeResidents.length)}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Residents */}
        <section className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
            <Users className="h-5 w-5 text-teal" /> Residents ({homeResidents.length})
          </h2>
          <div className="mt-4 space-y-2">
            {homeResidents.map((r) => (
              <Link
                key={r.id}
                href={`/app/residents/${r.id}`}
                className="flex items-center gap-3 rounded-2xl bg-cream/60 p-3 transition hover:bg-navy-50 focus-ring"
              >
                <Avatar name={r.name} color={r.photoColor} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-navy">{r.name}</div>
                  <div className="text-2xs text-navy/55">Room {r.room} · Age {r.age}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-navy/30" />
              </Link>
            ))}
          </div>
        </section>

        {/* Floor map */}
        <section className="lg:col-span-3 rounded-3xl bg-white p-6 shadow-soft border border-navy/5">
          <h2 className="font-display text-lg font-bold text-navy">Floor map</h2>
          <p className="mt-1 text-2xs text-navy/45">Illustrative layout — bedrooms show the resident in each room.</p>

          <div
            className="mt-4 rounded-2xl border-2 border-navy/15 p-3"
            style={{ backgroundImage: "linear-gradient(#1f3a5f0d 1px, transparent 1px), linear-gradient(90deg, #1f3a5f0d 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          >
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {homeResidents.map((r) => (
                <div key={r.id} className="relative flex min-h-[96px] flex-col items-center justify-center rounded-xl border-2 border-teal/30 bg-teal-50 p-3 text-center">
                  <span className="absolute left-2 top-1.5 text-2xs font-bold uppercase tracking-wide text-teal-700/70">Room {r.room}</span>
                  <Avatar name={r.name} color={r.photoColor} size={34} />
                  <span className="mt-1.5 text-2xs font-bold text-navy">{r.name.split(" ")[0]}</span>
                </div>
              ))}
              {commonRooms.map((room) => (
                <div
                  key={room.label}
                  className={cn(
                    "relative flex min-h-[96px] flex-col items-center justify-center rounded-xl border-2 border-navy/10 bg-cream/50 p-3 text-center",
                    room.span === 2 && "col-span-2"
                  )}
                >
                  <span className="absolute left-2 top-1.5 text-2xs font-bold uppercase tracking-wide text-navy/35">{room.label}</span>
                  <room.icon className="h-6 w-6 text-navy/40" strokeWidth={1.8} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-2xs text-navy/55">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-teal/40 bg-teal-50" /> Bedroom (occupied)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-navy/15 bg-cream/60" /> Common area</span>
          </div>
        </section>
      </div>

      <InventoryBoard homeId={home.id} />
    </div>
  );
}
