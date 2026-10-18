"""DBI offline evidence screening v2. No AI; no invented maturity levels.

Usage:
 python auto_propose_v2.py --bank TPB --year 2022
 python auto_propose_v2.py --all
 python auto_propose_v2.py --bank TPB --year 2022 --publish

By default writes auto_proposals_v2.csv; --publish backs up then updates
Dashboard-compatible auto_proposals.csv. Never updates adjudicated scores.
"""
from __future__ import annotations
import argparse
import csv
import re
import shutil
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPORTS = ROOT / 'data/reports'
CRITERIA = ROOT / 'config/criteria.csv'
OUT_DIR = ROOT / 'data/output'
BANKS = ['TCB', 'HDB', 'TPB', 'VPB', 'BID']
YEARS = range(2021, 2026)
VERSION = 'offline-rule-v2-auditable'

# Phrase lists are matched as phrases, not independent generic words.
CONCEPTS = {
    'ca nhan hoa': ['personalized', 'personalization', 'tailored to', 'ca nhan hoa'],
    'tiep thi muc tieu': ['targeted marketing', 'targeted campaign', 'segmented marketing', 'tiep thi muc tieu'],
    'tu tuy chinh': ['customers can customize', 'users can customize', 'self customization', 'customer configurable', 'tu tuy chinh'],
    'de su dung': ['ease of use', 'user friendly', 'usability', 'de su dung'],
    'tuong tac so': ['digital engagement', 'online interaction', 'tuong tac so'],
    'cham soc': ['customer care', 'customer support', 'cham soc khach hang'],
    'trung thanh': ['customer loyalty', 'loyalty program', 'retention rate'],
    'trai nghiem': ['customer experience', 'customer journey', 'trai nghiem'],
    'ngan sach': ['investment budget', 'budget allocation', 'ngan sach'],
    'san pham': ['product portfolio', 'new banking products', 'danh muc san pham'],
    'dang ky': ['digital onboarding', 'online registration', 'account opening', 'ekyc'],
    'da kenh': ['omnichannel', 'multichannel integration', 'da kenh'],
    'do luong': ['customer satisfaction survey', 'measurement', 'kpi', 'do luong'],
    'hanh trinh': ['customer journey', 'journey mapping', 'hanh trinh'],
    'quyen rieng tu': ['data privacy', 'personal data protection', 'quyen rieng tu'],
    'phan anh': ['customer complaints', 'complaint resolution', 'feedback management'],
    'chien luoc': ['digital strategy', 'transformation roadmap', 'chien luoc'],
    'tam nhin': ['digital vision', 'strategic vision', 'tam nhin'],
    'quan tri': ['corporate governance', 'digital governance', 'quan tri'],
    'he sinh thai': ['digital ecosystem', 'ecosystem partner', 'he sinh thai'],
    'doi tac': ['strategic partnership', 'ecosystem partner', 'doi tac'],
    'ha tang': ['cloud infrastructure', 'data center', 'it infrastructure'],
    'dam may': ['cloud computing', 'cloud migration', 'dien toan dam may'],
    'tu dong hoa': ['process automation', 'robotic process automation', 'rpa', 'tu dong hoa'],
    'bao mat': ['cybersecurity', 'information security', 'bao mat'],
    'rui ro': ['risk management', 'risk assessment', 'quan tri rui ro'],
    'thanh toan': ['digital payment', 'online payment', 'qr payment', 'thanh toan'],
    'van hanh': ['operational efficiency', 'business process automation', 'van hanh'],
    'nhan su': ['employee development', 'human resources', 'nhan su'],
    'dao tao': ['employee training', 'digital skills training', 'dao tao'],
    'van hoa': ['digital culture', 'organizational culture', 'van hoa'],
    'doi moi': ['digital innovation', 'innovation program', 'doi moi'],
    'tri tue nhan tao': ['artificial intelligence', 'machine learning', 'ai platform'],
    'du lieu': ['data analytics', 'data governance', 'customer data', 'du lieu'],
    'so hoa': ['digitization', 'digital transformation', 'so hoa'],
    'di dong': ['mobile banking', 'mobile application', 'ngan hang di dong'],
}
ACTION = ('implemented', 'deployed', 'launched', 'introduced', 'has developed',
          'have developed', 'integrated', 'rolled out', 'in operation',
          'provided', 'is available', 'trien khai', 'da ap dung', 'van hanh')
PLAN = ('plans to', 'will deploy', 'will launch', 'expected to', 'intend to',
        'du kien', 'se trien khai')
NEGATION = ('not implemented', 'not deployed', 'not yet launched', 'chua trien khai')
NOISE = ('award ceremony', 'received an award', 'won the award', 'best bank award')
MEASURES = re.compile(r'\b\d+(?:[.,]\d+)?\s*(?:%|percent|million|billion|trieu|ty|users|transactions)\b', re.I)
OUTPUT_FIELDS = ['bank','year','criterion_id','pillar_name','title','proposed_level',
                 'decision','relevance','evidence_quote','source_file','page',
                 'matching_terms','reason','reviewed','algorithm']


def normalize(s):
    s = unicodedata.normalize('NFD', str(s or '').casefold())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').replace('đ','d')
    return re.sub(r'\s+', ' ', s).strip()


def has(s, phrase):
    return bool(re.search(r'(?<!\w)' + re.escape(normalize(phrase)) + r'(?!\w)', s))


def any_phrase(s, phrases):
    return any(has(s, x) for x in phrases)


def read_csv(path):
    if not path.exists():
        return []
    with path.open(encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def atomic_csv(path, rows, fields):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix('.tmp')
    with temp.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        w.writeheader()
        w.writerows(rows)
    temp.replace(path)


def year_in_name(path):
    for year in YEARS:
        if re.search(r'(?<!\d)(?:' + str(year) + '|' + str(year)[2:] + r')(?!\d)',path.stem):
            return year
    return None


def list_reports(bank, year):
    root = REPORTS / bank
    if not root.exists():
        return []
    chosen = {}
    for p in sorted(root.rglob('*')):
        if p.suffix.lower() != '.pdf' or year_in_name(p) != year:
            continue
        key = re.sub(r'(?i)[_-]?ocr$', '',p.stem).casefold()
        if key not in chosen or ('ocr' in p.stem.lower() and 'ocr' not in chosen[key].stem.lower()):
            chosen[key] = p
    return list(chosen.values())


def read_chunks(files):
    try:
        import pymupdf
    except ImportError as exc:
        raise SystemExit('Run: pip install pymupdf') from exc
    chunks = []
    for pdf in files:
        try:
            with pymupdf.open(pdf) as doc:
                for i, page in enumerate(doc):
                    try:
                        txt = re.sub(r'\s+', ' ', page.get_text('text', sort=True)).strip()
                    except Exception as e:
                        print('WARN page', pdf.name, i+1, str(e)[:100]); continue
                    if len(txt) < 80:
                        continue
                    for start in range(0, len(txt), 850):
                        part = txt[max(0,start-140):min(len(txt),start+1000)]
                        if len(part) >= 80:
                            chunks.append({'text':part, 'norm':normalize(part),
                                           'page':i+1, 'source_file':str(pdf.relative_to(ROOT))})
        except Exception as e:
            print('WARN PDF', pdf.name, str(e)[:140])
    return chunks


def terms_for(c):
    title = normalize(c.get('title'))
    desc = normalize(c.get('description'))
    # The longest matching concept is more specific than generic substrings.
    title_keys = [key for key in CONCEPTS if has(title,key)]
    if not title_keys:
        title_keys = [key for key in CONCEPTS if has(desc,key)]
    if not title_keys:
        return []
    keys = sorted(title_keys, key=len, reverse=True)
    specific = [k for k in keys if not any(k != other and k in other for other in keys)]
    phrases=[]
    for k in specific[:2]:
        phrases.extend(CONCEPTS[k])
    return list(dict.fromkeys(phrases))


def rank_evidence(c, chunks):
    phrases = terms_for(c)
    if not phrases:
        return []
    ranked=[]
    for ch in chunks:
        matches=[p for p in phrases if has(ch['norm'],p)]
        if not matches:
            continue
        action=any_phrase(ch['norm'],ACTION)
        plan=any_phrase(ch['norm'],PLAN)
        negative=any_phrase(ch['norm'],NEGATION)
        noisy=any_phrase(ch['norm'],NOISE)
        # Count distinctive exact phrases, not word overlap.
        strength=min(1.0, max(len(normalize(p).split()) for p in matches)/3)
        rel=round(min(1., .49 + .21*strength + .07*min(len(matches),3)
                          + .09*action - .20*noisy - .20*negative),3)
        ranked.append({**ch,'matching_terms':'; '.join(matches), 'relevance':rel,
                       'action':action,'plan':plan,'negative':negative,'noise':noisy,
                       'quant':bool(MEASURES.search(ch['text']))})
    ranked.sort(key=lambda e:(-e['relevance'],e['source_file'],e['page']))
    unique=[]; seen=set()
    for r in ranked:
        key=(r['source_file'],r['page'],r['norm'][:170])
        if key not in seen:
            unique.append(r); seen.add(key)
        if len(unique)>=3: break
    return unique


def grade(c, ranked):
    if not ranked:
        return '', 'REVIEW_REQUIRED', 'Không có bằng chứng khớp cụm đặc thù; cần kiểm tra thủ công.'
    cid = c['criterion_id']
    # Level 1 in some rubrics explicitly means little/no implementation.
    # Absence of evidence can never establish it. For other criteria, do not
    # infer 2+ from topical mentions or generic statistics.
    for e in ranked:
        s=e['norm']
        if e['negative'] or e['plan'] or e['noise'] or not e['action']:
            continue
        if cid=='1.1.1':
            if (any_phrase(s,('personalized','personalization','tailored to')) and
                any_phrase(s,('customer data','customer information','customer profile',
                              'customer preferences','customer insights'))):
                return '2','RULE_PROPOSED','Có cá nhân hóa kèm dấu hiệu sử dụng thông tin khách hàng; phải xác minh phạm vi theo level2.'
        elif cid=='1.1.2':
            if (any_phrase(s,('targeted marketing','targeted campaign','segmented marketing')) and
                any_phrase(s,('customers','customer segment','target audience'))):
                return '1','RULE_PROPOSED','Có bằng chứng một phần nội dung tiếp thị nhắm mục tiêu; kiểm tra rubric level1.'
        elif cid=='1.1.3':
            if any_phrase(s,('customers can customize','users can customize',
                             'self customization','customer configurable')):
                return '2','RULE_PROPOSED','Có bằng chứng khách hàng tự tùy chỉnh; xác minh công cụ và phạm vi theo level2.'
    return '', 'REVIEW_REQUIRED', 'Có đoạn đúng chủ đề nhưng chưa đủ điều kiện để gán mức 1–5 theo rubric.'


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--bank',choices=BANKS)
    ap.add_argument('--year',type=int,choices=list(YEARS))
    ap.add_argument('--all',action='store_true')
    ap.add_argument('--publish',action='store_true',help='Backup and replace Dashboard auto_proposals.csv')
    args=ap.parse_args()
    criteria=read_csv(CRITERIA)
    if len(criteria)!=140 or len({c['criterion_id'] for c in criteria})!=140:
        raise SystemExit('config/criteria.csv must contain 140 unique criteria')
    banks=BANKS if args.all or not args.bank else [args.bank]
    years=list(YEARS) if args.all or not args.year else [args.year]
    destination=OUT_DIR / ('auto_proposals.csv' if args.publish else 'auto_proposals_v2.csv')
    old=read_csv(destination)
    selected={(b,str(y)) for b in banks for y in years}
    preserved=[r for r in old if (r.get('bank'),str(r.get('year'))) not in selected]
    new=[]; top3=[]
    for bank in banks:
        for year in years:
            files=list_reports(bank,year)
            if not files:
                print(f'{bank} {year}: NO_REPORT; previous entries retained')
                preserved.extend(r for r in old if r.get('bank')==bank and str(r.get('year'))==str(year))
                continue
            chunks=read_chunks(files)
            print(f'{bank} {year}: PDFs={len(files)} chunks={len(chunks)}')
            for c in criteria:
                ranked=rank_evidence(c,chunks)
                level,decision,reason=grade(c,ranked)
                best=ranked[0] if ranked else None
                if not chunks:
                    level='';decision='NO_EXTRACTABLE_TEXT';reason='Không trích xuất được văn bản từ PDF.'
                new.append({'bank':bank,'year':str(year),'criterion_id':c['criterion_id'],
                    'pillar_name':c['pillar_name'],'title':c['title'],
                    'proposed_level':level,'decision':decision,
                    'relevance':best['relevance'] if best else 0,
                    'evidence_quote':best['text'][:950] if best else '',
                    'source_file':best['source_file'] if best else '',
                    'page':best['page'] if best else '',
                    'matching_terms':best['matching_terms'] if best else '',
                    'reason':reason,'reviewed':'NO','algorithm':VERSION})
                for rank,e in enumerate(ranked,1):
                    top3.append({'bank':bank,'year':year,'criterion_id':c['criterion_id'],
                                 'rank':rank,'relevance':e['relevance'],
                                 'source_file':e['source_file'],'page':e['page'],
                                 'matching_terms':e['matching_terms'], 'excerpt':e['text'][:1300]})
            sub=[r for r in new if r['bank']==bank and r['year']==str(year)]
            print(' ',dict(Counter(r['decision'] for r in sub)))
    if not new:
        print('No new results.');return
    if args.publish and destination.exists():
        backup=destination.with_name('auto_proposals_backup_'+datetime.now().strftime('%Y%m%d_%H%M%S')+'.csv')
        shutil.copy2(destination,backup)
        print('Backup:',backup)
    atomic_csv(destination, preserved+new, OUTPUT_FIELDS)
    evidence_dest=OUT_DIR/'evidence_top3_v2.csv'
    # Partial runs preserve other bank-years in Top3 too.
    top_old=read_csv(evidence_dest)
    top_preserved=[r for r in top_old if (r.get('bank'),str(r.get('year'))) not in selected]
    atomic_csv(evidence_dest,top_preserved+top3,
        ['bank','year','criterion_id','rank','relevance','source_file','page','matching_terms','excerpt'])
    print('Saved:',destination,'rows:',len(preserved+new))
    print('Top3:',evidence_dest)
    print('IMPORTANT: RULE_PROPOSED = unverified proposal; never auto-approve into DBI.')

if __name__=='__main__':
    main()
