# DBI Intelligence: Chấm điểm & xếp hạng chuyển đổi số ngân hàng Việt Nam

Dự án đánh giá mức độ chuyển đổi số của ngân hàng Việt Nam theo bộ chỉ số **DBI (Digital Banking Index)** gồm 6 trụ cột. Dữ liệu được trích từ báo cáo thường niên, chấm điểm bằng từ khóa và AI (Gemini), sau đó đối chiếu thủ công trước khi hiển thị trên dashboard.

## Phạm vi

- **Ngân hàng khảo sát:** Techcombank (TCB), BIDV (BID), HDBank (HDB), VPBank (VPB), TPBank (TPB)
- **Giai đoạn:** 2021–2025
- **Nguồn dữ liệu:** báo cáo thường niên (PDF) của từng ngân hàng
- **Bộ tiêu chí:** 6 trụ cột, 140 tiêu chí, thang Mức 1–5 (`criteria.csv`)

## 6 trụ cột DBI

| # | Trụ cột | Tỷ trọng |
|---|---------|----------|
| 1 | Chiến lược số | 20% |
| 2 | Trải nghiệm khách hàng | 20% |
| 3 | Công nghệ & Dữ liệu | 20% |
| 4 | Vận hành & Quy trình | 15% |
| 5 | Văn hóa & Nhân sự số | 15% |
| 6 | Rủi ro & An toàn | 10% |

> Tên trụ cột và tỷ trọng trên là bản đang dùng trong dashboard; cập nhật lại nếu bộ DBI chính thức khác.

## Quy trình

1. **Thu thập:** tải báo cáo thường niên (PDF) vào thư mục `data/`.
2. **Quét từ khóa:** `score_banks.py` đọc PDF, đếm mật độ từ khóa theo từng trụ cột.
   Kết quả xuất ra `bank_scores.csv` và `bank_keyword_hits.csv`.
3. **Chấm bằng Gemini:** trích đoạn bằng chứng từ báo cáo và đề xuất mức điểm cho từng tiêu chí.
4. **Thẩm định thủ công:** đối chiếu `review_template.csv` với `criteria.csv`, mỗi tiêu chí có 3 đoạn trích. Điểm đề xuất của AI lưu ở `review_filled_claude.csv` (trạng thái `AI_SUGGESTED`).
5. **Tổng hợp & hiển thị:** điểm cuối cùng đưa vào dashboard.

## Cấu trúc thư mục

```
.
├── data/                    # Báo cáo thường niên (PDF) và dữ liệu đầu vào
├── score_banks.py           # Chấm điểm theo mật độ từ khóa
├── dashboard.py             # Ứng dụng Streamlit "DBI Bank Rank"
├── index.html               # Dashboard web DBI Intelligence (giao diện tối)
├── bank_scores.csv          # Điểm tổng hợp theo ngân hàng, năm, trụ cột
├── bank_keyword_hits.csv    # Chi tiết từ khóa tìm thấy
├── criteria.csv             # Bộ tiêu chí, Mức 1–5
├── review_template.csv      # Bảng thẩm định thủ công
├── review_filled_claude.csv # Điểm đề xuất của AI
├── cham_tay.csv             # Điểm chấm tay
└── dbi_dnl.csv              # Bộ chỉ số DBI
```

## Cài đặt & chạy

Yêu cầu: Python 3.10+.

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows (PowerShell)
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
```

**Chấm điểm từ khóa:**

```bash
python score_banks.py
```

**Chạy ứng dụng Streamlit:**

```bash
streamlit run dashboard.py
```

**Chạy dashboard web:** mở `index.html` bằng trình duyệt, hoặc dùng server cục bộ để đọc dữ liệu từ `data.json`:

```bash
python -m http.server 8000
# truy cập http://localhost:8000
```

## Cấu hình API Gemini

Tạo file `.env` ở thư mục gốc (file này đã được `.gitignore`, **không đẩy lên GitHub**):

```
GEMINI_API_KEY=<khóa của bạn>
```

## Định dạng dữ liệu cho dashboard web

```json
{
  "banks": [
    { "id": "tcb", "name": "Techcombank", "code": "TCB", "color": "#ff7b2b",
      "s": { "2021": [62, 66, 68, 60, 60, 62], "2025": [85, 89, 84, 78, 83, 80] } }
  ],
  "evidence": [
    { "b": "TCB", "p": 2, "t": "Nền tảng dữ liệu tập trung", "s": "ok", "src": "BCTN 2024, tr.52" }
  ]
}
```

- `s`: điểm 6 trụ cột theo từng năm, đúng thứ tự bảng trên.
- `evidence.s`: `ok` (đã xác thực), `wait` (chờ thẩm định), `flag` (cần rà soát).

## Hạn chế hiện tại

- Điểm theo từ khóa chỉ phản ánh mức độ nhắc đến, chưa phản ánh chất lượng triển khai.
- Một số báo cáo là PDF scan nên cần OCR trước khi chấm.
- Điểm AI chỉ là đề xuất, cần thẩm định thủ công trước khi công bố.
- Báo cáo PDF không được đẩy lên repo (`.gitignore`); tải riêng từ website của từng ngân hàng.

## Nhóm thực hiện

<Tên nhóm / thành viên>, <môn học / đơn vị>
