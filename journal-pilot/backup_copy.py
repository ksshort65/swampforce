"""Copy changed files from /workspace into the /workspace/_gh-backup tree (no rsync). Backup only; never touches main."""
import filecmp, os, shutil
from pathlib import Path
SRC, DST = Path("/workspace"), Path("/workspace/_gh-backup")
ROOTS = ["_project-state", "site-from-checkpoint", "journal-pilot", "sync_all.py"]
EX_DIRS = {".venv", "venv", "raw", "__pycache__", "shots", "node_modules", ".git", "memorials", "subs"}
EX_EXT = {".zip", ".mp3", ".mp4", ".m4a", ".wav", ".webm", ".mov", ".bak"}
MAX = 5 * 1024 * 1024
def skip(p: Path):
    if any(part in EX_DIRS for part in p.parts): return True
    if p.suffix.lower() in EX_EXT or p.name.endswith(".bak"): return True
    if "hickenlooper" in p.name.lower() or "letter" in p.name.lower() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".pdf"}: return True
    if p.is_absolute() and (p.is_symlink() or not p.is_file() or p.stat().st_size > MAX): return True
    return False
copied = skipped = 0
for r in ROOTS:
    base = SRC / r
    files = [base] if base.is_file() else [Path(d) / f for d, _, fs in os.walk(base) for f in fs]
    for f in files:
        rel = f.relative_to(SRC)
        if skip(rel) or skip(f):
            skipped += 1; continue
        out = DST / rel
        if out.exists() and filecmp.cmp(f, out, shallow=False): continue
        out.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(f, out); copied += 1
# safety: no letter image anywhere in the backup tree
bad = [str(p) for p in DST.rglob("*") if ".git" not in p.parts and "hickenlooper" in p.name.lower()]
assert not bad, bad
print(f"copied {copied}, skipped {skipped}")
