import { FlaskConical } from "lucide-react";

export function DemoBadge() {
  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-40 lg:bottom-4 flex items-center gap-1.5 rounded-full bg-navy/90 px-3 py-1.5 text-2xs font-semibold text-white shadow-lift backdrop-blur">
      <FlaskConical className="h-3.5 w-3.5 text-amber" />
      Demo — fictional data
    </div>
  );
}
