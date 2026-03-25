function initOnboarding() {

  var googleConnected = false;
  var msftConnected = false;
  var protoMode = 'analyst'; // 'analyst' | 'client'

  // ── Info banner messages per screen (client path only) ──
  var INFO_BANNERS = {
    'screen-signin':       'Client view — sign in with any credentials to explore the client experience.',
    'screen-signup':       'Prototype — enter any details to simulate account creation.',
    'screen-verify':       'Prototype — enter any 6-digit code (e.g. 123456) to continue.',
    'screen-forgot-email': 'Prototype — enter any email to simulate the password reset flow.',
    'screen-forgot-code':  'Prototype — enter any code to proceed to the next step.',
    'screen-new-password': 'Prototype — set any password to complete the reset simulation.',
    'screen-connect':      'Prototype — click any platform button to simulate connecting, or skip.',
    'screen-select':       'Prototype — select any categories to represent the client\'s goals.',
    'screen-startdate':    'Prototype — choose any start date for the data import simulation.'
  };

  function setInfoBanners(show) {
    Object.keys(INFO_BANNERS).forEach(function (screenId) {
      var bannerId = 'proto-banner-' + screenId;
      var screen = document.getElementById(screenId);
      if (!screen) return;
      var existing = document.getElementById(bannerId);
      if (!show) { if (existing) existing.remove(); return; }
      if (existing) return;
      var container = screen.querySelector('.form-inner') || screen.querySelector('.onboarding-layout');
      if (!container) return;
      var div = document.createElement('div');
      div.id = bannerId;
      div.style.cssText = 'background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:9px 12px;margin-bottom:10px;display:flex;align-items:flex-start;gap:7px;box-sizing:border-box;';
      div.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>' +
        '<span style="font-size:12px;color:#1d4ed8;font-family:\'DM Sans\',sans-serif;line-height:1.5;">' + INFO_BANNERS[screenId] + '</span>';
      container.insertBefore(div, container.firstChild);
    });
  }

  function updateProtoMode() {
    var isClient = protoMode === 'client';
    // Update pill styles
    var ap = document.getElementById('proto-pill-analyst');
    var cp = document.getElementById('proto-pill-client');
    if (ap) {
      ap.style.background    = isClient ? 'transparent' : 'var(--color-blue)';
      ap.style.borderColor   = isClient ? 'var(--color-border)' : 'var(--color-blue)';
      ap.style.color         = isClient ? 'var(--color-text-subtitle)' : '#fff';
      ap.style.fontWeight    = isClient ? 'normal' : '600';
    }
    if (cp) {
      cp.style.background    = isClient ? 'var(--color-blue)' : 'transparent';
      cp.style.borderColor   = isClient ? 'var(--color-blue)' : 'var(--color-border)';
      cp.style.color         = isClient ? '#fff' : 'var(--color-text-subtitle)';
      cp.style.fontWeight    = isClient ? '600' : 'normal';
    }
    // Toggle sign-up link visibility
    var signupRow = document.getElementById('signup-link-row');
    if (signupRow) signupRow.style.display = isClient ? '' : 'none';
    // Toggle info banners
    setInfoBanners(isClient);
  }

  function goTo(screenId) {
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
    var t = document.getElementById(screenId);
    if (t) t.classList.add('active');
    window.scrollTo(0, 0);
  }

  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 2500);
  }
  window.showToast = showToast;
  window.goToScreen = goTo;

  function checkContinueBtn() {
    var btn = document.getElementById('connect-next-btn');
    if (btn) btn.disabled = !(googleConnected && msftConnected);
  }

  function connectGoogle() {
    showToast('Connecting to Google…');
    setTimeout(function() {
      googleConnected = true;
      var card = document.getElementById('google-card');
      card.classList.add('connected');
      document.getElementById('google-badge').style.display = 'flex';
      document.getElementById('google-info-box').style.display = 'none';
      var btn = document.getElementById('google-oauth-btn');
      btn.classList.add('connected');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Google connected';
      btn.removeAttribute('data-action');
      checkContinueBtn();
    }, 1200);
  }

  function connectMsft() {
    showToast('Connecting to Microsoft…');
    setTimeout(function() {
      msftConnected = true;
      var card = document.getElementById('msft-card');
      card.classList.add('connected');
      document.getElementById('msft-badge').style.display = 'flex';
      document.getElementById('msft-info-box').style.display = 'none';
      var btn = document.getElementById('msft-oauth-btn');
      btn.classList.add('connected');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Microsoft connected';
      btn.removeAttribute('data-action');
      checkContinueBtn();
    }, 1200);
  }

  function checkPassword(val, prefix) {
    var p = prefix ? prefix + '-' : '';
    var u = document.getElementById(p + 'hint-upper');
    var n = document.getElementById(p + 'hint-number');
    var s = document.getElementById(p + 'hint-special');
    if (u) u.classList.toggle('met', /[A-Z]/.test(val));
    if (n) n.classList.toggle('met', /[0-9]/.test(val));
    if (s) s.classList.toggle('met', /[^A-Za-z0-9]/.test(val));
  }

  // Default date to 12 months ago
  var d = new Date(); d.setFullYear(d.getFullYear() - 1);
  var dateInput = document.getElementById('start-date');
  if (dateInput) dateInput.value = d.toISOString().split('T')[0];

  // Apply initial proto mode (analyst by default — hides sign-up link)
  updateProtoMode();

  // Sidebar handled by dashboard JS

  document.body.addEventListener('click', function(e) {
    // Proto mode switcher
    var protoEl = e.target.closest('[data-proto]');
    if (protoEl) {
      protoMode = protoEl.getAttribute('data-proto');
      updateProtoMode();
      return;
    }

    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');

    if (action === 'google') { showToast('Signing in with Google…'); setTimeout(function(){ goTo('screen-dashboard'); }, 700); }
      else if (action === 'signin') {
        var email = document.getElementById('signin-email').value.trim();
        var pw = document.getElementById('signin-password').value;
        if (!email || !pw) { showToast('Please fill in all fields'); return; }
        goTo('screen-dashboard');
      }
      else if (action === 'goto-signup') { goTo('screen-signup'); }
      else if (action === 'goto-signin') { goTo('screen-signin'); }
      else if (action === 'goto-forgot-email') { goTo('screen-forgot-email'); }
      else if (action === 'signup') {
        var company = document.getElementById('signup-company').value.trim();
        var email = document.getElementById('signup-email').value.trim();
        var pw = document.getElementById('signup-password').value;
        var confirm = document.getElementById('signup-confirm').value;
        if (!company || !email || !pw || !confirm) { showToast('Please fill in all fields'); return; }
        if (pw !== confirm) { showToast('Passwords do not match'); return; }
        goTo('screen-verify');
      }
      else if (action === 'verify') {
        var code = document.getElementById('verify-code').value.trim();
        if (code.length < 6) { showToast('Enter the 6-digit code'); return; }
        goTo('screen-connect');
      }
      else if (action === 'resend') { showToast('Code resent!'); }
      else if (action === 'forgot-email') {
        var email = document.getElementById('forgot-email').value.trim();
        if (!email) { showToast('Please enter your email'); return; }
        var disp = document.getElementById('reset-email-display');
        if (disp) disp.textContent = email;
        goTo('screen-forgot-code');
      }
      else if (action === 'goto-new-password') { goTo('screen-new-password'); }
      else if (action === 'new-password') {
        var pw = document.getElementById('new-password').value;
        var confirm = document.getElementById('new-confirm').value;
        if (!pw || !confirm) { showToast('Please fill in all fields'); return; }
        if (pw !== confirm) { showToast('Passwords do not match'); return; }
        showToast('Password updated!');
        setTimeout(function() { goTo('screen-signin'); }, 1500);
      }
      else if (action === 'connect-google') { connectGoogle(); }
      else if (action === 'connect-msft') { connectMsft(); }
      else if (action === 'connect-next') { goTo('screen-select'); }
      else if (action === 'goto-connect') { goTo('screen-connect'); }
      else if (action === 'goto-startdate') { goTo('screen-startdate'); }
      else if (action === 'goto-select') { goTo('screen-select'); }
      else if (action === 'finish-onboarding') {
        showToast('Setup complete! Loading your dashboard…');
        sessionStorage.setItem('newAccountSetup','1');
        setTimeout(function() { goTo('screen-dashboard'); }, 1000);
      }
    });

  document.body.addEventListener('input', function(e) {
    var pw = e.target.getAttribute('data-pw');
    if (pw === 'signup') checkPassword(e.target.value, '');
    if (pw === 'new') checkPassword(e.target.value, 'new');
  });

}
initOnboarding();
