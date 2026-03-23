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

var _hlCOSTarget = 31;
var _hlShowSparklines = false;
var _hlLevel = 'L2';
var _hlSortCol = 'convVal';
var _hlSortDir = 'desc';
var _hlHighlightCols = ['convVal', 'cos']; // relative-scale cols; COS is always threshold-colored
var _hlColorRanges = {};
var HL_COL_DEFS = [{key:'convVal',label:'Conv. Val.',prefix:'$',inverted:false},{key:'cost',label:'Cost',prefix:'$',inverted:true},{key:'convRate',label:'Conv. Rate',suffix:'%',inverted:false},{key:'aov',label:'AOV',prefix:'$',inverted:false}];

function hlInterpColor(t) {
  return 'rgb('+Math.round(230+(26-230)*t)+','+Math.round(249+(92-249)*t)+','+Math.round(238+(53-238)*t)+')';
}
function hlCellBg(val, minV, maxV, inverted) {
  var t = maxV === minV ? 0.5 : (val - minV) / (maxV - minV);
  if (inverted) t = 1 - t;
  return 'background:'+hlInterpColor(t)+';color:'+(t >= 0.5 ? '#ffffff' : '#111827')+';';
}

function hlCellBgWithRange(val, key, minV, maxV, inverted) {
  var r = _hlColorRanges[key];
  if (r) { if (r.min !== undefined && !isNaN(r.min)) minV = r.min; if (r.max !== undefined && !isNaN(r.max)) maxV = r.max; }
  return hlCellBg(val, minV, maxV, inverted);
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
    var cosSt  = hl.indexOf('cos') >= 0 ? hlCOSCellStyle(row.cos) : '';
    var cvSt   = hl.indexOf('convVal')  >= 0 ? hlCellBgWithRange(row.convVal,  'convVal',  minCV,   maxCV,   false) : '';
    var cstSt  = hl.indexOf('cost')     >= 0 ? hlCellBgWithRange(row.cost,     'cost',     minCost, maxCost, true)  : '';
    var crSt   = hl.indexOf('convRate') >= 0 ? hlCellBgWithRange(row.convRate, 'convRate', minCR,   maxCR,   false) : '';
    var aovSt  = hl.indexOf('aov')      >= 0 ? hlCellBgWithRange(row.aov,      'aov',      minAOV,  maxAOV,  false) : '';
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

/* ── FILTER MODAL ── */

function hlRefreshChips() {
  var all = [{key:'convVal',label:'Conv. Val.'},{key:'cost',label:'Cost'},{key:'convRate',label:'Conv. Rate'},{key:'aov',label:'AOV'},{key:'cos',label:'COS'}];
  var c = document.getElementById('hl-chips-container');
  if (!c) return;
  var h = '';
  all.forEach(function(col) {
    if (_hlHighlightCols.indexOf(col.key) >= 0) {
      h += '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px 3px 12px;background:#eff6ff;color:#1d4ed8;border-radius:20px;font-size:13px;font-family:\'DM Sans\',sans-serif;">'+col.label+
        '<button onclick="hlRemoveChip(\''+col.key+'\')" style="background:none;border:none;cursor:pointer;padding:0 0 0 2px;line-height:1;color:#6b7280;font-size:16px;display:flex;align-items:center;">×</button></span>';
    }
  });
  c.innerHTML = h;
}

function hlRefreshColorRanges() {
  var container = document.getElementById('hl-color-ranges');
  if (!container) return;
  var data = hlGetDataset();
  var selected = HL_COL_DEFS.filter(function(c){ return _hlHighlightCols.indexOf(c.key) >= 0; });
  if (selected.length === 0) { container.style.display = 'none'; return; }
  container.style.display = 'block';
  var h = '<div style="font-size:13px;color:#6b7280;margin-bottom:10px;">Color scale range</div>';
  selected.forEach(function(c) {
    var minV = Math.min.apply(null, data.map(function(r){return r[c.key];}));
    var maxV = Math.max.apply(null, data.map(function(r){return r[c.key];}));
    var r = _hlColorRanges[c.key];
    if (r) { if (r.min !== undefined) minV = r.min; if (r.max !== undefined) maxV = r.max; }
    var grad = c.inverted ? 'linear-gradient(to right,#1a5c35,#e6f9ee)' : 'linear-gradient(to right,#e6f9ee,#1a5c35)';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
      '<span style="font-size:13px;color:#374151;min-width:80px;">'+c.label+'</span>' +
      '<div style="display:flex;align-items:center;gap:2px;border:1px solid #e5e7eb;border-radius:6px;padding:5px 8px;background:white;">' +
        (c.prefix ? '<span style="font-size:12px;color:#6b7280;margin-right:2px;">'+c.prefix+'</span>' : '') +
        '<input id="hl-range-min-'+c.key+'" type="number" value="'+Math.round(minV)+'" style="width:56px;border:none;background:transparent;font-size:13px;font-family:\'DM Sans\',sans-serif;outline:none;color:#111827;">' +
      '</div>' +
      '<div style="flex:1;height:10px;border-radius:5px;background:'+grad+';"></div>' +
      '<div style="display:flex;align-items:center;gap:2px;border:1px solid #e5e7eb;border-radius:6px;padding:5px 8px;background:white;">' +
        (c.prefix ? '<span style="font-size:12px;color:#6b7280;margin-right:2px;">'+c.prefix+'</span>' : '') +
        '<input id="hl-range-max-'+c.key+'" type="number" value="'+Math.round(maxV)+'" style="width:56px;border:none;background:transparent;font-size:13px;font-family:\'DM Sans\',sans-serif;outline:none;color:#111827;">' +
      '</div>' +
    '</div>';
  });
  container.innerHTML = h;
}

function hlRefreshColDdLabel() {
  var el = document.getElementById('hl-cols-dd-label');
  var n = _hlHighlightCols.length;
  if (el) el.textContent = n + ' column' + (n !== 1 ? 's' : '') + ' selected';
}

window.hlUpdateCOSBadges = function() {
  var inp = document.getElementById('hl-cos-target-input');
  var t = parseInt((inp && inp.value) || _hlCOSTarget);
  var g = document.getElementById('hl-cos-badge-green');
  var a = document.getElementById('hl-cos-badge-amber');
  var r = document.getElementById('hl-cos-badge-red');
  if (g) g.textContent = '≤'+(t-2)+'%';
  if (a) a.textContent = (t-1)+'–'+(t+1)+'%';
  if (r) r.textContent = '≥'+(t+2)+'%';
};

function hlRefreshFilterModal() {
  var all = ['convVal','cost','convRate','aov','cos'];
  all.forEach(function(k) {
    var el = document.getElementById('hl-dd-chk-'+k);
    if (el) el.checked = _hlHighlightCols.indexOf(k) >= 0;
  });
  hlRefreshChips();
  hlRefreshColorRanges();
  hlRefreshColDdLabel();
  var inp = document.getElementById('hl-cos-target-input');
  if (inp) inp.value = _hlCOSTarget;
  hlUpdateCOSBadges();
  var spk = document.getElementById('hl-chk-sparklines');
  if (spk) spk.checked = _hlShowSparklines;
}

window.hlOpenDrawer = window.hlOpenFilters = function() {
  hlRefreshFilterModal();
  var m = document.getElementById('hl-filter-modal');
  if (m) m.style.display = 'flex';
};

window.hlCloseDrawer = window.hlCloseFilters = function() {
  var m = document.getElementById('hl-filter-modal');
  if (m) m.style.display = 'none';
  var dd = document.getElementById('hl-cols-dropdown');
  if (dd) dd.style.display = 'none';
};

window.hlToggleColDropdown = function() {
  var dd = document.getElementById('hl-cols-dropdown');
  if (dd) dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
};

window.hlToggleColFromDd = function(key) {
  var idx = _hlHighlightCols.indexOf(key);
  if (idx >= 0) { _hlHighlightCols.splice(idx, 1); }
  else { _hlHighlightCols.push(key); }
  hlRefreshChips();
  hlRefreshColorRanges();
  hlRefreshColDdLabel();
};

window.hlRemoveChip = function(key) {
  var idx = _hlHighlightCols.indexOf(key);
  if (idx >= 0) _hlHighlightCols.splice(idx, 1);
  var chk = document.getElementById('hl-dd-chk-'+key);
  if (chk) chk.checked = false;
  hlRefreshChips();
  hlRefreshColorRanges();
  hlRefreshColDdLabel();
};

window.hlApplyFilters = function() {
  var inp = document.getElementById('hl-cos-target-input');
  if (inp) _hlCOSTarget = parseInt(inp.value) || 31;
  var spk = document.getElementById('hl-chk-sparklines');
  if (spk) _hlShowSparklines = spk.checked;
  HL_COL_DEFS.forEach(function(c) {
    var minEl = document.getElementById('hl-range-min-'+c.key);
    var maxEl = document.getElementById('hl-range-max-'+c.key);
    if (minEl || maxEl) {
      if (!_hlColorRanges[c.key]) _hlColorRanges[c.key] = {};
      if (minEl) _hlColorRanges[c.key].min = parseFloat(minEl.value);
      if (maxEl) _hlColorRanges[c.key].max = parseFloat(maxEl.value);
    }
  });
  hlCloseFilters();
  hlRender();
  showToast('Filters applied');
};

window.hlClearFilters = function() {
  _hlCOSTarget = 31; _hlShowSparklines = false;
  _hlHighlightCols = ['convVal','cos']; _hlColorRanges = {};
  hlRefreshFilterModal();
  hlCloseFilters();
  hlRender();
  showToast('Filters cleared');
};

