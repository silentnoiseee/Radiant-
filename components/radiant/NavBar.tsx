"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Users, Pill, AlertOctagon, LayoutDashboard, Sparkles, Clock, ClipboardList, LogOut, UserPlus } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { useAuth, type Profile, type Role } from "@/components/auth/AuthProvider";

type NavItem = { href: string; label: string; icon: typeof CalendarDays; roles: Role[]; ownerOnly?: boolean };

const nav: NavItem[] = [
  { href: "/app", label: "Today", icon: CalendarDays, roles: ["manager", "caregiver"] },
  { href: "/app/residents", label: "Residents", icon: Users, roles: ["manager", "caregiver"] },
  { href: "/app/medications", label: "Meds", icon: Pill, roles: ["manager", "caregiver"] },
  { href: "/app/logs/new", label: "Logs", icon: ClipboardList, roles: ["manager", "caregiver"] },
  { href: "/app/incidents/new", label: "Incidents", icon: AlertOctagon, roles: ["manager", "caregiver"] },
  { href: "/app/timeclock", label: "Hours", icon: Clock, roles: ["manager", "caregiver"] },
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["manager"] },
  { href: "/app/invite", label: "Invite", icon: UserPlus, roles: ["manager"], ownerOnly: true },
];

function isActive(path: string, href: string) {
  if (href === "/app") return path === "/app";
  return path.startsWith(href);
}

function itemsFor(profile: Profile | null) {
  if (!profile) return [];
  return nav.filter(
    (item) => item.roles.includes(profile.role) && (!item.ownerOnly || profile.is_owner)
  );
}

export function Sidebar() {
  const path = usePathname();
  const { profile, signOut } = useAuth();
  const items = itemsFor(profile);
  const roleLabel = profile?.is_owner
    ? "Owner"
    : profile?.role
    ? profile.role[0].toUpperCase() + profile.role.slice(1)
    : "";

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-navy/8 bg-white/70 backdrop-blur-xl px-4 py-6">
      <Link href="/" className="flex items-center gap-2 px-3 pb-8 focus-ring rounded-xl">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
          <Sparkles className="h-5 w-5 text-amber" />
        </div>
        <span className="font-display text-xl font-extrabold text-navy">Radiant</span>
      </Link>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
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
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal font-display text-sm font-bold text-white">
            {profile?.full_name ? initials(profile.full_name) : "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-navy">{profile?.full_name || "Account"}</div>
            <div className="text-2xs text-navy/50">{roleLabel}</div>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-navy/10 bg-white px-3 py-2 text-xs font-semibold text-navy/70 transition hover:bg-navy-50 focus-ring"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}

export function BottomBar() {
  const path = usePathname();
  const { profile } = useAuth();
  const items = itemsFor(profile);

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-navy/8 bg-white/90 backdrop-blur-xl">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))` }}>
        {items.map((item) => {
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
