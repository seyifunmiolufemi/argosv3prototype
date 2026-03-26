(function () {
  'use strict';

  // ── Error data ──────────────────────────────────────────────────────────────
  var FQC_ERRORS = [
    { name:'Title Doesn\'t Contain Brand',                    count:312, field:'title',                  fix:'Include the brand name from your brand attribute in the product title.' },
    { name:'Missing Google Product Category',                 count:287, field:'google_product_category', fix:'Add a valid Google Product Category from the official Google Product Taxonomy.' },
    { name:'Title Contains Promotional Words',                count:201, field:'title',                  fix:'Remove promotional terms like "sale", "free shipping", "best price" from titles.' },
    { name:'Description Contains HTML',                      count:178, field:'description',             fix:'Remove all HTML tags from your description — use plain text only.' },
    { name:'Missing Product Type',                           count:143, field:'product_type',            fix:'Add a product type using the format "Main Category > Subcategory > Product Type".' },
    { name:'Title Doesn\'t Contain Color When Color Is Set', count:98,  field:'title',                  fix:'Ensure the color from your color attribute appears in the product title.' },
    { name:'Description Too Long',                           count:87,  field:'description',             fix:'Shorten your description to under 5,000 characters while keeping key product info.' },
    { name:'Missing Apparel Attributes',                     count:76,  field:'color',                  fix:'For apparel, always include color, size, gender, and age_group attributes.' },
    { name:'Title Contains Special Characters',              count:71,  field:'title',                  fix:'Remove special characters (^, $, @, !) from titles — use plain text only.' },
    { name:'Incorrect GTIN Length',                          count:64,  field:'gtin',                   fix:'Ensure GTIN is 8, 12, 13, or 14 digits and follows the correct format.' },
    { name:'Title Contains Duplicate Words',                 count:58,  field:'title',                  fix:'Remove redundant repeated words from your title.' },
    { name:'Description Contains HTML Entities',             count:52,  field:'description',             fix:'Replace HTML entities (&amp;, &nbsp;) with plain text equivalents.' },
    { name:'Gender Mismatch',                                count:47,  field:'gender',                 fix:'Ensure the gender attribute matches any gender terms used in the title.' },
    { name:'Title Doesn\'t Contain Size When Size is Set',   count:43,  field:'title',                  fix:'Include the product size in the title when the size attribute is set.' },
    { name:'Missing Brand',                                  count:38,  field:'brand',                  fix:'Add the manufacturer or brand name for each product.' },
    { name:'Product Type Bad Delimiters',                    count:34,  field:'product_type',            fix:'Use " > " as the delimiter between product type tiers, not commas or slashes.' },
    { name:'Age Group Mismatch',                             count:29,  field:'age_group',               fix:'Ensure the age_group attribute matches any age-related terms in the title.' },
    { name:'Title Contains Bad Abbreviations',               count:26,  field:'title',                  fix:'Replace abbreviations like "pck", "qty", "pc" with their full word equivalents.' },
    { name:'Description Contains Repeated Whitespace',       count:21,  field:'description',             fix:'Replace multiple consecutive spaces with a single space throughout your description.' },
    { name:'Missing Condition',                              count:18,  field:'condition',              fix:'Specify the product condition — new, refurbished, or used.' },
    { name:'Commas in Image Link',                           count:14,  field:'image_link',             fix:'Remove any commas from your image URL — they cause feed parsing errors.' },
    { name:'Repeated Tiers in Product Type',                 count:11,  field:'product_type',            fix:'Remove duplicate tier values from your product type hierarchy.' },
    { name:'Monitored Pharmacy Words',                       count:7,   field:'title',                  fix:'Remove terms that may violate Google\'s pharmacy policy from titles and descriptions.' },
  ];

  // ── Settings categories ─────────────────────────────────────────────────────
  var FQC_CATEGORIES = [
    { name:'Title Checks',            defaultOff:false, checks:['Size in Title','Color in Title','Duplicate Words','Special Characters','Bad Abbreviations','Brand in Title','Material in Title','Whitespace at Start/End','Repeated Whitespace','Non-breaking Spaces','Missing Spaces After Commas','Repeated Dashes','Repeated Commas','Punctuation at Edges','HTML Tags','HTML Entities','Promotional Words'] },
    { name:'Description Checks',      defaultOff:false, checks:['Missing Spaces After Commas','Repeated Dashes','Whitespace at Edges','Repeated Whitespace','Repeated Commas','HTML Tags','HTML Entities','Description Length','Non-breaking Spaces','Promotional Words'] },
    { name:'Category & Type Checks',  defaultOff:false, checks:['Google Product Category','Product Category Bad Delimiters','Invalid Google Category','Incomplete Google Category','Apparel Attributes','Product Type','Promotional Words in Type','Commas in Type','Repeated Tiers','Whitespace at Start/End','Repeated Whitespace'] },
    { name:'Required Fields',         defaultOff:false, checks:['Duplicate IDs','Product ID','ID Length','Product Link','Image Link','Commas in Image Link','Availability','Price','Brand','Condition','MPN'] },
    { name:'Attribute Validation',    defaultOff:false, checks:['Gender Consistency','Age Group Consistency','GTIN Format','Shipping Weight'] },
    { name:'Content Compliance',      defaultOff:false, checks:['Monitored Pharmacy Words'] },
    { name:'Spelling Checks',         defaultOff:true,  checks:['Title Spelling','Description Spelling'] },
  ];

  // ── Progress check names (47) ──────────────────────────────────────────────
  var FQC_PROGRESS_CHECKS = [
    'Duplicate IDs','Product ID','ID Length','Product Link','Image Link','Commas in Image Link',
    'Availability','Price','Brand','Condition','MPN',
    'Google Product Category','Product Category Bad Delimiters','Invalid Google Category',
    'Incomplete Google Category','Apparel Attributes','Product Type','Promotional Words in Type',
    'Commas in Type','Repeated Tiers','Category Whitespace',
    'Brand in Title','Color in Title','Size in Title','Duplicate Words','Special Characters',
    'Bad Abbreviations','Material in Title','Title Whitespace','Title Repeated Whitespace',
    'Non-breaking Spaces','Missing Spaces After Commas','Title Repeated Dashes',
    'Title Repeated Commas','Punctuation at Edges','Title HTML Tags','Title HTML Entities',
    'Title Promotional Words',
    'Description Whitespace','Description Repeated Whitespace','Description Repeated Dashes',
    'Description Commas','Description HTML Tags','Description HTML Entities',
    'Description Length','Gender Consistency','Age Group Consistency',
  ];

  // ── Mock products for view modal ────────────────────────────────────────────
  var FQC_PRODUCTS = [
    { id:'OR-14823', name:"Men's Helium Rain Jacket" },
    { id:'OR-15201', name:"Women's Astro Rain Jacket" },
    { id:'OR-13447', name:"Interstellar Down Jacket" },
    { id:'OR-16092', name:"Foray Gore-Tex Jacket" },
    { id:'OR-12834', name:"Refuge HD Down Jacket" },
    { id:'OR-17203', name:"Motive AscentShell Jacket" },
    { id:'OR-11928', name:"Ferrosi Pants" },
    { id:'OR-18045', name:"Cirque Pants - Softshell" },
    { id:'OR-14711', name:"Trail Mix Shorts 7\" Inseam" },
    { id:'OR-15892', name:"Vigor Grid Fleece Hoodie" },
    { id:'OR-13267', name:"Treeline Fleece Hoodie" },
    { id:'OR-16438', name:"Transcendent Down Hoody" },
    { id:'OR-17891', name:"UltraLoft Insulated Hoody" },
    { id:'OR-12509', name:"Rampart Cap" },
    { id:'OR-19234', name:"Adrenaline Gloves" },
  ];

  // ── State ───────────────────────────────────────────────────────────────────
  var _state = {
    client: 'Outdoor Research',
    website: 'OutdoorResearch.com',
    feedLoaded: false,
    feedName: '',
    feedSource: '',   // 'gmc' or 'upload'
    sortCol: 'count',
    sortDir: 'desc',
    page: 1,
    pageSize: 20,
    searchTerm: '',
    settingsSearch: '',
    openDd: null,
    expandedExamples: {},
    viewErrIdx: -1,
    viewPage: 1,
    viewPageSize: 10,
    flaggedRows: {},
  };

  // ── Settings state ──────────────────────────────────────────────────────────
  var _settings = {};
  (function initSettings() {
    FQC_CATEGORIES.forEach(function (cat) {
      var checks = {};
      cat.checks.forEach(function (c) { checks[c] = !cat.defaultOff; });
      _settings[cat.name] = { expanded: false, checks: checks };
    });
  }());

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function fqcSettingsCount() {
    var n = 0;
    FQC_CATEGORIES.forEach(function (cat) {
      cat.checks.forEach(function (c) { if (_settings[cat.name].checks[c]) n++; });
    });
    return n;
  }

  function fqcUpdateSettingsCount() {
    var el = document.getElementById('fqc-settings-count');
    if (el) el.textContent = fqcSettingsCount() + ' checks selected';
  }

  function fqcCountFlagged(errIdx) {
    var prefix = errIdx + '-';
    return Object.keys(_state.flaggedRows).filter(function (k) {
      return k.indexOf(prefix) === 0 && _state.flaggedRows[k];
    }).length;
  }

  function fqcSortedErrors() {
    var arr = FQC_ERRORS.slice();
    if (_state.searchTerm) {
      var term = _state.searchTerm.toLowerCase();
      arr = arr.filter(function (e) { return e.name.toLowerCase().indexOf(term) >= 0; });
    }
    arr.sort(function (a, b) {
      if (_state.sortCol === 'count') {
        return _state.sortDir === 'desc' ? b.count - a.count : a.count - b.count;
      }
      var na = a.name.toLowerCase(), nb = b.name.toLowerCase();
      return _state.sortDir === 'asc' ? (na < nb ? -1 : na > nb ? 1 : 0) : (nb < na ? -1 : nb > na ? 1 : 0);
    });
    return arr;
  }

  // ── Dropdown helpers ────────────────────────────────────────────────────────
  function fqcCloseAllDd() {
    document.querySelectorAll('.fqc-dd-panel').forEach(function (p) { p.style.display = 'none'; });
    var dlp = document.getElementById('fqc-dl-report-panel');
    if (dlp) dlp.style.display = 'none';
    _state.openDd = null;
  }

  function fqcOpenDd(btnId, panelId) {
    fqcCloseAllDd();
    var btn = document.getElementById(btnId);
    var panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    var r = btn.getBoundingClientRect();
    panel.style.left = r.left + 'px';
    panel.style.top  = (r.bottom + 4) + 'px';
    panel.style.display = 'block';
    _state.openDd = panelId;
  }

  function fqcBuildClientDd() {
    var panel = document.getElementById('fqc-client-panel');
    if (!panel || !window.ARGOS_CLIENTS) return;
    panel.innerHTML = '';
    window.ARGOS_CLIENTS.forEach(function (c) {
      var item = document.createElement('div');
      item.className = 'fqc-dd-item' + (c.name === _state.client ? ' fqc-selected' : '');
      item.textContent = c.name;
      item.setAttribute('data-pick-client', c.name);
      panel.appendChild(item);
    });
  }

  function fqcBuildWebsiteDd() {
    var panel = document.getElementById('fqc-website-panel');
    if (!panel || !window.ARGOS_CLIENTS) return;
    var client = window.ARGOS_CLIENTS.find(function (c) { return c.name === _state.client; });
    if (!client) return;
    panel.innerHTML = '';
    client.websites.forEach(function (w) {
      var item = document.createElement('div');
      item.className = 'fqc-dd-item' + (w === _state.website ? ' fqc-selected' : '');
      item.textContent = w;
      item.setAttribute('data-pick-website', w);
      panel.appendChild(item);
    });
  }

  // ── Loaded-feed row helper ───────────────────────────────────────────────────
  function fqcMakeLoadedRow(label, filename, removeId, dlId) {
    var trashSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
    var dlSvg    = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    return '<div class="fqc-loaded-row">' +
      '<span class="fqc-loaded-label">' + label + '</span>' +
      '<span class="fqc-loaded-filename">' + filename + '</span>' +
      '<button class="fqc-loaded-action" id="' + removeId + '" title="Remove">' + trashSvg + '</button>' +
      '<button class="fqc-loaded-action" id="' + dlId + '" title="Download feed">' + dlSvg + '</button>' +
    '</div>';
  }

  // ── Feed loading ─────────────────────────────────────────────────────────────
  function fqcSimulateGmcFetch() {
    var btn      = document.getElementById('fqc-gmc-btn');
    var fetchTxt = document.getElementById('fqc-gmc-fetching-text');
    var loadedRow = document.getElementById('fqc-gmc-loaded-row');
    if (!btn) return;
    btn.disabled = true;
    if (fetchTxt) { fetchTxt.textContent = 'Fetching feed from GMC (Merchant ID: 500930305)...'; fetchTxt.style.display = 'inline'; }
    setTimeout(function () {
      _state.feedLoaded = true;
      _state.feedSource = 'gmc';
      _state.feedName   = 'OutdoorResearch_feed.csv';
      var runBtn = document.getElementById('fqc-run-btn');
      if (runBtn) runBtn.disabled = false;
      if (fetchTxt) fetchTxt.style.display = 'none';
      if (loadedRow) {
        loadedRow.innerHTML = fqcMakeLoadedRow('Fetched Feed', _state.feedName, 'fqc-gmc-remove', 'fqc-gmc-dl-feed');
        loadedRow.style.display = 'block';
      }
      btn.disabled = false;
    }, 1500);
  }

  function fqcHandleFileSelected(fileName) {
    _state.feedLoaded = true;
    _state.feedSource = 'upload';
    _state.feedName   = fileName || 'OutdoorResearch_feed.csv';
    var runBtn = document.getElementById('fqc-run-btn');
    if (runBtn) runBtn.disabled = false;
    var loadedRow = document.getElementById('fqc-upload-loaded-row');
    if (loadedRow) {
      loadedRow.innerHTML = fqcMakeLoadedRow('Uploaded File', _state.feedName, 'fqc-upload-remove', 'fqc-upload-dl-feed');
      loadedRow.style.display = 'block';
    }
  }

  function fqcClearGmc() {
    _state.feedLoaded = false;
    _state.feedName   = '';
    _state.feedSource = '';
    var runBtn = document.getElementById('fqc-run-btn');
    if (runBtn) runBtn.disabled = true;
    var row = document.getElementById('fqc-gmc-loaded-row');
    if (row) { row.style.display = 'none'; row.innerHTML = ''; }
  }

  function fqcClearUpload() {
    _state.feedLoaded = false;
    _state.feedName   = '';
    _state.feedSource = '';
    var runBtn = document.getElementById('fqc-run-btn');
    if (runBtn) runBtn.disabled = true;
    var row = document.getElementById('fqc-upload-loaded-row');
    if (row) { row.style.display = 'none'; row.innerHTML = ''; }
    var fi = document.getElementById('fqc-file-input');
    if (fi) fi.value = '';
  }

  // ── Progress + results ───────────────────────────────────────────────────────
  function fqcRunAnalysis() {
    var empty    = document.getElementById('fqc-empty');
    var progress = document.getElementById('fqc-progress-card');
    var results  = document.getElementById('fqc-results');
    var fill     = document.getElementById('fqc-progress-fill');
    var sub      = document.getElementById('fqc-progress-sub');
    var pct      = document.getElementById('fqc-progress-pct');
    var checks   = document.getElementById('fqc-progress-checks');
    if (!progress) return;

    if (empty) empty.style.display = 'none';
    if (results) results.style.display = 'none';
    progress.style.display = 'block';

    var total    = 47;
    var current  = 0;
    var interval = setInterval(function () {
      current++;
      var pctVal = Math.round((current / total) * 100);
      if (fill)   fill.style.width = pctVal + '%';
      if (pct)    pct.textContent  = pctVal + '%';
      if (checks) checks.textContent = current + ' / ' + total + ' checks';
      if (sub && current <= FQC_PROGRESS_CHECKS.length) {
        sub.textContent = 'Running check ' + current + '/' + total + ': ' + FQC_PROGRESS_CHECKS[current - 1];
      }
      if (current >= total) {
        clearInterval(interval);
        setTimeout(function () {
          progress.style.display = 'none';
          fqcRenderResults();
          if (results) results.style.display = 'block';
        }, 300);
      }
    }, 85);
  }

  // ── Render results table ─────────────────────────────────────────────────────
  function fqcRenderResults() {
    fqcUpdateSortIcons();
    var sorted   = fqcSortedErrors();
    var total    = sorted.length;
    var ps       = _state.pageSize;
    var start    = (_state.page - 1) * ps;
    var end      = Math.min(start + ps, total);
    var pageRows = sorted.slice(start, end);

    var tbody = document.getElementById('fqc-errors-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    pageRows.forEach(function (err) {
      var origIdx = FQC_ERRORS.indexOf(err);
      var tr = document.createElement('tr');
      tr.className = 'fqc-tr';

      var badge = err.count > 50
        ? '<span class="fqc-badge-warn">' + err.count.toLocaleString() + '</span>'
        : '<span class="fqc-badge-info">' + err.count.toLocaleString() + '</span>';

      var eyeSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      var dlSvg  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

      tr.innerHTML =
        '<td class="fqc-td fqc-td-top" style="width:38%;"><div class="fqc-err-name">' + err.name + '</div></td>' +
        '<td class="fqc-td" style="width:16%;">' + badge + '</td>' +
        '<td class="fqc-td" style="width:100px;">' +
          '<div class="fqc-action-cell">' +
            '<button class="btn-primary-sm" style="height:30px;width:30px;padding:0;justify-content:center;" data-view-err="' + origIdx + '" title="View errors">' + eyeSvg + '</button>' +
            '<button class="btn-success" style="height:30px;width:30px;padding:0;justify-content:center;" data-dl-err="' + origIdx + '" title="Download CSV">' + dlSvg + '</button>' +
          '</div>' +
        '</td>' +
        '<td class="fqc-td fqc-td-top" style="width:46%;"><div class="fqc-fix-box">' + err.fix + '</div></td>';

      tbody.appendChild(tr);
    });

    // Pagination
    var info = document.getElementById('fqc-page-info');
    if (info) info.textContent = 'Showing ' + (start + 1) + '–' + end + ' of ' + total;
    var prev = document.getElementById('fqc-prev-btn');
    var next = document.getElementById('fqc-next-btn');
    if (prev) prev.disabled = _state.page <= 1;
    if (next) next.disabled = end >= total;
  }

  function fqcExampleText(errIdx) {
    var rows = fqcGenViewRows(errIdx);
    var r = rows[0];
    return 'Product ID: ' + r.id + ' | Field: ' + r.field + ' | Value: \'' + r.value + '\'';
  }

  function fqcUpdateSortIcons() {
    var nameSpan  = document.getElementById('fqc-sort-name');
    var countSpan = document.getElementById('fqc-sort-count');
    if (!nameSpan || !countSpan) return;
    nameSpan.className  = 'fqc-sort-icon' + (_state.sortCol === 'name'  ? ' fqc-sort-active' : '');
    countSpan.className = 'fqc-sort-icon' + (_state.sortCol === 'count' ? ' fqc-sort-active' : '');
    var asc  = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7-7 7 7"/></svg>';
    var desc = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M19 12l-7 7-7-7"/></svg>';
    nameSpan.innerHTML  = (_state.sortCol === 'name'  && _state.sortDir === 'asc') ? asc : (_state.sortCol === 'name'  ? desc : asc);
    countSpan.innerHTML = (_state.sortCol === 'count' && _state.sortDir === 'asc') ? asc : (_state.sortCol === 'count' ? desc : asc);
  }

  // ── Mock view modal rows ─────────────────────────────────────────────────────
  var FQC_FIELD_VALS = {
    0:  function(p){ return p.name + ' - Lightweight Waterproof'; },
    1:  function()  { return ''; },
    2:  function(p){ return p.name + ' — SALE! Free Shipping on Orders $50+'; },
    3:  function(p){ return '<strong>' + p.name + '</strong> — Waterproof and breathable design perfect for <em>outdoor activities</em>.'; },
    4:  function()  { return ''; },
    5:  function(p){ return p.name + ' - Lightweight Waterproof Performance'; },
    6:  function(p){ return p.name + ' — Stay warm and dry with this premium outdoor jacket. Features include fully taped seams, adjustable hood, multiple pockets for gear storage, and a durable water-repellent (DWR) finish that sheds light rain and snow. Engineered with Gore-Tex technology for maximum breathability and waterproofing across all weather conditions. Perfect for hiking, camping, mountaineering, and everyday outdoor use in any weather condition. Available in multiple colors and sizes to fit your unique style and needs. Machine washable for easy care. Limited lifetime warranty against defects in materials and workmanship.'; },
    7:  function()  { return ''; },
    8:  function(p){ return p.name + ' @ Best Price! #1 Rated & Top-Selling!'; },
    9:  function()  { return '00812345'; },
    10: function(p){ return p.name + ' ' + p.name.split(' ').slice(-1)[0]; },
    11: function(p){ return p.name + ' &amp; more styles available. &nbsp; Free returns.'; },
    12: function()  { return 'female'; },
    13: function(p){ return p.name + ' - Lightweight Waterproof'; },
    14: function()  { return ''; },
    15: function(p){ return 'Outdoor Research, Jackets, ' + p.name; },
    16: function()  { return 'adult'; },
    17: function(p){ return p.name + ' 1 pck - 3 qty included'; },
    18: function(p){ return p.name + '  —  Available  in  multiple  colors.  Order  today.'; },
    19: function()  { return ''; },
    20: function()  { return 'https://cdn.outdoorresearch.com/images,product,front.jpg'; },
    21: function(p){ return 'Outdoor Research > Jackets > Outdoor Research > ' + p.name; },
    22: function(p){ return p.name + ' - Pharmacy-grade UPF protection formula'; },
  };

  var FQC_DETAILS = [
    function(p){ return 'Title does not contain brand name \'Outdoor Research\''; },
    function(p){ return 'No google_product_category assigned to \'' + p.name + '\''; },
    function(p){ return 'Title contains promotional word \'SALE\''; },
    function(p){ return 'Description contains HTML tags: <strong>, <em>'; },
    function(p){ return 'product_type field is empty for \'' + p.name + '\''; },
    function(p){ return 'Color attribute is \'Blue\' but title does not contain \'Blue\''; },
    function(p){ return 'Description is ' + (5100 + Math.floor(p.name.length * 12)) + ' characters — exceeds 5,000 limit'; },
    function(p){ return 'Missing required apparel attributes: color, size, gender'; },
    function(p){ return 'Title contains special characters: @, #, !'; },
    function(p){ return 'GTIN \'00812345\' is 8 characters — expected 12, 13, or 14'; },
    function(p){ var w = p.name.split(' ').pop(); return 'Repeated word \'' + w + '\' appears twice in title'; },
    function(p){ return 'Description contains HTML entities: &amp; and &nbsp;'; },
    function(p){ return 'Gender attribute is \'female\' but title contains \'Men\'s\''; },
    function(p){ return 'Size attribute is \'Large\' but title does not include size'; },
    function(p){ return 'brand attribute is empty for \'' + p.name + '\''; },
    function(p){ return 'product_type uses commas instead of \'>\' delimiters'; },
    function(p){ return 'age_group is \'adult\' but title contains \'Kids\''; },
    function(p){ return 'Title contains abbreviation \'pck\' — use \'pack\' instead'; },
    function(p){ return 'Description contains multiple consecutive spaces'; },
    function(p){ return 'condition attribute is empty for \'' + p.name + '\''; },
    function(p){ return 'image_link URL contains a comma which breaks feed parsing'; },
    function(p){ return 'product_type tier \'Outdoor Research\' is repeated'; },
    function(p){ return 'Title contains monitored pharmacy term \'formula\''; },
  ];

  function fqcGenViewRows(errIdx) {
    var rows = [];
    var count = 8 + (errIdx % 5);
    var err   = FQC_ERRORS[errIdx];
    var valFn = FQC_FIELD_VALS[errIdx] || function(p){ return p.name; };
    var detFn = FQC_DETAILS[errIdx]    || function(){ return 'Error detected in ' + err.field; };
    for (var i = 0; i < count; i++) {
      var prod = FQC_PRODUCTS[(errIdx * 3 + i) % FQC_PRODUCTS.length];
      rows.push({ id: prod.id, detail: detFn(prod), field: err.field, value: valFn(prod) });
    }
    return rows;
  }

  // ── View modal ────────────────────────────────────────────────────────────────
  function fqcUpdateViewTitle() {
    var errIdx = _state.viewErrIdx;
    if (errIdx < 0) return;
    var title = document.getElementById('fqc-view-title');
    if (title) title.textContent = 'Detailed errors: ' + FQC_ERRORS[errIdx].name;
    var fp = document.getElementById('fqc-report-fp-btn');
    if (fp) fp.textContent = 'Report false positives (' + fqcCountFlagged(errIdx) + ')';
  }

  function fqcOpenViewModal(errIdx) {
    _state.viewErrIdx   = errIdx;
    _state.viewPage     = 1;
    var modal = document.getElementById('fqc-view-modal');
    if (!modal) return;
    modal.classList.add('fqc-open');
    var flagAll = document.getElementById('fqc-flag-all');
    if (flagAll) flagAll.checked = false;
    fqcUpdateViewTitle();
    fqcRenderViewModal();
  }

  function fqcRenderViewModal() {
    var errIdx  = _state.viewErrIdx;
    if (errIdx < 0) return;
    var allRows = fqcGenViewRows(errIdx);
    var ps      = _state.viewPageSize;
    var start   = (_state.viewPage - 1) * ps;
    var end     = Math.min(start + ps, allRows.length);
    var rows    = allRows.slice(start, end);
    var totalPg = Math.ceil(allRows.length / ps);

    var info1 = document.getElementById('fqc-view-page-info');
    var info2 = document.getElementById('fqc-view-foot-info');
    var show  = document.getElementById('fqc-view-showing');
    if (info1) info1.textContent = 'Page ' + _state.viewPage + ' of ' + totalPg;
    if (info2) info2.textContent = 'Page ' + _state.viewPage + ' of ' + totalPg;
    if (show)  show.textContent  = 'Showing ' + (start + 1) + '–' + end + ' of ' + allRows.length + ' errors';

    var prevBtn = document.getElementById('fqc-view-prev');
    var nextBtn = document.getElementById('fqc-view-next');
    if (prevBtn) prevBtn.disabled = _state.viewPage <= 1;
    if (nextBtn) nextBtn.disabled = _state.viewPage >= totalPg;

    var tbody = document.getElementById('fqc-view-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    rows.forEach(function (row, ri) {
      var globalIdx  = start + ri;
      var flagKey    = errIdx + '-' + globalIdx;
      var isFlagged  = !!_state.flaggedRows[flagKey];
      var tr = document.createElement('tr');
      tr.className = 'fqc-modal-tr';
      tr.innerHTML =
        '<td class="fqc-modal-td fqc-modal-td-id">' + row.id + '</td>' +
        '<td class="fqc-modal-td">' + row.detail + '</td>' +
        '<td class="fqc-modal-td"><code style="font-size:11px;background:var(--color-bg-grey50);padding:2px 5px;border-radius:3px;">' + row.field + '</code></td>' +
        '<td class="fqc-modal-td" style="font-size:12px;word-break:break-all;">' + row.value + '</td>' +
        '<td class="fqc-modal-td">' +
          '<button class="fqc-flag-btn ' + (isFlagged ? 'fqc-flagged' : 'fqc-unflagged') + '" data-flag-row="' + globalIdx + '">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>' +
          '</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
  }

  function fqcCloseViewModal() {
    var modal = document.getElementById('fqc-view-modal');
    if (modal) modal.classList.remove('fqc-open');
    _state.viewErrIdx = -1;
    var flagAll = document.getElementById('fqc-flag-all');
    if (flagAll) flagAll.checked = false;
  }

  // ── Settings modal ────────────────────────────────────────────────────────────
  function fqcOpenSettingsModal() {
    var modal = document.getElementById('fqc-settings-modal');
    if (!modal) return;
    _state.settingsSearch = '';
    var si = document.getElementById('fqc-settings-search-input');
    if (si) si.value = '';
    fqcRenderSettingsBody();
    fqcUpdateSettingsCount();
    modal.classList.add('fqc-open');
  }

  function fqcCloseSettingsModal() {
    var modal = document.getElementById('fqc-settings-modal');
    if (modal) modal.classList.remove('fqc-open');
  }

  function fqcRenderSettingsBody() {
    var body = document.getElementById('fqc-settings-body');
    if (!body) return;
    body.innerHTML = '';
    var term = _state.settingsSearch.toLowerCase();
    FQC_CATEGORIES.forEach(function (cat) {
      var s      = _settings[cat.name];
      var checks = term
        ? cat.checks.filter(function (c) { return c.toLowerCase().indexOf(term) >= 0; })
        : cat.checks;
      if (checks.length === 0) return;
      var allOn  = checks.every(function (c) { return s.checks[c]; });
      var someOn = checks.some(function (c) { return s.checks[c]; });
      var cbState = allOn ? 'checked' : '';
      var indeterminate = !allOn && someOn ? ' data-indet="1"' : '';

      var hdr = document.createElement('div');
      hdr.className = 'fqc-cat-hdr';
      hdr.innerHTML =
        '<input type="checkbox" ' + cbState + indeterminate + ' style="cursor:pointer;accent-color:var(--color-blue);flex-shrink:0;" data-cat-cb="' + cat.name + '" onclick="event.stopPropagation();">' +
        '<span style="flex:1;font-size:13px;font-weight:500;color:var(--color-text-primary);">' + cat.name + '</span>' +
        '<span style="font-size:12px;color:var(--color-text-caption);margin-right:8px;">(' + checks.length + ' checks)</span>' +
        '<svg class="fqc-cat-chev' + (s.expanded ? ' fqc-chev-open' : '') + '" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
      hdr.setAttribute('data-cat-toggle', cat.name);

      var bodyDiv = document.createElement('div');
      bodyDiv.className = 'fqc-cat-body' + (s.expanded ? ' fqc-cat-open' : '');
      bodyDiv.setAttribute('data-cat-body', cat.name);
      checks.forEach(function (chk) {
        var item = document.createElement('div');
        item.className = 'fqc-check-item';
        item.innerHTML =
          '<input type="checkbox" ' + (s.checks[chk] ? 'checked' : '') + ' data-check-item="' + cat.name + '" data-check-name="' + chk + '" style="cursor:pointer;accent-color:var(--color-blue);">' +
          chk;
        bodyDiv.appendChild(item);
      });

      body.appendChild(hdr);
      body.appendChild(bodyDiv);
    });

    // Set indeterminate states
    body.querySelectorAll('[data-indet="1"]').forEach(function (cb) { cb.indeterminate = true; });
  }

  // ── CSV download ──────────────────────────────────────────────────────────────
  function fqcDownloadCSV(rows, filename) {
    var headers = ['Error Type', 'Count', 'Affected Field', 'Fix Suggestion'];
    var lines = [headers.join(',')];
    rows.forEach(function (r) {
      lines.push([
        '"' + r.name.replace(/"/g, '""') + '"',
        r.count,
        '"' + r.field + '"',
        '"' + r.fix.replace(/"/g, '""') + '"',
      ].join(','));
    });
    fqcTriggerDownload(lines.join('\n'), filename || 'feed_quality_report.csv');
  }

  function fqcDownloadErrorCSV(errIdx) {
    var err  = FQC_ERRORS[errIdx];
    var rows = fqcGenViewRows(errIdx);
    var headers = ['Product ID', 'Details', 'Affected Field', 'Value'];
    var lines = [headers.join(',')];
    rows.forEach(function (r) {
      lines.push([
        '"' + r.id + '"',
        '"' + r.detail.replace(/"/g, '""') + '"',
        '"' + r.field + '"',
        '"' + r.value.replace(/"/g, '""') + '"',
      ].join(','));
    });
    fqcTriggerDownload(lines.join('\n'), err.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_errors.csv');
  }

  function fqcTriggerDownload(csv, filename) {
    var blob = new Blob([csv], { type: 'text/csv' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function fqcDownloadReport(withHeader) {
    var rows = FQC_ERRORS.slice();
    var csv  = '';
    if (withHeader) {
      csv += '"Feed Quality Report — ' + _state.website + '"\n';
      csv += '"Generated: ' + new Date().toLocaleDateString() + '"\n';
      csv += '"Total Errors: 1284 | Failed Checks: 23 | SKUs: 4847"\n\n';
    }
    var headers = ['Error Type', 'Count', 'Affected Field', 'Fix Suggestion'];
    var lines   = [headers.join(',')];
    rows.forEach(function (r) {
      lines.push(['"' + r.name.replace(/"/g,'""') + '"', r.count, '"' + r.field + '"', '"' + r.fix.replace(/"/g,'""') + '"'].join(','));
    });
    csv += lines.join('\n');
    fqcTriggerDownload(csv, 'feed_quality_report' + (withHeader ? '_full' : '') + '.csv');
  }

  // ── Event delegation ──────────────────────────────────────────────────────────
  var _fqcInit = false;
  function fqcWireEvents() {
    if (_fqcInit) return;
    _fqcInit = true;

    document.addEventListener('click', function (e) {
      var page = document.getElementById('feed-quality-check-page');
      if (!page || page.style.display === 'none') return;

      // Close dropdowns on outside click
      if (!e.target.closest('.fqc-dd-btn') && !e.target.closest('.fqc-dd-panel') &&
          !e.target.closest('#fqc-dl-report-btn') && !e.target.closest('#fqc-dl-report-panel')) {
        fqcCloseAllDd();
      }

      // Client dropdown
      if (e.target.closest('#fqc-client-btn')) {
        fqcBuildClientDd(); fqcOpenDd('fqc-client-btn', 'fqc-client-panel'); return;
      }
      if (e.target.closest('#fqc-website-btn')) {
        fqcBuildWebsiteDd(); fqcOpenDd('fqc-website-btn', 'fqc-website-panel'); return;
      }
      var pickClient = e.target.closest('[data-pick-client]');
      if (pickClient) {
        _state.client  = pickClient.getAttribute('data-pick-client');
        var client = window.ARGOS_CLIENTS && window.ARGOS_CLIENTS.find(function(c){ return c.name===_state.client; });
        _state.website = client ? client.websites[0] : '';
        document.getElementById('fqc-client-label').textContent  = _state.client;
        document.getElementById('fqc-website-label').textContent = _state.website;
        fqcCloseAllDd(); return;
      }
      var pickWebsite = e.target.closest('[data-pick-website]');
      if (pickWebsite) {
        _state.website = pickWebsite.getAttribute('data-pick-website');
        document.getElementById('fqc-website-label').textContent = _state.website;
        fqcCloseAllDd(); return;
      }

      // GMC fetch
      if (e.target.closest('#fqc-gmc-btn')) { fqcSimulateGmcFetch(); return; }

      // Remove GMC loaded feed
      if (e.target.closest('#fqc-gmc-remove')) { fqcClearGmc(); return; }

      // Upload zone click
      if (e.target.closest('#fqc-upload-zone') && !e.target.closest('#fqc-file-input')) {
        var fi = document.getElementById('fqc-file-input');
        if (fi) fi.click();
        return;
      }

      // Remove uploaded file
      if (e.target.closest('#fqc-upload-remove')) { fqcClearUpload(); return; }

      // Download feed (prototype - show toast)
      if (e.target.closest('#fqc-gmc-dl-feed') || e.target.closest('#fqc-upload-dl-feed')) {
        if (typeof showToast === 'function') showToast('Feed download started');
        return;
      }

      // Run Analysis
      if (e.target.closest('#fqc-run-btn')) {
        var btn = document.getElementById('fqc-run-btn');
        if (btn && !btn.disabled) fqcRunAnalysis();
        return;
      }

      // Settings button
      if (e.target.closest('#fqc-settings-btn')) { fqcOpenSettingsModal(); return; }

      // Sort headers
      var th = e.target.closest('[data-sort-col]');
      if (th && e.target.closest('#fqc-errors-tbody, .fqc-table thead')) {
        var col = th.getAttribute('data-sort-col');
        if (_state.sortCol === col) {
          _state.sortDir = _state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          _state.sortCol = col;
          _state.sortDir = col === 'count' ? 'desc' : 'asc';
        }
        _state.page = 1;
        fqcRenderResults();
        return;
      }
      // also handle thead th click (selector doesn't include thead above correctly)
      var thEl = e.target.closest('.fqc-th[data-sort-col]');
      if (thEl) {
        var col2 = thEl.getAttribute('data-sort-col');
        if (_state.sortCol === col2) {
          _state.sortDir = _state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          _state.sortCol = col2;
          _state.sortDir = col2 === 'count' ? 'desc' : 'asc';
        }
        _state.page = 1;
        fqcRenderResults();
        return;
      }

      // Show example toggle
      var showEx = e.target.closest('[data-show-ex]');
      if (showEx) {
        var idx = parseInt(showEx.getAttribute('data-show-ex'));
        _state.expandedExamples[idx] = !_state.expandedExamples[idx];
        var exDiv = document.getElementById('fqc-ex-' + idx);
        if (exDiv) exDiv.style.display = _state.expandedExamples[idx] ? 'block' : 'none';
        showEx.textContent = _state.expandedExamples[idx] ? '▲ Hide Example' : '▼ Show Example';
        return;
      }

      // View button
      var viewBtn = e.target.closest('[data-view-err]');
      if (viewBtn) {
        fqcOpenViewModal(parseInt(viewBtn.getAttribute('data-view-err'))); return;
      }

      // Download error CSV
      var dlErr = e.target.closest('[data-dl-err]');
      if (dlErr) {
        fqcDownloadErrorCSV(parseInt(dlErr.getAttribute('data-dl-err'))); return;
      }

      // Pagination
      if (e.target.closest('#fqc-prev-btn')) { if (_state.page > 1) { _state.page--; fqcRenderResults(); } return; }
      if (e.target.closest('#fqc-next-btn')) {
        var maxPage = Math.ceil(fqcSortedErrors().length / _state.pageSize);
        if (_state.page < maxPage) { _state.page++; fqcRenderResults(); }
        return;
      }

      // Download report dropdown
      if (e.target.closest('#fqc-dl-report-btn')) {
        var rpanel = document.getElementById('fqc-dl-report-panel');
        var rbtn   = document.getElementById('fqc-dl-report-btn');
        if (rpanel && rbtn) {
          var rr = rbtn.getBoundingClientRect();
          rpanel.style.left   = rr.left + 'px';
          rpanel.style.bottom = (window.innerHeight - rr.top + 4) + 'px';
          rpanel.style.top    = 'auto';
          rpanel.style.display = rpanel.style.display === 'block' ? 'none' : 'block';
        }
        return;
      }
      var dlReport = e.target.closest('[data-dl-report]');
      if (dlReport) {
        fqcDownloadReport(dlReport.getAttribute('data-dl-report') === 'full');
        fqcCloseAllDd(); return;
      }

      // View modal: close, flag, pagination, download
      if (e.target.closest('#fqc-view-close') || (e.target === document.getElementById('fqc-view-modal'))) {
        fqcCloseViewModal(); return;
      }
      if (e.target.closest('#fqc-view-prev')) {
        if (_state.viewPage > 1) { _state.viewPage--; fqcRenderViewModal(); }
        return;
      }
      if (e.target.closest('#fqc-view-next')) {
        var rows = fqcGenViewRows(_state.viewErrIdx);
        var tp   = Math.ceil(rows.length / _state.viewPageSize);
        if (_state.viewPage < tp) { _state.viewPage++; fqcRenderViewModal(); }
        return;
      }
      var flagRow = e.target.closest('[data-flag-row]');
      if (flagRow) {
        var gi  = parseInt(flagRow.getAttribute('data-flag-row'));
        var key = _state.viewErrIdx + '-' + gi;
        _state.flaggedRows[key] = !_state.flaggedRows[key];
        flagRow.className = 'fqc-flag-btn ' + (_state.flaggedRows[key] ? 'fqc-flagged' : 'fqc-unflagged');
        fqcUpdateViewTitle();
        return;
      }
      if (e.target.closest('#fqc-view-dl-btn')) {
        if (_state.viewErrIdx >= 0) fqcDownloadErrorCSV(_state.viewErrIdx);
        return;
      }

      // Settings modal: close, select/clear all, category toggle, individual check
      if (e.target.closest('#fqc-settings-close') || e.target === document.getElementById('fqc-settings-modal')) {
        fqcCloseSettingsModal(); return;
      }
      if (e.target.closest('#fqc-select-all-btn')) {
        FQC_CATEGORIES.forEach(function (cat) {
          cat.checks.forEach(function (c) { _settings[cat.name].checks[c] = true; });
        });
        fqcRenderSettingsBody(); fqcUpdateSettingsCount(); return;
      }
      if (e.target.closest('#fqc-clear-all-btn')) {
        FQC_CATEGORIES.forEach(function (cat) {
          cat.checks.forEach(function (c) { _settings[cat.name].checks[c] = false; });
        });
        fqcRenderSettingsBody(); fqcUpdateSettingsCount(); return;
      }
      var catToggle = e.target.closest('[data-cat-toggle]');
      if (catToggle && !e.target.closest('[data-cat-cb]')) {
        var catName = catToggle.getAttribute('data-cat-toggle');
        _settings[catName].expanded = !_settings[catName].expanded;
        var bodyD = document.querySelector('[data-cat-body="' + catName + '"]');
        var chev  = catToggle.querySelector('.fqc-cat-chev');
        if (bodyD) bodyD.classList.toggle('fqc-cat-open', _settings[catName].expanded);
        if (chev)  chev.classList.toggle('fqc-chev-open', _settings[catName].expanded);
        return;
      }
      var catCb = e.target.closest('[data-cat-cb]');
      if (catCb) {
        var catN = catCb.getAttribute('data-cat-cb');
        var allOn2 = catCb.checked;
        FQC_CATEGORIES.find(function(c){ return c.name===catN; }).checks.forEach(function (chk) {
          _settings[catN].checks[chk] = allOn2;
        });
        fqcRenderSettingsBody(); fqcUpdateSettingsCount(); return;
      }
    });

    // File input change
    var fileInput = document.getElementById('fqc-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
          fqcHandleFileSelected(this.files[0].name);
        }
      });
    }

    // Search inputs (delegated — covers results search and settings search)
    document.addEventListener('input', function (e) {
      if (e.target && e.target.id === 'fqc-settings-search-input') {
        _state.settingsSearch = e.target.value;
        fqcRenderSettingsBody();
      }
      if (e.target && e.target.id === 'fqc-search-input') {
        _state.searchTerm = e.target.value;
        _state.page = 1;
        fqcRenderResults();
      }
    });

    // Individual check checkbox (settings) — use input event since click triggers before state
    document.addEventListener('change', function (e) {
      var page = document.getElementById('feed-quality-check-page');
      if (!page || page.style.display === 'none') return;

      var checkItem = e.target.closest('[data-check-item]');
      if (checkItem && e.target.type === 'checkbox') {
        var catN2 = e.target.getAttribute('data-check-item');
        var chkN  = e.target.getAttribute('data-check-name');
        if (catN2 && chkN) {
          _settings[catN2].checks[chkN] = e.target.checked;
          // update category checkbox state
          var catHdr   = document.querySelector('[data-cat-toggle="' + catN2 + '"]');
          var catCheck = catHdr && catHdr.querySelector('[data-cat-cb]');
          if (catCheck) {
            var cat2  = FQC_CATEGORIES.find(function(c){ return c.name===catN2; });
            var aon   = cat2.checks.every(function(c){ return _settings[catN2].checks[c]; });
            var anyon = cat2.checks.some(function(c){ return _settings[catN2].checks[c]; });
            catCheck.checked       = aon;
            catCheck.indeterminate = !aon && anyon;
          }
          fqcUpdateSettingsCount();
        }
        return;
      }

      // View modal page size
      if (e.target.closest('#fqc-view-page-size')) {
        _state.viewPageSize = parseInt(e.target.value);
        _state.viewPage = 1;
        fqcRenderViewModal(); return;
      }

      // Main table page size
      if (e.target.closest('#fqc-page-size')) {
        _state.pageSize = parseInt(e.target.value);
        _state.page = 1;
        fqcRenderResults(); return;
      }

      // Flag all on page
      if (e.target.closest('#fqc-flag-all')) {
        var checked = e.target.checked;
        var allRows2 = fqcGenViewRows(_state.viewErrIdx);
        var ps2      = _state.viewPageSize;
        var start2   = (_state.viewPage - 1) * ps2;
        var end2     = Math.min(start2 + ps2, allRows2.length);
        for (var i = start2; i < end2; i++) {
          _state.flaggedRows[_state.viewErrIdx + '-' + i] = checked;
        }
        fqcRenderViewModal();
        fqcUpdateViewTitle();
        document.getElementById('fqc-flag-all').checked = checked;
        return;
      }
    });

    // Drag and drop on upload zone
    var zone = document.getElementById('fqc-upload-zone');
    if (zone) {
      zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        zone.classList.add('fqc-dragover');
      });
      zone.addEventListener('dragleave', function () {
        zone.classList.remove('fqc-dragover');
      });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('fqc-dragover');
        var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        fqcHandleFileSelected(file ? file.name : 'OutdoorResearch_feed.csv');
      });
    }

    // Breadcrumb nav
    document.addEventListener('click', function (e) {
      var page = document.getElementById('feed-quality-check-page');
      if (!page || page.style.display === 'none') return;
      var navLink = e.target.closest('[data-nav]');
      if (navLink && e.target.closest('#feed-quality-check-page')) {
        var nav = navLink.getAttribute('data-nav');
        var sbKid = document.querySelector('[data-nav="' + nav + '"].sb-kid');
        if (sbKid) sbKid.click();
      }
    });
  }

  // ── Public entry ───────────────────────────────────────────────────────────
  window.showFeedQualityCheckPage = function () {
    if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
    var fdp = document.getElementById('feed-data-page');
    if (fdp) fdp.style.display = 'none';
    var page = document.getElementById('feed-quality-check-page');
    if (!page) return;
    page.style.display = 'block';
    window.scrollTo(0, 0);
    fqcWireEvents();
    fqcUpdateSettingsCount();
  };

})();
