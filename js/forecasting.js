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
    advancedOpen: false, editMode: false,
    scenariosOn: false, seasonalityOn: false,
    scenarios: [
      { name:'Conservative', budget: 6000, cos: 32 },
      { name:'Base',         budget: 8250, cos: 29 },
      { name:'Aggressive',   budget:11500, cos: 25 }
    ],
    seasonality: { 0:-8,1:-5,2:2,3:5,4:8,5:6,6:4,7:10,8:15,9:22,10:18,11:12 },
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

  // ── Horizon in months ──────────────────────────────────────────────────────
  function fcHorizonMonths() {
    switch (_fcState.horizon) {
      case 'Next 30 Days':   return 1;
      case 'Next 60 Days':   return 2;
      case 'Next 90 Days':   return 3;
      case 'Next 6 Months':  return 6;
      case 'Next 12 Months': return 12;
      default:               return 3;
    }
  }

  // ── Projected revenue helpers ──────────────────────────────────────────────
  function fcScenarioProjRev(sc) {
    var months = fcHorizonMonths();
    var cos = (sc.cos || 0) / 100;
    return cos > 0 ? sc.budget * months / cos : 0;
  }
  function fcBaseProjRev() {
    var months = fcHorizonMonths();
    var cos = _fcState.targetCos / 100;
    return cos > 0 ? (_fcState.budgetGoogle + _fcState.budgetMsft) * months / cos : 0;
  }

  // ── 4-week rolling average ─────────────────────────────────────────────────
  function fcRollingAvg(data, n) {
    return data.map(function(_, i) {
      if (data[i] == null) return null;
      var slice = data.slice(Math.max(0, i - n + 1), i + 1).filter(function(v){ return v != null; });
      return slice.length ? slice.reduce(function(a, b){ return a + b; }, 0) / slice.length : null;
    });
  }

  // ── Seasonality cell background ────────────────────────────────────────────
  function fcSeasonCellBg(val) {
    if (val > 0) return 'var(--color-container-success)';
    if (val < 0) return '#fff0f0';
    return 'var(--color-bg-grey50)';
  }
  function fcSeasonCellClass(val) {
    if (val > 0) return 'fc-season-cell fc-pos';
    if (val < 0) return 'fc-season-cell fc-neg';
    return 'fc-season-cell fc-zero';
  }

  // ── Edit mode ──────────────────────────────────────────────────────────────
  function fcSetEditMode(editing) {
    _fcState.editMode = editing;
    var editableIds = ['fc-budget-google', 'fc-budget-msft', 'fc-target-cos'];
    editableIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (editing) { el.removeAttribute('readonly'); }
      else         { el.setAttribute('readonly', ''); }
    });
    var controls = document.getElementById('fc-edit-controls');
    if (!controls) return;
    if (editing) {
      controls.innerHTML =
        '<button class="fc-save-btn" id="fc-save-btn">Save</button>' +
        '<button class="fc-cancel-btn" id="fc-cancel-btn">Cancel</button>';
    } else {
      controls.innerHTML =
        '<button class="fc-edit-btn" id="fc-edit-btn">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
        'Edit</button>';
    }
  }

  // ── Budget warnings ────────────────────────────────────────────────────────
  function fcUpdateBudgetWarnings() {
    var fields = [
      { id: 'fc-budget-google', warnId: 'fc-warn-google', val: _fcState.budgetGoogle },
      { id: 'fc-budget-msft',   warnId: 'fc-warn-msft',   val: _fcState.budgetMsft }
    ];
    fields.forEach(function(f) {
      var inp  = document.getElementById(f.id);
      var warn = document.getElementById(f.warnId);
      if (!inp || !warn) return;
      var isEmpty = !f.val || f.val === 0;
      if (isEmpty && inp.value !== '') inp.value = '';
      warn.style.display = isEmpty ? 'flex' : 'none';
    });
  }

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
    var adj = _fcState.seasonalityOn ? 1 + (_fcState.seasonality[m] || 0) / 100 : 1;
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
    var allRows    = historical.concat(forecast);
    var todayIdx   = historical.length - 1;
    var labels     = allRows.map(function(r){ return fcDateLabel(r.date); });

    var cs          = getComputedStyle(document.documentElement);
    var gridColor   = cs.getPropertyValue('--color-border').trim()       || '#e2e6ef';
    var tickColor   = cs.getPropertyValue('--color-text-caption').trim() || '#9ca3af';
    var textPrimary = cs.getPropertyValue('--color-text-primary').trim() || '#0f0f0f';

    var datasets = [];

    _fcState.metrics.forEach(function(key, mi) {
      var meta = FC_METRICS.find(function(m){ return m.key === key; }) || FC_METRICS[0];
      var col  = ['#346ed9','#f59e0b','#10b981'][mi % 3];
      var rgb  = fcHexRgb(col);
      var colForecast = 'rgba(' + rgb + ',0.7)';
      var yAxis = meta.axis === 'left' ? 'yLeft' : 'yRight';

      // Historical — solid 1.5px, COS smoothed with 4-week rolling avg
      var histRaw  = allRows.map(function(r, i){ return i <= todayIdx ? (r[key] != null ? r[key] : null) : null; });
      var histData = key === 'cos' ? fcRollingAvg(histRaw, 4) : histRaw;
      datasets.push({
        label: meta.label + ' (Historical)',
        data: histData, borderColor: col, backgroundColor: 'transparent',
        fill: false, tension: 0.3, pointRadius: 2, pointHoverRadius: 5,
        yAxisID: yAxis, borderWidth: 1.5, borderDash: [], spanGaps: false,
        _fcMetricKey: key, _fcType: 'historical'
      });

      // Forecast — dashed 2px, 70% opacity
      var fcstData = allRows.map(function(r, i){ return i >= todayIdx ? (r[key] != null ? r[key] : null) : null; });
      datasets.push({
        label: meta.label + ' (Forecast)',
        data: fcstData, borderColor: colForecast, backgroundColor: 'transparent',
        fill: false, tension: 0.3, pointRadius: 0, pointHoverRadius: 5,
        yAxisID: yAxis, borderWidth: 2, borderDash: [5, 4], spanGaps: false,
        _fcMetricKey: key, _fcType: 'forecast'
      });

      // Confidence interval: upper fills down to lower (±10%)
      var hiKey = key + 'Hi', loKey = key + 'Lo';
      var hiData = allRows.map(function(r, i){ return i > todayIdx && r[hiKey] != null ? r[hiKey] : null; });
      var loData = allRows.map(function(r, i){ return i > todayIdx && r[loKey] != null ? r[loKey] : null; });
      datasets.push({
        label: meta.label + ' CI Upper',
        data: hiData, borderColor: 'rgba(' + rgb + ',0)', backgroundColor: 'rgba(' + rgb + ',0.12)',
        fill: '+1', tension: 0.3, pointRadius: 0, pointHoverRadius: 0,
        yAxisID: yAxis, borderWidth: 0, spanGaps: false,
        hideInLegend: true, _fcMetricKey: key, _fcType: 'ci'
      });
      datasets.push({
        label: meta.label + ' CI Lower',
        data: loData, borderColor: 'rgba(' + rgb + ',0)', backgroundColor: 'transparent',
        fill: false, tension: 0.3, pointRadius: 0, pointHoverRadius: 0,
        yAxisID: yAxis, borderWidth: 0, spanGaps: false,
        hideInLegend: true, _fcMetricKey: key, _fcType: 'ci'
      });

      // Scenarios (if scenarios enabled)
      if (_fcState.scenariosOn) {
        _fcState.scenarios.forEach(function(sc, si) {
          var scData     = fcGenScenarioForecast(sc, forecast);
          var scCol      = FC_SCENARIO_COLOURS[si % 3];
          var fcstScData = allRows.map(function(r, i){
            return i >= todayIdx ? (scData[i - todayIdx] ? scData[i - todayIdx][key] : null) : null;
          });
          datasets.push({
            label: meta.label + ' — ' + sc.name,
            data: fcstScData, borderColor: scCol, backgroundColor: 'transparent',
            fill: false, tension: 0.3, pointRadius: 0,
            yAxisID: yAxis, borderWidth: 1.5, borderDash: [3, 3], spanGaps: false,
            _fcMetricKey: key, _fcType: 'scenario'
          });
        });
      }
    });

    // Forecast region background + Today line
    var todayPlugin = {
      id: 'fcTodayLine',
      beforeDraw: function(chart) {
        var ctx = chart.ctx, ca = chart.chartArea, xAxis = chart.scales['x'];
        if (!xAxis || !ca) return;
        var x = xAxis.getPixelForValue(todayIdx);
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.03)';
        ctx.fillRect(x, ca.top, ca.right - x, ca.bottom - ca.top);
        ctx.restore();
      },
      afterDraw: function(chart) {
        var ctx = chart.ctx, ca = chart.chartArea, xAxis = chart.scales['x'];
        if (!xAxis || !ca) return;
        var x = xAxis.getPixelForValue(todayIdx);
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(x, ca.top); ctx.lineTo(x, ca.bottom); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.font = '11px "DM Sans", sans-serif';
        ctx.fillText('Today', x + 4, ca.top + 14);
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
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { family: "'DM Sans',sans-serif", size: 12 },
              color: tickColor,
              filter: function(item, data) {
                return !data.datasets[item.datasetIndex].hideInLegend;
              }
            }
          },
          tooltip: {
            backgroundColor: '#ffffff',
            borderColor: gridColor,
            borderWidth: 1,
            titleColor: textPrimary,
            bodyColor: textPrimary,
            padding: 8,
            cornerRadius: 4,
            callbacks: {
              label: (function(fc) {
                return function(ctx) {
                  if (ctx.parsed.y == null) return null;
                  var ds = ctx.dataset;
                  if (ds.hideInLegend || ds._fcType === 'ci') return null;
                  var meta = FC_METRICS.find(function(m){ return m.key === ds._fcMetricKey; });
                  if (!meta) return null;
                  var val    = fcFmt(ctx.parsed.y, meta.fmt);
                  var rowIdx = ctx.dataIndex;
                  if (rowIdx <= todayIdx) {
                    return ' ' + meta.label + ': ' + val + ' (Historical)';
                  }
                  var fRow   = fc[rowIdx - todayIdx - 1];
                  var suffix = '';
                  if (fRow) {
                    var loV = fRow[meta.key + 'Lo'], hiV = fRow[meta.key + 'Hi'];
                    if (loV != null) suffix = ' (range: ' + fcFmt(loV, meta.fmt) + ' – ' + fcFmt(hiV, meta.fmt) + ')';
                  }
                  if (ds._fcType === 'scenario') {
                    var scName = ds.label.split(' — ')[1] || '';
                    return ' ' + meta.label + ' (' + scName + '): ' + val;
                  }
                  return ' ' + meta.label + ' (Forecast): ' + val + suffix;
                };
              }(forecast.slice()))
            }
          }
        },
        scales: {
          x: {
            ticks: { font: { family:"'DM Sans',sans-serif", size:11 }, color: tickColor, maxRotation:45, autoSkip:true, maxTicksLimit:14 },
            grid:  { color: gridColor }
          },
          yLeft: {
            type: 'linear', position: 'left',
            ticks: { font: { family:"'DM Sans',sans-serif", size:11 }, color: tickColor, callback: function(v){ return fcFmt(v,'currency'); } },
            grid:  { color: gridColor }
          },
          yRight: {
            type: 'linear', position: 'right',
            ticks: { font: { family:"'DM Sans',sans-serif", size:11 }, color: tickColor, callback: function(v){ return (v*100).toFixed(1)+'%'; } },
            grid:  { drawOnChartArea: false }
          }
        }
      }
    });

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
      if (_fcState.scenariosOn) {
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
    var el     = document.getElementById('fc-implied-rev');
    var noteEl = document.getElementById('fc-implied-rev-note');
    if (!el) return;
    var hasBudget = (_fcState.budgetGoogle > 0 || _fcState.budgetMsft > 0);
    if (!hasBudget) {
      el.value = '—';
      if (noteEl) noteEl.style.display = 'block';
      return;
    }
    if (noteEl) noteEl.style.display = 'none';
    var totalBudget = (_fcState.budgetGoogle + _fcState.budgetMsft) * 12;
    var cos = _fcState.targetCos / 100;
    var rev = cos > 0 ? totalBudget / cos : 0;
    el.value = '$' + Math.round(rev).toLocaleString();
  }

  // ── Scenario projected revenue colour (position-based) ────────────────────
  function fcScenarioRevColor(si, total) {
    if (total === 1) return 'var(--color-text-primary)';
    if (si === 0) return 'var(--color-text-warning)';            // Conservative
    if (si === total - 1) return 'var(--color-text-success)';    // Aggressive
    return 'var(--color-text-primary)';                          // Base / middle
  }

  // ── Scenarios list ─────────────────────────────────────────────────────────
  function fcRenderScenarios() {
    var list = document.getElementById('fc-scenarios-list');
    if (!list) return;
    var total = _fcState.scenarios.length;
    list.innerHTML = '';
    _fcState.scenarios.forEach(function(sc, si) {
      var rev = fcScenarioProjRev(sc);
      var revColor = fcScenarioRevColor(si, total);
      var row = document.createElement('div');
      row.className = 'fc-scenario-row';
      row.style.cssText = 'display:grid;grid-template-columns:140px 130px 100px 120px auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--color-border);';
      row.innerHTML =
        '<input class="fc-scenario-name" style="border:1px solid var(--color-border);border-radius:6px;padding:6px 10px;font-family:\'DM Sans\',sans-serif;font-size:13px;color:'+FC_SCENARIO_COLOURS[si]+';font-weight:500;" value="'+sc.name+'" data-sc="'+si+'" data-field="name">'+
        '<input class="fc-scenario-budget" style="border:1px solid var(--color-border);border-radius:6px;padding:6px 10px;font-family:\'DM Sans\',sans-serif;font-size:13px;" value="'+sc.budget+'" data-sc="'+si+'" data-field="budget" type="number">'+
        '<input class="fc-scenario-cos" style="border:1px solid var(--color-border);border-radius:6px;padding:6px 10px;font-family:\'DM Sans\',sans-serif;font-size:13px;" value="'+sc.cos+'" data-sc="'+si+'" data-field="cos" type="number">'+
        '<span data-sc-rev="'+si+'" style="font-size:13px;font-weight:600;font-family:\'DM Sans\',sans-serif;color:'+revColor+';">'+fcFmt(rev,'currency')+'</span>'+
        '<button style="background:none;border:none;cursor:pointer;color:var(--color-text-caption);font-size:16px;padding:0 4px;" data-remove-sc="'+si+'">×</button>';
      list.appendChild(row);
    });
    fcApplySectionToggleUI('scenarios', _fcState.scenariosOn);
  }

  // ── Seasonality grid (all 12 months) ──────────────────────────────────────
  function fcRenderSeasonMonths() {
    var el = document.getElementById('fc-season-months');
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i <= 11; i++) {
      var val = _fcState.seasonality[i] || 0;
      var div = document.createElement('div');
      div.className = fcSeasonCellClass(val);
      div.style.background = fcSeasonCellBg(val);
      div.innerHTML = '<label>' + MONTH_ABBRS[i] + '</label>' +
        '<div class="fc-season-input-row">' +
        '<input type="number" value="' + val + '" placeholder="0" data-season-month="' + i + '" style="flex:1;min-width:0;">' +
        '<span style="font-size:12px;color:var(--color-text-caption);flex-shrink:0;">%</span>' +
        '</div>';
      el.appendChild(div);
    }
    fcApplySectionToggleUI('seasonality', _fcState.seasonalityOn);
  }

  // ── Section toggle UI ──────────────────────────────────────────────────────
  function fcApplySectionToggleUI(section, on) {
    var isSc      = section === 'scenarios';
    var toggleId  = isSc ? 'fc-scenarios-toggle'       : 'fc-season-toggle';
    var labelId   = isSc ? 'fc-scenarios-toggle-label' : 'fc-season-toggle-label';
    var bannerId  = isSc ? 'fc-scenarios-off-banner'   : 'fc-season-off-banner';
    var contentId = isSc ? 'fc-scenarios-content'      : 'fc-season-months';

    var toggleEl  = document.getElementById(toggleId);
    var labelEl   = document.getElementById(labelId);
    var bannerEl  = document.getElementById(bannerId);
    var contentEl = document.getElementById(contentId);

    if (toggleEl)  { toggleEl.classList.toggle('on', on); toggleEl.setAttribute('aria-pressed', String(on)); }
    if (labelEl)   { labelEl.textContent = on ? 'On' : 'Off'; }
    if (bannerEl)  { bannerEl.style.display = on ? 'none' : 'flex'; }
    if (contentEl) { contentEl.classList.toggle('fc-section-off', !on); }
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

      // Section toggles (Scenarios / Seasonality)
      var togBtn = e.target.closest('[data-fc-toggle]');
      if (togBtn && !e.target.closest('#fc-advanced-toggle')) {
        var togSection = togBtn.getAttribute('data-fc-toggle');
        if (togSection === 'scenarios') {
          _fcState.scenariosOn = !_fcState.scenariosOn;
          fcApplySectionToggleUI('scenarios', _fcState.scenariosOn);
          fcRenderChart();
        } else if (togSection === 'seasonality') {
          _fcState.seasonalityOn = !_fcState.seasonalityOn;
          fcApplySectionToggleUI('seasonality', _fcState.seasonalityOn);
          fcRenderChart();
        }
        return;
      }

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

      // Edit mode
      if (e.target.closest('#fc-edit-btn')) {
        _fcState._prevBudgetGoogle = _fcState.budgetGoogle;
        _fcState._prevBudgetMsft   = _fcState.budgetMsft;
        _fcState._prevTargetCos    = _fcState.targetCos;
        fcSetEditMode(true); return;
      }
      if (e.target.closest('#fc-save-btn')) {
        _fcState.budgetGoogle = parseFloat(document.getElementById('fc-budget-google').value) || 0;
        _fcState.budgetMsft   = parseFloat(document.getElementById('fc-budget-msft').value)   || 0;
        _fcState.targetCos    = parseFloat(document.getElementById('fc-target-cos').value)    || 29;
        fcSetEditMode(false);
        fcUpdateBudgetWarnings();
        fcUpdateImpliedRev();
        if (_fcState.advancedOpen) fcRenderScenarios();
        fcRenderChart(); return;
      }
      if (e.target.closest('#fc-cancel-btn')) {
        _fcState.budgetGoogle = _fcState._prevBudgetGoogle;
        _fcState.budgetMsft   = _fcState._prevBudgetMsft;
        _fcState.targetCos    = _fcState._prevTargetCos;
        document.getElementById('fc-budget-google').value = _fcState.budgetGoogle || '';
        document.getElementById('fc-budget-msft').value   = _fcState.budgetMsft   || '';
        document.getElementById('fc-target-cos').value    = _fcState.targetCos;
        fcSetEditMode(false);
        fcUpdateBudgetWarnings();
        fcUpdateImpliedRev();
        fcRenderChart(); return;
      }

      // Reset
      if (e.target.closest('#fc-reset-btn')) {
        _fcState.budgetGoogle = FC_DEFAULTS.budgetGoogle;
        _fcState.budgetMsft   = FC_DEFAULTS.budgetMsft;
        _fcState.targetCos    = FC_DEFAULTS.targetCos;
        document.getElementById('fc-budget-google').value = FC_DEFAULTS.budgetGoogle;
        document.getElementById('fc-budget-msft').value   = FC_DEFAULTS.budgetMsft;
        document.getElementById('fc-target-cos').value    = FC_DEFAULTS.targetCos;
        fcUpdateBudgetWarnings(); fcUpdateImpliedRev(); fcRenderChart(); return;
      }

      // Reset seasonality
      if (e.target.closest('[data-fc-reset-season]')) {
        e.preventDefault();
        _fcState.seasonality = { 0:-8,1:-5,2:2,3:5,4:8,5:6,6:4,7:10,8:15,9:22,10:18,11:12 };
        fcRenderSeasonMonths(); fcRenderChart(); return;
      }

      // Header nav
      var navLink = e.target.closest('[data-nav]');
      if (navLink && e.target.closest('#forecasting-page')) {
        var nav = navLink.getAttribute('data-nav');
        var sbKid = document.querySelector('[data-nav="' + nav + '"].sb-kid');
        if (sbKid) sbKid.click();
      }
    });

    // Input changes — planning fields (only active when in edit mode, readonly otherwise)
    ['fc-budget-google','fc-budget-msft','fc-target-cos'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function() {
        _fcState.budgetGoogle = parseFloat(document.getElementById('fc-budget-google').value) || 0;
        _fcState.budgetMsft   = parseFloat(document.getElementById('fc-budget-msft').value)   || 0;
        _fcState.targetCos    = parseFloat(document.getElementById('fc-target-cos').value)    || 29;
        fcUpdateBudgetWarnings();
        fcUpdateImpliedRev();
        if (_fcState.advancedOpen) fcRenderScenarios();
        fcRenderChart();
      });
    });

    // Reactive input delegation — scenarios + seasonality
    document.addEventListener('input', function(e) {
      var page = document.getElementById('forecasting-page');
      if (!page || page.style.display === 'none') return;

      var scInput = e.target.closest('[data-sc][data-field]');
      if (scInput) {
        var si    = parseInt(scInput.getAttribute('data-sc'));
        var field = scInput.getAttribute('data-field');
        if (_fcState.scenarios[si]) {
          _fcState.scenarios[si][field] = field === 'name' ? scInput.value : parseFloat(scInput.value) || 0;
          if (field !== 'name') {
            var revEl = document.querySelector('[data-sc-rev="' + si + '"]');
            if (revEl) {
              var rev = fcScenarioProjRev(_fcState.scenarios[si]);
              revEl.textContent = fcFmt(rev, 'currency');
              revEl.style.color = fcScenarioRevColor(si, _fcState.scenarios.length);
            }
            fcRenderChart();
          }
        }
        return;
      }

      var seasonInput = e.target.closest('[data-season-month]');
      if (seasonInput) {
        var m = parseInt(seasonInput.getAttribute('data-season-month'));
        _fcState.seasonality[m] = parseFloat(seasonInput.value) || 0;
        var cell = seasonInput.closest('.fc-season-cell');
        if (cell) {
          cell.style.background = fcSeasonCellBg(_fcState.seasonality[m]);
          cell.className = fcSeasonCellClass(_fcState.seasonality[m]);
        }
        fcRenderChart(); return;
      }
    });

    // Info icon tooltips
    document.addEventListener('mouseover', function(e) {
      var page = document.getElementById('forecasting-page');
      if (!page || page.style.display === 'none') return;
      var tipEl   = e.target.closest('[data-fc-tip]');
      var tooltip = document.getElementById('fc-info-tooltip');
      if (!tooltip) return;
      if (tipEl) {
        tooltip.textContent = tipEl.getAttribute('data-fc-tip');
        tooltip.style.display = 'block';
        var rect = tipEl.getBoundingClientRect();
        var ttW = 288;
        tooltip.style.left = Math.min(rect.left, window.innerWidth - ttW - 8) + 'px';
        tooltip.style.top  = (rect.bottom + 6) + 'px';
      } else {
        tooltip.style.display = 'none';
      }
    });

    document.addEventListener('mouseout', function(e) {
      var page = document.getElementById('forecasting-page');
      if (!page || page.style.display === 'none') return;
      if (e.target.closest('[data-fc-tip]')) {
        var tooltip = document.getElementById('fc-info-tooltip');
        if (tooltip) tooltip.style.display = 'none';
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
    fcSetEditMode(false);       // ensure fields start readonly
    fcUpdateBudgetWarnings();
    fcUpdateImpliedRev();
    fcLoadChartJs(fcRenderChart);
  };

})();
