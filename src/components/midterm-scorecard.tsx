import { Link } from "@tanstack/react-router";
import {
  CAPACITY,
  DEBT_BY_TERM,
  IMPOSSIBLE,
  LEG_BRANCH,
  LEG_BRANCH_TOTAL,
  SCORE_ROWS,
  SCORE_UPDATED,
} from "@/lib/scorecard";

const PLEDGE = [
  "Twelve appropriations bills by October 1. No omnibus. No continuing resolution as the plan.",
  "The full text of every spending bill and every reconciliation bill posted, searchable, 72 hours before any vote — CBO score and Joint Committee on Taxation tables attached. No managers’ amendment after midnight.",
  "Prime time, same night, GOP / Democrats / DSA: a deck of the policy and the pay-for. Medicare for all names the money. GOP names how it will not block the agenda the country voted. Anyone who will not show the slides agrees, on camera, to go home.",
  "The floor is a full-time job. In session means in the building. Call time is not the work. Work the hours or resign.",
  "Vow to stop selling the neighbor as the enemy. Debate the statute. The jersey is not the job.",
];

export function MidtermScorecard() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="font-display text-xs font-semibold tracking-[0.22em] text-sage uppercase">
          Congressional scorecard · updated {SCORE_UPDATED}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-wide uppercase sm:text-4xl">
          <Link to="/scorecard" className="text-fg no-underline hover:text-sage">
            Show the slides. Post the stack.
          </Link>
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          GOP. Democrats. DSA — Brookings counted{" "}
          <a
            href="https://www.brookings.edu/articles/democratic-socialist-candidates-show-gains-but-limited-reach-in-2026/"
            className="text-sage"
            target="_blank"
            rel="noreferrer"
          >
            282 DSA-endorsed names
          </a>{" "}
          on 2026 ballots. Each column owes the country a budget, a pay-for,
          and the whole bill — not the paragraph they cut for television.
          Full time or resign. Independent. No PAC. Not a call to violence.
        </p>

        <div className="mt-10 rounded-lg border border-border bg-surface p-6 sm:p-8">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-sage uppercase">
            The Whole File Pledge
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-wide uppercase">
            How this actually happens
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            There is no national referendum on a budget in this Constitution.
            Article I already gave the purse to Congress. The American people’s
            approval is the election, the House rules on day one, and a
            statute they already wrote and ignore. You do not need a new
            ministry. You need the layover they waive, the twelve bills they
            skip, and a signature on the pledge below — then you score who
            refused.
          </p>
          <ol className="mt-6 max-w-3xl list-decimal space-y-3 pl-5 text-sm leading-relaxed text-fg/90">
            {PLEDGE.map((line) => (
              <li key={line.slice(0, 24)}>{line}</li>
            ))}
          </ol>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
            The tools that already exist: House and Senate rules (a majority
            can rewrite them on January 3). The Congressional Budget Act of
            1974 — twelve bills by October 1. The 72-hour / layover rule they
            routinely waive. CBO and JCT, paid for by you, required to post
            before the gavel, not after. Discharge petition. Primary. Article
            I, Section 5 — punish and expel. November 3. A constitutional
            amendment would be required only if you want a nationwide
            yes/no on the budget itself. Until then the people approve by
            firing the employee who hid the stack.
          </p>
          <p className="mt-4 font-display text-xs tracking-[0.16em] text-sage uppercase">
            <Link to="/dispatch/$slug" params={{ slug: "the-whole-bill" }} className="text-sage no-underline hover:text-fg">
              The essay — The whole bill →
            </Link>
          </p>
        </div>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
            <thead>
              <tr className="font-display text-xs tracking-[0.16em] text-sage uppercase">
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  If they hold Congress
                </th>
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  GOP
                </th>
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  Democrats
                </th>
                <th className="border-b border-border py-3 font-semibold">
                  DSA program
                </th>
              </tr>
            </thead>
            <tbody>
              {SCORE_ROWS.map((r) => (
                <tr key={r.topic} className="align-top">
                  <td className="border-b border-border py-4 pr-4 font-display text-xs font-semibold tracking-[0.14em] text-sage uppercase">
                    {r.href ? (
                      <a
                        href={r.href}
                        className="text-sage no-underline hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.topic} ↗
                      </a>
                    ) : (
                      r.topic
                    )}
                  </td>
                  <td className="border-b border-border py-4 pr-4 leading-relaxed text-fg/85">
                    {r.gop}
                  </td>
                  <td className="border-b border-border py-4 pr-4 leading-relaxed text-fg/85">
                    {r.dem}
                  </td>
                  <td className="border-b border-border py-4 leading-relaxed text-fg/85">
                    {r.dsa}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-14 font-display text-2xl font-bold tracking-wide uppercase">
          <a
            href="https://www.congress.gov/crs-product/R48612"
            className="text-fg no-underline hover:text-sage"
            target="_blank"
            rel="noreferrer"
          >
            $7.258 billion · a part-time floor ↗
          </a>
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          What you pay the legislative branch in FY2026 — Public Law 119-37 /
          CRS R48612. Salary ($174,500) is the decoy. The machine is seven
          billion dollars. The chamber sits fewer days than a school year.
          Full time or resign.
        </p>
        <div className="mt-6 space-y-3">
          {LEG_BRANCH.map((row) => {
            const pct = (row.billions / LEG_BRANCH_TOTAL) * 100;
            return (
              <div key={row.label}>
                <div className="mb-1 flex justify-between gap-4 font-display text-xs tracking-[0.12em] uppercase">
                  <span>{row.label}</span>
                  <span className="tabular-nums text-sage">
                    {row.amount} · {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full bg-sage"
                    style={{ width: `${Math.max(pct, 1.5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted">
          Total $7.258B. Member pay is a rounding error inside the House and
          Senate lines. Eighteen aides, district rent, travel, a gym, a
          pension after five years — CRS RL30064 and R40962.
        </p>

        <h3 className="mt-14 font-display text-2xl font-bold tracking-wide uppercase">
          <a
            href="https://www.cato.org/blog/who-will-pay-democratic-socialisms-200-trillion-cost"
            className="text-fg no-underline hover:text-sage"
            target="_blank"
            rel="noreferrer"
          >
            The pamphlet does not fit in the country ↗
          </a>
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Medicare for all and reparations are not a vibe. They are invoices.
          The country already runs a $1.9 trillion deficit on $5.6 trillion of
          receipts with $40 trillion on the meter (CBO FY2026; Treasury August
          2026). Stack the pamphlet on that and you are not reforming a
          budget. You are proposing to break the currency, the bond market, or
          the republic. Anyone who sells it as affordable is not confused.
          They are choosing the wreck.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {CAPACITY.map((c) => (
            <div key={c.k} className="rounded-lg bg-surface p-4">
              <p className="font-display text-xl font-bold tabular-nums tracking-wide">
                {c.v}
              </p>
              <p className="mt-1 text-xs leading-snug text-muted">{c.k}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
            <thead>
              <tr className="font-display text-xs tracking-[0.16em] text-sage uppercase">
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  Invoice
                </th>
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  Low
                </th>
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  High
                </th>
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  vs all federal taxes
                </th>
                <th className="border-b border-border py-3 font-semibold">
                  vs the economy
                </th>
              </tr>
            </thead>
            <tbody>
              {IMPOSSIBLE.map((r) => (
                <tr key={r.item} className="align-top">
                  <td className="border-b border-border py-4 pr-4 font-display text-xs font-semibold tracking-[0.12em] text-sage uppercase">
                    <a
                      href={r.href}
                      className="text-sage no-underline hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.item} ↗
                    </a>
                  </td>
                  <td className="border-b border-border py-4 pr-4 leading-relaxed">
                    {r.low}
                  </td>
                  <td className="border-b border-border py-4 pr-4 leading-relaxed">
                    {r.high}
                  </td>
                  <td className="border-b border-border py-4 pr-4 leading-relaxed text-fg/85">
                    {r.vsRevenue}
                  </td>
                  <td className="border-b border-border py-4 leading-relaxed text-fg/85">
                    {r.vsGdp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          Combined on the low Urban + Darity figures: about $44 trillion in
          new federal claims. Combined on Cato’s M4A + reparations highs:
          about $100 trillion — before the jobs guarantee and the rest of the
          DSA stack. Ten-year receipts at today’s $5.6T rate are $56 trillion
          for the entire government: Defense, Social Security, Medicare as it
          exists, interest on the $40T, and the lights. The pamphlet eats the
          government and then the country. A candidate who will not show a
          pay-for that survives this table is not offering health care or
          justice. They are offering insolvency. That is how a nation is
          destroyed without a shot. Out of office. Off the ballot. Independent.
          No PAC. Not a call to violence.
        </p>

        <h3 className="mt-14 font-display text-2xl font-bold tracking-wide uppercase">
          <a
            href="https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/"
            className="text-fg no-underline hover:text-sage"
            target="_blank"
            rel="noreferrer"
          >
            Congress holds the purse ↗
          </a>
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Gross federal debt by term. Treasury Debt to the Penny and OMB
          historical tables. Who held both chambers: Senate Historical Office;
          House History. $40.03T as of August 20, 2026. Nixon and Ford were
          Republican presidents under a Democratic Congress — the $345B still
          posted. GHW Bush the same: $1.49T, Dem both. The Oval is not the
          purse.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="font-display text-xs tracking-[0.16em] text-sage uppercase">
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  President
                </th>
                <th className="border-b border-border py-3 pr-4 font-semibold">
                  Debt added
                </th>
                <th className="border-b border-border py-3 font-semibold">
                  Both chambers
                </th>
              </tr>
            </thead>
            <tbody>
              {DEBT_BY_TERM.map((r) => (
                <tr key={r.who}>
                  <td className="border-b border-border py-3 pr-4 font-medium">
                    {r.who}
                  </td>
                  <td className="border-b border-border py-3 pr-4 tabular-nums">
                    {r.added}
                  </td>
                  <td className="border-b border-border py-3 text-fg/85">
                    {r.congress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          <a
            href="https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/"
            className="text-sage"
            target="_blank"
            rel="noreferrer"
          >
            Treasury — Debt to the Penny
          </a>
          . Nominal gross debt, not inflation-adjusted. FDR’s 1,081% is a
          small base, not a small government. Inauguration-to-inauguration,
          Obama is closer to +$9.3T than +$8.0T — we left the compiled row
          and note the range. Trump 1 +$7.8T, Biden +$8.4–8.5T, Trump 2
          +$3.8T ($36.2T in January 2025 to $40.0T in August 2026) match
          Treasury. Nixon/Ford and GHW Bush: Republican Oval, Democratic
          Congress — that column is the point.
        </p>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
          DSA does not need a stronger foot in Congress. Two hundred
          eighty-two names is already a beachhead. November 3: show up. This
          is a republic. Their replacement charter is not welcome. A
          We change a cell when a vote or a Treasury table changes the file.
          Honest is the whole point.
        </p>
      </div>
    </section>
  );
}
