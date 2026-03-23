/* ─── OVERVIEW PAGE ─── */

/* ── Dynamic script loader (defined first so preload can fire immediately) ── */
function ovLoadScript(src, cb) {
  var existing = document.querySelector('script[src="' + src + '"]');
  if (existing) {
    /* Already injected — if fully loaded fire cb now, else queue on its onload */
    if (existing._ovLoaded) { cb(); return; }
    var prev = existing.onload || function(){};
    existing.onload = function() { prev(); cb(); };
    return;
  }
  var s = document.createElement('script');
  s.src = src;
  s._ovLoaded = false;
  s.onload = function() { s._ovLoaded = true; cb(); };
  s.onerror = function() { console.error('ovLoadScript failed: ' + src); };
  document.head.appendChild(s);
}

/* Preload Chart.js and ECharts immediately when this file is parsed */
ovLoadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js', function(){});
ovLoadScript('https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js', function(){});

/* ── State ── */
var _ovChannel    = 'SEM';
var _ovClient     = 'Outdoor Research';
var _ovWebsite    = 'OutdoorResearch.com';
var _ovComp       = 'Previous Period';
var _ovDate       = 'Last 30 Days';
var _ovDelta      = false;
var _ovMetric     = 'Revenue';
var _ovInsightTab = 'attention';

/* ── Data: KPIs ── */
var OV_KPI = {
  SEM: { tiles: [
    { label:'Conversion Value', value:'$487,320', delta:'+12.2%', pos:true  },
    { label:'Conversions',      value:'3,847',    delta:'-12.2%', pos:false },
    { label:'COS',              value:'20.2%',    delta:'+12.2%', pos:true  },
    { label:'Cost',             value:'$98,450',  delta:'-12.2%', pos:false }
  ]},
  SEO: { tiles: [
    { label:'Organic Revenue',      value:'$342,890', delta:'+8.4%',  pos:true  },
    { label:'Organic Sessions',     value:'187,420',  delta:'+14.2%', pos:true  },
    { label:'Organic Conversions',  value:'2,156',    delta:'+6.9%',  pos:true  },
    { label:'Revenue per Session',  value:'$1.83',    delta:'-5.1%',  pos:false }
  ]}
};

/* ── Data: Channel comparison bars ── */
var OV_BARS = {
  SEM: {
    Revenue: [
      { label:'Paid Search',    pct:+12.3, bold:true },
      { label:'Organic Search', pct:-7.7  },
      { label:'Direct',         pct:+12.3 },
      { label:'Total Site',     pct:-3.6  }
    ],
    Sessions: [
      { label:'Paid Search',    pct:+12.3, bold:true },
      { label:'Organic Search', pct:-7.0  },
      { label:'Direct',         pct:+12.3 },
      { label:'Total Site',     pct:-3.6  }
    ]
  },
  SEO: {
    Revenue: [
      { label:'Organic Search', pct:+8.4,  bold:true },
      { label:'Paid Search',    pct:-1.2  },
      { label:'Direct',         pct:+3.1  },
      { label:'Total Site',     pct:+4.2  }
    ],
    Sessions: [
      { label:'Organic Search', pct:+14.2, bold:true },
      { label:'Paid Search',    pct:-0.8  },
      { label:'Direct',         pct:+2.9  },
      { label:'Total Site',     pct:+6.1  }
    ]
  }
};

/* ── Data: Insights ── */
var OV_INSIGHTS = {
  SEM: {
    attention: [
      { headline:'Wasted spend increased 18% this period',
        context:"Non-converting queries around 'outdoor research' are the primary driver — $4,210 spent with zero conversions." },
      { headline:'Outerwear COS exceeded target by 6.2 points',
        context:'Category spend increased 34% while conversion rate dropped 1.8 points vs previous period.' }
    ],
    watch: [
      { headline:'Impression share dropped 12% vs previous period',
        context:'Budget constraints appear to be limiting peak-hour delivery on Paid Search.' },
      { headline:'3 new competitor terms appeared in top queries',
        context:"Monitor for bid pressure on 'outdoor research jacket' and related terms." }
    ],
    performing: [
      { headline:'Footwear conversion rate up 2.1 points',
        context:'Product page improvements are translating to paid search — highest CVR in 6 months.' },
      { headline:'234 new search terms drove 127 conversions',
        context:'New terms converting at 19% higher rate than established terms this period.' }
    ]
  },
  SEO: {
    attention: [
      { headline:'3 high-traffic pages lost top-3 rankings',
        context:'Outerwear category page dropped from position 2 to position 8. Competitor content update likely cause.' }
    ],
    watch: [
      { headline:'Organic CTR declined 0.8 points on product pages',
        context:'Title tag format may need updating — competitors showing richer snippets.' },
      { headline:'Crawl errors detected on 14 URLs',
        context:'Primarily legacy redirect chains. No ranking impact yet but needs resolution.' }
    ],
    performing: [
      { headline:'Organic revenue up 8.4% vs previous period',
        context:'Footwear and Base Layers pages driving the majority of organic conversion growth.' },
      { headline:'47 keywords moved into top-10 this period',
        context:'Long-tail informational content is gaining traction — blog posts showing 34% more impressions.' }
    ]
  }
};

/* ── Dropdown helpers ── */
var _ovOpenDd = null;

window.ovToggleDd = function(key) {
  var wrap  = document.getElementById('ov-' + key + '-wrap');
  var panel = document.getElementById('ov-' + key + '-panel');
  if (!wrap || !panel) return;
  var isOpen = panel.style.display === 'block';
  ovCloseAllDd();
  if (!isOpen) {
    var rect = wrap.getBoundingClientRect();
    panel.style.top      = (rect.bottom + 4) + 'px';
    panel.style.left     = rect.left + 'px';
    panel.style.minWidth = Math.max(rect.width, 180) + 'px';
    panel.style.display  = 'block';
    _ovOpenDd = key;
  }
};

function ovCloseAllDd() {
  ['client','website','comp','date'].forEach(function(k) {
    var p = document.getElementById('ov-' + k + '-panel');
    if (p) p.style.display = 'none';
  });
  _ovOpenDd = null;
}

document.addEventListener('click', function(e) {
  if (!_ovOpenDd) return;
  var wrap  = document.getElementById('ov-' + _ovOpenDd + '-wrap');
  var panel = document.getElementById('ov-' + _ovOpenDd + '-panel');
  if (wrap && panel && !wrap.contains(e.target) && !panel.contains(e.target)) {
    ovCloseAllDd();
  }
});

/* ── Client / Website dropdowns ── */
function ovBuildClientDd() {
  var panel = document.getElementById('ov-client-panel');
  if (!panel || typeof ARGOS_CLIENTS === 'undefined') return;
  panel.innerHTML = ARGOS_CLIENTS.map(function(c) {
    var esc = c.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return '<div class="pm-dd-item" onclick="ovSelectClient(\'' + esc + '\')">' + c.name + '</div>';
  }).join('');
}

window.ovSelectClient = function(name) {
  _ovClient = name;
  document.getElementById('ov-client-label').textContent = name;
  ovCloseAllDd();
  if (typeof ARGOS_CLIENTS !== 'undefined') {
    var client = ARGOS_CLIENTS.find(function(c){ return c.name === name; });
    if (client && client.websites.length) {
      _ovWebsite = client.websites[0];
      document.getElementById('ov-website-label').textContent = client.websites[0];
      ovBuildWebsiteDd(client.websites);
    }
  }
  ovRender();
};

function ovBuildWebsiteDd(sites) {
  var panel = document.getElementById('ov-website-panel');
  if (!panel) return;
  if (!sites) {
    if (typeof ARGOS_CLIENTS === 'undefined') return;
    var client = ARGOS_CLIENTS.find(function(c){ return c.name === _ovClient; });
    sites = client ? client.websites : [_ovWebsite];
  }
  panel.innerHTML = sites.map(function(w) {
    return '<div class="pm-dd-item" onclick="ovSelectWebsite(\'' + w + '\')">' + w + '</div>';
  }).join('');
}

window.ovSelectWebsite = function(w) {
  _ovWebsite = w;
  document.getElementById('ov-website-label').textContent = w;
  ovCloseAllDd();
};

window.ovSetComp = function(v) {
  _ovComp = v;
  document.getElementById('ov-comp-label').textContent = v;
  ovCloseAllDd();
};

/* Highlight range [start, end] in fractional month indices (Jan=0 … Dec=11).
   null = no highlight. Default = Last 30 Days → November. */
var _ovHighlightRange = [9.5, 10.5];

var OV_DATE_HIGHLIGHT = {
  'Last 7 Days':  [10.5, 11.0],
  'Last 30 Days': [9.5,  10.5],
  'Last 90 Days': [7.5,  10.5],
  'Custom':       null
};

window.ovSetDate = function(v) {
  _ovDate = v;
  document.getElementById('ov-date-label').textContent = v;
  _ovHighlightRange = OV_DATE_HIGHLIGHT[v] !== undefined ? OV_DATE_HIGHLIGHT[v] : [9.5, 10.5];
  ovCloseAllDd();
  if (_ovTrendChartInstance) _ovTrendChartInstance.update();
};

/* ── Channel tabs ── */
window.ovSetChannel = function(ch) {
  if (ch === 'All') { if (typeof showToast === 'function') showToast('All Channels coming soon'); return; }
  _ovChannel    = ch;
  _ovInsightTab = 'attention';
  var isSEO = ch === 'SEO';
  document.getElementById('ov-page-heading').textContent  = isSEO ? 'SEO Overview' : 'SEM Overview';
  document.getElementById('ov-page-subtitle').textContent = isSEO
    ? 'Organic search performance and visibility insights'
    : 'Paid search performance and optimisation insights';
  ['sem','seo','all'].forEach(function(t) {
    var btn = document.getElementById('ov-tab-' + t);
    if (btn) btn.className = 'ov-channel-tab' + (t === ch.toLowerCase() ? ' ov-tab-active' : '');
  });
  ovRender();
  updateSection2(ch);
};

/* ── Delta toggle ── */
window.ovToggleDelta = function() {
  _ovDelta = document.getElementById('ov-delta-toggle').checked;
  ovRenderKPI();
};

/* ── Metric toggle ── */
window.ovSwitchMetric = function(metric) {
  _ovMetric = metric;
  document.getElementById('ov-metric-revenue').className  = 'ov-metric-tab' + (metric === 'Revenue'  ? ' ov-metric-active' : '');
  document.getElementById('ov-metric-sessions').className = 'ov-metric-tab' + (metric === 'Sessions' ? ' ov-metric-active' : '');
  ovRenderBars();
};

/* ── Insight tabs ── */
window.ovSwitchInsightTab = function(tab) {
  _ovInsightTab = tab;
  ovRenderInsights();
};

/* ── Render: KPI grid ── */
function ovRenderKPI() {
  var tiles = OV_KPI[_ovChannel].tiles;
  var grid  = document.getElementById('ov-kpi-grid');
  if (!grid) return;
  grid.innerHTML = tiles.map(function(t) {
    var deltaHtml = _ovDelta
      ? '<div style="font-size:12px;font-weight:500;margin-top:4px;color:' +
        (t.pos ? 'var(--color-text-success)' : '#d72225') + ';">' +
        (t.pos ? '↑ ' : '↓ ') + t.delta + '</div>'
      : '';
    return '<div class="ov-kpi-tile"><div class="ov-kpi-tile-label">' + t.label + '</div>' +
           '<div class="ov-kpi-tile-value">' + t.value + '</div>' + deltaHtml + '</div>';
  }).join('');
}

/* ── Render: Bidirectional bar chart ── */
function ovRenderBars() {
  var rows = OV_BARS[_ovChannel][_ovMetric];
  var maxAbs = Math.max.apply(null, rows.map(function(r){ return Math.abs(r.pct); }));
  var container = document.getElementById('ov-bar-chart');
  if (!container) return;
  container.innerHTML = rows.map(function(row) {
    var frac  = maxAbs > 0 ? Math.abs(row.pct) / maxAbs : 0;
    var barW  = (frac * 45).toFixed(1) + '%';
    var isPos = row.pct >= 0;
    var color = isPos ? 'var(--color-blue)' : '#ef4444';
    var lbl   = (isPos ? '+' : '') + row.pct + '%';
    var bold  = row.bold ? 'font-weight:600;' : '';
    if (isPos) {
      return '<div class="ov-bidir-row">' +
        '<div class="ov-bidir-label" style="' + bold + '">' + row.label + '</div>' +
        '<div class="ov-bidir-halves">' +
          '<div class="ov-bidir-left"></div>' +
          '<div class="ov-bidir-zero"></div>' +
          '<div class="ov-bidir-right">' +
            '<div style="width:' + barW + ';height:8px;background:' + color + ';border-radius:0 4px 4px 0;flex-shrink:0;"></div>' +
            '<span class="ov-bidir-pct-pos">' + lbl + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    } else {
      return '<div class="ov-bidir-row">' +
        '<div class="ov-bidir-label" style="' + bold + '">' + row.label + '</div>' +
        '<div class="ov-bidir-halves">' +
          '<div class="ov-bidir-left">' +
            '<span class="ov-bidir-pct-neg">' + lbl + '</span>' +
            '<div style="width:' + barW + ';height:8px;background:' + color + ';border-radius:4px 0 0 4px;flex-shrink:0;"></div>' +
          '</div>' +
          '<div class="ov-bidir-zero"></div>' +
          '<div class="ov-bidir-right"></div>' +
        '</div>' +
      '</div>';
    }
  }).join('');
}

/* ── Render: Insight panel ── */
function ovRenderInsights() {
  var tab    = _ovInsightTab;
  var data   = OV_INSIGHTS[_ovChannel];
  var cards  = data[tab];
  var colors = { attention:'#d72225', watch:'#eab308', performing:'#22c55e' };
  var labels = { attention:'Needs Attention', watch:'Watch Closely', performing:'Performing Well' };
  var bgMap  = { attention:'var(--color-container-error)', watch:'var(--color-container-warn)', performing:'var(--color-container-success)' };
  var color  = colors[tab];
  var panel  = document.getElementById('ov-insight-panel');
  if (!panel) return;
  panel.innerHTML = cards.map(function(c) {
    return '<div class="ov-insight-card" style="border-left:3px solid ' + color + ';">' +
      '<div class="ov-insight-severity" style="color:' + color + ';">' + labels[tab] + '</div>' +
      '<div class="ov-insight-headline">' + c.headline + '</div>' +
      '<div class="ov-insight-context">' + c.context + '</div>' +
    '</div>';
  }).join('');

  /* refresh tab button styles */
  ['attention','watch','performing'].forEach(function(t) {
    var btn = document.getElementById('ov-itab-' + t);
    if (!btn) return;
    var sp = btn.querySelector('span.ov-tab-badge');
    if (sp) sp.textContent = data[t].length;
    var isActive = t === tab;
    btn.style.background = isActive ? bgMap[t]                       : 'var(--color-bg-grey50)';
    btn.style.color      = isActive ? colors[t]                      : 'var(--color-text-subtitle)';
  });
}

/* ── Master render ── */
function ovRender() {
  ovRenderKPI();
  ovRenderBars();
  ovRenderInsights();
}

/* ── Page entry point ── */
function showOverviewPage() {
  if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
  var p = document.getElementById('overview-page');
  if (p) p.style.display = 'block';
  window.scrollTo(0, 0);
  ovBuildClientDd();
  ovBuildWebsiteDd();
  ovRender();
  updateSection2(_ovChannel);
}
window.showOverviewPage = showOverviewPage;

/* ═══════════════════════════════════════════════
   SECTION 2 — CHANNEL HEALTH (Trend + Waterfall)
═══════════════════════════════════════════════ */

/* ── Section 2 data ── */
var OV_TREND_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var OV_TREND_SEM = {
  revenue: [320000,298000,341000,367000,412000,389000,356000,378000,421000,445000,487320,463000],
  cost:    [74000, 71000, 78000, 82000, 89000, 86000, 80000, 83000, 91000, 94000, 98450, 95000]
};

var OV_TREND_SEO = {
  revenue: [198000,187000,204000,221000,248000,239000,218000,229000,261000,298000,342890,318000],
  cost:    [0,0,0,0,0,0,0,0,0,0,0,0]
};

var OV_SPECIAL_CAUSES = [
  { month: 7, dataset: 'revenue', label: 'Unusual revenue spike' },
  { month: 9, dataset: 'cost',    label: 'Disproportionate cost jump' }
];

var OV_ANNOTATIONS = [
  { month: 5, label: 'Summer sale campaign launched' },
  { month: 8, label: 'New Shopping campaign rolled out' },
  { month: 10, label: 'Black Friday campaign launched' }
];

var OV_SELECTED_MONTH = 10;

/* For negative bars: base = bottom of the bar (cumulative end after drop),
   value = positive absolute delta. ECharts stacks base→base+value correctly. */
var OV_WATERFALL_SEM = {
  categories: ['Prev Period','Impressions','Clicks','Conv. Rate','AOV','Curr Period'],
  bases:      [0,           445000,       463200,  475600,      487320, 0],
  values:     [445000,      18200,        12400,   24800,       13080,  487320],
  types:      ['total',     'positive',   'positive','positive','negative','total']
};

var OV_WATERFALL_SEO = {
  categories: ['Prev Period','Impressions','Clicks','CTR','Rev/Session','Curr Period'],
  bases:      [0,            312000,       326600,  336400, 342890,     0],
  values:     [312000,       14600,        9800,    8200,   1710,       342890],
  types:      ['total',      'positive',   'positive','positive','negative','total']
};

/* ── Section 2 chart instances ── */
var _ovTrendChartInstance  = null;
var _ovWaterfallInstance   = null;

/* ── Custom Chart.js plugin: selected-period highlight ── */
var _ovHighlightPlugin = {
  id: 'ovHighlight',
  beforeDraw: function(chart) {
    if (!_ovHighlightRange) return;
    var xScale = chart.scales.x;
    var yScale = chart.scales.y;
    if (!xScale || !yScale) return;
    var x1  = xScale.getPixelForValue(_ovHighlightRange[0]);
    var x2  = xScale.getPixelForValue(_ovHighlightRange[1]);
    var ctx = chart.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(52,110,217,0.08)';
    ctx.fillRect(x1, yScale.top, x2 - x1, yScale.bottom - yScale.top);
    ctx.restore();
  }
};

/* ── initTrendChart ── */
function initTrendChart(channel) {
  var canvas = document.getElementById('ov-trend-chart');
  if (!canvas) return;

  if (_ovTrendChartInstance) {
    _ovTrendChartInstance.destroy();
    _ovTrendChartInstance = null;
  }

  var isSEO     = channel === 'SEO';
  var trendData = isSEO ? OV_TREND_SEO : OV_TREND_SEM;

  /* Build special-cause marker arrays (nulls except at marked months) */
  var scRevenue = OV_TREND_LABELS.map(function() { return null; });
  var scCost    = OV_TREND_LABELS.map(function() { return null; });
  if (!isSEO) {
    OV_SPECIAL_CAUSES.forEach(function(sc) {
      if (sc.dataset === 'revenue') scRevenue[sc.month] = trendData.revenue[sc.month];
      if (sc.dataset === 'cost')    scCost[sc.month]    = trendData.cost[sc.month];
    });
  }

  /* Update HTML legend label */
  var legendEl = document.getElementById('ov-trend-legend-revenue');
  if (legendEl) legendEl.textContent = isSEO ? 'Organic Revenue' : 'Revenue';

  _ovTrendChartInstance = new Chart(canvas, {
    type: 'line',
    plugins: [_ovHighlightPlugin],
    data: {
      labels: OV_TREND_LABELS,
      datasets: [
        {
          label: isSEO ? 'Organic Revenue' : 'Revenue',
          data: trendData.revenue,
          borderColor: '#185FA5',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          order: 2
        },
        {
          label: 'Cost',
          data: trendData.cost,
          borderColor: '#e07b6a',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          hidden: isSEO,
          order: 2
        },
        {
          label: '_sc_revenue',
          data: scRevenue,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          pointRadius: 6,
          pointHoverRadius: 7,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          showLine: false,
          order: 1
        },
        {
          label: '_sc_cost',
          data: scCost,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          pointRadius: 6,
          pointHoverRadius: 7,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          showLine: false,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              /* Hide marker datasets and null points from tooltip */
              if (ctx.dataset.label === '_sc_revenue' || ctx.dataset.label === '_sc_cost') return null;
              var v = ctx.parsed.y;
              if (v === null || v === undefined) return null;
              return ctx.dataset.label + ': $' + v.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, color: '#9ca3af' }
        },
        y: {
          beginAtZero: false,
          grid: { color: '#f0f0f0' },
          ticks: {
            font: { size: 11 },
            color: '#9ca3af',
            callback: function(v) { return '$' + Math.round(v / 1000) + 'k'; }
          }
        }
      }
    }
  });

  setTimeout(renderAnnotationPins, 100);
}

/* ── renderAnnotationPins ── */
function renderAnnotationPins() {
  var chart = _ovTrendChartInstance;
  var row   = document.getElementById('ov-annotations-row');
  if (!chart || !row) return;
  row.innerHTML = '';
  OV_ANNOTATIONS.forEach(function(ann) {
    var xPx = chart.scales.x.getPixelForValue(ann.month);
    var pin  = document.createElement('div');
    pin.className  = 'ov-annotation-pin';
    pin.style.left = xPx + 'px';
    pin.innerHTML  =
      '<div class="ov-annotation-pin-dot"></div>' +
      '<div class="ov-annotation-pin-line"></div>' +
      '<div class="ov-annotation-tooltip">' + ann.label + '</div>';
    row.appendChild(pin);
  });
}

/* ── initWaterfallChart ── */
function initWaterfallChart(channel) {
  var el = document.getElementById('ov-waterfall-chart');
  if (!el) return;

  if (_ovWaterfallInstance) {
    _ovWaterfallInstance.dispose();
    _ovWaterfallInstance = null;
  }

  var d = channel === 'SEO' ? OV_WATERFALL_SEO : OV_WATERFALL_SEM;

  _ovWaterfallInstance = echarts.init(el);
  _ovWaterfallInstance.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var vp = null;
        for (var i = 0; i < params.length; i++) {
          if (params[i].seriesIndex === 1) { vp = params[i]; break; }
        }
        if (!vp) return '';
        var idx = vp.dataIndex;
        var v   = d.values[idx];
        var t   = d.types[idx];
        var abs = Math.abs(v).toLocaleString();
        if (t === 'total')    return '<b>' + d.categories[idx] + '</b>: $' + abs;
        if (t === 'negative') return '<b>' + d.categories[idx] + '</b>: -$' + abs;
        return                       '<b>' + d.categories[idx] + '</b>: +$' + abs;
      }
    },
    grid: { left: 16, right: 16, top: 8, bottom: 24, containLabel: true },
    xAxis: {
      type: 'category',
      data: d.categories,
      axisTick:  { show: false },
      axisLine:  { show: false },
      axisLabel: { fontSize: 11, color: '#9ca3af' }
    },
    yAxis: {
      type: 'value',
      axisLine:  { show: false },
      axisTick:  { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: {
        fontSize: 11,
        color: '#9ca3af',
        formatter: function(v) { return '$' + Math.round(v / 1000) + 'k'; }
      }
    },
    series: [
      {
        type: 'bar',
        stack: 'waterfall',
        itemStyle: { color: 'transparent' },
        emphasis: { disabled: true },
        data: d.bases,
        tooltip: { show: false }
      },
      {
        type: 'bar',
        stack: 'waterfall',
        barWidth: '55%',
        label: { show: false },
        itemStyle: {
          color: function(params) {
            var t = d.types[params.dataIndex];
            if (t === 'total')    return '#9ca3af';
            if (t === 'positive') return '#22c55e';
            return '#ef4444';
          },
          borderRadius: [2, 2, 0, 0]
        },
        data: d.values
      }
    ]
  });

}

/* ── updateSection2 ── */
function updateSection2(channel) {
  ovLoadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js', function() {
    ovLoadScript('https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js', function() {
      /* setTimeout(0) lets the browser reflow after display:block before we read dimensions */
      setTimeout(function() {
        initTrendChart(channel);
        initWaterfallChart(channel);
      }, 0);
    });
  });
}
