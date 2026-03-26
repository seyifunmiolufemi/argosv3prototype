/* ── Portfolio Performance ── */
(function () {

  /* ── ECharts loader (reuse same CDN as overview.js) ── */
  function ppLoadECharts(cb) {
    var src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js';
    if (window.echarts) { cb(); return; }
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) {
      var wait = setInterval(function () {
        if (window.echarts) { clearInterval(wait); cb(); }
      }, 50);
      return;
    }
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* ── Mock data ── */
  var PORTFOLIO_MOCK_DATA = [
    { name: 'MonkeySports',              value: 34.2,  currentValue: 1482000, comparisonValue: 1104000 },
    { name: 'Outdoor Research',          value: 28.7,  currentValue: 945000,  comparisonValue: 734000  },
    { name: 'Link Imaging',              value: 22.1,  currentValue: 2103000, comparisonValue: 1722000 },
    { name: 'Weaver',                    value: 18.4,  currentValue: 678000,  comparisonValue: 572000  },
    { name: 'My Binding',                value: 12.3,  currentValue: 423000,  comparisonValue: 376000  },
    { name: 'Dungarees',                 value: 8.9,   currentValue: 312000,  comparisonValue: 286000  },
    { name: 'Grovemade',                 value: 4.1,   currentValue: 198000,  comparisonValue: 190000  },
    { name: 'Royal Swimming Pools',      value: -3.6,  currentValue: 267000,  comparisonValue: 277000  },
    { name: 'Microscope.com',            value: -7.7,  currentValue: 143000,  comparisonValue: 155000  },
    { name: 'ScaffoldMart',              value: -12.3, currentValue: 89000,   comparisonValue: 101000  },
    { name: 'Revo.com',                  value: -18.9, currentValue: 201000,  comparisonValue: 248000  },
    { name: 'Chantelle Lingerie Inc',    value: -24.5, currentValue: 334000,  comparisonValue: 443000  },
    { name: 'Simply Authentic LLC',      value: -31.2, currentValue: 156000,  comparisonValue: 227000  },
    { name: "People's Choice Beef Jerky",value: -38.7, currentValue: 98000,   comparisonValue: 160000  }
  ];

  /* ── Dropdown options ── */
  var PP_OPTS = {
    view:     ['Client', 'Website'],
    source:   ['Google Ads', 'Google Analytics'],
    metric: {
      'Google Ads':        ['Impressions', 'Clicks', 'Conversions', 'Conv. Value'],
      'Google Analytics':  ['Sessions', 'Engaged Sessions', 'Transactions', 'Revenue']
    },
    calc:     ['Percent Change', 'Total Difference'],
    comp:     ['Year over Year', 'Month over Month', 'Week over Week', 'Previous Period', 'Two Years Ago'],
    date:     ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 3 Months', 'Last 12 Months'],
    gafilter: ['Contains', 'Does Not Contain'],
    pagesize: ['5', '10', '40']
  };

  /* ── State ── */
  var _s = {
    view:      'Client',
    source:    'Google Ads',
    metric:    'Impressions',
    calc:      'Percent Change',
    comp:      'Year over Year',
    date:      'Last 30 Days',
    gafilter:  'Contains',
    gaInput:   '',
    sortCol:   'value',
    sortDir:   'desc',
    page:      1,
    pageSize:  10,
    openPanel: null,
    zoomed:    false,
    chartInst: null,
    hasResults:false
  };

  /* ── Helpers ── */
  function $(id) { return document.getElementById(id); }

  function ppFmtNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  function ppFmtValue(v) {
    return _s.calc === 'Percent Change'
      ? (v >= 0 ? '+' : '') + v.toFixed(1) + '%'
      : (v >= 0 ? '+' : '') + ppFmtNum(Math.abs(v));
  }

  function ppFmtAxisVal(v) {
    return _s.calc === 'Percent Change' ? v + '%' : ppFmtNum(v);
  }

  function ppCompLabel() {
    var map = {
      'Year over Year': 'YoY', 'Month over Month': 'MoM',
      'Week over Week': 'WoW', 'Previous Period': 'vs Prev',
      'Two Years Ago': '2YA'
    };
    return map[_s.comp] || _s.comp;
  }

  function ppHasOutliers(data) {
    return data.some(function (d) { return d.value > 300 || d.value < -100; });
  }

  /* ── Dropdown machinery ── */
  function ppCloseAll() {
    document.querySelectorAll('.pp-dd-panel').forEach(function (p) { p.style.display = 'none'; });
    _s.openPanel = null;
  }

  function ppOpenPanel(key, btn, panel, items, selected, onSelect) {
    var isOpen = _s.openPanel === key;
    ppCloseAll();
    if (isOpen) return;

    /* Position */
    var rect = btn.getBoundingClientRect();
    panel.style.top  = (rect.bottom + 4) + 'px';
    panel.style.left = rect.left + 'px';

    /* Build items */
    panel.innerHTML = items.map(function (opt) {
      return '<div class="pp-dd-item' + (opt === selected ? ' pp-dd-sel' : '') +
        '" data-pp-pick="' + key + '" data-pp-val="' + opt + '">' + opt + '</div>';
    }).join('');

    panel.style.display = 'block';
    _s.openPanel = key;
  }

  function ppInitDropdowns() {
    /* Populate each panel on open via delegation */
    /* Labels are set here once */
    ppSetLabel('view',     _s.view);
    ppSetLabel('source',   _s.source);
    ppSetLabel('metric',   _s.metric);
    ppSetLabel('calc',     _s.calc);
    ppSetLabel('comp',     _s.comp);
    ppSetLabel('date',     _s.date);
    ppSetLabel('gafilter', _s.gafilter);
    ppSetLabel('pagesize', String(_s.pageSize));
  }

  function ppSetLabel(key, val) {
    var el = $('pp-lbl-' + key);
    if (el) el.textContent = val;
  }

  function ppSelect(key, val) {
    _s[key === 'pagesize' ? 'pageSize' : key] = key === 'pagesize' ? parseInt(val, 10) : val;
    ppSetLabel(key, val);

    if (key === 'source') {
      /* Reset metric to first option for new source */
      var metricOpts = PP_OPTS.metric[val];
      _s.metric = metricOpts[0];
      ppSetLabel('metric', _s.metric);
      /* Show/hide GA row */
      var gaRow = $('pp-ga-row');
      if (gaRow) {
        gaRow.classList.toggle('pp-ga-visible', val === 'Google Analytics');
      }
    }

    if (key === 'pagesize') {
      _s.page = 1;
      if (_s.hasResults) ppRenderTable();
    }
    ppCloseAll();
  }

  /* ── Analyse ── */
  function ppAnalyse() {
    var btn   = $('pp-analyse-btn');
    var label = $('pp-analyse-label');
    if (!btn || !label) return;
    btn.disabled = true;
    label.textContent = 'Analysing…';

    setTimeout(function () {
      btn.disabled = false;
      label.textContent = 'Analyse';
      _s.hasResults = true;
      _s.page = 1;
      _s.sortCol = 'value';
      _s.sortDir = 'desc';
      _s.zoomed  = false;

      var results = $('pp-results');
      if (results) results.style.display = 'block';

      ppLoadECharts(function () {
        ppRenderChart();
        ppRenderTable();
      });
    }, 300);
  }

  /* ── Chart ── */
  function ppRenderChart() {
    var data = PORTFOLIO_MOCK_DATA.slice().sort(function (a, b) { return b.value - a.value; });

    /* Update title */
    var titleEl = $('pp-chart-title');
    if (titleEl) titleEl.textContent = _s.metric + ' — ' + _s.calc + ' (' + ppCompLabel() + ')';

    /* Zoom button */
    var zoomBtn  = $('pp-zoom-btn');
    var zoomLbl  = $('pp-zoom-label');
    var hasOutliers = ppHasOutliers(data);
    if (zoomBtn) zoomBtn.classList.toggle('pp-zoom-visible', hasOutliers);

    /* Chart height */
    var chartH = Math.max(400, data.length * 36);
    var wrap = $('pp-chart');
    if (!wrap) return;
    wrap.style.height = chartH + 'px';

    /* Init or reuse ECharts instance */
    if (_s.chartInst) {
      try { _s.chartInst.resize(); } catch(e) {}
    } else {
      _s.chartInst = echarts.init(wrap);
    }

    var names  = data.map(function (d) { return d.name; });
    var values = data.map(function (d) { return d.value; });
    var colors = values.map(function (v) { return v >= 0 ? '#289253' : '#e53e3e'; });

    /* Domain */
    var domain = _s.zoomed && hasOutliers ? [-100, 300] : [null, null];

    var option = {
      grid: { left: 210, right: 60, top: 12, bottom: 30, containLabel: false },
      xAxis: {
        type: 'value',
        min: domain[0],
        max: domain[1],
        axisLabel: {
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 11,
          color: '#888',
          formatter: function (v) { return ppFmtAxisVal(v); }
        },
        splitLine: { lineStyle: { color: '#e5e7eb' } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: names,
        inverse: false,
        axisLabel: {
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 12,
          color: '#374151',
          align: 'right',
          width: 190,
          overflow: 'truncate'
        },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: values.map(function (v, i) {
          return { value: v, itemStyle: { color: colors[i], borderRadius: 3 } };
        }),
        barMaxWidth: 28,
        markLine: {
          symbol: 'none',
          data: [{ xAxis: 0, lineStyle: { color: '#9ca3af', width: 1.5, type: 'solid' } }],
          label: { show: false }
        }
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params) {
          var d = data[params[0].dataIndex];
          return '<div style="font-family:DM Sans,sans-serif;font-size:13px;">' +
            '<strong>' + d.name + '</strong><br/>' +
            _s.metric + ': ' + ppFmtValue(d.value) + '<br/>' +
            'Current: ' + ppFmtNum(d.currentValue) + '<br/>' +
            'Previous: ' + ppFmtNum(d.comparisonValue) +
            '</div>';
        },
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        textStyle: { color: '#111' }
      }
    };

    _s.chartInst.setOption(option, true);
  }

  /* ── Table ── */
  function ppSortedData() {
    var data = PORTFOLIO_MOCK_DATA.slice();
    var col  = _s.sortCol;
    var dir  = _s.sortDir === 'asc' ? 1 : -1;
    data.sort(function (a, b) {
      var av = col === 'name' ? a.name : (col === 'current' ? a.currentValue : (col === 'prev' ? a.comparisonValue : a.value));
      var bv = col === 'name' ? b.name : (col === 'current' ? b.currentValue : (col === 'prev' ? b.comparisonValue : b.value));
      if (typeof av === 'string') return dir * av.localeCompare(bv);
      return dir * (av - bv);
    });
    return data;
  }

  function ppArrow(col) {
    if (_s.sortCol !== col) return '<span style="opacity:0.3;margin-left:4px;">↕</span>';
    return '<span style="color:var(--color-blue);margin-left:4px;">' + (_s.sortDir === 'asc' ? '↑' : '↓') + '</span>';
  }

  function ppRenderTable() {
    var viewLabel = _s.view === 'Client' ? 'Client Name' : 'Website';
    var changeLabel = _s.calc === 'Percent Change' ? 'Change (%)' : 'Change';

    /* thead */
    var thead = $('pp-thead-row');
    if (thead) {
      thead.innerHTML =
        '<th class="pp-th" data-pp-sort="name">' + viewLabel + ppArrow('name') + '</th>' +
        '<th class="pp-th pp-th-right" data-pp-sort="current">Current Period' + ppArrow('current') + '</th>' +
        '<th class="pp-th pp-th-right" data-pp-sort="prev">Previous Period' + ppArrow('prev') + '</th>' +
        '<th class="pp-th pp-th-right" data-pp-sort="value">' + changeLabel + ppArrow('value') + '</th>';
    }

    var sorted  = ppSortedData();
    var total   = sorted.length;
    var ps      = _s.pageSize;
    var page    = _s.page;
    var totalPages = Math.ceil(total / ps);
    var start   = (page - 1) * ps;
    var end     = Math.min(start + ps, total);
    var slice   = sorted.slice(start, end);

    /* tbody */
    var tbody = $('pp-tbody');
    if (tbody) {
      tbody.innerHTML = slice.map(function (d) {
        var changeCol = _s.calc === 'Percent Change'
          ? (d.value >= 0 ? '+' : '') + d.value.toFixed(1) + '%'
          : (d.value >= 0 ? '+' : '') + ppFmtNum(Math.abs(d.value));
        var changeColor = d.value >= 0 ? '#289253' : '#e53e3e';
        return '<tr class="pp-tr">' +
          '<td class="pp-td">' + d.name + '</td>' +
          '<td class="pp-td pp-td-right">' + ppFmtNum(d.currentValue) + '</td>' +
          '<td class="pp-td pp-td-right">' + ppFmtNum(d.comparisonValue) + '</td>' +
          '<td class="pp-td pp-td-right" style="color:' + changeColor + ';font-weight:600;">' + changeCol + '</td>' +
          '</tr>';
      }).join('');
    }

    /* pagination info */
    var info = $('pp-page-info');
    if (info) info.textContent = 'Showing ' + (start + 1) + '–' + end + ' of ' + total + ' items';

    var prevBtn = $('pp-prev-btn');
    var nextBtn = $('pp-next-btn');
    if (prevBtn) prevBtn.disabled = page <= 1;
    if (nextBtn) nextBtn.disabled = page >= totalPages;

    ppSetLabel('pagesize', String(ps));
  }

  /* ── Page entry point ── */
  function showPortfolioPerformancePage() {
    if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
    var fdp = document.getElementById('feed-data-page');
    if (fdp) fdp.style.display = 'none';
    var page = $('portfolio-performance-page');
    if (page) page.style.display = 'block';
    window.scrollTo(0, 0);
    ppInitDropdowns();
    /* Re-render chart on window resize */
    window.addEventListener('resize', function () {
      if (_s.chartInst) _s.chartInst.resize();
    });
  }
  window.showPortfolioPerformancePage = showPortfolioPerformancePage;

  /* ── Global click delegation ── */
  document.addEventListener('click', function (e) {
    /* Dropdown trigger buttons */
    var ddMap = {
      'pp-btn-view':     { key: 'view',     opts: PP_OPTS.view,                  panel: 'pp-panel-view' },
      'pp-btn-source':   { key: 'source',   opts: PP_OPTS.source,                panel: 'pp-panel-source' },
      'pp-btn-metric':   { key: 'metric',   opts: PP_OPTS.metric[_s.source],     panel: 'pp-panel-metric' },
      'pp-btn-calc':     { key: 'calc',     opts: PP_OPTS.calc,                  panel: 'pp-panel-calc' },
      'pp-btn-comp':     { key: 'comp',     opts: PP_OPTS.comp,                  panel: 'pp-panel-comp' },
      'pp-btn-date':     { key: 'date',     opts: PP_OPTS.date,                  panel: 'pp-panel-date' },
      'pp-btn-gafilter': { key: 'gafilter', opts: PP_OPTS.gafilter,              panel: 'pp-panel-gafilter' },
      'pp-btn-pagesize': { key: 'pagesize', opts: PP_OPTS.pagesize,              panel: 'pp-panel-pagesize' }
    };

    var btnId = e.target.id || (e.target.closest && e.target.closest('.pp-dd-btn') && e.target.closest('.pp-dd-btn').id);
    if (btnId && ddMap[btnId]) {
      var cfg = ddMap[btnId];
      /* update metric opts dynamically */
      if (btnId === 'pp-btn-metric') cfg.opts = PP_OPTS.metric[_s.source];
      var btn   = $(btnId);
      var panel = $(cfg.panel);
      var sel   = cfg.key === 'pagesize' ? String(_s.pageSize) : _s[cfg.key];
      ppOpenPanel(cfg.key, btn, panel, cfg.opts, sel, ppSelect);
      e.stopPropagation();
      return;
    }

    /* Dropdown item picks */
    var item = e.target.closest('[data-pp-pick]');
    if (item) {
      ppSelect(item.getAttribute('data-pp-pick'), item.getAttribute('data-pp-val'));
      return;
    }

    /* Analyse button */
    if (e.target.id === 'pp-analyse-btn' || e.target.closest('#pp-analyse-btn')) {
      ppAnalyse();
      return;
    }

    /* Export button */
    if (e.target.id === 'pp-export-btn' || e.target.closest('#pp-export-btn')) {
      if (typeof showToast === 'function') showToast('Export coming soon');
      return;
    }

    /* Zoom button */
    if (e.target.id === 'pp-zoom-btn' || e.target.closest('#pp-zoom-btn')) {
      _s.zoomed = !_s.zoomed;
      var lbl = $('pp-zoom-label');
      if (lbl) lbl.textContent = _s.zoomed ? 'Show Original' : 'Zoom In';
      if (_s.hasResults) ppRenderChart();
      return;
    }

    /* Table sort */
    var th = e.target.closest('[data-pp-sort]');
    if (th) {
      var col = th.getAttribute('data-pp-sort');
      if (_s.sortCol === col) {
        _s.sortDir = _s.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        _s.sortCol = col;
        _s.sortDir = col === 'name' ? 'asc' : 'desc';
      }
      _s.page = 1;
      if (_s.hasResults) ppRenderTable();
      return;
    }

    /* Pagination */
    if (e.target.id === 'pp-prev-btn') {
      if (_s.page > 1) { _s.page--; ppRenderTable(); }
      return;
    }
    if (e.target.id === 'pp-next-btn') {
      var totalP = Math.ceil(PORTFOLIO_MOCK_DATA.length / _s.pageSize);
      if (_s.page < totalP) { _s.page++; ppRenderTable(); }
      return;
    }

    /* GA clear button */
    if (e.target.id === 'pp-ga-clear' || e.target.closest('#pp-ga-clear')) {
      var inp = $('pp-ga-input');
      if (inp) inp.value = '';
      _s.gaInput = '';
      return;
    }

    /* Click outside → close panels */
    if (!e.target.closest('.pp-dd-panel') && !e.target.closest('.pp-dd-btn')) {
      ppCloseAll();
    }
  });

  /* Close panels on scroll */
  document.addEventListener('scroll', function () { ppCloseAll(); }, true);

})();
