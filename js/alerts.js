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

