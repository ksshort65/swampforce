import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = join(root, "COVER.jpg");
const FALLBACK = join(root, "public/images/essay-not-why.jpg");

export function syncShareCard() {
  const src = existsSync(BASE) ? BASE : FALLBACK;
  if (!existsSync(src)) {
    console.warn("[share-card] missing COVER.jpg / essay-not-why.jpg");
    return null;
  }
  const ogPath = join(root, "public/og.jpg");
  const bannerPath = join(root, "public/x-banner.jpg");
  const py = `
from PIL import Image
base = Image.open(${JSON.stringify(src)}).convert("RGB")
og = base.resize((1200, 630), Image.Resampling.LANCZOS)
og.save(${JSON.stringify(ogPath)}, quality=88, optimize=True, subsampling=1)
w, h = base.size
band_h = int(w * 264 / 1200)
top = max(0, h - band_h - 40)
banner = base.crop((0, top, w, min(h, top + band_h))).resize((1200, 264), Image.Resampling.LANCZOS)
banner.save(${JSON.stringify(bannerPath)}, quality=88, optimize=True, subsampling=1)
banner.save(${JSON.stringify(join(root, "public/images/x-banner.jpg"))}, quality=88, optimize=True, subsampling=1)
`;
  const pr = spawnSync("python3", ["-c", py], { encoding: "utf8" });
  if (pr.status !== 0) {
    console.warn("[share-card] compose failed", pr.stderr?.slice(-500));
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
  console.log("[share-card] og + x-banner from chamber cover, no stamp");
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
      server.watcher.add(FALLBACK);
      server.watcher.on("change", (file) => {
        const f = String(file);
        if (f.endsWith("COVER.jpg") || f.endsWith("essay-not-why.jpg")) syncShareCard();
      });
    },
  };
}
