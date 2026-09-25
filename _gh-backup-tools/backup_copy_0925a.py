"""Incremental copy into /workspace/_gh-backup for branch backup-2026-09-24 (never main)."""
import filecmp, os, shutil
from pathlib import Path
SRC, DST = Path("/workspace"), Path("/workspace/_gh-backup")
ROOTS = ["_project-state", "site-from-checkpoint", "sync_all.py", "energy/oil-series", "_incoming-from-user/oil-series", "_gh-backup-tools/backup_copy_0925a.py"]
EX_DIRS = {".venv", "venv", "raw", "raw2", "__pycache__", "shots", "node_modules", ".git", "memorials", "subs"}
EX_EXT = {".zip", ".mp3", ".mp4", ".m4a", ".wav", ".webm", ".mov", ".mkv", ".ogg", ".opus", ".bak"}
MAX = 5 * 1024 * 1024
def skip(rel: Path, f: Path):
    if any(part in EX_DIRS for part in rel.parts): return True
    if f.suffix.lower() in EX_EXT: return True
    n = f.name.lower()
    if "hickenlooper" in n or ("letter" in n and f.suffix.lower() in {".jpg", ".jpeg", ".png", ".pdf"}): return True
    if "journal-pilot" in rel.parts and "memorial" in str(rel).lower(): return True
    if f.is_symlink() or not f.is_file() or f.stat().st_size > MAX: return True
    return False
copied = skipped = 0
for r in ROOTS:
    base = SRC / r
    files = [base] if base.is_file() else [Path(d) / x for d, _, fs in os.walk(base) for x in fs]
    for f in files:
        rel = f.relative_to(SRC)
        if skip(rel, f): skipped += 1; continue
        out = DST / rel
        if out.exists() and filecmp.cmp(f, out, shallow=False): continue
        out.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(f, out); copied += 1
bad = [str(p) for p in DST.rglob("*") if ".git" not in p.parts and ("hickenlooper" in p.name.lower() or p.suffix.lower() == ".zip" or (p.is_file() and p.stat().st_size > MAX))]
assert not bad, bad
print(f"copied {copied}, skipped {skipped}")
