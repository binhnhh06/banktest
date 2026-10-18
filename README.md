# DBI Intelligence 2021–2025

Chấm điểm và xếp hạng mức độ chuyển đổi số của 5 ngân hàng Việt Nam (**TCB, HDB, TPB, VPB, BID**) giai đoạn 2021–2025 trên **140 tiêu chí / 6 trụ cột**, kèm dashboard xem kết quả và truy ngược bằng chứng trong báo cáo thường niên.

> **Lưu ý quan trọng:** điểm hiện tại là **điểm sơ bộ do AI (Gemini) đề xuất**, chưa được người kiểm chứng. Độ phủ giữa các ngân hàng chưa đồng đều. Hãy đọc thứ hạng như xu hướng thăm dò, không phải DBI chính thức.

---

## 1. Xem dashboard nhanh (cách đơn giản nhất)

Chỉ cần **Python 3.9+**. Không cần cài thư viện, không cần API key, không cần file PDF. Dữ liệu chấm điểm đã có sẵn trong repo.

```bash
git clone https://github.com/binhnhh06/banktest.git
cd banktest

python build_dashboard_data.py      # đọc CSV -> tạo dashboard/data.js
python -m http.server 8000          # chạy web server tại thư mục gốc dự án
```

Mở trình duyệt: **http://localhost:8000/dashboard/**

Lưu ý:
- Phải chạy `python -m http.server` **ở thư mục gốc `banktest`** (không phải trong `dashboard/`), để logo và ảnh nền trong `assets/banks/` tải được.
- Không mở trực tiếp file `index.html` bằng cách bấm đúp, vì ảnh ngân hàng sẽ không hiện.
- Dùng mạng bình thường để tải phông chữ Plus Jakarta Sans (không có mạng thì dashboard vẫn chạy, chỉ khác phông).
- Sau khi cập nhật dữ liệu hoặc ảnh: chạy lại `python build_dashboard_data.py` rồi nhấn **Ctrl + F5**.

### Dashboard có gì?

| Trang | Nội dung |
|---|---|
| Tổng quan | Bảng xếp hạng, xu hướng theo năm, ma trận trụ cột, radar, nhận định tự động |
| Hồ sơ ngân hàng | Logo + ảnh nền ngân hàng, điểm từng trụ cột, điểm mạnh/yếu, bảng tiêu chí có trích dẫn |
| Bản đồ chuyển đổi số | 5 giai đoạn, trích dẫn nổi bật tự chuyển, ma trận điểm – thay đổi |
| Bằng chứng | Tỷ lệ trạng thái, độ phủ theo ngân hàng, tra cứu từng tiêu chí và đọc trích dẫn gốc |
| Phương pháp | Công thức, quy trình, câu hỏi thường gặp |

Thanh bên cho phép lọc theo ngân hàng, năm, trụ cột và đổi **giao diện nền Navy / Slate / Light**. Nút "Xuất PDF" dùng chức năng in của trình duyệt.

---

## 2. Cách tính điểm

1. Mỗi tiêu chí được chấm mức **1–5** theo thang mô tả trong `config/criteria.csv`.
2. Quy đổi sang thang 0–100: `1 → 0, 2 → 25, 3 → 50, 4 → 75, 5 → 100`.
3. **Điểm trụ cột** = trung bình các tiêu chí đã chấm của trụ cột đó.
4. **Điểm DBI sơ bộ** = trung bình **6 trụ cột, trọng số bằng nhau**.
5. Ngân hàng chỉ có điểm khi **mọi trụ cột đều có ít nhất một tiêu chí được chấm**. Nếu thiếu, dashboard hiện "chưa có điểm" thay vì tính 0.
6. Chỉ ô trạng thái `AI_PROPOSED` được tính điểm. Ô `AI_NEEDS_REVIEW` (cần rà soát) hiển thị nhưng **không** tính.

**"Thiếu bằng chứng" không có nghĩa ngân hàng chưa làm**, chỉ là hệ thống chưa tìm thấy đoạn phù hợp trong báo cáo đã dùng.

Các trạng thái trong dữ liệu: `AI_PROPOSED`, `AI_NEEDS_REVIEW`, `INSUFFICIENT_EVIDENCE`, `NO_RETRIEVED_EVIDENCE`, `ERROR`.

---

## 3. Cấu trúc thư mục

```
banktest/
├─ dashboard/                 Giao diện web (HTML/CSS/JS thuần, không cần build)
│  ├─ index.html
│  ├─ data.js                 Sinh tự động bởi build_dashboard_data.py
│  └─ assets/app.js, style.css
├─ assets/banks/<MÃ>/         Ảnh từng ngân hàng: logo, background, app
├─ config/criteria.csv        140 tiêu chí + mô tả 5 mức
├─ data/
│  ├─ input/                  bank_profiles.csv, dbi_scores.csv (nhập tay)...
│  └─ output/                 Kết quả chấm: gemini_proposals_v3.csv (nguồn của dashboard)...
├─ build_dashboard_data.py    CSV -> dashboard/data.js (chỉ ĐỌC, không sửa dữ liệu)
├─ auto_propose_v3.py         Tìm đoạn bằng chứng trong PDF (offline)
├─ gemini_score_v3.py         Chấm điểm bằng Gemini
├─ compute_scores.py, app.py  Bản Streamlit cũ (tùy chọn)
└─ requirements.txt
```

### Thay logo / ảnh nền ngân hàng

Đặt ảnh vào `assets/banks/<MÃ>/` (MÃ = `TCB`, `HDB`, `TPB`, `VPB`, `BID`):

| Tên file | Hiển thị ở đâu |
|---|---|
| `logo.png` / `.jpg` | Bảng xếp hạng và đầu hồ sơ ngân hàng |
| `background.jpg` | Nền thẻ hồ sơ ngân hàng |
| `app.png` / `.jpg` | Nền khung trích dẫn nổi bật |

Hỗ trợ png, jpg, jpeg, jfif, webp, svg. Sau khi thay ảnh: chạy lại `python build_dashboard_data.py` và nhấn Ctrl + F5. Thiếu ảnh thì dashboard dùng mã ngân hàng thay thế, không lỗi.

---

## 4. Chạy lại toàn bộ quy trình chấm điểm (tùy chọn)

Chỉ cần khi muốn chấm thêm hoặc chấm lại. Cần:
- Python 3.9+ và thư viện: `pip install -r requirements.txt`
- Báo cáo thường niên dạng **PDF** đặt trong `data/reports/<MÃ>/` (file PDF không được đưa lên Git; tự chuẩn bị)
- Với bước Gemini: biến môi trường `GEMINI_API_KEY` và `pip install google-genai`

**Tạo môi trường (Windows PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Bước 1. Tìm bằng chứng trong PDF:**
```
python auto_propose_v3.py --all
```
Hoặc từng cặp: `python auto_propose_v3.py --bank TPB --year 2022`

**Bước 2. Chấm điểm bằng Gemini:**
```powershell
$env:GEMINI_API_KEY = "khoa-api-cua-ban"
python gemini_score_v3.py --bank TPB --year 2022 --limit 20 --verify-high
```
Tham số hữu ích: `--ids 1.1.5,1.2.1` (chỉ chấm vài tiêu chí), `--limit N` (giới hạn số lần gọi API), `--retry-missing`, `--recheck`, `--model`.

**Bước 3. Cập nhật dashboard:**
```
python build_dashboard_data.py
```
Rồi tải lại trang (Ctrl + F5).

> **Không đưa API key vào Git.** `.gitignore` đã chặn `.env`, `*.key`, `secrets.toml`. Chỉ đặt khóa bằng biến môi trường.

### Bản Streamlit cũ (tùy chọn)
```
python compute_scores.py
streamlit run app.py
```
Có tab nhập điểm tay và duyệt đề xuất tự động. Dashboard web ở mục 1 là giao diện chính để trình bày kết quả.

---

## 5. Xử lý lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| Trang trắng hoặc báo "Chưa có dữ liệu" | Chưa chạy `python build_dashboard_data.py`, hoặc `dashboard/data.js` bị xóa |
| `Thieu data/output/gemini_proposals_v3.csv` | Thiếu file kết quả Gemini; lấy lại từ repo bằng `git pull` |
| Không thấy logo/ảnh nền | Chạy `http.server` sai thư mục (phải ở gốc `banktest`), hoặc quên Ctrl + F5 |
| `python` không nhận lệnh | Cài Python từ python.org, tick "Add Python to PATH"; thử `py` thay cho `python` |
| Cổng 8000 đang bị dùng | Đổi cổng: `python -m http.server 8080` rồi mở `http://localhost:8080/dashboard/` |
| Một ngân hàng ghi "chưa có điểm" | Bình thường nếu còn trụ cột chưa có tiêu chí nào được chấm; chấm thêm bằng bước 4 |
| `gemini_score_v3.py` báo thiếu key | Đặt `GEMINI_API_KEY` trong cùng cửa sổ PowerShell đang chạy |

---

## 6. Giới hạn đã biết

- Điểm do mô hình AI đề xuất, **chưa kiểm chứng bởi người**. Nên đọc lại trang PDF gốc của một mẫu ô trước khi dùng làm kết luận.
- Chỉ 5 ngân hàng, nên xếp hạng mang tính mô tả, chưa phải kiểm định thống kê.
- Một số PDF là ảnh quét (OCR) nên đoạn trích có thể lỗi chính tả hoặc nhiễu.
- Độ phủ tiêu chí giữa các ngân hàng và các năm chưa đồng đều.

## Giấy phép và nguồn

Phương pháp tham khảo từ dự án `Levianth146/bank-dx-toolkit` (đã được cấp phép). Báo cáo thường niên là tài liệu công khai của từng ngân hàng.
