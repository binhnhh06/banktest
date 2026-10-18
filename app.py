import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
import html
from compute_scores import (ROOT,BANKS,YEARS,PILLARS,FIELDS,read_scores,save_scores,criteria_df,
                            audit_scores,export)
from bank_profiles import render_bank_profiles
from proposal_ui import render_proposal_review

st.set_page_config(page_title='DBI Intelligence | 2021–2025',page_icon='🏦',layout='wide')
st.markdown("""<style>
.stApp{background:radial-gradient(circle at 8% 5%,#dbd3ff 0%,transparent 34%),radial-gradient(circle at 86% 14%,#c0f7f8 0%,transparent 35%),linear-gradient(140deg,#eff1ff,#d9d6fb 46%,#e5f5ff);color:#231a45}
.block-container{max-width:1450px;padding-top:1.6rem}
[data-testid="stMetric"]{background:rgba(255,255,255,.7);backdrop-filter:blur(16px);border:1px solid rgba(109,85,182,.25);border-radius:18px;padding:18px}
[data-testid="stVerticalBlockBorderWrapper"]>div{background:rgba(255,255,255,.65);backdrop-filter:blur(14px);border-radius:20px}
h1,h2,h3{color:#251945} .stTabs [data-baseweb="tab-list"]{gap:10px;flex-wrap:wrap}
.stTabs [data-baseweb="tab"]{border-radius:12px;background:#ffffff9e;border:1px solid #b7a8e8;padding:9px 13px}
.hero{padding:30px;border-radius:23px;color:white;background:linear-gradient(110deg,#39318c,#6959d6 55%,#64cada);box-shadow:0 18px 48px #7865be35}
.hero h1,.hero p{color:white} .note{color:#554d78}
</style>""",unsafe_allow_html=True)

st.markdown("""<div class="hero"><div style="opacity:.8;font-size:13px;letter-spacing:2px">BANK DIGITAL MATURITY INTELLIGENCE</div><h1>Digital Banking Index · 2021–2025</h1><p>5 ngân hàng · 140 tiêu chí · 6 trụ cột · Kiểm chứng nguồn và xếp hạng minh bạch</p></div>""",unsafe_allow_html=True)
st.caption('Dữ liệu ngân hàng chưa được nhập sẽ không có điểm hoặc thứ hạng. Giao diện màu kính mờ lấy cảm hứng từ ảnh tham khảo.')
try:
    detail,pillars,overall=export()
except Exception as exc:
    st.error(f'Lỗi dữ liệu: {exc}');st.stop()

with st.sidebar:
    st.header('Bộ lọc nghiên cứu')
    year=st.selectbox('Năm',YEARS,index=len(YEARS)-1)
    bank=st.selectbox('Ngân hàng',BANKS)
    st.divider()
    st.caption('0: thiếu bằng chứng đã rà soát; 1: mức thấp nhất. Cả hai quy đổi 0%. NA: không áp dụng (có lý do). Trống: chưa chấm.')
    st.caption('Điểm theo năm chỉ hiển thị khi toàn bộ tiêu chí áp dụng có điểm và nguồn.')

tabs=st.tabs(['🏠 Tổng quan','🏆 Xếp hạng','📊 6 trụ cột','📈 Xu hướng','📝 Nhập điểm','⚡ Chấm nhanh từ PDF','🔎 Bằng chứng & PDF','🏦 Hồ sơ ngân hàng','📖 Phương pháp'])
with tabs[0]:
    c1,c2,c3,c4=st.columns(4)
    c1.metric('Ngân hàng',5);c2.metric('Tiêu chí',140);c3.metric('Ngân hàng-năm đủ chuẩn',f'{int(overall.rank_eligible.sum())}/25');c4.metric('Ô đã chấm',f'{int((detail.state=="SCORED").sum()):,}/3.500')
    a=overall[(overall.bank==bank)&(overall.year==year)]
    st.subheader(f'{bank} · {year}')
    if not a.empty and bool(a.iloc[0].rank_eligible):
        x=a.iloc[0];l,r=st.columns(2)
        l.metric('Digital Score',f'{x.digital_score:.2f}/100');r.metric('Hạng',int(x['rank']))
    else:st.info('Chưa đủ 140 tiêu chí (trừ NA có lý do) kèm nguồn để công bố Digital Score năm này.')
    p=pillars[(pillars.bank==bank)&(pillars.year==year)]
    fig=px.bar(p,x='pillar',y='coverage_pct',text='coverage_pct',range_y=[0,105],labels={'pillar':'Trụ cột','coverage_pct':'Tỷ lệ đã chấm (%)'},title='Mức độ hoàn tất điểm theo trụ cột')
    st.plotly_chart(fig,use_container_width=True)
with tabs[1]:
    st.subheader(f'Xếp hạng theo năm {year}')
    o=overall[overall.year==year].sort_values('rank',na_position='last')
    st.dataframe(o[['bank','digital_score','rank','classification','scored','unscored','na','invalid','rank_eligible']],hide_index=True,use_container_width=True)
    ranked=o[o.rank_eligible]
    if len(ranked):st.plotly_chart(px.bar(ranked,x='bank',y='digital_score',color='bank',text_auto='.1f',range_y=[0,100]),use_container_width=True)
    else:st.warning('Chưa có ngân hàng đủ điều kiện xếp hạng. Không dựng bảng điểm giả.')
with tabs[2]:
    st.subheader(f'Sáu trụ cột · {bank} / {year}')
    p=pillars[(pillars.bank==bank)&(pillars.year==year)]
    st.dataframe(p[['pillar','scored','applicable','na','unscored','invalid','coverage_pct','pillar_score']],hide_index=True,use_container_width=True)
    if p.complete.all():
        vals=p.set_index('pillar').loc[PILLARS,'pillar_score'].tolist()
        fig=go.Figure(go.Scatterpolar(r=vals+[vals[0]],theta=PILLARS+[PILLARS[0]],fill='toself'))
        fig.update_layout(polar={'radialaxis':{'range':[0,100]}},height=440)
        st.plotly_chart(fig,use_container_width=True)
    else:st.info('Radar điểm sẽ hiện khi đủ cả 6 trụ cột. Tỷ lệ hoàn tất vẫn xem được ở tab Tổng quan.')
with tabs[3]:
    st.subheader('Xu hướng Digital Score 2021–2025')
    hist=overall[overall.rank_eligible]
    if len(hist):
        fig=px.line(hist,x='year',y='digital_score',color='bank',markers=True,range_y=[0,100])
        st.plotly_chart(fig,use_container_width=True)
    else:st.info('Chưa có bộ điểm năm nào hoàn chỉnh để vẽ xu hướng.')
with tabs[4]:
    st.subheader('Chấm điểm và lưu bằng chứng')
    st.warning('Chỉ nhập điểm khi đã đối chiếu rubric và tài liệu. Lưu dữ liệu sẽ cập nhật file data/input/dbi_scores.csv. Nên sao lưu file này thường xuyên.')
    source=read_scores(); selected=source[(source.bank==bank)&(source.year==str(year))].copy()
    c=criteria_df()[['criterion_id','pillar_name','title','level1','level2','level3','level4','level5']]
    selected=selected.merge(c,on='criterion_id',how='left',validate='one_to_one')
    pillar_choice=st.selectbox('Lọc trụ cột',['Tất cả']+PILLARS,key='editor_pillar')
    if pillar_choice!='Tất cả':selected=selected[selected.pillar_name==pillar_choice]
    show=['criterion_id','pillar_name','title','score_level','evidence_quote','source_file','source_url','page','note','na_reason','reviewer']
    edited=st.data_editor(selected[show],hide_index=True,use_container_width=True,num_rows='fixed',key=f'edit_{bank}_{year}_{pillar_choice}',disabled=['criterion_id','pillar_name','title'],column_config={'score_level':st.column_config.SelectboxColumn('Mức (trống/0–5/NA)',options=['','0','1','2','3','4','5','NA'],required=False),'evidence_quote':st.column_config.TextColumn('Trích dẫn',width='large'),'source_file':st.column_config.TextColumn('Tên PDF',width='medium'),'note':st.column_config.TextColumn('Ghi chú',width='medium')})
    with st.expander('Xem đầy đủ rubric 1–5'):
        cid=st.selectbox('Tiêu chí',selected.criterion_id.tolist())
        rr=c[c.criterion_id==cid].iloc[0]
        for i in range(1,6):st.write(f'**Mức {i}:** {rr[f"level{i}"]}')
    if st.button('💾 Lưu các dòng đang hiển thị',type='primary'):
        edited=edited.fillna('').astype(str)
        updated=source.copy()
        edit_cols=['score_level','evidence_quote','source_file','source_url','page','note','na_reason','reviewer']
        for _,r in edited.iterrows():
            mask=(updated.bank==bank)&(updated.year==str(year))&(updated.criterion_id==r.criterion_id)
            for field in edit_cols:updated.loc[mask,field]=r[field]
            updated.loc[mask,'reviewed_at']=pd.Timestamp.now(tz='Asia/Ho_Chi_Minh').isoformat()
        # Validate all cells before writing; keep invalid rows flagged for correction, not score calculation
        checked=audit_scores(updated)
        save_scores(updated)
        bad=checked[(checked.bank==bank)&(checked.year==str(year))&(checked.state=='INVALID')]
        st.success(f'Đã lưu {len(edited)} tiêu chí. Có {len(bad)} ô chưa hợp lệ, sẽ không được tính điểm.');st.rerun()
    st.download_button('Tải bảng điểm đang lọc',selected[show].to_csv(index=False).encode('utf-8-sig'),file_name=f'{bank}_{year}_edit.csv',mime='text/csv')
with tabs[5]:
    render_proposal_review(bank,year)
with tabs[6]:
    st.subheader('Bằng chứng & thư viện PDF')
    a=detail[(detail.bank==bank)&(detail.year==str(year))].copy()
    st.dataframe(a[['criterion_id','title','score_level','state','issue','source_file','page','evidence_quote','source_url']],hide_index=True,use_container_width=True)
    report_dir=ROOT/'data/reports'/bank
    found=sorted(report_dir.glob('**/*.pdf')) if report_dir.exists() else []
    st.write(f'**Báo cáo đã phát hiện trong {report_dir}:** {len(found)}')
    for f in found:
        with st.expander(f.name):
            st.caption(str(f.relative_to(ROOT)))
            # Local downloadable PDF, no dependency on a web server or external URL
            if f.stat().st_size<80*1024*1024:
                st.download_button('Mở/tải tài liệu PDF',data=f.read_bytes(),file_name=f.name,mime='application/pdf',key=str(f))
            else:st.info('PDF lớn: mở file trực tiếp bằng đường dẫn bên trên.')
with tabs[7]:
    render_bank_profiles(overall=overall,year=year)
with tabs[8]:
    st.subheader('Phương pháp Digital Score')
    st.markdown('**140 tiêu chí / 6 trụ cột:** Khách hàng 25, Chiến lược 24, Công nghệ 29, Vận hành 22, Văn hóa 22, Dữ liệu 18. Mỗi trụ cột chiếm **1/6**.')
    st.table(pd.DataFrame({'Mức':['0','1','2','3','4','5','NA','Trống'],'Điểm %':['0','0','25','50','75','100','Loại mẫu số','Không tính điểm']}))
    st.latex(r'P_k=\frac{\sum_{i\in A_k} s_i}{|A_k|} \qquad DigitalScore=\frac{1}{6}\sum_{k=1}^{6}P_k')
    st.caption('A_k là tiêu chí áp dụng (trừ NA hợp lệ). Chỉ công bố điểm khi toàn bộ tiêu chí áp dụng được chấm có nguồn và mọi trụ cột có ít nhất một tiêu chí áp dụng.')
    st.info('Mức 0 = chưa đủ bằng chứng sau khi rà soát; không có nghĩa ngân hàng không triển khai. Ô trống là chưa chấm. Năm có ô chưa chấm hoặc thiếu chứng cứ không được xếp hạng.')
    st.markdown('**Phân loại:** 0–<25 Khởi động · 25–<50 Bắt đầu · 50–<75 Hình thành · 75–<100 Nâng cao · 100 Dẫn dắt.')
    st.caption('Đây là cách triển khai theo phương pháp trong ảnh bạn cung cấp, không phải phương pháp 80/20 DBI–DTI của một dự án khác.')
