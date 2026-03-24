(function () {
  'use strict';

  // ── Chart.js CDN load ──────────────────────────────────────────────────────
  var _lcChartJsLoaded = false;
  function lcLoadChartJs(cb) {
    if (window.Chart) { cb(); return; }
    if (_lcChartJsLoaded) { var t = setInterval(function(){ if(window.Chart){ clearInterval(t); cb(); }}, 50); return; }
    _lcChartJsLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  // ── Metric definitions ─────────────────────────────────────────────────────
  var LC_METRICS = {
    sem: [
      { key:'convVal',    label:'Conversion Value', fmt:'currency', axis:'left' },
      { key:'cost',       label:'Cost',             fmt:'currency', axis:'left' },
      { key:'cos',        label:'COS',              fmt:'pct',      axis:'right' },
      { key:'roas',       label:'ROAS',             fmt:'x',        axis:'right' },
      { key:'conversions',label:'Conversions',      fmt:'num',      axis:'right' },
      { key:'convRate',   label:'Conv. Rate',        fmt:'pct',      axis:'right' },
      { key:'clicks',     label:'Clicks',            fmt:'num',      axis:'right' },
      { key:'impressions',label:'Impressions',       fmt:'num',      axis:'right' },
      { key:'cpc',        label:'CPC',               fmt:'currency', axis:'left'  },
      { key:'ctr',        label:'CTR',               fmt:'pct',      axis:'right' },
      { key:'aov',        label:'AOV',               fmt:'currency', axis:'left'  },
      { key:'cpa',        label:'CPA',               fmt:'currency', axis:'left'  }
    ],
    seo: [
      { key:'orgRevenue', label:'Organic Revenue',  fmt:'currency', axis:'left'  },
      { key:'orgSessions',label:'Organic Sessions', fmt:'num',      axis:'right' },
      { key:'seoConvRate',label:'Conv. Rate',        fmt:'pct',      axis:'right' },
      { key:'bounceRate', label:'Bounce Rate',       fmt:'pct',      axis:'right' },
      { key:'seoAov',     label:'AOV',               fmt:'currency', axis:'left'  }
    ]
  };
  var LC_ALL_METRICS = LC_METRICS.sem.concat(LC_METRICS.seo);

  var LC_COLOURS = [
    '#346ed9','#f59e0b','#10b981','#ef4444','#8b5cf6',
    '#06b6d4','#ec4899','#84cc16','#f97316','#6366f1'
  ];

  // ── Mock data generation ───────────────────────────────────────────────────
  function lcGenWeeks(nWeeks) {
    // Generate array of Date objects (Mondays), going back nWeeks from today
    var dates = [];
    var d = new Date();
    d.setHours(0,0,0,0);
    // Go to last Monday
    var day = d.getDay(); // 0=Sun
    d.setDate(d.getDate() - ((day + 6) % 7));
    for (var i = nWeeks - 1; i >= 0; i--) {
      var w = new Date(d);
      w.setDate(d.getDate() - i * 7);
      dates.push(w);
    }
    return dates;
  }

  function lcSeasonalityFactor(date) {
    var m = date.getMonth(); // 0=Jan
    // Peak: Oct(9), Nov(10), Dec(11), Jan(0)
    var factors = [1.15,0.90,0.88,0.92,0.95,0.98,1.00,1.02,1.05,1.18,1.28,1.22];
    return factors[m];
  }

  function lcNoise(pct) { return 1 + (Math.random() - 0.5) * pct * 2; }

  function lcGenOR(weeks) {
    // Outdoor Research base weekly values (annualised ~$487k rev, ~$98k cost)
    var baseConvVal = 9360, baseCost = 1893;
    return weeks.map(function(d) {
      var sf = lcSeasonalityFactor(d);
      var cv = Math.round(baseConvVal * sf * lcNoise(0.08));
      var co = Math.round(baseCost * sf * lcNoise(0.06));
      var conv = Math.round(cv / 189 * lcNoise(0.05));
      var clicks = Math.round(conv / 0.031 * lcNoise(0.04));
      var impr = Math.round(clicks / 0.02 * lcNoise(0.03));
      var cos = parseFloat((co / cv).toFixed(3));
      return {
        date: d,
        convVal: cv, cost: co, cos: cos, roas: parseFloat((cv/co).toFixed(2)),
        conversions: conv, convRate: 0.031, clicks: clicks,
        impressions: impr, cpc: parseFloat((co/clicks).toFixed(2)),
        ctr: 0.020, aov: parseFloat((cv/conv).toFixed(2)), cpa: parseFloat((co/conv).toFixed(2)),
        orgRevenue: Math.round(cv * 0.28 * lcNoise(0.10)),
        orgSessions: Math.round(clicks * 0.6 * lcNoise(0.12)),
        seoConvRate: 0.026, bounceRate: 0.44, seoAov: 184
      };
    });
  }

  function lcGenBiddy(weeks) {
    // Biddy Murphy — smaller scale (~30% of OR)
    var baseConvVal = 2850, baseCost = 610;
    return weeks.map(function(d) {
      var sf = lcSeasonalityFactor(d);
      var cv = Math.round(baseConvVal * sf * lcNoise(0.09));
      var co = Math.round(baseCost * sf * lcNoise(0.07));
      var conv = Math.round(cv / 142 * lcNoise(0.06));
      var clicks = Math.round(conv / 0.028 * lcNoise(0.04));
      var impr = Math.round(clicks / 0.019 * lcNoise(0.03));
      var cos = parseFloat((co / cv).toFixed(3));
      return {
        date: d,
        convVal: cv, cost: co, cos: cos, roas: parseFloat((cv/co).toFixed(2)),
        conversions: conv, convRate: 0.028, clicks: clicks,
        impressions: impr, cpc: parseFloat((co/clicks).toFixed(2)),
        ctr: 0.019, aov: parseFloat((cv/conv).toFixed(2)), cpa: parseFloat((co/conv).toFixed(2)),
        orgRevenue: Math.round(cv * 0.22 * lcNoise(0.10)),
        orgSessions: Math.round(clicks * 0.5 * lcNoise(0.12)),
        seoConvRate: 0.021, bounceRate: 0.48, seoAov: 142
      };
    });
  }

  // ── State ──────────────────────────────────────────────────────────────────
  var _lcState = {
    client: 'Outdoor Research',
    website: 'OutdoorResearch.com',
    metrics: ['convVal','cost'],
    granularity: 'Weekly',
    dateRange: 'Last 12 Months',
    fromDate: '', toDate: '',
    compare: false,
    cmpClient: 'Biddy Murphy',
    cmpWebsite: 'BiddyMurphy.com',
    cmpDateRange: 'Previous Period',
    openDd: null,
    tableOpen: false,
    tableSortCol: 0, tableSortDir: 1
  };

  var _lcChart = null;
  var _lcPrimaryData = [];
  var _lcCmpData = [];
  var _lcWeeks = [];

  // Dummy annotations for pins
  var LC_ANNOTATIONS = [
    { date: _offsetWeeks(-8), title: 'Google Ads policy update' },
    { date: _offsetWeeks(-20), title: 'Holiday campaign launch' },
    { date: _offsetWeeks(-38), title: 'Feed restructure' }
  ];
  function _offsetWeeks(n) {
    var d = new Date(); d.setDate(d.getDate() + n * 7); return d;
  }

  // ── Format helpers ─────────────────────────────────────────────────────────
  function lcFmt(val, fmt) {
    if (val == null || isNaN(val)) return '—';
    switch (fmt) {
      case 'currency': return '$' + (val >= 1000 ? (val/1000).toFixed(1)+'k' : val.toFixed(0));
      case 'pct':      return (val * 100).toFixed(1) + '%';
      case 'x':        return val.toFixed(2) + 'x';
      case 'num':      return val >= 1000 ? (val/1000).toFixed(1)+'k' : String(Math.round(val));
      default:         return String(val);
    }
  }
  function lcFmtFull(val, fmt) {
    if (val == null || isNaN(val)) return '—';
    switch (fmt) {
      case 'currency': return '$' + Number(val.toFixed(0)).toLocaleString();
      case 'pct':      return (val * 100).toFixed(2) + '%';
      case 'x':        return val.toFixed(2) + 'x';
      case 'num':      return Number(Math.round(val)).toLocaleString();
      default:         return String(val);
    }
  }
  function lcDateLabel(d) {
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  }
  function lcMetaFor(key) {
    for (var i = 0; i < LC_ALL_METRICS.length; i++) if (LC_ALL_METRICS[i].key === key) return LC_ALL_METRICS[i];
    return { key:key, label:key, fmt:'num', axis:'right' };
  }

  // ── Data slicing ───────────────────────────────────────────────────────────
  function lcGetWeekCount() {
    switch (_lcState.dateRange) {
      case 'Last 14 Days':    return 2;
      case 'Last 30 Days':    return 4;
      case 'Last 90 Days':    return 13;
      case 'Last 12 Months':  return 52;
      default:                return 52;
    }
  }
  function lcGetGranData(rawWeeks, rawData) {
    if (_lcState.granularity === 'Weekly') return { dates: rawWeeks, rows: rawData };
    // Monthly
    var months = {}, monthOrder = [];
    rawData.forEach(function(row) {
      var key = row.date.getFullYear() + '-' + String(row.date.getMonth()+1).padStart(2,'0');
      if (!months[key]) { months[key] = { date: new Date(row.date.getFullYear(), row.date.getMonth(), 1) }; monthOrder.push(key); LC_ALL_METRICS.forEach(function(m){ months[key][m.key] = 0; }); }
      LC_ALL_METRICS.forEach(function(m){ months[key][m.key] += (row[m.key] || 0); });
    });
    var rows = monthOrder.map(function(k){ return months[k]; });
    // Average rate metrics
    rows.forEach(function(r) {
      ['cos','convRate','seoConvRate','bounceRate','ctr'].forEach(function(k){ r[k] = r[k] / (rawData.filter(function(d){ return d.date.getFullYear()+'-'+String(d.date.getMonth()+1).padStart(2,'0') === Object.keys(months)[rows.indexOf(r)]; }).length || 1); });
      var cnt = rawData.filter(function(d){ var key = d.date.getFullYear() + '-' + String(d.date.getMonth()+1).padStart(2,'0'); return rows.indexOf(r) === monthOrder.indexOf(key); }).length || 1;
      if (r.conversions) { r.aov = r.convVal / r.conversions; r.cpa = r.cost / r.conversions; }
      if (r.clicks) { r.cpc = r.cost / r.clicks; r.roas = r.convVal / r.cost; }
    });
    return { dates: rows.map(function(r){ return r.date; }), rows: rows };
  }

  // ── Refresh data ───────────────────────────────────────────────────────────
  function lcRefreshData() {
    var n = lcGetWeekCount();
    _lcWeeks = lcGenWeeks(n);
    // Pick data source by client
    _lcPrimaryData = (_lcState.client === 'Outdoor Research') ? lcGenOR(_lcWeeks) : lcGenBiddy(_lcWeeks);
    _lcCmpData = (_lcState.cmpClient === 'Outdoor Research') ? lcGenOR(_lcWeeks) : lcGenBiddy(_lcWeeks);
  }

  // ── Summary cards ──────────────────────────────────────────────────────────
  function lcRenderSummary() {
    var el = document.getElementById('lc-summary-row');
    if (!el) return;
    var n = lcGetWeekCount();
    var half = Math.floor(n / 2);
    var current = _lcPrimaryData.slice(half);
    var prev    = _lcPrimaryData.slice(0, half);
    var html = '';
    _lcState.metrics.forEach(function(key) {
      var meta = lcMetaFor(key);
      var cur = current.reduce(function(s,r){ return s + (r[key]||0); }, 0);
      var prv = prev.reduce(function(s,r){ return s + (r[key]||0); }, 0);
      if (['cos','convRate','ctr','seoConvRate','bounceRate'].indexOf(key) !== -1) {
        cur = cur / (current.length || 1); prv = prv / (prev.length || 1);
      } else if (['roas','aov','cpc','cpa','seoAov'].indexOf(key) !== -1) {
        cur = cur / (current.length || 1); prv = prv / (prev.length || 1);
      }
      var delta = prv ? (cur - prv) / prv : 0;
      var dClass = delta >= 0 ? 'lc-delta-pos' : 'lc-delta-neg';
      var dSign = delta >= 0 ? '↑' : '↓';
      html += '<div class="lc-stat-card">';
      html += '<div class="lc-stat-name">' + meta.label + '</div>';
      html += '<div class="lc-stat-val">' + lcFmt(cur, meta.fmt) + '</div>';
      html += '<div class="lc-stat-delta ' + dClass + '">' + dSign + ' ' + Math.abs(delta * 100).toFixed(1) + '% vs prev</div>';
      html += '</div>';
    });
    el.innerHTML = html;
  }

  // ── Chart ──────────────────────────────────────────────────────────────────
  function lcRenderChart() {
    var empty = document.getElementById('lc-empty');
    var canvas = document.getElementById('lc-canvas');
    if (!canvas) return;

    if (!_lcState.metrics.length) {
      empty.style.display = 'flex'; canvas.style.display = 'none';
      if (_lcChart) { _lcChart.destroy(); _lcChart = null; }
      return;
    }
    empty.style.display = 'none'; canvas.style.display = 'block';

    var gd = lcGetGranData(_lcWeeks, _lcPrimaryData);
    var labels = gd.dates.map(lcDateLabel);
    var datasets = [];
    var colIdx = 0;

    _lcState.metrics.forEach(function(key) {
      var meta = lcMetaFor(key);
      var col = LC_COLOURS[colIdx % LC_COLOURS.length];
      var rgb = lcHexToRgb(col);
      var data = gd.rows.map(function(r){ return r[key] != null ? r[key] : null; });

      datasets.push({
        label: meta.label + (_lcState.compare ? ' (' + _lcState.website + ')' : ''),
        data: data,
        borderColor: col,
        backgroundColor: 'rgba(' + rgb + ',0.10)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: meta.axis === 'left' ? 'yLeft' : 'yRight',
        borderWidth: 2,
        borderDash: []
      });

      if (_lcState.compare) {
        var gd2 = lcGetGranData(_lcWeeks, _lcCmpData);
        var data2 = gd2.rows.map(function(r){ return r[key] != null ? r[key] : null; });
        datasets.push({
          label: meta.label + ' (' + _lcState.cmpWebsite + ')',
          data: data2,
          borderColor: col,
          backgroundColor: 'rgba(' + rgb + ',0.05)',
          fill: false,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
          yAxisID: meta.axis === 'left' ? 'yLeft' : 'yRight',
          borderWidth: 2,
          borderDash: [5,4]
        });
      }
      colIdx++;
    });

    // Annotation pin plugins (rendered via afterDraw)
    var annotPlugin = {
      id: 'lcAnnotations',
      afterDraw: function(chart) {
        var ctx = chart.ctx;
        var xAxis = chart.scales['x'];
        var yBottom = chart.chartArea.bottom;
        if (!xAxis) return;
        LC_ANNOTATIONS.forEach(function(ann) {
          // Find nearest label index
          var annLabel = lcDateLabel(ann.date);
          var idx = labels.indexOf(annLabel);
          if (idx === -1) return;
          var x = xAxis.getPixelForValue(idx);
          if (!x) return;
          ctx.save();
          ctx.fillStyle = '#f59e0b';
          // Draw pin (circle + stem)
          ctx.beginPath();
          ctx.arc(x, yBottom + 10, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x, yBottom + 5);
          ctx.lineTo(x, yBottom);
          ctx.stroke();
          ctx.restore();
        });
      }
    };

    if (_lcChart) { _lcChart.destroy(); _lcChart = null; }

    _lcChart = new window.Chart(canvas, {
      type: 'line',
      data: { labels: labels, datasets: datasets },
      plugins: [annotPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: "'DM Sans', sans-serif", size: 12 } } },
          tooltip: {
            backgroundColor: '#fff',
            borderColor: '#e2e6ef',
            borderWidth: 1,
            titleColor: '#0f0f0f',
            bodyColor: '#4b5563',
            padding: 8,
            cornerRadius: 4,
            callbacks: {
              label: function(ctx) {
                var meta = lcMetaFor(_lcState.metrics[Math.floor(ctx.datasetIndex / (_lcState.compare ? 2 : 1))]);
                return ctx.dataset.label + ': ' + lcFmtFull(ctx.parsed.y, meta.fmt);
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { font: { family: "'DM Sans', sans-serif", size: 11 }, maxRotation: 45, autoSkip: true, maxTicksLimit: 12 },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          yLeft: {
            type: 'linear', position: 'left',
            ticks: { font: { family: "'DM Sans', sans-serif", size: 11 }, callback: function(v){ return lcFmt(v,'currency'); } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          yRight: {
            type: 'linear', position: 'right',
            ticks: { font: { family: "'DM Sans', sans-serif", size: 11 } },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  function lcHexToRgb(hex) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return r+','+g+','+b;
  }

  // ── Data table ─────────────────────────────────────────────────────────────
  function lcRenderTable() {
    var table = document.getElementById('lc-data-table');
    if (!table || !_lcState.tableOpen) return;
    var gd = lcGetGranData(_lcWeeks, _lcPrimaryData);
    var metaList = _lcState.metrics.map(lcMetaFor);

    var thead = '<thead><tr><th data-col="0">Date</th>';
    metaList.forEach(function(m,i){ thead += '<th data-col="'+(i+1)+'">'+m.label+'</th>'; });
    thead += '</tr></thead>';

    var rows = gd.rows.slice().sort(function(a,b){
      var col = _lcState.tableSortCol;
      if (col === 0) return _lcState.tableSortDir * (a.date - b.date);
      var key = metaList[col-1].key;
      return _lcState.tableSortDir * ((a[key]||0) - (b[key]||0));
    });

    var tbody = '<tbody>';
    rows.forEach(function(row) {
      tbody += '<tr><td>' + lcDateLabel(row.date) + '</td>';
      metaList.forEach(function(m){ tbody += '<td>' + lcFmtFull(row[m.key], m.fmt) + '</td>'; });
      tbody += '</tr>';
    });
    tbody += '</tbody>';
    table.innerHTML = thead + tbody;
  }

  function lcExportCSV() {
    var gd = lcGetGranData(_lcWeeks, _lcPrimaryData);
    var metaList = _lcState.metrics.map(lcMetaFor);
    var lines = ['Date,' + metaList.map(function(m){ return m.label; }).join(',')];
    gd.rows.forEach(function(row) {
      var line = [lcDateLabel(row.date)];
      metaList.forEach(function(m){ line.push(lcFmtFull(row[m.key], m.fmt)); });
      lines.push(line.join(','));
    });
    var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = 'line-chart-data.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Dropdowns ──────────────────────────────────────────────────────────────
  function lcOpenDd(id) {
    lcCloseAllDd();
    var panel = document.getElementById(id);
    if (!panel) return;
    var btn = document.getElementById(id.replace('-panel','-btn'));
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    panel.style.left = rect.left + 'px';
    panel.style.top = (rect.bottom + 4) + 'px';
    panel.style.display = 'block';
    _lcState.openDd = id;
  }
  function lcCloseAllDd() {
    document.querySelectorAll('.lc-dd-panel').forEach(function(p){ p.style.display = 'none'; });
    _lcState.openDd = null;
  }

  function lcBuildClientDd(panelId, labelId, currentVal, onSelect) {
    var panel = document.getElementById(panelId);
    if (!panel || !window.ARGOS_CLIENTS) return;
    panel.innerHTML = '';
    window.ARGOS_CLIENTS.forEach(function(c) {
      var item = document.createElement('div');
      item.className = 'lc-dd-item' + (c.name === currentVal ? ' lc-selected' : '');
      item.textContent = c.name;
      item.addEventListener('click', function(){
        onSelect(c.name, c.websites[0] || '');
        lcCloseAllDd();
      });
      panel.appendChild(item);
    });
  }

  function lcBuildWebsiteDd(panelId, labelId, clientName, currentVal, onSelect) {
    var panel = document.getElementById(panelId);
    if (!panel || !window.ARGOS_CLIENTS) return;
    var client = window.ARGOS_CLIENTS.find(function(c){ return c.name === clientName; });
    if (!client) return;
    panel.innerHTML = '';
    client.websites.forEach(function(w) {
      var item = document.createElement('div');
      item.className = 'lc-dd-item' + (w === currentVal ? ' lc-selected' : '');
      item.textContent = w;
      item.addEventListener('click', function(){
        onSelect(w);
        lcCloseAllDd();
      });
      panel.appendChild(item);
    });
  }

  function lcBuildMetricDd() {
    var panel = document.getElementById('lc-metric-panel');
    if (!panel) return;
    panel.innerHTML = '';
    ['sem','seo'].forEach(function(group) {
      var lbl = document.createElement('div');
      lbl.className = 'lc-dd-group-label';
      lbl.textContent = group === 'sem' ? 'SEM Metrics' : 'SEO Metrics';
      panel.appendChild(lbl);
      LC_METRICS[group].forEach(function(m) {
        var item = document.createElement('div');
        item.className = 'lc-dd-item';
        var checked = _lcState.metrics.indexOf(m.key) !== -1;
        item.innerHTML = '<input type="checkbox" style="margin:0;cursor:pointer;" ' + (checked?'checked':'') + '> ' + m.label;
        item.addEventListener('click', function(e) {
          if (e.target.tagName !== 'INPUT') e.preventDefault();
          var cb = item.querySelector('input');
          var idx = _lcState.metrics.indexOf(m.key);
          if (idx === -1) { _lcState.metrics.push(m.key); cb.checked = true; }
          else { _lcState.metrics.splice(idx,1); cb.checked = false; }
          var lbl = document.getElementById('lc-metric-label');
          if (lbl) lbl.textContent = _lcState.metrics.length + ' Metric' + (_lcState.metrics.length===1?'':'s');
          lcRefreshData(); lcRenderSummary(); lcRenderChart(); lcRenderTable();
        });
        panel.appendChild(item);
      });
      if (group === 'sem') { var div = document.createElement('div'); div.className = 'lc-dd-divider'; panel.appendChild(div); }
    });
  }

  function lcBuildGranDd() {
    var panel = document.getElementById('lc-gran-panel');
    if (!panel) return;
    panel.innerHTML = '';
    ['Daily','Weekly','Monthly'].forEach(function(g) {
      var item = document.createElement('div');
      item.className = 'lc-dd-item' + (g === _lcState.granularity ? ' lc-selected' : '');
      item.textContent = g;
      item.addEventListener('click', function(){
        _lcState.granularity = g;
        document.getElementById('lc-gran-label').textContent = g;
        lcCloseAllDd();
        lcRefreshData(); lcRenderSummary(); lcRenderChart(); lcRenderTable();
      });
      panel.appendChild(item);
    });
  }

  function lcBuildDateDd() {
    var panel = document.getElementById('lc-date-panel');
    if (!panel) return;
    panel.innerHTML = '';
    ['Last 14 Days','Last 30 Days','Last 90 Days','Last 12 Months','Custom Range'].forEach(function(opt) {
      var item = document.createElement('div');
      item.className = 'lc-dd-item' + (opt === _lcState.dateRange ? ' lc-selected' : '');
      item.textContent = opt;
      item.addEventListener('click', function(){
        _lcState.dateRange = opt;
        document.getElementById('lc-date-label').textContent = opt;
        var row = document.getElementById('lc-custom-date-row');
        if (row) row.style.display = opt === 'Custom Range' ? 'flex' : 'none';
        lcCloseAllDd();
        if (opt !== 'Custom Range') { lcRefreshData(); lcRenderSummary(); lcRenderChart(); lcRenderTable(); }
      });
      panel.appendChild(item);
    });
  }

  function lcBuildCmpDateDd() {
    var panel = document.getElementById('lc-cmp-date-panel');
    if (!panel) return;
    panel.innerHTML = '';
    ['Previous Period','Previous Year','Custom Range'].forEach(function(opt) {
      var item = document.createElement('div');
      item.className = 'lc-dd-item' + (opt === _lcState.cmpDateRange ? ' lc-selected' : '');
      item.textContent = opt;
      item.addEventListener('click', function(){
        _lcState.cmpDateRange = opt;
        document.getElementById('lc-cmp-date-label').textContent = opt;
        lcCloseAllDd();
        lcRefreshData(); lcRenderChart();
      });
      panel.appendChild(item);
    });
  }

  // ── Event delegation ───────────────────────────────────────────────────────
  var _lcInitialized = false;
  function lcWireEvents() {
    if (_lcInitialized) return;
    _lcInitialized = true;

    document.addEventListener('click', function(e) {
      var page = document.getElementById('line-chart-page');
      if (!page || page.style.display === 'none') return;

      // Close dropdowns on outside click
      if (!e.target.closest('.lc-dd-btn') && !e.target.closest('.lc-dd-panel')) {
        lcCloseAllDd();
      }

      var id = e.target.closest('[id]') ? e.target.closest('[id]').id : '';

      // Dropdown buttons
      if (id === 'lc-client-btn' || e.target.closest('#lc-client-btn')) {
        lcBuildClientDd('lc-client-panel','lc-client-label',_lcState.client, function(name, firstSite){
          _lcState.client = name; _lcState.website = firstSite;
          document.getElementById('lc-client-label').textContent = name;
          document.getElementById('lc-website-label').textContent = firstSite;
          lcRefreshData(); lcRenderSummary(); lcRenderChart(); lcRenderTable();
        });
        lcOpenDd('lc-client-panel'); return;
      }
      if (id === 'lc-website-btn' || e.target.closest('#lc-website-btn')) {
        lcBuildWebsiteDd('lc-website-panel','lc-website-label',_lcState.client,_lcState.website,function(w){
          _lcState.website = w;
          document.getElementById('lc-website-label').textContent = w;
          lcRefreshData(); lcRenderSummary(); lcRenderChart(); lcRenderTable();
        });
        lcOpenDd('lc-website-panel'); return;
      }
      if (id === 'lc-metric-btn' || e.target.closest('#lc-metric-btn')) {
        lcBuildMetricDd(); lcOpenDd('lc-metric-panel'); return;
      }
      if (id === 'lc-gran-btn' || e.target.closest('#lc-gran-btn')) {
        lcBuildGranDd(); lcOpenDd('lc-gran-panel'); return;
      }
      if (id === 'lc-date-btn' || e.target.closest('#lc-date-btn')) {
        lcBuildDateDd(); lcOpenDd('lc-date-panel'); return;
      }
      if (id === 'lc-compare-btn' || e.target.closest('#lc-compare-btn')) {
        _lcState.compare = !_lcState.compare;
        var btn = document.getElementById('lc-compare-btn');
        if (btn) btn.classList.toggle('lc-compare-active', _lcState.compare);
        var row = document.getElementById('lc-compare-row');
        if (row) row.style.display = _lcState.compare ? 'flex' : 'none';
        lcRefreshData(); lcRenderChart(); return;
      }
      // Compare dropdowns
      if (e.target.closest('#lc-cmp-client-btn')) {
        lcBuildClientDd('lc-cmp-client-panel','lc-cmp-client-label',_lcState.cmpClient, function(name, firstSite){
          _lcState.cmpClient = name; _lcState.cmpWebsite = firstSite;
          document.getElementById('lc-cmp-client-label').textContent = name;
          document.getElementById('lc-cmp-website-label').textContent = firstSite;
          lcRefreshData(); lcRenderChart();
        });
        lcOpenDd('lc-cmp-client-panel'); return;
      }
      if (e.target.closest('#lc-cmp-website-btn')) {
        lcBuildWebsiteDd('lc-cmp-website-panel','lc-cmp-website-label',_lcState.cmpClient,_lcState.cmpWebsite,function(w){
          _lcState.cmpWebsite = w;
          document.getElementById('lc-cmp-website-label').textContent = w;
          lcRefreshData(); lcRenderChart();
        });
        lcOpenDd('lc-cmp-website-panel'); return;
      }
      if (e.target.closest('#lc-cmp-date-btn')) {
        lcBuildCmpDateDd(); lcOpenDd('lc-cmp-date-panel'); return;
      }

      // Table toggle
      if (id === 'lc-table-toggle' || e.target.closest('#lc-table-toggle')) {
        _lcState.tableOpen = !_lcState.tableOpen;
        var toggle = document.getElementById('lc-table-toggle');
        var body = document.getElementById('lc-table-body');
        if (toggle) toggle.classList.toggle('open', _lcState.tableOpen);
        if (body) body.style.display = _lcState.tableOpen ? 'block' : 'none';
        if (_lcState.tableOpen) lcRenderTable();
        return;
      }

      // Table sort
      var th = e.target.closest('th[data-col]');
      if (th && e.target.closest('#lc-data-table')) {
        var col = parseInt(th.getAttribute('data-col'));
        if (_lcState.tableSortCol === col) _lcState.tableSortDir *= -1;
        else { _lcState.tableSortCol = col; _lcState.tableSortDir = 1; }
        lcRenderTable(); return;
      }

      // Export
      if (id === 'lc-export-btn' || e.target.closest('#lc-export-btn')) {
        lcExportCSV(); return;
      }

      // Breadcrumb / header nav links
      var navLink = e.target.closest('[data-nav]');
      if (navLink && e.target.closest('#line-chart-page')) {
        var nav = navLink.getAttribute('data-nav');
        var sbKid = document.querySelector('[data-nav="' + nav + '"].sb-kid');
        if (sbKid) sbKid.click();
      }
    });

    // Custom date inputs
    ['lc-from-date','lc-to-date'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', function(){ lcRefreshData(); lcRenderSummary(); lcRenderChart(); lcRenderTable(); });
    });
  }

  // ── Public entry ───────────────────────────────────────────────────────────
  window.showLineChartPage = function() {
    if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
    var fdp = document.getElementById('feed-data-page'); if (fdp) fdp.style.display = 'none';
    var page = document.getElementById('line-chart-page');
    if (!page) return;
    page.style.display = 'block';
    window.scrollTo(0, 0);

    lcWireEvents();
    lcLoadChartJs(function() {
      lcRefreshData();
      lcRenderSummary();
      lcRenderChart();
    });
  };

})();
