import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = join(root, "public/images/hero-capitol.jpg");

export function syncShareCard() {
  // Namecheap og.jpg is the cover. Do not regenerate it.
  if (!existsSync(join(root, "public/og.jpg"))) {
    console.warn("[share-card] missing public/og.jpg");
    return null;
  }
  writeFileSync(
    join(root, "src/lib/og/site.json"),
    JSON.stringify(
      { title: "Swamp Force", card: "custom", banner: "/x-banner.jpg" },
      null,
      2,
    ) + "\n",
  );
  console.log("[share-card] left Namecheap og.jpg and X banner alone.");
  return "og";
}

export function shareCardPlugin() {
  return {
    name: "swampforce-share-card",
    buildStart() {
      syncShareCard();
    },
    configureServer(server) {
      syncShareCard();
      server.watcher.add(BASE);
      server.watcher.on("change", (file) => {
        if (String(file).endsWith("hero-capitol.jpg")) syncShareCard();
      });
    },
  };
}
