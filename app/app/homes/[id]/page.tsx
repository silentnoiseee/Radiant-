import { homes } from "@/lib/mock/homes";
import HomeClient from "./HomeClient";

export function generateStaticParams() {
  return homes.map((h) => ({ id: h.id }));
}

export const dynamicParams = false;

export default function HomeDetailPage() {
  return <HomeClient />;
}
