import streamlit as st
import pandas as pd
import plotly.express as px
from engine import evaluate,read,settings,CONFIG,INPUT
from bank_profiles import render_bank_profiles
st.set_page_config(page_title='Bank DX Intelligence Lab',layout='wide',page_icon='🏦')
st.title('Bank DX Intelligence Lab')
st.caption('Bản tái dựng theo phương pháp DBI/DTI — KHÔNG phải bản sao mã nguồn gốc. Không tạo điểm số giả.')
try:sc,dt,pil,overall=evaluate()
except Exception as exc:st.error(f'Lỗi kiểm tra dữ liệu: {exc}');st.stop()
cfg=settings(); years=cfg['years']; banks=list(cfg['banks'])
with st.sidebar:
    year=st.selectbox('Năm',years,index=len(years)-1)
    chosen=st.multiselect('Ngân hàng',banks,default=banks)
    st.info('Nhập điểm vào data/input/dbi_evidence.csv; nhập số liệu vào data/input/dti_values.csv; tải lại trang.')
summary=overall[(overall.year==year)&overall.bank.isin(chosen)].copy()
cols=st.columns(3)
cols[0].metric('Ngân hàng được chọn',len(chosen))
cols[1].metric('Ngân hàng đủ điều kiện xếp hạng',int(summary.rank_eligible.sum()))
cols[2].metric('Độ bao phủ trung bình',f'{summary.coverage.mean()*100:.1f}%' if len(summary) else '—')
t1,t2,t3,t4,t5=st.tabs(['Xếp hạng','6 trụ cột','Xu hướng','Bằng chứng & phương pháp','Hồ sơ ngân hàng'])
with t1:
    st.subheader('Xếp hạng theo năm')
    st.dataframe(summary.sort_values('rank',na_position='last'),use_container_width=True,hide_index=True)
    ranked=summary[summary.rank_eligible]
    if len(ranked):st.plotly_chart(px.bar(ranked,x='bank',y='dbi_total',title=f'DBI tổng hợp {year}',range_y=[0,100]),use_container_width=True)
    else:st.info('Chưa đủ điểm đã duyệt và độ bao phủ để xếp hạng. Không hiển thị thứ hạng ảo.')
with t2:
    sub=pil[(pil.year==year)&pil.bank.isin(chosen)]
    st.dataframe(sub,use_container_width=True,hide_index=True)
    shown=sub.dropna(subset=['combined_pillar'])
    if len(shown):st.plotly_chart(px.bar(shown,x='pillar_id',y='combined_pillar',color='bank',barmode='group',range_y=[0,100]),use_container_width=True)
with t3:
    sub=overall[overall.bank.isin(chosen)&overall.rank_eligible]
    if len(sub):st.plotly_chart(px.line(sub,x='year',y='dbi_total',color='bank',markers=True),use_container_width=True)
    else:st.info('Chưa có chuỗi thời gian đủ điều kiện so sánh.')
with t4:
    st.markdown('**Công thức:** Điểm trụ cột = 0.8 × DBI + 0.2 × DTI nếu tất cả ngân hàng cùng năm/trụ cột đủ DTI; nếu không, dùng DBI. Điểm toàn ngân hàng = tổng điểm trụ cột × trọng số cấu hình. Chỉ xếp hạng nếu đủ mọi trụ cột và đạt ngưỡng coverage.')
    st.warning('Rule-based chỉ hỗ trợ tìm dấu hiệu. Điểm 0–4 phải có nguồn, đoạn trích và được rà soát; không tự biến từ khóa thành điểm trưởng thành.')
    st.dataframe(read('criteria_24.csv',CONFIG),use_container_width=True,hide_index=True)
    st.dataframe(sc[(sc.year==year)&sc.bank.isin(chosen)],use_container_width=True,hide_index=True)
    with st.expander('Dữ liệu chấm nhập vào'):
        st.dataframe(read('dbi_evidence.csv',INPUT),use_container_width=True)
        st.dataframe(read('dti_values.csv',INPUT),use_container_width=True)

with t5:
    render_bank_profiles(overall=overall, year=year)
