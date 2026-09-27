import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import topicsIndex from "../data/topics-index.json";

export const Route = createFileRoute("/topics")({
  validateSearch: (search: Record<string, unknown>): { t?: string } => ({
    t: typeof search.t === "string" ? search.t : undefined,
  }),
  component: Topics,
});

type Source = { label: string; href: string; local?: string; sectionLevel?: boolean };
type See = { label: string; topic?: string; app?: string };
type Item = {
  title: string;
  lines?: string[];
  more?: string[];
  label?: string;
  sources?: Source[];
  see?: See[];
  dup?: { topic: string; item: string };
  fake?: string;
  essay?: string;
};
type Chart = {
  id: string;
  title: string;
  range: string;
  note?: string;
  type: "bar" | "doughnut" | "line";
  horizontal?: boolean;
  stacked?: boolean;
  log?: boolean;
  max?: number;
  labels: string[];
  data?: (number | null)[];
  colors?: string[];
  datasets?: { label: string; data: (number | null)[]; color: string }[];
  fmt?: string;
  bars: string[][];
  sections?: string[];
  center?: { big: string; small: string; items: string[] };
  derived?: boolean;
};
type Section = {
  id: string;
  title: string;
  items: string[];
  notes?: string[];
  see?: See[];
  label?: string;
};
type TopicData = {
  key: string;
  title: string;
  intro: string;
  range: string;
  stats: { big: string; label: string; item: string }[];
  charts: Chart[];
  sections: Section[];
  items: Record<string, Item>;
  links: { label: string; topic?: string; app?: string; chart?: string }[];
};
type Frame =
  | { k: "topic"; topic: string }
  | { k: "bar"; topic: string; chart: string; index: number; ds?: number }
  | { k: "all"; topic: string; chart: string }
  | { k: "list"; topic: string; section: string }
  | { k: "item"; topic: string; item: string }
  | { k: "source"; topic: string; item: string; source: number };

const INDEX = topicsIndex as { key: string; title: string; image: string }[];
const TITLES: Record<string, string> = Object.fromEntries(INDEX.map((t) => [t.key, t.title]));
const LOADERS = import.meta.glob("../data/topics/*.json", { import: "default" }) as Record<
  string,
  () => Promise<TopicData>
>;
const CACHE: Record<string, TopicData> = {};

function loadTopic(key: string): Promise<TopicData> {
  if (CACHE[key]) return Promise.resolve(CACHE[key]);
  const loader = LOADERS[`../data/topics/${key}.json`];
  if (!loader) return Promise.reject(new Error(`No topic ${key}`));
  return loader().then((data) => {
    CACHE[key] = data;
    return data;
  });
}

function useTopic(key: string | null) {
  const [data, setData] = useState<TopicData | null>(key && CACHE[key] ? CACHE[key] : null);
  useEffect(() => {
    let live = true;
    if (!key) {
      setData(null);
      return;
    }
    if (CACHE[key]) {
      setData(CACHE[key]);
      return;
    }
    setData(null);
    loadTopic(key).then((d) => {
      if (live) setData(d);
    });
    return () => {
      live = false;
    };
  }, [key]);
  return data;
}

function fmtVal(v: number | null | undefined, fmt?: string) {
  if (v == null) return "";
  const loc = (x: number) => x.toLocaleString("en-US", { maximumFractionDigits: 2 });
  switch (fmt) {
    case "pct":
      return `${v}%`;
    case "m":
      return `${v}M`;
    case "b":
      return `$${v}B`;
    case "bn":
      return `$${loc(v)}B`;
    case "t":
      return `$${v}T`;
    case "usdm_raw":
      return `$${v}M`;
    case "usdm":
      return `$${loc(v)}M`;
    case "usd":
      return `$${loc(v)}`;
    default:
      return loc(v);
  }
}

function loadChartJs() {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as Window & { Chart?: unknown };
  if (w.Chart) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const found = document.querySelector('script[src="/assets/vendor/chart.umd.min.js"]');
    if (found) {
      found.addEventListener("load", () => resolve(), { once: true });
      if ((window as Window & { Chart?: unknown }).Chart) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "/assets/vendor/chart.umd.min.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

const CARD = "mt-4 w-full rounded-2xl border border-[#d4af37] bg-[#070b12] px-4 py-4";
const ROW =
  "w-full rounded-3xl border border-white/35 bg-[#070b12]/75 px-4 py-3 text-left text-[15px] font-semibold leading-snug text-white";
const PILL =
  "w-fit rounded-full border border-white/35 bg-[#070b12]/75 px-4 py-2 text-left text-[15px] font-semibold leading-snug text-white";

function TopicChartCanvas({
  chart,
  onPick,
}: {
  chart: Chart;
  onPick: (index: number, ds?: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  useEffect(() => {
    let dead = false;
    loadChartJs().then(() => {
      if (dead || !canvasRef.current) return;
      const ChartJs = (
        window as unknown as {
          Chart: new (el: HTMLCanvasElement, cfg: object) => { destroy: () => void };
        }
      ).Chart;
      chartRef.current?.destroy();
      const horiz = !!chart.horizontal && chart.type === "bar";
      const datasets = chart.datasets
        ? chart.datasets.map((d) => ({
            label: d.label,
            data: d.data,
            backgroundColor: d.color,
            borderRadius: 6,
            maxBarThickness: 40,
          }))
        : [
            {
              data: chart.data ?? [],
              backgroundColor: chart.type === "line" ? "rgba(212,175,55,.18)" : chart.colors,
              borderColor:
                chart.type === "line"
                  ? "#d4af37"
                  : chart.type === "doughnut"
                    ? "#070b12"
                    : undefined,
              borderWidth: chart.type === "doughnut" ? 2 : chart.type === "line" ? 2 : 0,
              fill: chart.type === "line",
              pointRadius: chart.type === "line" ? 0 : undefined,
              pointHitRadius: 10,
              tension: 0.2,
              borderRadius: chart.type === "bar" ? 6 : 0,
              maxBarThickness: 40,
            },
          ];
      const valAxis: Record<string, unknown> = {
        beginAtZero: !chart.log,
        type: chart.log ? "logarithmic" : "linear",
        stacked: !!chart.stacked,
        grid: { color: "rgba(255,255,255,.08)" },
        ticks: {
          color: "#e8e0d0",
          font: { size: 15 },
          callback: (v: number) => fmtVal(v, chart.fmt),
        },
      };
      if (chart.max != null) valAxis.max = chart.max;
      const catAxis: Record<string, unknown> = {
        type: "category",
        stacked: !!chart.stacked,
        grid: { display: false },
        ticks: {
          callback: (v: number) => {
            const l = String(chart.labels[v] ?? v);
            return horiz && l.length > 24 ? `${l.slice(0, 22).trimEnd()}…` : l;
          },
          color: "#e8e0d0",
          font: { size: 15 },
          autoSkip: chart.labels.length > 24,
          maxTicksLimit: 12,
          maxRotation: chart.labels.length > 24 ? 0 : 50,
        },
      };
      chartRef.current = new ChartJs(canvasRef.current, {
        type: chart.type,
        data: { labels: chart.labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 600 },
          cutout: chart.type === "doughnut" ? "62%" : undefined,
          indexAxis: horiz ? "y" : "x",
          interaction:
            chart.type === "line"
              ? { mode: "index", intersect: false }
              : chart.type === "bar" && !chart.datasets
                ? { mode: "nearest", axis: horiz ? "y" : "x", intersect: false }
                : undefined,
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: { size: 15 },
              bodyFont: { size: 15 },
              callbacks: {
                label: (ctx: {
                  dataset: { label?: string };
                  label?: string;
                  parsed: number | { x: number; y: number };
                }) => {
                  const v =
                    typeof ctx.parsed === "object"
                      ? horiz
                        ? ctx.parsed.x
                        : ctx.parsed.y
                      : ctx.parsed;
                  return `${ctx.dataset.label ? `${ctx.dataset.label}: ` : ""}${fmtVal(v, chart.fmt)}`;
                },
              },
            },
          },
          scales:
            chart.type === "doughnut"
              ? undefined
              : horiz
                ? { x: valAxis, y: catAxis }
                : { x: catAxis, y: valAxis },
          onClick: (_e: unknown, els: { index: number; datasetIndex: number }[]) => {
            if (els.length)
              pickRef.current(els[0].index, chart.datasets ? els[0].datasetIndex : undefined);
          },
        },
      });
    });
    return () => {
      dead = true;
      chartRef.current?.destroy();
    };
  }, [chart]);
  const rows = chart.labels.length;
  const height =
    chart.type === "doughnut"
      ? 300
      : chart.horizontal
        ? Math.min(
            1400,
            Math.max(220, rows * (chart.datasets ? 30 * chart.datasets.length : 40) + 60),
          )
        : 320;
  return (
    <div className="relative w-full" style={{ height }}>
      <canvas
        ref={canvasRef}
        aria-label={chart.title}
        role="img"
        onClick={(event) => {
          // Axis labels are tappable too (same action as the bar), like the Time Period charts.
          if (chart.type === "doughnut") return;
          const canvas = canvasRef.current;
          const ChartJs = (
            window as unknown as {
              Chart?: { getChart: (el: HTMLCanvasElement) => AxisChartApi | undefined };
            }
          ).Chart;
          const api = canvas && ChartJs ? ChartJs.getChart(canvas) : undefined;
          if (!canvas || !api) return;
          const horiz = !!chart.horizontal && chart.type === "bar";
          const box = canvas.getBoundingClientRect();
          const x = event.clientX - box.left;
          const y = event.clientY - box.top;
          const onLabel = horiz ? x < api.chartArea.left : y > api.chartArea.bottom;
          if (!onLabel) return;
          const at = Math.round(
            horiz ? api.scales.y.getValueForPixel(y) : api.scales.x.getValueForPixel(x),
          );
          if (at >= 0 && at < chart.labels.length) pickRef.current(at);
        }}
      />
    </div>
  );
}

type AxisChartApi = {
  chartArea: { left: number; bottom: number };
  scales: Record<string, { getValueForPixel: (px: number) => number }>;
};

function barLine(chart: Chart, index: number) {
  if (chart.datasets) {
    return chart.datasets
      .map((d) => (d.data[index] == null ? "" : `${d.label}: ${fmtVal(d.data[index], chart.fmt)}`))
      .filter(Boolean)
      .join(" · ");
  }
  return fmtVal(chart.data?.[index], chart.fmt);
}

function ChartCard({
  chart,
  onBar,
  onAll,
}: {
  chart: Chart;
  onBar: (index: number, ds?: number) => void;
  onAll: () => void;
}) {
  const [showKeys, setShowKeys] = useState(chart.labels.length <= 30);
  return (
    <section className="mt-10 w-full" data-chart={chart.id}>
      <h2 className="text-center text-[18px] font-semibold tracking-wide text-white">
        {chart.title}
      </h2>
      <p className="mt-1 text-center text-[15px] text-white/75">{chart.range}</p>
      <div className={CARD}>
        <div className="relative">
          <TopicChartCanvas chart={chart} onPick={onBar} />
          {chart.center ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={onAll}
                data-center
                className="pointer-events-auto flex flex-col items-center rounded-full border-0 bg-transparent px-4 py-3"
              >
                <span className="text-[30px] leading-none font-bold text-white">
                  {chart.center.big}
                </span>
                <span className="mt-1 text-[15px] font-semibold text-white underline decoration-[#d4af37] underline-offset-4">
                  {chart.center.small}
                </span>
              </button>
            </div>
          ) : null}
        </div>
        {chart.datasets ? (
          <ul className="mt-4 flex flex-col gap-1">
            {chart.datasets.map((d, ds) => (
              <li key={d.label + ds}>
                <button
                  type="button"
                  data-key
                  onClick={onAll}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl border-0 bg-transparent px-2 py-2 text-left text-[15px] font-semibold text-white hover:bg-white/5"
                >
                  <span
                    className="inline-block h-4 w-4 shrink-0 rounded-sm"
                    style={{ background: d.color }}
                  />
                  {d.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {showKeys ? (
          <ul className="mt-4 flex flex-col gap-1">
            {chart.labels.map((label, index) => (
              <li key={`${label}-${index}`}>
                <button
                  type="button"
                  data-key
                  onClick={() => onBar(index)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl border-0 bg-transparent px-2 py-2 text-left text-[15px] font-semibold text-white hover:bg-white/5"
                >
                  {!chart.datasets ? (
                    <span
                      className="inline-block h-4 w-4 shrink-0 rounded-sm"
                      style={{
                        background:
                          chart.type === "line" ? "#d4af37" : (chart.colors?.[index] ?? "#d4af37"),
                      }}
                    />
                  ) : null}
                  <span>
                    {label}
                    {barLine(chart, index) ? (
                      <span className="font-normal text-white/80"> · {barLine(chart, index)}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <button type="button" onClick={() => setShowKeys(true)} className={`${PILL} mt-4`}>
            Show all {chart.labels.length} points
          </button>
        )}
      </div>
      {chart.note ? (
        <p className="mt-3 text-[15px] leading-snug text-white/75">{chart.note}</p>
      ) : null}
    </section>
  );
}

function Heading({ title, line }: { title: string; line?: string }) {
  return (
    <>
      <h1 className="text-center text-[20px] font-semibold tracking-wide text-white">{title}</h1>
      {line ? <p className="mt-1 text-center text-[15px] text-white/75">{line}</p> : null}
    </>
  );
}

function Toggle({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 w-full">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className={PILL}>
        {open ? "Show less" : label}
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function Bullets({ lines }: { lines: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-left text-[15px] leading-snug text-white/85">
      {lines.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

function recLine(n: number) {
  return `${n} ${n === 1 ? "record" : "records"}`;
}

function ItemRows({
  data,
  ids,
  onItem,
}: {
  data: TopicData;
  ids: string[];
  onItem: (id: string) => void;
}) {
  return (
    <div className="mt-6 flex w-full flex-col gap-2">
      {Array.from(new Set(ids)).map((id) => {
        const it = data.items[id];
        if (!it) return null;
        return (
          <button key={id} type="button" data-item={id} onClick={() => onItem(id)} className={ROW}>
            {it.title}
            {it.dup ? (
              <span className="mt-1 block font-normal text-white/75">
                Already in {TITLES[it.dup.topic] ?? it.dup.topic}
              </span>
            ) : it.label ? (
              <span className="mt-1 block font-normal text-white/75">{it.label}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function SeeButtons({ see, onTopic }: { see: See[]; onTopic: (key: string) => void }) {
  if (!see.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {see.map((s, i) =>
        s.app ? (
          <Link key={i} to="/betrayal" className={`${PILL} no-underline`}>
            {s.label} · The Great American Betrayal
          </Link>
        ) : s.topic ? (
          <button key={i} type="button" onClick={() => onTopic(s.topic as string)} className={PILL}>
            {s.label} · {TITLES[s.topic] ?? s.topic}
          </button>
        ) : null,
      )}
    </div>
  );
}

function frameTitle(frame: Frame, data: TopicData | null): string {
  if (!data) return TITLES[frame.topic] ?? "";
  switch (frame.k) {
    case "topic":
      return data.title;
    case "bar": {
      const c = data.charts.find((x) => x.id === frame.chart);
      return c ? c.labels[frame.index] : "";
    }
    case "all": {
      const c = data.charts.find((x) => x.id === frame.chart);
      return c ? c.title : "";
    }
    case "list":
      return data.sections.find((s) => s.id === frame.section)?.title ?? "";
    case "item":
      return data.items[frame.item]?.title ?? "";
    case "source":
      return data.items[frame.item]?.sources?.[frame.source]?.label ?? "Source";
  }
}

function Topics() {
  // Every topic is opened from its own button on Home (the cover page); Home is the only top menu.
  const { t } = Route.useSearch();
  const navigate = useNavigate();
  const start = (key?: string): Frame[] => (key && TITLES[key] ? [{ k: "topic", topic: key }] : []);
  const [stack, setStack] = useState<Frame[]>(() => start(t));
  useEffect(() => {
    setStack(start(t));
    if (!t || !TITLES[t]) navigate({ to: "/" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);
  const top = stack.length ? stack[stack.length - 1] : null;
  const parent = stack.length > 1 ? stack[stack.length - 2] : null;
  const data = useTopic(top ? top.topic : null);
  const parentData = useTopic(parent ? parent.topic : null);
  const push = (f: Frame) => {
    setStack((s) => [...s, f]);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };
  const back = () => {
    if (stack.length <= 1) {
      navigate({ to: "/" });
      return;
    }
    setStack((s) => s.slice(0, -1));
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };
  const backLabel = parent ? frameTitle(parent, parentData) : "Home";
  const shortBack = backLabel.length > 42 ? `${backLabel.slice(0, 40).trimEnd()}…` : backLabel;

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <img
        src="/images/flag-distress-tattered.jpg"
        alt=""
        className="pointer-events-none fixed inset-0 h-full w-full object-cover object-bottom opacity-25"
      />
      <div className="pointer-events-none fixed inset-0 bg-[#070b12]/70" />
      <div className="relative z-10">
        {top ? (
          <nav
            aria-label="Topics"
            className="sticky top-0 z-20 flex min-h-14 items-center bg-[#070b12]/95 px-4 py-2"
          >
            <button
              type="button"
              data-back
              onClick={back}
              className="border-0 bg-transparent p-0 text-left text-[15px] font-semibold tracking-wide text-white"
            >
              ‹ {shortBack}
            </button>
            {parent ? (
              <Link
                to="/"
                data-home
                className="ml-auto shrink-0 pl-4 text-[15px] font-semibold tracking-wide text-white no-underline"
              >
                Home
              </Link>
            ) : null}
          </nav>
        ) : null}
        {top && !data ? (
          <p className="px-6 pt-16 text-center text-[15px] text-white/80">Loading…</p>
        ) : null}
        {top && data ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-6 pb-24">
            <TopicView frame={top} data={data} push={push} />
          </div>
        ) : null}
      </div>
    </main>
  );
}

function TopicView({
  frame,
  data,
  push,
}: {
  frame: Frame;
  data: TopicData;
  push: (f: Frame) => void;
}) {
  const t = data.key;
  const openItem = (id: string) => push({ k: "item", topic: t, item: id });
  const openTopic = (key: string) => push({ k: "topic", topic: key });

  if (frame.k === "topic") {
    return (
      <div className="w-full" data-level="topic">
        <Heading title={data.title} line={data.range} />
        {data.intro ? (
          <p className="mt-4 text-center text-[15px] leading-snug text-white/85">{data.intro}</p>
        ) : null}
        {data.stats.length ? (
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            {data.stats.map((s) => (
              <button
                key={s.item}
                type="button"
                data-stat
                onClick={() => openItem(s.item)}
                className="rounded-2xl border border-white/25 bg-[#070b12]/85 px-3 py-3 text-left"
              >
                <span className="block text-[26px] leading-tight font-bold text-white">
                  {s.big}
                </span>
                <span className="mt-1 block text-[15px] leading-snug text-white/80">{s.label}</span>
              </button>
            ))}
          </div>
        ) : null}
        {data.charts.map((c) => (
          <ChartCard
            key={c.id}
            chart={c}
            onBar={(index, ds) => {
              if (c.sections && c.sections[index])
                push({ k: "list", topic: t, section: c.sections[index] });
              else push({ k: "bar", topic: t, chart: c.id, index, ds });
            }}
            onAll={() => push({ k: "all", topic: t, chart: c.id })}
          />
        ))}
        {data.links.length ? (
          <div className="mt-10 w-full">
            <p className="text-center text-[16px] font-semibold text-white">
              Also on file elsewhere
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {data.links.map((l, i) =>
                l.app ? (
                  <Link key={i} to="/betrayal" className={`${ROW} no-underline`}>
                    {l.label} · The Great American Betrayal
                  </Link>
                ) : (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openTopic(l.topic as string)}
                    className={ROW}
                  >
                    {l.chart ? "Chart: " : ""}
                    {l.label} · {TITLES[l.topic as string] ?? l.topic}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
  if (frame.k === "bar" || frame.k === "all") {
    const c = data.charts.find((x) => x.id === frame.chart);
    if (!c) return <p className="text-[15px]">Not on file.</p>;
    const ids =
      frame.k === "all"
        ? (c.center?.items ?? Array.from(new Set(c.bars.flat())))
        : (c.bars[frame.index] ?? []);
    const title = frame.k === "all" ? c.title : c.labels[frame.index];
    const value = frame.k === "bar" ? barLine(c, frame.index) : "";
    return (
      <div className="w-full" data-level="list">
        <Heading
          title={title}
          line={`${c.title}${value && frame.k === "bar" ? ` · ${value}` : ""} · ${recLine(ids.length)}`}
        />
        {ids.length ? (
          <ItemRows data={data} ids={ids} onItem={openItem} />
        ) : (
          <p className="mt-6 text-center text-[15px] text-white/80">
            No record is listed behind this bar on the older site.
          </p>
        )}
      </div>
    );
  }
  if (frame.k === "list") {
    const s = data.sections.find((x) => x.id === frame.section);
    if (!s) return <p className="text-[15px]">Not on file.</p>;
    return (
      <div className="w-full" data-level="list">
        <Heading
          title={s.title}
          line={`${data.title} · ${recLine(s.items.length)}${s.label ? ` · ${s.label}` : ""}`}
        />
        {s.notes && s.notes.length ? (
          <Toggle label="Read more">
            <Bullets lines={s.notes} />
          </Toggle>
        ) : null}
        {s.see ? <SeeButtons see={s.see} onTopic={openTopic} /> : null}
        <ItemRows data={data} ids={s.items} onItem={openItem} />
      </div>
    );
  }
  if (frame.k === "item") {
    const it = data.items[frame.item];
    if (!it) return <p className="text-[15px]">Not on file.</p>;
    if (it.dup) {
      const dup = it.dup;
      return (
        <div className="w-full" data-level="item">
          <Heading title={it.title} />
          <p className="mt-6 text-center text-[15px] text-white/85">
            This record is already on file in {TITLES[dup.topic] ?? dup.topic}. It is shown there
            once.
          </p>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              data-dup
              onClick={() => push({ k: "item", topic: dup.topic, item: dup.item })}
              className={PILL}
            >
              Open it in {TITLES[dup.topic] ?? dup.topic}
            </button>
          </div>
        </div>
      );
    }
    const sources = it.sources ?? [];
    const sectionLevel = sources.length > 0 && sources.every((s) => s.sectionLevel);
    return (
      <div className="w-full" data-level="item">
        <Heading title={it.title} />
        <div className="mt-6 w-full rounded-2xl border border-white/20 bg-[#070b12]/85 px-5 py-5 text-left">
          {it.label ? (
            <span className="inline-block rounded-full border border-[#d4af37] px-3 py-1 text-[15px] font-semibold text-[#d4af37]">
              {it.label}
            </span>
          ) : null}
          {it.lines && it.lines.length ? <Bullets lines={it.lines} /> : null}
          {it.more && it.more.length ? (
            <Toggle label={it.essay ? "Read the full essay" : "Read more"}>
              <Bullets lines={it.more} />
            </Toggle>
          ) : null}
          {it.fake ? (
            <div className="mt-4">
              <p className="text-[15px] text-white/85">
                The full case (#{it.fake}) is in Fake News.
              </p>
              <Link to="/betrayal" className={`${PILL} mt-2 inline-block no-underline`}>
                Open Fake News · The Great American Betrayal
              </Link>
            </div>
          ) : null}
          {it.see ? <SeeButtons see={it.see} onTopic={openTopic} /> : null}
          <p className="mt-5 text-[16px] font-semibold text-white">
            {sectionLevel ? "Sources listed for this section" : "Source"}
          </p>
          {sources.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {sources.map((s, i) => (
                <button
                  key={s.href + i}
                  type="button"
                  data-source
                  onClick={() => push({ k: "source", topic: t, item: frame.item, source: i })}
                  className={PILL}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[15px] text-white/75">
              No source link was listed for this item on the older site.
            </p>
          )}
        </div>
      </div>
    );
  }
  if (frame.k === "source") {
    const it = data.items[frame.item];
    const s = it?.sources?.[frame.source];
    if (!s) return <p className="text-[15px]">Not on file.</p>;
    return (
      <div className="w-full" data-level="source">
        <Heading title={s.label} line={it.title} />
        <div className="mt-6 w-full border border-white/20 bg-[#070b12]/80 px-4 py-4 text-left">
          <p className="text-[15px] leading-snug text-white/85">
            {s.sectionLevel
              ? "The older site listed this source for the whole section, not for this one line."
              : "This is the source the older site cited for this item. It is one record, not the whole file."}
          </p>
          <p className="mt-3 break-all text-[15px] text-white/70">{s.href}</p>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-[15px] font-semibold text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
          >
            Open the source
          </a>
        </div>
      </div>
    );
  }
  return null;
}
