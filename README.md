
# DIGITAL BANKING INTELLIGENCE (DBI)
## Hệ thống đánh giá và trực quan hóa mức độ trưởng thành chuyển đổi số ngân hàng thương mại Việt Nam (2021–2025)

> **Digital Banking Intelligence (DBI)** là dự án nghiên cứu khoa học ứng dụng trí tuệ nhân tạo (AI), xử lý tài liệu thông minh, phân tích đa tiêu chí (MCDM) và trực quan hóa dữ liệu nhằm đánh giá mức độ trưởng thành chuyển đổi số của các ngân hàng thương mại Việt Nam dựa trên bằng chứng có thể truy xuất.

### Thông tin dự án

| Thành phần | Thông tin |
|---|---|
| Tên dự án | Digital Banking Intelligence (DBI) |
| Lĩnh vực | Digital Banking, FinTech, Artificial Intelligence, Data Analytics |
| Phạm vi nghiên cứu | Ngân hàng thương mại Việt Nam |
| Giai đoạn nghiên cứu | 2021–2025 |
| Số ngân hàng | 5 |
| Số trụ cột đánh giá | 6 |
| Số tiêu chí | 140 |
| Số đơn vị ngân hàng–năm | 25 |
| Quy mô ma trận đánh giá | 3.500 bản ghi |
| Thang điểm trưởng thành | 0–100 |
| Phương pháp định lượng | Equal Weight, Shannon Entropy, CRITIC, TOPSIS |
| Công nghệ chính | Python, Streamlit, PDF Processing, RAG, Gemini AI |
| Loại hình | Nghiên cứu khoa học kết hợp phát triển hệ thống |

---

# MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Cơ sở lý thuyết](#2-cơ-sở-lý-thuyết)
3. [Khung đánh giá DBI](#3-khung-đánh-giá-dbi)
4. [Dữ liệu và quy trình xử lý](#4-dữ-liệu-và-quy-trình-xử-lý)
5. [Hệ thống chấm điểm bằng AI](#5-hệ-thống-chấm-điểm-bằng-ai)
6. [Phương pháp phân tích đa tiêu chí](#6-phương-pháp-phân-tích-đa-tiêu-chí)
7. [Kết quả nghiên cứu](#7-kết-quả-nghiên-cứu)
8. [Kiểm định độ bền vững](#8-kiểm-định-độ-bền-vững)
9. [Dashboard trực quan hóa](#9-dashboard-trực-quan-hóa)
10. [Kiến trúc hệ thống](#10-kiến-trúc-hệ-thống)
11. [Hướng dẫn triển khai](#11-hướng-dẫn-triển-khai)
12. [Hạn chế nghiên cứu](#12-hạn-chế-nghiên-cứu)
13. [Định hướng phát triển](#13-định-hướng-phát-triển)
14. [Kết luận](#14-kết-luận)
15. [Tài liệu tham khảo](#15-tài-liệu-tham-khảo)

---

# 1. TỔNG QUAN DỰ ÁN

## 1.1. Bối cảnh nghiên cứu

Trong bối cảnh Cách mạng công nghiệp lần thứ tư và sự phát triển nhanh chóng của hệ sinh thái tài chính số, chuyển đổi số đã trở thành một trong những định hướng chiến lược quan trọng của các ngân hàng thương mại.

Hoạt động chuyển đổi số không chỉ giới hạn ở việc phát triển ứng dụng ngân hàng điện tử mà còn bao gồm những thay đổi toàn diện trong chiến lược kinh doanh, kiến trúc công nghệ, quản trị dữ liệu, quy trình vận hành, văn hóa tổ chức và trải nghiệm khách hàng.

Tại Việt Nam, các ngân hàng thương mại đang đẩy mạnh ứng dụng trí tuệ nhân tạo, dữ liệu lớn, điện toán đám mây, giao diện lập trình ứng dụng (API), định danh điện tử (eKYC) và tự động hóa quy trình.

Tuy nhiên, việc đo lường và so sánh mức độ trưởng thành chuyển đổi số giữa các ngân hàng vẫn tồn tại những thách thức:

- Thiếu bộ tiêu chí đánh giá thống nhất và có khả năng so sánh.
- Khó định lượng các yếu tố chiến lược, công nghệ, vận hành và văn hóa số.
- Nguồn thông tin công bố không đồng nhất giữa các ngân hàng và các năm.
- Nhiều đánh giá mang tính định tính và phụ thuộc vào nhận định của người đánh giá.
- Khó kiểm chứng và truy xuất bằng chứng hỗ trợ từng mức điểm.
- Chưa kết hợp đầy đủ giữa tự động hóa thu thập dữ liệu, chấm điểm có kiểm soát và phân tích đa tiêu chí.

Xuất phát từ những vấn đề trên, dự án **Digital Banking Intelligence (DBI)** được phát triển nhằm xây dựng một hệ thống đánh giá có cấu trúc, minh bạch và có khả năng mở rộng.

## 1.2. Mục tiêu nghiên cứu

### Mục tiêu tổng quát

Xây dựng hệ thống đánh giá và trực quan hóa mức độ trưởng thành chuyển đổi số của ngân hàng thương mại Việt Nam dựa trên bộ tiêu chí chuẩn hóa, bằng chứng công khai và các phương pháp phân tích định lượng.

### Mục tiêu cụ thể

**Mục tiêu 1 — Xây dựng khung đánh giá**

Thiết kế bộ tiêu chí gồm 140 chỉ tiêu thuộc 6 trụ cột, phản ánh các khía cạnh quan trọng của chuyển đổi số ngân hàng.

**Mục tiêu 2 — Tự động hóa khai thác bằng chứng**

Ứng dụng công nghệ xử lý PDF, truy xuất thông tin và mô hình ngôn ngữ lớn để tìm kiếm các bằng chứng liên quan đến từng tiêu chí đánh giá.

**Mục tiêu 3 — Chuẩn hóa hoạt động chấm điểm**

Phát triển thang đo trưởng thành số 5 mức, kết hợp đánh giá bằng AI, phản biện bằng chứng và kiểm soát chất lượng.

**Mục tiêu 4 — Đánh giá bằng phương pháp MCDM**

Ứng dụng Equal Weight, Shannon Entropy, CRITIC và TOPSIS để tổng hợp điểm số, phân tích sự khác biệt và so sánh thứ hạng.

**Mục tiêu 5 — Phát triển Dashboard**

Xây dựng ứng dụng trực quan cho phép theo dõi kết quả đánh giá, so sánh ngân hàng, phân tích tiêu chí và truy xuất bằng chứng.

## 1.3. Phạm vi nghiên cứu

Nghiên cứu tập trung vào 5 ngân hàng thương mại:

| STT | Ngân hàng | Mã |
|---:|---|---|
| 1 | Ngân hàng TMCP Kỹ Thương Việt Nam | TCB |
| 2 | Ngân hàng TMCP Phát triển TP.HCM | HDB |
| 3 | Ngân hàng TMCP Tiên Phong | TPB |
| 4 | Ngân hàng TMCP Việt Nam Thịnh Vượng | VPB |
| 5 | Ngân hàng TMCP Đầu tư và Phát triển Việt Nam | BID |

Thời gian phân tích: **2021–2025**.

Đơn vị quan sát là một ngân hàng trong một năm cụ thể (bank-year).

Quy mô thiết kế:

- 5 ngân hàng.
- 5 năm nghiên cứu.
- 25 đơn vị ngân hàng–năm.
- 140 tiêu chí cho mỗi đơn vị.
- Tổng cộng 3.500 bản ghi đánh giá tiềm năng.

Cần phân biệt quy mô ma trận đánh giá với số lượng bản ghi đã được xác minh bằng chứng và phê duyệt điểm số.

---

# 2. CƠ SỞ LÝ THUYẾT

## 2.1. Khái niệm chuyển đổi số ngân hàng

Chuyển đổi số ngân hàng (Digital Banking Transformation) là quá trình ứng dụng công nghệ số kết hợp với thay đổi chiến lược, cấu trúc tổ chức và mô hình vận hành nhằm cải thiện hiệu quả hoạt động, nâng cao trải nghiệm khách hàng và tạo ra giá trị kinh doanh mới.

Có thể phân biệt ba cấp độ:

| Khái niệm | Nội dung |
|---|---|
| Digitization | Chuyển đổi thông tin từ dạng vật lý sang dạng số |
| Digitalization | Ứng dụng công nghệ số để cải thiện quy trình |
| Digital Transformation | Chuyển đổi toàn diện chiến lược, vận hành và mô hình kinh doanh |

## 2.2. Trưởng thành số (Digital Maturity)

Trưởng thành số phản ánh mức độ phát triển và tích hợp năng lực số trong toàn bộ tổ chức.

Một ngân hàng có mức trưởng thành số cao không chỉ sở hữu công nghệ hiện đại mà còn cần có khả năng:

- Xây dựng chiến lược số dài hạn.
- Cung cấp trải nghiệm khách hàng nhất quán.
- Phát triển nền tảng công nghệ linh hoạt.
- Tự động hóa và tối ưu quy trình.
- Hình thành văn hóa đổi mới sáng tạo.
- Quản trị và khai thác dữ liệu hiệu quả.

## 2.3. Khung lý thuyết tham chiếu

Bộ tiêu chí DBI được xây dựng theo hướng tổng hợp và điều chỉnh các cách tiếp cận về trưởng thành số, quản trị công nghệ và xây dựng chỉ số tổng hợp.

Các nguồn tham chiếu bao gồm:

- MIT Center for Digital Business — nghiên cứu chuyển đổi số doanh nghiệp.
- Dell Digital Transformation / Digital Maturity frameworks.
- OECD/JRC Handbook on Constructing Composite Indicators.
- Các nguyên tắc đánh giá năng lực số trong lĩnh vực ngân hàng.
- Bối cảnh pháp lý, công nghệ và hoạt động ngân hàng Việt Nam.

Bộ tiêu chí DBI là khung đánh giá được nghiên cứu phát triển và điều chỉnh cho phạm vi dự án; không được hiểu là bộ tiêu chuẩn chính thức do các tổ chức nêu trên ban hành.

---

# 3. KHUNG ĐÁNH GIÁ DBI

## 3.1. Cấu trúc 6 trụ cột

DBI sử dụng 140 tiêu chí, được phân thành 6 trụ cột.

| Mã | Trụ cột | Số tiêu chí | Tỷ trọng số lượng |
|---|---|---:|---:|
| P1 | Khách hàng | 25 | 17,86% |
| P2 | Chiến lược | 24 | 17,14% |
| P3 | Công nghệ | 29 | 20,71% |
| P4 | Vận hành | 22 | 15,71% |
| P5 | Văn hóa | 22 | 15,71% |
| P6 | Dữ liệu | 18 | 12,86% |
| **Tổng** | **6 trụ cột** | **140** | **100%** |

Lưu ý: tỷ trọng số lượng tiêu chí không đồng nghĩa với trọng số của các trụ cột trong chỉ số DBI tổng hợp.

### P1 — Khách hàng (Customer)

Đánh giá khả năng ứng dụng công nghệ để nâng cao trải nghiệm và giá trị khách hàng.

Phạm vi:

- Cá nhân hóa sản phẩm và dịch vụ.
- Trải nghiệm đa kênh và hợp nhất kênh.
- Quản trị hành trình khách hàng.
- Phân tích hành vi và phân khúc khách hàng.
- Nâng cao khả năng tiếp cận dịch vụ số.

### P2 — Chiến lược (Strategy)

Đánh giá định hướng chuyển đổi số và năng lực tổ chức thực thi chiến lược.

Phạm vi:

- Tầm nhìn và chiến lược số.
- Cam kết của lãnh đạo.
- Quản trị danh mục chuyển đổi số.
- Đầu tư và phân bổ nguồn lực.
- Hợp tác và phát triển hệ sinh thái.

### P3 — Công nghệ (Technology)

Đánh giá mức độ hiện đại, linh hoạt và an toàn của hạ tầng công nghệ.

Phạm vi:

- Kiến trúc công nghệ và core banking.
- Microservices và Open API.
- Cloud Computing.
- AI, Machine Learning và Big Data.
- An toàn thông tin và an ninh mạng.

### P4 — Vận hành (Operations)

Đánh giá khả năng số hóa và tối ưu hoạt động nội bộ.

Phạm vi:

- Tự động hóa quy trình.
- Robotic Process Automation (RPA).
- Agile, DevOps và DevSecOps.
- Quản lý và tối ưu hiệu suất.
- Phát hiện, quản trị rủi ro và gian lận.

### P5 — Văn hóa (Culture)

Đánh giá năng lực con người và môi trường tổ chức hỗ trợ chuyển đổi số.

Phạm vi:

- Văn hóa đổi mới sáng tạo.
- Kỹ năng và năng lực số của nhân sự.
- Đào tạo và học tập liên tục.
- Quản trị sự thay đổi.
- Khả năng cộng tác và thích ứng.

### P6 — Dữ liệu (Data)

Đánh giá mức độ trưởng thành trong quản trị, phân tích và khai thác dữ liệu.

Phạm vi:

- Chiến lược dữ liệu.
- Quản trị và chất lượng dữ liệu.
- Master Data Management (MDM).
- Data Analytics và Business Intelligence.
- Ra quyết định dựa trên dữ liệu.

## 3.2. Thang đo trưởng thành 5 mức

Mỗi tiêu chí được đánh giá theo 5 mức.

| Mức | Tên gọi | Điểm | Diễn giải |
|---|---|---:|---|
| Level 1 | Khởi đầu | 0 | Chưa có hoặc mới xuất hiện hoạt động ở mức sơ khai |
| Level 2 | Hình thành | 25 | Triển khai thử nghiệm hoặc riêng lẻ |
| Level 3 | Tăng tốc | 50 | Triển khai trên phạm vi rộng, có tính hệ thống |
| Level 4 | Dẫn đầu | 75 | Tích hợp toàn tổ chức, có hoạt động tối ưu hóa |
| Level 5 | Tiên phong | 100 | Phát triển năng lực số ở mức cao, tích hợp sâu với hệ sinh thái |

### Nguyên tắc chấm điểm

Điểm được xác định dựa trên việc đáp ứng các điều kiện của rubric và bằng chứng thu thập được.

Một mức điểm cao chỉ được xem xét khi có bằng chứng đủ mạnh về:

1. Năng lực hoặc hoạt động được triển khai.
2. Phạm vi áp dụng.
3. Mức độ tích hợp và vận hành thực tế.
4. Kết quả hoặc khả năng kiểm chứng theo yêu cầu của tiêu chí.

**Nguyên tắc quan trọng:**

Không tìm thấy bằng chứng trong nguồn công khai không đồng nghĩa với việc ngân hàng không sở hữu năng lực tương ứng.

Các trường hợp thiếu bằng chứng cần được phân biệt với trường hợp đã có đủ bằng chứng để xác nhận mức trưởng thành thấp.

---

# 4. DỮ LIỆU VÀ QUY TRÌNH XỬ LÝ

## 4.1. Nguồn dữ liệu

Nguồn dữ liệu chủ yếu:

- Báo cáo thường niên.
- Báo cáo phát triển bền vững.
- Tài liệu công bố chính thức của ngân hàng trong phạm vi nghiên cứu.

Dữ liệu được tổ chức theo cấu trúc:

`Bank → Year → Document → Page → Evidence → Criterion`

Mỗi bằng chứng cần được liên kết với nguồn tài liệu, năm công bố, số trang và nội dung trích xuất khi các thông tin này có sẵn.

## 4.2. Ma trận đánh giá

Quy mô lý thuyết:

\[
N = B \times T \times K
\]

Trong đó:

- \(B = 5\): số ngân hàng.
- \(T = 5\): số năm.
- \(K = 140\): số tiêu chí.

Do đó:

\[
N = 5 \times 5 \times 140 = 3.500
\]

Đây là tổng số bản ghi cần xử lý trong ma trận đầy đủ, không phải số lượng bằng chứng hợp lệ hoặc điểm số đã được phê duyệt.

## 4.3. Quy trình xử lý tài liệu

Pipeline được thiết kế theo các bước:

```text
Annual Reports / Sustainability Reports
                  |
                  v
           PDF Collection
                  |
                  v
         PDF Text Extraction
                  |
                  v
        OCR (when necessary)
                  |
                  v
       Document Normalization
                  |
                  v
       Page-level Segmentation
                  |
                  v
        Evidence Retrieval
                  |
                  v
        AI Rubric Evaluation
                  |
                  v
       Adversarial Critic
                  |
                  v
        Evidence Validation
                  |
                  v
       Human Review / Approval
                  |
                  v
        DBI Score Aggregation
                  |
                  v
       MCDM & Robustness Tests
                  |
                  v
         Streamlit Dashboard
```

## 4.4. Trích xuất từ PDF

Hệ thống sử dụng các kỹ thuật xử lý tài liệu để:

- Đọc văn bản từ PDF.
- Xác định nội dung theo trang.
- Chuẩn hóa văn bản.
- Phát hiện trường hợp cần OCR.
- Lưu thông tin nguồn để truy xuất.

Thư viện có thể sử dụng:

- PyMuPDF.
- Công cụ OCR khi cần thiết.
- Python cho xử lý và chuẩn hóa dữ liệu.

## 4.5. Truy xuất bằng chứng

Hệ thống tìm kiếm các đoạn văn bản có liên quan đến từng tiêu chí đánh giá.

Các cách tiếp cận gồm:

**TF-IDF**

Đánh giá mức độ liên quan dựa trên đặc trưng từ vựng của văn bản.

**Semantic Retrieval**

Tìm kiếm theo mức độ tương đồng ngữ nghĩa giữa mô tả tiêu chí và đoạn nội dung.

**Retrieval-Augmented Generation (RAG)**

Cung cấp bằng chứng được truy xuất cho mô hình ngôn ngữ nhằm hỗ trợ đánh giá theo rubric.

Mục tiêu là giảm việc đánh giá không có căn cứ và hạn chế suy diễn vượt quá thông tin tài liệu.

---

# 5. HỆ THỐNG CHẤM ĐIỂM BẰNG AI

## 5.1. Dual-Agent Evaluation

Hệ thống áp dụng thiết kế đánh giá kép:

- Agent 1: Rubric Scorer.
- Agent 2: Adversarial Critic.

### Agent 1 — Rubric Scorer

Agent này thực hiện:

1. Tiếp nhận nội dung tiêu chí.
2. Đọc thang đo và các điều kiện chấm điểm.
3. Phân tích bằng chứng được truy xuất.
4. Đề xuất mức trưởng thành.
5. Trình bày căn cứ cho đề xuất.

Kết quả từ Agent 1 là **đề xuất chấm điểm**, chưa mặc nhiên được xem là kết quả đánh giá cuối cùng.

### Agent 2 — Adversarial Critic

Agent này kiểm tra lại đề xuất từ Rubric Scorer, đặc biệt đối với các mức trưởng thành cao.

Các nội dung phản biện gồm:

- Mức độ liên quan của bằng chứng.
- Khả năng xác thực nguồn.
- Sự phù hợp giữa bằng chứng và mức điểm.
- Các điều kiện rubric chưa được chứng minh.
- Nguy cơ suy diễn hoặc chấm điểm quá cao.

Theo số liệu thực nghiệm được tổng hợp, tỷ lệ PASS của bước phản biện đạt **86,19%**.

Chỉ số PASS thể hiện tỷ lệ vượt qua quy trình kiểm tra theo định nghĩa của hệ thống; không đồng nghĩa trực tiếp với độ chính xác chấm điểm 86,19% nếu chưa có tập dữ liệu chuẩn do chuyên gia đánh giá.

## 5.2. Quản trị trạng thái chấm điểm

Hệ thống cần phân biệt rõ các trạng thái:

| Trạng thái | Ý nghĩa |
|---|---|
| NOT_SCORED | Chưa được chấm |
| AI_PROPOSED | AI đã đề xuất kết quả |
| AI_NEEDS_REVIEW | Cần đánh giá lại |
| INSUFFICIENT_EVIDENCE | Bằng chứng chưa đủ |
| NO_RETRIEVED_EVIDENCE | Không truy xuất được bằng chứng |
| MODEL_INVALID | Phản hồi mô hình không hợp lệ |
| ERROR | Lỗi kỹ thuật trong quá trình xử lý |
| APPROVED / SCORED | Điểm đã được xác nhận theo quy trình kiểm soát |

Tên trạng thái thực tế phụ thuộc vào schema của từng phiên bản pipeline.

Nguyên tắc quản trị:

**Không tự động xem AI_PROPOSED là điểm chính thức.**

Kết quả đề xuất phải được kiểm tra và chỉ đưa vào bộ dữ liệu đánh giá chính thức khi đáp ứng quy tắc phê duyệt.

## 5.3. Truy xuất nguồn gốc bằng chứng

Mỗi bản ghi đánh giá cần có khả năng liên kết tới:

- Mã ngân hàng.
- Năm nghiên cứu.
- Mã tiêu chí.
- Nguồn tài liệu.
- Trang tài liệu.
- Nội dung bằng chứng.
- Mức điểm được đề xuất.
- Trạng thái kiểm định.
- Kết quả phê duyệt.

Cách tiếp cận này hỗ trợ tính minh bạch, kiểm toán và khả năng tái lập nghiên cứu.

---

# 6. PHƯƠNG PHÁP PHÂN TÍCH ĐA TIÊU CHÍ

Dự án sử dụng Multi-Criteria Decision Making (MCDM) để tổng hợp và so sánh mức trưởng thành chuyển đổi số.

Các phương pháp chính:

1. Equal Weight.
2. Shannon Entropy Weighting.
3. CRITIC.
4. TOPSIS.

## 6.1. Xác định điểm trụ cột

Điểm trụ cột được tổng hợp từ các tiêu chí thành phần.

Với cách tính trung bình đều các tiêu chí hợp lệ:

\[
P_{ij} = \frac{1}{n_{ij}}\sum_{k=1}^{n_{ij}}s_{ijk}
\]

Trong đó:

- \(P_{ij}\): điểm trụ cột \(j\) của ngân hàng \(i\).
- \(s_{ijk}\): điểm tiêu chí \(k\).
- \(n_{ij}\): số tiêu chí được đưa vào phép tổng hợp.

Việc tính điểm phải tuân thủ chính sách xử lý dữ liệu thiếu của nghiên cứu. Không mặc định các tiêu chí thiếu bằng chứng nhận 0 điểm.

## 6.2. Equal Weight

Mỗi trụ cột có trọng số bằng nhau:

\[
w_j = \frac{1}{6}
\]

Điểm DBI tổng hợp:

\[
DBI_i = \sum_{j=1}^{6} w_j P_{ij}
\]

Phương pháp này xem 6 trụ cột có mức độ quan trọng ngang nhau.

## 6.3. Shannon Entropy Weighting

Shannon Entropy xác định trọng số dựa trên sự phân bố thông tin và khả năng phân biệt giữa các phương án đánh giá.

Các bước cơ bản:

1. Xây dựng ma trận quyết định.
2. Chuẩn hóa dữ liệu.
3. Tính entropy của từng tiêu chí hoặc trụ cột.
4. Xác định mức độ phân hóa.
5. Chuẩn hóa trọng số.
6. Tính chỉ số tổng hợp.

Công thức entropy:

\[
e_j = -\frac{1}{\ln(m)} \sum_{i=1}^{m}p_{ij}\ln(p_{ij})
\]

Quy ước:

\[
0\ln(0)=0
\]

Trọng số:

\[
w_j = \frac{1-e_j}{\sum_{j=1}^{n}(1-e_j)}
\]

Trong đó \(m\) là số phương án đánh giá và \(n\) là số trụ cột.

## 6.4. CRITIC

CRITIC (Criteria Importance Through Intercriteria Correlation) xác định trọng số dựa trên:

- Mức độ biến thiên của từng tiêu chí.
- Mức độ tương quan giữa các tiêu chí.

Công thức:

\[
C_j = \sigma_j\sum_{k=1}^{n}(1-r_{jk})
\]

\[
w_j = \frac{C_j}{\sum_{j=1}^{n}C_j}
\]

Trong đó:

- \(\sigma_j\): độ lệch chuẩn của tiêu chí \(j\).
- \(r_{jk}\): hệ số tương quan giữa tiêu chí \(j\) và \(k\).
- \(C_j\): lượng thông tin tương phản của tiêu chí \(j\).

## 6.5. TOPSIS

TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) xếp hạng các phương án theo khoảng cách tới:

- Giải pháp lý tưởng dương.
- Giải pháp lý tưởng âm.

Hệ số gần lý tưởng:

\[
C_i = \frac{D_i^-}{D_i^+ + D_i^-}
\]

Trong đó:

- \(D_i^+\): khoảng cách tới phương án lý tưởng dương.
- \(D_i^-\): khoảng cách tới phương án lý tưởng âm.

Giá trị:

\[
0 \leq C_i \leq 1
\]

Giá trị \(C_i\) càng lớn thể hiện phương án càng gần với giải pháp lý tưởng dương.

Trong bảng kết quả, hệ số TOPSIS có thể được nhân với 100 để trình bày thuận tiện.

TOPSIS là phương pháp xếp hạng tương đối và không được diễn giải trực tiếp như điểm trưởng thành tuyệt đối.

---

# 7. KẾT QUẢ NGHIÊN CỨU

> Các số liệu dưới đây là kết quả tổng hợp được cung cấp trong báo cáo nghiên cứu. Việc công bố kết quả cuối cùng cần đối chiếu với dữ liệu đầu ra, quy tắc xử lý thiếu và trạng thái phê duyệt điểm của pipeline.

## 7.1. Trọng số các trụ cột

| Trụ cột | Equal Weight | Shannon Entropy | CRITIC |
|---|---:|---:|---:|
| Khách hàng | 16,67% | 16,39% | 11,55% |
| Chiến lược | 16,67% | 8,19% | 17,54% |
| Công nghệ | 16,67% | 10,69% | 13,37% |
| Vận hành | 16,67% | 12,03% | 19,27% |
| Văn hóa | 16,67% | 26,79% | 18,14% |
| Dữ liệu | 16,67% | 25,92% | 20,13% |

*Lưu ý: tổng tỷ trọng có thể chênh lệch 0,01–0,02 điểm phần trăm do làm tròn.*

### Nhận xét

**Shannon Entropy**

Văn hóa và Dữ liệu nhận trọng số cao nhất, lần lượt đạt 26,79% và 25,92%.

Kết quả cho thấy hai trụ cột này mang tính phân biệt tương đối lớn trong bộ dữ liệu được sử dụng để tính trọng số.

**CRITIC**

Dữ liệu và Vận hành có trọng số lớn nhất, lần lượt đạt 20,13% và 19,27%.

Điều này phản ánh mức độ biến thiên và thông tin tương phản của các trụ cột theo phương pháp CRITIC.

**Hàm ý phương pháp luận**

Trọng số khách quan được xác định từ cấu trúc dữ liệu, không tự động đại diện cho tầm quan trọng chiến lược hoặc quan hệ nhân quả của từng trụ cột.

## 7.2. Kết quả đánh giá năm 2025

| Ngân hàng | Độ phủ bằng chứng | Equal | Entropy | CRITIC | TOPSIS × 100 |
|---|---:|---:|---:|---:|---:|
| TCB | 88,57% | 46,77 | 46,73 | 46,92 | 94,32 |
| VPB | 75,00% | 45,65 | 45,40 | 46,28 | 87,60 |
| HDB | 90,00% | 37,00 | 36,18 | 37,35 | 60,83 |
| BID | 57,86% | 36,00 | 36,19 | 35,81 | 62,81 |
| TPB | 68,57% | 23,95 | 21,90 | 23,62 | 19,42 |

## 7.3. Thứ hạng năm 2025

### Theo DBI Equal Weight

| Hạng | Ngân hàng | DBI |
|---:|---|---:|
| 1 | Techcombank | 46,77 |
| 2 | VPBank | 45,65 |
| 3 | HDBank | 37,00 |
| 4 | BIDV | 36,00 |
| 5 | TPBank | 23,95 |

### Theo TOPSIS

| Hạng | Ngân hàng | TOPSIS × 100 |
|---:|---|---:|
| 1 | Techcombank | 94,32 |
| 2 | VPBank | 87,60 |
| 3 | BIDV | 62,81 |
| 4 | HDBank | 60,83 |
| 5 | TPBank | 19,42 |

### Phân tích kết quả

**Techcombank (TCB)**

Dẫn đầu theo cả DBI Equal Weight và TOPSIS trong bảng kết quả năm 2025.

**VPBank (VPB)**

Xếp thứ hai trong cả hai phương pháp, có mức điểm tương đối gần Techcombank theo Equal Weight.

**HDBank (HDB)**

Xếp thứ ba theo Equal Weight, nhưng đứng thứ tư theo TOPSIS.

**BIDV (BID)**

Xếp thứ tư theo Equal Weight, nhưng đứng thứ ba theo TOPSIS.

**TPBank (TPB)**

Có mức điểm thấp nhất trong nhóm nghiên cứu theo hai phương pháp được trình bày.

Điểm thấp phải được xem xét cùng độ phủ bằng chứng, vì kết quả đánh giá dựa trên thông tin công khai chưa nhất thiết phản ánh toàn bộ năng lực số thực tế.

## 7.4. Phân tích độ phủ bằng chứng

Độ phủ bằng chứng phản ánh tỷ lệ tiêu chí có bằng chứng theo định nghĩa sử dụng trong pipeline.

Cần phân biệt:

- **Evidence Coverage:** tỷ lệ tiêu chí có bằng chứng.
- **Evidence Quality:** chất lượng và mức độ liên quan của bằng chứng.
- **Scoring Coverage:** tỷ lệ tiêu chí đã có kết quả chấm hợp lệ.
- **Approval Coverage:** tỷ lệ tiêu chí đã được kiểm tra, phê duyệt.
- **Digital Maturity:** mức độ trưởng thành số được đánh giá.

Một ngân hàng có độ phủ bằng chứng cao không nhất thiết có mức trưởng thành số cao.

Tương tự, độ phủ thấp có thể phản ánh hạn chế công bố thông tin, không chỉ năng lực chuyển đổi số.

---

# 8. KIỂM ĐỊNH ĐỘ BỀN VỮNG

## 8.1. Mục đích

Kiểm định độ bền vững nhằm đánh giá mức độ nhạy cảm của kết quả xếp hạng trước việc thay đổi phương pháp tổng hợp và trọng số.

Nghiên cứu sử dụng tương quan hạng Spearman để phân tích mức độ tương đồng giữa các phương pháp.

## 8.2. Kết quả Spearman

Dữ liệu tính toán gồm 25 đơn vị ngân hàng–năm.

| Cặp phương pháp | Spearman rho | p-value |
|---|---:|---:|
| Equal Weight – CRITIC | 0,9892 | < 0,0001 |
| Entropy – TOPSIS | 0,9823 | < 0,0001 |
| Equal Weight – Entropy | 0,9623 | < 0,0001 |

Các hệ số tương quan đều dương và rất cao.

Điều này cho thấy các phương pháp có mức độ nhất quán đáng kể về thứ hạng trên bộ dữ liệu nghiên cứu.

## 8.3. Diễn giải khoa học

Kết quả tương quan cao hỗ trợ nhận định rằng thứ hạng tổng thể ít biến động khi thay đổi phương pháp đánh giá.

Tuy nhiên, không thể kết luận mọi ngân hàng đều giữ nguyên vị trí dưới tất cả phương pháp.

Ví dụ, năm 2025, HDBank và BIDV có sự hoán đổi vị trí giữa Equal Weight và TOPSIS.

Ngoài ra, 25 quan sát ngân hàng–năm có thể tồn tại sự phụ thuộc theo thời gian đối với cùng ngân hàng. Do đó, p-value Spearman thông thường cần được diễn giải thận trọng.

Kết quả này cung cấp bằng chứng về tính ổn định tương đối của thứ hạng, nhưng chưa đủ để khẳng định tính bền vững tuyệt đối trước mọi giả định.

## 8.4. Các kiểm định mở rộng đề xuất

Để đánh giá độ bền vững toàn diện hơn, có thể triển khai:

- Sensitivity Analysis theo trọng số.
- Rank Reversal Analysis.
- Leave-One-Pillar-Out Analysis.
- Monte Carlo Weight Perturbation.
- Phân tích tác động của dữ liệu thiếu.
- Kiểm định sai lệch do mức độ công bố thông tin.
- Kendall's Tau để đánh giá tính nhất quán thứ hạng.

---

# 9. DASHBOARD TRỰC QUAN HÓA

Hệ thống được xây dựng trên nền tảng Streamlit nhằm cung cấp giao diện tương tác cho hoạt động phân tích và khai thác kết quả.

## 9.1. Tổng quan hệ thống

Trang tổng quan cung cấp:

- Điểm trưởng thành số trung bình.
- Độ phủ dữ liệu và bằng chứng.
- Bảng xếp hạng ngân hàng.
- Biểu đồ so sánh các trụ cột.
- Phân bố mức trưởng thành.
- Bản đồ năng lực số.
- Chênh lệch điểm giữa các ngân hàng.

## 9.2. Hồ sơ ngân hàng

Trang hồ sơ ngân hàng cho phép:

- Chọn ngân hàng và năm đánh giá.
- Xem logo và thông tin ngân hàng.
- Xem điểm tổng hợp.
- Phân tích điểm theo 6 trụ cột.
- Hiển thị biểu đồ radar.
- Xem các tiêu chí mạnh và yếu.
- Theo dõi độ phủ bằng chứng.
- Kiểm tra bảng chấm điểm từng tiêu chí.
- Chuyển đổi giữa các ngân hàng để so sánh.

## 9.3. Phân tích theo tiêu chí

Hệ thống hỗ trợ:

- Lọc theo trụ cột.
- Lọc theo mã tiêu chí.
- So sánh ngân hàng.
- Theo dõi kết quả theo năm.
- Phân tích thay đổi mức trưởng thành.
- Xem điều kiện của từng mức rubric.

## 9.4. Bằng chứng đánh giá

Đây là một trong những thành phần quan trọng của hệ thống DBI.

Người dùng có thể tra cứu:

- Ngân hàng và năm.
- Mã tiêu chí.
- Đoạn trích bằng chứng.
- Nguồn báo cáo.
- Số trang.
- Trạng thái chấm điểm.
- Mức độ đáp ứng rubric.

Khi tài liệu gốc và đường dẫn trang khả dụng, dashboard hỗ trợ mở trang PDF tương ứng để người dùng trực tiếp đối chiếu thông tin.

Mục tiêu là xây dựng hệ thống đánh giá có khả năng giải thích và truy xuất, thay vì chỉ cung cấp điểm số tổng hợp.

## 9.5. Phương pháp nghiên cứu

Trang phương pháp trình bày:

- Cấu trúc 140 tiêu chí.
- Quy tắc chấm 5 mức.
- Công thức tính điểm.
- Nguyên tắc xử lý dữ liệu thiếu.
- Phương pháp xác định trọng số.
- Cách tính TOPSIS.
- Phương pháp kiểm định thứ hạng.

---

# 10. KIẾN TRÚC HỆ THỐNG

## 10.1. Kiến trúc tổng quát

Hệ thống DBI được thiết kế theo hướng phân tách dữ liệu, đánh giá và trực quan hóa.

```text
                    DATA SOURCES
                         |
             +-----------+-----------+
             |                       |
       Annual Reports         Sustainability
             |                   Reports
             +-----------+-----------+
                         |
                         v
                DOCUMENT PIPELINE
                         |
             +-----------+-----------+
             |                       |
       PDF Extraction          OCR Processing
             |                       |
             +-----------+-----------+
                         |
                         v
                  EVIDENCE LAYER
                         |
             +-----------+-----------+
             |                       |
        TF-IDF Search          Semantic Search
             |                       |
             +-----------+-----------+
                         |
                         v
                   AI SCORING
                         |
                 Rubric Scorer
                         |
                 Adversarial Critic
                         |
                  Quality Control
                         |
                  Human Approval
                         |
                         v
                   SCORING DATA
                         |
             +-----------+-----------+
             |                       |
          DBI Index              MCDM Models
             |                       |
             +-----------+-----------+
                         |
                         v
                STREAMLIT DASHBOARD
                         |
             +-----------+-----------+
             |           |           |
         Overview     Bank Profile   Evidence
                         |
                         v
                  RESEARCH OUTPUTS
```

## 10.2. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ lập trình | Python |
| Giao diện Dashboard | Streamlit |
| Xử lý dữ liệu | Pandas, NumPy |
| Trích xuất PDF | PyMuPDF |
| Truy xuất văn bản | TF-IDF, Semantic Retrieval |
| Mô hình ngôn ngữ | Gemini AI |
| Phân tích định lượng | SciPy, MCDM |
| Biểu đồ | Plotly / thư viện trực quan tương ứng |
| Quản lý phiên bản | Git, GitHub |

Danh sách thư viện thực tế và phiên bản phụ thuộc vào cấu hình của repository.

## 10.3. Nguyên tắc thiết kế

**Modularity**

Tách biệt các thành phần thu thập dữ liệu, truy xuất bằng chứng, chấm điểm và Dashboard.

**Traceability**

Mỗi kết quả đánh giá có khả năng liên kết với nguồn và bằng chứng.

**Reproducibility**

Quy trình và tham số được lưu trữ để hỗ trợ tái lập kết quả.

**Human-in-the-loop**

Duy trì cơ chế kiểm tra và phê duyệt của con người.

**Scalability**

Thiết kế cho phép mở rộng số lượng ngân hàng, năm và nguồn dữ liệu.

---

# 11. HƯỚNG DẪN TRIỂN KHAI

## 11.1. Yêu cầu môi trường

Khuyến nghị sử dụng:

- Python 3.10 trở lên, tùy khả năng tương thích thư viện.
- Git.
- Visual Studio Code.
- Môi trường Python ảo.
- Các thư viện khai báo trong `requirements.txt`.

## 11.2. Clone repository

```bash
git clone https://github.com/binhnhh06/dbi_project.git
cd dbi_project
```

## 11.3. Tạo môi trường ảo

Trên Windows:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Trên macOS hoặc Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

## 11.4. Cài đặt thư viện

Nếu repository có `requirements.txt`:

```bash
pip install -r requirements.txt
```

## 11.5. Khởi chạy Dashboard

Nếu file ứng dụng chính là `app.py`:

```bash
streamlit run app.py
```

Truy cập địa chỉ do Streamlit hiển thị, thông thường:

```text
http://localhost:8501
```

## 11.6. Cấu hình API

Một số chức năng liên quan đến AI có thể yêu cầu khóa API và cấu hình môi trường riêng.

Không đưa API key, mật khẩu, token hoặc thông tin truy cập nhạy cảm lên GitHub.

Có thể lưu thông tin cấu hình trong biến môi trường hoặc tệp cấu hình được loại trừ khỏi Git.

## 11.7. Lưu ý về khả năng tái lập

Để tái lập đầy đủ kết quả nghiên cứu, cần có:

- Bộ dữ liệu đầu vào.
- Phiên bản rubric.
- Mã nguồn xử lý.
- Cấu hình truy xuất.
- Tham số mô hình.
- Quy tắc chấm điểm và phê duyệt.
- Phương pháp xử lý dữ liệu thiếu.
- Bộ dữ liệu kết quả đã xác minh.

Chỉ chạy Dashboard không đồng nghĩa với việc tái tạo được toàn bộ pipeline chấm điểm từ tài liệu gốc.

---

# 12. HẠN CHẾ NGHIÊN CỨU

## 12.1. Giới hạn dữ liệu công khai

Nghiên cứu chủ yếu dựa vào báo cáo được ngân hàng công bố.

Vì vậy, kết quả phản ánh năng lực số có thể kiểm chứng từ các nguồn dữ liệu thuộc phạm vi nghiên cứu, thay vì toàn bộ năng lực nội bộ.

## 12.2. Sai lệch do công bố thông tin

Các ngân hàng có thể khác nhau về:

- Mức độ chi tiết của báo cáo.
- Cách trình bày công nghệ và chiến lược.
- Tần suất công bố thông tin.
- Khả năng kiểm chứng kết quả triển khai.

Điều này tạo ra nguy cơ sai lệch khi so sánh.

## 12.3. Hạn chế xử lý PDF

Một số tài liệu có thể gặp:

- Lỗi mã hóa ký tự.
- Chất lượng scan thấp.
- Bảng biểu khó trích xuất.
- Văn bản nhiều cột.
- Thông tin chỉ thể hiện dưới dạng hình ảnh.

Các vấn đề này ảnh hưởng đến khả năng truy xuất bằng chứng.

## 12.4. Hạn chế của mô hình AI

Mô hình ngôn ngữ lớn có thể:

- Diễn giải sai ngữ cảnh.
- Suy diễn quá mức từ bằng chứng.
- Nhầm lẫn giữa kế hoạch và kết quả triển khai.
- Đưa ra đánh giá không nhất quán.
- Gặp khó khăn với thông tin chuyên ngành.

Vì vậy, cần duy trì cơ chế phản biện và phê duyệt.

## 12.5. Hạn chế về mẫu nghiên cứu

Mẫu gồm 5 ngân hàng và 5 năm, tương đương 25 quan sát ngân hàng–năm.

Quy mô này phù hợp cho nghiên cứu thực nghiệm ban đầu nhưng còn hạn chế trong việc khái quát kết quả cho toàn bộ hệ thống ngân hàng thương mại Việt Nam.

## 12.6. Hạn chế của MCDM

Các phương pháp MCDM phụ thuộc vào:

- Ma trận dữ liệu.
- Phương pháp chuẩn hóa.
- Quy tắc trọng số.
- Chính sách xử lý dữ liệu thiếu.
- Thành phần mẫu so sánh.

Do đó, kết quả xếp hạng cần được diễn giải trong phạm vi dữ liệu và giả định nghiên cứu.

---

# 13. ĐỊNH HƯỚNG PHÁT TRIỂN

## 13.1. Mở rộng phạm vi nghiên cứu

Mở rộng từ 5 ngân hàng sang nhiều ngân hàng thương mại hơn, hướng tới dữ liệu bảng có khả năng so sánh theo thời gian.

## 13.2. Phát triển dữ liệu nhiều nguồn

Bổ sung các nguồn phù hợp và có thể kiểm chứng:

- Báo cáo tài chính.
- Công bố thông tin chính thức.
- Chỉ số vận hành công khai.
- Thông tin về sản phẩm và dịch vụ số.
- Dữ liệu trải nghiệm khách hàng được thu thập hợp pháp.

## 13.3. Nâng cao hệ thống AI

Phát triển:

- Hybrid Retrieval.
- Reranking.
- Evidence Verification.
- Cross-document Validation.
- Confidence Calibration.
- Human Feedback Loop.

## 13.4. Phát triển kiểm định

Bổ sung:

- Sensitivity Analysis.
- Monte Carlo Simulation.
- Kendall Rank Correlation.
- Bootstrap khi phù hợp với cấu trúc mẫu.
- Phân tích dữ liệu thiếu.
- Đánh giá mức độ nhất quán giữa AI và chuyên gia.

## 13.5. Nâng cấp Dashboard

Các định hướng gồm:

- Theo dõi xu hướng chuyển đổi số theo năm.
- So sánh chéo nhiều ngân hàng.
- Phân tích chênh lệch theo trụ cột.
- Truy xuất bằng chứng trực tiếp từ PDF.
- Quản lý phiên bản kết quả chấm.
- Phân biệt điểm AI đề xuất và điểm đã phê duyệt.
- Xuất báo cáo phân tích.
- Tích hợp quy trình cập nhật dữ liệu có kiểm soát.

---

# 14. KẾT LUẬN

Dự án **Digital Banking Intelligence (DBI)** đề xuất một cách tiếp cận tích hợp nhằm đánh giá mức độ trưởng thành chuyển đổi số của ngân hàng thương mại Việt Nam.

Hệ thống kết hợp bốn thành phần chính:

**Thứ nhất, bộ tiêu chí đánh giá có cấu trúc**, gồm 140 tiêu chí thuộc 6 trụ cột, giúp chuẩn hóa việc phân tích các khía cạnh chuyển đổi số.

**Thứ hai, quy trình khai thác bằng chứng**, sử dụng công nghệ xử lý tài liệu, truy xuất thông tin và AI nhằm hỗ trợ đánh giá có căn cứ.

**Thứ ba, phân tích định lượng đa tiêu chí**, kết hợp Equal Weight, Shannon Entropy, CRITIC và TOPSIS để đánh giá và đối chiếu kết quả xếp hạng.

**Thứ tư, hệ thống Dashboard tương tác**, hỗ trợ trực quan hóa điểm số, phân tích ngân hàng và truy xuất nguồn bằng chứng.

Kết quả thực nghiệm năm 2025 cho thấy Techcombank và VPBank đứng đầu trong nhóm ngân hàng được khảo sát theo các phương pháp tổng hợp đã trình bày.

Tuy nhiên, kết quả cần được xem xét đồng thời với chất lượng công bố thông tin, độ phủ bằng chứng và trạng thái kiểm định.

Nghiên cứu hướng tới xây dựng một hệ thống đánh giá chuyển đổi số ngân hàng theo nguyên tắc:

> **Evidence-based — Transparent — Explainable — Reproducible**

**Thông điệp cốt lõi:**

> Chuyển đổi số ngân hàng không nên chỉ được đánh giá thông qua mức độ hiện đại của công nghệ, mà cần được xem xét trên toàn bộ năng lực chiến lược, khách hàng, vận hành, văn hóa và dữ liệu, dựa trên bằng chứng có thể kiểm chứng.

---

# 15. TÀI LIỆU THAM KHẢO

Các nhóm tài liệu phục vụ nghiên cứu:

### 15.1. Cơ sở phương pháp luận

- OECD & Joint Research Centre. (2008). *Handbook on Constructing Composite Indicators: Methodology and User Guide*. OECD Publishing.
- Shannon, C. E. (1948). A mathematical theory of communication. *Bell System Technical Journal, 27*, 379–423, 623–656.
- Diakoulaki, D., Mavrotas, G., & Papayannakis, L. (1995). Determining objective weights in multiple criteria problems: The CRITIC method. *Computers & Operations Research, 22*(7), 763–770.
- Hwang, C. L., & Yoon, K. (1981). *Multiple Attribute Decision Making: Methods and Applications*. Springer.

### 15.2. Cơ sở chuyển đổi số

- Westerman, G., Bonnet, D., & McAfee, A. (2014). *Leading Digital: Turning Technology into Business Transformation*. Harvard Business Review Press.
- Các công trình nghiên cứu về Digital Transformation và Digital Maturity của MIT Center for Digital Business.
- Các tài liệu liên quan đến khung đánh giá trưởng thành số trong lĩnh vực ngân hàng.

### 15.3. Nguồn dữ liệu ngân hàng

- Techcombank. Báo cáo thường niên giai đoạn 2021–2025.
- HDBank. Báo cáo thường niên giai đoạn 2021–2025.
- TPBank. Báo cáo thường niên giai đoạn 2021–2025.
- VPBank. Báo cáo thường niên giai đoạn 2021–2025.
- BIDV. Báo cáo thường niên giai đoạn 2021–2025.
- Báo cáo phát triển bền vững và tài liệu công bố chính thức có liên quan.

*Danh mục tài liệu tham khảo cuối cùng cần bổ sung đầy đủ năm công bố, URL, phiên bản báo cáo và thông tin truy xuất theo chuẩn trích dẫn của nghiên cứu.*

---

# REPOSITORY

**Project:** Digital Banking Intelligence (DBI)

**Research Period:** 2021–2025

**Repository:**

https://github.com/binhnhh06/dbi_project

**Research Focus:** Digital Banking Transformation, Digital Maturity, AI-based Evidence Evaluation, Multi-Criteria Decision Making and Banking Analytics.

---

*Digital Banking Intelligence — Towards Transparent and Evidence-Based Digital Banking Assessment.*
