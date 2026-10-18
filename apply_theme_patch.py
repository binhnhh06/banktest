"""Apply safer 3-theme palette patch while preserving image/background/app customizations."""
from pathlib import Path
from datetime import datetime
import re, shutil, sys
root = Path(__file__).resolve().parent
css = root / 'dashboard/assets/style.css'
js = root / 'dashboard/assets/app.js'
if not css.exists() or not js.exists():
    print('ERROR: Put this script in bank_dx_rebuild alongside dashboard/.'); sys.exit(1)
stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
for p in (css,js):
    shutil.copy2(p, p.with_name(p.name + '.backup_' + stamp))
s=css.read_text(encoding='utf-8')
marker='/* DBI THREE THEME OVERRIDE -- SAFE PATCH */'
if marker in s: s=s.split(marker)[0].rstrip()+'\n'
# Use CSS overrides appended instead of replacing existing selectors/background image rules.
s += '''\n/* DBI THREE THEME OVERRIDE -- SAFE PATCH */
/* Only color tokens/surfaces; preserve all bank backgrounds and app screenshots. */
html[data-theme="navy"]{
  color-scheme:dark;
  --bg:#071a30;--card-a:rgba(12,39,66,.96);--card-b:rgba(9,31,55,.97);
  --well:#0b2742;--side:rgba(7,27,47,.95);
  --line:rgba(126,205,235,.15);--line2:rgba(126,205,235,.29);--hover:rgba(56,189,248,.09);
  --tx:#f4fbff;--tx2:#bdd1e4;--tx3:#8caac3;
  --amber:#22c6e8;--amber2:#80eaff;--em:#28d5b9;--cy:#35d6eb;--in:#8cafff;
  --shadow:0 14px 36px -12px rgba(0,8,23,.49);--glow:0 0 23px -6px rgba(34,198,232,.36);
  --track:rgba(255,255,255,.10);--surf:rgba(49,176,217,.08);--pop:#0b2742;--drw:#102c49;--sb:#315874;
  --b1:rgba(34,198,232,.12);--b2:rgba(84,132,226,.12);
}
html[data-theme="slate"]{
  color-scheme:light;
  --bg:#cbd8eb;--card-a:rgba(242,247,255,.98);--card-b:rgba(228,238,251,.97);
  --well:#e0eaf6;--side:rgba(223,234,249,.96);
  --line:rgba(39,76,116,.13);--line2:rgba(39,76,116,.24);--hover:rgba(36,111,171,.07);
  --tx:#143252;--tx2:#506e8f;--tx3:#6e88a3;
  --amber:#087fbb;--amber2:#087fbb;--em:#087e79;--cy:#087fbb;--in:#6076c1;
  --shadow:0 15px 34px -14px rgba(30,66,109,.28);--glow:0 0 22px -9px rgba(8,127,187,.27);
  --track:rgba(15,23,42,.10);--surf:rgba(44,123,197,.06);--pop:#f5f9ff;--drw:#eef5fd;--sb:#96adc6;
  --b1:rgba(100,124,203,.14);--b2:rgba(36,162,207,.13);
}
html[data-theme="light"]{
  color-scheme:light;
  --bg:#eff6fb;--card-a:rgba(255,255,255,.98);--card-b:rgba(242,250,255,.97);
  --well:#edf5fc;--side:rgba(255,255,255,.97);
  --line:rgba(36,74,112,.10);--line2:rgba(36,74,112,.21);--hover:rgba(33,120,182,.06);
  --tx:#13344f;--tx2:#51718a;--tx3:#7894ac;
  --amber:#067cba;--amber2:#067cba;--em:#0d877d;--cy:#0785bd;--in:#667fd2;
  --shadow:0 17px 34px -16px rgba(31,73,111,.20);--glow:0 0 20px -9px rgba(6,124,186,.24);
  --track:rgba(15,23,42,.09);--surf:rgba(49,166,204,.05);--pop:#fff;--drw:#fff;--sb:#bad0df;
  --b1:rgba(80,149,210,.10);--b2:rgba(23,182,202,.10);
}
/* Neutral components follow token palette; keep special banking imagery untouched. */
html[data-theme="slate"] .ring .bg,html[data-theme="light"] .ring .bg{stroke:rgba(26,70,110,.12)}
html[data-theme="slate"] .bar,html[data-theme="light"] .bar{background:rgba(26,70,110,.1)}
html[data-theme="slate"] .gap-track,html[data-theme="light"] .gap-track{background:rgba(26,70,110,.1)}
html[data-theme="slate"] .drawer,html[data-theme="light"] .drawer{background:var(--drw);color:var(--tx)}
/* Theme pills */
.themes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
.themes button{min-width:0;display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 5px;border-radius:12px;font-size:11px;border:1px solid var(--line2);background:var(--well);color:var(--tx2);font-weight:700;transition:background .2s,border-color .2s}
.themes button:hover{border-color:var(--amber)}
.themes button.on{background:var(--amber);border-color:var(--amber);color:#fff;box-shadow:var(--glow)}
.themes button i{display:inline-block;width:11px;height:11px;flex:none;border:1px solid rgba(255,255,255,.5);border-radius:50%}
/* Make menus legible under all three themes */
html[data-theme="slate"] .sel option,html[data-theme="light"] .sel option{background:#fff;color:#123451}
'''
css.write_text(s,encoding='utf-8')
t=js.read_text(encoding='utf-8')
# Only update the three theme labels, preserve all banking image functions.
pat=r"\[\['navy','Navy','#060d1d'\],\['slate','Slate','#1f2736'\],\['light','Light','#f0f4f9'\]\]"
replacement="[['navy','Tối','#071a30'],['slate','Trưa','#cbd8eb'],['light','Sáng','#eff6fb']]"
nt,n=re.subn(pat,replacement,t)
if n!=1:
    print('NOTICE: Did not find exact theme labels. CSS installed; no JS overwritten.');
else:
    js.write_text(nt,encoding='utf-8')
print('OK: Patched CSS palette, labels:', n)
print('UNCHANGED: data.js, bank logos, bank background/app images, Gemini CSV')
print('Backups: *.backup_'+stamp)
