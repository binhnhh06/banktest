"""Reconstructed Bank DX framework. Not a verified reproduction of original repository."""
from pathlib import Path
import json,re,unicodedata
import pandas as pd
ROOT=Path(__file__).resolve().parent
CONFIG=ROOT/'config'; INPUT=ROOT/'data/input'; OUTPUT=ROOT/'data/output'

def read(name,folder=INPUT):
    p=folder/name
    return pd.read_csv(p,dtype=str,encoding='utf-8-sig').fillna('') if p.exists() else pd.DataFrame()

def settings(): return json.loads((CONFIG/'settings.json').read_text(encoding='utf-8'))

def norm(s):
    s=unicodedata.normalize('NFKD',str(s).lower());return ''.join(c for c in s if not unicodedata.combining(c)).replace('đ','d')

def rule_suggestion(excerpt,terms):
    """Conservative lexicon heuristic, proposals only; NOT rubric-verified."""
    s=norm(excerpt)
    if len(s.strip())<50:return None,'NO_EVIDENCE','Đoạn bằng chứng quá ngắn'
    matches=[x.strip() for x in terms.split(';') if x.strip() and norm(x.strip()) in s]
    if not matches:return None,'NOT_RELEVANT','Không có cụm đặc thù phù hợp'
    if any(x in s for x in ['not implemented','not deployed','chua trien khai']):return None,'REVIEW_REQUIRED','Có dấu hiệu phủ định'
    if any(x in s for x in ['award ceremony','received an award']):return None,'REVIEW_REQUIRED','Bằng chứng có thể chỉ nói về giải thưởng'
    action=any(x in s for x in ['implemented','deployed','launched','introduced','operational','has implemented','have implemented','trien khai','van hanh'])
    quantitative=bool(re.search(r'\b\d+(?:[.,]\d+)?\s*(?:%|percent|million|billion|users|transactions)\b',s))
    if not action:return None,'REVIEW_REQUIRED','Có chủ đề nhưng chưa rõ triển khai'
    # A suggestion about evidence strength, NEVER a valid maturity score on its own.
    strength='IMPLEMENTED_WITH_METRIC' if quantitative else 'IMPLEMENTED'
    return None,'REVIEW_REQUIRED',f'Dấu hiệu {strength}; đối chiếu rubric trước khi chấm (matched: {", ".join(matches[:3])})'

def evaluate():
    cfg=settings(); criteria=read('criteria_24.csv',CONFIG); metrics=read('dti_metrics.csv',CONFIG)
    evidence=read('dbi_evidence.csv');dti=read('dti_values.csv')
    banks=list(cfg['banks']); years=cfg['years']; pillars=list(cfg['pillar_weights'])
    scored=[]
    for b in banks:
        for y in years:
            for _,c in criteria.iterrows():
                subset=evidence[(evidence.bank==b)&(evidence.year==str(y))&(evidence.criterion_id==c.criterion_id)] if len(evidence) else pd.DataFrame()
                validated=[]; hints=[]
                for _,e in subset.iterrows():
                    raw=e.get('reviewed_score','').strip()
                    if raw:
                        try:
                            score=int(raw)
                            if str(score)!=raw or not 0<=score<=4:raise ValueError()
                        except ValueError:raise ValueError(f'Điểm không hợp lệ {b} {y} {c.criterion_id}: {raw}')
                        if not str(e.get('source_file','')).strip() or not str(e.get('excerpt','')).strip():
                            raise ValueError(f'Điểm có sẵn phải kèm nguồn và đoạn chứng cứ: {b} {y} {c.criterion_id}')
                        validated.append(score)
                    else:hints.append(rule_suggestion(e.get('excerpt',''),c.keywords_en))
                if len(set(validated))>1:raise ValueError(f'Điểm đã duyệt mâu thuẫn: {b} {y} {c.criterion_id}')
                score=validated[0] if validated else None
                scored.append({'bank':b,'year':y,'pillar_id':c.pillar_id,'criterion_id':c.criterion_id,'criterion_name':c.criterion_name,'score':score,'status':'REVIEWED' if validated else ('REVIEW_REQUIRED' if len(subset) else 'NO_EVIDENCE'),'evidence_count':len(subset)})
    sc=pd.DataFrame(scored)
    # DTI: strict same-year comparability. Missing for >=2 banks => exclude metric for everyone.
    dti_rows=[]
    for y in years:
        for _,m in metrics.iterrows():
            subset=dti[(dti.year==str(y))&(dti.metric_id==m.metric_id)] if len(dti) else pd.DataFrame()
            bybank={}
            for b in banks:
                values=subset.loc[subset.bank==b,'value'].tolist() if len(subset) else []
                try: val=float(values[-1]) if values and values[-1]!='' else None
                except ValueError:raise ValueError(f'DTI không phải số: {b} {y} {m.metric_id}')
                bybank[b]=val
            excluded=sum(v is None for v in bybank.values())>=cfg['missing_dti_bank_threshold']
            lo,hi=float(m.lower_bound),float(m.upper_bound)
            if hi<=lo:raise ValueError(f'Cận DTI không hợp lệ: {m.metric_id}')
            for b,val in bybank.items():
                normalized=None
                if val is not None and not excluded:
                    t=min(1,max(0,(val-lo)/(hi-lo)))
                    normalized=100*(t if m.direction=='high' else 1-t)
                dti_rows.append({'bank':b,'year':y,'pillar_id':m.pillar_id,'metric_id':m.metric_id,'raw_value':val,'dti_score':normalized,'excluded_for_year':excluded})
    dt=pd.DataFrame(dti_rows)
    pillar_rows=[]
    for (b,y,p),part in sc.groupby(['bank','year','pillar_id'],sort=False):
        vals=part['score'].dropna()
        dbi=100*vals.mean()/4 if len(vals) else None
        dsub=dt[(dt.bank==b)&(dt.year==y)&(dt.pillar_id==p)]
        dvalid=dsub['dti_score'].dropna()
        dti_score=dvalid.mean() if len(dvalid) else None
        pillar_rows.append({'bank':b,'year':y,'pillar_id':p,'dbi_score':dbi,'dti_score':dti_score,'combined_pillar':(cfg['dbi_share']*dbi+cfg['dti_share']*dti_score if dbi is not None and dti_score is not None else dbi), 'valid_dbi':len(vals),'total_dbi':len(part),'coverage':len(vals)/len(part),'dti_used':dti_score is not None})
    pil=pd.DataFrame(pillar_rows)
    # 0b year/pillar: if any bank missing DTI, turn off DTI for ALL banks in pillar/year.
    for (y,p),ix in pil.groupby(['year','pillar_id']).groups.items():
        if not pil.loc[ix,'dti_used'].all():
            pil.loc[ix,'dti_used']=False
            pil.loc[ix,'combined_pillar']=pil.loc[ix,'dbi_score']
    totals=[]
    for (b,y),sub in pil.groupby(['bank','year'],sort=False):
        weights=sub.pillar_id.map(cfg['pillar_weights']).astype(float)
        valid=sub.combined_pillar.notna()
        all_coverage=float((sub.coverage*weights).sum()/weights.sum())
        total=float((sub.loc[valid,'combined_pillar']*weights[valid]).sum()/weights[valid].sum()) if valid.any() else None
        comparable=all_coverage>=cfg['minimum_coverage_for_ranking'] and valid.all()
        totals.append({'bank':b,'year':y,'dbi_total':total,'coverage':all_coverage,'rank_eligible':bool(comparable)})
    overall=pd.DataFrame(totals)
    overall['rank']=overall.assign(rank_value=overall['dbi_total'].where(overall['rank_eligible'])).groupby('year')['rank_value'].rank(method='min',ascending=False)
    OUTPUT.mkdir(parents=True,exist_ok=True)
    for name,df in [('criteria_results',sc),('dti_results',dt),('pillar_scores',pil),('overall_scores',overall)]:df.to_csv(OUTPUT/f'{name}.csv',index=False,encoding='utf-8-sig')
    return sc,dt,pil,overall

if __name__=='__main__':
    *_,overall=evaluate()
    print('Đã xuất các file CSV vào data/output. Ngân hàng chưa đủ coverage sẽ không được xếp hạng.')
    print(overall[['bank','year','dbi_total','coverage','rank']].head(10).to_string(index=False))
