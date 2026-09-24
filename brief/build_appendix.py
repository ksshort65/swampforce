#!/usr/bin/env python3
"""Build swampforce evidence appendix PDF from term CSVs (data-driven)."""
from __future__ import annotations
import csv, html, re, subprocess
from pathlib import Path

TS = Path("/workspace/term-split")
OUT = Path("/workspace/brief")
PDF = OUT / "swampforce-evidence-appendix.pdf"
HTML_OUT = OUT / "swampforce-evidence-appendix.html"

def load_rows():
    rows = []
    for term, fn in [
        ("first", "first-term-trump-admin-media-deception.csv"),
        ("later", "later-second-term-trump-admin-media-deception.csv"),
    ]:
        with open(TS / fn, encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                claim = r["Claim"]
                began = ended = ""
                m = re.search(r"\n\s*Began:\s*(.*?)\s*\|\s*Ended:\s*(.*)$", claim, re.S)
                if m:
                    began, ended = m.group(1).strip(), m.group(2).strip()
                    claim = claim[: m.start()].strip()
                extras = re.findall(r"https?://[^\s\)\]<>\"']+", r.get("Notes") or "")
                extras = [u.rstrip(".,;:") for u in extras]
                rows.append({
                    **r,
                    "_term": term,
                    "_claim": claim,
                    "_began": began,
                    "_ended": ended,
                    "_extras": extras,
                    "_id": int(r["Item_ID"]),
                })
    rows.sort(key=lambda r: (0 if r["_term"] == "first" else 1, r["_id"]))
    return rows

def esc(s):
    return html.escape(s or "")


def domain(url):
    m = re.search(r"https?://(?:www\.)?([^/]+)", (url or "").strip())
    return m.group(1).lower() if m else ""

def primary_ulab(proof, url):
    mapping = {
        "Official record": "Official record",
        "Original transcript/video": "Transcript/video",
        "Outlet's own correction": "Outlet correction",
        "Fact-check only": "Second fact-check",
    }
    base = mapping.get((proof or "").strip(), "Primary source")
    d = domain(url)
    return f"{base} ({d})" if d else base

def truth_ulab(url):
    d = domain(url)
    return f"See the record ({d})" if d else "See the record"

def full_link(url, label=None):
    url = (url or "").strip()
    if not url:
        return ""
    text = esc(label or url)
    return f'<a href="{esc(url)}">{text}</a>'

def case_block(r):
    truth = (r.get("Truth_Source_URL") or "").strip()
    primary = (r.get("Primary_Source_URL") or "").strip()
    links = []
    if truth:
        links.append(f'<div class="url"><span class="ulab">{esc(truth_ulab(truth))}:</span> {full_link(truth)}</div>')
    if primary:
        links.append(f'<div class="url"><span class="ulab">{esc(primary_ulab(r.get("Proof_Basis") or "", primary))}:</span> {full_link(primary)}</div>')
    for i, u in enumerate(r["_extras"], 1):
        if u == truth or u == primary:
            continue
        links.append(f'<div class="url"><span class="ulab">Also:</span> {full_link(u)}</div>')
    dates = ""
    if r["_began"] or r["_ended"]:
        dates = f'<div class="dates">Began: {esc(r["_began"])} &nbsp;|&nbsp; Ended: {esc(r["_ended"])}</div>'
    return f'''<div class="case">
<div class="head"><span class="id">#{r["_id"]}</span>
<span class="badge {'misleading' if (r.get('Evidence_Level') or '').startswith('Rated') else 'proven'}">{esc(r.get("Evidence_Level") or "")}</span>
<span class="meta">{esc(r.get("Proof_Basis") or "")} &middot; {esc(r.get("Correction_Visibility") or "")}</span></div>
<div class="claim">{esc(r["_claim"])}</div>
{dates}
<div class="who"><b>Who pushed it:</b> {esc(r.get("Who_Pushed_It") or "")}</div>
{''.join(links)}
</div>'''

def build_html(rows):
    first = [r for r in rows if r["_term"] == "first"]
    later = [r for r in rows if r["_term"] == "later"]
    total = len(rows)
    body_first = "\n".join(case_block(r) for r in first)
    body_later = "\n".join(case_block(r) for r in later)
    page = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Evidence Appendix</title>
<style>
  @page {{ size: letter; margin: 0.45in 0.5in 0.6in 0.5in; }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 8pt; line-height: 1.28; color: #1a1a1a; margin: 0;
  }}
  h1 {{ font-size: 12pt; margin: 0 0 4px; color: #111; }}
  .meta {{ font-size: 7.5pt; color: #444; margin: 0 0 8px; }}
  .intro {{
    background: #f7f7f5; border-left: 3px solid #9b1c1c; padding: 6px 8px; margin: 0 0 10px; font-size: 7.8pt;
  }}
  h2 {{
    font-size: 10pt; margin: 12px 0 6px; padding-bottom: 2px;
    border-bottom: 1.5px solid #9b1c1c; color: #7f1d1d; page-break-after: avoid;
  }}
  .case {{
    border: 1px solid #e5e5e5; border-radius: 3px; padding: 5px 7px; margin: 0 0 6px;
    page-break-inside: avoid; background: #fff;
  }}
  .head {{ margin: 0 0 2px; }}
  .id {{ font-weight: 700; color: #7f1d1d; margin-right: 6px; }}
  .badge {{
    display: inline-block; font-size: 7pt; font-weight: 700; padding: 1px 5px;
    border-radius: 3px; background: #14532d; color: #ecfdf5; margin-right: 6px;
  }}
  .meta {{ font-size: 7pt; color: #555; }}
  .claim {{ font-weight: 600; font-size: 8pt; margin: 1px 0 2px; }}
  .dates {{ color: #444; font-size: 7pt; margin: 0 0 2px; }}
  .who {{ font-size: 7.5pt; margin: 0 0 3px; }}
  .url {{ font-size: 6.8pt; word-break: break-all; margin: 1px 0; }}
  .ulab {{ color: #666; font-weight: 600; }}
  a {{ color: #9b1c1c; text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
  .footer-note {{ margin-top: 10px; font-size: 7pt; color: #666; }}
</style></head><body>
<h1>Evidence Appendix — Documented False and Misleading Claims About President Trump and His Administration</h1>
<p class="meta">September 2026 &middot; Prepared by swampforce.com &middot; {total} cases &middot; Companion to the Policy Brief</p>
<div class="intro">
<p><b>Inclusion standard.</b> Every case is a claim about President Trump or his administration that was later corrected, retracted, settled, contradicted by an official record, or rated false / mostly false / misleading by a documented source. This appendix lists every case with its evidence links in full.</p>
<p><b>Evidence ranking (strongest first).</b> (1) Official record — court, settlement, DOJ/IG/special counsel, FEC, government data; (2) Original transcript/video of what was said or shown; (3) Outlet&rsquo;s own correction or retraction; (4) Fact-check only. Primary Source is the strongest available under that ranking; Truth Source is the record used for the verdict.</p>
</div>

<h2>First Term (2017–2021) — {len(first)} cases</h2>
{body_first}

<h2>After the First Term and Second Term (2021–Present) — {len(later)} cases</h2>
{body_later}

<p class="footer-note">Generated from project CSVs. Figures and links update when the record grows. Not legal advice.</p>
</body></html>'''
    return page


def stamp_page_numbers(pdf_path: Path):
    """Overlay page numbers using fpdf2 + pypdf."""
    from io import BytesIO
    from pypdf import PdfReader, PdfWriter
    from fpdf import FPDF

    reader = PdfReader(str(pdf_path))
    n = len(reader.pages)
    writer = PdfWriter()
    for i, page in enumerate(reader.pages, 1):
        w = float(page.mediabox.width)
        h = float(page.mediabox.height)
        # fpdf uses mm; PDF points: 1 pt = 0.352778 mm, letter 612x792 pt
        pw_mm = w * 25.4 / 72
        ph_mm = h * 25.4 / 72
        pdf = FPDF(unit="mm", format=(pw_mm, ph_mm))
        pdf.set_auto_page_break(False)
        pdf.add_page()
        pdf.set_font("Helvetica", size=8)
        pdf.set_text_color(100, 100, 100)
        label = f"Evidence Appendix  |  swampforce.com  |  page {i} of {n}"
        pdf.set_xy(8, ph_mm - 9)
        pdf.cell(pw_mm - 16, 5, label, align="C")
        buf = BytesIO(pdf.output())
        overlay = PdfReader(buf).pages[0]
        page.merge_page(overlay)
        writer.add_page(page)
    out = BytesIO()
    writer.write(out)
    pdf_path.write_bytes(out.getvalue())


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows = load_rows()
    HTML_OUT.write_text(build_html(rows))
    cmd = [
        "google-chrome",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--print-to-pdf={PDF}",
        "--no-pdf-header-footer",
        f"file://{HTML_OUT.resolve()}",
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    stamp_page_numbers(PDF)
    print("Wrote", PDF, "bytes", PDF.stat().st_size, "cases", len(rows))
    return PDF

if __name__ == "__main__":
    main()
