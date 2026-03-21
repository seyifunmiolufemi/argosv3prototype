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

