import { residents } from "@/lib/mock/residents";
import ResidentClient from "./ResidentClient";

// For static export: pre-generate a page for each known resident id.
export function generateStaticParams() {
  return residents.map((r) => ({ id: r.id }));
}

// Don't try to render ids that aren't in the list (required for output: export).
export const dynamicParams = false;

export default function ResidentProfilePage() {
  return <ResidentClient />;
}
