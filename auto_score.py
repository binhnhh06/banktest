"""Offline rule-based screening for evidence. DOES NOT assign official maturity scores."""
import csv
from engine import read, CONFIG, INPUT, OUTPUT, rule_suggestion

def main():
    criteria={r['criterion_id']:r for _,r in read('criteria_24.csv',CONFIG).iterrows()}
    evidence=read('dbi_evidence.csv',INPUT); rows=[]
    for _,e in evidence.iterrows():
        c=criteria.get(e.get('criterion_id',''))
        if c is None:continue
        level,status,reason=rule_suggestion(e.get('excerpt',''),c['keywords_en'])
        rows.append({'bank':e.get('bank',''),'year':e.get('year',''),'criterion_id':e.get('criterion_id',''),'status':status,'rule_suggested_level':level,'reason':reason,'page':e.get('page',''),'source_file':e.get('source_file',''),'excerpt':e.get('excerpt','')})
    OUTPUT.mkdir(parents=True,exist_ok=True)
    path=OUTPUT/'auto_evidence_review.csv'
    with path.open('w',newline='',encoding='utf-8-sig') as f:
        cols=['bank','year','criterion_id','status','rule_suggested_level','reason','page','source_file','excerpt'];w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(rows)
    print(f'{len(rows)} bằng chứng đã sàng lọc -> {path}')
if __name__=='__main__':main()
