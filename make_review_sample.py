"""Tao phieu kiem tay 40 o (cham mu) de do do khop giua AI va nguoi.

    python make_review_sample.py            # tao data/review/review_sample_40.csv
    python make_review_sample.py --force    # tao lai (CANH BAO: ghi de phieu da dien)

Cach lam:
  1. Chay lenh tren, mo data/review/review_sample_40.csv bang Excel.
  2. Voi moi dong: mo PDF o trang 'page', doc doan 'evidence_quote' va doi chieu voi
     5 muc rubric (rubric_level_1..5), roi dien muc 1-5 vao cot human_level.
     KHONG mo diem AI khi cham (phieu da giau diem AI de cham mu).
  3. Chay: python build_dashboard_data.py  -> dashboard hien do khop AI-nguoi.
Lay mau: 8 o moi ngan hang, co dinh seed=42, uu tien phan bo deu theo nam va muc.
"""
import argparse, csv, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "data" / "output" / "gemini_proposals_v3.csv"
CRIT = next(p for p in [ROOT / "config" / "criteria.csv", ROOT / "criteria.csv"] if p.exists())
OUT = ROOT / "data" / "review" / "review_sample_40.csv"
BANKS = ["TCB", "HDB", "TPB", "VPB", "BID"]
PER_BANK = 8


def read(p):
    with p.open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="ghi de phieu da co")
    a = ap.parse_args()
    if OUT.exists() and not a.force:
        raise SystemExit(f"{OUT} da ton tai (co the da dien tay). Dung --force neu that su muon tao lai.")
    crit = {r["criterion_id"].strip(): r for r in read(CRIT)}
    dedup = {}
    for r in read(SRC):
        dedup[(r["bank"].strip().upper(), r["year"].strip(), r["criterion_id"].strip())] = r
    pool = {b: [] for b in BANKS}
    for (b, y, c), r in dedup.items():
        if b in pool and c in crit and (r.get("decision") or "").strip().upper() == "AI_PROPOSED" \
                and (r.get("evidence_quote") or "").strip() and (r.get("proposed_level") or "").strip():
            pool[b].append(r)
    rng = random.Random(42)
    picked = []
    for b in BANKS:
        rows = pool[b]
        rng.shuffle(rows)
        yc, lc, chosen = {}, {}, []
        while rows and len(chosen) < PER_BANK:
            # chon o co (nam, muc) it xuat hien nhat de mau dai dien
            rows.sort(key=lambda r: (yc.get(r["year"], 0) + lc.get(r["proposed_level"], 0)))
            r = rows.pop(0)
            chosen.append(r)
            yc[r["year"]] = yc.get(r["year"], 0) + 1
            lc[r["proposed_level"]] = lc.get(r["proposed_level"], 0) + 1
        picked += sorted(chosen, key=lambda r: (r["year"], r["criterion_id"]))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    cols = ["sample_id", "bank", "year", "criterion_id", "criterion_title"] + [f"rubric_level_{i}" for i in range(1, 6)] + \
           ["evidence_quote", "source_file", "page", "human_level", "reviewer", "note"]
    with OUT.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for i, r in enumerate(picked, 1):
            c = crit[r["criterion_id"].strip()]
            row = {"sample_id": i, "bank": r["bank"].strip().upper(), "year": r["year"].strip(), "criterion_id": r["criterion_id"].strip(),
                   "criterion_title": c.get("title", ""), "evidence_quote": " ".join((r.get("evidence_quote") or "").split())[:1200],
                   "source_file": r.get("source_file", ""), "page": r.get("page", ""), "human_level": "", "reviewer": "", "note": ""}
            for i2 in range(1, 6):
                row[f"rubric_level_{i2}"] = c.get(f"level{i2}", "")
            w.writerow(row)
    print(f"OK: {len(picked)} o -> {OUT}")


if __name__ == "__main__":
    main()
