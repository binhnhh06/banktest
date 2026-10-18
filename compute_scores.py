"""Audit-first annual DBI calculation. Never imputes blanks, NA excludes denominator."""
from pathlib import Path
from datetime import datetime
import csv, re, json
import pandas as pd

ROOT=Path(__file__).resolve().parent
CRITERIA=ROOT/'config/criteria.csv'
SCORES=ROOT/'data/input/dbi_scores.csv'
OUT=ROOT/'data/output'
BANKS=['TCB','HDB','TPB','VPB','BID']
YEARS=list(range(2021,2026))
PILLARS=['Khách hàng','Chiến lược','Công nghệ','Vận hành','Văn hóa','Dữ liệu']
LEVEL_MAP={0:0.0,1:0.0,2:25.0,3:50.0,4:75.0,5:100.0}
FIELDS=['bank','year','criterion_id','score_level','evidence_quote','source_file','source_url','page','note','na_reason','reviewer','reviewed_at']


def criteria_df():
    d=pd.read_csv(CRITERIA,dtype=str,keep_default_na=False,encoding='utf-8-sig')
    if len(d)!=140 or d.criterion_id.nunique()!=140:raise ValueError('Yêu cầu đúng 140 criterion_id duy nhất.')
    return d


def starter_rows():
    c=criteria_df()
    return [{**{'bank':b,'year':str(y),'criterion_id':str(cid)},**{k:'' for k in FIELDS[3:]}}
            for b in BANKS for y in YEARS for cid in c.criterion_id]


def ensure_input():
    SCORES.parent.mkdir(parents=True,exist_ok=True)
    if not SCORES.exists():
        save_scores(pd.DataFrame(starter_rows(),columns=FIELDS))


def save_scores(df):
    SCORES.parent.mkdir(parents=True,exist_ok=True)
    cleaned=df.reindex(columns=FIELDS).fillna('').astype(str)
    tmp=SCORES.with_suffix('.tmp')
    cleaned.to_csv(tmp,index=False,encoding='utf-8-sig')
    tmp.replace(SCORES)


def read_scores():
    ensure_input()
    d=pd.read_csv(SCORES,dtype=str,keep_default_na=False,encoding='utf-8-sig')
    if not set(FIELDS).issubset(d.columns):raise ValueError('dbi_scores.csv thiếu cột: '+','.join(set(FIELDS)-set(d.columns)))
    return d[FIELDS].copy()


def audit_scores(df):
    c=criteria_df()
    pairs=set(zip(df.bank,df.year,df.criterion_id))
    if len(pairs)!=len(df):raise ValueError('Trùng khóa bank/year/criterion_id; không lưu để tránh mất dữ liệu.')
    invalid=df[(~df.bank.isin(BANKS))|(~df.year.isin(list(map(str,YEARS))))|(~df.criterion_id.isin(c.criterion_id))]
    if not invalid.empty:raise ValueError(f'{len(invalid)} dòng không có ngân hàng/năm/tiêu chí hợp lệ.')
    states=[]; conversions=[]; issues=[]
    for r in df.itertuples(index=False):
        raw=str(r.score_level).strip().upper()
        has_source=bool(str(r.source_file).strip() or str(r.source_url).strip())
        has_quote=bool(str(r.evidence_quote).strip())
        state='UNSCORED'; val=float('nan'); issue=''
        if not raw:pass
        elif raw=='NA':
            if str(r.na_reason).strip():state='NA'
            else:state='INVALID';issue='NA thiếu lý do'
        elif raw in ['0','1','2','3','4','5']:
            if has_source and (has_quote or (raw=='0' and str(r.note).strip())):
                state='SCORED';val=LEVEL_MAP[int(raw)]
            else:state='INVALID';issue='Mức 1–5 cần nguồn và trích dẫn; mức 0 cần nguồn và trích dẫn hoặc ghi chú rà soát'
        else:state='INVALID';issue='Điểm không thuộc 0,1,2,3,4,5,NA hoặc trống'
        states.append(state);conversions.append(val);issues.append(issue)
    d=df.copy();d['state']=states;d['score_pct']=conversions;d['issue']=issues
    return d


def classify(score):
    if pd.isna(score):return ''
    if score==100:return 'Dẫn dắt'
    if score>=75:return 'Nâng cao'
    if score>=50:return 'Hình thành'
    if score>=25:return 'Bắt đầu'
    return 'Khởi động'


def calculate():
    raw=read_scores()
    d=audit_scores(raw)
    c=criteria_df()[['criterion_id','pillar_name','group_id','title']]
    d=d.merge(c,on='criterion_id',how='left',validate='many_to_one')
    results=[]; pillars=[]
    for b in BANKS:
        for y in YEARS:
            block=d[(d.bank==b)&(d.year==str(y))]
            annual=[]
            for p in PILLARS:
                s=block[block.pillar_name==p]
                n_total=len(s);n_na=int((s.state=='NA').sum());n_scored=int((s.state=='SCORED').sum())
                n_bad=int((s.state=='INVALID').sum());n_blank=int((s.state=='UNSCORED').sum())
                applicable=n_total-n_na
                complete=bool(applicable>0 and n_scored==applicable and n_bad==0 and n_blank==0)
                # Don't expose partial means as official pillars
                score=float(s.loc[s.state=='SCORED','score_pct'].mean()) if complete else float('nan')
                annual.append(complete)
                pillars.append({'bank':b,'year':y,'pillar':p,'total':n_total,'applicable':applicable,
                                'scored':n_scored,'na':n_na,'unscored':n_blank,'invalid':n_bad,
                                'coverage_pct':round(100*n_scored/applicable,2) if applicable else 0.0,
                                'complete':complete,'pillar_score':score})
            qualified=all(annual) and len(block)==140
            ps=[z['pillar_score'] for z in pillars[-6:]]
            score=sum(ps)/6 if qualified else float('nan')
            results.append({'bank':b,'year':y,'rank_eligible':qualified,'digital_score':score,
                            'dbi_total':score,'classification':classify(score),
                            'scored':int((block.state=='SCORED').sum()),
                            'unscored':int((block.state=='UNSCORED').sum()),
                            'na':int((block.state=='NA').sum()),
                            'invalid':int((block.state=='INVALID').sum()),
                            'total':len(block)})
    overall=pd.DataFrame(results)
    overall['rank']=overall.groupby('year')['digital_score'].rank(method='min',ascending=False)
    return d,pd.DataFrame(pillars),overall


def export():
    d,p,o=calculate();OUT.mkdir(parents=True,exist_ok=True)
    d.to_csv(OUT/'criterion_audit.csv',index=False,encoding='utf-8-sig')
    p.to_csv(OUT/'pillar_scores.csv',index=False,encoding='utf-8-sig')
    o.to_csv(OUT/'digital_scores.csv',index=False,encoding='utf-8-sig')
    return d,p,o


if __name__=='__main__':
    d,p,o=export();print('Đã tạo 3500 ô điểm và tính kết quả:',OUT)
    print('Các ngân hàng-năm đủ điều kiện xếp hạng:',int(o.rank_eligible.sum()),'/25')
    print('Trạng thái:',d.state.value_counts().to_dict())
