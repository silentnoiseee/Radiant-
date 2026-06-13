"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Users, Pill, AlertOctagon, LayoutDashboard, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app", label: "Today", icon: CalendarDays },
  { href: "/app/residents", label: "Residents", icon: Users },
  { href: "/app/medications", label: "Meds", icon: Pill },
  { href: "/app/incidents/new", label: "Incidents", icon: AlertOctagon },
  { href: "/app/timeclock", label: "Hours", icon: Clock },
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

function isActive(path: string, href: string) {
  if (href === "/app") return path === "/app";
  return path.startsWith(href);
}

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-navy/8 bg-white/70 backdrop-blur-xl px-4 py-6">
      <Link href="/" className="flex items-center gap-2 px-3 pb-8 focus-ring rounded-xl">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
          <Sparkles className="h-5 w-5 text-amber" />
        </div>
        <span className="font-display text-xl font-extrabold text-navy">Radiant</span>
      </Link>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = isActive(path, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition focus-ring",
                active ? "text-navy" : "text-navy/55 hover:text-navy hover:bg-navy-50"
              )}
            >
              {active && (
                <motion.span
                  layoutId="navpill"
                  className="absolute inset-0 rounded-xl bg-teal-50"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon className={cn("relative h-5 w-5", active && "text-teal")} strokeWidth={2.2} />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-cream p-4">
        <div className="text-2xs font-bold uppercase tracking-wide text-navy/40">On shift</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal font-display text-sm font-bold text-white">GO</div>
          <div>
            <div className="text-xs font-bold text-navy">Grace Okafor</div>
            <div className="text-2xs text-navy/50">Manager · Sunrise House</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function BottomBar() {
  const path = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-navy/8 bg-white/90 backdrop-blur-xl">
      <div className="grid grid-cols-6">
        {nav.map((item) => {
          const active = isActive(path, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-2xs font-semibold focus-ring",
                active ? "text-teal" : "text-navy/50"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={2.2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
