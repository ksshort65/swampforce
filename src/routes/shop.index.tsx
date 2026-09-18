import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/shop/")({ component: ShopIndex });

function ShopIndex() {
  return <ComingSoon title="Shop" />;
}
