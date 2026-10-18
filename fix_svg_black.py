from pathlib import Path
from datetime import datetime
import shutil, sys

root=Path(__file__).resolve().parent
css=root / "dashboard" / "assets" / "style.css"
if not css.is_file():
    raise SystemExit("Khong tim thay dashboard/assets/style.css. Dat file script vao thu muc bank_dx_rebuild.")
stamp=datetime.now().strftime("%Y%m%d_%H%M%S")
backup=css.with_name(css.name+".before_svg_fix_"+stamp)
shutil.copy2(css,backup)
txt=css.read_text(encoding="utf-8")
marker="/* DBI SVG BLACK SHAPES FIX */"
if marker in txt:
    txt=txt.split(marker,1)[0].rstrip()+"\n"
txt += """
/* DBI SVG BLACK SHAPES FIX */
/* Set safe SVG defaults: browser defaults fill SVG geometry black */
svg.ic, svg.ic path, svg.ic circle, svg.ic rect, svg.ic ellipse,
svg.ic line, svg.ic polyline, svg.ic polygon {
  fill:none !important;
  stroke:currentColor;
}
svg.ic {
  width:1.15em !important;
  height:1.15em !important;
  max-width:24px;
  max-height:24px;
  flex:none;
  overflow:visible;
}
/* Ring KPI: never fill the circle black */
svg.ring {
  width:54px !important;
  height:54px !important;
  min-width:54px;
  max-width:54px;
  display:block;
}
svg.ring circle {fill:none !important}
svg.ring .bg {stroke:var(--track, rgba(127,146,171,.22))}
svg.ring .fg {stroke:var(--amber, #0aaed0)}
svg.ring text {fill:var(--tx) !important;stroke:none !important}
/* Donut of status chart has internal viewBox 0 0 140 140 */
svg[viewBox="0 0 140 140"] {
  display:block;
  width:100% !important;
  max-width:190px !important;
  height:auto !important;
  aspect-ratio:1;
  overflow:visible;
}
svg[viewBox="0 0 140 140"] circle {
  fill:none !important;
}
svg[viewBox="0 0 140 140"] text {
  stroke:none !important;
}
/* Make chart geometry safe while preserving filled radar/chart datapoints */
svg.chart {width:100%;height:auto;display:block;max-width:100%;min-width:0}
svg.chart .grid-l, svg.chart .axis-l {fill:none}
svg.chart path.ln, svg.chart polyline {fill:none}
"""
css.write_text(txt,encoding="utf-8")
print("OK: Da sua SVG icon, KPI rings va donut chart")
print("Backup:",backup)
print("GIU NGUYEN: app.js, 3 che do mau, background, app, logo va Gemini CSV")
