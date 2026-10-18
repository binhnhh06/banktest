"""Streamlit bank profile tab. Optional local assets, no API or fake metrics."""
from pathlib import Path
import base64
import html
import mimetypes
import pandas as pd
import streamlit as st

ROOT = Path(__file__).resolve().parent
PROFILES = ROOT / 'data' / 'input' / 'bank_profiles.csv'
ASSETS = ROOT / 'assets' / 'banks'


def _clean(value):
    if pd.isna(value):
        return ''
    return str(value).strip()


def _image(bank, filename):
    # Do not allow paths sourced from CSV to traverse directories.
    if bank not in {'TCB','HDB','TPB','VPB','BID'}:
        return None
    path = ASSETS / bank / filename
    return path if path.is_file() else None


def _data_uri(path):
    mime, _ = mimetypes.guess_type(path.name)
    mime = mime if mime in {'image/jpeg','image/png','image/webp'} else 'image/png'
    return f'data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}'


def render_bank_profiles(overall=None, year=2025):
    st.subheader('Hồ sơ ngân hàng')
    st.caption('Ảnh nhận diện lấy từ assets/banks; điểm và thứ hạng chỉ hiển thị khi dữ liệu đã đủ điều kiện.')
    if not PROFILES.exists():
        st.error(f'Chưa có file: {PROFILES}')
        return
    data = pd.read_csv(PROFILES, dtype=str, keep_default_na=False)
    if 'bank' not in data:
        st.error('bank_profiles.csv cần cột bank')
        return
    allowed = ['TCB','HDB','TPB','VPB','BID']
    bank = st.selectbox('Chọn ngân hàng', allowed, format_func=lambda x: f'{x} — {data.set_index("bank")["short_name"].get(x,x)}', key='profile_bank')
    matched = data[data.bank == bank]
    if matched.empty:
        st.warning('Chưa nhập hồ sơ ngân hàng này.')
        return
    profile = matched.iloc[0].to_dict()
    v = lambda key: _clean(profile.get(key, ''))
    color = v('primary_color')
    if not (len(color) == 7 and color.startswith('#') and all(c in '0123456789abcdefABCDEF' for c in color[1:])):
        color = '#334155'
    bg = _image(bank, 'background.jpg') or _image(bank, 'background.png') or _image(bank, 'background.webp')
    logo = _image(bank, 'logo.png') or _image(bank, 'logo.jpg') or _image(bank, 'logo.webp')
    app = _image(bank, 'app.jpg') or _image(bank, 'app.png') or _image(bank, 'app.webp')
    style = f"background:linear-gradient(115deg,{color},#152238);"
    if bg:
        style = f"background:linear-gradient(90deg,rgba(12,19,39,.78),rgba(12,19,39,.22)),url('{_data_uri(bg)}') center/cover;"
    logo_html = f'<img src="{_data_uri(logo)}" alt="logo" style="max-height:72px;max-width:180px;object-fit:contain;background:white;padding:8px;border-radius:12px">' if logo else f'<div style="font-weight:800;font-size:28px">{html.escape(bank)}</div>'
    st.markdown(f'''<div style="{style} padding:30px;border-radius:20px;color:white;min-height:220px;display:flex;align-items:center;gap:26px">
      <div>{logo_html}</div><div><div style="font-size:13px;opacity:.88">HỒ SƠ NGÂN HÀNG</div>
      <div style="font-size:30px;font-weight:800">{html.escape(v('short_name'))}</div>
      <div style="font-size:15px">{html.escape(v('full_name'))}</div></div></div>''', unsafe_allow_html=True)
    st.write('')
    left,right = st.columns([2,1])
    with left:
        st.markdown('#### Thông tin tổng quan')
        st.write(v('description') or 'Chưa có mô tả.')
        st.write(f"**Năm thành lập:** {v('founded_year') or 'Chưa cập nhật'}")
        st.write(f"**Hội sở:** {v('headquarters') or 'Chưa cập nhật'}")
        st.write(f"**Ứng dụng số:** {v('digital_app') or 'Chưa cập nhật'}")
        website = v('website')
        if website.startswith(('https://','http://')):
            st.link_button('Website ngân hàng',website)
        if v('source_note'):
            st.caption('Nguồn hồ sơ: ' + v('source_note'))
    with right:
        st.markdown('#### Giao diện ngân hàng số')
        if app:
            st.image(str(app), use_container_width=True)
        else:
            st.info(f'Thêm ảnh vào assets/banks/{bank}/app.jpg để hiển thị.')
    st.markdown('#### Kết quả nghiên cứu')
    if overall is None or len(overall) == 0 or not {'bank','year','rank_eligible'}.issubset(overall.columns):
        st.info('Chưa có dữ liệu xếp hạng hợp lệ.')
        return
    item = overall[(overall.bank.astype(str)==bank) & (pd.to_numeric(overall.year,errors='coerce')==year)]
    if item.empty or not bool(item.iloc[0]['rank_eligible']):
        st.info(f'Năm {year}: chưa đủ dữ liệu đã duyệt để hiển thị điểm hoặc thứ hạng.')
        return
    item = item.iloc[0]
    cols = st.columns(3)
    cols[0].metric('Năm nghiên cứu',str(year))
    cols[1].metric('Digital Score',f"{float(item['dbi_total']):.2f}/100")
    rank = item.get('rank','')
    cols[2].metric('Xếp hạng',str(int(rank)) if pd.notna(rank) else '—')
