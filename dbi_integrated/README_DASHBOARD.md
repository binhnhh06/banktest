# DBI Intelligence — giao diện của bạn, dữ liệu Gemini v3

Đây là giao diện HTML/CSS/JS của `dbi_dashboard.zip`, không thay thiết kế bằng Streamlit.

## Cài đặt

1. Sao lưu dự án `C:\Users\binh1\bank_dx_rebuild`.
2. Chép `build_dashboard_data.py` và thư mục `dashboard/` từ ZIP vào thư mục dự án trên. (Không xóa `data/`, `config/`, hay thư mục PDF.)
3. Bảo đảm tồn tại `config/criteria.csv` (140 tiêu chí) và `data/output/gemini_proposals_v3.csv`.
4. Mở PowerShell tại thư mục dự án:

```powershell
python build_dashboard_data.py
python -m http.server 8000
```

5. Mở `http://localhost:8000/dashboard/`.

## Khi Gemini chạy thêm

Chỉ cần chạy lại `python build_dashboard_data.py`, sau đó refresh trình duyệt (Ctrl+F5). Bản dựng chỉ ĐỌC CSV Gemini, không thay đổi tiến trình chấm hay dữ liệu cũ.

## Phương pháp / lưu ý

- 140 tiêu chí, 5 ngân hàng, 2021–2025; 25 bộ ngân hàng-năm.
- Chỉ `AI_PROPOSED` với mức hợp lệ 1–5 được dùng trong điểm **sơ bộ**; `AI_NEEDS_REVIEW` hiển thị nhưng không tính vào điểm.
- Mức 1→0%, 2→25%, 3→50%, 4→75%, 5→100%.
- Điểm sơ bộ ngân hàng-năm là trung bình **6 điểm trụ cột bằng trọng số**, và chỉ hiện nếu tất cả 6 trụ cột có ít nhất 1 tiêu chí có điểm AI.
- Các điểm/ thứ hạng mang tính thăm dò, chưa phải DBI chính thức; độ bao phủ giữa các ngân hàng không đồng đều.
- Bản dashboard hiện có các thành phần so sánh mẫu chung; tránh diễn giải đó là DBI chính thức.
- Logo và ảnh ứng dụng chưa được đóng gói trong ZIP gốc; bổ sung ảnh của bạn về sau nếu cần.
