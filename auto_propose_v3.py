"""DBI offline rubric-aware evidence screening v3. No AI; all levels are provisional and require verification.

Usage:
 python auto_propose.py --bank TPB --year 2022
 python auto_propose.py --all
 python auto_propose.py --bank TPB --year 2022 --publish

By default writes auto_proposals_v3.csv; --publish backs up then updates
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
VERSION = 'offline-rubric-v3-candidate'

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


# Scope phrases are evaluated on evidence, never inferred from the rubric itself.
# ``enterprise`` and ``ecosystem`` need direct evidence; a generic mention of a
# partnership must not establish level 5.
SCOPE_SIGNALS = {
    'some': ('mot so', 'tai mot so', 'some', 'several', 'pilot', 'piloted', 'thi diem'),
    'most': ('hau het', 'phan lon', 'most', 'majority', 'majority of'),
    'all': ('tat ca', 'toan bo', 'toan dien', 'across the bank', 'bank-wide',
            'enterprise-wide', 'throughout the bank', 'all branches'),
    'ecosystem': ('doi tac trong he sinh thai', 'cac doi tac trong he sinh thai',
                  'ecosystem partners', 'partners across the ecosystem'),
}
RUBRIC_STOP = set('co cac trong cua duoc va voi cho theo mot so nhung ve tren tai den se cua toan bo hau het cac don vi doanh nghiep ngan hang khach hang da dang de tu cac quan hoat dong muc do day qua nhu nay can the trong moi tai nhieu hon tuong ung'.split())

def rubric_terms(text):
    return {w for w in re.findall(r'[a-z]{4,}', normalize(text))
            if w not in RUBRIC_STOP}

def scope_required(level_text):
    s = normalize(level_text)
    if any_phrase(s, SCOPE_SIGNALS['ecosystem']): return 'ecosystem'
    if any_phrase(s, SCOPE_SIGNALS['all']): return 'all'
    if any_phrase(s, SCOPE_SIGNALS['most']): return 'most'
    if any_phrase(s, SCOPE_SIGNALS['some']): return 'some'
    return None

def scope_confirmed(scope, text):
    if scope is None: return True
    if scope == 'ecosystem':
        return any_phrase(text, SCOPE_SIGNALS['ecosystem'])
    if scope == 'all':
        return any_phrase(text, SCOPE_SIGNALS['all'])
    if scope == 'most':
        return any_phrase(text, SCOPE_SIGNALS['most']) or scope_confirmed('all', text)
    if scope == 'some':
        return any_phrase(text, SCOPE_SIGNALS['some']) or scope_confirmed('most',text)
    return False

def grade(c, ranked):
    """Conservative rubric-based CANDIDATES, not verified maturity scores.

    Levels 3-5 require explicit scope confirmation AND substantive rubric overlap.
    Levels 1 are never inferred from missing evidence, and level 2 only when
    deployment and substantive rubric overlap are present. A match is not proof.
    """
    if not ranked:
        return '', 'REVIEW_REQUIRED', 'Không tìm thấy đoạn bằng chứng khớp chủ đề.'
    found=[]
    for e in ranked:
        text=e['norm']
        if e['negative'] or e['plan'] or e['noise'] or not e['action']:
            continue
        # An exact topic signal alone is not a maturity claim.
        evidence_words=rubric_terms(text)
        for level in range(2, 6):
            statement=c.get(f'level{level}', '')
            if not statement.strip():continue
            terms=rubric_terms(statement)
            matched=terms & evidence_words
            min_overlap = 4 if level>=3 else 3
            if len(matched)<min_overlap or len(matched)/max(1,len(terms)) < .22:
                continue
            scope=scope_required(statement)
            # Higher levels need a documented scope; otherwise the method
            # cannot infer the difference between level 2 and higher.
            if level>=3 and not scope:
                continue
            if not scope_confirmed(scope, text):
                continue
            # Generic level2 still requires domain language beyond topic match.
            if level==2 and e['relevance']<.7:
                continue
            found.append((level, len(matched), e, scope, sorted(matched)))
    if not found:
        return '', 'REVIEW_REQUIRED', 'Có đoạn đúng chủ đề nhưng chưa đủ bằng chứng hành động/phạm vi và rubric để đề xuất mức.'
    # When highest level is supported by an explicit evidence phrase,
    # emit for HUMAN REVIEW only. This does not establish lower levels.
    level, overlap, e, scope, tokens=max(found,key=lambda t:(t[0],t[1]))
    reason=(f'Ứng viên mức {level} (CHƯA XÁC MINH). '
            f'Khớp {overlap} từ nội dung rubric; phạm vi: {scope or "không yêu cầu"}. '
            f'Phải đối chiếu đầy đủ yêu cầu level{level}, trích dẫn và bối cảnh.')
    return str(level), 'RULE_PROPOSED', reason


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--bank',choices=BANKS)
    ap.add_argument('--year',type=int,choices=list(YEARS))
    ap.add_argument('--all',action='store_true')
    ap.add_argument('--publish',action='store_true',help='Backup and replace Dashboard auto_proposals.csv')
    args=ap.parse_args()
    criteria=read_csv(CRITERIA)
    if len(criteria)!=140 or len({c['criterion_id'] for c in criteria})!=140 or any(not all(c.get(f'level{i}', '').strip() for i in range(1,6)) for c in criteria):
        raise SystemExit('config/criteria.csv must contain 140 unique criteria')
    banks=BANKS if args.all or not args.bank else [args.bank]
    years=list(YEARS) if args.all or not args.year else [args.year]
    destination=OUT_DIR / ('auto_proposals.csv' if args.publish else 'auto_proposals_v3.csv')
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
    evidence_dest=OUT_DIR/'evidence_top3_v3.csv'
    # Partial runs preserve other bank-years in Top3 too.
    top_old=read_csv(evidence_dest)
    top_preserved=[r for r in top_old if (r.get('bank'),str(r.get('year'))) not in selected]
    atomic_csv(evidence_dest,top_preserved+top3,
        ['bank','year','criterion_id','rank','relevance','source_file','page','matching_terms','excerpt'])
    print('Saved:',destination,'rows:',len(preserved+new))
    print('Top3:',evidence_dest)
    print('IMPORTANT: RULE_PROPOSED is an unverified lexical candidate, NOT a DBI score.')

if __name__=='__main__':
    main()
