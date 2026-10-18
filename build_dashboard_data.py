"""Build Stitch dashboard data from DBI Gemini v3 CSV (read-only)."""
from pathlib import Path
import csv, json, re
from datetime import datetime
ROOT=Path(__file__).resolve().parent
CRITERIA=next((p for p in [ROOT/'config'/'criteria.csv',ROOT/'criteria.csv'] if p.exists()),None)
SOURCE=ROOT/'data'/'output'/'gemini_proposals_v3.csv'
OUT=ROOT/'dashboard'/'data.js'
BANKS=[('TCB','Techcombank','Ngân hàng TMCP Kỹ thương Việt Nam'),('HDB','HDBank','Ngân hàng TMCP Phát triển TP.HCM'),('TPB','TPBank','Ngân hàng TMCP Tiên Phong'),('VPB','VPBank','Ngân hàng TMCP Việt Nam Thịnh Vượng'),('BID','BIDV','Ngân hàng TMCP Đầu tư và Phát triển Việt Nam')]
YEARS=list(range(2021,2026))
def read(p):
 with p.open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))
def trim(s,n=800):
 s=re.sub(r'\s+',' ',str(s or '')).strip();return s[:n]
def main():
 if CRITERIA is None:raise SystemExit('Thieu config/criteria.csv hoac criteria.csv (140 tieu chi).')
 if not SOURCE.exists():raise SystemExit('Thieu data/output/gemini_proposals_v3.csv. Copy CSV tu du an goc.')
 cr=read(CRITERIA)
 if len(cr)!=140:raise SystemExit(f'criteria.csv phai co 140 tieu chi, hien co {len(cr)}')
 pillars=[]; criteria={}
 for r in cr:
  cid=r['criterion_id'].strip();p=(r.get('pillar_id') or cid.split('.')[0]).strip()
  if not any(x['id']==p for x in pillars): pillars.append({'id':p,'name':r.get('pillar_name') or p,'n':0})
  next(x for x in pillars if x['id']==p)['n']+=1
  criteria[cid]={'p':p,'g':r.get('group_id',''),'t':trim(r.get('title'),160),'d':trim(r.get('description'),420),'l':[trim(r.get(f'level{i}'),420) for i in range(1,6)]}
 src=read(SOURCE)
 dedup={}
 for r in src:
  b=(r.get('bank') or '').strip().upper(); y=str(r.get('year') or '').strip(); c=(r.get('criterion_id') or '').strip()
  if b not in [x[0] for x in BANKS] or y not in [str(z) for z in YEARS] or c not in criteria:continue
  dedup[(b,y,c)]=r
 rows=[];models=set();statuses={}
 for (b,y,c),r in sorted(dedup.items()):
  s=(r.get('decision') or 'OTHER').strip().upper()
  if s not in ('AI_PROPOSED','AI_NEEDS_REVIEW','INSUFFICIENT_EVIDENCE','NO_RETRIEVED_EVIDENCE','ERROR'):s='OTHER'
  try:
   raw=float(r.get('proposed_level') or '')
   level=int(raw) if raw.is_integer() and 1<=raw<=5 else None
  except (ValueError,TypeError):level=None
  if s not in ('AI_PROPOSED','AI_NEEDS_REVIEW'):level=None
  if level is None and s in ('AI_PROPOSED','AI_NEEDS_REVIEW'):s='OTHER'
  statuses[s]=statuses.get(s,0)+1
  if r.get('model'):models.add(r['model'])
  quote=trim(r.get('evidence_quote'),1100)
  rec={'b':b,'y':int(y),'c':c,'s':s,'l':level,'cf':trim(r.get('confidence'),30).upper(),
       'pg':trim(r.get('page'),100),'r':trim(r.get('reason'),600),'q':[quote] if quote else [],
       'n':len([p for p in (r.get('page') or '').split(';') if p.strip()]),
       'src':trim(r.get('source_file'),400),'verify':r.get('verification','')}
  rows.append(rec)
 payload={'meta':{'generated_at':datetime.now().strftime('%Y-%m-%d %H:%M'),'models':sorted(models),
   'versions':['gemini-v3'],'n_criteria':len(criteria),'min_common':8,'agreement':None,'source':'Gemini v3 AI suggestions (not human-validated)',
   'statuses':statuses},'banks':[{'code':b,'name':n,'full':f} for b,n,f in BANKS], 'years':YEARS,
   'years_with_data':YEARS,'files':[[b,y] for b,_,_ in BANKS for y in YEARS], 'pillars':pillars,'criteria':criteria,'rows':rows}
 OUT.parent.mkdir(parents=True,exist_ok=True)
 tmp=OUT.with_suffix('.tmp');tmp.write_text('window.DBI = '+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8');tmp.replace(OUT)
 print('OK:',OUT,'records:',len(rows),'AI scores:',sum(r['s']=='AI_PROPOSED' for r in rows),'statuses:',statuses)
 print('Source untouched:',SOURCE)
if __name__=='__main__':main()
