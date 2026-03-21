(function() {
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

  /* ══════════════════════════════════════════════════
     PERMISSION MANAGER
  ══════════════════════════════════════════════════ */

  var PM_USERS = [
    { id:1,  name:'Mike Jelley',              email:'mike@statbid.com',           role:'Admin',   lastActive:'3/18/2026', sessions:1 },
    { id:2,  name:'Suraj Sintala',            email:'ssintala@windsorplywood.com', role:'Client',  lastActive:'3/17/2026', sessions:1 },
    { id:3,  name:'Ruben Guzman',             email:'ruben@statbid.com',          role:'Admin',   lastActive:'3/17/2026', sessions:3 },
    { id:4,  name:'Amy Sams',                 email:'amy@statbid.com',            role:'Analyst', lastActive:'3/17/2026', sessions:1 },
    { id:5,  name:'Theresa G',                email:'theresa@statbid.com',        role:'Admin',   lastActive:'3/17/2026', sessions:2 },
    { id:6,  name:'Aalishan Jami',            email:'aalishan@statbid.com',       role:'Analyst', lastActive:'3/16/2026', sessions:3 },
    { id:7,  name:'Shilo Jones',              email:'shilo@statbid.com',          role:'Admin',   lastActive:'3/16/2026', sessions:1 },
    { id:8,  name:'Seyifunmi Olufemi',        email:'seyifunmi@statbid.com',      role:'Client',  lastActive:'3/16/2026', sessions:1 },
    { id:9,  name:'Arman Ali',                email:'arman@statbid.com',          role:'Analyst', lastActive:'3/14/2026', sessions:1 },
    { id:10, name:'Andrew Flicker',           email:'andrew@statbid.com',         role:'Analyst', lastActive:'3/12/2026', sessions:1 },
    { id:11, name:'Mariel Dianne Caguimbal',  email:'mariel@statbid.com',         role:'Admin',   lastActive:null, sessions:0 },
    { id:12, name:'Roy Steves',               email:'roy@poolaroo.com',           role:'Client',  lastActive:null, sessions:0 },
    { id:13, name:'Efthymios Kasvikis',       email:'efthymios@statbid.com',      role:'Admin',   lastActive:null, sessions:0 },
    { id:14, name:'Marlyn',                   email:'marlyn@statbid.com',         role:'Admin',   lastActive:null, sessions:0 },
    { id:15, name:'Jeff McRitchie',           email:'jeff@statbid.com',           role:'Admin',   lastActive:null, sessions:0 },
    { id:16, name:'Kayley King',              email:'kayley@statbid.com',         role:'Analyst', lastActive:null, sessions:0 },
    { id:17, name:'Kent Escala',              email:'kent@statbid.com',           role:'Admin',   lastActive:null, sessions:0 },
    { id:18, name:'Corey Hartford',           email:'corey@statbid.com',          role:'Admin',   lastActive:null, sessions:0 },
    { id:19, name:'Tom Barr',                 email:'tom@statbid.com',            role:'Analyst', lastActive:null, sessions:0 },
    { id:20, name:'Dieter Davis',             email:'dieter@poolaroo.com',        role:'Client',  lastActive:null, sessions:0 },
    { id:21, name:'Stephen Mahlum',           email:'stephen@statbid.com',        role:'Admin',   lastActive:null, sessions:0 },
    { id:22, name:'Daphne Mae Tagama',        email:'daphne@statbid.com',         role:'Admin',   lastActive:null, sessions:0 },
    { id:23, name:'Shiny Apps',               email:'shiny@statbid.com',          role:'Client',  lastActive:null, sessions:0 }
  ];

  PM_USERS.forEach(function(u) {
    if (u.role !== 'Client') { u.clientAccess = 'all'; return; }
    if (u.email.includes('windsorplywood')) u.clientAccess = ['Windsor Plywood'];
    else if (u.email.includes('poolaroo'))  u.clientAccess = ['Poolaroo'];
    else u.clientAccess = [];
  });

  var PM_MODULES = ['Permission Manager','Client Management','Reports','Feed Quality Check','Search Term Grader','Test Designer','Task Manager','Alerts Management','Annotations','Page Level View'];

  var PM_PERM = {
    Admin:   {'Permission Manager':[1,1,1,1],'Client Management':[1,1,1,1],'Reports':[1,1,1,1],'Feed Quality Check':[1,1,1,1],'Search Term Grader':[1,1,1,1],'Test Designer':[1,1,1,1],'Task Manager':[1,1,1,1],'Alerts Management':[1,1,1,1],'Annotations':[1,1,1,1],'Page Level View':[1,1,1,1]},
    Analyst: {'Permission Manager':[1,0,0,0],'Client Management':[1,0,0,0],'Reports':[1,1,1,0],'Feed Quality Check':[1,1,1,0],'Search Term Grader':[1,1,1,0],'Test Designer':[1,1,1,0],'Task Manager':[1,1,1,0],'Alerts Management':[1,1,1,0],'Annotations':[1,1,1,0],'Page Level View':[1,1,1,0]},
    Client:  {'Permission Manager':[0,0,0,0],'Client Management':[0,0,0,0],'Reports':[1,0,0,0],'Feed Quality Check':[1,0,0,0],'Search Term Grader':[1,0,0,0],'Test Designer':[1,0,0,0],'Task Manager':[1,0,0,0],'Alerts Management':[1,0,0,0],'Annotations':[1,0,0,0],'Page Level View':[1,0,0,0]}
  };

  var _pmActiveUserId = null;
  var _pmModalMode = 'view';
  var _pmSelectedUsers = [];
  var _pmAssignRole = null;
  var _pmHasUnsaved = false;

  /* ── Helpers ── */
  function pmGetAvatarColor(name) {
    var palette = ['av-blue','av-green','av-amber','av-red','av-purple','av-cyan','av-pink'];
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0x7fffffff;
    return palette[h % palette.length];
  }
  function pmGetInitials(name) {
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
  function pmAvatar(name, size) {
    size = size || 26;
    var cls = pmGetAvatarColor(name);
    var fs = Math.floor(size * 0.38);
    return '<span class="avatar-circle ' + cls + '" style="width:' + size + 'px;height:' + size + 'px;font-size:' + fs + 'px;flex-shrink:0;">' + pmGetInitials(name) + '</span>';
  }
  function pmRelDate(dateStr) {
    if (!dateStr) return 'Never active';
    var parts = dateStr.split('/');
    var d = new Date(parseInt(parts[2]), parseInt(parts[0])-1, parseInt(parts[1]));
    var today = new Date(2026, 2, 18);
    var diff = Math.round((today - d) / 86400000);
    if (diff <= 0) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 30) return diff + ' days ago';
    return Math.round(diff/30) + ' months ago';
  }
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Page navigation ── */
  function showPermissionManagerPage() {
    ['ic-list','ic-detail','integrations-page','feed-data-page'].forEach(function(id) {
      var el = document.getElementById(id); if (el) el.style.display = 'none';
    });
    hideFeedDetailPages();
    var pm = document.getElementById('permission-manager-page');
    if (pm) pm.style.display = 'block';
    pmShowListView();
    window.scrollTo(0, 0);
  }
  window.showPermissionManagerPage = showPermissionManagerPage;

  /* ── List view ── */
  function pmShowListView() {
    document.getElementById('pm-list-view').style.display = 'block';
    document.getElementById('pm-assign-view').style.display = 'none';
    var si = document.getElementById('pm-search'); if (si) si.value = '';
    pmRenderList('');
  }
  window.pmSearch = function() { pmRenderList(document.getElementById('pm-search').value); };

  function pmRenderList(query) {
    var q = (query || '').toLowerCase();
    var tbody = document.getElementById('pm-users-tbody');
    if (!tbody) return;
    var filtered = PM_USERS.filter(function(u) {
      return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
    tbody.innerHTML = filtered.map(function(u) {
      var lastActive = pmRelDate(u.lastActive);
      return '<tr style="border-bottom:1px solid var(--color-border);">' +
        '<td style="padding:12px 16px;">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            pmAvatar(u.name) +
            '<div>' +
              '<div style="font-size:14px;font-weight:500;color:var(--color-text-primary);">' + escHtml(u.name) + '</div>' +
              '<div style="font-size:12px;color:var(--color-text-caption);">' + lastActive + '</div>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td style="padding:12px 16px;"><span class="pm-role-pill">' + u.role + '</span></td>' +
        '<td style="padding:12px 16px;">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            pmAvatar('Shilo Jones') +
            '<div>' +
              '<div style="font-size:13px;font-weight:500;color:var(--color-text-primary);">Shilo Jones</div>' +
              '<div style="font-size:11px;color:var(--color-text-caption);">2 days ago</div>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td style="padding:12px 16px;text-align:center;">' +
          '<button style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--color-text-caption);padding:2px 8px;border-radius:4px;line-height:1;" onclick="pmOpenActionMenu(' + u.id + ',this,event)">⋮</button>' +
        '</td>' +
      '</tr>';
    }).join('');
  }

  /* ── ⋮ Action menu ── */
  window.pmOpenActionMenu = function(uid, el, evt) {
    evt.stopPropagation();
    _pmActiveUserId = uid;
    var dd = document.getElementById('pm-action-dd');
    var rect = el.getBoundingClientRect();
    dd.style.top = (rect.bottom + 4) + 'px';
    dd.style.left = Math.max(8, rect.right - 168) + 'px';
    dd.style.display = 'block';
  };
  window.pmMenuAction = function(action) {
    document.getElementById('pm-action-dd').style.display = 'none';
    var uid = _pmActiveUserId;
    if (action === 'edit') pmOpenModal(uid, 'edit');
    else if (action === 'view') pmOpenModal(uid, 'view');
    else pmOpenModal(uid, 'clients');
  };

  /* ── Modal open/close ── */
  function pmOpenModal(uid, mode) {
    _pmActiveUserId = uid;
    _pmModalMode = mode;
    _pmHasUnsaved = false;
    document.getElementById('pm-unsaved-banner').style.display = 'none';
    var user = PM_USERS.find(function(u) { return u.id === uid; });
    if (!user) return;
    document.getElementById('pm-modal-username').textContent = user.name;
    document.getElementById('pm-modal-subtitle').textContent =
      mode === 'edit' ? 'Edit the roles for this user' : 'View the roles and permissions assigned to this user';
    var footer = document.getElementById('pm-modal-footer');
    footer.style.display = (mode === 'view') ? 'none' : 'flex';
    var saveBtn = document.getElementById('pm-modal-save');
    saveBtn.disabled = true;
    saveBtn.classList.add('pm-btn-disabled');
    pmSwitchModalTab(mode === 'clients' ? 'clients' : 'roles');
    pmRenderModalRoles(user, mode);
    if (mode === 'clients') pmRenderClientAccess(user);
    document.getElementById('pm-role-modal').style.display = 'flex';
  }
  window.pmSwitchModalTab = function(tab) {
    document.querySelectorAll('#pm-modal-tabs .detail-tab').forEach(function(t) { t.classList.remove('active'); });
    var activeTab = document.querySelector('#pm-modal-tabs [data-pmtab="' + tab + '"]');
    if (activeTab) activeTab.classList.add('active');
    document.getElementById('pm-modal-tab-roles').style.display = tab === 'roles' ? 'block' : 'none';
    document.getElementById('pm-modal-tab-clients').style.display = tab === 'clients' ? 'block' : 'none';
    var footer = document.getElementById('pm-modal-footer');
    if (_pmModalMode !== 'view') footer.style.display = 'flex';
    if (tab === 'clients' && _pmActiveUserId) {
      var user = PM_USERS.find(function(u) { return u.id === _pmActiveUserId; });
      if (user) pmRenderClientAccess(user);
    }
  };
  window.pmCloseModal = function() {
    if (_pmHasUnsaved) { document.getElementById('pm-unsaved-banner').style.display = 'block'; return; }
    document.getElementById('pm-role-modal').style.display = 'none';
  };
  window.pmModalOverlayClick = function(e) {
    if (e.target === document.getElementById('pm-role-modal')) window.pmCloseModal();
  };
  window.pmStayOnModal = function() { document.getElementById('pm-unsaved-banner').style.display = 'none'; };
  window.pmDiscardAndClose = function() {
    _pmHasUnsaved = false;
    document.getElementById('pm-unsaved-banner').style.display = 'none';
    document.getElementById('pm-role-modal').style.display = 'none';
  };

  /* ── Roles tab in modal ── */
  function pmRenderModalRoles(user, mode) {
    var editable = (mode === 'edit');
    document.getElementById('pm-modal-roles-cards').innerHTML = ['Admin','Analyst','Client'].map(function(role) {
      var sel = (user.role === role);
      return '<div class="pm-role-card' + (sel ? ' selected' : '') + (editable ? '' : ' readonly') + '" data-role="' + role + '"' +
        (editable ? ' onclick="pmModalSelectRole(\'' + role + '\')"' : '') + '>' +
        '<div class="pm-role-card-left"><div class="pm-role-radio"></div><span class="pm-role-name">' + role + '</span></div>' +
        '<span class="pm-view-perms" onclick="event.stopPropagation();pmShowPermTable(\'' + role + '\',this)">View permissions ⓘ</span>' +
      '</div>';
    }).join('');
  }
  window.pmModalSelectRole = function(role) {
    if (_pmModalMode !== 'edit') return;
    document.querySelectorAll('#pm-modal-roles-cards .pm-role-card').forEach(function(c) { c.classList.remove('selected'); });
    var card = document.querySelector('#pm-modal-roles-cards [data-role="' + role + '"]');
    if (card) card.classList.add('selected');
    var user = PM_USERS.find(function(u) { return u.id === _pmActiveUserId; });
    var changed = user && user.role !== role;
    var saveBtn = document.getElementById('pm-modal-save');
    saveBtn.disabled = !changed;
    if (changed) saveBtn.classList.remove('pm-btn-disabled'); else saveBtn.classList.add('pm-btn-disabled');
  };
  window.pmSaveModal = function() {
    var user = PM_USERS.find(function(u) { return u.id === _pmActiveUserId; });
    if (!user) return;
    if (_pmModalMode === 'edit') {
      var selected = document.querySelector('#pm-modal-roles-cards .pm-role-card.selected');
      if (selected) user.role = selected.getAttribute('data-role');
      showToast('Role updated for ' + user.name);
      _pmHasUnsaved = false;
      document.getElementById('pm-role-modal').style.display = 'none';
      pmRenderList(document.getElementById('pm-search').value);
    } else if (_pmModalMode === 'clients') {
      pmSaveClientAccess();
    }
  };

  /* ── Permission flyout ── */
  window.pmShowPermTable = function(role, el) {
    var flyout = document.getElementById('pm-perm-flyout');
    document.getElementById('pm-flyout-title').textContent = role + ' Permissions';
    var html = '<tr><th style="text-align:left;">Module</th><th>View</th><th>Edit</th><th>Create</th><th>Delete</th></tr>';
    html += PM_MODULES.map(function(mod) {
      var perms = PM_PERM[role] ? (PM_PERM[role][mod] || [0,0,0,0]) : [0,0,0,0];
      return '<tr><td>' + mod + '</td>' +
        perms.map(function(p) {
          return '<td>' + (p ? '<span class="pm-perm-check">✓</span>' : '<span class="pm-perm-cross">✗</span>') + '</td>';
        }).join('') + '</tr>';
    }).join('');
    document.getElementById('pm-flyout-table').innerHTML = html;
    var rect = el.getBoundingClientRect();
    flyout.style.top = (rect.bottom + 8) + 'px';
    flyout.style.left = Math.min(rect.left, window.innerWidth - 360) + 'px';
    flyout.style.display = 'block';
  };

  /* ── Client Access tab ── */
  function pmRenderClientAccess(user) {
    var allAccess = (user.clientAccess === 'all');
    var toggle = document.getElementById('pm-ca-all-toggle');
    toggle.checked = allAccess;
    document.getElementById('pm-ca-title').textContent = user.name;
    document.getElementById('pm-ca-client-section').style.display = allAccess ? 'none' : 'block';
    var access = allAccess ? [] : (user.clientAccess || []);
    document.getElementById('pm-ca-client-list').innerHTML = CLIENTS.map(function(c) {
      var checked = allAccess || access.indexOf(c.name) > -1;
      return '<label class="pm-client-row">' +
        '<input type="checkbox"' + (checked ? ' checked' : '') + ' onchange="pmClientCheckChange(this)" style="cursor:pointer;width:14px;height:14px;flex-shrink:0;">' +
        '<span>' + escHtml(c.name) + '</span>' +
      '</label>';
    }).join('');
  }
  window.pmToggleAllAccess = function(isAll) {
    _pmHasUnsaved = true;
    var saveBtn = document.getElementById('pm-modal-save');
    saveBtn.disabled = false; saveBtn.classList.remove('pm-btn-disabled');
    document.getElementById('pm-ca-client-section').style.display = isAll ? 'none' : 'block';
    if (!isAll) {
      document.getElementById('pm-ca-client-list').innerHTML = CLIENTS.map(function(c) {
        return '<label class="pm-client-row"><input type="checkbox" checked onchange="pmClientCheckChange(this)" style="cursor:pointer;width:14px;height:14px;flex-shrink:0;"><span>' + escHtml(c.name) + '</span></label>';
      }).join('');
    }
  };
  window.pmClientCheckChange = function(cb) {
    _pmHasUnsaved = true;
    var saveBtn = document.getElementById('pm-modal-save');
    saveBtn.disabled = false; saveBtn.classList.remove('pm-btn-disabled');
  };
  function pmSaveClientAccess() {
    var user = PM_USERS.find(function(u) { return u.id === _pmActiveUserId; });
    if (!user) return;
    var allToggle = document.getElementById('pm-ca-all-toggle');
    if (allToggle.checked) {
      user.clientAccess = 'all';
    } else {
      var checkboxes = document.querySelectorAll('#pm-ca-client-list input[type="checkbox"]');
      var selected = [];
      checkboxes.forEach(function(cb, i) { if (cb.checked && CLIENTS[i]) selected.push(CLIENTS[i].name); });
      user.clientAccess = selected;
    }
    _pmHasUnsaved = false;
    showToast(user.name + "'s Client Access updated");
    document.getElementById('pm-role-modal').style.display = 'none';
  }

  /* ── Assign Role view ── */
  window.pmShowAssignView = function() {
    document.getElementById('pm-list-view').style.display = 'none';
    document.getElementById('pm-assign-view').style.display = 'block';
    _pmSelectedUsers = []; _pmAssignRole = null;
    document.getElementById('pm-assign-search').value = '';
    document.getElementById('pm-assign-dd').classList.remove('open');
    pmRenderAssignChips();
    pmRenderAssignRoleCards();
    pmUpdateAssignBtn();
    window.scrollTo(0, 0);
  };
  window.pmBackToList = function() { pmShowListView(); };

  window.pmAssignSearch = function() {
    var q = document.getElementById('pm-assign-search').value.toLowerCase();
    var dd = document.getElementById('pm-assign-dd');
    if (!q) { dd.classList.remove('open'); return; }
    var matches = PM_USERS.filter(function(u) {
      return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
             _pmSelectedUsers.indexOf(u.id) === -1;
    });
    if (!matches.length) { dd.classList.remove('open'); return; }
    dd.innerHTML = matches.map(function(u) {
      return '<div class="pm-user-dd-row" onclick="pmAssignSelectUser(' + u.id + ')">' +
        pmAvatar(u.name, 24) +
        '<div><div class="pm-user-dd-name">' + escHtml(u.name) + '</div><div class="pm-user-dd-email">' + escHtml(u.email) + '</div></div>' +
      '</div>';
    }).join('');
    dd.classList.add('open');
  };
  window.pmAssignSelectUser = function(uid) {
    if (_pmSelectedUsers.indexOf(uid) === -1) _pmSelectedUsers.push(uid);
    document.getElementById('pm-assign-dd').classList.remove('open');
    document.getElementById('pm-assign-search').value = '';
    pmRenderAssignChips(); pmUpdateAssignBtn();
  };
  window.pmRemoveUserChip = function(uid) {
    _pmSelectedUsers = _pmSelectedUsers.filter(function(id) { return id !== uid; });
    pmRenderAssignChips(); pmUpdateAssignBtn();
  };
  function pmRenderAssignChips() {
    document.getElementById('pm-selected-chips').innerHTML = _pmSelectedUsers.map(function(uid) {
      var u = PM_USERS.find(function(x) { return x.id === uid; });
      if (!u) return '';
      return '<span class="pm-user-chip">' + pmAvatar(u.name, 20) + escHtml(u.name) +
        '<span class="pm-user-chip-x" onclick="pmRemoveUserChip(' + uid + ')">×</span></span>';
    }).join('');
  }
  window.pmSelectAssignRole = function(role) {
    _pmAssignRole = role; pmRenderAssignRoleCards(); pmUpdateAssignBtn();
  };
  function pmRenderAssignRoleCards() {
    var container = document.getElementById('pm-assign-roles');
    if (!container) return;
    container.innerHTML = ['Admin','Analyst','Client'].map(function(r) {
      var sel = (r === _pmAssignRole);
      return '<div class="pm-role-card' + (sel ? ' selected' : '') + '" data-role="' + r + '" onclick="pmSelectAssignRole(\'' + r + '\')">' +
        '<div class="pm-role-card-left"><div class="pm-role-radio"></div><span class="pm-role-name">' + r + '</span></div>' +
        '<span class="pm-view-perms" onclick="event.stopPropagation();pmShowPermTable(\'' + r + '\',this)">View permissions ⓘ</span>' +
      '</div>';
    }).join('');
  }
  function pmUpdateAssignBtn() {
    var btn = document.getElementById('pm-assign-submit');
    if (!btn) return;
    var ok = (_pmSelectedUsers.length > 0 && _pmAssignRole !== null);
    btn.disabled = !ok;
    if (ok) btn.classList.remove('pm-btn-disabled'); else btn.classList.add('pm-btn-disabled');
  }
  window.pmSubmitAssign = function() {
    if (!_pmSelectedUsers.length || !_pmAssignRole) return;
    _pmSelectedUsers.forEach(function(uid) {
      var u = PM_USERS.find(function(x) { return x.id === uid; }); if (u) u.role = _pmAssignRole;
    });
    var names = _pmSelectedUsers.map(function(uid) {
      var u = PM_USERS.find(function(x) { return x.id === uid; }); return u ? u.name : '';
    }).filter(Boolean);
    var msg = names.length === 1 ? 'Role assigned to ' + names[0] :
              names.length <= 3 ? names.length + ' roles assigned to ' + names.join(', ') :
              names.length + ' roles assigned to ' + names.slice(0,3).join(', ') + '...';
    showToast(msg);
    pmShowListView();
  };

  /* ── Outside-click cleanup ── */
  document.addEventListener('click', function(e) {
    var dd = document.getElementById('pm-action-dd');
    if (dd && !e.target.closest('#pm-action-dd') && !e.target.closest('button[onclick*="pmOpenActionMenu"]')) dd.style.display = 'none';
    var flyout = document.getElementById('pm-perm-flyout');
    if (flyout && !e.target.closest('#pm-perm-flyout') && !e.target.closest('.pm-view-perms')) flyout.style.display = 'none';
    var assignDd = document.getElementById('pm-assign-dd');
    if (assignDd && !e.target.closest('#pm-assign-dd') && !e.target.closest('#pm-assign-search')) assignDd.classList.remove('open');
  });

  /* ── Init ── */
  (function() { var t = document.getElementById('pm-users-tbody'); if (t) pmRenderList(''); })();

  /* ═══════════════════════════════════════════════
     ANNOTATIONS & ALERTS MANAGEMENT JS
  ═══════════════════════════════════════════════ */

  /* ── ANNOTATIONS DATA ── */
  var ANNOTATIONS_DATA = [
    { id:1, title:'Black Friday campaign launched', client:'MojoMotoSport', website:'MojoMotoSport', date:'Dec 4, 2025', endDate:null, notes:'Major sale event with 40% off sitewide. Expected traffic surge.', modifiedBy:'Shilo Jones', modifiedTime:'2 days ago' },
    { id:2, title:'Website redesign go-live', client:'Blossom Beauty', website:'Blossom Beauty', date:'Nov 18, 2025', endDate:null, notes:'New checkout flow launched. Monitor conversion rate closely.', modifiedBy:'Marcus Reid', modifiedTime:'5 days ago' },
    { id:3, title:'Google Ads budget increase', client:'Peak Performance', website:'Peak Performance', date:'Nov 10, 2025', endDate:null, notes:'Budget increased from $5k to $8k/mo for Q4.', modifiedBy:'Priya Nair', modifiedTime:'1 week ago' },
    { id:4, title:'Seasonal promotion — Winter Sale', client:'Coastal Living', website:'Coastal Living', date:'Dec 1, 2025', endDate:'Jan 5, 2026', notes:null, modifiedBy:'Devon Blake', modifiedTime:'3 days ago' },
    { id:5, title:'Tracking pixel reinstalled', client:'Urban Threads', website:'Urban Threads', date:'Oct 28, 2025', endDate:null, notes:'GA4 pixel had gone missing; reinstalled and verified firing.', modifiedBy:'Shilo Jones', modifiedTime:'3 weeks ago' },
    { id:6, title:'Meta Ads account paused', client:'Bright Minds', website:'Bright Minds', date:'Oct 15, 2025', endDate:'Nov 1, 2025', notes:'Paused due to creative fatigue. Resuming with new assets.', modifiedBy:'Marcus Reid', modifiedTime:'1 month ago' },
    { id:7, title:'Landing page A/B test started', client:'Terra Gardens', website:'Terra Gardens', date:'Nov 22, 2025', endDate:null, notes:'Testing two variants of the hero section.', modifiedBy:'Priya Nair', modifiedTime:'4 days ago' },
    { id:8, title:'Holiday email campaign launched', client:'Apex Fitness', website:'Apex Fitness', date:'Dec 2, 2025', endDate:null, notes:null, modifiedBy:'Devon Blake', modifiedTime:'2 days ago' },
    { id:9, title:'Site migration completed', client:'Silver Creek', website:'Silver Creek', date:'Sep 30, 2025', endDate:null, notes:'Migrated from Shopify to custom WooCommerce. Check all tags.', modifiedBy:'Shilo Jones', modifiedTime:'2 months ago' },
    { id:10, title:'CPC spike — investigating', client:'Harbor Light', website:'Harbor Light', date:'Dec 3, 2025', endDate:null, notes:'CPC jumped 40% overnight. Reviewing search terms and competitors.', modifiedBy:'Marcus Reid', modifiedTime:'1 day ago' }
  ];
  var _annNextId = 11;

  /* ── ALERTS DATA ── */
  var ALERTS_DATA = [
    { id:'1', name:'Budget Alert', dataSource:'Google Ads', scope:'All Clients', status:'Active', lastRun:'Dec 4, 2025 · 2:00 AM', lastTriggered:'Dec 4, 2025', modifiedBy:'Shilo Jones', modifiedTime:'2 days ago' },
    { id:'2', name:'COS Threshold Alert', dataSource:'Google Ads', scope:'MojoMotoSport', status:'Active', lastRun:'Dec 4, 2025 · 2:00 AM', lastTriggered:'Dec 2, 2025', modifiedBy:'Marcus Reid', modifiedTime:'1 week ago' },
    { id:'3', name:'Conversion Drop Alert', dataSource:'Meta Ads', scope:'All Clients', status:'Active', lastRun:'Dec 4, 2025 · 3:00 AM', lastTriggered:'Nov 30, 2025', modifiedBy:'Priya Nair', modifiedTime:'3 days ago' },
    { id:'4', name:'SEO Position Drop', dataSource:'Organic Search (SEO)', scope:'Blossom Beauty', status:'Active', lastRun:'Dec 3, 2025 · 1:00 AM', lastTriggered:'Nov 28, 2025', modifiedBy:'Devon Blake', modifiedTime:'4 days ago' },
    { id:'5', name:'ROAS Below Target', dataSource:'Google Ads', scope:'Peak Performance', status:'Draft', lastRun:null, lastTriggered:null, modifiedBy:'Shilo Jones', modifiedTime:'1 week ago' },
    { id:'6', name:'Impression Share Drop', dataSource:'Microsoft Ads', scope:'All Clients', status:'Active', lastRun:'Dec 4, 2025 · 4:00 AM', lastTriggered:'Dec 1, 2025', modifiedBy:'Marcus Reid', modifiedTime:'5 days ago' },
    { id:'7', name:'CPC Spike Alert', dataSource:'Google Ads', scope:'Harbor Light', status:'Active', lastRun:'Dec 4, 2025 · 2:00 AM', lastTriggered:'Dec 3, 2025', modifiedBy:'Priya Nair', modifiedTime:'1 day ago' },
    { id:'8', name:'CTR Below Benchmark', dataSource:'Meta Ads', scope:'All Clients', status:'Draft', lastRun:null, lastTriggered:null, modifiedBy:'Devon Blake', modifiedTime:'2 weeks ago' },
    { id:'9', name:'Weekly Performance Summary', dataSource:'Google Ads', scope:'All Clients', status:'Active', lastRun:'Dec 1, 2025 · 6:00 AM', lastTriggered:'Nov 24, 2025', modifiedBy:'Shilo Jones', modifiedTime:'1 week ago' }
  ];
  var _alertsNextId = 10;

  var ALERTS_DETAILS = {
    '1': {
      metrics:['COS','Clicks','Conversions'],
      conditions:[
        {metric:'COS',operator:'is greater than',threshold:'50',timeWindow:'7 days',logic:null},
        {metric:'Clicks',operator:'is less than',threshold:'500',timeWindow:'7 days',logic:'AND'}
      ],
      schedule:{frequency:'Daily'},
      notifications:{slackChannel:'#alerts-budget',slackDM:'Seyifunmi Olufemi'},
      activity:[
        {id:'a1',client:'MojoMotoSport',triggeredAt:'Dec 4, 2025 · 2:14 AM',condition:'COS is greater than 50 over 7 days — actual: 54.2%'},
        {id:'a2',client:'Peak Performance',triggeredAt:'Dec 2, 2025 · 2:08 AM',condition:'Clicks is less than 500 over 7 days — actual: 412'},
        {id:'a3',client:'Apex Fitness',triggeredAt:'Nov 30, 2025 · 2:11 AM',condition:'COS is greater than 50 over 7 days — actual: 51.8%'}
      ]
    },
    '2': {
      metrics:['COS'],
      conditions:[{metric:'COS',operator:'is greater than',threshold:'45',timeWindow:'7 days',logic:null}],
      schedule:{frequency:'Daily'},
      notifications:{slackDM:'Marcus Reid'},
      activity:[
        {id:'b1',client:'MojoMotoSport',triggeredAt:'Dec 2, 2025 · 2:05 AM',condition:'COS is greater than 45 over 7 days — actual: 47.1%'}
      ]
    },
    '3': { metrics:['Conversions','COS'], conditions:[{metric:'Conversions',operator:'decreases by',threshold:'20',timeWindow:'7 days',logic:null}], schedule:{frequency:'Daily'}, notifications:{slackChannel:'#alerts-performance'}, activity:[] },
    '4': { metrics:['Position'], conditions:[{metric:'Position',operator:'is greater than',threshold:'10',timeWindow:'7 days',logic:null}], schedule:{frequency:'Weekly'}, notifications:{slackDM:'Devon Blake'}, activity:[] },
    '5': { metrics:['ROAS'], conditions:[{metric:'ROAS',operator:'is less than',threshold:'3',timeWindow:'14 days',logic:null}], schedule:{frequency:'Daily'}, notifications:{}, activity:[] },
    '6': { metrics:['Impressions'], conditions:[{metric:'Impressions',operator:'decreases by',threshold:'25',timeWindow:'7 days',logic:null}], schedule:{frequency:'Daily'}, notifications:{slackChannel:'#team-paid-search'}, activity:[] },
    '7': { metrics:['CPC'], conditions:[{metric:'CPC',operator:'is greater than',threshold:'5',timeWindow:'3 days',logic:null}], schedule:{frequency:'Daily'}, notifications:{slackDM:'Priya Nair'}, activity:[
      {id:'c1',client:'Harbor Light',triggeredAt:'Dec 3, 2025 · 2:22 AM',condition:'CPC is greater than $5 over 3 days — actual: $6.40'}
    ]},
    '8': { metrics:['CTR'], conditions:[{metric:'CTR',operator:'is less than',threshold:'1',timeWindow:'7 days',logic:null}], schedule:{frequency:'Weekly'}, notifications:{}, activity:[] },
    '9': { metrics:['COS','Clicks','Conversions','ROAS'], conditions:[], schedule:{frequency:'Weekly'}, notifications:{slackChannel:'#alerts-general'}, activity:[] }
  };

  /* ── STATE ── */
  var _annActiveId = null;
  var _annEditMode = false;
  var _alertsActiveId = null;
  var _alertsEditMode = false;
  var _alertsConditions = [];
  var _alertsSelectedMetrics = [];
  var _alertsSelectedClients = [];
  var _alertsFormDirty = false;
  var _alertsDeleteId = null;
  var _alertsDuplicateId = null;
  var _alertsFilterDs = '';
  var _alertsFilterStatus = '';
  var _alertsFilterSearch = '';
  var _alertsCurrentMetricsList = [];

  /* ─────────────────────────────────────────
     ANNOTATIONS
  ───────────────────────────────────────── */
  function showAnnotationsPage() {
    ['ic-list','ic-detail','integrations-page','feed-data-page'].forEach(function(id){
      var el=document.getElementById(id); if(el) el.style.display='none';
    });
    hideFeedDetailPages();
    var p=document.getElementById('annotations-page'); if(p) p.style.display='block';
    annShowListView();
    window.scrollTo(0,0);
  }
  window.showAnnotationsPage = showAnnotationsPage;

  function annShowListView() {
    document.getElementById('ann-list-view').style.display='block';
    document.getElementById('ann-add-view').style.display='none';
    document.getElementById('ann-detail-view').style.display='none';
    var s=document.getElementById('ann-search'); if(s) s.value='';
    annRenderList('');
  }
  window.annShowListView = annShowListView;

  window.annSearch = function(){ annRenderList(document.getElementById('ann-search').value); };

  function annRenderList(query) {
    var q=(query||'').toLowerCase();
    var rows=ANNOTATIONS_DATA.filter(function(a){
      return !q||a.title.toLowerCase().indexOf(q)>-1||a.client.toLowerCase().indexOf(q)>-1||a.website.toLowerCase().indexOf(q)>-1;
    });
    var badge=document.getElementById('ann-count-badge'); if(badge) badge.textContent=ANNOTATIONS_DATA.length;
    var tbody=document.getElementById('ann-tbody'); if(!tbody) return;
    tbody.innerHTML=rows.map(function(a){
      return '<tr style="border-bottom:1px solid var(--color-border);">'+
        '<td style="padding:12px 16px;"><span style="font-size:14px;color:var(--color-blue);cursor:pointer;font-weight:500;" onclick="annShowDetail('+a.id+')">'+escHtml(a.title)+'</span></td>'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-text-primary);">'+escHtml(a.client)+'</td>'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-text-primary);">'+escHtml(a.website)+'</td>'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-text-primary);">'+escHtml(a.date)+'</td>'+
        '<td style="padding:12px 16px;">'+
          '<div style="display:flex;align-items:center;gap:8px;">'+
            pmAvatar(a.modifiedBy)+
            '<div>'+
              '<div style="font-size:13px;font-weight:500;color:var(--color-text-primary);">'+escHtml(a.modifiedBy)+'</div>'+
              '<div style="font-size:11px;color:var(--color-text-caption);">'+a.modifiedTime+'</div>'+
            '</div>'+
          '</div>'+
        '</td>'+
        '<td style="padding:12px 16px;text-align:center;">'+
          '<button style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--color-text-caption);padding:2px 8px;border-radius:4px;" onclick="annOpenActionMenu('+a.id+',this,event)">⋮</button>'+
        '</td>'+
      '</tr>';
    }).join('');
  }

  window.annOpenActionMenu = function(id, el, evt) {
    evt.stopPropagation();
    _annActiveId = id;
    var dd=document.getElementById('ann-action-dd');
    var rect=el.getBoundingClientRect();
    dd.style.top=(rect.bottom+4)+'px';
    dd.style.left=Math.max(8,rect.right-180)+'px';
    dd.style.display='block';
  };
  window.annMenuAction = function(action) {
    document.getElementById('ann-action-dd').style.display='none';
    if(action==='edit') annShowDetail(_annActiveId,true);
    else if(action==='delete') annConfirmDelete(_annActiveId);
  };

  window.annShowAddView = function() {
    document.getElementById('ann-list-view').style.display='none';
    document.getElementById('ann-add-view').style.display='block';
    document.getElementById('ann-detail-view').style.display='none';
    annResetAddForm();
    window.scrollTo(0,0);
  };
  function annResetAddForm() {
    var fc=document.getElementById('ann-form-client'); if(fc) fc.value='';
    var fw=document.getElementById('ann-form-website');
    if(fw){fw.value='';fw.disabled=true;fw.style.opacity='0.6';}
    var fd=document.getElementById('ann-form-date'); if(fd) fd.value='';
    var fe=document.getElementById('ann-form-end-date'); if(fe) fe.value='';
    var er=document.getElementById('ann-end-date-row'); if(er) er.style.display='none';
    var el2=document.getElementById('ann-add-end-link'); if(el2) el2.style.display='inline';
    var ft=document.getElementById('ann-form-title'); if(ft) ft.value='';
    var fn=document.getElementById('ann-form-notes'); if(fn) fn.value='';
  }
  window.annOnClientChange = function() {
    var sel=document.getElementById('ann-form-client').value;
    var ws=document.getElementById('ann-form-website');
    ws.disabled=!sel; ws.style.opacity=sel?'1':'0.6';
    ws.innerHTML='<option value="">Select Website</option>';
    if(sel){ var o=document.createElement('option'); o.value=sel; o.textContent=sel; ws.appendChild(o); ws.value=sel; }
  };
  window.annToggleEndDate = function(show) {
    document.getElementById('ann-end-date-row').style.display=show?'flex':'none';
    document.getElementById('ann-add-end-link').style.display=show?'none':'inline';
  };
  window.annSubmitAdd = function() {
    var client=document.getElementById('ann-form-client').value;
    var website=document.getElementById('ann-form-website').value;
    var date=document.getElementById('ann-form-date').value;
    var title=document.getElementById('ann-form-title').value.trim();
    if(!client||!website||!date||!title){showToast('Please fill in all required fields');return;}
    var endDateRaw=document.getElementById('ann-form-end-date').value||null;
    var notes=document.getElementById('ann-form-notes').value.trim()||null;
    ANNOTATIONS_DATA.unshift({id:_annNextId++,title:title,client:client,website:website,date:formatAnnDate(date),endDate:endDateRaw?formatAnnDate(endDateRaw):null,notes:notes,modifiedBy:'Shilo Jones',modifiedTime:'Just now'});
    showToast('Annotation added');
    annShowListView();
  };
  function formatAnnDate(iso) {
    var d=new Date(iso+'T00:00:00');
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  }

  function annShowDetail(id, editMode) {
    _annActiveId=id; _annEditMode=!!editMode;
    document.getElementById('ann-list-view').style.display='none';
    document.getElementById('ann-add-view').style.display='none';
    document.getElementById('ann-detail-view').style.display='block';
    annRenderDetail(id,_annEditMode);
    window.scrollTo(0,0);
  }
  window.annShowDetail = annShowDetail;

  function annRenderDetail(id, editMode) {
    var a=ANNOTATIONS_DATA.find(function(x){return x.id===id;});
    if(!a) return;
    document.getElementById('ann-detail-bc-title').textContent=a.title;
    document.getElementById('ann-detail-heading').textContent=a.title;
    document.getElementById('ann-detail-modified').textContent='Last modified: '+a.modifiedBy+' · '+a.modifiedTime;
    // populate fields
    var cc=document.getElementById('ann-detail-client-input');
    if(cc){cc.value=a.client;cc.disabled=!editMode;}
    var wc=document.getElementById('ann-detail-website-input');
    if(wc){
      // ensure value is in options
      var found=false;
      for(var i=0;i<wc.options.length;i++){if(wc.options[i].value===a.website){found=true;break;}}
      if(!found){var o=document.createElement('option');o.value=a.website;o.textContent=a.website;wc.appendChild(o);}
      wc.value=a.website; wc.disabled=!editMode;
    }
    var dc=document.getElementById('ann-detail-date-input');
    if(dc){
      // convert "Dec 4, 2025" -> "2025-12-04"
      try{ var dateObj=new Date(a.date); dc.value=dateObj.toISOString().split('T')[0]; }catch(e){ dc.value=''; }
      dc.disabled=!editMode;
    }
    var tc=document.getElementById('ann-detail-title-input');
    if(tc){tc.value=a.title;tc.disabled=!editMode;}
    var nc=document.getElementById('ann-detail-notes-input');
    if(nc){nc.value=a.notes||'';nc.disabled=!editMode;}
    document.getElementById('ann-detail-edit-btns').style.display=editMode?'none':'flex';
    document.getElementById('ann-detail-save-btns').style.display=editMode?'flex':'none';
  }
  window.annEnableEdit = function(){_annEditMode=true;annRenderDetail(_annActiveId,true);};
  window.annCancelEdit = function(){_annEditMode=false;annRenderDetail(_annActiveId,false);};
  window.annSaveEdit = function(){
    var a=ANNOTATIONS_DATA.find(function(x){return x.id===_annActiveId;});
    if(!a) return;
    var t=document.getElementById('ann-detail-title-input').value.trim();
    if(!t){showToast('Title is required');return;}
    a.title=t;
    a.client=document.getElementById('ann-detail-client-input').value;
    a.website=document.getElementById('ann-detail-website-input').value;
    var dv=document.getElementById('ann-detail-date-input').value;
    if(dv) a.date=formatAnnDate(dv);
    a.notes=document.getElementById('ann-detail-notes-input').value.trim()||null;
    a.modifiedBy='Shilo Jones'; a.modifiedTime='Just now';
    showToast('Annotation updated');
    _annEditMode=false; annRenderDetail(_annActiveId,false);
  };
  window.annConfirmDelete = function(id){
    _annActiveId=id;
    document.getElementById('ann-delete-modal').style.display='flex';
  };
  window.annDeleteConfirmed = function(){
    ANNOTATIONS_DATA=ANNOTATIONS_DATA.filter(function(a){return a.id!==_annActiveId;});
    document.getElementById('ann-delete-modal').style.display='none';
    showToast('Annotation deleted');
    annShowListView();
  };
  window.annDeleteCancel = function(){document.getElementById('ann-delete-modal').style.display='none';};

  /* ─────────────────────────────────────────
     ALERTS
  ───────────────────────────────────────── */
  function showAlertsPage() {
    ['ic-list','ic-detail','integrations-page','feed-data-page'].forEach(function(id){
      var el=document.getElementById(id); if(el) el.style.display='none';
    });
    hideFeedDetailPages();
    var p=document.getElementById('alerts-page'); if(p) p.style.display='block';
    alertsShowListView();
    window.scrollTo(0,0);
  }
  window.showAlertsPage = showAlertsPage;

  function alertsShowListView() {
    document.getElementById('alerts-list-view').style.display='block';
    document.getElementById('alerts-create-view').style.display='none';
    document.getElementById('alerts-detail-view').style.display='none';
    _alertsFilterDs=''; _alertsFilterStatus=''; _alertsFilterSearch='';
    var sl=document.getElementById('alerts-ds-btn-label'); if(sl) sl.textContent='Data Source: All';
    var ss=document.getElementById('alerts-status-btn-label'); if(ss) ss.textContent='Status: All';
    var si=document.getElementById('alerts-search'); if(si) si.value='';
    alertsRenderList();
  }
  window.alertsShowListView = alertsShowListView;

  function alertsRenderList() {
    var q=_alertsFilterSearch.toLowerCase();
    var rows=ALERTS_DATA.filter(function(a){
      return (!q||a.name.toLowerCase().indexOf(q)>-1||a.dataSource.toLowerCase().indexOf(q)>-1||a.scope.toLowerCase().indexOf(q)>-1)&&
             (!_alertsFilterDs||a.dataSource===_alertsFilterDs)&&
             (!_alertsFilterStatus||a.status===_alertsFilterStatus);
    });
    var badge=document.getElementById('alerts-count-badge'); if(badge) badge.textContent=ALERTS_DATA.length;
    var tbody=document.getElementById('alerts-tbody'); if(!tbody) return;
    tbody.innerHTML=rows.map(function(a){
      var sb=a.status==='Active'?'<span class="badge-active">Active</span>':'<span class="badge-draft">Draft</span>';
      return '<tr style="border-bottom:1px solid var(--color-border);">'+
        '<td style="padding:12px 16px;"><span style="font-size:14px;color:var(--color-blue);cursor:pointer;font-weight:500;" onclick="alertsShowDetail(\''+a.id+'\')">'+escHtml(a.name)+'</span></td>'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-text-primary);">'+escHtml(a.dataSource)+'</td>'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-text-primary);">'+escHtml(a.scope)+'</td>'+
        '<td style="padding:12px 16px;">'+sb+'</td>'+
        '<td style="padding:12px 16px;font-size:13px;color:var(--color-text-caption);">'+(a.lastRun||'—')+'</td>'+
        '<td style="padding:12px 16px;font-size:13px;color:var(--color-text-caption);">'+(a.lastTriggered||'—')+'</td>'+
        '<td style="padding:12px 16px;">'+
          '<div style="display:flex;align-items:center;gap:8px;">'+
            pmAvatar(a.modifiedBy)+
            '<div><div style="font-size:13px;font-weight:500;color:var(--color-text-primary);">'+escHtml(a.modifiedBy)+'</div>'+
            '<div style="font-size:11px;color:var(--color-text-caption);">'+a.modifiedTime+'</div></div>'+
          '</div>'+
        '</td>'+
        '<td style="padding:12px 16px;text-align:center;">'+
          '<button style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--color-text-caption);padding:2px 8px;border-radius:4px;" onclick="alertsOpenActionMenu(\''+a.id+'\',this,event)">⋮</button>'+
        '</td>'+
      '</tr>';
    }).join('');
  }
  window.alertsSearch = function(){_alertsFilterSearch=document.getElementById('alerts-search').value;alertsRenderList();};
  window.alertsSetFilterDs = function(val){
    _alertsFilterDs=val;
    document.getElementById('alerts-ds-btn-label').textContent=val?'Data Source: '+val:'Data Source: All';
    document.getElementById('alerts-ds-panel').classList.remove('open');
    alertsRenderList();
  };
  window.alertsSetFilterStatus = function(val){
    _alertsFilterStatus=val;
    document.getElementById('alerts-status-btn-label').textContent=val?'Status: '+val:'Status: All';
    document.getElementById('alerts-status-panel').classList.remove('open');
    alertsRenderList();
  };

  window.alertsOpenActionMenu = function(id, el, evt) {
    evt.stopPropagation();
    _alertsActiveId=id;
    var a=ALERTS_DATA.find(function(x){return x.id===id;});
    var lbl=document.getElementById('alerts-dd-toggle-label');
    if(lbl) lbl.textContent=a&&a.status==='Active'?'Disable Alert':'Enable Alert';
    var dd=document.getElementById('alerts-action-dd');
    var rect=el.getBoundingClientRect();
    dd.style.top=(rect.bottom+4)+'px';
    dd.style.left=Math.max(8,rect.right-190)+'px';
    dd.style.display='block';
  };
  window.alertsMenuAction = function(action) {
    document.getElementById('alerts-action-dd').style.display='none';
    if(action==='edit') alertsShowCreate(_alertsActiveId);
    else if(action==='duplicate') alertsOpenDuplicate(_alertsActiveId);
    else if(action==='toggle') alertsToggleStatus(_alertsActiveId);
    else if(action==='delete') alertsConfirmDelete(_alertsActiveId);
  };
  window.alertsToggleStatus = function(id) {
    var a=ALERTS_DATA.find(function(x){return x.id===id;});
    if(!a) return;
    a.status=a.status==='Active'?'Draft':'Active';
    alertsRenderList();
    showToast('Alert '+(a.status==='Active'?'enabled':'disabled'));
  };
  window.alertsDetailToggle = function() {
    alertsToggleStatus(_alertsActiveId);
    alertsRenderDetail(_alertsActiveId);
  };

  /* Create form */
  window.alertsShowCreate = function(editId) {
    _alertsEditMode=!!editId; _alertsActiveId=editId||null;
    _alertsFormDirty=false; _alertsConditions=[];
    _alertsSelectedMetrics=[]; _alertsSelectedClients=[];
    document.getElementById('alerts-list-view').style.display='none';
    document.getElementById('alerts-create-view').style.display='block';
    document.getElementById('alerts-detail-view').style.display='none';
    var h=document.getElementById('alerts-create-heading');
    var bc=document.getElementById('alerts-create-bc-label');
    if(editId){
      var ae=ALERTS_DATA.find(function(x){return x.id===editId;});
      if(h) h.textContent='Edit Alert';
      if(bc) bc.textContent='Edit Alert';
      alertsPreFillForm(editId);
    } else {
      if(h) h.textContent='Create Alert';
      if(bc) bc.textContent='Create Alert';
      alertsResetForm();
    }
    window.scrollTo(0,0);
  };

  function alertsResetForm() {
    var n=document.getElementById('alerts-form-name'); if(n) n.value='';
    var ds=document.getElementById('alerts-form-ds'); if(ds) ds.value='';
    var fr=document.getElementById('alerts-form-freq'); if(fr) fr.value='Daily';
    var sc=document.getElementById('alerts-form-slack-ch'); if(sc) sc.value='';
    var sd=document.getElementById('alerts-form-slack-dm'); if(sd) sd.value='';
    document.querySelectorAll('.scope-radio-option').forEach(function(el,i){el.classList.toggle('selected',i===0);});
    var cr=document.getElementById('alerts-client-select-row'); if(cr) cr.style.display='none';
    var chips=document.getElementById('alerts-metric-chips'); if(chips) chips.innerHTML='';
    var mp=document.getElementById('alerts-metrics-panel'); if(mp) mp.innerHTML='';
    _alertsCurrentMetricsList=[];
    var cc=document.getElementById('alerts-conditions-container');
    if(cc) cc.innerHTML='<p style="font-size:13px;color:var(--color-text-caption);margin:0;">Select at least one metric to define alert conditions.</p>';
    var sb=document.getElementById('alerts-summary-box');
    if(sb){sb.className='alert-summary-box muted';sb.textContent='Set up the alert conditions in order to view the alert summary.';}
    alertsUpdateCreateBtn();
  }

  function alertsPreFillForm(id) {
    var a=ALERTS_DATA.find(function(x){return x.id===id;});
    var d=ALERTS_DETAILS[id]||{};
    if(!a) return;
    var n=document.getElementById('alerts-form-name'); if(n) n.value=a.name;
    var ds=document.getElementById('alerts-form-ds'); if(ds) ds.value=a.dataSource;
    var fr=document.getElementById('alerts-form-freq'); if(fr) fr.value=(d.schedule||{}).frequency||'Daily';
    var sc=document.getElementById('alerts-form-slack-ch'); if(sc) sc.value=(d.notifications||{}).slackChannel||'';
    var sd=document.getElementById('alerts-form-slack-dm'); if(sd) sd.value=(d.notifications||{}).slackDM||'';
    _alertsSelectedMetrics=(d.metrics||[]).slice();
    _alertsConditions=JSON.parse(JSON.stringify(d.conditions||[]));
    var metrics=alertsGetMetricsForDs(a.dataSource);
    _alertsCurrentMetricsList=metrics;
    alertsRenderMetricsPanel(metrics);
    alertsRenderMetricChips();
    alertsRenderConditions();
    alertsUpdateSummary();
    alertsUpdateCreateBtn();
  }

  function alertsGetMetricsForDs(ds) {
    return ds==='Organic Search (SEO)'?['Clicks','Impressions','CTR','Position']:['COS','Clicks','Conversions','Impressions','Conversion Value','ROAS','CPC','CTR','Cost'];
  }

  window.alertsFormDirty = function(){_alertsFormDirty=true;};

  window.alertsOnDataSourceChange = function() {
    _alertsFormDirty=true;
    var ds=document.getElementById('alerts-form-ds').value;
    var metrics=alertsGetMetricsForDs(ds);
    _alertsCurrentMetricsList=metrics;
    _alertsSelectedMetrics=[]; _alertsConditions=[];
    alertsRenderMetricsPanel(metrics);
    alertsRenderMetricChips();
    alertsRenderConditions();
    alertsUpdateSummary();
    alertsUpdateCreateBtn();
  };

  function alertsRenderMetricsPanel(metrics) {
    var panel=document.getElementById('alerts-metrics-panel'); if(!panel) return;
    panel.innerHTML=metrics.map(function(m){
      var chk=_alertsSelectedMetrics.indexOf(m)>-1;
      return '<div class="metrics-dd-item" onclick="alertsToggleMetric(\''+m+'\')">'+
        '<input type="checkbox" '+(chk?'checked':'')+' style="pointer-events:none;"> '+escHtml(m)+'</div>';
    }).join('');
  }

  window.alertsToggleMetricsPanel = function() {
    var panel=document.getElementById('alerts-metrics-panel');
    if(panel) panel.classList.toggle('open');
  };

  window.alertsToggleMetric = function(metric) {
    _alertsFormDirty=true;
    var idx=_alertsSelectedMetrics.indexOf(metric);
    if(idx>-1){
      _alertsSelectedMetrics.splice(idx,1);
      _alertsConditions=_alertsConditions.filter(function(c){return c.metric!==metric;});
    } else {
      _alertsSelectedMetrics.push(metric);
      _alertsConditions.push({metric:metric,operator:'is greater than',threshold:'',timeWindow:'7 days',logic:_alertsConditions.length>0?'AND':null});
    }
    alertsRenderMetricsPanel(_alertsCurrentMetricsList);
    alertsRenderMetricChips();
    alertsRenderConditions();
    alertsUpdateSummary();
    alertsUpdateCreateBtn();
  };

  window.alertsRemoveMetric = function(metric) { alertsToggleMetric(metric); };

  function alertsRenderMetricChips() {
    var c=document.getElementById('alerts-metric-chips'); if(!c) return;
    c.innerHTML=_alertsSelectedMetrics.map(function(m){
      return '<span class="metric-chip">'+escHtml(m)+'<span class="metric-chip-x" onclick="alertsRemoveMetric(\''+m+'\')">×</span></span>';
    }).join('');
  }

  function alertsRenderConditions() {
    var container=document.getElementById('alerts-conditions-container'); if(!container) return;
    if(_alertsConditions.length===0){
      container.innerHTML='<p style="font-size:13px;color:var(--color-text-caption);margin:0;">Select at least one metric to define alert conditions.</p>';
      return;
    }
    var metrics=_alertsSelectedMetrics;
    var operators=['is greater than','is less than','increases by','decreases by','equals','does not equal'];
    var windows=['1 day','3 days','7 days','14 days','30 days'];
    container.innerHTML=_alertsConditions.map(function(cond,i){
      var html='';
      if(i>0){
        html+='<div class="logic-connector">'+
          '<span class="logic-pill'+(cond.logic==='AND'?' active':'')+'" onclick="alertsSetLogic('+i+',\'AND\')">AND</span>'+
          '<span class="logic-pill'+(cond.logic==='OR'?' active':'')+'" onclick="alertsSetLogic('+i+',\'OR\')">OR</span>'+
          '<span style="margin-left:auto;font-size:12px;color:#d72225;cursor:pointer;" onclick="alertsRemoveCondition('+i+')">× Remove</span>'+
        '</div>';
      }
      html+='<div class="condition-rule">'+
        '<select onchange="alertsUpdateCondition('+i+',\'metric\',this.value)">'+
          metrics.map(function(m){return '<option'+(m===cond.metric?' selected':'')+'>'+m+'</option>';}).join('')+
        '</select>'+
        '<select onchange="alertsUpdateCondition('+i+',\'operator\',this.value)">'+
          operators.map(function(o){return '<option'+(o===cond.operator?' selected':'')+'>'+o+'</option>';}).join('')+
        '</select>'+
        '<input type="text" value="'+escHtml(cond.threshold)+'" placeholder="value" oninput="alertsUpdateConditionInput('+i+',this.value)">'+
        '<span style="font-size:13px;color:var(--color-text-caption);">over</span>'+
        '<select onchange="alertsUpdateCondition('+i+',\'timeWindow\',this.value)">'+
          windows.map(function(w){return '<option'+(w===cond.timeWindow?' selected':'')+'>'+w+'</option>';}).join('')+
        '</select>'+
      '</div>';
      return html;
    }).join('');
  }

  window.alertsUpdateCondition = function(i, key, val) {
    if(_alertsConditions[i]) _alertsConditions[i][key]=val;
    alertsUpdateSummary(); alertsUpdateCreateBtn();
  };
  window.alertsUpdateConditionInput = function(i, val) {
    if(_alertsConditions[i]) _alertsConditions[i].threshold=val;
    alertsUpdateSummary(); alertsUpdateCreateBtn();
  };
  window.alertsSetLogic = function(i, val) {
    if(_alertsConditions[i]) _alertsConditions[i].logic=val;
    alertsRenderConditions(); alertsUpdateSummary();
  };
  window.alertsRemoveCondition = function(i) {
    _alertsConditions.splice(i,1);
    if(_alertsConditions.length>0) _alertsConditions[0].logic=null;
    alertsRenderConditions(); alertsUpdateSummary(); alertsUpdateCreateBtn();
  };

  function alertsUpdateSummary() {
    var box=document.getElementById('alerts-summary-box'); if(!box) return;
    var filled=_alertsConditions.filter(function(c){return c.metric&&c.threshold;});
    if(!filled.length){
      box.className='alert-summary-box muted';
      box.textContent='Set up the alert conditions in order to view the alert summary.';
      return;
    }
    box.className='alert-summary-box';
    box.textContent='Trigger this alert when '+filled.map(function(c,i){
      return (i>0?(c.logic||'AND')+' ':'')+c.metric+' '+c.operator+' '+c.threshold+' over '+c.timeWindow;
    }).join(' ');
  }

  function alertsUpdateCreateBtn() {
    var btn=document.getElementById('alerts-create-btn'); if(!btn) return;
    var name=(document.getElementById('alerts-form-name')||{value:''}).value||'';
    var ds=(document.getElementById('alerts-form-ds')||{value:''}).value||'';
    var hasM=_alertsSelectedMetrics.length>0;
    var hasC=_alertsConditions.some(function(c){return c.metric&&c.threshold;});
    var ok=name.trim()&&ds&&hasM&&hasC;
    btn.disabled=!ok;
    if(ok) btn.classList.remove('pm-btn-disabled'); else btn.classList.add('pm-btn-disabled');
  }

  window.alertsSelectScope = function(el) {
    document.querySelectorAll('.scope-radio-option').forEach(function(o){o.classList.remove('selected');});
    el.classList.add('selected');
    var scope=el.getAttribute('data-scope');
    var cr=document.getElementById('alerts-client-select-row');
    if(cr) cr.style.display=scope==='Specific Clients'?'block':'none';
    _alertsFormDirty=true;
  };

  window.alertsAddClient = function(client) {
    if(!client||_alertsSelectedClients.indexOf(client)>-1) return;
    _alertsSelectedClients.push(client);
    var chips=document.getElementById('alerts-client-chips'); if(!chips) return;
    chips.innerHTML=_alertsSelectedClients.map(function(c){
      return '<span class="pm-user-chip">'+escHtml(c)+'<span class="pm-user-chip-x" onclick="alertsRemoveClient(\''+c+'\')">×</span></span>';
    }).join('');
    _alertsFormDirty=true;
  };
  window.alertsRemoveClient = function(client) {
    _alertsSelectedClients=_alertsSelectedClients.filter(function(c){return c!==client;});
    var chips=document.getElementById('alerts-client-chips'); if(!chips) return;
    chips.innerHTML=_alertsSelectedClients.map(function(c){
      return '<span class="pm-user-chip">'+escHtml(c)+'<span class="pm-user-chip-x" onclick="alertsRemoveClient(\''+c+'\')">×</span></span>';
    }).join('');
  };

  window.alertsSubmitCreate = function() {
    var name=document.getElementById('alerts-form-name').value.trim();
    var ds=document.getElementById('alerts-form-ds').value;
    if(!name||!ds||!_alertsSelectedMetrics.length||!_alertsConditions.some(function(c){return c.metric&&c.threshold;})){
      showToast('Please fill in all required fields');return;
    }
    var scopeEl=document.querySelector('.scope-radio-option.selected');
    var scope=scopeEl?scopeEl.getAttribute('data-scope'):'All Clients';
    if(scope==='Specific Clients'&&_alertsSelectedClients.length) scope=_alertsSelectedClients.join(', ');
    var freq=(document.getElementById('alerts-form-freq')||{value:'Daily'}).value||'Daily';
    var slackCh=(document.getElementById('alerts-form-slack-ch')||{value:''}).value||'';
    var slackDm=(document.getElementById('alerts-form-slack-dm')||{value:''}).value||'';
    if(_alertsEditMode&&_alertsActiveId){
      var ae=ALERTS_DATA.find(function(x){return x.id===_alertsActiveId;});
      if(ae){ae.name=name;ae.dataSource=ds;ae.scope=scope;ae.modifiedBy='Shilo Jones';ae.modifiedTime='Just now';}
      ALERTS_DETAILS[_alertsActiveId]={metrics:[..._alertsSelectedMetrics],conditions:JSON.parse(JSON.stringify(_alertsConditions)),schedule:{frequency:freq},notifications:{slackChannel:slackCh,slackDM:slackDm},activity:(ALERTS_DETAILS[_alertsActiveId]||{}).activity||[]};
      _alertsFormDirty=false;
      showToast('Alert updated');
      alertsShowDetail(_alertsActiveId);
    } else {
      var newId=String(_alertsNextId++);
      ALERTS_DATA.unshift({id:newId,name:name,dataSource:ds,scope:scope,status:'Active',lastRun:null,lastTriggered:null,modifiedBy:'Shilo Jones',modifiedTime:'Just now'});
      ALERTS_DETAILS[newId]={metrics:[..._alertsSelectedMetrics],conditions:JSON.parse(JSON.stringify(_alertsConditions)),schedule:{frequency:freq},notifications:{slackChannel:slackCh,slackDM:slackDm},activity:[]};
      _alertsFormDirty=false;
      showToast('Alert created');
      alertsShowDetail(newId);
    }
  };

  window.alertsSaveDraft = function() {
    var name=(document.getElementById('alerts-form-name')||{value:''}).value.trim()||'Untitled Alert';
    var newId=String(_alertsNextId++);
    ALERTS_DATA.unshift({id:newId,name:name,dataSource:(document.getElementById('alerts-form-ds')||{value:''}).value||'',scope:'All Clients',status:'Draft',lastRun:null,lastTriggered:null,modifiedBy:'Shilo Jones',modifiedTime:'Just now'});
    _alertsFormDirty=false;
    showToast('Alert saved as draft');
    alertsShowListView();
  };

  window.alertsBackToList = function(){
    if(_alertsFormDirty){document.getElementById('alerts-unsaved-modal').style.display='flex';return;}
    alertsShowListView();
  };
  window.alertsStay = function(){document.getElementById('alerts-unsaved-modal').style.display='none';};
  window.alertsDiscard = function(){_alertsFormDirty=false;document.getElementById('alerts-unsaved-modal').style.display='none';alertsShowListView();};

  /* Detail */
  function alertsShowDetail(id) {
    _alertsActiveId=id;
    document.getElementById('alerts-list-view').style.display='none';
    document.getElementById('alerts-create-view').style.display='none';
    document.getElementById('alerts-detail-view').style.display='block';
    alertsRenderDetail(id);
    window.scrollTo(0,0);
  }
  window.alertsShowDetail = alertsShowDetail;

  function alertsRenderDetail(id) {
    var a=ALERTS_DATA.find(function(x){return x.id===id;});
    var d=ALERTS_DETAILS[id]||{};
    if(!a) return;
    document.getElementById('alerts-detail-heading').textContent=a.name;
    document.getElementById('alerts-detail-bc-title').textContent=a.name;
    document.getElementById('alerts-detail-status').innerHTML=a.status==='Active'?'<span class="badge-active">Active</span>':'<span class="badge-draft">Draft</span>';
    document.getElementById('alerts-detail-modified').textContent='Last modified: '+a.modifiedBy+' · '+a.modifiedTime;
    var tb=document.getElementById('alerts-detail-toggle-btn'); if(tb) tb.textContent=a.status==='Active'?'Disable':'Enable';
    alertsRenderDetailSections(a,d);
    alertsRenderActivity(d.activity||[]);
  }

  function alertsRenderDetailSections(a, d) {
    var el=document.getElementById('alerts-detail-sections'); if(!el) return;
    var metrics=(d.metrics||[]).map(function(m){return '<span class="metric-chip">'+escHtml(m)+'</span>';}).join('');
    var conds=(d.conditions||[]).map(function(c,i){
      return '<div class="condition-display">'+(i>0?'<strong style="font-size:11px;color:var(--color-text-caption);">'+(c.logic||'AND')+'</strong> ':'')+escHtml(c.metric+' '+c.operator+' '+c.threshold+' over '+c.timeWindow)+'</div>';
    }).join('');
    var notifs=[];
    if((d.notifications||{}).slackChannel) notifs.push('Slack Channel: '+d.notifications.slackChannel);
    if((d.notifications||{}).slackDM) notifs.push('Slack DM: '+d.notifications.slackDM);
    var nStr=notifs.length?notifs.join(' · '):'None';
    el.innerHTML=
      '<div style="margin-bottom:20px;"><span class="form-section-label" style="margin-top:0;">Data Source</span><p style="font-size:14px;color:var(--color-text-primary);margin:0;">'+escHtml(a.dataSource)+'</p></div>'+
      '<hr class="form-hr">'+
      '<div style="margin-bottom:20px;"><span class="form-section-label">Scope</span><p style="font-size:14px;color:var(--color-text-primary);margin:0;">'+escHtml(a.scope)+'</p></div>'+
      '<hr class="form-hr">'+
      '<div style="margin-bottom:20px;"><span class="form-section-label">Metrics</span><div>'+metrics+'</div></div>'+
      '<hr class="form-hr">'+
      '<div style="margin-bottom:20px;"><span class="form-section-label">Conditions</span>'+(conds||'<p style="font-size:13px;color:var(--color-text-caption);margin:0;">No conditions set.</p>')+'</div>'+
      '<hr class="form-hr">'+
      '<div style="margin-bottom:20px;"><span class="form-section-label">Schedule</span><p style="font-size:14px;color:var(--color-text-primary);margin:0;">'+escHtml(((d.schedule||{}).frequency)||'—')+'</p></div>'+
      '<hr class="form-hr">'+
      '<div><span class="form-section-label">Notifications</span><p style="font-size:14px;color:var(--color-text-primary);margin:0;">'+escHtml(nStr)+'</p></div>';
  }

  function alertsRenderActivity(activity) {
    var tbody=document.getElementById('alerts-activity-tbody'); if(!tbody) return;
    if(!activity.length){
      tbody.innerHTML='<tr><td colspan="4" style="padding:24px 16px;text-align:center;font-size:13px;color:var(--color-text-caption);">No activity recorded yet.</td></tr>';
      return;
    }
    tbody.innerHTML=activity.map(function(item){
      return '<tr style="border-bottom:1px solid var(--color-border);">'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-text-primary);">'+escHtml(item.client)+'</td>'+
        '<td style="padding:12px 16px;font-size:13px;color:var(--color-text-caption);">'+escHtml(item.triggeredAt)+'</td>'+
        '<td style="padding:12px 16px;font-size:13px;color:var(--color-text-primary);">'+escHtml(item.condition)+'</td>'+
        '<td style="padding:12px 16px;text-align:center;"><span style="font-size:13px;color:var(--color-blue);cursor:pointer;" onclick="alertsShowConditionModal(\''+item.id+'\')">View</span></td>'+
      '</tr>';
    }).join('');
  }

  /* Duplicate */
  window.alertsOpenDuplicate = function(id) {
    _alertsDuplicateId=id;
    var a=ALERTS_DATA.find(function(x){return x.id===id;});
    var inp=document.getElementById('dup-name-input'); if(inp&&a) inp.value=a.name+' (Copy)';
    document.getElementById('alerts-duplicate-modal').style.display='flex';
  };
  window.alertsDuplicateConfirm = function() {
    var src=ALERTS_DATA.find(function(x){return x.id===_alertsDuplicateId;});
    if(!src) return;
    var srcD=ALERTS_DETAILS[_alertsDuplicateId]||{};
    var newName=(document.getElementById('dup-name-input').value.trim())||src.name+' (Copy)';
    var newId=String(_alertsNextId++);
    var copy=Object.assign({},src,{id:newId,name:newName,status:'Draft',lastRun:null,lastTriggered:null,modifiedBy:'Shilo Jones',modifiedTime:'Just now'});
    var newD={activity:[]};
    if(document.getElementById('dup-cb-ds').checked) copy.dataSource=src.dataSource;
    if(document.getElementById('dup-cb-metrics').checked) newD.metrics=(srcD.metrics||[]).slice();
    if(document.getElementById('dup-cb-conditions').checked) newD.conditions=JSON.parse(JSON.stringify(srcD.conditions||[]));
    if(document.getElementById('dup-cb-schedule').checked) newD.schedule=Object.assign({},srcD.schedule||{});
    if(document.getElementById('dup-cb-notifs').checked) newD.notifications=Object.assign({},srcD.notifications||{});
    ALERTS_DATA.unshift(copy);
    ALERTS_DETAILS[newId]=newD;
    document.getElementById('alerts-duplicate-modal').style.display='none';
    showToast('Alert duplicated');
    alertsRenderList();
    alertsShowListView();
  };

  /* Delete */
  window.alertsConfirmDelete = function(id) {
    _alertsDeleteId=id;
    document.getElementById('alerts-delete-modal').style.display='flex';
  };
  window.alertsDeleteConfirmed = function() {
    ALERTS_DATA=ALERTS_DATA.filter(function(a){return a.id!==_alertsDeleteId;});
    document.getElementById('alerts-delete-modal').style.display='none';
    showToast('Alert deleted');
    alertsShowListView();
  };

  /* Preview & Condition modals */
  window.alertsShowPreview = function() {
    var nameEl=document.getElementById('alerts-form-name');
    var dsEl=document.getElementById('alerts-form-ds');
    var name,ds;
    if(nameEl&&document.getElementById('alerts-create-view').style.display==='block'){
      name=nameEl.value||'Budget Alert'; ds=dsEl?dsEl.value||'Google Ads':'Google Ads';
    } else {
      var aa=ALERTS_DATA.find(function(a){return a.id===_alertsActiveId;})||{};
      name=aa.name||'Budget Alert'; ds=aa.dataSource||'Google Ads';
    }
    var pn=document.getElementById('alerts-preview-name'); if(pn) pn.textContent=name;
    var pp=document.getElementById('alerts-preview-platform'); if(pp) pp.textContent=ds;
    document.getElementById('alerts-preview-modal').style.display='flex';
  };

  window.alertsShowConditionModal = function(activityId) {
    var d=ALERTS_DETAILS[_alertsActiveId]||{};
    var item=(d.activity||[]).find(function(a){return a.id===activityId;});
    if(!item) return;
    var cc=document.getElementById('condition-modal-client'); if(cc) cc.textContent=item.client;
    var ct=document.getElementById('condition-modal-time'); if(ct) ct.textContent=item.triggeredAt;
    var cx=document.getElementById('condition-modal-text'); if(cx) cx.textContent=item.condition;
    document.getElementById('alerts-condition-modal').style.display='flex';
  };

  /* Outside-click cleanup */
  document.addEventListener('click',function(e){
    var dd=document.getElementById('ann-action-dd');
    if(dd&&!e.target.closest('#ann-action-dd')&&!e.target.closest('button[onclick*="annOpenActionMenu"]')) dd.style.display='none';
    var dd2=document.getElementById('alerts-action-dd');
    if(dd2&&!e.target.closest('#alerts-action-dd')&&!e.target.closest('button[onclick*="alertsOpenActionMenu"]')) dd2.style.display='none';
    if(!e.target.closest('#alerts-ds-wrap')){var dp=document.getElementById('alerts-ds-panel');if(dp) dp.classList.remove('open');}
    if(!e.target.closest('#alerts-status-wrap')){var sp=document.getElementById('alerts-status-panel');if(sp) sp.classList.remove('open');}
    if(!e.target.closest('#alerts-metrics-wrap')){var mp=document.getElementById('alerts-metrics-panel');if(mp) mp.classList.remove('open');}
  });

  /* Init */
  (function(){
    var at=document.getElementById('ann-tbody'); if(at) annRenderList('');
    var alt=document.getElementById('alerts-tbody'); if(alt) alertsRenderList();
  })();

  /* ─────────────────────────────────────────
     BUSINESS RULE MANAGER
  ───────────────────────────────────────── */
  var BRM_DATA = [
    { id:'1', issue:'Missing Product Descriptions', impact:'High', dataSource:'Google Merchant Center', entityType:'Product', status:'Active', description:'Identifies products without descriptions', modifiedBy:'Shilo Jones', modifiedTime:'2 days ago' },
    { id:'2', issue:'Missing Page Breadcrumbs', impact:'High', dataSource:'Search Console', entityType:'Page', status:'Active', description:'Identifies pages missing breadcrumb markup', modifiedBy:'Amy Sams', modifiedTime:'2 days ago' },
    { id:'3', issue:'Excessive Daily Spends', impact:'Medium', dataSource:'Google Ads', entityType:'URL', status:'Draft', description:'Detects campaigns spending above daily budget thresholds', modifiedBy:'Theresa G', modifiedTime:'2 days ago' },
    { id:'4', issue:'Invalid Image Aspect Ratio', impact:'Low', dataSource:'Google Merchant Center', entityType:'Product', status:'Active', description:'Detects product images with non-standard aspect ratios', modifiedBy:'Shilo Jones', modifiedTime:'2 days ago' },
    { id:'5', issue:'Low Impression Share', impact:'High', dataSource:'Google Ads', entityType:'Campaign', status:'Active', description:'Identifies campaigns with impression share below threshold', modifiedBy:'Amy Sams', modifiedTime:'2 days ago' },
    { id:'6', issue:'Missing Brand Names', impact:'Medium', dataSource:'Feed Analyzer', entityType:'Campaign', status:'Draft', description:'Identifies products missing brand name in attributes', modifiedBy:'Shilo Jones', modifiedTime:'2 days ago' },
    { id:'7', issue:'Oversized Product Images', impact:'High', dataSource:'Google Merchant Center', entityType:'URL', status:'Draft', description:'Flags product images exceeding size limits', modifiedBy:'Theresa G', modifiedTime:'2 days ago' },
    { id:'8', issue:'Low ROAS Campaigns', impact:'Medium', dataSource:'Bing Ads', entityType:'URL', status:'Active', description:'Identifies campaigns with ROAS below target', modifiedBy:'Shilo Jones', modifiedTime:'2 days ago' },
    { id:'9', issue:'Short Product Titles', impact:'Medium', dataSource:'Google Merchant Center', entityType:'All Ad groups', status:'Active', description:'Identifies products with titles shorter than recommended length', modifiedBy:'Amy Sams', modifiedTime:'2 days ago' },
    { id:'10', issue:'Non-Canonical URLs Indexed', impact:'Low', dataSource:'Search Console', entityType:'Selected Ad groups', status:'Draft', description:'Identifies non-canonical URLs appearing in search index', modifiedBy:'Shilo Jones', modifiedTime:'2 days ago' }
  ];
  var _brmNextId = 11;
  var _brmActiveId = null;
  var _brmEditMode = false;
  var _brmFilterDs = '', _brmFilterStatus = '', _brmFilterSearch = '';

  function showBrmPage() {
    ['ic-list','ic-detail','integrations-page','feed-data-page'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });
    hideFeedDetailPages();
    var p=document.getElementById('brm-page'); if(p) p.style.display='block';
    brmShowListView();
    window.scrollTo(0,0);
  }
  window.showBrmPage = showBrmPage;

  function brmShowListView() {
    document.getElementById('brm-list-view').style.display='block';
    document.getElementById('brm-create-view').style.display='none';
    document.getElementById('brm-detail-view').style.display='none';
    _brmFilterDs=''; _brmFilterStatus=''; _brmFilterSearch='';
    var sl=document.getElementById('brm-ds-label'); if(sl) sl.textContent='Data Source: All';
    var ss=document.getElementById('brm-status-label'); if(ss) ss.textContent='Status: All';
    var si=document.getElementById('brm-search'); if(si) si.value='';
    brmRenderList();
  }
  window.brmShowListView = brmShowListView;

  function brmImpactBadge(impact) {
    if(impact==='High') return '<span class="impact-high">High</span>';
    if(impact==='Medium') return '<span class="impact-medium">Medium</span>';
    return '<span class="impact-low">Low</span>';
  }

  function brmRenderList() {
    var q=_brmFilterSearch.toLowerCase();
    var rows=BRM_DATA.filter(function(r){
      return (!q||r.issue.toLowerCase().indexOf(q)>-1)&&
             (!_brmFilterDs||r.dataSource===_brmFilterDs)&&
             (!_brmFilterStatus||r.status===_brmFilterStatus);
    });
    var badge=document.getElementById('brm-count-badge'); if(badge) badge.textContent=BRM_DATA.length;
    var tbody=document.getElementById('brm-tbody'); if(!tbody) return;
    tbody.innerHTML=rows.map(function(r){
      var sb=r.status==='Active'?'<span class="badge-active">Active</span>':'<span class="badge-draft">Draft</span>';
      return '<tr style="border-bottom:1px solid var(--color-border);cursor:pointer;" onclick="brmShowDetail(\''+r.id+'\')">'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-blue);font-weight:500;">'+escHtml(r.issue)+'</td>'+
        '<td style="padding:12px 16px;">'+brmImpactBadge(r.impact)+'</td>'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-text-primary);">'+escHtml(r.dataSource)+'</td>'+
        '<td style="padding:12px 16px;font-size:14px;color:var(--color-text-primary);">'+escHtml(r.entityType)+'</td>'+
        '<td style="padding:12px 16px;">'+sb+'</td>'+
        '<td style="padding:12px 16px;">'+
          '<div style="display:flex;align-items:center;gap:8px;">'+
            pmAvatar(r.modifiedBy)+
            '<div><div style="font-size:13px;font-weight:500;color:var(--color-text-primary);">'+escHtml(r.modifiedBy)+'</div>'+
            '<div style="font-size:11px;color:var(--color-text-caption);">'+r.modifiedTime+'</div></div>'+
          '</div>'+
        '</td>'+
        '<td style="padding:12px 16px;text-align:center;" onclick="event.stopPropagation()">'+
          '<button style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--color-text-caption);padding:2px 8px;border-radius:4px;" onclick="brmOpenActionMenu(\''+r.id+'\',this,event)">⋮</button>'+
        '</td>'+
      '</tr>';
    }).join('');
  }

  window.brmSearch = function(){ _brmFilterSearch=document.getElementById('brm-search').value; brmRenderList(); };
  window.brmSetDs = function(val){ _brmFilterDs=val; document.getElementById('brm-ds-label').textContent=val?'Data Source: '+val:'Data Source: All'; document.getElementById('brm-ds-panel').classList.remove('open'); brmRenderList(); };
  window.brmSetStatus = function(val){ _brmFilterStatus=val; document.getElementById('brm-status-label').textContent=val?'Status: '+val:'Status: All'; document.getElementById('brm-status-panel').classList.remove('open'); brmRenderList(); };

  window.brmOpenActionMenu = function(id, el, evt) {
    evt.stopPropagation();
    _brmActiveId=id;
    var dd=document.getElementById('brm-action-dd');
    var rect=el.getBoundingClientRect();
    dd.style.top=(rect.bottom+4)+'px';
    dd.style.left=Math.max(8,rect.right-180)+'px';
    dd.style.display='block';
  };
  window.brmMenuAction = function(action) {
    document.getElementById('brm-action-dd').style.display='none';
    if(action==='edit') brmShowDetail(_brmActiveId,true);
    else if(action==='delete') brmConfirmDelete(_brmActiveId);
  };

  window.brmShowCreate = function() {
    _brmEditMode=false;
    document.getElementById('brm-list-view').style.display='none';
    document.getElementById('brm-create-view').style.display='block';
    document.getElementById('brm-detail-view').style.display='none';
    document.getElementById('brm-create-heading').textContent='Create Rule';
    document.getElementById('brm-create-bc-label').textContent='Create Rule';
    document.getElementById('brm-form-name').value='';
    document.getElementById('brm-form-desc').value='';
    document.getElementById('brm-form-severity').value='Medium';
    document.getElementById('brm-form-status').value='Active';
    document.getElementById('brm-form-ds').value='';
    document.getElementById('brm-form-entity').value='';
    brmUpdateCreateBtn();
    window.scrollTo(0,0);
  };

  window.brmUpdateCreateBtn = function() {
    var btn=document.getElementById('brm-create-btn'); if(!btn) return;
    var ok=document.getElementById('brm-form-name').value.trim()&&
           document.getElementById('brm-form-desc').value.trim()&&
           document.getElementById('brm-form-ds').value&&
           document.getElementById('brm-form-entity').value;
    btn.disabled=!ok;
    if(ok) btn.classList.remove('pm-btn-disabled'); else btn.classList.add('pm-btn-disabled');
  };

  window.brmSubmitCreate = function() {
    var name=document.getElementById('brm-form-name').value.trim();
    var desc=document.getElementById('brm-form-desc').value.trim();
    var sev=document.getElementById('brm-form-severity').value;
    var stat=document.getElementById('brm-form-status').value;
    var ds=document.getElementById('brm-form-ds').value;
    var ent=document.getElementById('brm-form-entity').value;
    if(!name||!desc||!ds||!ent){showToast('Please fill in all required fields');return;}
    var newId=String(_brmNextId++);
    BRM_DATA.unshift({id:newId,issue:name,impact:sev,dataSource:ds,entityType:ent,status:stat,description:desc,modifiedBy:'Shilo Jones',modifiedTime:'Just now'});
    showToast('Rule created');
    brmShowDetail(newId);
  };

  function brmShowDetail(id, editMode) {
    _brmActiveId=id; _brmEditMode=!!editMode;
    document.getElementById('brm-list-view').style.display='none';
    document.getElementById('brm-create-view').style.display='none';
    document.getElementById('brm-detail-view').style.display='block';
    brmRenderDetail(id, _brmEditMode);
    window.scrollTo(0,0);
  }
  window.brmShowDetail = brmShowDetail;

  function brmRenderDetail(id, editMode) {
    var r=BRM_DATA.find(function(x){return x.id===id;});
    if(!r) return;
    document.getElementById('brm-detail-heading').textContent=r.issue;
    document.getElementById('brm-detail-bc').textContent=r.issue;
    document.getElementById('brm-detail-impact-badge').innerHTML=brmImpactBadge(r.impact);
    document.getElementById('brm-detail-modified').textContent='Last modified: '+r.modifiedBy+' · '+r.modifiedTime;
    document.getElementById('brm-det-name').value=r.issue; document.getElementById('brm-det-name').disabled=!editMode;
    document.getElementById('brm-det-desc').value=r.description; document.getElementById('brm-det-desc').disabled=!editMode;
    document.getElementById('brm-det-ds').value=r.dataSource; document.getElementById('brm-det-ds').disabled=!editMode;
    document.getElementById('brm-det-entity').value=r.entityType; document.getElementById('brm-det-entity').disabled=!editMode;
    var sevDisp=document.getElementById('brm-det-severity-display');
    var sevSel=document.getElementById('brm-det-severity');
    if(editMode){ sevDisp.style.display='none'; sevSel.style.display=''; sevSel.value=r.impact; sevSel.disabled=false; }
    else { sevDisp.style.display='block'; sevDisp.innerHTML=brmImpactBadge(r.impact); sevSel.style.display='none'; }
    document.getElementById('brm-detail-view-btns').style.display=editMode?'none':'flex';
    document.getElementById('brm-detail-edit-btns').style.display=editMode?'flex':'none';
  }

  window.brmEnableEdit = function(){ _brmEditMode=true; brmRenderDetail(_brmActiveId,true); };
  window.brmCancelEdit = function(){ _brmEditMode=false; brmRenderDetail(_brmActiveId,false); };
  window.brmSaveEdit = function(){
    var r=BRM_DATA.find(function(x){return x.id===_brmActiveId;});
    if(!r) return;
    var n=document.getElementById('brm-det-name').value.trim();
    if(!n){showToast('Rule name is required');return;}
    r.issue=n; r.description=document.getElementById('brm-det-desc').value.trim()||r.description;
    r.dataSource=document.getElementById('brm-det-ds').value||r.dataSource;
    r.entityType=document.getElementById('brm-det-entity').value||r.entityType;
    r.impact=document.getElementById('brm-det-severity').value||r.impact;
    r.modifiedBy='Shilo Jones'; r.modifiedTime='Just now';
    showToast('Rule updated');
    _brmEditMode=false; brmRenderDetail(_brmActiveId,false);
  };

  window.brmConfirmDelete = function(id){ _brmActiveId=id; document.getElementById('brm-delete-modal').style.display='flex'; };
  window.brmDeleteConfirmed = function(){
    BRM_DATA=BRM_DATA.filter(function(r){return r.id!==_brmActiveId;});
    document.getElementById('brm-delete-modal').style.display='none';
    showToast('Rule deleted');
    brmShowListView();
  };

  document.addEventListener('click',function(e){
    var dd=document.getElementById('brm-action-dd');
    if(dd&&!e.target.closest('#brm-action-dd')&&!e.target.closest('button[onclick*="brmOpenActionMenu"]')) dd.style.display='none';
    if(!e.target.closest('#brm-ds-wrap')){var p=document.getElementById('brm-ds-panel');if(p)p.classList.remove('open');}
    if(!e.target.closest('#brm-status-wrap')){var p2=document.getElementById('brm-status-panel');if(p2)p2.classList.remove('open');}
  });

  (function(){ var t=document.getElementById('brm-tbody'); if(t) brmRenderList(); })();

  /* ─────────────────────────────────────────
     OVERVIEW PAGE
  ───────────────────────────────────────── */
  var _ovChannel = 'SEM';

  function showOverviewPage() {
    ['ic-list','ic-detail','integrations-page','feed-data-page'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });
    hideFeedDetailPages();
    var p=document.getElementById('overview-page'); if(p) p.style.display='block';
    window.scrollTo(0,0);
  }
  window.showOverviewPage = showOverviewPage;

  window.ovSetChannel = function(ch) {
    _ovChannel=ch;
    document.getElementById('ov-channel-label').textContent=ch;
    document.getElementById('ov-channel-panel').classList.remove('open');
    var isSEO=ch==='SEO';
    document.getElementById('ov-sem-content').style.display=isSEO?'none':'block';
    document.getElementById('ov-seo-content').style.display=isSEO?'block':'none';
    document.getElementById('ov-heading').textContent=isSEO?'SEO Overview':'SEM Overview';
    document.getElementById('ov-subtitle').textContent=isSEO?'Organic search performance and visibility insights.':'Paid search performance and optimisation insights.';
  };
  window.ovSetClient = function(v){ document.getElementById('ov-client-label').textContent=v; document.getElementById('ov-client-panel').classList.remove('open'); showToast('Client updated'); };
  window.ovSetWebsite = function(v){ document.getElementById('ov-website-label').textContent=v; document.getElementById('ov-website-panel').classList.remove('open'); };
  window.ovSetComp = function(v){ document.getElementById('ov-comp-label').textContent=v; document.getElementById('ov-comp-panel').classList.remove('open'); };
  window.ovSetDate = function(v){ document.getElementById('ov-date-label').textContent=v; document.getElementById('ov-date-panel').classList.remove('open'); };

  window.ovOpenDrawer = function() {
    document.getElementById('ov-customize-drawer').classList.add('open');
    document.getElementById('ov-drawer-overlay').style.display='block';
  };
  window.ovCloseDrawer = function() {
    document.getElementById('ov-customize-drawer').classList.remove('open');
    document.getElementById('ov-drawer-overlay').style.display='none';
  };
  window.ovToggleSection = function(hdr) {
    var body=hdr.nextElementSibling;
    body.classList.toggle('open');
    hdr.querySelector('span:last-child').textContent=body.classList.contains('open')?'▼':'▶';
  };
  window.ovApplyCustomize = function() {
    document.querySelectorAll('#ov-customize-drawer input[data-section]').forEach(function(cb){
      var secId='ov-sec-'+cb.getAttribute('data-section');
      var el=document.getElementById(secId); if(el) el.style.display=cb.checked?'':'none';
    });
    ovCloseDrawer();
    showToast('Dashboard updated');
  };
  window.ovResetCustomize = function() {
    document.querySelectorAll('#ov-customize-drawer input[data-section]').forEach(function(cb){ cb.checked=true; });
    ['ov-sec-kpi','ov-sec-channel','ov-sec-time','ov-sec-drivers','ov-sec-category','ov-sec-search'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display=''; });
    showToast('Reset to default');
  };

  // close all ov filter panels on outside click
  document.addEventListener('click', function(e) {
    ['ov-client-wrap','ov-website-wrap','ov-channel-wrap','ov-comp-wrap','ov-date-wrap'].forEach(function(wrapId){
      if(!e.target.closest('#'+wrapId)){
        var panel=document.getElementById(wrapId.replace('-wrap','-panel'));
        if(panel) panel.classList.remove('open');
      }
    });
  });

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

  var maxCV = Math.max.apply(null, rows.map(function(r){return r.convVal;}));
  var minCV = Math.min.apply(null, rows.map(function(r){return r.convVal;}));

  var html = '';
  rows.forEach(function(row) {
    var cosSt = hlCOSCellStyle(row.cos);
    html += '<tr style="border-bottom:1px solid var(--color-border);">';
    html += '<td style="padding:0 16px;font-size:13px;font-weight:500;color:var(--color-text-primary);height:42px;white-space:nowrap;">' + escHtml(row.name) + '</td>';
    html += '<td style="padding:0;width:150px;">' + hlConvValBar(row.convVal, minCV, maxCV) + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;height:42px;">$' + Math.round(row.cost).toLocaleString() + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;height:42px;">' + row.conv.toLocaleString() + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;height:42px;">' + row.convRate.toFixed(1) + '%</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;height:42px;">$' + row.aov.toFixed(2) + '</td>';
    html += '<td style="padding:0 16px;font-size:13px;text-align:right;font-weight:600;height:42px;' + cosSt + '">' + row.cos.toFixed(2) + '%</td>';
    html += '<td style="padding:0 8px;text-align:center;height:42px;">' + (_hlShowSparklines ? hlSparklineSvg(row.cos) : '<span style="color:var(--color-text-caption);">—</span>') + '</td>';
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

  var cntEl = document.getElementById('hl-count-label');
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

window.hlSetSort = function(val) {
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
  hlCloseDrawer();
  hlRender();
  showToast('Filters applied');
};

window.hlClearFilters = function() {
  _hlCOSTarget = 29; _hlShowSparklines = true;
  var inp = document.getElementById('hl-cos-target-input');
  if (inp) inp.value = 29;
  var spk = document.getElementById('hl-chk-sparklines');
  if (spk) spk.checked = true;
  hlRender();
  showToast('Filters cleared');
};

})();
