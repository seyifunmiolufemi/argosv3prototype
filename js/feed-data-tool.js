  function initShopifyModal() {
    if (sessionStorage.getItem('shopifyModalDismissed')) return;
    if (!sessionStorage.getItem('newAccountSetup')) return;
    sessionStorage.removeItem('newAccountSetup');
    var modal = document.getElementById('shopify-modal');
    if (!modal) return;
    // Only show when the dashboard screen is actually visible
    var attempts = 0;
    var poll = setInterval(function() {
      attempts++;
      if (attempts > 300) { clearInterval(poll); return; }
      var dash = document.getElementById('screen-dashboard');
      if (dash && getComputedStyle(dash).display !== 'none') {
        clearInterval(poll);
        setTimeout(function() {
          // Dynamically position tail to point at Settings group
          var settingsEl = document.getElementById('grp-settings');
          if (settingsEl) {
            var rect = settingsEl.getBoundingClientRect();
            var tailCenter = rect.top + rect.height / 2;
            modal.style.paddingTop = Math.max(8, tailCenter - 27) + 'px';
          }
          modal.style.display = 'flex';
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              modal.style.opacity = '1';
              modal.querySelector('.modal-box').style.transform = 'translateX(0)';
            });
          });
        }, 600);
      }
    }, 200);
    function closeModal() {
      modal.style.opacity = '0';
      modal.querySelector('.modal-box').style.transform = 'translateX(-12px)';
      setTimeout(function() { modal.style.display = 'none'; }, 220);
      sessionStorage.setItem('shopifyModalDismissed', '1');
    }
    document.getElementById('shopify-modal-skip').addEventListener('click', closeModal);
    document.getElementById('shopify-modal-connect').addEventListener('click', function() {
      closeModal();
      setTimeout(function() {
        document.querySelectorAll('.sb-kids').forEach(function(k) { k.classList.remove('sb-kids-open'); });
        document.querySelectorAll('.sb-group-hdr').forEach(function(h) {
          h.classList.remove('sb-hdr-active');
          var c = h.querySelector('.sb-chev');
          if (c) c.classList.remove('sb-chev-open');
        });
        var settingsKids = document.getElementById('kids-settings');
        var settingsHdr = document.querySelector('[data-grp="settings"]');
        if (settingsKids && settingsHdr) {
          settingsKids.classList.add('sb-kids-open');
          settingsHdr.classList.add('sb-hdr-active');
          var chev = settingsHdr.querySelector('.sb-chev');
          if (chev) chev.classList.add('sb-chev-open');
          document.querySelectorAll('.sb-kid').forEach(function(k) { k.classList.remove('sb-kid-active'); });
          var intItem = document.querySelector('[data-nav="integrations"]');
          if (intItem) intItem.classList.add('sb-kid-active');
        }
        if (typeof window.showIntegrationsPage === 'function') window.showIntegrationsPage();
      }, 250);
    });
  }
/* ══════════════════════════════════════════
   FIX EXTENSIONS (Fixes 1–9)
══════════════════════════════════════════ */

/* ── close all custom dropdown panels on outside click ── */
document.addEventListener('click', function(e) {
  if (!e.target.closest('[id$="-wrap"]') && !e.target.closest('.custom-dd-panel') &&
      !e.target.closest('#tf-filter-btn') && !e.target.closest('#tf-filter-panel') &&
      !e.target.closest('[id^="lf-"]')) {
    document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
  }
});

/* ── Data View panel toggles ── */
var _dvOpenPanel = null;
window.toggleDvPanel = function(which) {
  var panel = document.getElementById('dv-' + which + '-panel');
  if (!panel) return;
  var isOpen = panel.classList.contains('open');
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
  if (!isOpen) panel.classList.add('open');
};
window.setDvView = function(val) {
  document.getElementById('dv-view-label').textContent = 'View: ' + val;
  document.querySelectorAll('#dv-view-panel .custom-dd-item').forEach(function(el){ el.classList.toggle('active', el.textContent===val); });
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
};
window.setDvOp = function(val) {
  document.getElementById('dv-op-label').textContent = val;
  document.querySelectorAll('#dv-op-panel .custom-dd-item').forEach(function(el){ el.classList.toggle('active', el.textContent===val); });
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
};
window.dvToggleAllFields = function(cb) {
  document.querySelectorAll('.dv-field-cb').forEach(function(c){ c.checked = cb.checked; });
};
window.dvToggleAllCols = function(cb) {
  document.querySelectorAll('.dv-col-toggle').forEach(function(c){ c.checked = cb.checked; c.dispatchEvent(new Event('change')); });
};
window.dvFilterColPanel = function(q) {
  document.querySelectorAll('.dv-col-row').forEach(function(row){
    row.style.display = row.getAttribute('data-col-name').includes(q.toLowerCase()) ? '' : 'none';
  });
};

/* column visibility */
document.addEventListener('change', function(e) {
  var cb = e.target;
  if (!cb.classList.contains('dv-col-toggle')) return;
  var idx = parseInt(cb.getAttribute('data-col-index'), 10);
  var table = document.getElementById('dv-table');
  if (!table) return;
  var cols = table.querySelectorAll('colgroup col');
  var ths = table.querySelectorAll('thead th');
  var tds = table.querySelectorAll('tbody td:nth-child(' + (idx+1) + ')');
  var vis = cb.checked;
  if (cols[idx]) cols[idx].style.display = vis ? '' : 'none';
  if (ths[idx]) ths[idx].style.display = vis ? '' : 'none';
  table.querySelectorAll('tbody tr').forEach(function(tr){
    var td = tr.querySelectorAll('td')[idx];
    if (td) td.style.display = vis ? '' : 'none';
  });
});

/* ── Data View search ── */
window.dvSearch = function() {
  var q = (document.getElementById('dv-keyword') ? document.getElementById('dv-keyword').value : '').toLowerCase().trim();
  var rows = document.querySelectorAll('#dv-tbody tr:not(#dv-no-results)');
  var any = false;
  rows.forEach(function(tr) {
    var data = (tr.getAttribute('data-search') || '').toLowerCase();
    var show = !q || data.includes(q);
    tr.style.display = show ? '' : 'none';
    if (show) any = true;
  });
  var nr = document.getElementById('dv-no-results');
  if (nr) nr.style.display = (!any && q) ? '' : 'none';
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
};

/* ── Data View download ── */
var DV_ROWS = [
  ['1','MVBSUT','Molten MVB Set Suitcase','$49.95','$44.95','Molten','In Stock','New','Volleyball > Bags and Backpacks','Sporting Goods > Team Sports > Volleyball','MVBSUT-GRP','Blue/White','Molten ball bag','https://allvolleyball.com/mvbsut'],
  ['2','TVB-BLU','Tachikara TVB Set Suitcase','$34.99','','Tachikara','In Stock','New','Volleyball > Bags > Bat Suitcases','Sporting Goods > Team Sports > Volleyball','TVB-BLU-GRP','Blue','Tachikara ball bag','https://allvolleyball.com/tvb-blu'],
  ['3','BLCKBLSTR','Block Blaster Training Aid','$89.00','$79.00','Tandem Sport','Out of Stock','New','Volleyball > Training Equipment','Sporting Goods > Team Sports > Volleyball','BLCK-GRP','Black','Training aid','https://allvolleyball.com/blckblstr'],
  ['4','BUMBLCK','Bumper Blocker','$24.95','','Tandem Sport','In Stock','New','Volleyball > Training Equipment','Sporting Goods > Team Sports > Volleyball','BUMBLCK-GRP','Yellow','Blocker trainer','https://allvolleyball.com/bumblck'],
  ['5','BLZ4000','Coaches Spike Set Stand','$149.99','$129.99','Blitzter','In Stock','New','Volleyball > Training Equipment','Sporting Goods > Team Sports > Volleyball','BLZ4000-GRP','Red','Spike stand','https://allvolleyball.com/blz4000'],
  ['6','FNGRSUP','Finger Supports 10-Pack','$12.99','$9.99','Mikasa','In Stock','New','Volleyball > Accessories > Finger Protection','Sporting Goods > Team Sports > Volleyball','FNGRSUP-GRP','White','Finger supports','https://allvolleyball.com/fngrsup'],
  ['7','NETXT','Net Extender Training Aid','$39.95','','Tandem Sport','Out of Stock','New','Volleyball > Training Equipment','Sporting Goods > Team Sports > Volleyball','NETXT-GRP','Black','Net extender','https://allvolleyball.com/netxt'],
  ['8','PASSCHR','Pass Catcher Target','$19.99','$17.99','Tandem Sport','In Stock','New','Volleyball > Coaching Equipment','Sporting Goods > Team Sports > Volleyball','PASSCHR-GRP','Orange','Pass catcher','https://allvolleyball.com/passchr'],
  ['9','SPIKCHGR','Spike Challenger Pro','$64.95','$54.95','Tandem Sport','In Stock','New','Volleyball > Spiking Equipment','Sporting Goods > Team Sports > Volleyball','SPIKCHGR-GRP','Green','Spike trainer','https://allvolleyball.com/spikchgr']
];
var DV_HEADERS = ['#','id','title','price','sale_price','brand','availability','condition','product_type','google_product_category','item_group_id','color','description','link'];
window.dvDownloadAll = function() {
  var csv = DV_HEADERS.join(',') + '\n' + DV_ROWS.map(function(r){ return r.map(function(c){ return '"'+c+'"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data-view.csv'; a.click();
};
window.dvDownloadCol = function(colName) {
  var idx = DV_HEADERS.indexOf(colName);
  if (idx < 0) return;
  var csv = colName + '\n' + DV_ROWS.map(function(r){ return '"' + (r[idx]||'') + '"'; }).join('\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = colName + '.csv'; a.click();
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
};

/* ── Transformers ── */
window.toggleTransformerRow = function(cb) {
  var tr = cb.closest('tr');
  if (!tr) return;
  tr.classList.toggle('transformer-row--inactive', !cb.checked);
};
window.moveTransformerRow = function(btn, dir) {
  var tr = btn.closest('tr');
  var tbody = tr.parentNode;
  if (dir === -1 && tr.previousElementSibling) tbody.insertBefore(tr, tr.previousElementSibling);
  else if (dir === 1 && tr.nextElementSibling) tbody.insertBefore(tr.nextElementSibling, tr);
};
window.updateTfCount = function() {
  var rows = document.querySelectorAll('#tf-tbody tr');
  var active = document.querySelectorAll('#tf-tbody tr input:checked').length;
  var el = document.getElementById('tf-count');
  if (el) el.textContent = rows.length + ' transformers · ' + active + ' active';
};
window.toggleTfFilterPanel = function() {
  var panel = document.getElementById('tf-filter-panel');
  if (!panel) return;
  var isOpen = panel.classList.contains('open');
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
  if (!isOpen) panel.classList.add('open');
};
window.filterTransformerByField = function(field) {
  document.getElementById('tf-filter-label').textContent = field || 'All Fields';
  document.querySelectorAll('#tf-tbody tr').forEach(function(tr){
    var ifField = tr.getAttribute('data-if') || '';
    tr.style.display = (!field || ifField === field) ? '' : 'none';
  });
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
};
window.submitAddTransformer = function() {
  var ifField = document.getElementById('tf-modal-if-field') ? document.getElementById('tf-modal-if-field').value : 'title';
  var ifOp    = document.getElementById('tf-modal-if-op') ? document.getElementById('tf-modal-if-op').value : 'contains';
  var ifVal   = document.getElementById('tf-modal-if-val') ? document.getElementById('tf-modal-if-val').value.trim() : '';
  var thenField = document.getElementById('tf-modal-then-field') ? document.getElementById('tf-modal-then-field').value : 'title';
  var thenAction = document.getElementById('tf-modal-then-action') ? document.getElementById('tf-modal-then-action').value : 'Set to';
  var thenVal = document.getElementById('tf-modal-then-val') ? document.getElementById('tf-modal-then-val').value.trim() : '';
  if (!ifVal && ifOp !== 'is empty' && ifOp !== 'is not empty') { showToast('Please enter a condition value'); return; }
  var tbody = document.getElementById('tf-tbody');
  if (tbody) {
    var tr = document.createElement('tr');
    tr.setAttribute('data-if', ifField);
    tr.innerHTML = '<td><label class="toggle-switch"><input type="checkbox" checked onchange="toggleTransformerRow(this)"><span class="toggle-slider"></span></label></td>'
      + '<td><span class="chip-if">IF</span><span class="chip-field">[' + ifField + ']</span> <span style="font-size:13px;color:var(--color-text-caption);">' + ifOp + '</span> <span class="chip-value">"' + ifVal + '"</span></td>'
      + '<td><span class="chip-then">THEN</span><span style="font-size:13px;color:var(--color-text-caption);">set</span> <span class="chip-field">[' + thenField + ']</span> <span style="font-size:13px;color:var(--color-text-caption);">to</span> <span class="chip-value">"' + thenVal + '"</span></td>'
      + '<td style="font-size:12px;color:var(--color-text-caption);">All Exports</td>'
      + '<td><button class="btn-outline" style="height:26px;padding:0 8px;font-size:12px;margin-right:2px;" onclick="moveTransformerRow(this,-1)">∧</button><button class="btn-outline" style="height:26px;padding:0 8px;font-size:12px;" onclick="moveTransformerRow(this,1)">∨</button></td>'
      + '<td><div class="feed-action-wrap"><button class="feed-action-btn">⋮</button><div class="feed-action-menu"><div class="dd-item">Edit</div><div class="dd-item danger" onclick="this.closest(\'tr\').remove();updateTfCount()">Delete</div></div></div></td>';
    tbody.insertBefore(tr, tbody.firstChild);
  }
  closeAddTransformerModal();
  updateTfCount();
  showToast('Transformer added');
};

/* ── Logs filters ── */
var _logFilters = {name:'', op:'', status:''};
window.toggleLogFilter = function(which) {
  var panel = document.getElementById('lf-' + which + '-panel');
  if (!panel) return;
  var isOpen = panel.classList.contains('open');
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
  if (!isOpen) panel.classList.add('open');
};
window.setLogFilter = function(type, val, label) {
  _logFilters[type] = val;
  var lbl = {name:'lf-name-label', op:'lf-op-label', status:'lf-status-label'}[type];
  var labelEl = document.getElementById(lbl);
  if (labelEl) labelEl.textContent = label;
  document.querySelectorAll('.custom-dd-panel.open').forEach(function(p){ p.classList.remove('open'); });
  filterLogs();
};
window.filterLogs = function() {
  var fromVal = document.getElementById('lf-from') ? document.getElementById('lf-from').value : '';
  var toVal   = document.getElementById('lf-to')   ? document.getElementById('lf-to').value   : '';
  document.querySelectorAll('#db-tab-logs .feed-table tbody tr:not(.log-sub-row)').forEach(function(tr){
    var n = tr.getAttribute('data-log-name') || '';
    var o = tr.getAttribute('data-log-op') || '';
    var s = tr.getAttribute('data-log-status') || '';
    var d = tr.getAttribute('data-log-date') || '';
    var pass = true;
    if (_logFilters.name && n !== _logFilters.name) pass = false;
    if (_logFilters.op   && o !== _logFilters.op)   pass = false;
    if (_logFilters.status && s !== _logFilters.status) pass = false;
    if (fromVal && d < fromVal) pass = false;
    if (toVal   && d > toVal)   pass = false;
    tr.style.display = pass ? '' : 'none';
  });
};

  initShopifyModal();
})();

/* ══════════════════════════════════════════
   FEED DATA TOOL — EXTENDED SCREENS
══════════════════════════════════════════ */
(function() {

  var FEED_FIELDS = ['id','title','description','link','image_link','additional_image_link',
    'price','sale_price','brand','condition','availability','product_type',
    'google_product_category','mpn','gtin','item_group_id','color','size','material',
    'gender','age_group','shipping','tax',
    'custom_label_0','custom_label_1','custom_label_2','custom_label_3','custom_label_4'];

  /* ── Autocomplete ── */
  function initAutocompletes() {
    document.querySelectorAll('.autocomplete-input').forEach(function(input) {
      if (input._acInited) return;
      input._acInited = true;
      var wrapper = input.closest('.autocomplete-wrapper');
      if (!wrapper) return;
      var dd = wrapper.querySelector('.autocomplete-dropdown');
      if (!dd) return;
      function positionDd() {
        var rect = input.getBoundingClientRect();
        dd.style.top = (rect.bottom + 2) + 'px';
        dd.style.left = rect.left + 'px';
        dd.style.width = rect.width + 'px';
      }
      function render(val) {
        var q = (val || '').toLowerCase();
        var filtered = FEED_FIELDS.filter(function(f){ return !q || f.includes(q); });
        dd.innerHTML = filtered.map(function(f){ return '<li onmousedown="window.pickAC(this)">' + f + '</li>'; }).join('');
        positionDd();
        dd.style.display = filtered.length ? 'block' : 'none';
      }
      input.addEventListener('focus', function(){ positionDd(); render(input.value); });
      input.addEventListener('input', function(){ positionDd(); render(input.value); });
      input.addEventListener('blur', function(){ setTimeout(function(){ dd.style.display='none'; }, 160); });
    });
  }
  window.pickAC = function(li) {
    var input = li.closest('.autocomplete-wrapper').querySelector('.autocomplete-input');
    if (input) { input.value = li.textContent; }
    li.closest('.autocomplete-dropdown').style.display = 'none';
  };

  /* ── Field Mapping Page ── */
  window.showFieldMappingPage = function() {
    document.querySelectorAll('#page-content > div[id$="-page"], #page-content > div[id="ic-list"], #page-content > div[id="ic-detail"]').forEach(function(p){ p.style.display='none'; });
    ['db-overview-page','add-import-page','configure-import-page','add-export-page','row-detail-page','feed-data-page'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.style.display='none';
    });
    var p = document.getElementById('field-mapping-page');
    if (p) p.style.display = 'block';
    window.scrollTo(0,0);
    setTimeout(initAutocompletes, 60);
  };
  window.hideFieldMappingPage = function() {
    var p = document.getElementById('field-mapping-page'); if (p) p.style.display='none';
  };

  /* ── Row Detail Page ── */
  window.showRowDetailPage = function(idx) {
    var page = document.getElementById('row-detail-page');
    if (!page) return;
    var dbp = document.getElementById('db-overview-page');
    if (dbp) dbp.style.display = 'none';
    page.style.display = 'block';
    window.scrollTo(0,0);
  };
  window.hideRowDetailPage = function() {
    var p = document.getElementById('row-detail-page'); if (p) p.style.display='none';
    var dbp = document.getElementById('db-overview-page');
    if (dbp) dbp.style.display = 'block';
    if (typeof switchDbTab === 'function') switchDbTab('dataview');
  };

  /* ── Add Export Page ── */
  var exportWizardStep = 1;
  window.showAddExportPage = function() {
    ['db-overview-page','add-import-page','configure-import-page','field-mapping-page','row-detail-page'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.style.display='none';
    });
    var p = document.getElementById('add-export-page');
    if (p) p.style.display = 'block';
    window.goExportStepDirect(1);
    window.scrollTo(0,0);
    setTimeout(initAutocompletes, 60);
  };
  window.hideAddExportPage = function() {
    var p = document.getElementById('add-export-page'); if (p) p.style.display='none';
  };
  window.goExportStepDirect = function(n) {
    exportWizardStep = n;
    document.querySelectorAll('#add-export-page .wizard-step').forEach(function(s){ s.style.display='none'; s.classList.remove('active'); });
    var step = document.getElementById('export-step-' + n);
    if (step) { step.style.display='block'; step.classList.add('active'); }
    document.querySelectorAll('#export-wizard-tabs-bar .detail-tab').forEach(function(t,i){ t.classList.toggle('active', i===n-1); });
  };
  window.goExportStep = function(n) {
    if (n > exportWizardStep) {
      var nameEl = document.getElementById('export-name-input');
      if (exportWizardStep===1 && nameEl && !nameEl.value.trim()) {
        window.showToast('Please enter an export name'); return;
      }
    }
    window.goExportStepDirect(n);
  };
  window.createExport = function() {
    var nameEl = document.getElementById('export-name-input');
    var name = (nameEl && nameEl.value.trim()) || 'New Export';
    var tbody = document.getElementById('exports-tbody');
    if (tbody) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label></td>'
        + '<td>' + name + '</td>'
        + '<td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#346ed9;margin-right:6px;vertical-align:middle;"></span>Custom</td>'
        + '<td>Every 6 hours</td><td>—</td>'
        + '<td><button class="feed-action-btn" style="font-size:16px;">⋯</button></td>';
      tbody.appendChild(tr);
    }
    window.hideAddExportPage();
    if (typeof window.showDbOverviewPage === 'function') window.showDbOverviewPage();
    if (typeof window.switchDbTab === 'function') window.switchDbTab('exports');
    window.showToast('Export created successfully');
  };

  /* Export wizard tab clicks */
  document.addEventListener('click', function(e) {
    var tab = e.target.closest('#export-wizard-tabs-bar .detail-tab');
    if (!tab) return;
    var n = parseInt(tab.getAttribute('data-exporttab'), 10);
    if (n && n <= exportWizardStep + 1) window.goExportStep(n);
  });

  /* ── Transformer Modals ── */
  window.openAddTransformerModal = function() {
    var m = document.getElementById('add-transformer-modal'); if (m) m.style.display='flex';
  };
  window.closeAddTransformerModal = function() {
    var m = document.getElementById('add-transformer-modal'); if (m) m.style.display='none';
  };
  window.openFieldExecOrderModal = function() {
    var m = document.getElementById('field-exec-order-modal'); if (m) m.style.display='flex';
    setTimeout(initAutocompletes, 60);
  };
  window.closeFieldExecOrderModal = function() {
    var m = document.getElementById('field-exec-order-modal'); if (m) m.style.display='none';
  };

  /* ── Drag-and-drop for Field Execution Order ── */
  var dragSrcRow = null;
  window.execOrderDragStart = function(e, row) {
    dragSrcRow = row;
    e.dataTransfer.effectAllowed = 'move';
  };
  window.execOrderDragOver = function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  window.execOrderDrop = function(e, row) {
    e.preventDefault();
    if (!dragSrcRow || dragSrcRow === row) return;
    var tbody = row.parentNode;
    var rows = Array.from(tbody.querySelectorAll('tr'));
    var si = rows.indexOf(dragSrcRow);
    var ti = rows.indexOf(row);
    if (si < ti) tbody.insertBefore(dragSrcRow, row.nextSibling);
    else tbody.insertBefore(dragSrcRow, row);
    Array.from(tbody.querySelectorAll('tr')).forEach(function(r,i){
      var cell = r.querySelector('.exec-order-num');
      if (cell) cell.textContent = i;
    });
  };

  /* ── Logs expand ── */
  var logExpanded = false;
  window.toggleLogExpand = function() {
    logExpanded = !logExpanded;
    document.querySelectorAll('.log-sub-row').forEach(function(r){
      r.style.display = logExpanded ? 'table-row' : 'none';
    });
    var btn = document.getElementById('log-expand-btn');
    if (btn) btn.textContent = logExpanded ? '∧' : '∨';
  };

  /* ── Source-aware wizard ── */
  window.showWizardStep2ForSource = function(src) {
    var s = src || (typeof importSource !== 'undefined' ? importSource : 'Shopify');
    var shopify = document.getElementById('wizard-step2-shopify');
    var csv = document.getElementById('wizard-step2-csv');
    var sftp = document.getElementById('wizard-step2-sftp');
    if (shopify) shopify.style.display = s==='Shopify' ? 'block' : 'none';
    if (csv) csv.style.display = s==='CSV' ? 'block' : 'none';
    if (sftp) sftp.style.display = s==='SFTP' ? 'block' : 'none';
    var fa = document.getElementById('wizard-step5-file-actions');
    if (fa) fa.style.display = s==='CSV' ? 'block' : 'none';
    var platform = document.getElementById('wizard-step1-sftp-platform');
    if (platform) platform.style.display = s==='SFTP' ? 'block' : 'none';
  };

  /* ── CSV param add ── */
  window.addCsvParam = function() {
    var tbody = document.getElementById('csv-params-tbody');
    if (!tbody) return;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td style="padding:0 8px 6px 0;"><input type="text" class="modal-input" placeholder="e.g. username" style="padding:6px 9px;font-size:13px;"></td>'
      + '<td style="padding:0 8px 6px 0;"><input type="text" class="modal-input" placeholder="e.g. mypassword" style="padding:6px 9px;font-size:13px;"></td>'
      + '<td><button onclick="this.closest(\'tr\').remove()" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;padding:0;">🗑</button></td>';
    tbody.appendChild(tr);
  };

  /* ── Patch showFeedDataPage to hide new pages ── */
  var _origShowFeed = window.showFeedDataPage;
  if (_origShowFeed) {
    window.showFeedDataPage = function() {
      ['field-mapping-page','row-detail-page','add-export-page'].forEach(function(id){
        var el = document.getElementById(id); if (el) el.style.display='none';
      });
      _origShowFeed();
    };
  }

  /* ── Patch showConfigureImportPage to call showWizardStep2ForSource ── */
  var _origShowCfg = window.showConfigureImportPage;
  if (_origShowCfg) {
    window.showConfigureImportPage = function(src, type) {
      _origShowCfg(src, type);
      window.showWizardStep2ForSource(src || (typeof importSource !== 'undefined' ? importSource : 'Shopify'));
    };
  }

  /* ── Wire Field Mapping button in Imports tab ── */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action="field-mapping"]');
    if (btn) { window.showFieldMappingPage(); }
  });

