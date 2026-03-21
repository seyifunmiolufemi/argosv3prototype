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

