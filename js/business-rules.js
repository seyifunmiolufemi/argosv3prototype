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

