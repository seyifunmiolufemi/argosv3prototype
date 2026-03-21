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

