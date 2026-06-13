import { AlertTriangle } from "lucide-react";

export function AllergyAlert({ allergies }: { allergies: string[] }) {
  if (allergies.length === 0) return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-alert/25 bg-[#F8E7E2] p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-alert" />
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-alert">Allergy Alert</div>
        <div className="mt-0.5 text-sm font-semibold text-navy">{allergies.join(" · ")}</div>
      </div>
    </div>
  );
}
