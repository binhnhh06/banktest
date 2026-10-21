# 🏦 Digital Banking Intelligence (DBI)
### Hệ thống đánh giá và trực quan hóa mức độ chuyển đổi số của các ngân hàng thương mại Việt Nam

**Digital Banking Intelligence (DBI)** là dự án nghiên cứu xây dựng hệ thống thu thập bằng chứng, đánh giá mức độ trưởng thành chuyển đổi số và trực quan hóa năng lực số của các ngân hàng thương mại Việt Nam trong giai đoạn **2021–2025**.

Dự án kết hợp phương pháp đánh giá đa tiêu chí, xử lý dữ liệu tài liệu, trí tuệ nhân tạo (Google Gemini) và Dashboard tương tác nhằm hỗ trợ so sánh mức độ chuyển đổi số giữa các ngân hàng, theo thời gian và theo từng trụ cột năng lực.

🌐 **[Truy cập Dashboard DBI trực tuyến](https://binhnhh06.github.io/banktest/)**

📁 **[GitHub Repository](https://github.com/binhnhh06/banktest)**

> ⚠️ **Lưu ý khi đọc kết quả:** điểm hiện tại là **điểm sơ bộ do AI (Gemini) đề xuất**, chưa được chuyên gia hoặc nhóm nghiên cứu phê duyệt, và độ phủ dữ liệu giữa các ngân hàng chưa đồng đều. Thứ hạng nên được đọc như kết quả thăm dò, không phải chỉ số chính thức.

---

## 1. Mục tiêu nghiên cứu

Dự án được phát triển nhằm:

- Xây dựng bộ chỉ tiêu đánh giá mức độ trưởng thành chuyển đổi số trong lĩnh vực ngân hàng.
- Thu thập và hệ thống hóa bằng chứng từ báo cáo thường niên và các tài liệu công bố của ngân hàng.
- Ứng dụng AI để hỗ trợ đối chiếu bằng chứng với thang đo đánh giá.
- Tính toán chỉ số DBI theo ngân hàng, năm và trụ cột.
- So sánh sự khác biệt về mức độ trưởng thành số giữa các ngân hàng.
- Xây dựng Dashboard trực quan phục vụ nghiên cứu và theo dõi quá trình chuyển đổi số.

## 2. Phạm vi nghiên cứu

**Giai đoạn:** 2021–2025.

**Đối tượng nghiên cứu:** 5 ngân hàng thương mại Việt Nam.

| Mã ngân hàng | Ngân hàng |
|---|---|
| TCB | Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank) |
| HDB | Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh (HDBank) |
| TPB | Ngân hàng TMCP Tiên Phong (TPBank) |
| VPB | Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank) |
| BID | Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV) |

Hệ thống sử dụng **140 tiêu chí thuộc 6 trụ cột đánh giá**: Khách hàng, Chiến lược, Công nghệ, Vận hành, Văn hóa và Dữ liệu. Bộ tiêu chí được áp dụng cho 5 ngân hàng trong 5 năm.

Tổng số đơn vị đánh giá:

**140 tiêu chí × 5 ngân hàng × 5 năm = 3.500 bản ghi.**

## 3. Khung đánh giá chuyển đổi số

DBI áp dụng phương pháp đánh giá mức độ trưởng thành theo 5 cấp độ. Mỗi tiêu chí có mô tả và điều kiện đánh giá riêng cho từng cấp độ trong bộ rubric (`config/criteria.csv`).

| Mức | Tên giai đoạn trên Dashboard | Điểm quy đổi |
|---|---|---:|
| 1 | Khởi đầu | 0 |
| 2 | Hình thành | 25 |
| 3 | Tăng tốc | 50 |
| 4 | Dẫn đầu | 75 |
| 5 | Tiên phong | 100 |

### 3.1. Quy đổi điểm tiêu chí

Điểm từng tiêu chí được chuẩn hóa theo công thức:

$$S_i=\frac{L_i-1}{4}\times 100$$

Trong đó:

- $S_i$: điểm chuẩn hóa của tiêu chí $i$.
- $L_i$: mức đánh giá của tiêu chí, nhận giá trị từ 1 đến 5.

### 3.2. Điểm trụ cột

Điểm của từng trụ cột là trung bình cộng các tiêu chí có điểm hợp lệ thuộc trụ cột đó:

$$P_k=\frac{1}{n_k}\sum_{i=1}^{n_k}S_i$$

Trong đó $n_k$ là số tiêu chí có điểm hợp lệ của trụ cột $k$.

### 3.3. Chỉ số DBI tổng hợp

Sáu trụ cột được áp dụng trọng số bằng nhau:

$$DBI=\frac{1}{6}\sum_{k=1}^{6}P_k$$

Chỉ số DBI nằm trong khoảng **0–100 điểm**.

**Điều kiện có điểm:** một ngân hàng trong một năm chỉ có điểm DBI khi **cả 6 trụ cột đều có ít nhất một tiêu chí được chấm hợp lệ**. Nếu còn trụ cột chưa có tiêu chí nào, Dashboard hiển thị "chưa có điểm" thay vì tính 0.

**Lưu ý:**
- Đây là điểm tổng hợp sơ bộ dựa trên các tiêu chí có kết quả đánh giá hợp lệ.
- Tiêu chí thiếu bằng chứng **không** tự động được quy đổi thành 0 điểm.
- Chỉ bản ghi `AI_PROPOSED` được tính vào điểm; bản ghi `AI_NEEDS_REVIEW` được hiển thị nhưng không tính.
- Kết quả cần được đọc cùng với tỷ lệ bao phủ dữ liệu.

### 3.4. Tỷ lệ bao phủ dữ liệu

$$Coverage=\frac{N_{scored}}{N_{total}}\times 100\%$$

Trong đó:

- $N_{scored}$: số tiêu chí có điểm AI được chấp nhận đưa vào tính toán sơ bộ.
- $N_{total}$: tổng số tiêu chí cần đánh giá.

Việc công bố độ phủ dữ liệu giúp người đọc phân biệt giữa mức độ trưởng thành số được ước lượng và mức độ đầy đủ của bằng chứng hỗ trợ.

## 4. Kiến trúc hệ thống

Hệ thống DBI gồm các thành phần chính:

**Tầng dữ liệu**
Báo cáo thường niên, tài liệu công bố, bộ tiêu chí và dữ liệu bằng chứng.

**Tầng xử lý**
Trích xuất nội dung PDF, OCR đối với tài liệu lỗi mã hóa hoặc khó đọc, chuẩn hóa dữ liệu và truy xuất bằng chứng theo tiêu chí.

**Tầng đánh giá AI**
Google Gemini được sử dụng để hỗ trợ phân tích bằng chứng, đối chiếu rubric và đề xuất mức trưởng thành chuyển đổi số.

**Tầng tổng hợp**
Chuẩn hóa điểm, tính chỉ số DBI, tỷ lệ bao phủ và các chỉ số theo ngân hàng, năm và trụ cột.

**Tầng trực quan hóa**
Dashboard HTML, CSS và JavaScript, triển khai bằng GitHub Pages.

Quy trình tổng quát:

`Báo cáo ngân hàng → Trích xuất PDF/OCR → Truy xuất bằng chứng → Gemini đề xuất điểm → Tổng hợp DBI → Dashboard`

### Cấu trúc thư mục chính

```text
banktest/
├─ dashboard/                 Dashboard bản làm việc (HTML/CSS/JS thuần)
│  ├─ index.html
│  ├─ data.js                 Dữ liệu, sinh bởi build_dashboard_data.py
│  ├─ bank_images.js          Danh sách logo/ảnh nền ngân hàng
│  └─ assets/app.js, style.css
├─ docs/                      Bản xuất bản trên GitHub Pages
├─ assets/banks/<MÃ>/         Logo, ảnh nền, ảnh ứng dụng của từng ngân hàng
├─ config/criteria.csv        140 tiêu chí và mô tả 5 mức
├─ data/output/               Kết quả chấm điểm (gemini_proposals_v3.csv...)
├─ data/review/               Phiếu kiểm tay 40 ô (review_sample_40.csv)
├─ auto_propose_v3.py         Truy xuất bằng chứng từ PDF
├─ gemini_score_v3.py         Chấm điểm bằng Gemini
├─ build_dashboard_data.py    CSV → dashboard/data.js
└─ sync_bank_images.py        Dò ảnh ngân hàng → dashboard/bank_images.js
```

## 5. Kết quả xử lý dữ liệu

Tại phiên bản dữ liệu hiện tại, hệ thống đã xử lý **3.500 bản ghi ngân hàng – năm – tiêu chí**.

| Trạng thái | Số bản ghi |
|---|---:|
| AI_PROPOSED | 2.628 |
| INSUFFICIENT_EVIDENCE | 519 |
| AI_NEEDS_REVIEW | 175 |
| NO_RETRIEVED_EVIDENCE | 101 |
| ERROR | 77 |
| **Tổng cộng** | **3.500** |

Tỷ lệ bản ghi có điểm AI đề xuất đạt khoảng **75,09%**.

Ý nghĩa các trạng thái:

- **AI_PROPOSED:** AI đã đề xuất mức điểm dựa trên bằng chứng được truy xuất.
- **INSUFFICIENT_EVIDENCE:** bằng chứng chưa đủ để xác định mức trưởng thành.
- **AI_NEEDS_REVIEW:** kết quả cần được rà soát bổ sung.
- **NO_RETRIEVED_EVIDENCE:** chưa truy xuất được bằng chứng phù hợp.
- **ERROR:** quá trình xử lý hoặc đánh giá gặp lỗi.

> Trạng thái "thiếu bằng chứng" nghĩa là hệ thống chưa tìm thấy đoạn phù hợp trong tài liệu đã dùng, **không có nghĩa** ngân hàng chưa triển khai nội dung đó.

**Quan trọng:** điểm do Gemini đề xuất không đồng nghĩa với điểm đã được chuyên gia hoặc nhóm nghiên cứu phê duyệt. Các bảng xếp hạng và biểu đồ trên Dashboard phản ánh kết quả đánh giá sơ bộ của mô hình.

## 6. Các chức năng Dashboard

Thanh bên cho phép lọc theo ngân hàng, năm và trụ cột, bật/tắt chế độ so sánh với trung bình ngành, và chọn **giao diện nền Tối / Trưa / Sáng**. Nút "Xuất PDF" dùng chức năng in của trình duyệt.

### 6.1. Tổng quan

- Điểm DBI trung bình ngành, ngân hàng dẫn đầu, độ phủ dữ liệu.
- Bảng xếp hạng ngân hàng (có thể sắp theo điểm hoặc mức tăng trưởng).
- Biểu đồ xu hướng DBI theo năm.
- **Ma trận (bản đồ nhiệt) điểm theo trụ cột** cho các ngân hàng có điểm.
- Phân kỳ của ngân hàng so với chuẩn ngành và radar so sánh các trụ cột.
- Nhận định tự động được sinh từ dữ liệu.

### 6.2. Hồ sơ ngân hàng

- Logo và ảnh nhận diện của từng ngân hàng.
- Điểm DBI, thứ hạng, độ phủ dữ liệu.
- Biểu đồ radar và điểm chi tiết từng trụ cột.
- Điểm mạnh nổi bật, tiêu chí cần cải thiện.
- Bảng tiêu chí kèm mức AI, trạng thái và trích dẫn; bấm vào để đọc bằng chứng gốc.

### 6.3. Bản đồ chuyển đổi số

- Phân loại ngân hàng theo 5 giai đoạn quy đổi từ điểm DBI.
- Khối trích dẫn bằng chứng nổi bật, tự chuyển cảnh giữa các ngân hàng.
- Ma trận điểm và mức thay đổi, độ lệch so với trung bình ngành (cần dữ liệu từ 2 năm trở lên).

### 6.4. Bằng chứng đánh giá

- Thống kê trạng thái bằng chứng và độ phủ theo ngân hàng.
- Tra cứu theo ngân hàng, năm, trụ cột, mã tiêu chí, trạng thái và nội dung trích dẫn.
- Ngăn chi tiết hiển thị trích dẫn, số trang, tên file nguồn, lý do AI đưa ra và thang 5 mức của tiêu chí để hỗ trợ truy vết.

### 6.5. Phương pháp chấm điểm

Trình bày nguyên tắc đánh giá, công thức quy đổi điểm, cách tính DBI, quy trình 5 bước và các giới hạn khi sử dụng kết quả do AI đề xuất.

## 7. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ xử lý dữ liệu | Python |
| Trích xuất tài liệu | PyMuPDF, OCR |
| Hỗ trợ đánh giá | Google Gemini API |
| Dữ liệu trung gian | CSV, JavaScript |
| Dashboard | HTML, CSS, JavaScript (không dùng thư viện ngoài) |
| Quản lý phiên bản | Git, GitHub |
| Triển khai website | GitHub Pages |

Dashboard là website tĩnh: người dùng chỉ cần mở đường dẫn GitHub Pages, **không cần máy chủ Python**. Máy chủ Python chỉ dùng khi muốn chạy thử Dashboard trên máy cá nhân (mục 8.2).

## 8. Hướng dẫn sử dụng

### 8.1. Xem Dashboard trực tuyến

Truy cập: https://binhnhh06.github.io/banktest/

### 8.2. Chạy Dashboard trên máy cá nhân

Yêu cầu: **Python 3.9+** (không cần cài thêm thư viện để chạy Dashboard).

```bash
git clone https://github.com/binhnhh06/banktest.git
cd banktest
python -m http.server 8000
```

Mở: http://localhost:8000/dashboard/

Lưu ý:
- Chạy lệnh ở **thư mục gốc `banktest`** (không phải trong `dashboard/`) để logo và ảnh nền trong `assets/banks/` tải được.
- Không mở trực tiếp file `index.html` bằng cách bấm đúp, vì ảnh ngân hàng sẽ không hiển thị.
- Nếu trình duyệt hiển thị bản cũ, nhấn **Ctrl + F5**.
- Cổng 8000 đang bận: đổi sang cổng khác, ví dụ `python -m http.server 8080`.

### 8.3. Cập nhật dữ liệu

Khi có dữ liệu đánh giá mới (đã chấm thêm bằng `gemini_score_v3.py`):

```bash
python build_dashboard_data.py
```

Lệnh này đọc `data/output/gemini_proposals_v3.csv` và tạo lại `dashboard/data.js`. Chỉ đọc dữ liệu, không sửa file kết quả Gemini.

Nếu thay logo hoặc ảnh nền, đặt ảnh vào `assets/banks/<MÃ>/` (`logo`, `background`, `app`) rồi chạy:

```bash
python sync_bank_images.py
```

Để xuất bản lên GitHub Pages, đồng bộ các file đã đổi từ `dashboard/` sang `docs/` (PowerShell):

```powershell
Copy-Item dashboard\data.js docs\data.js -Force
# Chỉ khi sửa giao diện:
Copy-Item dashboard\assets\app.js, dashboard\assets\style.css docs\assets\ -Force
# Chỉ khi đổi ảnh ngân hàng:
Copy-Item assets\banks\* docs\assets\banks\ -Recurse -Force
```

> Không chép đè `docs\bank_images.js` bằng file trong `dashboard\`: bản trong `docs` dùng đường dẫn `./assets/banks/...` còn bản trong `dashboard` dùng `../assets/banks/...`.

Sau đó commit và push các file đã cập nhật; GitHub Pages sẽ tự xuất bản lại sau ít phút.

### 8.4. Chạy lại quy trình chấm điểm (tùy chọn)

Cần Python, thư viện trong `requirements.txt`, thư viện `google-genai`, các báo cáo PDF đặt trong `data/reports/<MÃ>/` (file PDF không được đưa lên Git) và khóa `GEMINI_API_KEY`.

```powershell
pip install -r requirements.txt
pip install google-genai

python auto_propose_v3.py --all
$env:GEMINI_API_KEY = "khoa-api-cua-ban"
python gemini_score_v3.py --bank TPB --year 2022 --limit 20 --verify-high
python build_dashboard_data.py
```

**Không đưa API key vào Git.** Chỉ đặt khóa bằng biến môi trường.

### 8.5. Kiểm chứng điểm AI bằng người (mẫu 40 ô)

Để đo độ tin cậy của điểm Gemini, nhóm đối chiếu một mẫu 40 ô (8 ô mỗi ngân hàng) với báo cáo gốc:

```bash
python make_review_sample.py      # tạo data/review/review_sample_40.csv (điểm AI được giấu để chấm mù)
```

1. Mở `data/review/review_sample_40.csv` bằng Excel. Với mỗi dòng, mở PDF ở trang `page`, đọc `evidence_quote`, đối chiếu 5 mức `rubric_level_1..5` rồi điền mức 1–5 vào cột `human_level` (có thể ghi thêm `reviewer`, `note`).
2. Lưu file (giữ định dạng CSV UTF-8), chạy `python build_dashboard_data.py` và đồng bộ `data.js` sang `docs/`.
3. Trang **Bằng chứng** sẽ hiển thị số ô đã kiểm tay, tỷ lệ khớp chính xác, tỷ lệ lệch không quá 1 mức và chênh lệch trung bình (AI − người).

Lệnh `make_review_sample.py` từ chối chạy nếu phiếu đã tồn tại, để không ghi đè phiếu đã điền (chỉ dùng `--force` khi thật sự muốn tạo lại).

## 9. Giới hạn nghiên cứu

Hệ thống hiện có một số giới hạn cần lưu ý:

1. Dữ liệu phụ thuộc vào phạm vi và chất lượng tài liệu công bố của từng ngân hàng.
2. Một số báo cáo PDF có lỗi mã hóa ký tự hoặc cần xử lý OCR, nên đoạn trích có thể bị nhiễu.
3. Kết quả AI có thể bị ảnh hưởng bởi chất lượng truy xuất bằng chứng, sự không rõ ràng trong nội dung và việc diễn giải rubric.
4. Tỷ lệ bao phủ khác nhau giữa ngân hàng hoặc năm có thể ảnh hưởng đến khả năng so sánh.
5. Mẫu chỉ gồm 5 ngân hàng, nên xếp hạng mang tính mô tả, chưa phải kiểm định thống kê.
6. Chỉ số DBI phản ánh mức trưởng thành số theo khung đánh giá nghiên cứu, không phải chỉ số xếp hạng chính thức của cơ quan quản lý.
7. Kết quả hiện tại chưa thay thế được quá trình xác minh và thẩm định độc lập.

## 10. Định hướng phát triển

Trong các phiên bản tiếp theo, dự án hướng tới:

- Mở rộng phạm vi ngân hàng và thời gian nghiên cứu.
- Hoàn thiện quy trình kiểm định bằng chứng, bổ sung người kiểm tay một mẫu ô để đo độ khớp với AI.
- Tự động hóa cập nhật dữ liệu theo năm.
- Nâng cao khả năng truy xuất nguồn và giải thích điểm AI.
- Phân tích sự thay đổi điểm DBI và tác động của các yếu tố liên quan.
- Phát triển khả năng so sánh và xuất báo cáo nghiên cứu.

---

## 11. Tài liệu và nguồn dữ liệu

Nghiên cứu sử dụng báo cáo thường niên và tài liệu công bố của các ngân hàng trong phạm vi nghiên cứu, kết hợp với bộ tiêu chí đánh giá mức độ trưởng thành chuyển đổi số.


Các trích dẫn cụ thể cần được đối chiếu với tài liệu nguồn, năm công bố và vị trí bằng chứng tương ứng.

---

## 12. Tuyên bố sử dụng

Dự án được phát triển phục vụ **mục đích học tập, nghiên cứu khoa học và trực quan hóa dữ liệu**.

Các kết quả đánh giá là sản phẩm nghiên cứu độc lập, không đại diện cho đánh giá chính thức của các ngân hàng, Ngân hàng Nhà nước Việt Nam hay các tổ chức quản lý khác.

**AI được sử dụng như công cụ hỗ trợ đánh giá, không thay thế trách nhiệm kiểm định và kết luận của nhóm nghiên cứu.**

---

**Digital Banking Intelligence (DBI)**

*From Evidence to Insight — Đo lường mức độ chuyển đổi số ngân hàng dựa trên bằng chứng.*
