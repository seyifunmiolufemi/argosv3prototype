(function () {
  'use strict';

  // ── Chart.js CDN (shared with line-chart) ──────────────────────────────────
  function fcLoadChartJs(cb) {
    if (window.Chart) { cb(); return; }
    var t = setInterval(function(){ if(window.Chart){ clearInterval(t); cb(); }}, 50);
    if (!document.querySelector('script[src*="chart.umd"]')) {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
      document.head.appendChild(s);
    }
  }

  // ── Constants ──────────────────────────────────────────────────────────────
  var FC_DEFAULTS = { budgetGoogle: 7200, budgetMsft: 1050, targetCos: 29 };
  var FC_SCENARIO_COLOURS = ['#346ed9','#10b981','#ef4444'];
  var FC_METRICS = [
    { key:'convVal', label:'Conversion Value', fmt:'currency', axis:'left' },
    { key:'cost',    label:'Cost',             fmt:'currency', axis:'left' },
    { key:'cos',     label:'COS',              fmt:'pct',      axis:'right' }
  ];
  var MONTH_ABBRS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // ── State ──────────────────────────────────────────────────────────────────
  var _fcState = {
    client: 'Outdoor Research', website: 'OutdoorResearch.com',
    horizon: 'Next 90 Days', metrics: ['convVal','cost','cos'],
    budgetGoogle: 7200, budgetMsft: 1050, targetCos: 29,
    advancedOpen: false,
    scenarios: [
      { name:'Conservative', budget: 6000, cos: 32 },
      { name:'Base',         budget: 8250, cos: 29 },
      { name:'Aggressive',   budget:11500, cos: 25 }
    ],
    seasonality: { 0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0 },
    seasonPage: 0,
    openDd: null
  };
  var _fcChart = null;

  // ── Helpers ────────────────────────────────────────────────────────────────
  function fcFmt(val, fmt) {
    if (val == null || isNaN(val)) return '—';
    switch (fmt) {
      case 'currency': return '$' + (val >= 1000000 ? (val/1000000).toFixed(2)+'M' : val >= 1000 ? (val/1000).toFixed(1)+'k' : val.toFixed(0));
      case 'pct':      return (val * 100).toFixed(1) + '%';
      default:         return String(val);
    }
  }
  function fcHexRgb(hex){ var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return r+','+g+','+b; }
  function fcDateLabel(d){ return d.toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
  function fcMonthLabel(d){ return MONTH_ABBRS[d.getMonth()] + ' ' + d.getFullYear(); }

  // ── Horizon weeks ──────────────────────────────────────────────────────────
  function fcHorizonWeeks() {
    switch (_fcState.horizon) {
      case 'Next 30 Days':   return 4;
      case 'Next 60 Days':   return 9;
      case 'Next 90 Days':   return 13;
      case 'Next 6 Months':  return 26;
      case 'Next 12 Months': return 52;
      default:               return 13;
    }
  }

  // ── Mock data ──────────────────────────────────────────────────────────────
  function fcSeasonFactor(d) {
    var m = d.getMonth();
    var base = [1.15,0.90,0.88,0.92,0.95,0.98,1.00,1.02,1.05,1.18,1.28,1.22][m];
    var adj = 1 + (_fcState.seasonality[m] || 0) / 100;
    return base * adj;
  }
  function fcNoise(p){ return 1 + (Math.random() - 0.5) * p * 2; }

  function fcGenHistorical() {
    // 52 weeks of historical data
    var weeks = [];
    var d = new Date(); d.setHours(0,0,0,0);
    var dayOff = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dayOff);
    for (var i = 51; i >= 0; i--) {
      var w = new Date(d); w.setDate(d.getDate() - i * 7);
      weeks.push(w);
    }
    var totalMonthlyBudget = _fcState.budgetGoogle + _fcState.budgetMsft;
    var weeklyBudget = totalMonthlyBudget * 12 / 52;
    return weeks.map(function(w) {
      var sf = fcSeasonFactor(w);
      var cost = weeklyBudget * sf * fcNoise(0.07);
      var cos = (_fcState.targetCos / 100) * (0.9 + 0.2 * Math.random());
      var convVal = cost / cos;
      return { date: w, convVal: convVal, cost: cost, cos: cos, type: 'historical' };
    });
  }

  function fcGenForecast(historical) {
    var hLen = historical.length;
    var recentN = Math.min(8, hLen);
    var recentSlice = historical.slice(hLen - recentN);
    var avgConvVal = recentSlice.reduce(function(s,r){ return s+r.convVal; },0) / recentN;
    var avgCost = recentSlice.reduce(function(s,r){ return s+r.cost; },0) / recentN;

    var fwdWeeks = fcHorizonWeeks();
    var lastDate = historical[hLen - 1].date;
    var rows = [];
    for (var i = 1; i <= fwdWeeks; i++) {
      var d = new Date(lastDate); d.setDate(d.getDate() + i * 7);
      var sf = fcSeasonFactor(d);
      var refSf = fcSeasonFactor(lastDate);
      var scaleF = sf / (refSf || 1);
      var convVal = avgConvVal * scaleF;
      var cost = avgCost * scaleF;
      var cos = cost / convVal;
      rows.push({
        date: d, convVal: convVal, cost: cost, cos: cos,
        convValLo: convVal * 0.90, convValHi: convVal * 1.10,
        costLo: cost * 0.90, costHi: cost * 1.10,
        type: 'forecast'
      });
    }
    return rows;
  }

  function fcGenScenarioForecast(scenario, baseForecast) {
    var totalBase = _fcState.budgetGoogle + _fcState.budgetMsft;
    var scaleFactor = totalBase > 0 ? (scenario.budget * 12 / 52) / (totalBase * 12 / 52) : 1;
    var cosRatio = totalBase > 0 ? (scenario.cos / _fcState.targetCos) : 1;
    return baseForecast.map(function(row) {
      var cost = row.cost * scaleFactor;
      var cos = row.cos * cosRatio;
      var convVal = cos > 0 ? cost / cos : row.convVal * scaleFactor;
      return { date: row.date, convVal: convVal, cost: cost, cos: cos, type: 'scenario' };
    });
  }

  // ── Chart ──────────────────────────────────────────────────────────────────
  function fcRenderChart() {
    var canvas = document.getElementById('fc-canvas');
    if (!canvas || !window.Chart) return;

    var historical = fcGenHistorical();
    var forecast   = fcGenForecast(historical);
    var allRows = historical.concat(forecast);
    var todayIdx = historical.length - 1;
    var labels = allRows.map(function(r){ return fcDateLabel(r.date); });

    var datasets = [];

    _fcState.metrics.forEach(function(key, mi) {
      var meta = FC_METRICS.find(function(m){ return m.key === key; }) || FC_METRICS[0];
      var col = ['#346ed9','#f59e0b','#10b981'][mi % 3];
      var rgb = fcHexRgb(col);

      // Historical (solid)
      var histData = allRows.map(function(r, i){ return i <= todayIdx ? (r[key] || null) : null; });
      // Forecast (dashed)
      var fcstData = allRows.map(function(r, i){ return i >= todayIdx ? (r[key] || null) : null; });
      // Confidence band
      var hiKey = key + 'Hi', loKey = key + 'Lo';
      var hiData = allRows.map(function(r, i){ return i >= todayIdx && r[hiKey] != null ? r[hiKey] : null; });
      var loData = allRows.map(function(r, i){ return i >= todayIdx && r[loKey] != null ? r[loKey] : null; });

      datasets.push({
        label: meta.label + ' (Historical)',
        data: histData, borderColor: col, backgroundColor: 'transparent',
        fill: false, tension: 0.3, pointRadius: 3, pointHoverRadius: 5,
        yAxisID: meta.axis === 'left' ? 'yLeft' : 'yRight',
        borderWidth: 2, borderDash: [], spanGaps: false
      });
      datasets.push({
        label: meta.label + ' (Forecast)',
        data: fcstData, borderColor: col, backgroundColor: 'rgba('+rgb+',0.15)',
        fill: { target: datasets.length + 1, above: 'rgba('+rgb+',0.08)' },
        tension: 0.3, pointRadius: 2, pointHoverRadius: 5,
        yAxisID: meta.axis === 'left' ? 'yLeft' : 'yRight',
        borderWidth: 2, borderDash: [6,4], spanGaps: false
      });

      // Scenarios (if advanced open)
      if (_fcState.advancedOpen) {
        _fcState.scenarios.forEach(function(sc, si) {
          var scData = fcGenScenarioForecast(sc, forecast);
          var scCol = FC_SCENARIO_COLOURS[si % 3];
          var fcstScData = allRows.map(function(r, i){ return i >= todayIdx ? (scData[i - todayIdx] ? scData[i - todayIdx][key] : null) : null; });
          datasets.push({
            label: meta.label + ' — ' + sc.name,
            data: fcstScData, borderColor: scCol, backgroundColor: 'transparent',
            fill: false, tension: 0.3, pointRadius: 0,
            yAxisID: meta.axis === 'left' ? 'yLeft' : 'yRight',
            borderWidth: 1.5, borderDash: [3,3], spanGaps: false
          });
        });
      }
    });

    // "Today" divider plugin
    var todayPlugin = {
      id: 'fcTodayLine',
      afterDraw: function(chart) {
        var ctx = chart.ctx;
        var xAxis = chart.scales['x'];
        if (!xAxis) return;
        var x = xAxis.getPixelForValue(todayIdx);
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4,3]);
        ctx.beginPath();
        ctx.moveTo(x, chart.chartArea.top);
        ctx.lineTo(x, chart.chartArea.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.font = '11px "DM Sans", sans-serif';
        ctx.fillText('Today', x + 4, chart.chartArea.top + 14);
        ctx.restore();
      }
    };

    if (_fcChart) { _fcChart.destroy(); _fcChart = null; }
    _fcChart = new window.Chart(canvas, {
      type: 'line',
      data: { labels: labels, datasets: datasets },
      plugins: [todayPlugin],
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family:"'DM Sans',sans-serif", size:12 } } },
          tooltip: {
            backgroundColor: '#fff', borderColor: '#e2e6ef', borderWidth: 1,
            titleColor: '#0f0f0f', bodyColor: '#4b5563', padding: 8, cornerRadius: 4,
            callbacks: {
              label: function(ctx) {
                if (ctx.parsed.y == null) return null;
                var dsLabel = ctx.dataset.label || '';
                var isForecast = dsLabel.includes('Forecast') || dsLabel.includes('Conservative') || dsLabel.includes('Base') || dsLabel.includes('Aggressive');
                var keyIdx = _fcState.metrics.indexOf(['convVal','cost','cos'][Math.floor(ctx.datasetIndex / (isForecast ? 2 : 2))]);
                var meta = FC_METRICS[keyIdx] || FC_METRICS[0];
                var suffix = '';
                var rowIdx = ctx.dataIndex;
                if (isForecast && rowIdx >= todayIdx) {
                  var row = forecast[rowIdx - todayIdx];
                  if (row) {
                    var hiKey = meta.key + 'Hi', loKey = meta.key + 'Lo';
                    if (row[hiKey] != null) suffix = ' (' + fcFmt(row[loKey], meta.fmt) + ' – ' + fcFmt(row[hiKey], meta.fmt) + ')';
                  }
                }
                return dsLabel + ': ' + fcFmt(ctx.parsed.y, meta.fmt) + suffix;
              }
            }
          }
        },
        scales: {
          x: { ticks: { font:{family:"'DM Sans',sans-serif",size:11}, maxRotation:45, autoSkip:true, maxTicksLimit:14 }, grid: { color:'rgba(0,0,0,0.05)' } },
          yLeft: { type:'linear', position:'left', ticks:{ font:{family:"'DM Sans',sans-serif",size:11}, callback:function(v){ return fcFmt(v,'currency'); } }, grid:{ color:'rgba(0,0,0,0.05)' } },
          yRight: { type:'linear', position:'right', ticks:{ font:{family:"'DM Sans',sans-serif",size:11}, callback:function(v){ return (v*100).toFixed(1)+'%'; } }, grid:{ drawOnChartArea:false } }
        }
      }
    });

    // Render summary cards
    fcRenderSummary(historical, forecast);
  }

  // ── Summary cards ──────────────────────────────────────────────────────────
  function fcRenderSummary(historical, forecast) {
    var el = document.getElementById('fc-summary-row');
    if (!el) return;
    var fwdWeeks = fcHorizonWeeks();
    var fSlice = forecast.slice(0, fwdWeeks);

    var projConvVal = fSlice.reduce(function(s,r){ return s+r.convVal; },0);
    var projCost    = fSlice.reduce(function(s,r){ return s+r.cost; },0);
    var projCos     = projCost / (projConvVal || 1);

    var prevSlice = historical.slice(Math.max(0, historical.length - fwdWeeks));
    var prevConvVal = prevSlice.reduce(function(s,r){ return s+r.convVal; },0);
    var prevCost    = prevSlice.reduce(function(s,r){ return s+r.cost; },0);

    var metrics = [
      { label:'Projected Conversion Value', val:projConvVal, prev:prevConvVal, fmt:'currency' },
      { label:'Projected Cost',             val:projCost,    prev:prevCost,    fmt:'currency' },
      { label:'Projected COS',              val:projCos,     prev:null,        fmt:'pct' }
    ];

    var cosClass = projCos < 0.20 ? 'fc-delta-pos' : projCos > 0.29 ? 'fc-delta-neg' : '';

    var html = '';
    metrics.forEach(function(m) {
      var delta = m.prev ? (m.val - m.prev) / m.prev : null;
      var dHtml = '';
      if (delta != null) {
        var dClass = delta >= 0 ? 'fc-delta-pos' : 'fc-delta-neg';
        dHtml = '<div class="fc-sum-delta '+dClass+'">'+(delta>=0?'↑':'↓')+' '+Math.abs(delta*100).toFixed(1)+'% vs last period</div>';
      }
      var valClass = m.fmt === 'pct' ? cosClass : '';
      html += '<div class="fc-summary-card">';
      html += '<div class="fc-sum-label">'+m.label+'</div>';
      html += '<div class="fc-sum-val '+valClass+'">'+fcFmt(m.val, m.fmt)+'</div>';
      html += dHtml;
      // Scenario values
      if (_fcState.advancedOpen) {
        html += '<div class="fc-scenario-vals">';
        _fcState.scenarios.forEach(function(sc, si) {
          var scData = fcGenScenarioForecast(sc, forecast.slice(0, fwdWeeks));
          var scVal = scData.reduce(function(s,r){ return s+(r[m.fmt==='pct'?'cos':m.label==='Projected Cost'?'cost':'convVal']||0); },0);
          if (m.fmt === 'pct') scVal = scVal / (scData.length || 1);
          html += '<div class="fc-scenario-val" style="color:'+FC_SCENARIO_COLOURS[si]+'">'+sc.name+': '+fcFmt(scVal,m.fmt)+'</div>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    el.innerHTML = html;
  }

  // ── Implied revenue ────────────────────────────────────────────────────────
  function fcUpdateImpliedRev() {
    var el = document.getElementById('fc-implied-rev');
    if (!el) return;
    var totalBudget = (_fcState.budgetGoogle + _fcState.budgetMsft) * 12;
    var cos = _fcState.targetCos / 100;
    var rev = cos > 0 ? totalBudget / cos : 0;
    el.value = '$' + Math.round(rev).toLocaleString();
  }

  // ── Scenarios list ─────────────────────────────────────────────────────────
  function fcRenderScenarios() {
    var list = document.getElementById('fc-scenarios-list');
    if (!list) return;
    list.innerHTML = '';
    _fcState.scenarios.forEach(function(sc, si) {
      var row = document.createElement('div');
      row.className = 'fc-scenario-row';
      row.style.cssText = 'display:grid;grid-template-columns:140px 130px 100px 1fr;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--color-border);';
      row.innerHTML =
        '<input class="fc-scenario-name" style="border:1px solid var(--color-border);border-radius:6px;padding:6px 10px;font-family:\'DM Sans\',sans-serif;font-size:13px;color:'+FC_SCENARIO_COLOURS[si]+';font-weight:500;" value="'+sc.name+'" data-sc="'+si+'" data-field="name">'+
        '<input class="fc-scenario-budget" style="border:1px solid var(--color-border);border-radius:6px;padding:6px 10px;font-family:\'DM Sans\',sans-serif;font-size:13px;" value="'+sc.budget+'" data-sc="'+si+'" data-field="budget" type="number">'+
        '<input class="fc-scenario-cos" style="border:1px solid var(--color-border);border-radius:6px;padding:6px 10px;font-family:\'DM Sans\',sans-serif;font-size:13px;" value="'+sc.cos+'" data-sc="'+si+'" data-field="cos" type="number">'+
        '<button style="background:none;border:none;cursor:pointer;color:var(--color-text-caption);font-size:16px;padding:0 4px;" data-remove-sc="'+si+'">×</button>';
      list.appendChild(row);
    });
  }

  // ── Seasonality sliders ────────────────────────────────────────────────────
  function fcRenderSeasonMonths() {
    var el = document.getElementById('fc-season-months');
    var label = document.getElementById('fc-season-range-label');
    if (!el) return;
    var startM = _fcState.seasonPage * 3;
    if (label) {
      var endM = Math.min(startM + 2, 11);
      label.textContent = MONTH_ABBRS[startM] + ' – ' + MONTH_ABBRS[endM];
    }
    el.innerHTML = '';
    for (var i = startM; i < startM + 3 && i <= 11; i++) {
      var div = document.createElement('div');
      div.className = 'fc-season-month';
      div.innerHTML = '<label>'+MONTH_ABBRS[i]+'</label><input type="number" style="width:70px;padding:5px 8px;border:1px solid var(--color-border);border-radius:6px;font-size:12px;font-family:\'DM Sans\',sans-serif;" placeholder="0" value="'+(_fcState.seasonality[i]||0)+'" data-season-month="'+i+'">';
      el.appendChild(div);
    }
  }

  // ── Dropdowns ──────────────────────────────────────────────────────────────
  function fcOpenDd(id) {
    fcCloseAllDd();
    var panel = document.getElementById(id);
    if (!panel) return;
    var btn = document.getElementById(id.replace('-panel','-btn'));
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    panel.style.left = rect.left + 'px';
    panel.style.top = (rect.bottom + 4) + 'px';
    panel.style.display = 'block';
    _fcState.openDd = id;
  }
  function fcCloseAllDd() {
    document.querySelectorAll('.fc-dd-panel').forEach(function(p){ p.style.display='none'; });
    _fcState.openDd = null;
  }

  function fcBuildClientDd() {
    var panel = document.getElementById('fc-client-panel');
    if (!panel || !window.ARGOS_CLIENTS) return;
    panel.innerHTML = '';
    window.ARGOS_CLIENTS.forEach(function(c) {
      var item = document.createElement('div');
      item.className = 'fc-dd-item' + (c.name === _fcState.client ? ' fc-selected' : '');
      item.textContent = c.name;
      item.addEventListener('click', function(){
        _fcState.client = c.name; _fcState.website = c.websites[0] || '';
        document.getElementById('fc-client-label').textContent = c.name;
        document.getElementById('fc-website-label').textContent = _fcState.website;
        fcCloseAllDd(); fcRenderChart();
      });
      panel.appendChild(item);
    });
  }

  function fcBuildWebsiteDd() {
    var panel = document.getElementById('fc-website-panel');
    if (!panel || !window.ARGOS_CLIENTS) return;
    var client = window.ARGOS_CLIENTS.find(function(c){ return c.name === _fcState.client; });
    if (!client) return;
    panel.innerHTML = '';
    client.websites.forEach(function(w) {
      var item = document.createElement('div');
      item.className = 'fc-dd-item' + (w === _fcState.website ? ' fc-selected' : '');
      item.textContent = w;
      item.addEventListener('click', function(){
        _fcState.website = w;
        document.getElementById('fc-website-label').textContent = w;
        fcCloseAllDd(); fcRenderChart();
      });
      panel.appendChild(item);
    });
  }

  function fcBuildHorizonDd() {
    var panel = document.getElementById('fc-horizon-panel');
    if (!panel) return;
    panel.innerHTML = '';
    ['Next 30 Days','Next 60 Days','Next 90 Days','Next 6 Months','Next 12 Months','Custom Range'].forEach(function(opt) {
      var item = document.createElement('div');
      item.className = 'fc-dd-item' + (opt === _fcState.horizon ? ' fc-selected' : '');
      item.textContent = opt;
      item.addEventListener('click', function(){
        _fcState.horizon = opt;
        document.getElementById('fc-horizon-label').textContent = opt;
        var row = document.getElementById('fc-custom-horizon-row');
        if (row) row.style.display = opt === 'Custom Range' ? 'flex' : 'none';
        fcCloseAllDd();
        if (opt !== 'Custom Range') fcRenderChart();
      });
      panel.appendChild(item);
    });
  }

  function fcBuildMetricDd() {
    var panel = document.getElementById('fc-metric-panel');
    if (!panel) return;
    panel.innerHTML = '';
    FC_METRICS.forEach(function(m) {
      var item = document.createElement('div');
      item.className = 'fc-dd-item';
      var checked = _fcState.metrics.indexOf(m.key) !== -1;
      item.innerHTML = '<input type="checkbox" style="cursor:pointer;margin:0;" ' + (checked?'checked':'') + '> ' + m.label;
      item.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT') e.preventDefault();
        var cb = item.querySelector('input');
        var idx = _fcState.metrics.indexOf(m.key);
        if (idx === -1) { _fcState.metrics.push(m.key); cb.checked = true; }
        else { _fcState.metrics.splice(idx,1); cb.checked = false; }
        var lbl = document.getElementById('fc-metric-label');
        if (lbl) lbl.textContent = _fcState.metrics.length + ' Metric' + (_fcState.metrics.length===1?'':'s');
        fcRenderChart();
      });
      panel.appendChild(item);
    });
  }

  // ── Event delegation ───────────────────────────────────────────────────────
  var _fcInitialized = false;
  function fcWireEvents() {
    if (_fcInitialized) return;
    _fcInitialized = true;

    document.addEventListener('click', function(e) {
      var page = document.getElementById('forecasting-page');
      if (!page || page.style.display === 'none') return;

      if (!e.target.closest('.fc-dd-btn') && !e.target.closest('.fc-dd-panel')) fcCloseAllDd();

      if (e.target.closest('#fc-client-btn'))  { fcBuildClientDd();  fcOpenDd('fc-client-panel');  return; }
      if (e.target.closest('#fc-website-btn')) { fcBuildWebsiteDd(); fcOpenDd('fc-website-panel'); return; }
      if (e.target.closest('#fc-horizon-btn')) { fcBuildHorizonDd(); fcOpenDd('fc-horizon-panel'); return; }
      if (e.target.closest('#fc-metric-btn'))  { fcBuildMetricDd();  fcOpenDd('fc-metric-panel');  return; }

      // Advanced toggle
      if (e.target.closest('#fc-advanced-toggle')) {
        _fcState.advancedOpen = !_fcState.advancedOpen;
        var tog = document.getElementById('fc-advanced-toggle');
        var body = document.getElementById('fc-advanced-body');
        if (tog) tog.classList.toggle('open', _fcState.advancedOpen);
        if (body) body.style.display = _fcState.advancedOpen ? 'block' : 'none';
        if (_fcState.advancedOpen) { fcRenderScenarios(); fcRenderSeasonMonths(); }
        fcRenderChart(); return;
      }

      // Add scenario
      if (e.target.closest('#fc-add-scenario-btn')) {
        if (_fcState.scenarios.length < 3) {
          _fcState.scenarios.push({ name:'Scenario '+(_fcState.scenarios.length+1), budget:8250, cos:29 });
          fcRenderScenarios(); fcRenderChart();
        }
        return;
      }

      // Remove scenario
      var removeBtn = e.target.closest('[data-remove-sc]');
      if (removeBtn) {
        var si = parseInt(removeBtn.getAttribute('data-remove-sc'));
        _fcState.scenarios.splice(si, 1);
        fcRenderScenarios(); fcRenderChart(); return;
      }

      // Reset
      if (e.target.closest('#fc-reset-btn')) {
        _fcState.budgetGoogle = FC_DEFAULTS.budgetGoogle;
        _fcState.budgetMsft   = FC_DEFAULTS.budgetMsft;
        _fcState.targetCos    = FC_DEFAULTS.targetCos;
        document.getElementById('fc-budget-google').value = FC_DEFAULTS.budgetGoogle;
        document.getElementById('fc-budget-msft').value   = FC_DEFAULTS.budgetMsft;
        document.getElementById('fc-target-cos').value    = FC_DEFAULTS.targetCos;
        fcUpdateImpliedRev(); fcRenderChart(); return;
      }

      // Seasonality prev/next
      if (e.target.closest('#fc-season-prev')) {
        if (_fcState.seasonPage > 0) { _fcState.seasonPage--; fcRenderSeasonMonths(); } return;
      }
      if (e.target.closest('#fc-season-next')) {
        if (_fcState.seasonPage < 3) { _fcState.seasonPage++; fcRenderSeasonMonths(); } return;
      }

      // Header nav
      var navLink = e.target.closest('[data-nav]');
      if (navLink && e.target.closest('#forecasting-page')) {
        var nav = navLink.getAttribute('data-nav');
        var sbKid = document.querySelector('[data-nav="' + nav + '"].sb-kid');
        if (sbKid) sbKid.click();
      }
    });

    // Input changes — planning fields
    ['fc-budget-google','fc-budget-msft','fc-target-cos'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function() {
        _fcState.budgetGoogle = parseFloat(document.getElementById('fc-budget-google').value) || 0;
        _fcState.budgetMsft   = parseFloat(document.getElementById('fc-budget-msft').value)   || 0;
        _fcState.targetCos    = parseFloat(document.getElementById('fc-target-cos').value)    || 29;
        fcUpdateImpliedRev(); fcRenderChart();
      });
    });

    // Scenario inputs (delegated via change on document)
    document.addEventListener('change', function(e) {
      var page = document.getElementById('forecasting-page');
      if (!page || page.style.display === 'none') return;

      var scInput = e.target.closest('[data-sc]');
      if (scInput && scInput.getAttribute('data-field')) {
        var si = parseInt(scInput.getAttribute('data-sc'));
        var field = scInput.getAttribute('data-field');
        if (_fcState.scenarios[si]) {
          _fcState.scenarios[si][field] = field === 'name' ? scInput.value : parseFloat(scInput.value)||0;
          fcRenderChart();
        }
        return;
      }

      // Seasonality
      var seasonInput = e.target.closest('[data-season-month]');
      if (seasonInput) {
        var m = parseInt(seasonInput.getAttribute('data-season-month'));
        _fcState.seasonality[m] = parseFloat(seasonInput.value) || 0;
        fcRenderChart(); return;
      }
    });
  }

  // ── Public entry ───────────────────────────────────────────────────────────
  window.showForecastingPage = function() {
    if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
    var fdp = document.getElementById('feed-data-page'); if (fdp) fdp.style.display = 'none';
    var page = document.getElementById('forecasting-page');
    if (!page) return;
    page.style.display = 'block';
    window.scrollTo(0, 0);
    fcWireEvents();
    fcUpdateImpliedRev();
    fcLoadChartJs(fcRenderChart);
  };

})();
