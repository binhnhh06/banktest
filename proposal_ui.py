"""Streamlit UI for reviewing offline automated suggestions before promoting to scored data."""
from pathlib import Path
import pandas as pd
import streamlit as st
from compute_scores import ROOT, read_scores, save_scores, criteria_df, audit_scores

PROPOSALS=ROOT/'data/output/auto_proposals.csv'
VALID={'0','1','2','3','4','5','NA'}


def render_proposal_review(bank, year):
    st.subheader('⚡ Chấm nhanh từ PDF — đề xuất chưa xác minh')
    st.caption('Rule-based chỉ đưa ra mức gợi ý. Bạn phải kiểm tra bằng chứng, mô tả rubric và năm báo cáo trước khi duyệt.')
    st.code(f'python auto_propose.py --bank {bank} --year {year}',language='powershell')
    if not PROPOSALS.exists():
        st.info('Chưa có file auto_proposals.csv. Chạy lệnh trên trong terminal, rồi tải lại trang.')
        return
    df=pd.read_csv(PROPOSALS,encoding='utf-8-sig',dtype=str,keep_default_na=False)
    df=df[(df.bank==bank)&(df.year==str(year))].copy()
    if df.empty:
        st.info('Chưa có gợi ý cho bộ ngân hàng–năm này.')
        return
    counts=df.decision.value_counts().to_dict()
    a,b,c=st.columns(3)
    a.metric('Ứng viên',len(df))
    b.metric('Có mức đề xuất',counts.get('RULE_PROPOSED',0))
    c.metric('Cần xem xét',len(df)-counts.get('RULE_PROPOSED',0))
    only=st.checkbox('Chỉ hiện gợi ý có mức',value=True,key='proposals_only')
    if only: df=df[df.proposed_level!=''].copy()
    criteria=criteria_df().set_index('criterion_id')
    with st.expander('Nguyên tắc kiểm tra trước khi duyệt'):
        st.markdown('**Không được suy ra mức đạt từ từ khóa đơn lẻ.** Kiểm tra đúng nội dung mức đề xuất, tính thời điểm, đơn vị triển khai và trang PDF. Điểm 0 chỉ nhập sau rà soát có nguồn; NA phải có lý do. Dòng được đề xuất không tự trở thành điểm chính thức.')
    if df.empty:
        st.warning('Chưa có mức đề xuất để duyệt. Vẫn có thể xem file CSV xuất ra để rà soát.');return
    df['approve']=False
    df['review_level']=df['proposed_level']
    editable=df[['approve','criterion_id','title','review_level','decision','source_file','page','evidence_quote','reason']].copy()
    edited=st.data_editor(editable,hide_index=True,use_container_width=True,key=f'auto_editor_{bank}_{year}',
        disabled=['criterion_id','title','decision','source_file','page','evidence_quote','reason'],
        column_config={'approve':st.column_config.CheckboxColumn('Đã đối chiếu rubric',default=False),
                       'review_level':st.column_config.SelectboxColumn('Mức sau kiểm tra',options=['','0','1','2','3','4','5','NA'])})
    selected=edited[edited.approve].copy()
    st.write('Đã chọn duyệt:',len(selected))
    reviewer=st.text_input('Người kiểm tra (bắt buộc)',key='reviewer_auto')
    confirm=st.checkbox('Tôi đã tự đối chiếu các dòng được duyệt với rubric và tài liệu PDF.',value=False)
    if st.button('💾 Lưu các dòng đã kiểm tra vào bảng điểm',type='primary',disabled=not bool(reviewer.strip()) or not confirm or selected.empty):
        scores=read_scores()
        count=0;errors=[]
        for _,r in selected.iterrows():
            level=str(r.review_level).strip().upper()
            if level not in VALID or level=='NA':
                errors.append(f'{r.criterion_id}: mức không hợp lệ hoặc NA cần lý do riêng')
                continue
            source=df[df.criterion_id==r.criterion_id].iloc[0]
            if not source.source_file or not source.evidence_quote or not source.page:
                errors.append(f'{r.criterion_id}: thiếu nguồn/trang/trích dẫn')
                continue
            mask=(scores.bank==bank)&(scores.year==str(year))&(scores.criterion_id==r.criterion_id)
            if int(mask.sum())!=1:
                errors.append(f'{r.criterion_id}: khóa dữ liệu không duy nhất');continue
            current=scores.loc[mask,'score_level'].iloc[0]
            if str(current).strip():
                errors.append(f'{r.criterion_id}: đã có mức, không ghi đè');continue
            scores.loc[mask,'score_level']=level
            scores.loc[mask,'evidence_quote']=source.evidence_quote
            scores.loc[mask,'source_file']=source.source_file
            scores.loc[mask,'page']=str(source.page)
            scores.loc[mask,'note']='Kiểm tra đề xuất Rule-based offline; '+source.reason
            scores.loc[mask,'reviewer']=reviewer
            scores.loc[mask,'reviewed_at']=pd.Timestamp.now(tz='Asia/Ho_Chi_Minh').isoformat()
            count+=1
        checked=audit_scores(scores)
        if (checked.state=='INVALID').any():
            errors.append('Có bản ghi không hợp lệ; xem lại trong bảng điểm')
        # Existing invalid rows are left unchanged; data itself preserved.
        if count:save_scores(scores)
        if errors:st.warning('Một số dòng chưa được cập nhật: '+'; '.join(errors[:12]))
        if count:st.success(f'Đã lưu {count} mức được duyệt.');st.rerun()
    with st.expander('Xem rubric của từng tiêu chí'):
        cid=st.selectbox('Tiêu chí',df.criterion_id.tolist(),key='rubric_auto')
        if cid in criteria.index:
            row=criteria.loc[cid]
            for i in range(1,6):st.markdown(f'**Mức {i}:** {row[f"level{i}"]}')
