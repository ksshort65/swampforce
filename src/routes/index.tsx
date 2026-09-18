import { createFileRoute } from "@tanstack/react-router";
import { DispatchIndex } from "./dispatch.index";
import { homeHead } from "@/lib/share-head";

export const Route = createFileRoute("/")({
  component: DispatchIndex,
  head: () => homeHead(),
});