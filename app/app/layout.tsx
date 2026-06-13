"use client";
import { usePathname } from "next/navigation";
import { Sidebar, BottomBar } from "@/components/radiant/NavBar";
import { DemoBadge } from "@/components/radiant/DemoBadge";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const kiosk = path.startsWith("/app/visitors");

  if (kiosk) {
    return (
      <div className="min-h-screen bg-cream">
        {children}
        <DemoBadge />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream grain">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-24 lg:pb-0">
        <div className="mx-auto max-w-6xl container-px py-8 lg:py-12">{children}</div>
      </div>
      <BottomBar />
      <DemoBadge />
    </div>
  );
}
