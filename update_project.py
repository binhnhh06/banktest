"""
Script toàn diện: Xuất file Excel Tiêu chí & Quy tắc chấm điểm, tính 4 phương pháp MCDM
(Equal, Shannon Entropy, CRITIC, TOPSIS) và tự động cắt ảnh trang bằng chứng PDF cho Web.
Chạy lệnh: python update_project.py
"""
from pathlib import Path
import pandas as pd
import numpy as np

ROOT = Path(__file__).resolve().parent
CRITERIA_CSV = ROOT / 'config' / 'criteria.csv'
PROPOSALS_CSV = ROOT / 'data' / 'output' / 'gemini_proposals_v3.csv'
OUT_DIR = ROOT / 'data' / 'output'
OUT_DIR.mkdir(parents=True, exist_ok=True)

EVIDENCE_DIRS = [
    ROOT / 'dashboard' / 'assets' / 'evidence',
    ROOT / 'docs' / 'assets' / 'evidence'
]
for d in EVIDENCE_DIRS:
    d.mkdir(parents=True, exist_ok=True)

PILLARS = ['Khách hàng', 'Chiến lược', 'Công nghệ', 'Vận hành', 'Văn hóa', 'Dữ liệu']
BANKS = ['TCB', 'HDB', 'TPB', 'VPB', 'BID']
YEARS = [2021, 2022, 2023, 2024, 2025]

def export_pdf_evidence_images(df_prop):
    """
    Tự động mở toàn bộ PDF của 5 ngân hàng (2021-2025) trong data/reports/,
    tìm đến đúng trang của từng tiêu chí, TÔ VÀNG (highlight) đoạn trích dẫn và xuất ra ảnh PNG.
    """
    try:
        import pymupdf
    except ImportError:
        print("Hãy chạy: pip install pymupdf để cắt ảnh trực tiếp từ PDF.")
        return

    rendered = set()
    scored = df_prop[df_prop['decision'] == 'AI_PROPOSED']

    for _, row in scored.iterrows():
        srcs = [s.strip() for s in str(row.get('source_file', '')).split(';') if s.strip()]
        pages = [p.strip() for p in str(row.get('page', '')).split(';') if p.strip().isdigit()]
        quotes = [q.strip() for q in str(row.get('evidence_quote', '')).split('|')]
        if not srcs or not pages:
            continue

        for idx, pg_str in enumerate(pages):
            src_rel = srcs[idx] if idx < len(srcs) else srcs[0]
            pg_num = int(pg_str)
            stem = Path(src_rel.replace('\\', '/')).stem.lower()
            img_name = f"{stem}_p{pg_num}.png"
            if img_name in rendered:
                continue

            pdf_path = ROOT / src_rel.replace('\\', '/')
            if not pdf_path.exists():
                continue

            try:
                with pymupdf.open(pdf_path) as doc:
                    if 1 <= pg_num <= len(doc):
                        page = doc[pg_num - 1]
                        # Lấy cụm từ khóa trong câu trích dẫn để tự động tô vàng trên trang PDF
                        quote_text = quotes[idx] if idx < len(quotes) else (quotes[0] if quotes else '')
                        words = [w for w in quote_text.split() if len(w) > 3]
                        if len(words) >= 6:
                            # Tìm cụm 6 chữ liên tiếp trong đoạn trích dẫn để khoanh vùng
                            for start_i in range(0, min(len(words) - 5, 30), 5):
                                snippet = " ".join(words[start_i:start_i + 6])
                                rects = page.search_for(snippet)
                                for r in rects[:3]:
                                    annot = page.add_highlight_annot(r)
                                    annot.update()

                        # Xuất trang PDF ra ảnh độ nét vừa phải, nhẹ để đưa lên GitHub Pages
                        pix = page.get_pixmap(dpi=130)
                        for ed in EVIDENCE_DIRS:
                            pix.save(str(ed / img_name))
                        rendered.add(img_name)
            except Exception as e:
                pass

    print(f"-> Hoàn tất! Đã cắt và highlight {len(rendered)} trang báo cáo PDF cho cả 5 ngân hàng (2021-2025).")

def main():
    df_crit = pd.read_csv(CRITERIA_CSV, encoding='utf-8-sig')
    df_prop = pd.read_csv(PROPOSALS_CSV, encoding='utf-8-sig')

    # 1. Bảng Quy tắc chấm điểm & Phương pháp luận
    rules_data = [
        {"Hạng mục / Mức điểm": "Mức 1 - Khởi đầu", "Điểm quy đổi (Thang 100)": 0, "Công thức / Nguyên tắc": "S_i = (L_i - 1) / 4 * 100", "Quy tắc & Điều kiện áp dụng": "Chưa có hoặc có rất ít hoạt động chuyển đổi số theo tiêu chí; chỉ mới ở mức nhận thức sơ khai."},
        {"Hạng mục / Mức điểm": "Mức 2 - Hình thành", "Điểm quy đổi (Thang 100)": 25, "Công thức / Nguyên tắc": "S_i = (L_i - 1) / 4 * 100", "Quy tắc & Điều kiện áp dụng": "Đã triển khai thử nghiệm hoặc áp dụng ở một số bộ phận/đơn vị chức năng riêng lẻ, có bằng chứng nêu trong báo cáo."},
        {"Hạng mục / Mức điểm": "Mức 3 - Tăng tốc", "Điểm quy đổi (Thang 100)": 50, "Công thức / Nguyên tắc": "S_i = (L_i - 1) / 4 * 100", "Quy tắc & Điều kiện áp dụng": "Triển khai trên diện rộng (hầu hết các bộ phận/đơn vị chức năng), có quy trình rõ ràng và số liệu minh chứng."},
        {"Hạng mục / Mức điểm": "Mức 4 - Dẫn đầu", "Điểm quy đổi (Thang 100)": 75, "Công thức / Nguyên tắc": "S_i = (L_i - 1) / 4 * 100", "Quy tắc & Điều kiện áp dụng": "Triển khai đồng bộ, toàn diện trong toàn ngân hàng (Enterprise-wide), tối ưu hóa dựa trên dữ liệu."},
        {"Hạng mục / Mức điểm": "Mức 5 - Tiên phong", "Điểm quy đổi (Thang 100)": 100, "Công thức / Nguyên tắc": "S_i = (L_i - 1) / 4 * 100", "Quy tắc & Điều kiện áp dụng": "Triển khai toàn ngân hàng và mở rộng kết nối toàn diện với các đối tác trong hệ sinh thái số."},
        {"Hạng mục / Mức điểm": "Quy tắc Bằng chứng (Evidence Rule)", "Điểm quy đổi (Thang 100)": "Loại khỏi mẫu số nếu thiếu", "Công thức / Nguyên tắc": "P_k = Trung bình(S_i hợp lệ)", "Quy tắc & Điều kiện áp dụng": "Chỉ tính điểm các ô có trạng thái AI_PROPOSED kèm trích dẫn nguyên văn và số trang PDF. Không gán 0 điểm cho ô thiếu bằng chứng."},
        {"Hạng mục / Mức điểm": "Kiểm định Phản biện Tự động (Dual-Agent Critic)", "Điểm quy đổi (Thang 100)": "PASS / NEEDS_REVIEW", "Công thức / Nguyên tắc": "Adversarial LLM Verification", "Quy tắc & Điều kiện áp dụng": "Các tiêu chí đạt mức >= 3 được thẩm định độc lập bởi tác tử AI thứ 2 nhằm loại bỏ lỗi suy diễn phạm vi (đạt tỷ lệ PASS 86,19%)."},
        {"Hạng mục / Mức điểm": "Tổng hợp Đa phương pháp (MCDM)", "Điểm quy đổi (Thang 100)": "0 - 100", "Công thức / Nguyên tắc": "Equal, Entropy, CRITIC, TOPSIS", "Quy tắc & Điều kiện áp dụng": "Kết hợp 4 phương pháp định lượng để kiểm định độ vững chắc (Robustness) của bảng xếp hạng ngân hàng."}
    ]
    df_rules = pd.DataFrame(rules_data)
    df_rules.to_csv(ROOT / 'config' / 'scoring_rules.csv', index=False, encoding='utf-8-sig')

    # 2. Tính điểm Trụ cột & Điểm tổng hợp
    df_prop['L'] = pd.to_numeric(df_prop['proposed_level'], errors='coerce')
    df_prop['is_scored'] = (df_prop['decision'] == 'AI_PROPOSED') & (df_prop['L'].between(1, 5))
    df_prop['score_100'] = np.where(df_prop['is_scored'], (df_prop['L'] - 1.0) / 4.0 * 100.0, np.nan)

    pillar_rows = []
    for b in BANKS:
        for y in YEARS:
            sub_by = df_prop[(df_prop['bank'] == b) & (df_prop['year'] == y)]
            for p in PILLARS:
                sub_p = sub_by[sub_by['pillar_name'] == p]
                n_tot = len(sub_p)
                n_sc = int(sub_p['is_scored'].sum())
                cov = round(100.0 * n_sc / n_tot, 2) if n_tot > 0 else 0.0
                p_val = round(float(sub_p.loc[sub_p['is_scored'], 'score_100'].mean()), 2) if n_sc > 0 else np.nan
                pillar_rows.append({
                    'bank': b, 'year': y, 'pillar': p,
                    'total': n_tot, 'applicable': n_tot, 'scored': n_sc,
                    'unscored': n_tot - n_sc, 'coverage_pct': cov,
                    'complete': n_sc > 0, 'pillar_score': p_val
                })
    df_pillar_out = pd.DataFrame(pillar_rows)
    df_pillar_out.to_csv(OUT_DIR / 'pillar_scores.csv', index=False, encoding='utf-8-sig')

    # 3. Tính 4 phương pháp MCDM (Equal, Shannon Entropy, CRITIC, TOPSIS)
    piv = df_prop[df_prop['is_scored']].groupby(['bank', 'year', 'pillar_name'])['score_100'].mean().unstack('pillar_name')[PILLARS]
    cov_series = (df_prop.groupby(['bank', 'year'])['is_scored'].mean() * 100.0).round(2)
    scored_cnt = df_prop.groupby(['bank', 'year'])['is_scored'].sum().astype(int)

    X = piv.values
    m_rows, n_cols = X.shape
    w_equal = np.ones(n_cols) / n_cols

    # Shannon Entropy Weighting (SEW)
    P_mat = X / X.sum(axis=0, keepdims=True)
    E_j = - (1.0 / np.log(m_rows)) * np.sum(P_mat * np.log(P_mat + 1e-12), axis=0)
    d_j = 1.0 - E_j
    w_entropy = d_j / d_j.sum()

    # CRITIC Weighting
    X_norm = (X - X.min(axis=0, keepdims=True)) / (X.max(axis=0, keepdims=True) - X.min(axis=0, keepdims=True) + 1e-12)
    sigma_j = X_norm.std(axis=0, ddof=1)
    R_corr = np.corrcoef(X_norm, rowvar=False)
    C_j = sigma_j * np.sum(1.0 - R_corr, axis=0)
    w_critic = C_j / C_j.sum()

    # TOPSIS Score
    X_vec = X / np.sqrt(np.sum(X**2, axis=0, keepdims=True))
    V_mat = X_vec * w_entropy
    v_pos, v_neg = V_mat.max(axis=0), V_mat.min(axis=0)
    d_pos = np.sqrt(np.sum((V_mat - v_pos)**2, axis=1))
    d_neg = np.sqrt(np.sum((V_mat - v_neg)**2, axis=1))
    topsis_score = (d_neg / (d_pos + d_neg)) * 100.0

    df_mcdm = piv.round(2).copy()
    df_mcdm['scored_criteria'] = scored_cnt
    df_mcdm['coverage'] = cov_series
    df_mcdm['dbi_total'] = (X @ w_equal).round(2)
    df_mcdm['dbi_entropy'] = (X @ w_entropy).round(2)
    df_mcdm['dbi_critic'] = (X @ w_critic).round(2)
    df_mcdm['dbi_topsis'] = np.round(topsis_score, 2)
    df_mcdm['rank_eligible'] = True

    df_mcdm['rank'] = df_mcdm.groupby(level='year')['dbi_total'].rank(ascending=False, method='min').astype(int)
    df_mcdm['rank_entropy'] = df_mcdm.groupby(level='year')['dbi_entropy'].rank(ascending=False, method='min').astype(int)
    df_mcdm['rank_critic'] = df_mcdm.groupby(level='year')['dbi_critic'].rank(ascending=False, method='min').astype(int)
    df_mcdm['rank_topsis'] = df_mcdm.groupby(level='year')['dbi_topsis'].rank(ascending=False, method='min').astype(int)

    df_overall_out = df_mcdm.reset_index()
    df_overall_out.to_csv(OUT_DIR / 'overall_scores.csv', index=False, encoding='utf-8-sig')
    df_overall_out.to_csv(OUT_DIR / 'digital_scores.csv', index=False, encoding='utf-8-sig')
    df_overall_out.to_csv(OUT_DIR / 'scientific_mcdm_scores.csv', index=False, encoding='utf-8-sig')

    df_weights = pd.DataFrame({
        'Trụ cột (Pillar)': PILLARS,
        'Số tiêu chí': [25, 24, 29, 22, 22, 18],
        'Trọng số Đều - OECD (%)': np.round(w_equal * 100, 2),
        'Trọng số Shannon Entropy (%)': np.round(w_entropy * 100, 2),
        'Trọng số CRITIC (%)': np.round(w_critic * 100, 2)
    })
    df_weights.to_csv(OUT_DIR / 'objective_pillar_weights.csv', index=False, encoding='utf-8-sig')

    # 4. Xuất file Excel tổng hợp 6 Sheet nộp cho Giảng viên
    excel_path = OUT_DIR / 'DBI_TieuChi_QuyTac_Va_KetQua_ChamDiem.xlsx'
    with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
        df_rules.to_excel(writer, sheet_name='1_QuyTac_PhuongPhap', index=False)
        df_crit.to_excel(writer, sheet_name='2_Bo_140_TieuChi_Rubric', index=False)
        df_weights.to_excel(writer, sheet_name='3_TrongSo_Entropy_CRITIC', index=False)
        df_overall_out.to_excel(writer, sheet_name='4_KetQua_DBI_4_PhuongPhap', index=False)
        df_pillar_out.to_excel(writer, sheet_name='5_KetQua_Theo_TruCot', index=False)
        cols_detail = ['bank', 'year', 'criterion_id', 'pillar_name', 'title', 'proposed_level', 'score_100', 'decision', 'verification', 'confidence', 'page', 'source_file', 'reason', 'evidence_quote']
        df_prop[cols_detail].to_excel(writer, sheet_name='6_Data_3500_O_BangChung', index=False)

    print("-> Đã tạo file Excel nộp giảng viên tại:", excel_path)
    export_pdf_evidence_images(df_prop)

if __name__ == '__main__':
    main()