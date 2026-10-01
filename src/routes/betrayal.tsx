import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/data-gate";

export const Route = createFileRoute("/betrayal")({ component: BetrayalRoute });

// The page's code is loaded after data/database.json, so its charts count the current file.
const loadPage = () => import("@/components/betrayal-page");

function BetrayalRoute() {
  return <DataPage load={loadPage} />;
}
