(function () {
  'use strict';

  // ── Campaigns ───────────────────────────────────────────────────────────────
  var STG_CAMPAIGNS = [
    '[SB] Tier A: Nonbrand USA / Core (AC) - US',
    '[SB] Tier B: Nonbrand CA / Core (AC) - CA',
    '[SB] Tier Brand: Branded Ads / Brand (AC) - US',
    '[SB] Tier Brand: Branded Ads / Brand (AC) - CA',
    '[SB] Tier C: Brand Adjacent / Brand + Category (AC) - US',
    '[SB] Tier C: Brand Adjacent / Brand + Category (AC) - CA',
    '[SB] Tier C: PMax (Brand Adjacent) (AC) - US',
    '[SB] Tier C: PMax (Brand Adjacent) (AC) - CA',
    '[SB] Tactical: Broad Match (Prospecting) / Brand + Category (AC) - US'
  ];
  var C = STG_CAMPAIGNS;

  // ── Mock data — 80 bigram rows for Outdoor Research ─────────────────────────
  // Fields: ngram, impressions, clicks, conversions, cost, revenue, campaign
  // Derived on render: CTR, CPC, VPC, grossProfit, COS
  var STG_RAW = [
    // ── Waste (zero conversions, cost > 0) — 10 rows
    { ngram:'outdoor chairs',      impr:12400, clicks:420, conv:0,     cost:1256.40,  rev:0,        camp:C[4] },
    { ngram:'camping gear',        impr:18900, clicks:623, conv:0,     cost:1872.10,  rev:0,        camp:C[8] },
    { ngram:'tent camping',        impr:8760,  clicks:298, conv:0,     cost:894.20,   rev:0,        camp:C[8] },
    { ngram:'sleeping bag',        impr:11200, clicks:381, conv:0,     cost:1143.00,  rev:0,        camp:C[4] },
    { ngram:'hiking poles',        impr:9800,  clicks:333, conv:0,     cost:999.00,   rev:0,        camp:C[5] },
    { ngram:'camping chairs',      impr:7400,  clicks:251, conv:0,     cost:753.50,   rev:0,        camp:C[8] },
    { ngram:'backpacking tent',    impr:6200,  clicks:211, conv:0,     cost:633.00,   rev:0,        camp:C[4] },
    { ngram:'camping stove',       impr:8900,  clicks:302, conv:0,     cost:906.00,   rev:0,        camp:C[8] },
    { ngram:'hammock camping',     impr:5600,  clicks:190, conv:0,     cost:570.00,   rev:0,        camp:C[5] },
    { ngram:'outdoor furniture',   impr:4800,  clicks:163, conv:0,     cost:489.00,   rev:0,        camp:C[4] },
    // ── High-performing (COS < 20%) — 15 rows
    { ngram:'outdoor research',    impr:45600, clicks:2891, conv:189.2, cost:11234.50, rev:68921.00, camp:C[2] },
    { ngram:'rain jacket',         impr:38200, clicks:2140, conv:140.5, cost:8556.80,  rev:51282.50, camp:C[0] },
    { ngram:'hiking boots',        impr:29800, clicks:1680, conv:110.2, cost:6720.80,  rev:40174.00, camp:C[0] },
    { ngram:'fleece jacket',       impr:22400, clicks:1260, conv:82.6,  cost:5040.50,  rev:30148.00, camp:C[0] },
    { ngram:'softshell jacket',    impr:18900, clicks:1064, conv:69.7,  cost:4254.40,  rev:25408.00, camp:C[2] },
    { ngram:'rain gear',           impr:15600, clicks:878,  conv:57.5,  cost:3513.20,  rev:20974.00, camp:C[0] },
    { ngram:'hiking jacket',       impr:12400, clicks:698,  conv:45.8,  cost:2791.00,  rev:16673.00, camp:C[0] },
    { ngram:'outdoor jacket',      impr:10800, clicks:608,  conv:39.8,  cost:2431.00,  rev:14516.00, camp:C[2] },
    { ngram:'waterproof jacket',   impr:9600,  clicks:540,  conv:35.4,  cost:2161.00,  rev:12908.00, camp:C[0] },
    { ngram:'or jacket',           impr:8400,  clicks:473,  conv:31.0,  cost:1890.00,  rev:11298.00, camp:C[2] },
    { ngram:'outdoor gloves',      impr:7200,  clicks:405,  conv:26.5,  cost:1621.00,  rev:9658.00,  camp:C[0] },
    { ngram:'hiking apparel',      impr:6300,  clicks:355,  conv:23.2,  cost:1419.00,  rev:8459.00,  camp:C[0] },
    { ngram:'mountain jacket',     impr:5600,  clicks:315,  conv:20.6,  cost:1261.00,  rev:7519.00,  camp:C[6] },
    { ngram:'trail running',       impr:4900,  clicks:276,  conv:18.1,  cost:1103.00,  rev:6584.00,  camp:C[0] },
    { ngram:'outdoor gear',        impr:4200,  clicks:237,  conv:15.5,  cost:947.00,   rev:5653.00,  camp:C[0] },
    // ── Mid-range (COS 20–29%) — 30 rows
    { ngram:'hiking backpack',     impr:21400, clicks:987,  conv:52.3,  cost:3752.00,  rev:15116.00, camp:C[0] },
    { ngram:'camp shoes',          impr:16800, clicks:774,  conv:41.0,  cost:2940.00,  rev:11857.00, camp:C[1] },
    { ngram:'ski gloves',          impr:14200, clicks:654,  conv:34.7,  cost:2488.00,  rev:10034.00, camp:C[5] },
    { ngram:'trekking poles',      impr:13100, clicks:603,  conv:32.0,  cost:2293.00,  rev:9252.00,  camp:C[0] },
    { ngram:'camp pants',          impr:11900, clicks:548,  conv:29.0,  cost:2083.00,  rev:8402.00,  camp:C[0] },
    { ngram:'base layer',          impr:10600, clicks:488,  conv:25.9,  cost:1855.00,  rev:7486.00,  camp:C[0] },
    { ngram:'wool socks',          impr:9800,  clicks:451,  conv:23.9,  cost:1715.00,  rev:6916.00,  camp:C[1] },
    { ngram:'compression tights',  impr:8900,  clicks:410,  conv:21.7,  cost:1560.00,  rev:6292.00,  camp:C[0] },
    { ngram:'running shorts',      impr:8100,  clicks:373,  conv:19.8,  cost:1418.00,  rev:5721.00,  camp:C[1] },
    { ngram:'trail shoes',         impr:7400,  clicks:341,  conv:18.1,  cost:1297.00,  rev:5233.00,  camp:C[0] },
    { ngram:'camp shirt',          impr:6800,  clicks:313,  conv:16.6,  cost:1190.00,  rev:4803.00,  camp:C[0] },
    { ngram:'hiking pants',        impr:6200,  clicks:286,  conv:15.2,  cost:1087.00,  rev:4386.00,  camp:C[6] },
    { ngram:'down jacket',         impr:5700,  clicks:263,  conv:13.9,  cost:1000.00,  rev:4038.00,  camp:C[0] },
    { ngram:'sleeping pad',        impr:5200,  clicks:240,  conv:12.7,  cost:912.00,   rev:3679.00,  camp:C[4] },
    { ngram:'dry bag',             impr:4800,  clicks:221,  conv:11.7,  cost:840.00,   rev:3389.00,  camp:C[0] },
    { ngram:'sun hat',             impr:4400,  clicks:203,  conv:10.7,  cost:772.00,   rev:3113.00,  camp:C[1] },
    { ngram:'buff headwear',       impr:4100,  clicks:189,  conv:10.0,  cost:719.00,   rev:2901.00,  camp:C[0] },
    { ngram:'rain pants',          impr:3800,  clicks:175,  conv:9.3,   cost:665.00,   rev:2683.00,  camp:C[6] },
    { ngram:'alpine jacket',       impr:3500,  clicks:161,  conv:8.5,   cost:612.00,   rev:2469.00,  camp:C[0] },
    { ngram:'wind jacket',         impr:3200,  clicks:147,  conv:7.8,   cost:559.00,   rev:2255.00,  camp:C[7] },
    { ngram:'ski jacket',          impr:2900,  clicks:134,  conv:7.1,   cost:509.00,   rev:2055.00,  camp:C[5] },
    { ngram:'approach shoes',      impr:2700,  clicks:124,  conv:6.6,   cost:471.00,   rev:1902.00,  camp:C[0] },
    { ngram:'day pack',            impr:2500,  clicks:115,  conv:6.1,   cost:437.00,   rev:1763.00,  camp:C[1] },
    { ngram:'hydration pack',      impr:2300,  clicks:106,  conv:5.6,   cost:403.00,   rev:1626.00,  camp:C[0] },
    { ngram:'beanie hat',          impr:2100,  clicks:97,   conv:5.1,   cost:369.00,   rev:1490.00,  camp:C[1] },
    { ngram:'face mask',           impr:1900,  clicks:88,   conv:4.6,   cost:335.00,   rev:1351.00,  camp:C[0] },
    { ngram:'insulated jacket',    impr:1700,  clicks:78,   conv:4.1,   cost:297.00,   rev:1198.00,  camp:C[0] },
    { ngram:'sport sandals',       impr:1500,  clicks:69,   conv:3.7,   cost:262.00,   rev:1059.00,  camp:C[1] },
    { ngram:'trail gaiters',       impr:1400,  clicks:65,   conv:3.4,   cost:247.00,   rev:996.00,   camp:C[6] },
    { ngram:'trekking shoes',      impr:1300,  clicks:60,   conv:3.2,   cost:228.00,   rev:921.00,   camp:C[0] },
    // ── High-cost (COS > 29%) — 25 rows
    { ngram:'winter jacket',       impr:19800, clicks:912,  conv:29.5,  cost:5018.00,  rev:13426.00, camp:C[8] },
    { ngram:'tactical gear',       impr:16400, clicks:755,  conv:14.8,  cost:4153.00,  rev:8134.00,  camp:C[8] },
    { ngram:'military boots',      impr:13200, clicks:608,  conv:11.9,  cost:3344.00,  rev:6547.00,  camp:C[8] },
    { ngram:'work gloves',         impr:11400, clicks:525,  conv:10.3,  cost:2888.00,  rev:5651.00,  camp:C[4] },
    { ngram:'leather boots',       impr:10100, clicks:465,  conv:9.1,   cost:2558.00,  rev:5005.00,  camp:C[8] },
    { ngram:'snow boots',          impr:9200,  clicks:424,  conv:8.3,   cost:2332.00,  rev:4562.00,  camp:C[4] },
    { ngram:'waterproof boots',    impr:8600,  clicks:396,  conv:7.8,   cost:2178.00,  rev:4260.00,  camp:C[5] },
    { ngram:'safety boots',        impr:7900,  clicks:364,  conv:7.1,   cost:2002.00,  rev:3916.00,  camp:C[8] },
    { ngram:'work jacket',         impr:7200,  clicks:332,  conv:6.5,   cost:1826.00,  rev:3570.00,  camp:C[8] },
    { ngram:'hi-vis vest',         impr:6600,  clicks:304,  conv:5.9,   cost:1672.00,  rev:3270.00,  camp:C[8] },
    { ngram:'safety gloves',       impr:6100,  clicks:281,  conv:5.5,   cost:1546.00,  rev:3023.00,  camp:C[4] },
    { ngram:'mechanic gloves',     impr:5600,  clicks:258,  conv:5.1,   cost:1419.00,  rev:2775.00,  camp:C[8] },
    { ngram:'hunting vest',        impr:5100,  clicks:235,  conv:4.6,   cost:1293.00,  rev:2529.00,  camp:C[5] },
    { ngram:'camo jacket',         impr:4700,  clicks:217,  conv:4.2,   cost:1193.00,  rev:2333.00,  camp:C[8] },
    { ngram:'fishing vest',        impr:4300,  clicks:198,  conv:3.9,   cost:1089.00,  rev:2130.00,  camp:C[4] },
    { ngram:'ski pants',           impr:3900,  clicks:180,  conv:3.5,   cost:990.00,   rev:1936.00,  camp:C[5] },
    { ngram:'snowboard jacket',    impr:3600,  clicks:166,  conv:3.3,   cost:913.00,   rev:1786.00,  camp:C[8] },
    { ngram:'climbing shoes',      impr:3300,  clicks:152,  conv:3.0,   cost:836.00,   rev:1635.00,  camp:C[0] },
    { ngram:'bouldering shoes',    impr:3000,  clicks:138,  conv:2.7,   cost:759.00,   rev:1484.00,  camp:C[0] },
    { ngram:'climbing gear',       impr:2700,  clicks:124,  conv:2.4,   cost:682.00,   rev:1334.00,  camp:C[4] },
    { ngram:'crossfit shoes',      impr:2400,  clicks:111,  conv:2.2,   cost:611.00,   rev:1195.00,  camp:C[8] },
    { ngram:'gym shorts',          impr:2200,  clicks:101,  conv:2.0,   cost:556.00,   rev:1087.00,  camp:C[8] },
    { ngram:'athletic shorts',     impr:2000,  clicks:92,   conv:1.8,   cost:506.00,   rev:990.00,   camp:C[8] },
    { ngram:'yoga pants',          impr:1800,  clicks:83,   conv:1.6,   cost:457.00,   rev:894.00,   camp:C[8] },
    { ngram:'workout gear',        impr:1600,  clicks:74,   conv:1.5,   cost:407.00,   rev:796.00,   camp:C[8] }
  ];

  // ── Columns definition ───────────────────────────────────────────────────────
  var STG_COLS = [
    { key:'ngram',       label:'N-gram',       align:'left',  type:'text' },
    { key:'impr',        label:'Impressions',  align:'right', type:'num'  },
    { key:'clicks',      label:'Clicks',       align:'right', type:'num'  },
    { key:'conv',        label:'Conversions',  align:'right', type:'num'  },
    { key:'ctr',         label:'CTR (%)',       align:'right', type:'num'  },
    { key:'cost',        label:'Cost',         align:'right', type:'num'  },
    { key:'rev',         label:'Revenue',      align:'right', type:'num'  },
    { key:'cpc',         label:'CPC',          align:'right', type:'num'  },
    { key:'vpc',         label:'VPC',          align:'right', type:'num'  },
    { key:'gp',          label:'Gross Profit', align:'right', type:'num'  },
    { key:'cos',         label:'COS (%)',       align:'right', type:'num'  }
  ];

  // ── State ────────────────────────────────────────────────────────────────────
  var _s = {
    client: 'Outdoor Research',
    website: 'OutdoorResearch.com',
    dateRange: 'Last 90 Days',
    ngramSize: '2 (Bigram)',
    minCos: 1,
    minClicks: 1,
    advOpen: false,
    ruleOp: 'Does Not Contain',
    campaignRules: [],
    selectedCampaigns: STG_CAMPAIGNS.slice(),
    blacklist: [],
    openDd: null,
    analyzed: false,
    sortCol: 'cos',
    sortDir: -1,
    page: 1,
    pageSize: 50,
    colFilters: {},         // { colKey: { text?:str, min?:num, max?:num } }
    activeFilterCol: null,  // col key currently editing
    filteredData: []
  };

  // ── Derived row fields ───────────────────────────────────────────────────────
  function stgDerive(row) {
    var ctr  = row.clicks > 0 ? (row.clicks / row.impr) * 100 : 0;
    var cpc  = row.clicks > 0 ? row.cost / row.clicks : 0;
    var vpc  = row.clicks > 0 ? row.rev  / row.clicks : 0;
    var gp   = row.rev - row.cost;
    var cos  = row.rev > 0 ? row.cost / row.rev : (row.cost > 0 ? Infinity : 0);
    return Object.assign({}, row, { ctr:ctr, cpc:cpc, vpc:vpc, gp:gp, cos:cos });
  }
  var STG_DATA = STG_RAW.map(stgDerive);

  // ── Format helpers ───────────────────────────────────────────────────────────
  function fmtN(n)  { return n >= 1000 ? n.toLocaleString() : String(Math.round(n)); }
  function fmtC(n)  { return '$' + n.toFixed(2); }
  function fmtPct(n){ return n.toFixed(2) + '%'; }

  function stgFmtCell(key, row) {
    if (key === 'ngram')  return '<span>' + row.ngram + '</span>';
    if (key === 'impr')   return fmtN(row.impr);
    if (key === 'clicks') return fmtN(row.clicks);
    if (key === 'conv')   return row.conv.toFixed(2);
    if (key === 'ctr')    return fmtPct(row.ctr);
    if (key === 'cost')   return fmtC(row.cost);
    if (key === 'rev')    return fmtC(row.rev);
    if (key === 'cpc')    return fmtC(row.cpc);
    if (key === 'vpc')    return fmtC(row.vpc);
    if (key === 'gp') {
      var sign = row.gp >= 0 ? '+' : '';
      var cls  = row.gp >= 0 ? 'stg-gp-p' : 'stg-gp-n';
      return '<span class="' + cls + '">' + sign + fmtC(row.gp) + '</span>';
    }
    if (key === 'cos') {
      if (!isFinite(row.cos) && row.cost > 0) {
        return '<span class="stg-cos-inf" title="Infinity COS — spend with zero conversions">∞</span>';
      }
      if (row.cos === 0) return '0%';
      var pct = row.cos * 100;
      if (pct > 0 && pct < 1) return '<span style="color:var(--color-text-success);">&lt;1%</span>';
      var rounded = Math.round(pct);
      var cls2 = pct < 20 ? 'stg-cos-g' : pct > 29 ? 'stg-cos-w' : '';
      return '<span' + (cls2 ? ' class="' + cls2 + '"' : '') + '>' + rounded + '%</span>';
    }
    return '';
  }

  // ── Date range label ─────────────────────────────────────────────────────────
  function stgDateRangeStr() {
    var days = { 'Last 90 Days':90, 'Last 180 Days':180, 'Last 1 Year':365, 'Last 2 Years':730, 'Last 3 Years':1095 };
    var d = days[_s.dateRange] || 90;
    var end   = new Date('2026-03-25');
    var start = new Date(end); start.setDate(start.getDate() - d);
    var fmt = function(dt) { return dt.toISOString().slice(0,10); };
    return fmt(start) + ' to ' + fmt(end);
  }

  // ── Summary banner ───────────────────────────────────────────────────────────
  function stgRenderSummary() {
    var el = document.getElementById('stg-summary-items');
    if (!el) return;
    var camps = _s.selectedCampaigns.length === STG_CAMPAIGNS.length ? 'All' : _s.selectedCampaigns.length + ' selected';
    var items = [
      { label:'Date Range',  val: stgDateRangeStr() },
      { label:'N-gram Size', val: _s.ngramSize },
      { label:'Min COS',     val: _s.minCos.toFixed(2) + '%' },
      { label:'Min Clicks',  val: String(_s.minClicks) },
      { label:'Campaigns',   val: camps }
    ];
    if (_s.blacklist.length) items.push({ label:'Blacklist', val: _s.blacklist.length + ' word' + (_s.blacklist.length > 1 ? 's' : '') });
    el.innerHTML = items.map(function(i) {
      return '<div class="stg-summary-item"><span>' + i.label + ': </span><strong>' + i.val + '</strong></div>';
    }).join('');
  }

  // ── Filtering + sorting pipeline ─────────────────────────────────────────────
  function stgApplyFilters() {
    var data = STG_DATA.slice();
    // Config panel: minClicks
    data = data.filter(function(r){ return r.clicks >= _s.minClicks; });
    // Config panel: minCos — only filter finite COS rows (waste = ∞ always shown)
    data = data.filter(function(r){
      if (!isFinite(r.cos)) return true; // waste always passes
      return (r.cos * 100) >= _s.minCos;
    });
    // Blacklist
    _s.blacklist.forEach(function(w) {
      data = data.filter(function(r){ return r.ngram.toLowerCase().indexOf(w.toLowerCase()) === -1; });
    });
    // Campaign filter
    data = data.filter(function(r){ return _s.selectedCampaigns.indexOf(r.camp) !== -1; });
    // Campaign name rules (AND)
    _s.campaignRules.forEach(function(rule) {
      data = data.filter(function(r) {
        var inName = r.camp.toLowerCase().indexOf(rule.val.toLowerCase()) !== -1;
        return rule.op === 'Contains' ? inName : !inName;
      });
    });
    // Column filters
    Object.keys(_s.colFilters).forEach(function(key) {
      var f = _s.colFilters[key];
      data = data.filter(function(r) {
        if (key === 'ngram') {
          return !f.text || r.ngram.toLowerCase().indexOf(f.text.toLowerCase()) !== -1;
        }
        var val = r[key];
        if (f.min !== undefined && f.min !== '' && !isNaN(f.min) && val < Number(f.min)) return false;
        if (f.max !== undefined && f.max !== '' && !isNaN(f.max) && val > Number(f.max)) return false;
        return true;
      });
    });
    // Sort
    data.sort(function(a, b) {
      var av = a[_s.sortCol], bv = b[_s.sortCol];
      if (typeof av === 'string') return _s.sortDir * av.localeCompare(bv);
      // handle Infinity
      if (!isFinite(av) && !isFinite(bv)) return 0;
      if (!isFinite(av)) return -_s.sortDir;
      if (!isFinite(bv)) return _s.sortDir;
      return _s.sortDir * (av - bv);
    });
    _s.filteredData = data;
  }

  // ── Table head ───────────────────────────────────────────────────────────────
  function stgRenderHead() {
    var thead = document.getElementById('stg-thead');
    if (!thead) return;
    var html = '<tr>';
    STG_COLS.forEach(function(col) {
      var isSort = _s.sortCol === col.key;
      var sortInd = isSort ? '<span class="stg-sort-ind">' + (_s.sortDir === 1 ? '↑' : '↓') + '</span>' : '';
      var hasFilter = !!_s.colFilters[col.key];
      var fiCls = 'stg-fi' + (hasFilter ? ' on' : '');
      var fiSvg = '<svg class="' + fiCls + '" data-filter-col="' + col.key + '" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="' + (hasFilter ? 'var(--color-blue)' : 'var(--color-text-inactive)') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;" title="Filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>';
      html += '<th class="' + (col.align === 'right' ? 'r' : '') + '" data-sort-col="' + col.key + '">';
      html += '<div class="stg-th-in">';
      html += col.label + ' ' + sortInd + ' ' + fiSvg;
      html += '</div></th>';
    });
    html += '</tr>';
    thead.innerHTML = html;
  }

  // ── Table body ───────────────────────────────────────────────────────────────
  function stgRenderBody() {
    var tbody = document.getElementById('stg-tbody');
    if (!tbody) return;
    var start = (_s.page - 1) * _s.pageSize;
    var slice = _s.filteredData.slice(start, start + _s.pageSize);
    if (!slice.length) {
      tbody.innerHTML = '<tr><td colspan="' + STG_COLS.length + '" style="text-align:center;padding:32px;color:var(--color-text-caption);">No rows match the current filters.</td></tr>';
      return;
    }
    tbody.innerHTML = slice.map(function(row) {
      return '<tr>' + STG_COLS.map(function(col) {
        return '<td class="' + (col.align === 'right' ? 'r' : '') + '">' + stgFmtCell(col.key, row) + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  // ── Pagination ───────────────────────────────────────────────────────────────
  function stgRenderPagination() {
    var el = document.getElementById('stg-pagination');
    if (!el) return;
    var total = _s.filteredData.length;
    var start = (_s.page - 1) * _s.pageSize + 1;
    var end   = Math.min(_s.page * _s.pageSize, total);
    var maxPage = Math.max(1, Math.ceil(total / _s.pageSize));
    el.innerHTML =
      '<div class="stg-pag-nav">' +
        '<button class="stg-pag-btn" id="stg-prev-btn"' + (_s.page <= 1 ? ' disabled' : '') + '>← Previous</button>' +
      '</div>' +
      '<div class="stg-pag-info">Showing ' + (total ? start : 0) + '–' + end + ' of ' + total + ' rows &nbsp;|&nbsp; Per page:' +
        '<select class="stg-pag-size" id="stg-page-size">' +
          [10,50,100,200,500].map(function(n){ return '<option value="' + n + '"' + (_s.pageSize === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
        '</select>' +
      '</div>' +
      '<div class="stg-pag-nav">' +
        '<button class="stg-pag-btn" id="stg-next-btn"' + (_s.page >= maxPage ? ' disabled' : '') + '>Next →</button>' +
      '</div>';
  }

  // ── Full results render ──────────────────────────────────────────────────────
  function stgRenderResults() {
    stgApplyFilters();
    stgRenderHead();
    stgRenderBody();
    stgRenderPagination();
  }

  // ── Dropdown helpers ─────────────────────────────────────────────────────────
  function stgCloseAllDd() {
    document.querySelectorAll('.stg-dd-panel').forEach(function(p){ p.style.display = 'none'; });
    _s.openDd = null;
  }
  function stgOpenDd(panelId, btnId) {
    stgCloseAllDd();
    var panel = document.getElementById(panelId);
    var btn   = document.getElementById(btnId);
    if (!panel || !btn) return;
    var rect = btn.getBoundingClientRect();
    panel.style.left = rect.left + 'px';
    panel.style.top  = (rect.bottom + 4) + 'px';
    panel.style.display = 'block';
    _s.openDd = panelId;
  }

  // ── Build dropdown content ───────────────────────────────────────────────────
  function stgBuildClientDd() {
    var panel = document.getElementById('stg-client-panel');
    if (!panel || !window.ARGOS_CLIENTS) return;
    panel.innerHTML = '';
    window.ARGOS_CLIENTS.forEach(function(c) {
      var d = document.createElement('div');
      d.className = 'stg-dd-item' + (c.name === _s.client ? ' stg-selected' : '');
      d.textContent = c.name;
      d.addEventListener('click', function(){
        _s.client  = c.name;
        _s.website = c.websites[0] || '';
        document.getElementById('stg-client-label').textContent  = c.name;
        document.getElementById('stg-website-label').textContent = _s.website;
        stgCloseAllDd(); stgRenderSummary();
        if (_s.analyzed) { stgRenderResults(); }
      });
      panel.appendChild(d);
    });
  }

  function stgBuildWebsiteDd() {
    var panel = document.getElementById('stg-website-panel');
    if (!panel || !window.ARGOS_CLIENTS) return;
    var client = window.ARGOS_CLIENTS.find(function(c){ return c.name === _s.client; });
    if (!client) return;
    panel.innerHTML = '';
    client.websites.forEach(function(w) {
      var d = document.createElement('div');
      d.className = 'stg-dd-item' + (w === _s.website ? ' stg-selected' : '');
      d.textContent = w;
      d.addEventListener('click', function(){
        _s.website = w;
        document.getElementById('stg-website-label').textContent = w;
        stgCloseAllDd(); stgRenderSummary();
      });
      panel.appendChild(d);
    });
  }

  function stgBuildDateDd() {
    var panel = document.getElementById('stg-date-panel');
    if (!panel) return;
    panel.innerHTML = '';
    ['Last 90 Days','Last 180 Days','Last 1 Year','Last 2 Years','Last 3 Years'].forEach(function(opt) {
      var d = document.createElement('div');
      d.className = 'stg-dd-item' + (opt === _s.dateRange ? ' stg-selected' : '');
      d.textContent = opt;
      d.addEventListener('click', function(){
        _s.dateRange = opt;
        document.getElementById('stg-date-label').textContent = opt;
        stgCloseAllDd(); stgRenderSummary();
      });
      panel.appendChild(d);
    });
  }

  function stgBuildNgramDd() {
    var panel = document.getElementById('stg-ngram-panel');
    if (!panel) return;
    panel.innerHTML = '';
    ['1 (Unigram)','2 (Bigram)','3 (Trigram)','4 (4-gram)'].forEach(function(opt) {
      var d = document.createElement('div');
      d.className = 'stg-dd-item' + (opt === _s.ngramSize ? ' stg-selected' : '');
      d.textContent = opt;
      d.addEventListener('click', function(){
        _s.ngramSize = opt;
        document.getElementById('stg-ngram-label').textContent = opt;
        stgCloseAllDd(); stgRenderSummary();
      });
      panel.appendChild(d);
    });
  }

  function stgBuildRuleOpDd() {
    var panel = document.getElementById('stg-rule-op-panel');
    if (!panel) return;
    panel.innerHTML = '';
    ['Does Not Contain','Contains'].forEach(function(opt) {
      var d = document.createElement('div');
      d.className = 'stg-dd-item' + (opt === _s.ruleOp ? ' stg-selected' : '');
      d.textContent = opt;
      d.addEventListener('click', function(){
        _s.ruleOp = opt;
        document.getElementById('stg-rule-op-label').textContent = opt;
        stgCloseAllDd();
      });
      panel.appendChild(d);
    });
  }

  function stgBuildCampaignDd() {
    var panel = document.getElementById('stg-campaign-panel');
    if (!panel) return;
    panel.innerHTML = '';
    // Select All
    var allChecked = _s.selectedCampaigns.length === STG_CAMPAIGNS.length;
    var allItem = document.createElement('div');
    allItem.className = 'stg-dd-item';
    allItem.innerHTML = '<input type="checkbox" ' + (allChecked ? 'checked' : '') + ' id="stg-camp-all" style="cursor:pointer;"> <label for="stg-camp-all" style="cursor:pointer;">Select All</label>';
    allItem.addEventListener('click', function(e) {
      if (e.target.tagName !== 'INPUT') { var cb = allItem.querySelector('input'); cb.checked = !cb.checked; e.preventDefault(); }
      var cb2 = allItem.querySelector('input');
      _s.selectedCampaigns = cb2.checked ? STG_CAMPAIGNS.slice() : [];
      stgBuildCampaignDd(); stgUpdateCampaignLabel(); stgRenderSummary();
    });
    panel.appendChild(allItem);
    var div = document.createElement('div'); div.style.cssText = 'height:1px;background:var(--color-border);margin:4px 0;'; panel.appendChild(div);
    STG_CAMPAIGNS.forEach(function(camp) {
      var checked = _s.selectedCampaigns.indexOf(camp) !== -1;
      var item = document.createElement('div');
      item.className = 'stg-dd-item';
      var id = 'stg-camp-' + camp.replace(/[^a-z0-9]/gi,'_');
      item.innerHTML = '<input type="checkbox" ' + (checked ? 'checked' : '') + ' id="' + id + '" style="cursor:pointer;"> <label for="' + id + '" style="cursor:pointer;font-size:12px;">' + camp + '</label>';
      item.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT') { var cb = item.querySelector('input'); cb.checked = !cb.checked; e.preventDefault(); }
        var cb2 = item.querySelector('input');
        var idx = _s.selectedCampaigns.indexOf(camp);
        if (cb2.checked && idx === -1) _s.selectedCampaigns.push(camp);
        else if (!cb2.checked && idx !== -1) _s.selectedCampaigns.splice(idx, 1);
        stgBuildCampaignDd(); stgUpdateCampaignLabel(); stgRenderSummary();
      });
      panel.appendChild(item);
    });
  }

  function stgUpdateCampaignLabel() {
    var lbl = document.getElementById('stg-campaign-label');
    if (!lbl) return;
    if (_s.selectedCampaigns.length === STG_CAMPAIGNS.length) lbl.textContent = 'All Campaigns';
    else if (_s.selectedCampaigns.length === 0) lbl.textContent = 'None selected';
    else lbl.textContent = _s.selectedCampaigns.length + ' campaigns selected';
  }

  // ── Tags ─────────────────────────────────────────────────────────────────────
  function stgRenderRuleTags() {
    var el = document.getElementById('stg-rule-tags');
    if (!el) return;
    el.innerHTML = _s.campaignRules.map(function(r, i) {
      return '<span class="stg-tag">' + r.op + ': \'' + r.val + '\'' +
        '<span class="stg-tag-x" data-rule-idx="' + i + '"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>' +
        '</span>';
    }).join('');
  }

  function stgRenderBlacklistTags() {
    var el = document.getElementById('stg-blacklist-tags');
    if (!el) return;
    el.innerHTML = _s.blacklist.map(function(w, i) {
      return '<span class="stg-tag">' + w +
        '<span class="stg-tag-x" data-bl-idx="' + i + '"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>' +
        '</span>';
    }).join('');
  }

  // ── Column filter panel ──────────────────────────────────────────────────────
  function stgOpenFilterPanel(colKey, iconEl) {
    stgCloseAllDd();
    var isText = colKey === 'ngram';
    var panelId = isText ? 'stg-fp-ngram' : 'stg-fp-num';
    var panel = document.getElementById(panelId);
    if (!panel) return;
    var rect = iconEl.getBoundingClientRect();
    panel.style.left = (rect.left - 80) + 'px';
    panel.style.top  = (rect.bottom + 6) + 'px';
    panel.style.display = 'block';
    _s.activeFilterCol = colKey;
    if (isText) {
      var inp = document.getElementById('stg-fp-ngram-input');
      if (inp) inp.value = (_s.colFilters[colKey] && _s.colFilters[colKey].text) || '';
    } else {
      var minInp = document.getElementById('stg-fp-num-min');
      var maxInp = document.getElementById('stg-fp-num-max');
      var cf = _s.colFilters[colKey] || {};
      if (minInp) minInp.value = cf.min !== undefined ? cf.min : '';
      if (maxInp) maxInp.value = cf.max !== undefined ? cf.max : '';
    }
  }

  function stgCloseFilterPanels() {
    var p1 = document.getElementById('stg-fp-ngram');
    var p2 = document.getElementById('stg-fp-num');
    if (p1) p1.style.display = 'none';
    if (p2) p2.style.display = 'none';
    _s.activeFilterCol = null;
  }

  // ── CSV export ───────────────────────────────────────────────────────────────
  function stgExportCSV(useRaw) {
    var rows = useRaw ? STG_DATA : _s.filteredData;
    var today = new Date('2026-03-25').toISOString().slice(0,10);
    var fname = useRaw ? 'search-terms-raw-' + today + '.csv' : 'search-term-grader-' + today + '.csv';
    var headers = ['N-gram','Impressions','Clicks','Conversions','CTR (%)','Cost','Revenue','CPC','VPC','Gross Profit','COS (%)'];
    var lines = [headers.join(',')];
    rows.forEach(function(r) {
      var cos = !isFinite(r.cos) ? '∞' : (r.cos * 100).toFixed(2);
      lines.push([
        '"' + r.ngram + '"', r.impr, r.clicks, r.conv.toFixed(2),
        r.ctr.toFixed(2), r.cost.toFixed(2), r.rev.toFixed(2),
        r.cpc.toFixed(2), r.vpc.toFixed(2), r.gp.toFixed(2), cos
      ].join(','));
    });
    var blob = new Blob([lines.join('\n')], { type:'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = fname; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Run analysis ─────────────────────────────────────────────────────────────
  function stgRunAnalysis() {
    _s.analyzed = true;
    _s.page = 1;
    _s.colFilters = {};
    document.getElementById('stg-empty').style.display  = 'none';
    document.getElementById('stg-results').style.display = 'block';
    var exp = document.getElementById('stg-export-btn');
    if (exp) exp.style.display = 'inline-flex';
    stgRenderResults();
  }

  // ── Event wiring ─────────────────────────────────────────────────────────────
  var _stgInit = false;
  function stgWireEvents() {
    if (_stgInit) return;
    _stgInit = true;

    document.addEventListener('click', function(e) {
      var page = document.getElementById('search-term-grader-page');
      if (!page || page.style.display === 'none') return;

      // Close dropdowns on outside click
      if (!e.target.closest('.stg-dd-btn') && !e.target.closest('.stg-dd-panel')) {
        stgCloseAllDd();
      }
      // Close filter panels on outside click
      if (!e.target.closest('.stg-fp') && !e.target.closest('[data-filter-col]')) {
        stgCloseFilterPanels();
      }

      // Controls
      if (e.target.closest('#stg-client-btn')) { stgBuildClientDd(); stgOpenDd('stg-client-panel','stg-client-btn'); return; }
      if (e.target.closest('#stg-website-btn')) { stgBuildWebsiteDd(); stgOpenDd('stg-website-panel','stg-website-btn'); return; }
      if (e.target.closest('#stg-date-btn')) { stgBuildDateDd(); stgOpenDd('stg-date-panel','stg-date-btn'); return; }

      // Config
      if (e.target.closest('#stg-ngram-btn')) { stgBuildNgramDd(); stgOpenDd('stg-ngram-panel','stg-ngram-btn'); return; }
      if (e.target.closest('#stg-rule-op-btn')) { stgBuildRuleOpDd(); stgOpenDd('stg-rule-op-panel','stg-rule-op-btn'); return; }
      if (e.target.closest('#stg-campaign-btn')) { stgBuildCampaignDd(); stgOpenDd('stg-campaign-panel','stg-campaign-btn'); return; }

      // Advanced toggle
      if (e.target.closest('#stg-advanced-toggle')) {
        _s.advOpen = !_s.advOpen;
        document.getElementById('stg-advanced-body').classList.toggle('open', _s.advOpen);
        var chev = document.getElementById('stg-advanced-chev');
        if (chev) chev.style.transform = _s.advOpen ? 'rotate(180deg)' : '';
        return;
      }

      // Add campaign name rule
      if (e.target.closest('#stg-rule-add-btn')) {
        var txt = document.getElementById('stg-rule-text');
        if (txt && txt.value.trim()) {
          _s.campaignRules.push({ op: _s.ruleOp, val: txt.value.trim() });
          txt.value = '';
          stgRenderRuleTags();
        }
        return;
      }

      // Remove campaign rule tag
      var ruleX = e.target.closest('[data-rule-idx]');
      if (ruleX) {
        _s.campaignRules.splice(parseInt(ruleX.getAttribute('data-rule-idx')), 1);
        stgRenderRuleTags();
        return;
      }

      // Add blacklist word
      if (e.target.closest('#stg-blacklist-add-btn')) {
        var bl = document.getElementById('stg-blacklist-text');
        if (bl && bl.value.trim()) {
          _s.blacklist.push(bl.value.trim().toLowerCase());
          bl.value = '';
          stgRenderBlacklistTags(); stgRenderSummary();
        }
        return;
      }

      // Remove blacklist tag
      var blX = e.target.closest('[data-bl-idx]');
      if (blX) {
        _s.blacklist.splice(parseInt(blX.getAttribute('data-bl-idx')), 1);
        stgRenderBlacklistTags(); stgRenderSummary();
        return;
      }

      // Analyze
      if (e.target.closest('#stg-analyze-btn')) { stgRunAnalysis(); return; }

      // Export / raw
      if (e.target.closest('#stg-export-btn')) { stgExportCSV(false); return; }
      if (e.target.closest('#stg-raw-btn'))    { stgExportCSV(true);  return; }

      // Column filter icon
      var fiEl = e.target.closest('[data-filter-col]');
      if (fiEl && e.target.closest('#stg-results')) {
        e.stopPropagation();
        stgOpenFilterPanel(fiEl.getAttribute('data-filter-col'), fiEl);
        return;
      }

      // Sort column header
      var th = e.target.closest('th[data-sort-col]');
      if (th && !e.target.closest('[data-filter-col]')) {
        var col = th.getAttribute('data-sort-col');
        if (_s.sortCol === col) _s.sortDir *= -1;
        else { _s.sortCol = col; _s.sortDir = -1; }
        _s.page = 1;
        stgRenderResults();
        return;
      }

      // Pagination
      if (e.target.closest('#stg-prev-btn')) { if (_s.page > 1) { _s.page--; stgRenderResults(); } return; }
      if (e.target.closest('#stg-next-btn')) {
        var maxP = Math.ceil(_s.filteredData.length / _s.pageSize);
        if (_s.page < maxP) { _s.page++; stgRenderResults(); }
        return;
      }

      // Nav links
      var navLink = e.target.closest('[data-nav]');
      if (navLink && e.target.closest('#search-term-grader-page')) {
        var nav = navLink.getAttribute('data-nav');
        var kid = document.querySelector('[data-nav="' + nav + '"].sb-kid');
        if (kid) kid.click();
      }
    });

    // Filter panel: ngram apply/clear
    document.addEventListener('click', function(e) {
      if (e.target.id === 'stg-fp-ngram-apply') {
        var v = document.getElementById('stg-fp-ngram-input').value.trim();
        if (v) _s.colFilters[_s.activeFilterCol] = { text: v };
        else delete _s.colFilters[_s.activeFilterCol];
        stgCloseFilterPanels(); _s.page = 1; stgRenderResults(); return;
      }
      if (e.target.id === 'stg-fp-ngram-clear') {
        delete _s.colFilters[_s.activeFilterCol];
        stgCloseFilterPanels(); _s.page = 1; stgRenderResults(); return;
      }
      if (e.target.id === 'stg-fp-num-apply') {
        var mn = document.getElementById('stg-fp-num-min').value;
        var mx = document.getElementById('stg-fp-num-max').value;
        if (mn !== '' || mx !== '') {
          _s.colFilters[_s.activeFilterCol] = {};
          if (mn !== '') _s.colFilters[_s.activeFilterCol].min = parseFloat(mn);
          if (mx !== '') _s.colFilters[_s.activeFilterCol].max = parseFloat(mx);
        } else delete _s.colFilters[_s.activeFilterCol];
        stgCloseFilterPanels(); _s.page = 1; stgRenderResults(); return;
      }
      if (e.target.id === 'stg-fp-num-clear') {
        delete _s.colFilters[_s.activeFilterCol];
        stgCloseFilterPanels(); _s.page = 1; stgRenderResults(); return;
      }
    });

    // Page size change
    document.addEventListener('change', function(e) {
      var page = document.getElementById('search-term-grader-page');
      if (!page || page.style.display === 'none') return;
      if (e.target.id === 'stg-page-size') {
        _s.pageSize = parseInt(e.target.value);
        _s.page = 1;
        stgRenderResults();
      }
      if (e.target.id === 'stg-min-cos') {
        _s.minCos = parseFloat(e.target.value) || 0;
        stgRenderSummary();
      }
      if (e.target.id === 'stg-min-clicks') {
        _s.minClicks = parseInt(e.target.value) || 1;
        stgRenderSummary();
      }
    });
    // Also update on input (live)
    document.addEventListener('input', function(e) {
      var page = document.getElementById('search-term-grader-page');
      if (!page || page.style.display === 'none') return;
      if (e.target.id === 'stg-min-cos') { _s.minCos = parseFloat(e.target.value) || 0; stgRenderSummary(); }
      if (e.target.id === 'stg-min-clicks') { _s.minClicks = parseInt(e.target.value) || 1; stgRenderSummary(); }
    });
    // Enter key on rule/blacklist inputs
    document.addEventListener('keydown', function(e) {
      var page = document.getElementById('search-term-grader-page');
      if (!page || page.style.display === 'none') return;
      if (e.key === 'Enter') {
        if (e.target.id === 'stg-rule-text') document.getElementById('stg-rule-add-btn').click();
        if (e.target.id === 'stg-blacklist-text') document.getElementById('stg-blacklist-add-btn').click();
      }
    });
  }

  // ── Public entry ─────────────────────────────────────────────────────────────
  window.showSearchTermGraderPage = function() {
    if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
    var fdp = document.getElementById('feed-data-page'); if (fdp) fdp.style.display = 'none';
    var page = document.getElementById('search-term-grader-page');
    if (!page) return;
    page.style.display = 'block';
    window.scrollTo(0, 0);
    stgWireEvents();
    stgRenderSummary();
    stgUpdateCampaignLabel();
  };

})();
