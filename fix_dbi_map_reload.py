from pathlib import Path
from datetime import datetime
import re

root = Path(__file__).resolve().parent
js = root / 'dashboard' / 'assets' / 'app.js'
if not js.is_file():
    raise SystemExit(f'Khong tim thay {js}. Dat script o thu muc goc du an.')
s = js.read_text(encoding='utf-8-sig')
anchor = 'function mountPage() {'
i = s.find(anchor)
j = s.find('\nfunction swapSlide()', i)
if i < 0 or j < 0:
    raise SystemExit('Khong tim thay mountPage/swapSlide. Khong sua file.')
chunk = s[i:j]
start = chunk.find("  if (state.page === 'map') {")
if start < 0:
    print('Tab Ban do da khong con khoi slideshow tu dong. Khong can sua.')
else:
    # This map-only block is the final block within mountPage in the supplied code.
    finish = chunk.rfind('\n}')
    if finish < start:
        raise SystemExit('Khong xac dinh duoc ket thuc khoi. Khong sua file.')
    old_block = chunk[start:finish]
    if not ('requestAnimationFrame(step)' in old_block and 'swapSlide()' in old_block):
        raise SystemExit('Ma khac phien ban da kiem tra. Khong tu dong sua.')
    new_chunk = chunk[:start] + '  // Map: no autoplay or automatic re-render.\n' + chunk[finish:]
    backup = js.with_name('app.js.backup_before_map_fix_' + datetime.now().strftime('%Y%m%d_%H%M%S'))
    backup.write_text(s, encoding='utf-8')
    s = s[:i] + new_chunk + s[j:]
    js.write_text(s, encoding='utf-8')
    print('Da tat slideshow tu dong tren tab Ban do.')
    print('Backup:', backup)
print('CSS, Gemini CSV va data.js: khong thay doi.')
print('Tai lai trang bang Ctrl + Shift + R.')
