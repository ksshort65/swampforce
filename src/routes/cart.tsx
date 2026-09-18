import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  return <ComingSoon title="Shop" />;
}
