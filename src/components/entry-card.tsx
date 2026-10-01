import { STATUS_INFO } from "@/lib/verification";
import { addedWhen, entryStatus, type DbEntry } from "@/lib/database";

/** The card for an entry that has only the fields admin.html saves: headline, source link and status. */
export function EntryCard({ e }: { e: DbEntry }) {
  const s = STATUS_INFO[entryStatus(e)];
  return (
    <article data-item={e.id} data-entry-card className="border-b border-white/15 py-4 text-left">
      <p className="text-[16px] leading-snug font-semibold text-white">{e.headline}</p>
      <p className="mt-1 text-[15px] text-white/70">
        <span className="mr-2 inline-block h-3 w-3 rounded-sm align-middle" style={{ background: s.color }} />
        {s.name}
        {e.added ? ` · Added ${addedWhen(e.added)}` : ""}
      </p>
      {e.sources.length ? (
        <div className="mt-2 flex flex-col gap-1">
          {e.sources.map((src, i) => (
            <a
              key={i}
              href={src.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-semibold break-all text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-2"
            >
              {src.label}
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[15px] text-white/70">No source link was listed for this item.</p>
      )}
    </article>
  );
}
