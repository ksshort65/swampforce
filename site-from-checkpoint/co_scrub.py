"""Sep 26, 2026 (Karen): the downloadable workbooks must not single out one state. Colorado may appear only as a neutral
row in an all-state table, in official captions/records (court cases, named officials, FEC committee names) or in URLs.
Applied to the DOWNLOAD copies only; research sources are untouched. No number is changed; picked-out rows/columns are removed."""
import openpyxl

CO = "olorado"


def _has(row):
    return any(isinstance(c.value, str) and CO in c.value for c in row)


def _drop_rows(ws, keep=lambda r: False):
    for r in sorted((row[0].row for row in ws.iter_rows() if _has(row) and not keep(row)), reverse=True):
        ws.delete_rows(r)


def scrub_population(path):
    wb = openpyxl.load_workbook(path)
    if "Colorado" in wb.sheetnames:
        del wb["Colorado"]  # Colorado-only sheet
    ws = wb["Registration by method"]
    for r in sorted((row[0].row for row in ws.iter_rows() if row[0].value == "Colorado"), reverse=True):
        ws.delete_rows(r)
    _drop_rows(wb["Noncitizens on benefits"])
    src = wb["Sources"]  # sources used only by the dropped Colorado sheet / a local-station explainer
    for r in sorted((row[0].row for row in src.iter_rows() if row[0].value in ("PEP-CO-2000s", "PEP-CO-2010s", "KUNC-CO-2024")), reverse=True):
        src.delete_rows(r)
    for row in src.iter_rows():
        c = row[3]
        if isinstance(c.value, str):
            c.value = c.value.replace(" US & Colorado", " US").replace("2006 totals, Colorado 2006", "2006 totals")
    for name in ("Sources", "Official-data limits"):
        for row in wb[name].iter_rows():
            for c in row:
                if isinstance(c.value, str) and CO in c.value and not c.value.startswith("http"):
                    c.value = (c.value.replace("; Colorado 0400000US08", "").replace("Main/Colorado", "Main").replace("Main annual / Colorado / other", "Main annual / other"))
    # Noncitizens on rolls (SOS row) and Discrepancies (court case / Secretary records) are official records: kept.
    wb.save(path)


def scrub_gas(path):
    wb = openpyxl.load_workbook(path)
    ws = wb["Weekly 2005-present"]
    for col in ("I", "S"):  # Colorado retail and Colorado minus U.S. (S is the only formula that reads I)
        for c in ws[col]:
            c.value = None
    ws["I1"].value = "(column not used)"; ws["S1"].value = "(column not used)"
    ws = wb["Ownership concentration"]
    for row in ws.iter_rows():
        if row[0].value == "Colorado":
            for c in row:
                c.value = None
        elif isinstance(row[0].value, str) and CO in row[0].value:
            row[0].value = row[0].value.replace(" Colorado has one refinery complex (Suncor, Commerce City). Colorado pipeline supply: see Sources tab (secondary, labeled).", "")
    _drop_rows(wb["Investigations"])
    _drop_rows(wb["Unexplained - Red flags"])
    src = wb["Sources"]
    for row in src.iter_rows():
        for c in row:
            if isinstance(c.value, str) and "(by state; Colorado = Suncor only)" in c.value:
                c.value = c.value.replace("(by state; Colorado = Suncor only)", "(by state)")
    _drop_rows(src)
    # FEC refiner PACs: committee names as filed with the FEC (official record): kept.
    wb.save(path)
