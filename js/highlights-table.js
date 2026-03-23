/* ─── HIGHLIGHTS TABLE ─── */
var HL_DATA_L1 = [
  { name:'Outerwear',   convVal:42570, cost:14210, conv:636, convRate:3.8, aov:66.90,  cos:33.4 },
  { name:'Footwear',    convVal:11800, cost:4100,  conv:112, convRate:3.2, aov:105.40, cos:34.8 },
  { name:'Accessories', convVal:28350, cost:8490,  conv:597, convRate:4.5, aov:47.50,  cos:29.9 },
  { name:'Base Layers', convVal:19240, cost:5620,  conv:314, convRate:3.6, aov:61.30,  cos:29.2 }
];
var HL_DATA_L2 = [
  { name:'Fleece & Hoodies', convVal:12450, cost:3640, conv:156, convRate:4.2, aov:79.80,  cos:29.32 },
  { name:'Footwear',         convVal:11800, cost:4100, conv:112, convRate:3.2, aov:105.40, cos:34.80 },
  { name:'Headwear',         convVal:11200, cost:3260, conv:234, convRate:5.1, aov:47.90,  cos:29.32 },
  { name:'Tops',             convVal:10500, cost:3240, conv:267, convRate:4.8, aov:39.30,  cos:30.80 },
  { name:'Outdoor Gear',     convVal:9200,  cost:2690, conv:178, convRate:4.5, aov:51.70,  cos:29.32 },
  { name:'Jackets & Shells', convVal:8920,  cost:5210, conv:89,  convRate:2.8, aov:100.30, cos:34.80 },
  { name:'Bottoms',          convVal:8700,  cost:2540, conv:195, convRate:3.6, aov:44.60,  cos:29.32 },
  { name:'Gloves',           convVal:8650,  cost:2660, conv:198, convRate:3.9, aov:43.70,  cos:30.80 }
];
var HL_DATA_L3 = [
  { name:'Rain Jackets',     convVal:4280, cost:2140, conv:42,  convRate:2.8, aov:101.90, cos:34.80 },
  { name:'Fleece Pullovers', convVal:6890, cost:2010, conv:88,  convRate:4.0, aov:78.30,  cos:29.32 },
  { name:'Softshell Jackets',convVal:4640, cost:3070, conv:47,  convRate:2.9, aov:98.70,  cos:34.80 },
  { name:'Hiking Boots',     convVal:5820, cost:2180, conv:57,  convRate:3.0, aov:102.10, cos:34.80 },
  { name:'Trail Runners',    convVal:3940, cost:1290, conv:38,  convRate:3.4, aov:103.70, cos:32.70 },
  { name:'Sandals',          convVal:2040, cost:630,  conv:17,  convRate:2.8, aov:120.00, cos:30.90 },
  { name:'Beanies',          convVal:4810, cost:1390, conv:108, convRate:5.2, aov:44.50,  cos:28.90 },
  { name:'Caps',             convVal:6390, cost:1870, conv:126, convRate:5.0, aov:50.70,  cos:29.30 },
  { name:'Running Tops',     convVal:5240, cost:1620, conv:134, convRate:4.9, aov:39.10,  cos:30.90 },
  { name:'Hiking Tops',      convVal:5260, cost:1620, conv:133, convRate:4.7, aov:39.50,  cos:30.80 },
  { name:'Cargo Pants',      convVal:4390, cost:1280, conv:98,  convRate:3.7, aov:44.80,  cos:29.20 },
  { name:'Trekking Pants',   convVal:4310, cost:1260, conv:97,  convRate:3.5, aov:44.40,  cos:29.50 }
];

var _hlCOSTarget = 29;
var _hlShowSparklines = true;
var _hlLevel = 'L2';
var _hlSortCol = 'convVal';
var _hlSortDir = 'desc';
var _hlHighlightCols = ['convVal']; // relative-scale cols; COS is always threshold-colored

function hlInterpColor(t) {
  return 'rgb('+Math.round(230+(26-230)*t)+','+Math.round(249+(92-249)*t)+','+Math.round(238+(53-238)*t)+')';
}
function hlCellBg(val, minV, maxV, inverted) {
  var t = maxV === minV ? 0.5 : (val - minV) / (maxV - minV);
  if (inverted) t = 1 - t;
  return 'background:'+hlInterpColor(t)+';color:'+(t >= 0.5 ? '#ffffff' : '#111827')+';';
}

function hlGetDataset() {
  if (_hlLevel === 'L1') return HL_DATA_L1;
  if (_hlLevel === 'L3') return HL_DATA_L3;
  return HL_DATA_L2;
}

function hlCOSTier(cos) {
  if (cos <= _hlCOSTarget - 2) return 'green';
  if (cos <= _hlCOSTarget + 1) return 'amber';
  return 'red';
}

function hlCOSCellStyle(cos) {
  var tier = hlCOSTier(cos);
  if (tier === 'green') return 'background:rgba(52,199,89,0.2);color:#166534;';
  if (tier === 'amber') return 'background:rgba(255,196,0,0.18);color:#854d0e;';
  return 'background:rgba(239,68,68,0.15);color:#991b1b;';
}

function hlSparklineSvg(endCos) {
  var startCos = 12.2, n = 12, w = 120, h = 24, padX = 14, padY = 3;
  var yMin = Math.min(startCos, endCos) - 1;
  var yRange = Math.max(endCos - startCos + 4, 6);
  var pts = [];
  for (var i = 0; i < n; i++) {
    var t = i / (n - 1);
    var v = startCos + t * (endCos - startCos);
    var x = padX + t * (w - padX * 2);
    var y = h - padY - ((v - yMin) / yRange) * (h - padY * 2);
    pts.push(x.toFixed(1) + ',' + y.toFixed(1));
  }
  var tier = hlCOSTier(endCos);
  var sc = tier === 'green' ? '#22c55e' : tier === 'amber' ? '#eab308' : '#ef4444';
  var lp = pts[n - 1].split(',');
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">' +
    '<text x="0" y="' + h + '" font-size="8" fill="#9ca3af" font-family="DM Sans,sans-serif">12.2%</text>' +
    '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + sc + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<circle cx="' + lp[0] + '" cy="' + lp[1] + '" r="2.5" fill="' + sc + '"/>' +
    '<text x="' + (w - 1) + '" y="' + h + '" font-size="8" fill="#9ca3af" font-family="DM Sans,sans-serif" text-anchor="end">' + endCos.toFixed(2) + '%</text>' +
    '</svg>';
}

function hlConvValBar(convVal, minVal, maxVal) {
  var t = maxVal === minVal ? 0.5 : (convVal - minVal) / (maxVal - minVal);
  var pct = Math.round(t * 100);
  var textColor = t > 0.5 ? '#ffffff' : '#111827';
  return '<div style="position:relative;overflow:hidden;width:100%;height:42px;">' +
    '<div style="position:absolute;left:0;top:0;bottom:0;width:' + pct + '%;background:linear-gradient(90deg,#e6f9ee,#1a5c35);opacity:0.85;"></div>' +
    '<div style="position:relative;padding:0 12px;line-height:42px;font-size:13px;font-weight:600;color:' + textColor + ';white-space:nowrap;">$' + Math.round(convVal).toLocaleString() + '</div>' +
    '</div>';
}

function showHighlightsPage() {
  hideFeedDetailPages();
  document.getElementById('highlights-page').style.display = 'block';
  hlRender();
}

function hlRender() {
  var data = hlGetDataset();
  var searchEl = document.getElementById('hl-search');
  var search = searchEl ? searchEl.value.toLowerCase() : '';
  var rows = data.filter(function(r) { return r.name.toLowerCase().indexOf(search) !== -1; });

  rows = rows.slice().sort(function(a, b) {
    var va = a[_hlSortCol], vb = b[_hlSortCol];
    return _hlSortDir === 'desc' ? vb - va : va - vb;
  });

  var maxCV   = Math.max.apply(null, rows.map(function(r){return r.convVal;}));
  var minCV   = Math.min.apply(null, rows.map(function(r){return r.convVal;}));
  var maxCost = Math.max.apply(null, rows.map(function(r){return r.cost;}));
  var minCost = Math.min.apply(null, rows.map(function(r){return r.cost;}));
  var maxCR   = Math.max.apply(null, rows.map(function(r){return r.convRate;}));
  var minCR   = Math.min.apply(null, rows.map(function(r){return r.convRate;}));
  var maxAOV  = Math.max.apply(null, rows.map(function(r){return r.aov;}));
  var minAOV  = Math.min.apply(null, rows.map(function(r){return r.aov;}));
  var hl = _hlHighlightCols;

  var html = '';
  rows.forEach(function(row) {
    var cosSt  = hlCOSCellStyle(row.cos);
    var cvSt   = hl.indexOf('convVal')  >= 0 ? hlCellBg(row.convVal,  minCV,   maxCV,   false) : '';
    var cstSt  = hl.indexOf('cost')     >= 0 ? hlCellBg(row.cost,     minCost, maxCost, true)  : '';
    var crSt   = hl.indexOf('convRate') >= 0 ? hlCellBg(row.convRate, minCR,   maxCR,   false) : '';
    var aovSt  = hl.indexOf('aov')      >= 0 ? hlCellBg(row.aov,      minAOV,  maxAOV,  false) : '';
    html += '<tr class="hl-row" style="border-bottom:1px solid var(--color-border);">';
    html += '<td style="padding:0 16px;font-size:13px;font-weight:500;color:var(--color-text-primary);height:48px;white-space:nowrap;">' + escHtml(row.name) + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;font-weight:600;text-align:right;height:48px;' + cvSt  + '">$' + Math.round(row.convVal).toLocaleString() + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;font-weight:500;text-align:right;height:48px;' + cstSt + '">$' + Math.round(row.cost).toLocaleString() + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;height:48px;">' + row.conv.toLocaleString() + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;height:48px;' + crSt  + '">' + row.convRate.toFixed(1) + '%</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;height:48px;' + aovSt + '">$' + row.aov.toFixed(2) + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;font-weight:600;height:48px;' + cosSt + '">' + row.cos.toFixed(2) + '%</td>';
    html += '<td style="padding:0 8px;text-align:center;height:48px;">' + (_hlShowSparklines ? hlSparklineSvg(row.cos) : '<span style="color:var(--color-text-caption);">—</span>') + '</td>';
    html += '</tr>';
  });

  var tbody = document.getElementById('hl-tbody');
  if (tbody) tbody.innerHTML = html;

  // Sort carets
  ['convVal','cost','conv','convRate','aov','cos'].forEach(function(col) {
    var el = document.getElementById('hl-sort-' + col);
    if (!el) return;
    el.textContent = col === _hlSortCol ? (_hlSortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕';
  });

  var lvlEl = document.getElementById('hl-level-label');
  if (lvlEl) lvlEl.textContent = _hlLevel;
  var thLvl = document.getElementById('hl-th-level');
  if (thLvl) thLvl.textContent = _hlLevel;

  var cntEl = document.getElementById('hl-footer-text');
  if (cntEl) cntEl.textContent = 'Showing ' + rows.length + ' of ' + data.length + ' results';
}

window.hlCycleLevel = function() {
  var levels = ['L1','L2','L3'];
  _hlLevel = levels[(levels.indexOf(_hlLevel) + 1) % levels.length];
  hlRender();
};

window.hlSortByCol = function(col) {
  if (_hlSortCol === col) { _hlSortDir = _hlSortDir === 'desc' ? 'asc' : 'desc'; }
  else { _hlSortCol = col; _hlSortDir = 'desc'; }
  hlRender();
};

window.hlSetSort = function(val, label) {
  var map = {
    'impact':       { col:'convVal', dir:'desc' },
    'convval-desc': { col:'convVal', dir:'desc' },
    'convval-asc':  { col:'convVal', dir:'asc'  },
    'cos-desc':     { col:'cos',     dir:'desc' },
    'cos-asc':      { col:'cos',     dir:'asc'  },
    'cost-desc':    { col:'cost',    dir:'desc' },
    'aov-desc':     { col:'aov',     dir:'desc' },
    'conv-desc':    { col:'conv',    dir:'desc' }
  };
  var e = map[val];
  if (e) { _hlSortCol = e.col; _hlSortDir = e.dir; }
  var lbl = document.getElementById('hl-sort-label');
  if (lbl && label) lbl.textContent = label;
  var panel = document.getElementById('hl-sort-panel');
  if (panel) panel.style.display = 'none';
  hlRender();
};

window.hlSetLevel = function(level) {
  _hlLevel = level;
  var panel = document.getElementById('hl-level-panel');
  if (panel) panel.style.display = 'none';
  hlRender();
};

window.hlOpenDrawer = function() {
  document.getElementById('hl-filter-drawer').classList.add('open');
  document.getElementById('hl-drawer-overlay').style.display = 'block';
};

window.hlCloseDrawer = function() {
  document.getElementById('hl-filter-drawer').classList.remove('open');
  document.getElementById('hl-drawer-overlay').style.display = 'none';
};

window.hlApplyFilters = function() {
  var inp = document.getElementById('hl-cos-target-input');
  if (inp) _hlCOSTarget = parseInt(inp.value) || 29;
  var spk = document.getElementById('hl-chk-sparklines');
  if (spk) _hlShowSparklines = spk.checked;
  _hlHighlightCols = [];
  ['convVal','cost','convRate','aov'].forEach(function(k) {
    var el = document.getElementById('hl-chk-' + k);
    if (el && el.checked) _hlHighlightCols.push(k);
  });
  hlCloseDrawer();
  hlRender();
  showToast('Filters applied');
};

window.hlClearFilters = function() {
  _hlCOSTarget = 29; _hlShowSparklines = true; _hlHighlightCols = ['convVal'];
  var inp = document.getElementById('hl-cos-target-input');
  if (inp) inp.value = 29;
  var spk = document.getElementById('hl-chk-sparklines');
  if (spk) spk.checked = true;
  ['convVal','cost','convRate','aov'].forEach(function(k) {
    var el = document.getElementById('hl-chk-' + k);
    if (el) el.checked = k === 'convVal';
  });
  hlRender();
  showToast('Filters cleared');
};

