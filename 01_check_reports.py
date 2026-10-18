
from pathlib import Path
import re
import pandas as pd

ROOT = Path(__file__).resolve().parent
REPORTS = ROOT / "data" / "reports"

BANKS = ["TCB", "HDB", "TPB", "VPB", "BID"]
YEARS = range(2021, 2026)

records = []

for bank in BANKS:
    folder = REPORTS / bank
    files = list(folder.rglob("*.pdf")) if folder.exists() else []

    for year in YEARS:
        matched = []

        for file in files:
            name = file.stem.upper()

            # Nhận diện năm dạng 2022 hoặc 22
            if re.search(
                rf"(?<!\d)(?:{year}|{str(year)[2:]})(?!\d)",
                name
            ):
                matched.append(file)

        records.append({
            "bank": bank,
            "year": year,
            "file_count": len(matched),
            "status": "OK" if matched else "MISSING",
            "files": "; ".join(
                str(p.relative_to(ROOT)) for p in matched
            )
        })

df = pd.DataFrame(records)

output = ROOT / "data" / "report_inventory.csv"
output.parent.mkdir(parents=True, exist_ok=True)
df.to_csv(output, index=False, encoding="utf-8-sig")

print(df[["bank", "year", "file_count", "status"]].to_string(index=False))
print("\nTổng:", (df["status"] == "OK").sum(), "/25 ngân hàng-năm")
print("Đã lưu:", output)
