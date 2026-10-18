# DBI Intelligence 2021–2025

Dự án dựng lại theo ảnh phương pháp do người dùng cung cấp: 140 tiêu chí, 6 trụ cột bằng trọng số, mức 0/1/2/3/4/5 → 0/0/25/50/75/100. **Không dùng DBI 80% + DTI 20%.**

## Cài đặt Windows PowerShell

```powershell
cd C:\Users\binh1\bank_dx_rebuild
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python compute_scores.py
streamlit run app.py
```

Copy các file dự án mới vào thư mục hiện tại nhưng **KHÔNG XÓA data/reports/** và **KHÔNG ghi đè data/input/dbi_scores.csv nếu bạn đã chấm điểm**. Trước khi thay app.py, sao lưu `app.py` cũ.

## Nhập điểm
Trong tab **Nhập điểm**, chọn ngân hàng, năm, trụ cột; nhập `score_level` (0,1,2,3,4,5,NA hoặc để trống), trích dẫn, tên PDF hoặc URL, trang; nhấn Lưu. `NA` bắt buộc có `na_reason`. Mức 0 phải có nguồn và ghi chú hoặc trích dẫn. Mức 1–5 bắt buộc có nguồn và trích dẫn. Tự sửa trực tiếp `data/input/dbi_scores.csv` cũng được.

## PDF & Ảnh
`data/reports/BID` và tương tự TCB/HDB/TPB/VPB chứa file PDF nguyên tên. `assets/banks/<BANK>/logo.png`, `background.jpg`, `app.jpg` là ảnh tuỳ chọn.

## Dữ liệu đầu ra
`python compute_scores.py` tạo `data/output/criterion_audit.csv`, `pillar_scores.csv`, `digital_scores.csv`.

Không tự gán điểm; năm chỉ được xếp hạng khi tất cả tiêu chí áp dụng đều có mức hợp lệ và nguồn bằng chứng. Điểm 0 và 1 cùng quy đổi thành 0 nhưng có ý nghĩa khác nhau. Đây là phương pháp được mô tả trong ảnh, không phải khẳng định đã sao chép mã nguồn website.

## Tìm bằng chứng tự động từ PDF (offline, không dùng AI)

Thêm file `auto_propose.py` và `proposal_ui.py`. Đặt PDF dưới `data/reports/<BANK>/`.
Cài `pip install -r requirements.txt` rồi chạy:

```
python auto_propose.py --bank TPB --year 2022
python auto_propose.py --all
streamlit run app.py
```

Kết quả chấm đề xuất lưu tại `data/output/auto_proposals.csv`; tab **Chấm nhanh từ PDF** hiển thị các ứng viên. Chỉ các hàng được nhà nghiên cứu thực sự đối chiếu và duyệt mới được chuyển vào `data/input/dbi_scores.csv`. Không ghi đè ô đã có điểm. Bộ so khớp tiếng Anh được xây dựng theo từ điển hạn chế, không bảo đảm bao phủ toàn bộ 140 tiêu chí. Mức 2 là giả thuyết chấm sơ bộ cho đoạn có dấu hiệu triển khai, **không phải mức được chứng minh** nếu thiếu điều kiện rubric. Mức 3–5 không tự động suy diễn; những PDF dạng ảnh cần được OCR riêng.

Lưu ý: Tính điểm tổng hợp theo năm chỉ khi tất cả tiêu chí áp dụng đủ điểm kèm bằng chứng; bản đề xuất không tự tạo xếp hạng chính thức.
