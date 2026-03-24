(function () {
  'use strict';

  // ── Chart colour palette ──
  var CHART_COLORS = ['#346ed9','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899'];

  // ── All available dimensions ──
  var ALL_DIMS = [
    'Campaigns', 'Ad Groups', 'Product Segments',
    'Labels', 'Brand / No Brand', 'Channel', 'Tiers',
    'Page Type', 'Page URL'
  ];

  // ── All metric columns ──
  var ALL_COLS = [
    { id: 'spend',       label: 'Spend',          fmt: 'currency', agg: 'sum',  cosColor: false },
    { id: 'revenue',     label: 'Revenue',        fmt: 'currency', agg: 'sum',  cosColor: false },
    { id: 'cos',         label: 'COS',            fmt: 'pct',      agg: 'wavg', cosColor: true  },
    { id: 'roas',        label: 'ROAS',           fmt: 'roas',     agg: 'wavg', cosColor: false },
    { id: 'conversions', label: 'Conversions',    fmt: 'int',      agg: 'sum',  cosColor: false },
    { id: 'convRate',    label: 'Conv. Rate',     fmt: 'pct',      agg: 'wavg', cosColor: false },
    { id: 'clicks',      label: 'Clicks',         fmt: 'int',      agg: 'sum',  cosColor: false },
    { id: 'cpc',         label: 'CPC',            fmt: 'currency', agg: 'wavg', cosColor: false },
    { id: 'orgRevenue',  label: 'Org. Revenue',   fmt: 'currency', agg: 'sum',  cosColor: false },
    { id: 'sessions',    label: 'Org. Sessions',  fmt: 'int',      agg: 'sum',  cosColor: false },
    { id: 'aov',         label: 'AOV',            fmt: 'currency', agg: 'wavg', cosColor: false },
    { id: 'bounceRate',  label: 'Bounce Rate',    fmt: 'pct',      agg: 'wavg', cosColor: false }
  ];

  // ── SEM campaign hierarchy (Outdoor Research) ──
  var OR_CAMPAIGNS = [
    {
      name: 'Brand Campaigns',
      spend: 12400, revenue: 89200, cos: 0.139, roas: 7.2, conversions: 487, convRate: 0.041, clicks: 11840, cpc: 1.05,
      children: [
        {
          name: 'Jackets — Brand',
          spend: 3100, revenue: 22300, cos: 0.139, roas: 7.2, conversions: 122, convRate: 0.041, clicks: 2960, cpc: 1.05,
          children: [
            { name: 'Hardshell Jackets',   spend: 1240, revenue: 8920,  cos: 0.139, roas: 7.2, conversions: 49, convRate: 0.041, clicks: 1184, cpc: 1.05 },
            { name: 'Softshell Jackets',   spend: 1085, revenue: 7805,  cos: 0.139, roas: 7.2, conversions: 43, convRate: 0.041, clicks: 1035, cpc: 1.05 },
            { name: 'Rain Jackets',        spend:  775, revenue: 5575,  cos: 0.139, roas: 7.2, conversions: 30, convRate: 0.041, clicks:  741, cpc: 1.05 }
          ]
        },
        {
          name: 'Footwear — Brand',
          spend: 2480, revenue: 17840, cos: 0.139, roas: 7.2, conversions: 98, convRate: 0.041, clicks: 2368, cpc: 1.05,
          children: [
            { name: 'Trail Running Shoes',   spend: 992, revenue: 7136, cos: 0.139, roas: 7.2, conversions: 39, convRate: 0.041, clicks:  947, cpc: 1.05 },
            { name: 'Hiking Boots',          spend: 868, revenue: 6244, cos: 0.139, roas: 7.2, conversions: 34, convRate: 0.041, clicks:  828, cpc: 1.05 },
            { name: 'Sandals & Water Shoes', spend: 620, revenue: 4460, cos: 0.139, roas: 7.2, conversions: 25, convRate: 0.041, clicks:  593, cpc: 1.05 }
          ]
        },
        {
          name: 'Fleece — Brand',
          spend: 4030, revenue: 28990, cos: 0.139, roas: 7.2, conversions: 158, convRate: 0.041, clicks: 3840, cpc: 1.05,
          children: [
            { name: 'Full-Zip Fleece', spend: 1612, revenue: 11596, cos: 0.139, roas: 7.2, conversions: 63, convRate: 0.041, clicks: 1536, cpc: 1.05 },
            { name: 'Pullover Fleece', spend: 1411, revenue: 10147, cos: 0.139, roas: 7.2, conversions: 55, convRate: 0.041, clicks: 1344, cpc: 1.05 },
            { name: 'Fleece Vests',    spend: 1007, revenue:  7247, cos: 0.139, roas: 7.2, conversions: 40, convRate: 0.041, clicks:  960, cpc: 1.05 }
          ]
        },
        {
          name: 'Accessories — Brand',
          spend: 2790, revenue: 20070, cos: 0.139, roas: 7.2, conversions: 109, convRate: 0.041, clicks: 2672, cpc: 1.05,
          children: [
            { name: 'Gloves & Mittens',       spend: 1116, revenue: 8028, cos: 0.139, roas: 7.2, conversions: 44, convRate: 0.041, clicks: 1069, cpc: 1.05 },
            { name: 'Hats & Beanies',         spend:  837, revenue: 6021, cos: 0.139, roas: 7.2, conversions: 33, convRate: 0.041, clicks:  802, cpc: 1.05 },
            { name: 'Gaiters & Neck Warmers', spend:  837, revenue: 6021, cos: 0.139, roas: 7.2, conversions: 32, convRate: 0.041, clicks:  801, cpc: 1.05 }
          ]
        }
      ]
    },
    {
      name: 'Non-Brand',
      spend: 54200, revenue: 198400, cos: 0.273, roas: 3.7, conversions: 1043, convRate: 0.023, clicks: 45300, cpc: 1.20,
      children: [
        {
          name: 'Jackets — Non-Brand',
          spend: 18200, revenue: 66600, cos: 0.273, roas: 3.7, conversions: 350, convRate: 0.023, clicks: 15200, cpc: 1.20,
          children: [
            { name: 'Hardshell Jackets', spend: 7280, revenue: 26640, cos: 0.273, roas: 3.7, conversions: 140, convRate: 0.023, clicks: 6080, cpc: 1.20 },
            { name: 'Rain Jackets',      spend: 5460, revenue: 19980, cos: 0.273, roas: 3.7, conversions: 105, convRate: 0.023, clicks: 4560, cpc: 1.20 },
            { name: 'Softshell Jackets', spend: 3640, revenue: 13320, cos: 0.273, roas: 3.7, conversions:  70, convRate: 0.023, clicks: 3040, cpc: 1.20 },
            { name: 'Down Jackets',      spend: 1820, revenue:  6660, cos: 0.273, roas: 3.7, conversions:  35, convRate: 0.023, clicks: 1520, cpc: 1.20 }
          ]
        },
        {
          name: 'Footwear — Non-Brand',
          spend: 14900, revenue: 54500, cos: 0.273, roas: 3.7, conversions: 286, convRate: 0.023, clicks: 12450, cpc: 1.20,
          children: [
            { name: 'Trail Running Shoes', spend: 5960, revenue: 21800, cos: 0.273, roas: 3.7, conversions: 114, convRate: 0.023, clicks: 4980, cpc: 1.20 },
            { name: 'Hiking Boots',        spend: 4470, revenue: 16350, cos: 0.273, roas: 3.7, conversions:  86, convRate: 0.023, clicks: 3735, cpc: 1.20 },
            { name: 'Approach Shoes',      spend: 2980, revenue: 10900, cos: 0.273, roas: 3.7, conversions:  57, convRate: 0.023, clicks: 2490, cpc: 1.20 },
            { name: 'Waterproof Boots',    spend: 1490, revenue:  5450, cos: 0.273, roas: 3.7, conversions:  29, convRate: 0.023, clicks: 1245, cpc: 1.20 }
          ]
        },
        {
          name: 'Sleeping Bags — Non-Brand',
          spend: 12100, revenue: 44300, cos: 0.273, roas: 3.7, conversions: 233, convRate: 0.023, clicks: 10150, cpc: 1.20,
          children: [
            { name: 'Down Sleeping Bags',       spend: 4840, revenue: 17720, cos: 0.273, roas: 3.7, conversions:  93, convRate: 0.023, clicks: 4060, cpc: 1.20 },
            { name: 'Synthetic Sleeping Bags',  spend: 4840, revenue: 17720, cos: 0.273, roas: 3.7, conversions:  93, convRate: 0.023, clicks: 4060, cpc: 1.20 },
            { name: 'Sleeping Bag Liners',      spend: 2420, revenue:  8860, cos: 0.273, roas: 3.7, conversions:  47, convRate: 0.023, clicks: 2030, cpc: 1.20 }
          ]
        },
        {
          name: 'Accessories — Non-Brand',
          spend: 9000, revenue: 33000, cos: 0.273, roas: 3.7, conversions: 174, convRate: 0.023, clicks: 7500, cpc: 1.20,
          children: [
            { name: 'Trekking Poles', spend: 3600, revenue: 13200, cos: 0.273, roas: 3.7, conversions: 70, convRate: 0.023, clicks: 3000, cpc: 1.20 },
            { name: 'Headlamps',      spend: 2700, revenue:  9900, cos: 0.273, roas: 3.7, conversions: 52, convRate: 0.023, clicks: 2250, cpc: 1.20 },
            { name: 'Gaiters',        spend: 2700, revenue:  9900, cos: 0.273, roas: 3.7, conversions: 52, convRate: 0.023, clicks: 2250, cpc: 1.20 }
          ]
        }
      ]
    },
    {
      name: 'Shopping',
      spend: 31850, revenue: 199720, cos: 0.159, roas: 6.3, conversions: 1024, convRate: 0.038, clicks: 26900, cpc: 1.18,
      children: [
        {
          name: 'Jackets — Shopping',
          spend: 10200, revenue: 64100, cos: 0.159, roas: 6.3, conversions: 328, convRate: 0.038, clicks: 8620, cpc: 1.18,
          children: [
            { name: 'Hardshell Jackets', spend: 4080, revenue: 25640, cos: 0.159, roas: 6.3, conversions: 131, convRate: 0.038, clicks: 3448, cpc: 1.18 },
            { name: 'Down Jackets',      spend: 3060, revenue: 19230, cos: 0.159, roas: 6.3, conversions:  98, convRate: 0.038, clicks: 2586, cpc: 1.18 },
            { name: 'Rain Jackets',      spend: 3060, revenue: 19230, cos: 0.159, roas: 6.3, conversions:  99, convRate: 0.038, clicks: 2586, cpc: 1.18 }
          ]
        },
        {
          name: 'Footwear — Shopping',
          spend: 8800, revenue: 55200, cos: 0.159, roas: 6.3, conversions: 282, convRate: 0.038, clicks: 7440, cpc: 1.18,
          children: [
            { name: 'Trail Running Shoes', spend: 3520, revenue: 22080, cos: 0.159, roas: 6.3, conversions: 113, convRate: 0.038, clicks: 2976, cpc: 1.18 },
            { name: 'Hiking Boots',        spend: 3520, revenue: 22080, cos: 0.159, roas: 6.3, conversions: 113, convRate: 0.038, clicks: 2976, cpc: 1.18 },
            { name: 'Waterproof Footwear', spend: 1760, revenue: 11040, cos: 0.159, roas: 6.3, conversions:  56, convRate: 0.038, clicks: 1488, cpc: 1.18 }
          ]
        },
        {
          name: 'Fleece — Shopping',
          spend: 7400, revenue: 46460, cos: 0.159, roas: 6.3, conversions: 237, convRate: 0.038, clicks: 6250, cpc: 1.18,
          children: [
            { name: 'Full-Zip Fleece', spend: 2960, revenue: 18584, cos: 0.159, roas: 6.3, conversions:  95, convRate: 0.038, clicks: 2500, cpc: 1.18 },
            { name: 'Fleece Jackets',  spend: 2960, revenue: 18584, cos: 0.159, roas: 6.3, conversions:  95, convRate: 0.038, clicks: 2500, cpc: 1.18 },
            { name: 'Fleece Vests',    spend: 1480, revenue:  9292, cos: 0.159, roas: 6.3, conversions:  47, convRate: 0.038, clicks: 1250, cpc: 1.18 }
          ]
        },
        {
          name: 'Sleeping Bags — Shopping',
          spend: 5450, revenue: 33960, cos: 0.159, roas: 6.3, conversions: 177, convRate: 0.038, clicks: 4590, cpc: 1.18,
          children: [
            { name: 'Down Sleeping Bags',       spend: 2725, revenue: 17060, cos: 0.159, roas: 6.3, conversions: 89, convRate: 0.038, clicks: 2295, cpc: 1.18 },
            { name: 'Synthetic Sleeping Bags',  spend: 2180, revenue: 13648, cos: 0.159, roas: 6.3, conversions: 71, convRate: 0.038, clicks: 1836, cpc: 1.18 },
            { name: 'Ultralight Sleeping Bags', spend:  545, revenue:  3252, cos: 0.159, roas: 6.3, conversions: 17, convRate: 0.038, clicks:  459, cpc: 1.18 }
          ]
        }
      ]
    }
  ];

  // ── Per-client aggregate metrics (keyed by client name) ──
  var CLIENT_METRICS = {
    'Link Imaging':                { spend: 142800, revenue: 524600, cos: 0.272, roas: 3.67, conversions: 2841, convRate: 0.021, clicks: 135200, cpc: 1.06 },
    'Biddy Murphy':                { spend:  18400, revenue:  62800, cos: 0.293, roas: 3.41, conversions:  412, convRate: 0.028, clicks:  14720, cpc: 1.25 },
    "People's Choice Beef Jerky":  { spend:  24600, revenue:  98400, cos: 0.250, roas: 4.00, conversions:  621, convRate: 0.031, clicks:  20050, cpc: 1.23 },
    'Simply Authentic LLC':        { spend:  11200, revenue:  38600, cos: 0.290, roas: 3.45, conversions:  284, convRate: 0.026, clicks:  10920, cpc: 1.03 },
    'MojoMotoSport.com':           { spend:  38400, revenue: 124800, cos: 0.308, roas: 3.25, conversions:  714, convRate: 0.019, clicks:  37600, cpc: 1.02 },
    'Danielhouse Studios Inc':     { spend:   8200, revenue:  31400, cos: 0.261, roas: 3.83, conversions:  198, convRate: 0.022, clicks:   9000, cpc: 0.91 },
    'ScaffoldMart':                { spend:  22400, revenue:  72000, cos: 0.311, roas: 3.21, conversions:  386, convRate: 0.018, clicks:  21440, cpc: 1.04 },
    'BRobinson, LLC':              { spend:  31200, revenue: 142000, cos: 0.220, roas: 4.55, conversions:  892, convRate: 0.034, clicks:  26240, cpc: 1.19 },
    'Microscope.com':              { spend:  19400, revenue:  89200, cos: 0.217, roas: 4.60, conversions:  412, convRate: 0.029, clicks:  14200, cpc: 1.37 },
    'Grovemade':                   { spend:  28600, revenue: 104800, cos: 0.273, roas: 3.66, conversions:  634, convRate: 0.027, clicks:  23480, cpc: 1.22 },
    'Dungarees':                   { spend:  44200, revenue: 184800, cos: 0.239, roas: 4.18, conversions: 1124, convRate: 0.032, clicks:  35120, cpc: 1.26 },
    'Outdoor Research':            { spend:  98450, revenue: 487320, cos: 0.202, roas: 4.95, conversions: 2554, convRate: 0.030, clicks:  84040, cpc: 1.17,
                                     orgRevenue: 265282, sessions: 111960, aov: 175, bounceRate: 0.47 },
    'Chantelle Lingerie Inc':      { spend:  34800, revenue: 128200, cos: 0.271, roas: 3.68, conversions:  782, convRate: 0.024, clicks:  32560, cpc: 1.07 },
    'Weaver':                      { spend:  52400, revenue: 198600, cos: 0.264, roas: 3.79, conversions: 1248, convRate: 0.022, clicks:  56780, cpc: 0.92 },
    'MonkeySports':                { spend: 124600, revenue: 412000, cos: 0.302, roas: 3.31, conversions: 2841, convRate: 0.020, clicks: 142100, cpc: 0.88 },
    'Orchard and Vineyard Supply': { spend:  16800, revenue:  68400, cos: 0.246, roas: 4.07, conversions:  412, convRate: 0.028, clicks:  14720, cpc: 1.14 },
    'Sunflora Inc':                { spend:  62800, revenue: 214200, cos: 0.293, roas: 3.41, conversions: 1482, convRate: 0.026, clicks:  57020, cpc: 1.10 },
    'Royal Swimming Pools':        { spend:  28400, revenue: 124600, cos: 0.228, roas: 4.39, conversions:  624, convRate: 0.031, clicks:  20160, cpc: 1.41 },
    'My Binding':                  { spend:  42600, revenue: 148800, cos: 0.286, roas: 3.49, conversions: 1024, convRate: 0.024, clicks:  42680, cpc: 1.00 },
    'eOutdoors':                   { spend:  58200, revenue: 218400, cos: 0.267, roas: 3.75, conversions: 1412, convRate: 0.025, clicks:  56520, cpc: 1.03 },
    'Nomadic Vintage Rugs':        { spend:  21600, revenue:  96200, cos: 0.225, roas: 4.45, conversions:  512, convRate: 0.033, clicks:  15520, cpc: 1.39 }
  };

  // ── Build clients array from ARGOS_CLIENTS global ──
  function buildClients() {
    var src = (typeof ARGOS_CLIENTS !== 'undefined' ? ARGOS_CLIENTS : []);
    return src.map(function (c) {
      var m = CLIENT_METRICS[c.name] || { spend: 0, revenue: 0, cos: 0, roas: 0, conversions: 0, convRate: 0, clicks: 0, cpc: 0 };
      var n = c.websites.length;
      var websites = c.websites.map(function (w, i) {
        // distribute metrics proportionally with slight variation
        var factor = (1 / n) * (0.9 + 0.2 * (i % 3) / 2);
        var wm = {};
        Object.keys(m).forEach(function (k) {
          wm[k] = (k === 'cos' || k === 'roas' || k === 'convRate' || k === 'cpc' || k === 'aov' || k === 'bounceRate')
            ? m[k] * (0.95 + 0.1 * ((i * 7) % 10) / 10)
            : m[k] * factor;
        });
        var site = { name: w, spend: wm.spend, revenue: wm.revenue, cos: wm.cos || m.cos, roas: wm.roas || m.roas, conversions: wm.conversions, convRate: wm.convRate || m.convRate, clicks: wm.clicks, cpc: wm.cpc || m.cpc };
        if (wm.orgRevenue) { site.orgRevenue = wm.orgRevenue; site.sessions = wm.sessions; site.aov = wm.aov; site.bounceRate = wm.bounceRate; }
        // Outdoor Research gets campaign drill-down
        if (c.name === 'Outdoor Research') site.dimChildren = OR_CAMPAIGNS;
        return site;
      });
      var client = Object.assign({ name: c.name, websites: websites }, m);
      return client;
    });
  }

  // ── State ──
  var state = {
    selectedClient:  'Outdoor Research',
    selectedWebsite: 'OutdoorResearch.com',
    dimensions: ['Campaigns'],
    visibleCols: ['spend', 'revenue', 'cos', 'roas', 'conversions', 'convRate', 'clicks', 'cpc'],
    dateRange: 'Last 30 Days',
    sortCol: null,
    sortDir: 'desc',
    expanded: {},
    chartMetrics: ['revenue']
  };

  var CLIENTS_DATA = [];
  var pvChart = null;
  var initialized = false;

  // ── Format helpers ──
  function fmtCurrency(v) {
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000)    return '$' + (v / 1000).toFixed(1) + 'k';
    if (v >= 100)     return '$' + Math.round(v);
    if (v >= 10)      return '$' + v.toFixed(1);
    return '$' + v.toFixed(2);
  }
  function fmtInt(v)  { return Math.round(v).toLocaleString(); }
  function fmtPct(v)  { return (v * 100).toFixed(1) + '%'; }
  function fmtRoas(v) { return v.toFixed(1) + 'x'; }
  function fmtVal(col, v) {
    if (v === undefined || v === null || isNaN(v)) return '—';
    if (col.fmt === 'currency') return fmtCurrency(v);
    if (col.fmt === 'int')      return fmtInt(v);
    if (col.fmt === 'pct')      return fmtPct(v);
    if (col.fmt === 'roas')     return fmtRoas(v);
    return String(v);
  }
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function hexToRgba(hex, a) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function cosClass(v) {
    if (v < 0.20) return ' pv-cos-good';
    if (v > 0.29) return ' pv-cos-warn';
    return '';
  }

  // ── Weighted average for totals ──
  function computeTotal(colDef, rows) {
    if (!rows.length) return 0;
    if (colDef.agg === 'sum') {
      return rows.reduce(function (a, r) { return a + (r[colDef.id] || 0); }, 0);
    }
    var totalW = rows.reduce(function (a, r) { return a + (r.spend || 0); }, 0);
    if (totalW === 0) return rows[0][colDef.id] || 0;
    return rows.reduce(function (a, r) { return a + (r[colDef.id] || 0) * (r.spend || 0); }, 0) / totalW;
  }

  // ── Active columns (in definition order) ──
  function getActiveCols() {
    var vis = state.visibleCols;
    return ALL_COLS.filter(function (c) { return vis.indexOf(c.id) !== -1; });
  }

  // ── Sort icon SVG ──
  function sortIcon(id) {
    if (state.sortCol !== id) {
      return '<svg class="pv-sort" width="10" height="10" viewBox="0 0 10 10" fill="none">' +
        '<path d="M3 3.5L5 1.5L7 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
        '<path d="M3 6.5L5 8.5L7 6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>';
    }
    var d = state.sortDir === 'asc'
      ? '<path d="M3 6L5 4L7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
      : '<path d="M3 4L5 6L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
    return '<svg class="pv-sort pv-sort-active" width="10" height="10" viewBox="0 0 10 10" fill="none">' + d + '</svg>';
  }

  function chevron(open) {
    return '<svg class="pv-chev' + (open ? ' open' : '') + '" width="12" height="12" viewBox="0 0 12 12" fill="none">' +
      '<path d="M4 4.5L6 6.5L8 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function metricTd(col, v) {
    var cls = 'pv-td';
    if (col.cosColor) cls += cosClass(v);
    return '<td class="' + cls + '">' + fmtVal(col, v) + '</td>';
  }

  // ── Filtered clients list ──
  function filteredClients() {
    if (state.selectedClient === 'All Clients') return CLIENTS_DATA;
    return CLIENTS_DATA.filter(function (c) { return c.name === state.selectedClient; });
  }

  // ── Chart rows: drill down so there's always multiple data points ──
  function getChartRows() {
    // All clients → one point per client
    if (state.selectedClient === 'All Clients') return CLIENTS_DATA;

    var client = CLIENTS_DATA.filter(function (c) { return c.name === state.selectedClient; })[0];
    if (!client) return CLIENTS_DATA;

    // Specific client, all websites → one point per website
    if (state.selectedWebsite === 'All Websites') return client.websites;

    // Specific website → use campaign children if available, else all websites
    var site = client.websites.filter(function (w) { return w.name === state.selectedWebsite; })[0];
    if (site && site.dimChildren && site.dimChildren.length) return site.dimChildren;

    return client.websites;
  }

  // ── Filtered websites for a client ──
  function filteredWebsites(client) {
    if (state.selectedWebsite === 'All Websites') return client.websites;
    return client.websites.filter(function (w) { return w.name === state.selectedWebsite; });
  }

  // ── Sort an array of rows ──
  function sortedRows(rows) {
    if (!state.sortCol) return rows.slice();
    return rows.slice().sort(function (a, b) {
      if (state.sortCol === '__name__') {
        var av = a.name || '', bv = b.name || '';
        return state.sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      var av = a[state.sortCol] || 0, bv = b[state.sortCol] || 0;
      return state.sortDir === 'asc' ? av - bv : bv - av;
    });
  }

  // ── Render header ──
  function renderHeader() {
    var thead = document.getElementById('pivot-thead');
    if (!thead) return;
    var cols = getActiveCols();
    var html = '<tr>';
    html += '<th class="pv-th pv-th-name" data-sort="__name__">Client' + sortIcon('__name__') + '</th>';
    cols.forEach(function (col) {
      html += '<th class="pv-th" data-sort="' + col.id + '">' + escHtml(col.label) + sortIcon(col.id) + '</th>';
    });
    html += '</tr>';
    thead.innerHTML = html;
  }

  // ── Render rows ──
  function renderRows() {
    var tbody = document.getElementById('pivot-tbody');
    if (!tbody) return;
    var cols = getActiveCols();
    var numDims = state.dimensions.length;
    var html = '';

    sortedRows(filteredClients()).forEach(function (client, ci) {
      var k0 = 'c' + ci;
      var open0 = !!state.expanded[k0];
      var websites = filteredWebsites(client);
      var hasKids0 = websites.length > 0;

      html += '<tr class="pv-row pv-row-l0">';
      html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
      html += hasKids0
        ? '<button class="pv-exp-btn" data-key="' + k0 + '">' + chevron(open0) + '</button>'
        : '<span class="pv-spacer"></span>';
      html += '<span class="pv-row-label">' + escHtml(client.name) + '</span></div></td>';
      cols.forEach(function (col) { html += metricTd(col, client[col.id]); });
      html += '</tr>';

      if (!hasKids0 || !open0) return;

      websites.forEach(function (site, wi) {
        var k1 = k0 + 'w' + wi;
        var open1 = !!state.expanded[k1];
        var hasDims = numDims > 0 && site.dimChildren && site.dimChildren.length;

        html += '<tr class="pv-row pv-row-l1">';
        html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
        html += hasDims
          ? '<button class="pv-exp-btn" data-key="' + k1 + '">' + chevron(open1) + '</button>'
          : '<span class="pv-spacer"></span>';
        html += '<span class="pv-row-label">' + escHtml(site.name) + '</span></div></td>';
        cols.forEach(function (col) { html += metricTd(col, site[col.id]); });
        html += '</tr>';

        if (!hasDims || !open1) return;

        // Level 2 — first selected dimension (e.g. Campaigns)
        sortedRows(site.dimChildren).forEach(function (d1, d1i) {
          var k2 = k1 + 'd' + d1i;
          var open2 = !!state.expanded[k2];
          var hasL3 = numDims > 1 && d1.children && d1.children.length;

          html += '<tr class="pv-row pv-row-l2">';
          html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
          html += hasL3
            ? '<button class="pv-exp-btn" data-key="' + k2 + '">' + chevron(open2) + '</button>'
            : '<span class="pv-spacer"></span>';
          html += '<span class="pv-row-label">' + escHtml(d1.name) + '</span></div></td>';
          cols.forEach(function (col) { html += metricTd(col, d1[col.id]); });
          html += '</tr>';

          if (!hasL3 || !open2) return;

          // Level 3 — second selected dimension (e.g. Ad Groups)
          sortedRows(d1.children).forEach(function (d2, d2i) {
            var k3 = k2 + 's' + d2i;
            var open3 = !!state.expanded[k3];
            var hasL4 = numDims > 2 && d2.children && d2.children.length;

            html += '<tr class="pv-row pv-row-l3">';
            html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
            html += hasL4
              ? '<button class="pv-exp-btn" data-key="' + k3 + '">' + chevron(open3) + '</button>'
              : '<span class="pv-spacer"></span>';
            html += '<span class="pv-row-label">' + escHtml(d2.name) + '</span></div></td>';
            cols.forEach(function (col) { html += metricTd(col, d2[col.id]); });
            html += '</tr>';

            if (!hasL4 || !open3) return;

            // Level 4 — third selected dimension (e.g. Product Segments)
            d2.children.forEach(function (d3) {
              html += '<tr class="pv-row pv-row-l4">';
              html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
              html += '<span class="pv-spacer"></span>';
              html += '<span class="pv-row-label">' + escHtml(d3.name) + '</span></div></td>';
              cols.forEach(function (col) { html += metricTd(col, d3[col.id]); });
              html += '</tr>';
            });
          });
        });
      });
    });

    tbody.innerHTML = html;
  }

  // ── Render totals ──
  function renderTotals() {
    var tfoot = document.getElementById('pivot-tfoot');
    if (!tfoot) return;
    var cols = getActiveCols();
    var clients = filteredClients();
    var html = '<tr class="pv-total-row">';
    html += '<td class="pv-td pv-td-name" style="font-weight:600;">Total</td>';
    cols.forEach(function (col) {
      var v = computeTotal(col, clients);
      var cls = 'pv-td';
      if (col.cosColor) cls += cosClass(v);
      html += '<td class="' + cls + '">' + fmtVal(col, v) + '</td>';
    });
    html += '</tr>';
    tfoot.innerHTML = html;
  }

  // ── Chart metric label ──
  function updateChartMetricLabel() {
    var el = document.getElementById('pivot-chart-metric-label');
    if (!el) return;
    if (state.chartMetrics.length === 1) {
      var col = ALL_COLS.filter(function (c) { return c.id === state.chartMetrics[0]; })[0];
      el.textContent = col ? col.label : state.chartMetrics[0];
    } else {
      el.textContent = state.chartMetrics.length + ' Metrics';
    }
  }

  // ── Chart metric panel (checkboxes) ──
  function buildChartMetricPanel() {
    var panel = document.getElementById('pivot-chart-metric-panel');
    if (!panel) return;
    var activeCols = getActiveCols();
    var html = '';
    activeCols.forEach(function (col) {
      var checked = state.chartMetrics.indexOf(col.id) !== -1;
      html += '<label class="pv-check-opt">' +
        '<input type="checkbox" data-chart-metric="' + col.id + '"' + (checked ? ' checked' : '') + '>' +
        '<span>' + escHtml(col.label) + '</span></label>';
    });
    panel.innerHTML = html || '<div class="pv-dd-item" style="color:var(--color-text-subtitle);padding:8px 12px;">No metrics visible</div>';
  }

  // ── Load Chart.js dynamically (script tags in innerHTML partials are not executed) ──
  function loadChartJs(cb) {
    if (typeof Chart !== 'undefined') { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    s.onload = cb;
    s.onerror = function () { console.warn('Pivot: failed to load Chart.js'); };
    document.head.appendChild(s);
  }

  // ── Render chart ──
  function renderChart() {
    var canvas = document.getElementById('pivot-chart-canvas');
    if (!canvas || typeof Chart === 'undefined') return;

    var activeCols = getActiveCols();
    if (!activeCols.length) {
      if (pvChart) { pvChart.destroy(); pvChart = null; }
      return;
    }

    // Drop any charted metrics that are no longer visible
    state.chartMetrics = state.chartMetrics.filter(function (id) {
      return state.visibleCols.indexOf(id) !== -1;
    });
    if (!state.chartMetrics.length) state.chartMetrics = [activeCols[0].id];
    updateChartMetricLabel();

    var rows = getChartRows();
    var labels = rows.map(function (r) { return r.name; });

    var cs = getComputedStyle(document.documentElement);
    var gridColor  = cs.getPropertyValue('--color-border').trim()       || '#e5e7eb';
    var tickColor  = cs.getPropertyValue('--color-text-caption').trim() || '#9ca3af';

    // One dataset per selected metric, each with its own hidden y-axis so scales stay correct
    var datasets = state.chartMetrics.map(function (id, i) {
      var col   = ALL_COLS.filter(function (c) { return c.id === id; })[0];
      var color = CHART_COLORS[i % CHART_COLORS.length];
      return {
        label:              col ? col.label : id,
        data:               rows.map(function (r) { return r[id] || 0; }),
        tension:            0.4,
        borderColor:        color,
        backgroundColor:    i === 0 ? hexToRgba(color, 0.07) : 'transparent',
        pointBackgroundColor: '#ffffff',
        pointBorderColor:   color,
        pointBorderWidth:   2,
        pointRadius:        4,
        pointHoverRadius:   6,
        fill:               i === 0,
        yAxisID:            'y' + i
      };
    });

    // Build scales object: first y-axis visible, rest hidden
    var scales = {
      x: {
        grid:  { color: gridColor },
        ticks: { font: { size: 12 }, color: tickColor, maxRotation: 35 }
      }
    };
    state.chartMetrics.forEach(function (id, i) {
      var col = ALL_COLS.filter(function (c) { return c.id === id; })[0];
      scales['y' + i] = {
        display:  i === 0,
        position: 'left',
        grid:     i === 0 ? { color: gridColor } : { drawOnChartArea: false },
        ticks:    i === 0 ? {
          font:     { size: 12 },
          color:    tickColor,
          callback: (function (colDef) {
            return function (v) { return colDef ? fmtVal(colDef, v) : v; };
          }(col))
        } : {}
      };
    });

    // Always recreate so dynamic y-axes register correctly
    if (pvChart) { pvChart.destroy(); pvChart = null; }

    pvChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: { labels: labels, datasets: datasets },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        interaction:         { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: state.chartMetrics.length > 1,
            labels:  { font: { size: 12 }, color: tickColor, boxWidth: 12, padding: 14 }
          },
          tooltip: {
            callbacks: {
              label: (function (metrics) {
                return function (ctx) {
                  var id     = metrics[ctx.datasetIndex];
                  var colDef = id ? ALL_COLS.filter(function (c) { return c.id === id; })[0] : null;
                  return (colDef ? colDef.label : ctx.dataset.label) + ': ' +
                         (colDef ? fmtVal(colDef, ctx.raw) : ctx.raw);
                };
              }(state.chartMetrics.slice()))
            }
          }
        },
        scales: scales
      }
    });
  }

  function render() { renderHeader(); renderRows(); renderTotals(); renderChart(); }

  // ── Panel helpers ──
  var PANEL_IDS = ['pivot-client-panel','pivot-website-panel','pivot-dim-panel','pivot-metrics-panel','pivot-date-panel','pivot-chart-metric-panel'];

  function closeAllPanels(except) {
    PANEL_IDS.forEach(function (id) {
      if (id === except) return;
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function positionPanel(btnId, panelId) {
    var btn = document.getElementById(btnId);
    var panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    var r = btn.getBoundingClientRect();
    panel.style.top  = (r.bottom + 4) + 'px';
    panel.style.left = r.left + 'px';
    panel.style.display = 'block';
  }

  function togglePanel(btnId, panelId, buildFn) {
    var panel = document.getElementById(panelId);
    if (panel && panel.style.display !== 'none') {
      panel.style.display = 'none';
      return;
    }
    closeAllPanels(panelId);
    buildFn();
    positionPanel(btnId, panelId);
  }

  // ── Client panel ──
  function buildClientPanel() {
    var panel = document.getElementById('pivot-client-panel');
    if (!panel) return;
    var html = '<div class="pv-dd-item' + (state.selectedClient === 'All Clients' ? ' pv-selected' : '') + '" data-pick-client="All Clients">All Clients</div>';
    CLIENTS_DATA.forEach(function (c) {
      html += '<div class="pv-dd-item' + (state.selectedClient === c.name ? ' pv-selected' : '') + '" data-pick-client="' + escHtml(c.name) + '">' + escHtml(c.name) + '</div>';
    });
    panel.innerHTML = html;
  }

  // ── Website panel ──
  function buildWebsitePanel() {
    var panel = document.getElementById('pivot-website-panel');
    if (!panel) return;
    var client = CLIENTS_DATA.filter(function (c) { return c.name === state.selectedClient; })[0];
    var sites = client ? client.websites : [];
    var html = '<div class="pv-dd-item' + (state.selectedWebsite === 'All Websites' ? ' pv-selected' : '') + '" data-pick-website="All Websites">All Websites</div>';
    sites.forEach(function (s) {
      html += '<div class="pv-dd-item' + (state.selectedWebsite === s.name ? ' pv-selected' : '') + '" data-pick-website="' + escHtml(s.name) + '">' + escHtml(s.name) + '</div>';
    });
    panel.innerHTML = html;
  }

  // ── Dimensions panel ──
  function buildDimPanel() {
    var panel = document.getElementById('pivot-dim-panel');
    if (!panel) return;
    var html = '';
    ALL_DIMS.forEach(function (dim) {
      var checked = state.dimensions.indexOf(dim) !== -1;
      html += '<label class="pv-check-opt">' +
        '<input type="checkbox" data-dim="' + escHtml(dim) + '"' + (checked ? ' checked' : '') + '>' +
        '<span>' + escHtml(dim) + '</span></label>';
    });
    panel.innerHTML = html;
  }

  // ── Metrics panel ──
  function buildMetricsPanel() {
    var panel = document.getElementById('pivot-metrics-panel');
    if (!panel) return;
    var html = '';
    ALL_COLS.forEach(function (col) {
      var checked = state.visibleCols.indexOf(col.id) !== -1;
      html += '<label class="pv-check-opt">' +
        '<input type="checkbox" data-col="' + col.id + '"' + (checked ? ' checked' : '') + '>' +
        '<span>' + escHtml(col.label) + '</span></label>';
    });
    panel.innerHTML = html;
  }

  // ── Date panel ──
  function buildDatePanel() {
    var panel = document.getElementById('pivot-date-panel');
    if (!panel) return;
    var opts = ['Last 7 Days','Last 30 Days','Last 90 Days','Last 12 Months','This Month','Last Month'];
    var html = '';
    opts.forEach(function (o) {
      html += '<div class="pv-dd-item' + (state.dateRange === o ? ' pv-selected' : '') + '" data-pick-date="' + escHtml(o) + '">' + escHtml(o) + '</div>';
    });
    panel.innerHTML = html;
  }

  // ── Update dim label button text ──
  function updateDimLabel() {
    var el = document.getElementById('pivot-dim-label');
    if (!el) return;
    el.textContent = state.dimensions.length === 0 ? 'Dimensions'
      : state.dimensions.length === 1 ? state.dimensions[0]
      : state.dimensions.length + ' Dimensions';
  }

  // ── CSV export ──
  function exportCsv() {
    var cols = getActiveCols();
    var lines = [];
    var header = ['"Client"'].concat(cols.map(function (c) { return '"' + c.label + '"'; }));
    lines.push(header.join(','));

    function addLine(name, row, depth) {
      var prefix = depth > 0 ? Array(depth + 1).join('  ') : '';
      var cells = ['"' + prefix + name + '"'];
      cols.forEach(function (col) { cells.push('"' + fmtVal(col, row[col.id]) + '"'); });
      lines.push(cells.join(','));
    }

    var numDims = state.dimensions.length;
    filteredClients().forEach(function (client) {
      addLine(client.name, client, 0);
      filteredWebsites(client).forEach(function (site) {
        addLine(site.name, site, 1);
        if (numDims > 0 && site.dimChildren) {
          site.dimChildren.forEach(function (d1) {
            addLine(d1.name, d1, 2);
            if (numDims > 1 && d1.children) {
              d1.children.forEach(function (d2) {
                addLine(d2.name, d2, 3);
                if (numDims > 2 && d2.children) {
                  d2.children.forEach(function (d3) { addLine(d3.name, d3, 4); });
                }
              });
            }
          });
        }
      });
    });

    var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'pivot-table.csv';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  // ── Init ──
  function init() {
    CLIENTS_DATA = buildClients();

    var page = document.getElementById('pivot-page');
    if (!page) return;

    // ── Click delegation ──
    page.addEventListener('click', function (e) {

      // Expand / collapse row
      var expBtn = e.target.closest('.pv-exp-btn');
      if (expBtn) {
        var key = expBtn.getAttribute('data-key');
        state.expanded[key] = !state.expanded[key];
        renderRows();
        return;
      }

      // Sort header
      var th = e.target.closest('th[data-sort]');
      if (th) {
        var col = th.getAttribute('data-sort');
        state.sortDir = (state.sortCol === col && state.sortDir === 'desc') ? 'asc' : 'desc';
        state.sortCol = col;
        render();
        return;
      }

      // Client button
      if (e.target.closest('#pivot-client-btn')) {
        togglePanel('pivot-client-btn', 'pivot-client-panel', buildClientPanel);
        return;
      }
      // Website button
      if (e.target.closest('#pivot-website-btn')) {
        togglePanel('pivot-website-btn', 'pivot-website-panel', buildWebsitePanel);
        return;
      }
      // Dimensions button
      if (e.target.closest('#pivot-dim-btn')) {
        togglePanel('pivot-dim-btn', 'pivot-dim-panel', buildDimPanel);
        return;
      }
      // Metrics button
      if (e.target.closest('#pivot-metrics-btn')) {
        togglePanel('pivot-metrics-btn', 'pivot-metrics-panel', buildMetricsPanel);
        return;
      }
      // Date button
      if (e.target.closest('#pivot-date-btn')) {
        togglePanel('pivot-date-btn', 'pivot-date-panel', buildDatePanel);
        return;
      }
      // Chart metric button
      if (e.target.closest('#pivot-chart-metric-btn')) {
        togglePanel('pivot-chart-metric-btn', 'pivot-chart-metric-panel', buildChartMetricPanel);
        return;
      }
      // Export button
      if (e.target.closest('#pivot-export-btn')) {
        exportCsv();
        return;
      }
    });

    // ── Panel item clicks (delegated from document since panels are fixed outside page) ──
    document.addEventListener('click', function (e) {

      // Client pick
      var cp = e.target.closest('[data-pick-client]');
      if (cp) {
        var picked = cp.getAttribute('data-pick-client');
        state.selectedClient = picked;
        document.getElementById('pivot-client-label').textContent = picked;
        // reset website
        state.selectedWebsite = 'All Websites';
        document.getElementById('pivot-website-label').textContent = 'All Websites';
        state.expanded = {};
        document.getElementById('pivot-client-panel').style.display = 'none';
        render();
        return;
      }

      // Website pick
      var wp = e.target.closest('[data-pick-website]');
      if (wp) {
        var wpicked = wp.getAttribute('data-pick-website');
        state.selectedWebsite = wpicked;
        document.getElementById('pivot-website-label').textContent = wpicked;
        state.expanded = {};
        document.getElementById('pivot-website-panel').style.display = 'none';
        render();
        return;
      }

      // Date pick
      var dp = e.target.closest('[data-pick-date]');
      if (dp) {
        var dpicked = dp.getAttribute('data-pick-date');
        state.dateRange = dpicked;
        document.getElementById('pivot-date-label').textContent = dpicked;
        document.getElementById('pivot-date-panel').style.display = 'none';
        render();
        return;
      }

      // Close panels on outside click
      var inPanel = PANEL_IDS.some(function (id) { return e.target.closest('#' + id); });
      var inBtn = ['pivot-client-btn','pivot-website-btn','pivot-dim-btn','pivot-metrics-btn','pivot-date-btn','pivot-chart-metric-btn']
        .some(function (id) { return e.target.closest('#' + id); });
      if (!inPanel && !inBtn) closeAllPanels();
    });

    // ── Checkbox changes (dimension / metric) ──
    document.addEventListener('change', function (e) {
      var dimCb = e.target.closest('input[data-dim]');
      if (dimCb) {
        var dim = dimCb.getAttribute('data-dim');
        if (dimCb.checked) {
          if (state.dimensions.indexOf(dim) === -1) state.dimensions.push(dim);
        } else {
          var idx = state.dimensions.indexOf(dim);
          if (idx !== -1) state.dimensions.splice(idx, 1);
        }
        state.expanded = {};
        updateDimLabel();
        render();
        return;
      }

      // Chart metric checkbox
      var cmCb = e.target.closest('input[data-chart-metric]');
      if (cmCb) {
        var cmId = cmCb.getAttribute('data-chart-metric');
        var cmi  = state.chartMetrics.indexOf(cmId);
        if (cmCb.checked) {
          if (cmi === -1) state.chartMetrics.push(cmId);
        } else {
          if (state.chartMetrics.length > 1 && cmi !== -1) {
            state.chartMetrics.splice(cmi, 1);
          } else {
            cmCb.checked = true; // keep at least one
          }
        }
        updateChartMetricLabel();
        renderChart();
        return;
      }

      var colCb = e.target.closest('input[data-col]');
      if (colCb) {
        var colId = colCb.getAttribute('data-col');
        var vi = state.visibleCols.indexOf(colId);
        if (colCb.checked && vi === -1) state.visibleCols.push(colId);
        if (!colCb.checked && vi !== -1) state.visibleCols.splice(vi, 1);
        // renderChart handles chartMetric fallback if the charted col was removed
        render();
        return;
      }
    });
  }

  // ── Public ──
  function showPivotPage() {
    if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
    ['ic-list','ic-detail','integrations-page','feed-data-page'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.style.display = 'none';
    });
    var page = document.getElementById('pivot-page');
    if (page) page.style.display = 'block';
    window.scrollTo(0, 0);
    if (!initialized) { init(); initialized = true; }
    render();                        // renders table immediately
    loadChartJs(renderChart);        // loads Chart.js if needed, then renders chart
  }

  window.showPivotPage = showPivotPage;
})();
