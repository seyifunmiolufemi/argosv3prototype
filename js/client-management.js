(function() {
'use strict';

/* ── Static mock metadata (augments ARGOS_CLIENTS) ── */
var CM_CLIENT_META = {
  'Link Imaging':               { status:'active',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'2 days ago' },
  'Biddy Murphy':               { status:'active',   modBy:{i:'AS',n:'Amy S.'}, ago:'5 days ago' },
  "People's Choice Beef Jerky":{ status:'paused',   modBy:{i:'AF',n:'Andrew F.'}, ago:'1 week ago' },
  'Simply Authentic LLC':       { status:'active',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'3 days ago' },
  'MojoMotoSport.com':          { status:'active',   modBy:{i:'AS',n:'Amy S.'}, ago:'Yesterday' },
  'Danielhouse Studios Inc':    { status:'inactive', modBy:{i:'AF',n:'Andrew F.'}, ago:'2 weeks ago' },
  'ScaffoldMart':               { status:'active',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'4 days ago' },
  'BRobinson, LLC':             { status:'active',   modBy:{i:'AS',n:'Amy S.'}, ago:'6 days ago' },
  'Microscope.com':             { status:'paused',   modBy:{i:'AF',n:'Andrew F.'}, ago:'3 weeks ago' },
  'Grovemade':                  { status:'active',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'Today' },
  'Dungarees':                  { status:'active',   modBy:{i:'AS',n:'Amy S.'}, ago:'2 days ago' },
  'Outdoor Research':           { status:'active',   modBy:{i:'AF',n:'Andrew F.'}, ago:'3 hours ago' },
  'Chantelle Lingerie Inc':     { status:'active',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'1 day ago' },
  'Weaver':                     { status:'active',   modBy:{i:'AS',n:'Amy S.'}, ago:'5 days ago' },
  'MonkeySports':               { status:'active',   modBy:{i:'AF',n:'Andrew F.'}, ago:'4 days ago' },
  'Orchard and Vineyard Supply':{ status:'inactive', modBy:{i:'SJ',n:'Shilo J.'}, ago:'1 month ago' },
  'Sunflora Inc':               { status:'active',   modBy:{i:'AS',n:'Amy S.'}, ago:'3 days ago' },
  'Royal Swimming Pools':       { status:'paused',   modBy:{i:'AF',n:'Andrew F.'}, ago:'2 days ago' },
  'My Binding':                 { status:'active',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'Today' },
  'eOutdoors':                  { status:'active',   modBy:{i:'AS',n:'Amy S.'}, ago:'6 hours ago' },
  'Nomadic Vintage Rugs':       { status:'active',   modBy:{i:'AF',n:'Andrew F.'}, ago:'8 days ago' }
};

var CM_WEBSITE_DETAIL = {
  '123Inkjets.com':          { domain:'123inkjets.com',          platform:'Shopify',     status:'complete',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'2 days ago' },
  '4Inkjets.com':            { domain:'4inkjets.com',            platform:'Shopify',     status:'complete',   modBy:{i:'AS',n:'Amy S.'}, ago:'5 days ago' },
  'InkCartridges.com':       { domain:'inkcartridges.com',       platform:'Magento',     status:'complete',   modBy:{i:'AF',n:'Andrew F.'}, ago:'1 week ago' },
  'LDProducts.com':          { domain:'ldproducts.com',          platform:'Magento',     status:'incomplete', modBy:{i:'SJ',n:'Shilo J.'}, ago:'2 weeks ago' },
  'QuickShipToner.com':      { domain:'quickshiptoner.com',      platform:'WooCommerce', status:'incomplete', modBy:{i:'AS',n:'Amy S.'}, ago:'3 weeks ago' },
  'BiddyMurphy.com':         { domain:'biddymurphy.com',         platform:'Shopify',     status:'complete',   modBy:{i:'AF',n:'Andrew F.'}, ago:'5 days ago' },
  'PeoplesChoiceBeefJerky.com':{ domain:'peopleschoicebeefjerky.com', platform:'Shopify', status:'complete',  modBy:{i:'SJ',n:'Shilo J.'}, ago:'1 week ago' },
  'SimplySeattle.com':       { domain:'simplyseattle.com',       platform:'Shopify',     status:'complete',   modBy:{i:'AS',n:'Amy S.'}, ago:'3 days ago' },
  'BurtsPowersports.com':    { domain:'burtspowersports.com',    platform:'BigCommerce', status:'complete',   modBy:{i:'AF',n:'Andrew F.'}, ago:'Yesterday' },
  'MojoMotoSport.com':       { domain:'mojomotosport.com',       platform:'BigCommerce', status:'incomplete', modBy:{i:'SJ',n:'Shilo J.'}, ago:'4 days ago' },
  'DanielHouseClub.com':     { domain:'danielhouseclub.com',     platform:'Shopify',     status:'incomplete', modBy:{i:'AS',n:'Amy S.'}, ago:'2 weeks ago' },
  'ScaffoldMart.com':        { domain:'scaffoldmart.com',        platform:'WooCommerce', status:'complete',   modBy:{i:'AF',n:'Andrew F.'}, ago:'4 days ago' },
  'Revo.com':                { domain:'revo.com',                platform:'Shopify',     status:'complete',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'6 days ago' },
  'Microscope.com':          { domain:'microscope.com',          platform:'Magento',     status:'incomplete', modBy:{i:'AS',n:'Amy S.'}, ago:'3 weeks ago' },
  'Grovemade.com':           { domain:'grovemade.com',           platform:'Shopify',     status:'complete',   modBy:{i:'AF',n:'Andrew F.'}, ago:'Today' },
  'Dungarees.com':           { domain:'dungarees.com',           platform:'Shopify',     status:'complete',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'2 days ago' },
  'OutdoorResearch.com':     { domain:'outdoorresearch.com',     platform:'Shopify',     status:'complete',   modBy:{i:'AS',n:'Amy S.'}, ago:'3 hours ago' },
  'ChantelleUS.com':         { domain:'chantelleusa.com',        platform:'Shopify',     status:'complete',   modBy:{i:'AF',n:'Andrew F.'}, ago:'1 day ago' },
  'WeaverEquine.com':        { domain:'weaverequine.com',        platform:'WooCommerce', status:'complete',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'5 days ago' },
  'WeaverLeather.com':       { domain:'weaverleather.com',       platform:'WooCommerce', status:'complete',   modBy:{i:'AS',n:'Amy S.'}, ago:'5 days ago' },
  'WeaverLivestock.com':     { domain:'weaverlivestock.com',     platform:'WooCommerce', status:'incomplete', modBy:{i:'AF',n:'Andrew F.'}, ago:'1 week ago' },
  'BaseballMonkey.com':      { domain:'baseballmonkey.com',      platform:'BigCommerce', status:'complete',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'4 days ago' },
  'GoalieMonkey.com':        { domain:'goaliemonkey.com',        platform:'BigCommerce', status:'complete',   modBy:{i:'AS',n:'Amy S.'}, ago:'4 days ago' },
  'HockeyMonkey.com':        { domain:'hockeymonkey.com',        platform:'BigCommerce', status:'complete',   modBy:{i:'AF',n:'Andrew F.'}, ago:'4 days ago' },
  'HockeyMonkey.ca':         { domain:'hockeymonkey.ca',         platform:'BigCommerce', status:'complete',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'4 days ago' },
  'LacrosseMonkey.com':      { domain:'lacrossemonkey.com',      platform:'BigCommerce', status:'incomplete', modBy:{i:'AS',n:'Amy S.'}, ago:'1 week ago' },
  'LocalMonkey.com':         { domain:'localmonkey.com',         platform:'BigCommerce', status:'incomplete', modBy:{i:'AF',n:'Andrew F.'}, ago:'2 weeks ago' },
  'OrchardValleySupply.com': { domain:'orchardvalleysupply.com', platform:'WooCommerce', status:'incomplete', modBy:{i:'SJ',n:'Shilo J.'}, ago:'1 month ago' },
  'Sunmed.com':              { domain:'sunmed.com',              platform:'Shopify',     status:'complete',   modBy:{i:'AS',n:'Amy S.'}, ago:'3 days ago' },
  'RoyalSwimmingPools.com':  { domain:'royalswimmingpools.com',  platform:'Magento',     status:'incomplete', modBy:{i:'AF',n:'Andrew F.'}, ago:'2 days ago' },
  'MyBinding.com':           { domain:'mybinding.com',           platform:'Magento',     status:'complete',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'Today' },
  'IslandBeachGear.com':     { domain:'islandbeachgear.com',     platform:'Shopify',     status:'complete',   modBy:{i:'AS',n:'Amy S.'}, ago:'6 hours ago' },
  'TackleDirect.com':        { domain:'tackledirect.com',        platform:'Magento',     status:'complete',   modBy:{i:'AF',n:'Andrew F.'}, ago:'6 hours ago' },
  'NomadicVintageRugs.com':  { domain:'nomadicvintagerugs.com',  platform:'Shopify',     status:'complete',   modBy:{i:'SJ',n:'Shilo J.'}, ago:'8 days ago' }
};

/* ── Dropdown options ── */
var CM_OPTS = {
  status:   ['All', 'Active', 'Paused', 'Inactive'],
  sort:     ['Last Modified', 'Client Name (A–Z)', 'Client Name (Z–A)', 'Websites Count'],
  biztype:  ['eCommerce', 'Lead Generation', 'SaaS / Software', 'Healthcare', 'Education', 'Finance', 'Other'],
  platform: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Custom / Other'],
  slack:    ['#outdoor-research', '#link-imaging', '#monkeysports', '#dungarees', '#grovemade', '#general'],
  csm:      ['Shilo J.', 'Amy S.', 'Andrew F.', 'Alex P.', 'Chris L.'],
  sem:      ['Amy S.', 'Alex P.', 'Chris L.', 'Shilo J.', 'Andrew F.'],
  seo:      ['Andrew F.', 'Chris L.', 'Alex P.', 'Amy S.', 'Shilo J.'],
  prodcat:  ['Apparel & Accessories', 'Electronics', 'Home & Garden', 'Sports & Outdoors', 'Beauty & Personal Care', 'Food & Beverage', 'Industrial & Commercial', 'Other'],
  rtime:    ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'],
  channel:  ['Google Ads', 'Microsoft Ads', 'Meta Ads', 'Amazon Ads']
};

/* ── State ── */
var _s = {
  statusFilter: 'Active',
  sortFilter: 'Last Modified',
  search: '',
  currentClient: null,    // client name string
  obStep: 0,             // current onboarding tab 0-6
  obUnlocked: 0,         // highest unlocked tab
  obCompleted: [],       // array of completed step indices
  obNewClientName: '',
  obNewBizType: '',
  obNewWebsiteName: '',
  competitors: [],
  recipients: [],
  selectedDays: [],
  acctCount: 1,
  editMode: false,
  openPanel: null
};

/* ── Helpers ── */
function $id(id) { return document.getElementById(id); }

function cmAvatar(initials, bg) {
  return '<div class="cm-avatar" style="background:' + (bg || '#346ed9') + ';">' + initials + '</div>';
}

function cmBadge(status) {
  if (status === 'active')   return '<span class="cm-badge cm-badge-active">Active</span>';
  if (status === 'paused')   return '<span class="cm-badge cm-badge-warn">Paused</span>';
  if (status === 'inactive') return '<span class="cm-badge cm-badge-inactive">Inactive</span>';
  return '';
}

function cmObBadge(status) {
  if (status === 'complete')   return '<span class="cm-badge cm-badge-complete">Complete</span>';
  if (status === 'incomplete') return '<span class="cm-badge cm-badge-incomplete">Incomplete</span>';
  return '';
}

/* ── View switching ── */
function cmShowView(viewId) {
  ['cm-view-list','cm-view-websites','cm-view-client-form','cm-view-onboarding'].forEach(function(id) {
    var el = $id(id);
    if (el) el.style.display = id === viewId ? '' : 'none';
  });
  window.scrollTo(0, 0);
}

/* ── Dropdown machinery ── */
function cmCloseAllPanels() {
  document.querySelectorAll('.cm-dd-panel').forEach(function(p) { p.style.display = 'none'; });
  document.querySelectorAll('.cm-action-menu').forEach(function(m) { m.classList.remove('cm-menu-open'); });
  _s.openPanel = null;
}

function cmOpenPanel(panelId, btnEl) {
  cmCloseAllPanels();
  var panel = $id(panelId);
  if (!panel) return;
  var rect = btnEl.getBoundingClientRect();
  panel.style.top    = (rect.bottom + 4) + 'px';
  panel.style.left   = rect.left + 'px';
  panel.style.display = 'block';
  _s.openPanel = panelId;
}

function cmPopulatePanel(panelId, opts, currentVal, onSelect) {
  var panel = $id(panelId);
  if (!panel) return;
  panel.innerHTML = opts.map(function(o) {
    var sel = o === currentVal ? ' cm-dd-sel' : '';
    return '<div class="cm-dd-item' + sel + '" data-val="' + o + '">' + o + '</div>';
  }).join('');
  panel.addEventListener('click', function(e) {
    var item = e.target.closest('.cm-dd-item');
    if (!item) return;
    onSelect(item.getAttribute('data-val'));
    cmCloseAllPanels();
  });
}

/* ── Client list ── */
function cmRenderClientTable() {
  var tbody = $id('cm-client-tbody');
  if (!tbody) return;

  var clients = (typeof ARGOS_CLIENTS !== 'undefined') ? ARGOS_CLIENTS : [];
  var search = _s.search.toLowerCase();

  // Filter
  var filtered = clients.filter(function(c) {
    var meta = CM_CLIENT_META[c.name] || {};
    var matchSearch = !search || c.name.toLowerCase().indexOf(search) > -1;
    var matchStatus = _s.statusFilter === 'All' || (meta.status || 'active') === _s.statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  // Sort
  filtered.sort(function(a, b) {
    if (_s.sortFilter === 'Client Name (A–Z)') return a.name.localeCompare(b.name);
    if (_s.sortFilter === 'Client Name (Z–A)') return b.name.localeCompare(a.name);
    if (_s.sortFilter === 'Websites Count') return b.websites.length - a.websites.length;
    // Last Modified — keep ARGOS_CLIENTS order as proxy (recent first)
    return 0;
  });

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td class="cm-td" colspan="5" style="text-align:center; color:var(--color-text-caption); padding:40px 14px;">No clients match your filters.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(function(c) {
    var meta = CM_CLIENT_META[c.name] || { status:'active', modBy:{i:'?',n:'Unknown'}, ago:'—' };
    return '<tr class="cm-tr" data-client="' + encodeURIComponent(c.name) + '">' +
      '<td class="cm-td"><button class="cm-client-name-btn" data-cm-client="' + encodeURIComponent(c.name) + '">' + c.name + '</button></td>' +
      '<td class="cm-td">' + c.websites.length + '</td>' +
      '<td class="cm-td"><div class="cm-modified-cell">' + cmAvatar(meta.modBy.i) + '<span class="cm-modified-name">' + meta.modBy.n + '</span><span class="cm-modified-time">· ' + meta.ago + '</span></div></td>' +
      '<td class="cm-td">' + cmBadge(meta.status) + '</td>' +
      '<td class="cm-td" style="width:50px; text-align:center;">' +
        '<div class="cm-action-wrap">' +
          '<button class="cm-dots-btn" data-cm-menu="' + encodeURIComponent(c.name) + '" title="Actions">···</button>' +
          '<div class="cm-action-menu" id="cm-menu-' + encodeURIComponent(c.name) + '">' +
            '<div class="cm-dd-item" data-cm-action="websites" data-cm-client="' + encodeURIComponent(c.name) + '">View Websites</div>' +
            '<div class="cm-dd-item" data-cm-action="edit" data-cm-client="' + encodeURIComponent(c.name) + '">Edit Client</div>' +
            '<div class="cm-dd-divider"></div>' +
            '<div class="cm-dd-item cm-dd-danger" data-cm-action="deactivate" data-cm-client="' + encodeURIComponent(c.name) + '">Deactivate</div>' +
          '</div>' +
        '</div>' +
      '</td>' +
    '</tr>';
  }).join('');
}

/* ── Website list ── */
function cmRenderWebsiteTable(clientName) {
  var clients = (typeof ARGOS_CLIENTS !== 'undefined') ? ARGOS_CLIENTS : [];
  var client  = clients.find(function(c) { return c.name === clientName; });
  if (!client) return;

  $id('cm-websites-title').textContent = clientName;
  $id('cm-websites-subtitle').textContent = client.websites.length + ' website' + (client.websites.length !== 1 ? 's' : '');

  var tbody = $id('cm-website-tbody');
  if (!tbody) return;

  tbody.innerHTML = client.websites.map(function(siteName) {
    var d = CM_WEBSITE_DETAIL[siteName] || { domain: siteName.toLowerCase(), platform:'Shopify', status:'incomplete', modBy:{i:'?',n:'Unknown'}, ago:'—' };
    return '<tr class="cm-tr">' +
      '<td class="cm-td"><button class="cm-client-name-btn" data-cm-view-site="' + encodeURIComponent(siteName) + '">' + siteName + '</button></td>' +
      '<td class="cm-td" style="color:var(--color-text-caption);">' + d.domain + '</td>' +
      '<td class="cm-td">' + d.platform + '</td>' +
      '<td class="cm-td">' + cmObBadge(d.status) + '</td>' +
      '<td class="cm-td"><div class="cm-modified-cell">' + cmAvatar(d.modBy.i) + '<span class="cm-modified-time">· ' + d.ago + '</span></div></td>' +
      '<td class="cm-td" style="width:80px;">' +
        '<div style="display:flex; gap:6px;">' +
          '<button class="cm-btn-outline cm-btn-sm" data-cm-action="view-site" data-cm-site="' + encodeURIComponent(siteName) + '" title="View summary" style="padding:4px 8px;">' +
            '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
          '</button>' +
          '<button class="cm-btn-outline cm-btn-sm" data-cm-action="edit-site" data-cm-site="' + encodeURIComponent(siteName) + '" title="Edit onboarding" style="padding:4px 8px;">' +
            '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
          '</button>' +
        '</div>' +
      '</td>' +
    '</tr>';
  }).join('');
}

/* ── Onboarding progress ── */
function cmUpdateProgress() {
  var done = _s.obCompleted.length;
  var total = 7;
  var pct = Math.round((done / total) * 100);
  var fill = $id('cm-ob-progress-fill');
  var label = $id('cm-ob-progress-label');
  var clLabel = $id('cm-ob-checklist-label');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = 'Onboarding Checklist ' + done + '/' + total + ' · ' + pct + '% complete';
  if (clLabel) clLabel.textContent = 'Onboarding Checklist ' + done + '/' + total;
}

function cmUpdateTabs() {
  document.querySelectorAll('[data-cm-ob-tab]').forEach(function(tab) {
    var idx = parseInt(tab.getAttribute('data-cm-ob-tab'));
    tab.classList.remove('cm-tab-active', 'cm-tab-disabled');
    if (idx === _s.obStep) {
      tab.classList.add('cm-tab-active');
    } else if (idx > _s.obUnlocked) {
      tab.classList.add('cm-tab-disabled');
    }
  });
}

function cmShowStep(idx) {
  _s.obStep = idx;
  document.querySelectorAll('.cm-step-panel').forEach(function(p, i) {
    p.style.display = i === idx ? '' : 'none';
  });
  $id('cm-ob-steps').style.display = '';
  var success = $id('cm-ob-success');
  if (success) success.style.display = 'none';
  cmUpdateTabs();
}

function cmCompleteStep(idx) {
  if (_s.obCompleted.indexOf(idx) === -1) _s.obCompleted.push(idx);
  if (idx + 1 > _s.obUnlocked) _s.obUnlocked = idx + 1;
  cmUpdateProgress();
  cmUpdateTabs();
}

/* ── Budget & COS rows (step 3) ── */
function cmRenderBudgetRows() {
  var container = $id('cm-budget-rows');
  if (!container) return;
  var accounts = [];
  for (var i = 0; i < _s.acctCount; i++) {
    var chLabel = $id('cm-lbl-acct-channel-' + i);
    accounts.push(chLabel ? chLabel.textContent : ('Account ' + (i+1)));
  }
  container.innerHTML = accounts.map(function(name, i) {
    return '<div class="cm-budget-row">' +
      '<span style="font-size:13px; color:var(--color-text-subtitle); font-family:\'DM Sans\',sans-serif; min-width:120px;">' + (name === 'Select channel…' ? 'Account ' + (i+1) : name) + '</span>' +
      '<input type="text" class="cm-input" placeholder="$0" style="width:120px;" id="cm-budget-val-' + i + '">' +
      '<span style="font-size:12px; color:var(--color-text-caption); font-family:\'DM Sans\',sans-serif;">/month</span>' +
    '</div>';
  }).join('');
}

function cmRenderCOSRows() {
  var container = $id('cm-cos-rows');
  if (!container) return;
  var cats = ['Brand Search', 'Non-Brand Search', 'Shopping', 'Performance Max', 'Display'];
  container.innerHTML = cats.map(function(cat) {
    return '<div class="cm-cos-row">' +
      '<span class="cm-cos-label">' + cat + '</span>' +
      '<input type="text" class="cm-cos-input" placeholder="0%" id="cm-cos-' + cat.replace(/\s+/g,'-').toLowerCase() + '">' +
    '</div>';
  }).join('');
}

/* ── Add account tab (step 2) ── */
function cmAddAccountTab() {
  var idx = _s.acctCount;
  _s.acctCount++;

  // Add tab button
  var tabContainer = $id('cm-acct-tabs');
  var addBtn = $id('cm-add-acct-btn');
  var newTab = document.createElement('button');
  newTab.className = 'cm-account-tab';
  newTab.setAttribute('data-cm-acct', idx);
  newTab.textContent = 'Account ' + (idx + 1);
  tabContainer.insertBefore(newTab, addBtn);

  // Add panel
  var panelContainer = $id('cm-acct-panels');
  var div = document.createElement('div');
  div.className = 'cm-acct-panel';
  div.id = 'cm-acct-' + idx;
  div.style.maxWidth = '480px';
  div.style.display = 'none';
  div.innerHTML =
    '<div class="cm-form-field">' +
      '<label class="cm-label">Channel <span class="cm-req">*</span></label>' +
      '<div style="position:relative;">' +
        '<button class="cm-dd-btn" id="cm-btn-acct-channel-' + idx + '" style="width:100%; justify-content:space-between;">' +
          '<span id="cm-lbl-acct-channel-' + idx + '">Select channel…</span>' +
          '<svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>' +
        '</button>' +
        '<div class="cm-dd-panel" id="cm-panel-acct-channel-' + idx + '"></div>' +
      '</div>' +
    '</div>' +
    '<div class="cm-form-field">' +
      '<label class="cm-label">Account ID <span class="cm-req">*</span></label>' +
      '<div class="cm-input-wrap"><input type="text" class="cm-input" id="cm-acct-id-' + idx + '" placeholder="e.g. 693-516-996"></div>' +
    '</div>' +
    '<div class="cm-form-field">' +
      '<label class="cm-label">Start Date</label>' +
      '<div class="cm-input-wrap"><input type="date" class="cm-input" id="cm-acct-start-' + idx + '"></div>' +
    '</div>' +
    '<button class="cm-btn-outline cm-btn-sm" id="cm-acct-test-' + idx + '">Test Connection</button>' +
    '<button class="cm-remove-link" id="cm-acct-remove-' + idx + '" style="margin-top:12px;">' +
      '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>' +
      ' Remove Account' +
    '</button>';
  panelContainer.appendChild(div);

  cmSwitchAccountTab(idx);
  cmPopulateChannelDropdown(idx);
}

function cmSwitchAccountTab(idx) {
  document.querySelectorAll('.cm-account-tab[data-cm-acct]').forEach(function(t) {
    t.classList.toggle('cm-acct-active', parseInt(t.getAttribute('data-cm-acct')) === idx);
  });
  document.querySelectorAll('.cm-acct-panel').forEach(function(p) {
    p.style.display = 'none';
  });
  var panel = $id('cm-acct-' + idx);
  if (panel) panel.style.display = '';
}

function cmPopulateChannelDropdown(idx) {
  cmPopulatePanel('cm-panel-acct-channel-' + idx, CM_OPTS.channel, null, function(val) {
    var lbl = $id('cm-lbl-acct-channel-' + idx);
    if (lbl) lbl.textContent = val;
  });
}

/* ── Tag pill helpers ── */
function cmAddTag(containerId, value, arr) {
  if (!value || arr.indexOf(value) > -1) return;
  arr.push(value);
  cmRenderTags(containerId, arr);
}

function cmRenderTags(containerId, arr) {
  var container = $id(containerId);
  if (!container) return;
  container.innerHTML = arr.map(function(v, i) {
    return '<span class="cm-tag">' + v + '<button class="cm-tag-x" data-tag-idx="' + i + '" data-tag-container="' + containerId + '">×</button></span>';
  }).join('');
}

/* ── Website modal ── */
function cmShowWebsiteModal(siteName) {
  var d = CM_WEBSITE_DETAIL[decodeURIComponent(siteName)] || {};
  $id('cm-wm-title').textContent = decodeURIComponent(siteName);
  $id('cm-website-modal').style.display = 'flex';
}

/* ── Checklist modal ── */
var CM_STEP_LABELS = ['Basic Info', 'SEO', 'Ads Accounts', 'Budget & Targets', 'Google Tools', 'Account Team', 'Email Reporting'];
function cmShowChecklistModal() {
  var body = $id('cm-cl-body');
  if (!body) return;
  body.innerHTML = CM_STEP_LABELS.map(function(label, i) {
    var done = _s.obCompleted.indexOf(i) > -1;
    return '<div class="cm-checklist-item">' +
      (done
        ? '<svg class="cm-check-done" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg class="cm-check-todo" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>') +
      '<span>' + label + '</span>' +
    '</div>';
  }).join('');
  $id('cm-checklist-modal').style.display = 'flex';
}

/* ── Show onboarding view ── */
function cmStartOnboarding(websiteName) {
  _s.obStep = 0;
  _s.obUnlocked = 0;
  _s.obCompleted = [];
  _s.competitors = [];
  _s.recipients = [];
  _s.selectedDays = [];
  _s.acctCount = 1;

  // Reset form fields
  ['cm-ob-site-name','cm-ob-domain','cm-ob-comp-input','cm-recipient-input','cm-tool-ga4','cm-tool-gmc','cm-tool-gsc'].forEach(function(id) {
    var el = $id(id); if (el) el.value = '';
  });
  // Reset platform dropdown
  var plbl = $id('cm-lbl-platform'); if (plbl) plbl.textContent = 'Select platform…';
  // Reset slack/csm/sem/seo
  ['cm-lbl-slack','cm-lbl-csm','cm-lbl-sem','cm-lbl-seo'].forEach(function(id) {
    var el = $id(id); if (el) el.textContent = id.replace('cm-lbl-','').charAt(0).toUpperCase() + id.replace('cm-lbl-','').slice(1) + '…';
  });
  $id('cm-lbl-slack').textContent = 'Select channel…';
  $id('cm-lbl-csm').textContent   = 'Select CSM…';
  $id('cm-lbl-sem').textContent   = 'Select SEM Analyst…';
  $id('cm-lbl-seo').textContent   = 'Select SEO Analyst…';
  // Reset rtime
  var rtime = $id('cm-lbl-rtime'); if (rtime) rtime.textContent = '08:00';
  // Reset prodcat
  var pcat = $id('cm-lbl-prodcat'); if (pcat) pcat.textContent = 'Select category…';
  // Tags
  var ct = $id('cm-ob-comp-tags'); if (ct) ct.innerHTML = '';
  var rt = $id('cm-recipient-tags'); if (rt) rt.innerHTML = '';
  // Day pills
  document.querySelectorAll('.cm-day-pill').forEach(function(p) { p.classList.remove('cm-day-active'); });
  // No-email checkbox
  var ne = $id('cm-no-email'); if (ne) ne.checked = false;
  var eb = $id('cm-email-body'); if (eb) eb.style.display = '';
  // Account tabs — reset to 1
  var acctTabs = $id('cm-acct-tabs');
  if (acctTabs) {
    document.querySelectorAll('.cm-account-tab[data-cm-acct]').forEach(function(t) {
      if (parseInt(t.getAttribute('data-cm-acct')) > 0) t.remove();
    });
  }
  _s.acctCount = 1;
  cmSwitchAccountTab(0);
  // Reset channel 0
  var clbl0 = $id('cm-lbl-acct-channel-0'); if (clbl0) clbl0.textContent = 'Select channel…';
  var id0 = $id('cm-acct-id-0'); if (id0) id0.value = '';
  var res0 = $id('cm-acct-result-0'); if (res0) res0.classList.remove('cm-test-visible');
  // Google test successes
  ['cm-ga4-success','cm-gmc-success','cm-gsc-success'].forEach(function(id) {
    var el = $id(id); if (el) el.classList.remove('cm-test-shown');
  });
  ['cm-ga4-confirm-wrap','cm-gmc-confirm-wrap','cm-gsc-confirm-wrap'].forEach(function(id) {
    var el = $id(id); if (el) el.style.display = 'none';
  });
  // Checklist button
  var clBtn = $id('cm-ob-checklist-btn'); if (clBtn) clBtn.style.display = 'none';

  // Populate dropdowns
  cmPopulatePanel('cm-panel-platform', CM_OPTS.platform, null, function(val) {
    $id('cm-lbl-platform').textContent = val;
  });
  cmPopulatePanel('cm-panel-slack', CM_OPTS.slack, null, function(val) {
    $id('cm-lbl-slack').textContent = val;
  });
  cmPopulatePanel('cm-panel-csm', CM_OPTS.csm, null, function(val) {
    $id('cm-lbl-csm').textContent = val;
  });
  cmPopulatePanel('cm-panel-sem', CM_OPTS.sem, null, function(val) {
    $id('cm-lbl-sem').textContent = val;
  });
  cmPopulatePanel('cm-panel-seo', CM_OPTS.seo, null, function(val) {
    $id('cm-lbl-seo').textContent = val;
  });
  cmPopulatePanel('cm-panel-rtime', CM_OPTS.rtime, '08:00', function(val) {
    $id('cm-lbl-rtime').textContent = val;
  });
  cmPopulatePanel('cm-panel-prodcat', CM_OPTS.prodcat, null, function(val) {
    $id('cm-lbl-prodcat').textContent = val;
  });
  cmPopulateChannelDropdown(0);

  // Update title
  var title = $id('cm-ob-title');
  if (title) title.textContent = websiteName ? 'Add a Website' : 'Add a Website';

  cmUpdateProgress();
  cmShowStep(0);
  cmShowView('cm-view-onboarding');
}

/* ── Entry point ── */
function showClientManagementPage() {
  if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
  var page = $id('client-management-page');
  if (page) page.style.display = 'block';

  // Populate filter dropdowns
  cmPopulatePanel('cm-panel-status', CM_OPTS.status, _s.statusFilter, function(val) {
    _s.statusFilter = val;
    $id('cm-lbl-status').textContent = val;
    cmRenderClientTable();
  });
  cmPopulatePanel('cm-panel-sort', CM_OPTS.sort, _s.sortFilter, function(val) {
    _s.sortFilter = val;
    $id('cm-lbl-sort').textContent = val;
    cmRenderClientTable();
  });

  cmShowView('cm-view-list');
  cmRenderClientTable();
  window.scrollTo(0, 0);
}
window.showClientManagementPage = showClientManagementPage;

/* ── Event delegation ── */
document.addEventListener('click', function(e) {
  // Close panels when clicking outside
  if (!e.target.closest('.cm-dd-btn') && !e.target.closest('.cm-dd-panel') && !e.target.closest('.cm-dots-btn') && !e.target.closest('.cm-action-menu')) {
    cmCloseAllPanels();
  }

  // Filter dropdowns
  if (e.target.closest('#cm-btn-status')) { cmOpenPanel('cm-panel-status', $id('cm-btn-status')); return; }
  if (e.target.closest('#cm-btn-sort'))   { cmOpenPanel('cm-panel-sort', $id('cm-btn-sort')); return; }

  // Client name link → websites view
  var clientBtn = e.target.closest('[data-cm-client]');
  if (clientBtn && !clientBtn.closest('.cm-action-menu')) {
    var name = decodeURIComponent(clientBtn.getAttribute('data-cm-client'));
    _s.currentClient = name;
    cmRenderWebsiteTable(name);
    cmShowView('cm-view-websites');
    return;
  }

  // 3-dot menu toggle
  var dotsBtn = e.target.closest('[data-cm-menu]');
  if (dotsBtn) {
    e.stopPropagation();
    var menuId = 'cm-menu-' + dotsBtn.getAttribute('data-cm-menu');
    var menu = $id(menuId);
    if (menu) {
      var isOpen = menu.classList.contains('cm-menu-open');
      cmCloseAllPanels();
      if (!isOpen) menu.classList.add('cm-menu-open');
    }
    return;
  }

  // Action menu items
  var actionItem = e.target.closest('[data-cm-action]');
  if (actionItem) {
    var action = actionItem.getAttribute('data-cm-action');
    var clientName = actionItem.getAttribute('data-cm-client') ? decodeURIComponent(actionItem.getAttribute('data-cm-client')) : _s.currentClient;
    cmCloseAllPanels();

    if (action === 'websites') {
      _s.currentClient = clientName;
      cmRenderWebsiteTable(clientName);
      cmShowView('cm-view-websites');
    } else if (action === 'edit') {
      _s.editMode = true;
      _s.obNewClientName = clientName;
      $id('cm-form-title').textContent = 'Edit Client';
      $id('cm-f-name').value = clientName;
      cmShowView('cm-view-client-form');
    } else if (action === 'view-site') {
      cmShowWebsiteModal(actionItem.getAttribute('data-cm-site'));
    } else if (action === 'edit-site') {
      var siteName = decodeURIComponent(actionItem.getAttribute('data-cm-site'));
      cmStartOnboarding(siteName);
    }
    return;
  }

  // Add client
  if (e.target.closest('#cm-add-client-btn')) {
    _s.editMode = false;
    _s.obNewClientName = '';
    $id('cm-form-title').textContent = 'Add a Client';
    $id('cm-f-name').value = '';
    $id('cm-lbl-biztype').textContent = 'Select type…';
    _s.obNewBizType = '';
    var fe = $id('cm-f-name-err'); if (fe) fe.classList.remove('cm-err-visible');
    var be = $id('cm-f-biz-err'); if (be) be.classList.remove('cm-err-visible');
    cmPopulatePanel('cm-panel-biztype', CM_OPTS.biztype, null, function(val) {
      _s.obNewBizType = val;
      $id('cm-lbl-biztype').textContent = val;
      var err = $id('cm-f-biz-err'); if (err) err.classList.remove('cm-err-visible');
    });
    cmShowView('cm-view-client-form');
    return;
  }

  // Form Next button
  if (e.target.closest('#cm-form-next-btn')) {
    var nameVal = ($id('cm-f-name').value || '').trim();
    var bizVal  = _s.obNewBizType;
    var ok = true;
    var fne = $id('cm-f-name-err'); var fbe = $id('cm-f-biz-err');
    if (nameVal.length < 2 || nameVal.length > 30) { if (fne) fne.classList.add('cm-err-visible'); ok = false; } else { if (fne) fne.classList.remove('cm-err-visible'); }
    if (!bizVal) { if (fbe) fbe.classList.add('cm-err-visible'); ok = false; } else { if (fbe) fbe.classList.remove('cm-err-visible'); }
    if (ok) {
      _s.obNewClientName = nameVal;
      cmStartOnboarding('');
    }
    return;
  }

  // Form cancel / back
  if (e.target.closest('#cm-form-back-btn') || e.target.closest('#cm-form-cancel-btn')) {
    cmShowView('cm-view-list');
    return;
  }

  // Business type dropdown
  if (e.target.closest('#cm-btn-biztype')) {
    cmOpenPanel('cm-panel-biztype', $id('cm-btn-biztype'));
    return;
  }

  // Back to list from websites
  if (e.target.closest('#cm-back-to-list-btn')) {
    cmShowView('cm-view-list');
    return;
  }

  // Add website (from website view)
  if (e.target.closest('#cm-add-website-btn')) {
    cmStartOnboarding('');
    return;
  }

  // Eye button (view site modal)
  if (e.target.closest('[data-cm-view-site]')) {
    cmShowWebsiteModal(e.target.closest('[data-cm-view-site]').getAttribute('data-cm-view-site'));
    return;
  }

  // Onboarding back button
  if (e.target.closest('#cm-ob-back-btn')) {
    if (_s.obStep > 0) {
      cmShowStep(_s.obStep - 1);
    } else {
      if (_s.currentClient) {
        cmRenderWebsiteTable(_s.currentClient);
        cmShowView('cm-view-websites');
      } else {
        cmShowView('cm-view-client-form');
      }
    }
    return;
  }

  // Checklist button
  if (e.target.closest('#cm-ob-checklist-btn')) {
    cmShowChecklistModal();
    return;
  }

  // Onboarding tabs
  var obTab = e.target.closest('[data-cm-ob-tab]');
  if (obTab && !obTab.classList.contains('cm-tab-disabled')) {
    cmShowStep(parseInt(obTab.getAttribute('data-cm-ob-tab')));
    return;
  }

  // Account sub-tabs
  var acctTab = e.target.closest('.cm-account-tab[data-cm-acct]');
  if (acctTab) {
    cmSwitchAccountTab(parseInt(acctTab.getAttribute('data-cm-acct')));
    return;
  }

  // Add account button
  if (e.target.closest('#cm-add-acct-btn')) {
    cmAddAccountTab();
    return;
  }

  // Test connection (account)
  var testAcct = e.target.closest('[id^="cm-acct-test-"]');
  if (testAcct) {
    var acctIdx = testAcct.id.replace('cm-acct-test-','');
    var res = $id('cm-acct-result-' + acctIdx);
    if (res) { res.classList.add('cm-test-visible'); }
    return;
  }

  // Remove account
  var removeAcct = e.target.closest('[id^="cm-acct-remove-"]');
  if (removeAcct) {
    var ridx = parseInt(removeAcct.id.replace('cm-acct-remove-',''));
    var panel = $id('cm-acct-' + ridx);
    var tab = document.querySelector('.cm-account-tab[data-cm-acct="' + ridx + '"]');
    if (panel) panel.remove();
    if (tab) tab.remove();
    if (_s.acctCount > 1) _s.acctCount--;
    cmSwitchAccountTab(0);
    return;
  }

  // Step 0 save
  if (e.target.closest('#cm-step0-save')) {
    var siteName = ($id('cm-ob-site-name').value||'').trim();
    var domain = ($id('cm-ob-domain').value||'').trim();
    var platform = $id('cm-lbl-platform').textContent;
    if (!siteName || !domain || platform === 'Select platform…') {
      // Simple: just proceed anyway in prototype
    }
    cmCompleteStep(0);
    var clBtn = $id('cm-ob-checklist-btn');
    if (clBtn) clBtn.style.display = '';
    cmShowStep(1);
    return;
  }

  // Step 1 save
  if (e.target.closest('#cm-step1-save')) {
    if (_s.competitors.length === 0) {
      var err = $id('cm-ob-comp-err'); if (err) err.classList.add('cm-err-visible');
      return;
    }
    var err = $id('cm-ob-comp-err'); if (err) err.classList.remove('cm-err-visible');
    cmCompleteStep(1);
    cmShowStep(2);
    return;
  }

  // Add competitor
  if (e.target.closest('#cm-ob-comp-add')) {
    var inp = $id('cm-ob-comp-input');
    if (inp) { cmAddTag('cm-ob-comp-tags', inp.value.trim(), _s.competitors); inp.value = ''; }
    return;
  }

  // Step 2 save
  if (e.target.closest('#cm-step2-save')) {
    cmCompleteStep(2);
    cmRenderBudgetRows();
    cmRenderCOSRows();
    cmShowStep(3);
    return;
  }

  // Add budget row
  if (e.target.closest('#cm-add-budget-btn')) {
    // Just re-render with current accounts
    cmRenderBudgetRows();
    return;
  }

  // Step 3 save
  if (e.target.closest('#cm-step3-save')) {
    cmCompleteStep(3);
    cmShowStep(4);
    return;
  }

  // Google tool tests
  if (e.target.closest('#cm-test-ga4')) {
    var s = $id('cm-ga4-success'); var w = $id('cm-ga4-confirm-wrap');
    if (s) s.classList.add('cm-test-shown');
    if (w) w.style.display = 'block';
    return;
  }
  if (e.target.closest('#cm-test-gmc')) {
    var s = $id('cm-gmc-success'); var w = $id('cm-gmc-confirm-wrap');
    if (s) s.classList.add('cm-test-shown');
    if (w) w.style.display = 'block';
    return;
  }
  if (e.target.closest('#cm-test-gsc')) {
    var s = $id('cm-gsc-success'); var w = $id('cm-gsc-confirm-wrap');
    if (s) s.classList.add('cm-test-shown');
    if (w) w.style.display = 'block';
    return;
  }

  // Step 4 save
  if (e.target.closest('#cm-step4-save')) {
    cmCompleteStep(4);
    cmShowStep(5);
    return;
  }

  // Step 5 dropdowns
  if (e.target.closest('#cm-btn-slack')) { cmOpenPanel('cm-panel-slack', $id('cm-btn-slack')); return; }
  if (e.target.closest('#cm-btn-csm'))   { cmOpenPanel('cm-panel-csm', $id('cm-btn-csm')); return; }
  if (e.target.closest('#cm-btn-sem'))   { cmOpenPanel('cm-panel-sem', $id('cm-btn-sem')); return; }
  if (e.target.closest('#cm-btn-seo'))   { cmOpenPanel('cm-panel-seo', $id('cm-btn-seo')); return; }

  // Step 5 save
  if (e.target.closest('#cm-step5-save')) {
    cmCompleteStep(5);
    cmShowStep(6);
    return;
  }

  // Step 6 dropdowns
  if (e.target.closest('#cm-btn-rtime'))   { cmOpenPanel('cm-panel-rtime', $id('cm-btn-rtime')); return; }
  if (e.target.closest('#cm-btn-prodcat')) { cmOpenPanel('cm-panel-prodcat', $id('cm-btn-prodcat')); return; }

  // Add recipient
  if (e.target.closest('#cm-recipient-add')) {
    var inp = $id('cm-recipient-input');
    if (inp) { cmAddTag('cm-recipient-tags', inp.value.trim(), _s.recipients); inp.value = ''; }
    return;
  }

  // Day pills
  var dayPill = e.target.closest('.cm-day-pill');
  if (dayPill) {
    var day = dayPill.getAttribute('data-day');
    var dayIdx = _s.selectedDays.indexOf(day);
    if (dayIdx > -1) { _s.selectedDays.splice(dayIdx, 1); dayPill.classList.remove('cm-day-active'); }
    else { _s.selectedDays.push(day); dayPill.classList.add('cm-day-active'); }
    return;
  }

  // Step 6 save (complete)
  if (e.target.closest('#cm-step6-save')) {
    cmCompleteStep(6);
    cmUpdateProgress();
    // Show success state
    var stepsContainer = $id('cm-ob-steps');
    document.querySelectorAll('.cm-step-panel').forEach(function(p) { p.style.display = 'none'; });
    var success = $id('cm-ob-success');
    if (success) success.style.display = '';
    var successTitle = $id('cm-success-title');
    if (successTitle) successTitle.textContent = (_s.obNewWebsiteName || 'Website') + ' | Onboarding Successful';
    return;
  }

  // Success back button
  if (e.target.closest('#cm-success-back-btn')) {
    if (_s.currentClient) {
      cmRenderWebsiteTable(_s.currentClient);
      cmShowView('cm-view-websites');
    } else {
      cmShowView('cm-view-list');
    }
    return;
  }

  // Platform dropdown in step 0
  if (e.target.closest('#cm-btn-platform')) {
    cmOpenPanel('cm-panel-platform', $id('cm-btn-platform'));
    return;
  }

  // Channel dropdowns in step 2 (dynamic)
  var chanBtn = e.target.closest('[id^="cm-btn-acct-channel-"]');
  if (chanBtn) {
    var chanIdx = chanBtn.id.replace('cm-btn-acct-channel-','');
    cmPopulateChannelDropdown(chanIdx);
    cmOpenPanel('cm-panel-acct-channel-' + chanIdx, chanBtn);
    return;
  }

  // Tag remove buttons
  var tagX = e.target.closest('.cm-tag-x');
  if (tagX) {
    var idx = parseInt(tagX.getAttribute('data-tag-idx'));
    var containerId = tagX.getAttribute('data-tag-container');
    if (containerId === 'cm-ob-comp-tags') { _s.competitors.splice(idx, 1); cmRenderTags(containerId, _s.competitors); }
    if (containerId === 'cm-recipient-tags') { _s.recipients.splice(idx, 1); cmRenderTags(containerId, _s.recipients); }
    return;
  }

  // Website modal close
  if (e.target.closest('#cm-wm-close') || (e.target === $id('cm-website-modal'))) {
    $id('cm-website-modal').style.display = 'none';
    return;
  }

  // Checklist modal close
  if (e.target.closest('#cm-cl-close') || (e.target === $id('cm-checklist-modal'))) {
    $id('cm-checklist-modal').style.display = 'none';
    return;
  }
});

/* ── No-email checkbox ── */
document.addEventListener('change', function(e) {
  if (e.target && e.target.id === 'cm-no-email') {
    var body = $id('cm-email-body');
    if (body) body.style.display = e.target.checked ? 'none' : '';
  }
});

/* ── Search input ── */
document.addEventListener('input', function(e) {
  if (e.target && e.target.id === 'cm-search-input') {
    _s.search = e.target.value;
    cmRenderClientTable();
  }
});

/* ── Competitor input: Enter key ── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    if (e.target && e.target.id === 'cm-ob-comp-input') {
      cmAddTag('cm-ob-comp-tags', e.target.value.trim(), _s.competitors);
      e.target.value = '';
      e.preventDefault();
    }
    if (e.target && e.target.id === 'cm-recipient-input') {
      cmAddTag('cm-recipient-tags', e.target.value.trim(), _s.recipients);
      e.target.value = '';
      e.preventDefault();
    }
  }
});

})();
