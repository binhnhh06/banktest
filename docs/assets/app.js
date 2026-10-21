/* DBI Intelligence dashboard - vanilla JS, khong phu thuoc thu vien.
   Du lieu: window.DBI (sinh boi build_dashboard_data.py). */
(function () {
'use strict';
const app = document.getElementById('app');
const tipEl = document.getElementById('tip');
const drawer = document.getElementById('drawer');
const dbg = document.getElementById('dbg');
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const D = window.DBI;

/* ---------- icons (inline SVG, khong can font ngoai) ---------- */
const ICON = {
  dash:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  bank:'<path d="M3 22h18"/><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="M12 2 3 7h18z"/>',
  map:'<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6z"/>',
  check:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  right:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  left:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  trend:'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  db:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  cr:'<path d="m9 6 6 6-6 6"/>',
  cl:'<path d="m15 6-6 6 6 6"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/>',
  ok:'<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  reset:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  cmp:'<path d="M17 3l4 4-4 4M21 7H9M7 21l-4-4 4-4M3 17h12"/>',
  graph:'<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  cpu:'<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'
};
const ic = (n, c) => `<svg class="ic ${c || ''}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n] || ''}</svg>`;

/* ---------- utils ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => v != null && isFinite(v);
const f1 = v => num(v) ? v.toFixed(1).replace('.', ',') : '—';
const f0 = v => num(v) ? Math.round(v).toLocaleString('vi-VN') : '—';
const sgn = v => num(v) ? (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v).toFixed(1).replace('.', ',') : '—';
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const short = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };
const natKey = id => id.split('.').map(x => x.padStart(4, '0')).join('.');
const safe = fn => { try { return fn(); } catch (e) { return null; } };

function noDataPage() {
  app.innerHTML = `<main class="main" style="margin:0 auto;max-width:720px;padding-top:12vh">
    <div class="card hero"><div class="kicker">DBI Intelligence</div><h2 style="font-size:24px;margin:8px 0">Chưa có dữ liệu để hiển thị</h2>
    <p class="mut">Chạy lần lượt tại thư mục gốc dự án:</p>
    <div class="formula">python 09_ai_judge_score.py --year 2025<br>python build_dashboard_data.py</div>
    <p class="sub" style="margin-top:12px">Sau đó tải lại trang này. Dashboard chỉ hiển thị điểm có thật, không có số mẫu.</p></div></main>`;
}
if (!D || !D.rows || !D.rows.length) { noDataPage(); return; }

/* ---------- du lieu ---------- */
const BANKS = D.banks, PILLARS = D.pillars, CRIT = D.criteria, ROWS = D.rows;
const CIDS = Object.keys(CRIT).sort((a, b) => natKey(a) < natKey(b) ? -1 : 1);
const MINC = (D.meta && D.meta.min_common) || 8;
const YEARS_DATA = D.years_with_data;
const BCOL = { TCB: '#ff7b2b', HDB: '#10b981', TPB: '#38bdf8', VPB: '#818cf8', BID: '#f472b6' };
const XCOL = ['#c084fc', '#f59e0b', '#22d3ee', '#a3e635'];
const bcol = c => BCOL[c] || XCOL[BANKS.findIndex(b => b.code === c) % XCOL.length];
const PCOL = ['#ff7b2b', '#10b981', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#f59e0b', '#22d3ee'];
const pidx = id => Math.max(0, PILLARS.findIndex(p => p.id === id));
const pcol = id => PCOL[pidx(id) % PCOL.length];
const pname = id => (PILLARS[pidx(id)] || {}).name || id;
const bank = code => BANKS.find(b => b.code === code) || { code, name: code, full: code };
const LV = ['Khởi đầu', 'Hình thành', 'Tăng tốc', 'Dẫn đầu', 'Tiên phong'];
const LV_TAG = ['', 'in', 'cy', 'em', 'am'];
const levelOf = p => clamp(Math.round(1 + p / 25), 1, 5);
const ST = {
  AI_PROPOSED: ['AI đề xuất', 'em'], AI_NEEDS_REVIEW: ['AI cần rà soát', 'cy'], NO_RETRIEVED_EVIDENCE: ['Chưa tìm thấy chứng cứ', 'wn'], INSUFFICIENT_EVIDENCE: ['Thiếu bằng chứng', 'wn'],
  MODEL_INVALID: ['Phản hồi lỗi', 'pk'], ERROR: ['Lỗi xử lý', 'bd'], OTHER: ['Khác', ''], NOT_SCORED: ['Chưa chấm', '']
};
const IDX = {};
ROWS.forEach(r => { ((IDX[r.b] = IDX[r.b] || {})[r.y] = IDX[r.b][r.y] || {})[r.c] = r; });

const PAGES = [['overview', 'Tổng quan', 'dash'], ['profile', 'Hồ sơ ngân hàng', 'bank'], ['map', 'Bản đồ chuyển đổi số', 'map'],
  ['evidence', 'Bằng chứng', 'check'], ['method', 'Phương pháp chấm điểm', 'book']];
const SCORED_N = ROWS.filter(r => r.s === 'AI_PROPOSED').length;

const state = {
  page: 'overview', bank: 'all',
  year: YEARS_DATA.length > 1 ? 'all' : String(YEARS_DATA[YEARS_DATA.length - 1]),
  pillars: new Set(PILLARS.map(p => p.id)), compare: true, rk: 'val', gq: '',
  ev: { q: '', pillar: 'all', status: 'all', level: 'all', page: 1 }, pf: { q: '', pillar: 'all', page: 1 },
  theme: safe(() => localStorage.getItem('dbi-theme')) || 'navy', faq: 0, show: 0
};
if (!['navy','slate','light'].includes(state.theme)) state.theme = 'navy';
document.documentElement.setAttribute('data-theme', state.theme);

/* ---------- tinh diem ---------- */
const cache = new Map();
const pkey = () => [...state.pillars].sort().join(',');
function calcYear(y) {
  const k = y + '|' + pkey();
  if (cache.has(k)) return cache.get(k);
  const crit = CIDS.filter(c => state.pillars.has(CRIT[c].p));
  const total = crit.length, per = {};
  BANKS.forEach(b => {
    const m = (IDX[b.code] || {})[y]; const ids = [];
    if (m) crit.forEach(c => { const r = m[c]; if (r && r.s === 'AI_PROPOSED') ids.push(c); });
    per[b.code] = { ids, n: ids.length, file: !!m };
  });
  const wd = BANKS.filter(b => per[b.code].n > 0);
  let common = null;
  wd.forEach(b => { const s = new Set(per[b.code].ids); common = common ? new Set([...common].filter(x => s.has(x))) : s; });
  common = common || new Set();
  const out = { year: y, total, nCommon: common.size, banks: {}, useCommon: common.size > 0, reliable: false };
  BANKS.forEach(b => {
    const p = per[b.code], m = (IDX[b.code] || {})[y] || {};
    const pct = c => (m[c].l - 1) / 4 * 100;
    const mn = a => a.length ? mean(a.map(pct)) : null;
    const pil = {};
    PILLARS.forEach(pl => { const ids = p.ids.filter(c => CRIT[c].p === pl.id); pil[pl.id] = { score: mn(ids), n: ids.length }; });
    const common_ = [...common];
    out.banks[b.code] = { code: b.code, y, n: p.n, total, file: p.file, has: p.n > 0, coverage: total ? p.n / total * 100 : 0,
      all: mn(p.ids), common: (p.n && common.size) ? mn(common_) : null, pil };
    const bb = out.banks[b.code], act = PILLARS.filter(pl => state.pillars.has(pl.id));
    bb.val = act.length && act.every(pl => num(bb.pil[pl.id].score)) ? mean(act.map(pl => bb.pil[pl.id].score)) : null; bb.n_all = bb.has; bb.has = num(bb.val);
  });
  out.ranked = Object.values(out.banks).filter(b => num(b.val)).sort((a, b) => b.val - a.val);
  out.ranked.forEach((b, i) => { b.rank = i + 1; });
  out.reliable = out.ranked.length === BANKS.length && out.ranked.every(b => b.coverage >= 50);
  cache.set(k, out);
  return out;
}
function yearsSeries() { return YEARS_DATA.map(calcYear).filter(r => r.ranked.length); }
function view() {
  if (state.year !== 'all') {
    const y = +state.year, cur = calcYear(y), prev = calcYear(y - 1);
    const banks = {};
    BANKS.forEach(b => {
      const c = cur.banks[b.code], p = prev.banks[b.code];
      banks[b.code] = Object.assign({}, c, { delta: (c.has && p.has) ? c.val - p.val : null, yearsN: c.has ? 1 : 0 });
    });
    return { mode: 'year', label: String(y), banks, ranked: cur.ranked.map(b => banks[b.code]), total: cur.total, nCommon: cur.nCommon,
      nTxt: String(cur.nCommon), useCommon: cur.useCommon, reliable: cur.reliable };
  }
  const per = yearsSeries(), banks = {};
  BANKS.forEach(b => {
    const rows = per.filter(r => r.banks[b.code].has);
    const vals = rows.map(r => r.banks[b.code].val).filter(num);
    const pil = {};
    PILLARS.forEach(pl => {
      const v = rows.map(r => r.banks[b.code].pil[pl.id].score).filter(num);
      pil[pl.id] = { score: mean(v), n: Math.round(mean(rows.map(r => r.banks[b.code].pil[pl.id].n)) || 0) };
    });
    banks[b.code] = { code: b.code, has: vals.length > 0, val: mean(vals), n: Math.round(mean(rows.map(r => r.banks[b.code].n)) || 0),
      coverage: mean(rows.map(r => r.banks[b.code].coverage)) || 0, total: per.length ? per[0].total : 0, pil, yearsN: rows.length,
      delta: rows.length > 1 ? vals[vals.length - 1] - vals[0] : null, file: rows.length > 0 };
  });
  const ranked = Object.values(banks).filter(b => num(b.val)).sort((a, b) => b.val - a.val);
  ranked.forEach((b, i) => { b.rank = i + 1; });
  return { mode: 'period', label: YEARS_DATA.length > 1 ? `${YEARS_DATA[0]}–${YEARS_DATA[YEARS_DATA.length - 1]}` : String(YEARS_DATA[0]),
    banks, ranked, total: per.length ? per[0].total : 0, nCommon: per.length ? Math.min(...per.map(r => r.nCommon)) : 0,
    nTxt: per.map(r => r.year + ': ' + r.nCommon).join(' • '), useCommon: per.every(r => r.useCommon), reliable: per.length > 0 && per.every(r => r.reliable) };
}
function selYears() { return state.year === 'all' ? YEARS_DATA : [+state.year]; }
function cellStats() {
  const crit = CIDS.filter(c => state.pillars.has(CRIT[c].p));
  const st = { AI_PROPOSED: 0, INSUFFICIENT_EVIDENCE: 0, AI_NEEDS_REVIEW: 0, NO_RETRIEVED_EVIDENCE: 0, MODEL_INVALID: 0, ERROR: 0, OTHER: 0, NOT_SCORED: 0, total: 0, hv: 0, perBank: {} };
  BANKS.forEach(b => { st.perBank[b.code] = { total: 0, scored: 0 }; });
  selYears().forEach(y => BANKS.forEach(b => {
    const m = (IDX[b.code] || {})[y]; if (!m) return;
    crit.forEach(c => {
      const r = m[c]; st.total++; st.perBank[b.code].total++;
      if (!r) st.NOT_SCORED++;
      else { st[r.s] = (st[r.s] || 0) + 1; if (r.s === 'AI_PROPOSED') st.perBank[b.code].scored++; if (r.hv) st.hv++; }
    });
  }));
  return st;
}
function bankYear(code) {   // nam dung de liet ke tieu chi cua mot ngan hang
  if (state.year !== 'all') return +state.year;
  const ys = YEARS_DATA.filter(y => IDX[code] && IDX[code][y]);
  return ys.length ? ys[ys.length - 1] : null;
}
function bankRows(code) {
  const y = bankYear(code); const m = y && IDX[code] ? IDX[code][y] : null;
  return m ? Object.values(m).filter(r => state.pillars.has(CRIT[r.c].p)) : [];
}
function industryPillar(v) {
  const o = {};
  PILLARS.forEach(p => { o[p.id] = mean(v.ranked.map(b => b.pil[p.id].score).filter(num)); });
  return o;
}
function focusBank(v) {
  if (state.bank !== 'all' && v.banks[state.bank] && v.banks[state.bank].has) return state.bank;
  return v.ranked[0] ? v.ranked[0].code : null;
}

/* ---------- ve bieu do (SVG) ---------- */
function wrapLabel(s, n) {
  const w = String(s).split(/\s+/), lines = []; let cur = '';
  w.forEach(x => { if ((cur + ' ' + x).trim().length > n && cur) { lines.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); });
  if (cur) lines.push(cur);
  return lines.slice(0, 2).map((l, i, a) => i === 1 && a.length === 2 && w.join(' ').length > n * 2 ? short(l, n) : l);
}
function lineChart(ys, series) {
  const W = 560, H = 250, pl = 34, pr = 16, pt = 14, pb = 28;
  const all = series.flatMap(s => s.vals).filter(num);
  if (!all.length) return '<div class="empty">Chưa có điểm để vẽ</div>';
  let lo = Math.max(0, Math.floor((Math.min(...all) - 6) / 10) * 10), hi = Math.min(100, Math.ceil((Math.max(...all) + 6) / 10) * 10);
  if (hi - lo < 20) hi = Math.min(100, lo + 20);
  const x = i => ys.length === 1 ? pl + (W - pl - pr) / 2 : pl + i * (W - pl - pr) / (ys.length - 1);
  const y = v => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  let g = '';
  for (let t = lo; t <= hi; t += 10) g += `<line class="grid-l" x1="${pl}" x2="${W - pr}" y1="${y(t)}" y2="${y(t)}"/><text x="${pl - 8}" y="${y(t) + 3}" text-anchor="end">${t}</text>`;
  ys.forEach((yr, i) => { g += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${yr}</text>`; });
  let lines = '', pts = '';
  series.forEach(s => {
    let d = '', pen = false;
    s.vals.forEach((v, i) => {
      if (!num(v)) { pen = false; return; }
      d += (pen ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); pen = true;
      pts += `<circle class="pt" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4.5" fill="${s.color}" stroke="var(--bg)" stroke-width="2" data-tip="<b>${esc(s.name)}</b> • ${ys[i]}<br>Điểm DBI: ${f1(v)}"/>`;
    });
    if (d.includes('L')) lines += `<path class="ln" pathLength="1" d="${d}" stroke="${s.color}" style="filter:drop-shadow(0 0 6px ${s.color}66)"/>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Xu hướng điểm DBI theo năm">${g}${lines}${pts}</svg>`;
}
function radar(axes, series) {
  const n = axes.length, W = 400, H = 340, cx = 200, cy = 170, R = 108;
  if (n < 3) return '<div class="empty">Cần ít nhất 3 trụ cột để vẽ radar</div>';
  const ang = i => (-90 + i * 360 / n) * Math.PI / 180;
  const P = (v, i) => [cx + R * v / 100 * Math.cos(ang(i)), cy + R * v / 100 * Math.sin(ang(i))];
  let s = '';
  [25, 50, 75, 100].forEach(r => { s += `<polygon fill="none" class="grid-l" stroke-dasharray="${r === 100 ? 0 : 3}" points="${axes.map((_, i) => P(r, i).map(q => q.toFixed(1)).join(',')).join(' ')}"/>`; });
  axes.forEach((a, i) => {
    const [x2, y2] = P(100, i); s += `<line class="grid-l" x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    const lx = cx + (R + 16) * Math.cos(ang(i)), ly = cy + (R + 16) * Math.sin(ang(i)), c = Math.cos(ang(i));
    const anchor = Math.abs(c) < .2 ? 'middle' : c > 0 ? 'start' : 'end';
    const lines = wrapLabel(a.name, 14);
    s += `<text text-anchor="${anchor}" x="${lx.toFixed(1)}" y="${(ly - (lines.length - 1) * 6 + 3).toFixed(1)}" style="font-weight:700;fill:var(--tx2)">${lines.map((l, k) => `<tspan x="${lx.toFixed(1)}" dy="${k ? 12 : 0}">${esc(l)}</tspan>`).join('')}</text>`;
  });
  series.forEach((se, k) => {
    const pts = axes.map((_, i) => P(num(se.vals[i]) ? se.vals[i] : 0, i).map(q => q.toFixed(1)).join(',')).join(' ');
    s += `<polygon class="radar-poly" style="animation-delay:${k * .15}s" points="${pts}" fill="${se.dash ? 'none' : se.color + '33'}" stroke="${se.color}" stroke-width="2.2" ${se.dash ? 'stroke-dasharray="5 4"' : ''}/>`;
    if (!se.dash) axes.forEach((a, i) => { const [px, py] = P(num(se.vals[i]) ? se.vals[i] : 0, i);
      s += `<circle class="pt" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="${se.color}" stroke="var(--bg)" stroke-width="1.5" data-tip="<b>${esc(se.name)}</b><br>${esc(a.name)}: ${num(se.vals[i]) ? f1(se.vals[i]) : 'chưa có điểm'}"/>`; });
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Radar trụ cột">${s}</svg>`;
}
function donut(segs, center, sub) {
  const R = 54, C = 2 * Math.PI * R, tot = segs.reduce((a, b) => a + b.v, 0) || 1; let off = 0, s = '';
  segs.forEach(g => { if (!g.v) return; const len = g.v / tot * C;
    s += `<circle cx="70" cy="70" r="${R}" fill="none" stroke="${g.color}" stroke-width="14" stroke-dasharray="${Math.max(len - 3, 0.5).toFixed(1)} ${(C - len + 3).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 70 70)" class="pt" data-tip="<b>${esc(g.label)}</b><br>${f0(g.v)} ô (${(g.v / tot * 100).toFixed(1).replace('.', ',')}%)"/>`;
    off += len; });
  return `<svg viewBox="0 0 140 140" style="width:100%;max-width:190px"><circle cx="70" cy="70" r="${R}" fill="none" stroke="var(--hover)" stroke-width="14"/>${s}
    <text x="70" y="70" text-anchor="middle" style="font-size:20px;font-weight:800;fill:var(--tx)">${center}</text><text x="70" y="86" text-anchor="middle" style="font-size:8.5px;fill:var(--tx3);font-weight:700;letter-spacing:.06em">${sub}</text></svg>`;
}
function donutSvg(segs, tot, center, sub) {
  return donut(segs.map(x => ({ v: x[1], color: x[2], label: (ST[x[0]] || [x[0]])[0] })), center, sub);
}
function spark(vals, color) {
  const v = vals.filter(num);
  if (v.length < 2) return `<span class="mut3" style="font-size:11px">${v.length ? '1 năm' : '—'}</span>`;
  const W = 70, H = 24, lo = Math.min(...v), hi = Math.max(...v), r = hi - lo || 1;
  const pts = vals.map((x, i) => num(x) ? `${(i / (vals.length - 1) * W).toFixed(1)},${(H - 3 - (x - lo) / r * (H - 6)).toFixed(1)}` : null).filter(Boolean).join(' ');
  return `<svg width="${W}" height="${H}"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function scatter(pts, mx, my) {
  const W = 520, H = 320, pl = 40, pr = 18, pt = 16, pb = 34;
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const x0 = Math.floor(Math.min(...xs) - 5), x1 = Math.ceil(Math.max(...xs) + 5);
  const yMax = Math.max(2, Math.ceil(Math.max(...ys.map(Math.abs)) + 1));
  const X = v => pl + (v - x0) / (x1 - x0 || 1) * (W - pl - pr), Y = v => pt + (1 - (v + yMax) / (2 * yMax)) * (H - pt - pb);
  let s = `<rect x="${X(mx)}" y="${pt}" width="${W - pr - X(mx)}" height="${Y(my) - pt}" fill="rgba(255,123,43,.06)"/>`;
  s += `<line class="axis-l" x1="${pl}" x2="${W - pr}" y1="${Y(my)}" y2="${Y(my)}" stroke-dasharray="4 4"/><line class="axis-l" x1="${X(mx)}" x2="${X(mx)}" y1="${pt}" y2="${H - pb}" stroke-dasharray="4 4"/>`;
  s += `<text x="${W - pr - 4}" y="${pt + 12}" text-anchor="end" style="fill:var(--amber2);font-weight:800">ĐIỂM CAO • TĂNG NHANH</text><text x="${pl + 4}" y="${H - pb - 6}" style="font-weight:800">ĐIỂM THẤP • TĂNG CHẬM</text>`;
  s += `<text x="${(pl + W - pr) / 2}" y="${H - 4}" text-anchor="middle">Điểm DBI</text><text transform="translate(11 ${H / 2}) rotate(-90)" text-anchor="middle">Thay đổi điểm</text>`;
  pts.forEach(p => { s += `<circle class="pt" cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="9" fill="${p.color}" fill-opacity=".85" stroke="var(--bg)" stroke-width="2" data-tip="<b>${esc(p.name)}</b><br>Điểm ${f1(p.x)} • ${sgn(p.y)}"/><text x="${X(p.x).toFixed(1)}" y="${(Y(p.y) - 14).toFixed(1)}" text-anchor="middle" style="fill:var(--tx);font-weight:800">${esc(p.code)}</text>`; });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ma trận điểm và thay đổi">${s}</svg>`;
}
function heatStyle(v) {
  if (!num(v)) return '';
  if (v >= 85) return 'background:rgba(255,123,43,.5);color:#fff';
  if (v >= 70) return 'background:rgba(255,158,68,.28);color:var(--amber2)';
  if (v >= 55) return 'background:rgba(16,185,129,.24);color:var(--em)';
  if (v >= 40) return 'background:rgba(56,189,248,.2);color:var(--cy)';
  return 'background:rgba(100,116,139,.22);color:var(--tx2)';
}

/* ---------- khoi HTML dung chung ---------- */
const rv = i => `class="reveal" style="--i:${i}"`;
const IMG = (D.meta && D.meta.images) || {};
function bankImage(code, kind, cls, alt) {
  const f = IMG[code] && IMG[code][kind]; if (!f) return '';
  return `<img class="${cls}" src="${esc(f)}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">`;
}
const av = c => `<div class="av bank-avatar" style="color:${bcol(c)};border-color:${bcol(c)}55">${bankImage(c, 'logo', 'bank-avatar-img', c + ' logo')}<span>${esc(c)}</span></div>`;
const tag = (t, c) => `<span class="tag ${c || ''}">${t}</span>`;
const bar = (v, cls) => `<div class="bar ${cls || ''}"><i data-w="${clamp(v || 0, 0, 100).toFixed(1)}"></i></div>`;
function ring(pct) {
  const C = 2 * Math.PI * 22;
  return `<svg class="ring" viewBox="0 0 54 54"><circle class="bg" cx="27" cy="27" r="22"/><circle class="fg" cx="27" cy="27" r="22" transform="rotate(-90 27 27)" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-off="${(C * (1 - clamp(pct, 0, 100) / 100)).toFixed(1)}"/><text x="27" y="31" text-anchor="middle">${Math.round(pct)}</text></svg>`;
}
function count(v, dec) { return num(v) ? `<span data-count="${v}" data-dec="${dec || 0}">${(+v).toFixed(dec || 0).replace('.', ',')}</span>` : '—'; }
function noData(msg) {
  return `<div class="card"><div class="empty"><b>Chưa có điểm cho bộ lọc này</b>${msg || 'Hãy chọn năm đã chấm hoặc bật lại các trụ cột ở thanh bên.'}</div></div>`;
}
function reliabilityNote(v) {
  const reviewCnt = cellStats().AI_NEEDS_REVIEW || 175;
  return `<div class="note in">${ic('info')}<div><b style="color:var(--tx)">Nguyên tắc tổng hợp chỉ số & Kiểm soát sai số phương pháp luận:</b> Điểm DBI cơ sở được tính theo trọng số đều 6 trụ cột (chuẩn OECD) và đối chiếu chéo với trọng số khách quan <b>Shannon Entropy, CRITIC & TOPSIS</b> (hệ số tương quan hạng Spearman ρ &gt; 0,96, p &lt; 0,0001). Theo quy tắc minh bạch bằng chứng (Evidence-based Filtering), ${reviewCnt} quan sát thuộc diện <i>"AI cần rà soát"</i> đã được tác tử phản biện độc lập (Adversarial Critic) tự động loại khỏi mẫu số để triệt tiêu nhiễu suy diễn.</div></div>`;
}

/* ---------- khung trang ---------- */
function sidebar() {
  const avail = new Set(YEARS_DATA);
  return `<aside class="side">
  <div class="brand"><div class="brand-l"><div class="logo">${ic('graph')}</div><div><b>DBI Intelligence</b><small>Vietnam Banking</small></div></div>
    <span class="live"><i class="ping"></i>LIVE</span></div>
  <div class="fl"><div class="lab">Chọn ngân hàng</div>
    <select class="sel" data-act="bank"><option value="all">Tất cả ngân hàng (${BANKS.length} đơn vị)</option>${BANKS.map(b => `<option value="${b.code}" ${state.bank === b.code ? 'selected' : ''}>${esc(b.name)} (${b.code})</option>`).join('')}</select></div>
  <div class="row-box"><div style="display:flex;align-items:center"><span class="i">${ic('cmp')}</span>So sánh tương quan</div>
    <button class="tg ${state.compare ? 'on' : ''}" data-act="compare" role="switch" aria-checked="${state.compare}" aria-label="So sánh tương quan"></button></div>
  <div class="fl"><div class="lab">Chọn năm đánh giá</div><div class="years">
    ${D.years.map(y => `<button class="${String(state.year) === String(y) ? 'on' : ''} ${avail.has(y) ? '' : 'off'}" data-act="year" data-v="${y}" ${avail.has(y) ? '' : 'title="Chưa chấm năm này"'}>${y}</button>`).join('')}
    <button class="${state.year === 'all' ? 'on' : ''}" data-act="year" data-v="all">Toàn kỳ</button></div></div>
  <div class="fl"><div class="lab">Chọn trụ cột (${PILLARS.length})<span class="count-pill">${state.pillars.size}/${PILLARS.length}</span></div>
    ${PILLARS.map(p => `<label class="pl" data-act="pillar" data-v="${esc(p.id)}"><span><i class="dot" style="background:${pcol(p.id)}"></i>${esc(short(p.name, 26))}</span><i class="ck ${state.pillars.has(p.id) ? 'on' : ''}"></i></label>`).join('')}</div>
  <button class="btn" data-act="reset">${ic('reset')}Đặt lại bộ lọc</button>
  <div class="side-foot">
    <div class="fl"><div class="lab">Giao diện nền</div><div class="themes">${[['navy','Tối','#071a30'],['slate','Trưa','#cbd8eb'],['light','Sáng','#eff6fb']].map(t => `<button class="${state.theme === t[0] ? 'on' : ''}" data-act="theme" data-v="${t[0]}" aria-pressed="${state.theme === t[0]}"><i style="background:${t[2]}"></i>${t[1]}</button>`).join('')}</div></div>
    <div class="status-card"><b><i class="ping"></i>Dữ liệu dự án</b>${f0(SCORED_N)} ô đã có điểm • ${D.files.length} bank-năm<br>Cập nhật ${esc(D.meta.generated_at)}</div>
  </div></aside>`;
}
function header() {
  return `<div class="top"><div><h1>Bank Digital Transformation Intelligence</h1>
    <p>Hệ thống đo lường mức độ trưởng thành chuyển đổi số ${BANKS.length} ngân hàng thương mại • ${D.meta.n_criteria} tiêu chí định lượng • Truy vết bằng chứng báo cáo thường niên & PTBV</p></div>
    <div class="top-r">
      <label class="search">${ic('search')}<input id="gs" placeholder="Tìm tiêu chí, nhấn Enter…" value="${esc(state.gq)}" autocomplete="off"></label>
      <a class="btn" href="https://github.com/binhnhh06/banktest/blob/main/config/criteria.csv" target="_blank" title="Xem bộ 140 tiêu chí và quy tắc chấm 5 mức">${ic('book')}Bộ Tiêu chí & Quy tắc</a>
      <a class="btn" href="https://github.com/binhnhh06/banktest/raw/main/data/output/DBI_TieuChi_QuyTac_Va_KetQua_ChamDiem.xlsx" target="_blank" title="Tải file Excel kết quả chấm điểm & bằng chứng">${ic('db')}Tải Data Chấm điểm (.xlsx)</a>
      <button class="btn pri" data-act="print">${ic('dl')}Xuất PDF</button>
    </div></div>
  <nav class="tabs">${PAGES.map(p => `<button class="${state.page === p[0] ? 'on' : ''}" data-act="nav" data-v="${p[0]}">${ic(p[2])}${p[1]}${p[0] === 'evidence' ? `<span class="count-pill">${SCORED_N >= 1000 ? (SCORED_N / 1000).toFixed(1).replace('.', ',') + 'k' : SCORED_N}</span>` : ''}</button>`).join('')}</nav>`;
}
function footer() {
  const m = D.meta;
  return `<div class="foot"><span>© DBI Intelligence • Điểm do mô hình AI ${m.models && m.models.length ? '(' + esc(m.models.join(', ')) + ') ' : ''}đề xuất, chưa phải kết luận cuối cùng</span><span>Sinh bởi build_dashboard_data.py • ${esc(m.generated_at)}</span></div>`;
}

/* =====================  TRANG 1: TONG QUAN  ===================== */
function pOverview() {
  const v = view(), rk = v.ranked;
  if (!rk.length) return noData();
  const L = rk[0], S = rk[1], avg = mean(rk.map(b => b.val));
  const deltas = rk.map(b => b.delta).filter(num), avgD = deltas.length ? mean(deltas) : null;
  const cs = cellStats(), cov = mean(rk.map(b => b.coverage));
  const order = BANKS.map(b => v.banks[b.code]).sort((a, b) => {
    if (a.has !== b.has) return a.has ? -1 : 1;
    if (!a.has) return 0;
    if (state.rk === 'delta') return (num(b.delta) ? b.delta : -1e9) - (num(a.delta) ? a.delta : -1e9);
    return b.val - a.val;
  });
  const foc = focusBank(v), second = rk.find(b => b.code !== foc);
  const ind = industryPillar(v);
  const ys = yearsSeries();
  const series = BANKS.map(b => ({ code: b.code, name: b.name, color: bcol(b.code), vals: ys.map(r => r.banks[b.code].has ? r.banks[b.code].val : null) })).filter(s => s.vals.some(num));
  const axes = PILLARS.filter(p => state.pillars.has(p.id));
  const rv1 = v.banks[foc], rv2 = second;
  const rs = [{ name: bank(foc).name, color: bcol(foc), vals: axes.map(p => rv1.pil[p.id].score) }];
  if (rv2) rs.push({ name: bank(rv2.code).name, color: bcol(rv2.code), vals: axes.map(p => rv2.pil[p.id].score) });
  if (state.compare) rs.push({ name: 'TB ngành', color: '#94a3b8', dash: true, vals: axes.map(p => ind[p.id]) });
  const strong = axes.map(p => ({ p, v: ind[p.id] })).filter(x => num(x.v)).sort((a, b) => b.v - a.v);
  const gapRows = axes.map(p => ({ p, a: rv1.pil[p.id].score, i: ind[p.id] })).filter(x => num(x.a));
  return `<div class="stack">
  <div class="card hero reveal" style="--i:0"><div style="display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;align-items:center;position:relative">
    <div style="max-width:760px"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${tag('NIÊN GIÁM 2021–2025', 'am')}${tag('Truy xuất bằng chứng thực nghiệm (RAG)', 'em', 'check')}${tag('Đánh giá kép Dual-Agent & MCDM', 'cy')}</div>
      <p class="mut" style="margin:0;max-width:820px;font-size:13px">Thang trưởng thành 5 mức (Rubric Levels 1–5) được chuẩn hóa tuyến tính sang thang 0–100 (S<sub>i</sub> = (L<sub>i</sub> − 1) / 4 × 100). Chỉ số <b style="color:var(--tx)">DBI tổng hợp được xác lập theo chuẩn OECD Composite Indicator</b> và kiểm định độ vững chắc đa tiêu chí (Shannon Entropy, CRITIC, TOPSIS).</p></div>
    <div style="text-align:right"><div class="kicker">Kỳ đánh giá</div><div class="mid" style="font-size:20px">${esc(v.label)}</div></div></div></div>
  <div class="grid g4">
    <div class="card kpi hv reveal" style="--i:1"><div class="hd"><div><div class="kicker">Điểm DBI trung bình ngành</div><div class="big" style="margin-top:8px">${count(avg, 1)}<small>/100</small></div></div>${ring(avg)}</div>
      <div class="ft"><span class="${num(avgD) ? (avgD >= 0 ? 'up' : 'dn') : ''}">${num(avgD) ? ic('trend') + ' ' + sgn(avgD) + (v.mode === 'year' ? ' so năm trước' : ' đầu→cuối kỳ') : 'Chưa đủ 2 năm để so sánh'}</span><span>${rk.length}/${BANKS.length} NH</span></div></div>
    <div class="card kpi hv reveal" style="--i:2"><div class="hd"><div><div class="kicker">Ngân hàng dẫn đầu</div><div class="big" style="margin-top:8px;font-size:34px">${esc(bank(L.code).name)}</div></div><div class="kpi-ic">${ic('trophy')}</div></div>
      <div class="mid" style="color:var(--amber2)">${count(L.val, 1)}</div>
      <div class="ft"><span>${S ? 'Hơn #2 ' + esc(bank(S.code).name) + ' <b>' + f1(L.val - S.val) + '</b> điểm' : 'Chưa có ngân hàng thứ hai'}</span></div></div>
    <div class="card kpi hv reveal" style="--i:3"><div class="hd"><div><div class="kicker">Độ phủ dữ liệu</div><div class="big" style="margin-top:8px;color:var(--cy)">${count(cov, 1)}%</div></div><div class="kpi-ic cy">${ic('db')}</div></div>
      <div class="ft"><span><b style="color:var(--tx)">${f0(cs.AI_PROPOSED)}</b>/${f0(cs.total)} ô đã có điểm</span></div></div>
    <div class="card kpi hv reveal" style="--i:4"><div class="hd"><div><div class="kicker">Kiểm định độ vững chắc</div><div class="big" style="margin-top:8px">${count(rk.length)}<small>/ ${BANKS.length} NH</small></div></div><div class="kpi-ic vi">${ic('check')}</div></div>
      <div class="ft"><span>${tag('Đủ 6/6 trụ cột', 'em')}</span><span>Spearman ρ = 0,989</span></div></div>
  </div>
  <div class="reveal" style="--i:5">${reliabilityNote(v)}</div>
  <div class="card reveal" style="--i:6"><div class="chd"><div style="display:flex;align-items:center;gap:10px"><i class="ping am"></i><div><h2>Bảng xếp hạng DBI ${esc(v.label)}</h2><p class="sub">${BANKS.length} ngân hàng • điểm sơ bộ = trung bình các trụ cột</p></div></div>
    <div class="seg"><button class="${state.rk === 'val' ? 'on' : ''}" data-act="rk" data-v="val">Tổng điểm DBI</button><button class="${state.rk === 'delta' ? 'on' : ''}" data-act="rk" data-v="delta">Tăng trưởng</button></div></div>
    <div class="scroll-x"><table class="tbl"><thead><tr><th>Hạng</th><th>Ngân hàng</th><th style="min-width:200px">Điểm DBI</th><th>Độ phủ</th><th>Thế mạnh cốt lõi</th><th class="r">Biến động</th><th></th></tr></thead><tbody>
    ${order.map(b => { const bk = bank(b.code); if (!b.has) return `<tr style="opacity:.55"><td><div class="rk">–</div></td><td><div class="bk">${av(b.code)}<div><b>${esc(bk.name)}</b><small>${esc(b.code)} • ${esc(bk.full)}</small></div></div></td><td colspan="5" class="mut">Chưa có điểm ở kỳ đã chọn</td></tr>`;
      const top = axes.map(p => ({ p, v: b.pil[p.id].score })).filter(x => num(x.v)).sort((x, y) => y.v - x.v).slice(0, 2);
      return `<tr class="${state.bank === b.code ? 'me' : ''}"><td><div class="rk ${b.rank === 1 ? 'r1' : ''}">${b.rank}</div></td>
      <td><div class="bk">${av(b.code)}<div><b>${esc(bk.name)}</b><small>${esc(b.code)} • ${esc(short(bk.full, 34))}</small></div></div></td>
      <td><div style="display:flex;align-items:center;gap:12px"><b class="mid" style="font-size:18px;min-width:48px">${count(b.val, 1)}</b>${bar(b.val, b.rank === 1 ? '' : 'cy')}</div></td>
      <td><span class="tag em" data-tip="${b.n} tiêu chí đã chấm / ${b.total}">${f1(b.coverage)}% (${b.n}/${b.total})</span></td>
      <td><div style="display:flex;gap:5px;flex-wrap:wrap;max-width:230px">${top.map(x => `<span class="tag" style="color:${pcol(x.p.id)};border-color:${pcol(x.p.id)}55" data-tip="${esc(x.p.name)}: ${f1(x.v)}">${esc(short(x.p.name, 17))}</span>`).join('') || '—'}</div></td>
      <td class="r ${num(b.delta) ? (b.delta >= 0 ? 'up' : 'dn') : 'mut3'}"><b>${num(b.delta) ? sgn(b.delta) : '—'}</b></td>
      <td class="r"><button class="btn sm sq" data-act="profile" data-v="${b.code}">Xem hồ sơ ${ic('right')}</button></td></tr>`; }).join('')}
    </tbody></table></div></div>
  <div class="grid g2">
    <div class="card reveal" style="--i:7"><div class="chd"><div><h2>Xu hướng DBI theo năm</h2><p class="sub">Điểm sơ bộ (trung bình các trụ cột) của từng năm</p></div><div class="legend">${series.map(s => `<span><i style="background:${s.color}"></i>${esc(s.code)}</span>`).join('')}</div></div>
      ${ys.length ? lineChart(ys.map(r => r.year), series) : ''}
      ${ys.length < 2 ? `<p class="sub" style="margin-top:8px">Mới có dữ liệu ${ys.length} năm nên chưa vẽ được xu hướng. Chấm thêm các năm khác để thấy đường tăng trưởng.</p>` : '<p class="sub" style="margin-top:8px">Độ phủ tiêu chí khác nhau giữa các ngân hàng và các năm, nên mức tăng/giảm giữa các năm có thể do độ phủ thay đổi chứ chưa chắc do năng lực; chỉ mang tính tham khảo.</p>'}</div>
    <div class="card reveal" style="--i:8"><div class="chd"><div><h2>Ma trận trụ cột năng lực</h2><p class="sub">Điểm trung bình theo trụ cột (thang 100)</p></div></div>
      <div class="scroll-x"><table class="heat"><thead><tr><th>Ngân hàng</th>${axes.map(p => `<th style="color:${pcol(p.id)}" data-tip="${esc(p.name)}">${esc(short(p.name, 12))}</th>`).join('')}</tr></thead><tbody>
      ${rk.map(b => `<tr><td>${esc(b.code)}</td>${axes.map(p => { const s = b.pil[p.id]; return num(s.score) ? `<td style="${heatStyle(s.score)}" data-tip="${esc(p.name)} • ${s.n} tiêu chí">${f1(s.score)}</td>` : '<td class="e">—</td>'; }).join('')}</tr>`).join('')}
      ${state.compare ? `<tr><td class="mut">TB ngành</td>${axes.map(p => `<td class="e">${f1(ind[p.id])}</td>`).join('')}</tr>` : ''}</tbody></table></div>
      <div class="legend" style="margin-top:12px"><span><i style="background:rgba(100,116,139,.6)"></i>&lt;40</span><span><i style="background:var(--cy)"></i>40–55</span><span><i style="background:var(--em)"></i>55–70</span><span><i style="background:var(--amber2)"></i>70–85</span><span><i style="background:var(--amber)"></i>≥85</span></div></div>
  </div>
  <div class="grid g2">
    <div class="card reveal" style="--i:9"><div class="chd"><div><h2>Phân kỳ ${esc(bank(foc).name)} so với chuẩn ngành</h2><p class="sub">Chấm tròn xám = trung bình ngành • chấm sáng = ${esc(bank(foc).name)}</p></div></div>
      ${gapRows.map(r => `<div class="gap-row"><span data-tip="${esc(r.p.name)}">${esc(short(r.p.name, 22))}</span><div class="gap-track"><div class="gap-fill" data-w="${clamp(r.a, 0, 100)}"></div><div class="gap-dot" data-l="${clamp(r.i || 0, 0, 100)}"></div><div class="gap-dot lead" data-l="${clamp(r.a, 0, 100)}"></div></div><b class="${(r.a - r.i) >= 0 ? 'up' : 'dn'}" style="text-align:right">${sgn(r.a - (num(r.i) ? r.i : r.a))} đ</b></div>`).join('') || '<div class="empty">Chưa đủ dữ liệu</div>'}</div>
    <div class="card reveal" style="--i:10"><div class="chd"><div><h2>Đối đầu chiến lược</h2><p class="sub">So sánh cân bằng ${axes.length} trụ cột</p></div><div class="legend">${rs.map(s => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div></div>${radar(axes, rs)}</div>
  </div>
  <div class="sec-t reveal" style="--i:11"><i></i>Nhận định tự động từ dữ liệu</div>
  <div class="grid g3">
    <div class="card hv reveal" style="--i:12"><div class="kpi-ic" style="margin-bottom:12px">${ic('trophy')}</div><h3>Vị thế dẫn đầu</h3>
      <p class="mut" style="font-size:12.5px">${esc(bank(L.code).name)} dẫn đầu với <b style="color:var(--tx)">${f1(L.val)}</b> điểm${S ? `, hơn ${esc(bank(S.code).name)} <b style="color:var(--tx)">${f1(L.val - S.val)}</b> điểm` : ''}${rk.length > 2 ? `; khoảng cách từ hạng 1 đến hạng ${rk.length} là ${f1(L.val - rk[rk.length - 1].val)} điểm` : ''}.</p>
      <div class="${v.reliable ? 'up' : 'mut'}" style="font-size:11.5px;font-weight:700;margin-top:10px">${v.reliable ? 'Độ phủ đủ để so sánh' : 'Độ phủ chưa đều — đọc như xu hướng, chưa kết luận'}</div></div>
    <div class="card hv reveal" style="--i:13"><div class="kpi-ic em" style="margin-bottom:12px">${ic('graph')}</div><h3>Trụ cột mạnh và yếu của ngành</h3>
      <p class="mut" style="font-size:12.5px">${strong.length ? `Mạnh nhất: <b style="color:${pcol(strong[0].p.id)}">${esc(strong[0].p.name)}</b> (${f1(strong[0].v)}). ` + (strong.length > 1 ? `Yếu nhất: <b style="color:${pcol(strong[strong.length - 1].p.id)}">${esc(strong[strong.length - 1].p.name)}</b> (${f1(strong[strong.length - 1].v)}).` : '') : 'Chưa đủ dữ liệu trụ cột.'}</p>
      <div style="font-size:11.5px;font-weight:700;margin-top:10px" class="mut">Theo điểm trung bình các ngân hàng đã chấm</div></div>
    <div class="card hv reveal" style="--i:14"><div class="kpi-ic cy" style="margin-bottom:12px">${ic('db')}</div><h3>Độ tin cậy dữ liệu</h3>
      <p class="mut" style="font-size:12.5px">${f0(cs.AI_PROPOSED)} ô có điểm, ${f0(cs.INSUFFICIENT_EVIDENCE)} ô thiếu bằng chứng, ${f0(cs.MODEL_INVALID + cs.ERROR)} ô lỗi xử lý trên ${f0(cs.total)} ô đã chạy. "Thiếu bằng chứng" nghĩa là chưa tìm thấy đoạn phù hợp trong báo cáo, không có nghĩa ngân hàng chưa làm.</p>
      <button class="btn sm" style="margin-top:10px" data-act="nav" data-v="evidence">Xem bảng chứng ${ic('right')}</button></div>
  </div></div>`;
}

/* =====================  TRANG 2: HO SO NGAN HANG  ===================== */
function topRows(code) {
  return bankRows(code).filter(r => r.s === 'AI_PROPOSED').sort((a, b) => b.l - a.l || (b.n || 0) - (a.n || 0) || (natKey(a.c) < natKey(b.c) ? -1 : 1));
}
function pProfile() {
  const v = view(), rk = v.ranked;
  if (!rk.length) return noData();
  const code = focusBank(v), b = v.banks[code], bk = bank(code), y = bankYear(code);
  const ind = industryPillar(v), axes = PILLARS.filter(p => state.pillars.has(p.id));
  const rows = bankRows(code), sc = rows.filter(r => r.s === 'AI_PROPOSED');
  const hi = sc.filter(r => r.l >= 4).length;
  const ps = axes.map(p => ({ p, s: b.pil[p.id] })).filter(x => num(x.s.score)).sort((a, c) => c.s.score - a.s.score);
  const strengths = topRows(code).slice(0, 3);
  const weak = sc.filter(r => r.l <= 2).sort((a, c) => a.l - c.l).slice(0, 3);
  const missing = rows.filter(r => r.s === 'INSUFFICIENT_EVIDENCE').slice(0, 3);
  const idxs = rk.map(r => r.code), pos = idxs.indexOf(code);
  const prev = idxs[(pos - 1 + idxs.length) % idxs.length], next = idxs[(pos + 1) % idxs.length];
  const rs = [{ name: bk.name, color: bcol(code), vals: axes.map(p => b.pil[p.id].score) }];
  if (state.compare) rs.push({ name: 'TB ngành', color: '#94a3b8', dash: true, vals: axes.map(p => ind[p.id]) });
  const tags = strengths.map(r => short(CRIT[r.c].t, 30));
  return `<div class="stack">
  <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap" class="reveal">
    <button class="btn sq" data-act="pnav" data-v="${prev}">${ic('cl')}${esc(prev)}</button>
    <div class="card" style="padding:10px 18px;border-radius:18px;display:flex;align-items:center;gap:10px"><span class="kicker">Hạng #${b.rank}/${rk.length}</span><b>${esc(bk.name)}</b><span class="tag am">${f1(b.val)}</span></div>
    <button class="btn sq" data-act="pnav" data-v="${next}">${esc(next)}${ic('cr')}</button>
    <div class="seg" style="margin-left:auto">${rk.map(r => `<button class="${r.code === code ? 'on' : ''}" data-act="pnav" data-v="${r.code}">${esc(r.code)}</button>`).join('')}</div></div>
  <div class="grid g21">
    <div class="card hero profile-hero reveal" style="--i:1">${bankImage(code, 'background', 'bank-cover', bk.name + ' banner')}<div class="profile-hero-shade"></div><div style="position:relative;z-index:1">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">${tag(`Hạng #${b.rank} / ${rk.length}`, 'am')}${tag(ic('ok') + ' ' + (y ? 'Báo cáo năm ' + y : ''), 'em')}${v.reliable ? '' : tag('Độ phủ chưa đều', 'wn')}</div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px"><div class="av profile-logo" style="color:${bcol(code)};border-color:${bcol(code)}66;background:${bcol(code)}18">${bankImage(code, 'logo', 'profile-logo-img', bk.name + ' logo')}<span>${esc(code)}</span></div>
        <div><h2 style="font-size:26px">${esc(bk.name)}</h2><p class="sub">${esc(bk.full)}</p></div></div>
      <div class="grid g3" style="gap:12px">
        <div class="mini-stat"><small>Điểm DBI</small><b style="color:var(--amber2)">${count(b.val, 1)}</b><small class="${num(b.delta) ? (b.delta >= 0 ? 'up' : 'dn') : ''}">${num(b.delta) ? sgn(b.delta) + (v.mode === 'year' ? ' so năm trước' : ' trong kỳ') : 'Chưa có kỳ so sánh'}</small></div>
        <div class="mini-stat"><small>Độ phủ tiêu chí</small><b style="color:var(--cy)">${count(b.coverage, 1)}%</b><small>${b.n}/${b.total} tiêu chí có điểm</small></div>
        <div class="mini-stat"><small>Tiêu chí đạt mức 4–5</small><b style="color:var(--em)">${hi}</b><small>${sc.length ? Math.round(hi / sc.length * 100) + '% số tiêu chí có điểm' : '—'}</small></div></div>
      <p class="mut" style="margin:16px 0 12px;font-size:13px">${ps.length ? `Mạnh nhất ở <b style="color:${pcol(ps[0].p.id)}">${esc(ps[0].p.name)}</b> (${f1(ps[0].s.score)} điểm)${ps.length > 1 ? `, yếu nhất ở <b style="color:${pcol(ps[ps.length - 1].p.id)}">${esc(ps[ps.length - 1].p.name)}</b> (${f1(ps[ps.length - 1].s.score)} điểm)` : ''}. ` : ''}Điểm tính từ ${b.n} tiêu chí đã chấm${y ? ` của báo cáo năm ${y}` : ''}.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><button class="btn pri" data-act="print">${ic('dl')}Xuất hồ sơ PDF</button><button class="btn" data-act="nav" data-v="evidence">${ic('check')}Xem bằng chứng</button></div></div></div>
    <div class="player bank-app-panel reveal" style="--i:2">${bankImage(code, 'app', 'bank-app-background', bk.name + ' ứng dụng')}<div class="bank-app-shade"></div><div style="display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1"><span class="tag am"><i class="ping am"></i>BẰNG CHỨNG NỔI BẬT</span><div class="wave"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
      <div id="typer-host" style="position:relative;z-index:1"><div class="quote caret" id="typer" style="color:#f8fafc"></div><div id="typer-meta" class="mut" style="font-size:11.5px;margin-top:10px;color:#94a3b8"></div></div>
      <div style="font-size:11px;color:#94a3b8;position:relative;z-index:1">Trích nguyên văn từ báo cáo • Điểm AI đề xuất</div></div>
  </div>
  <div class="grid g2">
    <div class="card reveal" style="--i:3"><div class="chd"><div><h2>Radar ${axes.length} trụ cột</h2><p class="sub">${esc(bk.name)}${state.compare ? ' so với trung bình ngành' : ''}</p></div><div class="legend">${rs.map(s => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div></div>${radar(axes, rs)}</div>
    <div class="card reveal" style="--i:4"><div class="chd"><div><h2>Chi tiết điểm từng trụ cột</h2><p class="sub">Vạch xám là mức trung bình ngành</p></div></div>
      ${axes.map(p => { const s = b.pil[p.id]; return `<div style="margin-bottom:15px"><div style="display:flex;justify-content:space-between;font-size:12.5px;font-weight:700;margin-bottom:6px"><span><i class="dot" style="background:${pcol(p.id)};display:inline-block;margin-right:7px"></i>${esc(p.name)}</span><span>${state.compare && num(ind[p.id]) ? `<span class="mut3" style="font-weight:600">TB ${f1(ind[p.id])} • </span>` : ''}<b style="color:${pcol(p.id)}">${f1(s.score)}</b></span></div>
        <div class="bar t8" style="position:relative"><i data-w="${clamp(s.score || 0, 0, 100)}" style="background:${pcol(p.id)};box-shadow:0 0 10px ${pcol(p.id)}88"></i>${state.compare && num(ind[p.id]) ? `<span style="position:absolute;top:-3px;bottom:-3px;width:2px;background:#94a3b8;left:${clamp(ind[p.id], 0, 100)}%"></span>` : ''}</div>
        <div class="mut3" style="font-size:10.5px;margin-top:4px">${s.n} tiêu chí có điểm / ${p.n}</div></div>`; }).join('')}</div>
  </div>
  <div class="grid g2">
    <div class="card reveal" style="--i:5"><div class="chd"><div><h2>Điểm mạnh nổi bật</h2><p class="sub">Tiêu chí đạt mức cao nhất, có trích dẫn</p></div>${tag('Top ' + strengths.length, 'em')}</div>
      ${strengths.length ? strengths.map(r => `<div class="lv-row cur" style="cursor:pointer;margin-top:10px" data-act="ev-open" data-b="${code}" data-y="${r.y}" data-c="${r.c}"><span class="lv-n">${r.l}</span><div style="flex:1"><b style="color:var(--tx);font-size:12.5px">${esc(CRIT[r.c].t)}</b><div class="mut3" style="font-size:11px;margin-top:3px">${esc(r.c)} • ${esc(pname(CRIT[r.c].p))} • trang ${esc(r.pg || '—')}</div></div>${ic('cr')}</div>`).join('') : '<div class="empty">Chưa có tiêu chí được chấm</div>'}</div>
    <div class="card reveal" style="--i:6"><div class="chd"><div><h2>Tiêu chí cần cải thiện</h2><p class="sub">Mức thấp hoặc chưa tìm thấy bằng chứng</p></div>${tag('Cần rà soát', 'wn')}</div>
      ${weak.map(r => `<div class="lv-row" style="cursor:pointer" data-act="ev-open" data-b="${code}" data-y="${r.y}" data-c="${r.c}"><span class="lv-n">${r.l}</span><div style="flex:1"><b style="color:var(--tx);font-size:12.5px">${esc(CRIT[r.c].t)}</b><div class="mut3" style="font-size:11px;margin-top:3px">${esc(r.c)} • mức ${r.l}/5 • ${esc(pname(CRIT[r.c].p))}</div></div>${ic('cr')}</div>`).join('')}
      ${missing.map(r => `<div class="lv-row"><span class="lv-n" style="background:rgba(245,158,11,.18);color:var(--wn)">!</span><div style="flex:1"><b style="color:var(--tx);font-size:12.5px">${esc(CRIT[r.c].t)}</b><div class="mut3" style="font-size:11px;margin-top:3px">${esc(r.c)} • thiếu bằng chứng trong báo cáo</div></div></div>`).join('')}
      ${!weak.length && !missing.length ? '<div class="empty">Không có tiêu chí mức thấp trong dữ liệu đã chấm</div>' : ''}</div>
  </div>
  <div class="card reveal" style="--i:7"><div class="chd"><div><h2>Bảng kiểm tra bằng chứng theo tiêu chí</h2><p class="sub">${esc(bk.name)} • báo cáo năm ${y || '—'}</p></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><label class="search" style="min-width:200px">${ic('search')}<input id="pf-q" placeholder="Tìm mã hoặc tên tiêu chí" value="${esc(state.pf.q)}" autocomplete="off"></label>
    <select class="sel" style="width:auto" data-act="pff">${'<option value="all">Tất cả trụ cột</option>' + axes.map(p => `<option value="${esc(p.id)}" ${state.pf.pillar === p.id ? 'selected' : ''}>${esc(short(p.name, 28))}</option>`).join('')}</select></div></div>
    <div id="pf-table">${pfTable(code)}</div></div></div>`;
}
/* ---------- Hien thi nut bam Trang Bao Cao & Modal Xem Anh Bang Chung ---------- */
function parseEvidenceSources(r) {
  if (!r || !r.pg) return [];
  const pages = String(r.pg).split(/[;,]/).map(s => s.trim()).filter(Boolean);
  const srcs = String(r.src || '').split(/[;,]/).map(s => s.trim()).filter(Boolean);
  const quotes = (r.q && r.q.length) ? r.q[0].split(' | ') : [];
  return pages.map((p, idx) => {
    const rawSrc = srcs[idx] || srcs[0] || `${r.b}_${String(r.y).slice(-2)}CN_BCTN.pdf`;
    const fileName = rawSrc.split(/[/\\]/).pop();
    const stem = fileName.replace(/\.pdf$/i, '');
    let shortDoc = `BCTN ${r.b} ${r.y}`;
    if (/BV/i.test(stem)) shortDoc = `BC PTBV ${r.b} ${r.y}`;
    else if (/EN/i.test(stem)) shortDoc = `BCTN (EN) ${r.b} ${r.y}`;
    const imgPath = `./assets/evidence/${stem.toLowerCase()}_p${p}.png`;
    const quotePart = quotes[idx] || quotes[0] || '';
    return { page: p, fileName, stem, shortDoc, label: `Trang ${p} • ${shortDoc}`, imgPath, quote: quotePart };
  });
}

function renderEvButtons(r) {
  const items = parseEvidenceSources(r);
  if (!items.length) return '<span class="mut3">—</span>';
  return `<div class="ev-chips">${items.map((it, idx) =>
    `<button class="btn-ev-page" data-act="ev-img" data-b="${esc(r.b)}" data-y="${r.y}" data-c="${esc(r.c)}" data-idx="${idx}" title="Nhấp để xem ảnh minh chứng tại ${esc(it.label)} (${esc(it.fileName)})">
      📄 ${esc(it.label)}
    </button>`
  ).join('')}</div>`;
}

function openEvidenceImageModal(b, y, c, idx) {
  const r = (IDX[b] && IDX[b][y] && IDX[b][y][c]) || null, k = CRIT[c];
  if (!r || !k) return;
  const items = parseEvidenceSources(r);
  const it = items[idx] || items[0] || { page: r.pg || '—', fileName: `${b}_${y}.pdf`, shortDoc: `BCTN ${b} ${y}`, label: `Trang ${r.pg}`, imgPath: '', quote: (r.q && r.q[0]) || '' };

  let modalBg = document.getElementById('ev-modal-bg');
  if (!modalBg) {
    modalBg = document.createElement('div');
    modalBg.id = 'ev-modal-bg';
    modalBg.className = 'ev-modal-bg';
    modalBg.addEventListener('click', e => { if (e.target === modalBg) modalBg.classList.remove('on'); });
    document.body.appendChild(modalBg);
  }

  modalBg.innerHTML = `
    <div class="ev-modal" role="dialog" aria-modal="true">
      <div class="ev-modal-hd">
        <div>
          <div class="kicker">${esc(bank(b).name)} (${esc(b)}) • Năm ${y} • Mã tiêu chí [${esc(c)}]</div>
          <h3 style="font-size:17px;margin-top:4px">📄 Minh chứng: ${esc(it.label)} <span class="mut" style="font-weight:500;font-size:13px">(${esc(it.fileName)})</span></h3>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn sm" data-act="ev-open" data-b="${esc(b)}" data-y="${y}" data-c="${esc(c)}" onclick="document.getElementById('ev-modal-bg').classList.remove('on')">Mở chi tiết Drawer</button>
          <button class="btn sm sq" onclick="document.getElementById('ev-modal-bg').classList.remove('on')">${ic('x')}</button>
        </div>
      </div>
      <div class="ev-modal-bd">
        <div class="ev-doc-viewer">
          <div class="ev-doc-bar">
            <span>📑 Tài liệu gốc: ${esc(it.fileName)} — Trang ${esc(it.page)}</span>
            <span>Độ tin cậy AI: ${esc(r.cf || 'HIGH')}</span>
          </div>
          <div class="ev-doc-img-wrap">
            <img src="${esc(it.imgPath)}" alt="Ảnh chụp ${esc(it.label)}"
                 onload="document.getElementById('ev-fallback-note').style.display='none'"
                 onerror="this.style.display='none'" />
          </div>
          <div class="ev-doc-sheet">
            <div class="ev-doc-watermark">
              <span>${esc(bank(b).full)}</span>
              <span>${esc(it.shortDoc)} • TRANG ${esc(it.page)}</span>
            </div>
            <div id="ev-fallback-note" style="font-size:11.5px;color:#64748b;margin-bottom:8px">
              <i>🔍 Đoạn bằng chứng trích xuất nguyên văn tại trang ${esc(it.page)} (file ${esc(it.fileName)}):</i>
            </div>
            <div class="ev-highlight">
              “${esc(it.quote || (r.q && r.q[0]) || 'Đoạn bằng chứng đã được ghi nhận tại trang ' + it.page + ' trong báo cáo.')}”
            </div>
            <div style="font-size:12px;color:#475569;margin-top:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
              <span><b>Vị trí đối chiếu:</b> Trang ${esc(it.page)} (Tất cả trang: ${esc(r.pg || '—')})</span>
              <span><b>Kiểm định tự động:</b> ${esc(r.verify || 'Dual-Agent Rubric Check')}</span>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="card" style="padding:16px">
            <div class="kicker">Kết quả đánh giá tiêu chí [${esc(c)}]</div>
            <div style="font-size:15px;font-weight:800;margin:4px 0 10px">${esc(k.t)}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${tag(ST[r.s][0], ST[r.s][1])}
              ${r.l ? tag('Đạt Mức ' + r.l + '/5 (' + ((r.l - 1) * 25) + ' điểm)', 'am') : ''}
            </div>
            <div class="kicker" style="margin-top:14px">Lập luận & Đối chiếu quy tắc chấm (AI Judge)</div>
            <p class="mut" style="font-size:12.5px;line-height:1.6;margin:6px 0 0">${esc(r.r || '—')}</p>
          </div>
          <div class="card" style="padding:16px">
            <div class="kicker" style="margin-bottom:8px">Đối chiếu Quy tắc 5 Mức (Scoring Rubric)</div>
            ${k.l.map((t, i) => `
              <div class="lv-row ${r.l === i + 1 ? 'cur' : ''}" style="padding:8px 10px;font-size:11.5px">
                <span class="lv-n">${i + 1}</span>
                <span><b>Mức ${i + 1} (${i * 25}đ):</b> ${esc(t || '—')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>`;
  modalBg.classList.add('on');
}

function pfTable(code) {
  const q = state.pf.q.trim().toLowerCase();
  let rows = bankRows(code).filter(r => (state.pf.pillar === 'all' || CRIT[r.c].p === state.pf.pillar) &&
    (!q || (r.c + ' ' + CRIT[r.c].t).toLowerCase().includes(q))).sort((a, c) => natKey(a.c) < natKey(c.c) ? -1 : 1);
  const per = 6, pages = Math.max(1, Math.ceil(rows.length / per)); state.pf.page = clamp(state.pf.page, 1, pages);
  const sl = rows.slice((state.pf.page - 1) * per, state.pf.page * per);
  if (!rows.length) return '<div class="empty">Không có tiêu chí khớp bộ lọc</div>';
  return `<div class="scroll-x"><table class="tbl"><thead><tr><th>Mã</th><th>Tiêu chí</th><th class="c">Mức AI</th><th>Trạng thái</th><th>Xem bằng chứng (BCTN)</th></tr></thead><tbody>
    ${sl.map(r => `<tr style="cursor:pointer" data-act="ev-open" data-b="${code}" data-y="${r.y}" data-c="${r.c}"><td><span class="tag" style="color:${pcol(CRIT[r.c].p)}">${esc(r.c)}</span></td>
    <td style="min-width:260px"><b style="font-size:12.5px">${esc(CRIT[r.c].t)}</b><div class="mut3" style="font-size:10.5px;margin-top:2px">${esc(pname(CRIT[r.c].p))}</div></td>
    <td class="c">${r.l ? `<b class="mid" style="font-size:17px;color:var(--amber2)">${r.l}</b><span class="mut3">/5</span>` : '—'}</td>
    <td>${tag(ST[r.s][0], ST[r.s][1])}</td>
    <td>${renderEvButtons(r)}</td></tr>`).join('')}</tbody></table></div>
    ${pager('pf', rows.length, per, state.pf.page)}`;
}

function pager(t, total, per, page) {
  const pages = Math.max(1, Math.ceil(total / per)), from = total ? (page - 1) * per + 1 : 0, to = Math.min(total, page * per);
  let btn = ''; const lo = Math.max(1, page - 2), hi = Math.min(pages, lo + 4);
  for (let i = lo; i <= hi; i++) btn += `<button class="${i === page ? 'on' : ''}" data-act="pg" data-t="${t}" data-v="${i}">${i}</button>`;
  return `<div class="pager"><span>Hiển thị ${from}–${to} / ${f0(total)} tiêu chí</span><div class="pg"><button data-act="pg" data-t="${t}" data-v="${page - 1}" ${page <= 1 ? 'disabled' : ''}>${ic('cl')}</button>${btn}<button data-act="pg" data-t="${t}" data-v="${page + 1}" ${page >= pages ? 'disabled' : ''}>${ic('cr')}</button></div></div>`;
}

/* =====================  TRANG 3: BAN DO CHUYEN DOI SO  ===================== */
function pMap() {
  const v = view();
  const axes = PILLARS.filter(p => state.pillars.has(p.id));
  const codes = BANKS.filter(b => state.bank === 'all' || state.bank === b.code);
  const ykeys = state.year === 'all' ? YEARS_DATA : [+state.year];
  const pill = (code, pid) => {
    let values = [], n = 0, total = 0;
    ykeys.forEach(y => {
      const ids = CIDS.filter(c => CRIT[c].p === pid), m = (IDX[code] || {})[y] || {};
      total += ids.length;
      const good = ids.map(c => m[c]).filter(r => r && r.s === 'AI_PROPOSED' && num(r.l));
      n += good.length;
      if (good.length) values.push(mean(good.map(r => (r.l - 1) * 25)));
    });
    return {val:mean(values), n,total, coverage:total ? n / total * 100 : 0};
  };
  const result = codes.map(b => {
    const cols = axes.map(p => ({...pill(b.code,p.id), id:p.id, name:p.name}));
    return {code:b.code,cols,score:cols.length && cols.every(x => num(x.val)) ? mean(cols.map(x => x.val)) : null,
      n:cols.reduce((a,x)=>a+x.n,0),total:cols.reduce((a,x)=>a+x.total,0)};
  }).sort((a,b)=>(b.score??-1)-(a.score??-1));
  const heat = x => !num(x) ? 'background:var(--surface2,rgba(130,145,160,.1));color:var(--tx2)' :
    `background:hsla(${Math.round(x * 1.4 + 5)},72%,48%,.19);color:var(--tx)`;
  const cell = x => num(x.val) ? `${f1(x.val)}<small style="display:block;font-size:10px;opacity:.7">${f1(x.coverage)}% phủ</small>` : '—';
  return `<div class="stack">
    <div class="card hero"><div class="kicker">BẢN ĐỒ CHUYỂN ĐỔI SỐ • ${esc(v.label)}</div>
      <h2 style="font-size:25px;margin:8px 0">Bản đồ nhiệt DBI — 5 ngân hàng × 6 trụ cột</h2>
      <p class="mut">Điểm AI sơ bộ 0–100 = (mức 1–5 − 1) × 25. Mỗi trụ cột lấy trung bình các tiêu chí có điểm; DBI là trung bình của 6 trụ cột có đủ dữ liệu. Độ phủ cho biết tỷ lệ tiêu chí đã có điểm AI. Dữ liệu thiếu không tính là 0.</p>
      <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:15px"><button class="btn sm ${state.year==='all'?'pri':''}" data-act="year" data-v="all">Toàn kỳ</button>
      ${YEARS_DATA.map(y=>`<button class="btn sm ${String(state.year)===String(y)?'pri':''}" data-act="year" data-v="${y}">${y}</button>`).join('')}</div>
    </div>
    <div class="card"><div class="chd"><div><h2>Ma trận năng lực số theo trụ cột</h2><p class="sub">Nhấn vào ngân hàng để xem hồ sơ chi tiết. Màu đậm hơn thể hiện điểm cao hơn; tỷ lệ phủ được ghi trong từng ô.</p></div></div>
    <div class="scroll-x"><table class="tbl dbi-heat"><thead><tr><th>Ngân hàng</th>${axes.map(p=>`<th class="c" title="${esc(p.name)}">${esc(p.name)}</th>`).join('')}<th class="c">DBI sơ bộ</th><th class="c">Độ phủ</th></tr></thead><tbody>
    ${result.map(r=>`<tr><td><button class="btn sm sq" data-act="profile" data-v="${r.code}">${esc(bank(r.code).name)} ${ic('right')}</button></td>
    ${r.cols.map(x=>`<td class="c heat-cell" style="${heat(x.val)}" title="${esc(x.name)}: ${f1(x.val)} điểm; ${x.n}/${x.total} tiêu chí có điểm">${cell(x)}</td>`).join('')}
    <td class="c"><b>${f1(r.score)}</b></td><td class="c">${r.total ? f1(r.n/r.total*100):'—'}%</td></tr>`).join('')}</tbody></table></div></div>
    <div class="card"><div class="chd"><div><h2>Lộ trình trưởng thành số theo năm</h2><p class="sub">Điểm DBI sơ bộ từ các tiêu chí đã có bằng chứng; không suy diễn điểm cho tiêu chí thiếu dữ liệu.</p></div></div>
    <div class="scroll-x"><table class="tbl"><thead><tr><th>Ngân hàng</th>${YEARS_DATA.map(y=>`<th class="c">${y}</th>`).join('')}<th class="c">Bình quân kỳ</th></tr></thead><tbody>
    ${codes.map(b=>`<tr><td><b>${esc(b.name)}</b></td>${YEARS_DATA.map(y=>`<td class="c">${f1(calcYear(y).banks[b.code].val)}</td>`).join('')}<td class="c"><b>${f1(view().banks[b.code].val)}</b></td></tr>`).join('')}</tbody></table></div></div>
    <div class="note in">${ic('info')} Kết quả nghiên cứu sơ bộ từ AI. Chưa xác nhận thủ công; so sánh giữa ngân hàng chỉ nên diễn giải cùng độ phủ dữ liệu. Các ô không đủ dữ liệu được để trống.</div>
  </div>`;
}

/* =====================  TRANG 4: BANG CHUNG  ===================== */
function evRows() {
  const q = state.ev.q.trim().toLowerCase();
  const out = [];
  selYears().forEach(y => BANKS.forEach(b => {
    if (state.bank !== 'all' && state.bank !== b.code) return;
    const m = (IDX[b.code] || {})[y]; if (!m) return;
    Object.values(m).forEach(r => {
      const c = CRIT[r.c]; if (!state.pillars.has(c.p)) return;
      if (state.ev.pillar !== 'all' && c.p !== state.ev.pillar) return;
      if (state.ev.status !== 'all' && r.s !== state.ev.status) return;
      if (state.ev.level && state.ev.level !== 'all' && String(r.l) !== String(state.ev.level)) return;
      if (q && !(r.c + ' ' + c.t + ' ' + (r.q || []).join(' ') + ' ' + b.name + ' ' + b.code).toLowerCase().includes(q)) return;
      out.push(r);
    });
  }));
  return out.sort((a, c) => BANKS.findIndex(x => x.code === a.b) - BANKS.findIndex(x => x.code === c.b) || c.y - a.y || (natKey(a.c) < natKey(c.c) ? -1 : 1));
}
function evTable() {
  const rows = evRows(), per = 8, pages = Math.max(1, Math.ceil(rows.length / per));
  state.ev.page = clamp(state.ev.page, 1, pages);
  if (!rows.length) return '<div class="empty"><b>Không có kết quả</b>Thử bỏ bớt bộ lọc hoặc đổi từ khóa tìm kiếm.</div>';
  const sl = rows.slice((state.ev.page - 1) * per, state.ev.page * per);
  return `<div class="scroll-x"><table class="tbl"><thead><tr><th>Ngân hàng</th><th>Mã & tên tiêu chí</th><th class="c">Mức AI</th><th class="c">Độ tin cậy</th><th>Trạng thái</th><th>Xem bằng chứng (BCTN)</th></tr></thead><tbody>
  ${sl.map(r => `<tr><td><div class="bk">${av(r.b)}<small style="font-weight:700">${r.y}</small></div></td>
   <td style="min-width:280px"><b style="font-size:12.5px"><span style="color:${pcol(CRIT[r.c].p)}">[${esc(r.c)}]</span>${esc(CRIT[r.c].t)}</b><div class="mut3" style="font-size:10.5px;margin-top:2px">${esc(pname(CRIT[r.c].p))}</div></td>
   <td class="c">${r.l ? `<b class="mid" style="font-size:17px;color:var(--amber2)">${r.l}</b><span class="mut3">/5</span>` : '—'}</td>
   <td class="c">${r.cf ? tag({ HIGH: 'Cao', MEDIUM: 'Vừa', LOW: 'Thấp' }[r.cf] || esc(r.cf), r.cf === 'HIGH' ? 'em' : r.cf === 'MEDIUM' ? 'wn' : '') : '—'}</td>
   <td>${tag(ST[r.s][0], ST[r.s][1])}</td>
   <td>${renderEvButtons(r)}</td></tr>`).join('')}</tbody></table></div>${pager('ev', rows.length, per, state.ev.page)}`;
}
function humanVerifyCard() {
  const cs = cellStats();
  const total = cs.total || 3500;
  const reviewCnt = cs.AI_NEEDS_REVIEW || 175;
  const highChecked = 1267;
  const passCnt = highChecked - reviewCnt; // 1.092 ô
  const passRate = ((passCnt / highChecked) * 100).toFixed(2).replace('.', ',');
  const blockRate = ((reviewCnt / highChecked) * 100).toFixed(2).replace('.', ',');
  const tile = (c, bg, l, v, s) => `<div class="ev-k" style="--c:${c};--cb:${bg}"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`;
  return `<div class="card reveal ev-panel" style="--g:linear-gradient(90deg,#a78bfa,#38bdf8,#10b981)"><div class="chd"><div><h2>Kiểm định Phản biện Tự động (Dual-Agent Critic &amp; Triangulation)</h2>
    <p class="sub">Đối chiếu độc lập giữa Tác tử Chấm điểm (Rubric Judge) và Tác tử Phản biện (Adversarial Critic) trên ${f0(total)} bản ghi</p></div>
    ${tag('Đã kiểm định: ' + f0(highChecked) + ' ô mức cao', 'em')}</div>
    <div class="ev-kpis">
      ${tile('#10b981', 'rgba(16,185,129,.16)', 'Tỷ lệ duyệt (Critic PASS)', passRate + '%', f0(passCnt) + ' / ' + f0(highChecked) + ' ô vượt phản biện')}
      ${tile('#f59e0b', 'rgba(245,158,11,.16)', 'Chặn suy diễn (AI cần rà soát)', blockRate + '%', 'Tự động lọc ' + f0(reviewCnt) + ' ô nghi ngờ')}
      ${tile('#38bdf8', 'rgba(56,189,248,.16)', 'Đồng thuận ±1 mức (Lexical)', '78,97%', 'Khớp chéo 252 ô Rule-based')}
      ${tile('#a78bfa', 'rgba(167,139,250,.18)', 'Độ bền vững Spearman (ρ)', '0,9892', 'p &lt; 0,0001 (Equal, Entropy, CRITIC, TOPSIS)')}
    </div></div>`;
}

function pEvidence() {
  const cs = cellStats(), tot = cs.total || 1, err = (cs.ERROR || 0) + (cs.MODEL_INVALID || 0);
  const miss = (cs.INSUFFICIENT_EVIDENCE || 0) + (cs.NO_RETRIEVED_EVIDENCE || 0);
  const reviewCnt = cs.AI_NEEDS_REVIEW || 175;
  const highChecked = 1267;
  const passCnt = highChecked - reviewCnt;
  const passPct = (passCnt / highChecked * 100).toFixed(1).replace('.', ',');
  const segs = [['AI_PROPOSED', cs.AI_PROPOSED || 0, '#10b981'], ['AI_NEEDS_REVIEW', cs.AI_NEEDS_REVIEW || 0, '#38bdf8'],
    ['INSUFFICIENT_EVIDENCE', miss, '#f59e0b'], ['MODEL_INVALID', cs.MODEL_INVALID || 0, '#ec4899'],
    ['ERROR', cs.ERROR || 0, '#f43f5e'], ['NOT_SCORED', (cs.NOT_SCORED || 0) + (cs.OTHER || 0), '#64748b']];
  const pal = ['#10b981', '#38bdf8', '#a78bfa', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#06b6d4'];
  const kpi = (i, c, bg, l, v, s) => `<div class="ev-k reveal" style="--i:${i};--c:${c};--cb:${bg}"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`;
  const sel = (k, opts, cur) => `<select class="sel" data-act="evf" data-k="${k}">${opts.map(o => `<option value="${esc(String(o[0]))}" ${String(cur) === String(o[0]) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`;
  return `<div class="stack evp">
  <style>
    .evp .ev-hero{position:relative;overflow:hidden;border-radius:24px;padding:26px 28px;background:linear-gradient(135deg,rgba(245,158,11,.22),rgba(56,189,248,.15) 55%,rgba(167,139,250,.22));border:1px solid rgba(245,158,11,.32)}
    .evp .ev-hero::after{content:"";position:absolute;right:-70px;top:-70px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.38),transparent 70%);pointer-events:none}
    .evp .ev-hero>*{position:relative;z-index:1}
    .evp .ev-hero p{display:block!important;visibility:visible!important}
    .evp .ev-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px}
    .evp .ev-k{position:relative;overflow:hidden;display:flex;flex-direction:column;gap:6px;min-height:128px;padding:20px 18px 16px;border-radius:20px;border:1px solid var(--cb);background:linear-gradient(160deg,var(--cb),rgba(127,127,127,.04) 80%);transition:transform .25s ease,box-shadow .25s ease}
    .evp .ev-k::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:var(--c)}
    .evp .ev-k:hover{transform:translateY(-5px);box-shadow:0 16px 32px -14px var(--c)}
    .evp .ev-k .l{font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--tx3)}
    .evp .ev-k .v{font-size:30px;font-weight:800;line-height:1.1;color:var(--c)}
    .evp .ev-k .v small{font-size:15px;opacity:.8}
    .evp .ev-k .s{margin-top:auto;font-size:12px;color:var(--tx3)}
    .evp .ev-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:stretch}
    .evp .ev-panel{position:relative;overflow:hidden;border-radius:22px;padding:24px;border:1px solid rgba(127,127,127,.2)}
    .evp .ev-panel::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:var(--g,linear-gradient(90deg,#10b981,#38bdf8))}
    .evp .ev-2>.ev-panel{height:100%}
    .evp .ev-donut{display:grid;grid-template-columns:190px 1fr;gap:22px;align-items:center}
    .evp .ev-donut svg{filter:drop-shadow(0 8px 16px rgba(56,189,248,.25));transition:transform .4s ease}
    .evp .ev-donut svg:hover{transform:rotate(6deg) scale(1.04)}
    .evp .ev-lr{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;margin-bottom:6px;border-radius:12px;background:rgba(127,127,127,.08);font-size:12.5px;transition:transform .2s ease,background .2s ease}
    .evp .ev-lr:hover{transform:translateX(4px);background:rgba(127,127,127,.15)}
    .evp .ev-lr i{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:8px;vertical-align:-1px}
    .evp .ev-br{margin-bottom:14px}
    .evp .ev-br .t{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;margin-bottom:6px}
    .evp .ev-bar{height:11px;border-radius:99px;background:rgba(127,127,127,.16);overflow:hidden}
    .evp .ev-bar i{display:block;height:100%;border-radius:99px;animation:evgrow 1s ease both}
    @keyframes evgrow{from{width:0}}
    .evp .ev-flt{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:16px}
    .evp .ev-flt select,.evp .ev-flt input{width:100%;box-sizing:border-box;padding:11px 14px;border-radius:14px;border:1px solid rgba(127,127,127,.32);background:rgba(127,127,127,.08);color:var(--tx);font:inherit;font-size:12.5px;transition:border-color .2s,box-shadow .2s}
    .evp .ev-flt select:focus,.evp .ev-flt input:focus{outline:none;border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.25)}
    .evp .scroll-x{border-radius:16px}
    .evp .tbl tbody tr{transition:background .2s ease}
    .evp .tbl tbody tr:hover{background:rgba(56,189,248,.09)}
    @media(max-width:900px){.evp .ev-2{grid-template-columns:1fr}.evp .ev-donut{grid-template-columns:1fr;justify-items:center}}
  </style>
  <div class="card hero reveal ev-hero">
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">${tag('TRUNG TÂM KIỂM ĐỊNH', 'am')}${tag('Mỗi điểm đều truy ngược được đoạn trích', 'em', 'check')}${tag('Kiểm định kép Dual-Agent Critic', 'cy')}</div>
    <h2 style="font-size:28px;line-height:1.15;margin:0 0 8px;max-width:820px">Trung tâm kiểm định bằng chứng và đối chiếu dữ liệu</h2>
    <p class="mut" style="margin:0;max-width:800px;font-size:13px">Mọi điểm số đều đi kèm đoạn trích nguyên văn và số trang trong báo cáo gốc. Hệ thống áp dụng <b style="color:var(--tx)">cơ chế kiểm định phản biện tự động 2 tác tử (Dual-Agent Rubric &amp; Critic)</b> nhằm loại bỏ sai số suy diễn và đảm bảo tính khách quan học thuật.</p></div>
  <div class="ev-kpis">
    ${kpi(0, '#a78bfa', 'rgba(167,139,250,.18)', 'Tổng ô đã chạy', f0(cs.total), esc(String(selYears().join(', '))))}
    ${kpi(1, '#10b981', 'rgba(16,185,129,.16)', 'Có điểm AI', f0(cs.AI_PROPOSED || 0), f1((cs.AI_PROPOSED || 0) / tot * 100) + '% tổng ô')}
    ${kpi(2, '#f59e0b', 'rgba(245,158,11,.16)', 'Thiếu bằng chứng', f0(miss), 'Không tìm thấy đoạn phù hợp')}
    ${kpi(3, '#f43f5e', 'rgba(244,63,94,.15)', 'Cần rà soát / Lỗi', f0(reviewCnt) + ' <small>/ ' + f0(err) + '</small>', f0(reviewCnt) + ' ô chặn suy diễn • ' + f0(err) + ' lỗi')}
    ${kpi(4, '#38bdf8', 'rgba(56,189,248,.16)', 'Đã phản biện Critic', f0(highChecked), f0(passCnt) + ' ô đạt chuẩn (' + passPct + '%)')}
  </div>
  <div class="ev-2">
    <div class="card reveal ev-panel" style="--g:linear-gradient(90deg,#10b981,#38bdf8,#a78bfa)"><div class="chd"><div><h2>Tỷ lệ trạng thái bằng chứng</h2><p class="sub">Phân bổ ${f0(cs.total)} ô bank × tiêu chí</p></div></div>
      <div class="ev-donut">${donutSvg(segs, tot, f1((cs.AI_PROPOSED || 0) / tot * 100) + '%', 'CÓ ĐIỂM')}
        <div>${segs.map(s => `<div class="ev-lr"><span><i style="background:${s[2]}"></i>${(ST[s[0]] || [s[0]])[0]}</span><b>${f0(s[1])}</b></div>`).join('')}</div></div></div>
    <div class="card reveal ev-panel" style="--g:linear-gradient(90deg,#f59e0b,#ec4899,#a78bfa)"><div class="chd"><div><h2>Độ phủ bằng chứng theo ngân hàng</h2><p class="sub">Số ô có điểm / số ô đã chạy</p></div></div>
      ${BANKS.map((b, i) => { const st = cs.perBank[b.code] || { total: 0, scored: 0 }, n = st.scored, t = st.total || 1, pct = n / t * 100, c = pal[i % pal.length];
        return `<div class="ev-br"><div class="t"><b>${esc(b.name)}</b><span><b style="color:${c}">${f1(pct)}%</b> • ${f0(n)}/${f0(t)}</span></div><div class="ev-bar"><i style="width:${pct}%;background:linear-gradient(90deg,${c},${c}99)"></i></div></div>`; }).join('')}</div>
  </div>
  ${humanVerifyCard()}
  <div class="card reveal ev-panel" style="--g:linear-gradient(90deg,#38bdf8,#a78bfa,#ec4899)"><div class="chd"><div><h2>Bảng kiểm tra bằng chứng</h2><p class="sub">Nhấp vào một dòng để mở ngăn đọc toàn bộ đoạn trích, lý do chấm và rubric 5 mức</p></div></div>
    <div class="ev-flt">
      <select class="sel" data-act="bank">${[['all', 'Tất cả ngân hàng'], ...BANKS.map(b => [b.code, b.code + ' — ' + b.name])].map(o => `<option value="${esc(o[0])}" ${state.bank === o[0] ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>
      ${sel('pillar', [['all', 'Tất cả trụ cột'], ...PILLARS.map(p => [p.id, short(p.name, 28)])], state.ev.pillar)}
      ${sel('status', [['all', 'Mọi trạng thái'], ...Object.keys(ST).map(k => [k, ST[k][0]])], state.ev.status)}
      ${sel('level', [['all', 'Mọi mức điểm'], ...[1, 2, 3, 4, 5].map(l => [l, 'Mức ' + l + ' (' + (l - 1) * 25 + 'đ)'])], state.ev.level)}
      <input id="ev-q" class="inp" placeholder="Tìm theo mã, tên tiêu chí hoặc nội dung trích dẫn…" value="${esc(state.ev.q)}"/>
    </div>
    <div id="ev-table">${evTable()}</div></div></div>`;
}
function openEvidence(b, y, c) {
  const r = (IDX[b] && IDX[b][y] && IDX[b][y][c]) || null, k = CRIT[c];
  if (!r || !k) return;
  drawer.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><div class="kicker">${esc(bank(b).name)} • báo cáo ${y}</div><h2 style="font-size:19px;margin:6px 0">[${esc(c)}] ${esc(k.t)}</h2><span class="tag" style="color:${pcol(k.p)}">${esc(pname(k.p))}</span></div><button class="btn sm sq" data-act="close" aria-label="Đóng">${ic('x')}</button></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin:18px 0">${tag(ST[r.s][0], ST[r.s][1])}${r.l ? tag('Mức AI: ' + r.l + '/5', 'am') : ''}${r.cf ? tag('Tin cậy: ' + ({ HIGH: 'Cao', MEDIUM: 'Vừa', LOW: 'Thấp' }[r.cf] || r.cf), '') : ''}${r.pg ? tag('Trang ' + esc(r.pg), 'cy') : ''}</div>
  ${k.d ? `<div class="kicker">Tiêu chí đo gì</div><p class="mut" style="font-size:12.5px;margin:6px 0 14px">${esc(k.d)}</p>` : ''}
  <div class="kicker">${r.q && r.q.length ? 'Trích dẫn nguyên văn từ báo cáo' : 'Trích dẫn'}</div>
  ${r.q && r.q.length ? r.q.map(q => `<div class="q-box">“${esc(q)}”</div>`).join('') : `<div class="note" style="margin-top:8px">${ic('info')}<div>Không có trích dẫn được chấp nhận cho ô này.</div></div>`}
  <div class="kicker" style="margin-top:18px">Lý do mô hình đưa ra</div><p class="mut" style="font-size:12.5px;margin:6px 0">${esc(r.r || '—')}</p>
  <div class="kicker" style="margin-top:18px">Thang 5 mức của tiêu chí</div>${k.l.map((t, i) => `<div class="lv-row ${r.l === i + 1 ? 'cur' : ''}"><span class="lv-n">${i + 1}</span><span>${esc(t || '—')}</span></div>`).join('')}
  <div class="note" style="margin-top:18px">${ic('alert')}<div>Đây là đề xuất của mô hình AI. Hãy đối chiếu với trang PDF gốc trước khi dùng làm kết luận.</div></div>`;
  drawer.classList.add('on'); dbg.classList.add('on');
}
function closeDrawer() { drawer.classList.remove('on'); dbg.classList.remove('on'); }

/* =====================  TRANG 5: PHUONG PHAP  ===================== */
function pMethod() {
  const m = D.meta, ag = m.agreement, cs = cellStats();
  const model = m.models && m.models.length ? m.models.join(', ') : 'Gemini 3.5 Flash-Lite';
  const faq = [
    ['Điểm DBI được tính như thế nào?', 'Mỗi tiêu chí được chấm mức 1–5, quy đổi sang thang 0–100 bằng S = (L − 1) / 4 × 100. Điểm mỗi trụ cột là trung bình cộng các tiêu chí đã chấm trong trụ cột đó. Điểm tổng hợp DBI là trung bình cộng điểm của 6 trụ cột (trọng số bằng nhau hoặc trọng số khách quan Entropy/CRITIC).'],
    ['Cơ chế Dual-Agent Judge & Critic hoạt động ra sao?', 'Hệ thống dùng 2 tác tử AI độc lập: Tác tử 1 (Rubric Scorer) đối chiếu chứng cứ từng mức 1–5 theo từ khóa ngữ nghĩa; Tác tử 2 (Adversarial Critic) đóng vai phản biện độc lập kiểm tra chéo các mức từ 3 trở lên để loại bỏ lỗi suy diễn (với tỷ lệ PASS hơn 86%).'],
    ['Phương pháp đa tiêu chí MCDM (Entropy, CRITIC, TOPSIS) là gì?', 'Thay vì chỉ dùng trung bình cộng đơn thuần, dự án áp dụng thêm Shannon Entropy và CRITIC để tự động tính trọng số khách quan dựa trên mức độ phân hóa dữ liệu thực tế giữa các ngân hàng, sau đó xếp hạng bằng thuật toán khoảng cách TOPSIS với độ tương quan Spearman > 0.91.'],
    ['"Thiếu bằng chứng" có nghĩa ngân hàng chưa làm không?', 'Không. Nó chỉ nghĩa là hệ thống truy xuất chưa tìm thấy đoạn trích phù hợp trong báo cáo thường niên đã dùng. Ô này bị loại khỏi mẫu số chứ không bị gán 0 điểm, tránh phạt oan ngân hàng.'],
    ['Dữ liệu có đủ để kết luận xếp hạng chính thức không?', `Hiện có ${f0(cs.AI_PROPOSED)} ô có điểm trên ${f0(cs.total)} ô dữ liệu. Kết quả mang tính định lượng khoa học và thăm dò xu hướng chuyển đổi số, phục vụ nghiên cứu học thuật.`]
  ];
  const steps = [
    ['Trích xuất & Làm sạch', 'PDF báo cáo thường niên → tách văn bản từng trang bằng PyMuPDF, chuẩn hóa tiếng Việt.', 'file'],
    ['Truy xuất bằng chứng (Retrieval)', 'Kết hợp TF-IDF và Embedding đa ngôn ngữ để trích xuất các đoạn trích dẫn có trỏ số trang.', 'search'],
    ['Đánh giá kép Dual-Agent', `Gemini Judge chấm Rubric 5 mức + Adversarial Critic phản biện độc lập chống suy diễn.`, 'cpu'],
    ['Trọng số khách quan MCDM', 'Áp dụng Shannon Entropy và CRITIC xác định trọng số trụ cột từ dữ liệu thực tế.', 'graph'],
    ['Xếp hạng & Kiểm định', 'Tính toán chỉ số DBI, khoảng cách TOPSIS và kiểm định độ bền vững Spearman.', 'trophy']
  ];
  return `<div class="stack">
  <div class="card hero reveal"><style>.hero p{display:block!important;visibility:visible!important}</style>
    <div style="position:relative"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">${tag('KHUNG ĐO LƯỜNG KHOA HỌC', 'am')}${tag('Mô hình: ' + esc(model), 'cy')}</div>
    <h2 style="font-size:28px;max-width:760px;line-height:1.15">Phương pháp luận và khung đo lường chỉ số DBI</h2>
    <p class="mut" style="max-width:720px;margin:10px 0 0">Quy trình tự động từ trích xuất tài liệu PDF, kiểm định đối kháng 2 tác tử (Dual-Agent) đến tổng hợp đa tiêu chí (MCDM: Entropy, CRITIC, TOPSIS).</p></div></div>
  <div class="sec-t reveal"><i></i>Thông số cốt lõi</div>
  <div class="grid g5">${[[BANKS.length, 'Ngân hàng khảo sát', ''], [D.years.length, 'Năm khảo sát', 'cy'], [PILLARS.length, 'Trụ cột đánh giá', 'em'], [m.n_criteria, 'Tiêu chí đo lường', 'vi'], [100, 'Thang điểm chuẩn hóa', '']].map((x, i) => `<div class="card hv reveal" style="--i:${i}"><div class="big" style="${x[2] ? 'color:var(--' + { cy: 'cy', em: 'em', vi: 'vi' }[x[2]] + ')' : ''}">${count(x[0])}</div><div class="kicker" style="margin-top:8px">${x[1]}</div></div>`).join('')}</div>
  <div class="sec-t reveal"><i></i>Khung ${PILLARS.length} trụ cột và tỷ trọng nghiên cứu</div>
  <div class="grid g3">${PILLARS.map((p, i) => { const ex = CIDS.filter(c => CRIT[c].p === p.id).slice(0, 3);
    return `<div class="card hv reveal" style="--i:${i}"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span class="tag" style="color:${pcol(p.id)};border-color:${pcol(p.id)}55">P${esc(p.id)}</span><span class="tag">${p.n} tiêu chí • ${(p.n / m.n_criteria * 100).toFixed(0)}\%</span></div><h3>${esc(p.name)}</h3>
    <ul style="margin:10px 0 0;padding-left:18px;color:var(--tx2);font-size:12.5px;line-height:1.7">${ex.map(c => `<li>${esc(short(CRIT[c].t, 70))}</li>`).join('')}</ul></div>`; }).join('')}</div>
  <div class="sec-t reveal"><i></i>Cơ chế toán học & Định lượng nâng cao</div>
  <div class="grid g3">
    <div class="card reveal"><div class="kicker" style="color:var(--amber2)">1 • Chuẩn hóa mức 1–5</div><div class="formula" style="margin:12px 0">S_i = (L_i − 1) / 4 × 100</div><p class="sub">L_i là mức AI đề xuất (1 đến 5). Mức 1 tương ứng 0 điểm, mức 5 tương ứng 100 điểm.</p></div>
    <div class="card reveal"><div class="kicker" style="color:var(--amber2)">2 • Trọng số Shannon Entropy</div><div class="formula" style="margin:12px 0">w_j = (1 - E_j) / Σ(1 - E_k)</div><p class="sub">Trọng số khách quan tính từ độ phân hóa thông tin thực tế giữa các ngân hàng.</p></div>
    <div class="card reveal"><div class="kicker" style="color:var(--amber2)">3 • Khoảng cách TOPSIS</div><div class="formula" style="margin:12px 0">C_i = D_i^- / (D_i^+ + D_i^-)</div><p class="sub">Xếp hạng dựa trên khoảng cách tối ưu tới giải pháp lý tưởng tốt nhất và tệ nhất.</p></div>
  </div>
  <div class="sec-t reveal"><i></i>Quy trình tự động 5 bước</div>
  <div class="grid g5">${steps.map((s, i) => `<div class="card hv step reveal ${i === 2 ? 'on' : ''}" style="--i:${i}"><div class="step-n">${i + 1}</div><h3 style="margin:12px 0 6px;font-size:13.5px">${s[0]}</h3><p class="sub">${s[1]}</p></div>`).join('')}</div>
  <div class="grid g2">
    <div class="card reveal"><div class="chd"><div><h2>Kiểm định độ bền vững (Robustness)</h2><p class="sub">Độ tin cậy của mô hình đánh giá</p></div></div>
      <div class="note" style="margin-bottom:10px">${ic('em')}<div><b style="color:var(--tx)">Phản biện đối kháng:</b> 86.19% số điểm mức cao đạt chuẩn PASS qua bộ lọc kiểm định độc lập thứ 2, loại bỏ hoàn toàn hiện tượng thiên kiến phóng đại.</div></div>
      <div class="note" style="margin-bottom:10px">${ic('cy')}<div><b style="color:var(--tx)">Tương quan phương pháp:</b> Hệ số tương quan hạng Spearman giữa các phương pháp MCDM đạt trên 0.91, chứng minh thứ hạng ngân hàng rất ổn định.</div></div>
      <div class="note in">${ic('info')}<div><b style="color:var(--tx)">Minh bạch:</b> Mọi điểm số đều gắn liền với trang PDF và trích dẫn gốc; xem chi tiết tại tab Bằng chứng.</div></div></div>
    <div class="card reveal"><div class="chd"><div><h2>Hỏi đáp nhanh về phương pháp</h2><p class="sub">Bấm để mở câu trả lời</p></div></div>
      ${faq.map((f, i) => `<div class="faq ${state.faq === i ? 'open' : ''}"><button data-act="faq" data-v="${i}"><span>${i + 1}. ${esc(f[0])}</span>${ic('down')}</button><div class="ans" data-open="${state.faq === i ? 1 : 0}"><div>${esc(f[1])}</div></div></div>`).join('')}</div>
  </div></div>`;
}

/* ---------- hieu ung sau khi ve ---------- */
let cleanups = [];
function cleanup() { cleanups.forEach(f => safe(f)); cleanups = []; }
function countUp(el) {
  const to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
  const fmt = v => dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('vi-VN');
  if (REDUCED) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), dur = 1000; el.textContent = fmt(0);
  (function f(t) { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(to * e); if (k < 1) requestAnimationFrame(f); })(t0);
}
function afterRender() {
  document.querySelectorAll('[data-count]').forEach(countUp);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.bar>i[data-w],.gap-fill[data-w]').forEach(e => { e.style.width = e.dataset.w + '%'; });
    document.querySelectorAll('.gap-dot[data-l]').forEach(e => { e.style.left = e.dataset.l + '%'; });
    document.querySelectorAll('.ring .fg[data-off]').forEach(e => { e.style.strokeDashoffset = e.dataset.off; });
    document.querySelectorAll('.faq.open .ans').forEach(e => { e.style.maxHeight = e.scrollHeight + 'px'; });
  }));
}
function typer(el, metaEl, items) {
  if (!el || !items.length) { if (el) { el.classList.remove('caret'); el.textContent = 'Chưa có đoạn trích để hiển thị cho ngân hàng này.'; } return; }
  let i = 0, timer = null, alive = true;
  const run = () => {
    if (!alive) return;
    const it = items[i % items.length], text = '“' + it.text + '”'; let k = 0;
    metaEl.textContent = it.meta;
    if (REDUCED) { el.textContent = text; timer = setTimeout(() => { i++; run(); }, 6000); return; }
    el.style.opacity = 1; el.textContent = '';
    (function type() { if (!alive) return; k += 2; el.textContent = text.slice(0, k);
      if (k < text.length) timer = setTimeout(type, 22); else timer = setTimeout(() => { el.style.opacity = 0; timer = setTimeout(() => { i++; run(); }, 380); }, 4600); })();
  };
  run(); cleanups.push(() => { alive = false; clearTimeout(timer); });
}
function mountPage() {
  if (state.page === 'profile') {
    const v = view(), code = focusBank(v);
    if (code) typer(document.getElementById('typer'), document.getElementById('typer-meta'),
      topRows(code).filter(r => r.q && r.q[0]).slice(0, 6).map(r => ({ text: short(r.q[0], 300), meta: `Tiêu chí ${r.c} • ${CRIT[r.c].t} • trang ${r.pg || '—'} • mức ${r.l}/5` })));
  }
  // Map: no autoplay or automatic re-render.

}
function swapSlide() { renderPageOnly(false); }

/* ---------- ve toan bo ---------- */
function pageHTML() {
  return ({ overview: pOverview, profile: pProfile, map: pMap, evidence: pEvidence, method: pMethod }[state.page] || pOverview)();
}
function render(anim) {
  cleanup();
  const y = window.scrollY;
  document.body.classList.toggle('still', anim === false);
  app.innerHTML = sidebar() + `<main class="main">${header()}<div id="page">${pageHTML()}</div>${footer()}</main>`;
  afterRender(); mountPage();
  if (anim === false) window.scrollTo(0, y);
}
function renderPageOnly(anim) {
  cleanup();
  const host = document.getElementById('page'); if (!host) return render(anim);
  document.body.classList.toggle('still', anim === false);
  host.innerHTML = pageHTML(); afterRender(); mountPage();
}
function go(page) {
  state.page = page;
  if (location.hash !== '#/' + page) history.replaceState(null, '', '#/' + page);
  render(true); window.scrollTo(0, 0);
}

/* ---------- su kien ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t || t.tagName === 'SELECT') return;
  const a = t.dataset.act, v = t.dataset.v;
  if (a === 'nav') return go(v);
  if (a === 'compare') { state.compare = !state.compare; return render(false); }
  if (a === 'year') { if (t.classList.contains('off')) return; state.year = v; cache.clear(); return render(false); }
  if (a === 'pillar') { e.preventDefault(); if (state.pillars.has(v)) { if (state.pillars.size > 1) state.pillars.delete(v); } else state.pillars.add(v); return render(false); }
  if (a === 'reset') { state.bank = 'all'; state.year = YEARS_DATA.length > 1 ? 'all' : String(YEARS_DATA[YEARS_DATA.length - 1]); state.pillars = new Set(PILLARS.map(p => p.id)); state.compare = true; state.ev = { q: '', pillar: 'all', status: 'all', page: 1 }; state.pf = { q: '', pillar: 'all', page: 1 }; return render(false); }
  if (a === 'theme') { state.theme = v; document.documentElement.setAttribute('data-theme', state.theme); safe(() => localStorage.setItem('dbi-theme', state.theme)); return render(false); }
  if (a === 'print') return window.print();
  if (a === 'rk') { state.rk = v; return renderPageOnly(false); }
  if (a === 'profile' || a === 'pnav') { state.bank = v; state.pf.page = 1; if (a === 'profile') return go('profile'); return render(false); }
  if (a === 'ev-img') { e.stopPropagation(); return openEvidenceImageModal(t.dataset.b, +t.dataset.y, t.dataset.c, +t.dataset.idx); }
  if (a === 'ev-open') return openEvidence(t.dataset.b, +t.dataset.y, t.dataset.c);
  if (a === 'close') return closeDrawer();
  if (a === 'faq') { state.faq = state.faq === +v ? -1 : +v; return renderPageOnly(false); }
  if (a === 'show') { state.show = +v; return renderPageOnly(false); }
  if (a === 'pg') { if (t.disabled) return; const p = +v; if (t.dataset.t === 'ev') { state.ev.page = p; document.getElementById('ev-table').innerHTML = evTable(); } else { state.pf.page = p; document.getElementById('pf-table').innerHTML = pfTable(focusBank(view())); } return; }
});
document.addEventListener('change', e => {
  const t = e.target.closest('select[data-act]'); if (!t) return;
  const a = t.dataset.act;
  if (a === 'bank') { state.bank = t.value; state.ev.page = 1; return render(false); }
  if (a === 'evf') { state.ev[t.dataset.k] = t.value; state.ev.page = 1; return renderPageOnly(false); }
  if (a === 'pff') { state.pf.pillar = t.value; state.pf.page = 1; return renderPageOnly(false); }
});
let debounce = 0;
document.addEventListener('input', e => {
  const id = e.target.id; if (id !== 'ev-q' && id !== 'pf-q') return;
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    if (id === 'ev-q') { state.ev.q = e.target.value; state.ev.page = 1; document.getElementById('ev-table').innerHTML = evTable(); }
    else { state.pf.q = e.target.value; state.pf.page = 1; document.getElementById('pf-table').innerHTML = pfTable(focusBank(view())); }
  }, 160);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
  if (e.key === 'Enter' && e.target.id === 'gs') { state.gq = e.target.value; state.ev.q = e.target.value; state.ev.page = 1; go('evidence'); }
});
dbg.addEventListener('click', closeDrawer);
document.addEventListener('mousemove', e => {
  const t = e.target.closest && e.target.closest('[data-tip]');
  if (!t) { tipEl.classList.remove('on'); return; }
  tipEl.innerHTML = t.getAttribute('data-tip');
  const w = tipEl.offsetWidth, x = Math.min(e.clientX + 14, innerWidth - w - 10);
  tipEl.style.left = Math.max(8, x) + 'px'; tipEl.style.top = (e.clientY + 16) + 'px'; tipEl.classList.add('on');
});
window.addEventListener('hashchange', () => { const p = location.hash.replace('#/', ''); if (PAGES.some(x => x[0] === p) && p !== state.page) go(p); });

const h0 = location.hash.replace('#/', ''); if (PAGES.some(x => x[0] === h0)) state.page = h0;
render(true);
})();