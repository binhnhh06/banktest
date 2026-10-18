from pathlib import Path
from datetime import datetime
import shutil

ROOT=Path(__file__).resolve().parent
p=ROOT/'build_dashboard_data.py'
if not p.exists():
    raise SystemExit('Dat fix_image_detection.py vao thu muc bank_dx_rebuild, cung cho voi build_dashboard_data.py')
source=p.read_text(encoding='utf-8')
start=source.find(' images={}\n for b,_,_ in BANKS:')
end=source.find(' payload=',start)
if start<0 or end<0:
    if 'AUTO BANK IMAGE DETECTION PATCH' in source:
        print('Da cai patch tu truoc, khong can cai lai.')
    else:
        raise SystemExit('Khong tim thay khoi xu ly anh trong build_dashboard_data.py. Khong sua file.')
else:
    backup=p.with_name(p.name+'.backup_'+datetime.now().strftime('%Y%m%d_%H%M%S'))
    shutil.copy2(p,backup)
    block=''' # AUTO BANK IMAGE DETECTION PATCH
 images={}
 extensions={'.png','.jpg','.jpeg','.jfif','.webp','.svg'}
 hints={
  'logo':('logo','logotype','brandmark','thuonghieu'),
  'background':('background','backdrop','banner','cover','hero','bg','wallpaper'),
  'app':('app','mobile','smart','screen','interface','giaodien','digitalbanking','ebanking'),
 }
 for b,_,_ in BANKS:
  d=ROOT/'assets'/'banks'/b
  found={}
  if not d.exists():
   print(f'[IMAGE] {b}: KHONG CO THU MUC {d}')
   continue
  all_files=[f for f in sorted(d.iterdir()) if f.is_file() and f.suffix.lower() in extensions]
  used=set()
  for kind in ('logo','background','app'):
   # Prefer exact official aliases, then keyword matches in real filenames.
   exact=[f for f in all_files if f.stem.casefold() in hints[kind] and f not in used]
   fuzzy=[f for f in all_files if any(token in f.stem.casefold().replace(' ','').replace('-','').replace('_','') for token in hints[kind]) and f not in used]
   candidates=exact or fuzzy
   if candidates:
    hit=candidates[0];used.add(hit)
    found[kind]='../assets/banks/'+b+'/'+hit.name
  images[b]=found
  print(f'[IMAGE] {b}: '+', '.join(f'{k}={v.split("/")[-1]}' for k,v in found.items()) if found else f'[IMAGE] {b}: NO MATCH; available: '+', '.join(f.name for f in all_files))
'''
    p.write_text(source[:start]+block+source[end:],encoding='utf-8')
    print('Da cap nhat:',p)
    print('Backup:',backup)
print('Chay tiep: python build_dashboard_data.py')
print('Neu van thieu anh, doi ten file that thanh logo.png, background.jpg, app.jpg (giu dung duoi file) hoac gui danh sach ten anh.')
