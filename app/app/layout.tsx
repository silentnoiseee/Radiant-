"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Sidebar, BottomBar } from "@/components/radiant/NavBar";
import { DemoBadge } from "@/components/radiant/DemoBadge";
import { useAuth } from "@/components/auth/AuthProvider";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-navy text-white">
          <Sparkles className="h-6 w-6 text-amber" />
        </div>
        <div className="text-sm font-semibold text-navy/50">Loading…</div>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { loading, session, profile } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (profile) {
      if (profile.role === "visitor" && !path.startsWith("/app/visitors")) {
        router.replace("/app/visitors");
      } else if (profile.role === "caregiver" && path.startsWith("/app/dashboard")) {
        router.replace("/app");
      }
    }
  }, [loading, session, profile, path, router]);

  // Auth still resolving, or about to redirect (no session / no profile yet).
  if (loading || !session || !profile) {
    return <FullScreenLoader />;
  }

  const kiosk = path.startsWith("/app/visitors");

  // Visitor check-in kiosk: full-screen, no sidebar.
  if (kiosk) {
    return (
      <div className="min-h-screen bg-cream">
        {children}
        <DemoBadge />
      </div>
    );
  }

  // A visitor on any non-kiosk route is being redirected — hold the loader.
  if (profile.role === "visitor") {
    return <FullScreenLoader />;
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
