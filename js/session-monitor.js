(function () {
  'use strict';

  // ── Mock user data ────────────────────────────────────────────────────────────
  var SM_USERS = [
    {
      id: 1,
      name: 'Arman Ali',
      email: 'arman@statbid.com',
      initials: 'AA',
      avatarColor: '#7c3aed',
      lastActive: '3/25/2026, 2:57:21 PM PDT',
      sessionCount: 1,
      features: [
        { module: 'Admin', feature: 'Client Management', visits: 1, time: '8m 20s', timeSeconds: 500, lastVisited: '3/25/2026, 3:06:02 PM PDT' }
      ],
      sessions: [
        { id: 1549, created: '3/25/2026, 2:57:21 PM PDT', expires: '4/1/2026, 2:57:21 PM PDT' }
      ]
    },
    {
      id: 2,
      name: 'Jeff McRitchie',
      email: 'jeff@statbid.com',
      initials: 'JM',
      avatarColor: '#2563eb',
      lastActive: '3/24/2026, 4:35:36 PM PDT',
      sessionCount: 1,
      features: [
        { module: 'SEM', feature: 'Feed Data Tool', visits: 3, time: '24m 10s', timeSeconds: 1450, lastVisited: '3/24/2026, 4:30:00 PM PDT' },
        { module: 'SEM', feature: 'Issue Center',   visits: 2, time: '12m 5s',  timeSeconds: 725,  lastVisited: '3/24/2026, 3:15:00 PM PDT' }
      ],
      sessions: [
        { id: 1521, created: '3/24/2026, 4:35:36 PM PDT', expires: '3/31/2026, 4:35:36 PM PDT' }
      ]
    },
    {
      id: 3,
      name: 'Ruben Guzman',
      email: 'ruben@statbid.com',
      initials: 'RG',
      avatarColor: '#16a34a',
      lastActive: '3/24/2026, 4:21:20 PM PDT',
      sessionCount: 2,
      features: [
        { module: 'Dev Tools', feature: 'Search Term Grader', visits: 5, time: '45m 30s', timeSeconds: 2730, lastVisited: '3/24/2026, 4:15:00 PM PDT' },
        { module: 'Dev Tools', feature: 'Feed Quality Check', visits: 2, time: '18m 20s', timeSeconds: 1100, lastVisited: '3/23/2026, 11:30:00 AM PDT' }
      ],
      sessions: [
        { id: 1518, created: '3/24/2026, 4:21:20 PM PDT', expires: '3/31/2026, 4:21:20 PM PDT' },
        { id: 1489, created: '3/22/2026, 9:00:00 AM PDT', expires: '3/29/2026, 9:00:00 AM PDT' }
      ]
    },
    {
      id: 4,
      name: 'Suraj Sintala',
      email: 'ssintala@windsorplywood.com',
      initials: 'SS',
      avatarColor: '#ea580c',
      lastActive: '3/24/2026, 1:42:27 PM PDT',
      sessionCount: 1,
      features: [
        { module: 'Reports', feature: 'Overview', visits: 4, time: '22m 40s', timeSeconds: 1360, lastVisited: '3/24/2026, 1:40:00 PM PDT' }
      ],
      sessions: [
        { id: 1502, created: '3/24/2026, 1:42:27 PM PDT', expires: '3/31/2026, 1:42:27 PM PDT' }
      ]
    },
    {
      id: 5,
      name: 'Theresa G',
      email: 'theresa@statbid.com',
      initials: 'TG',
      avatarColor: '#0d9488',
      lastActive: '3/24/2026, 9:10:26 AM PDT',
      sessionCount: 1,
      features: [
        { module: 'SEM', feature: 'Issue Center',  visits: 6, time: '38m 15s', timeSeconds: 2295, lastVisited: '3/24/2026, 9:05:00 AM PDT' },
        { module: 'SEM', feature: 'Annotations',   visits: 1, time: '5m 10s',  timeSeconds: 310,  lastVisited: '3/23/2026, 2:00:00 PM PDT' }
      ],
      sessions: [
        { id: 1487, created: '3/24/2026, 9:10:26 AM PDT', expires: '3/31/2026, 9:10:26 AM PDT' }
      ]
    },
    {
      id: 6,
      name: 'Amy Sams',
      email: 'amy@statbid.com',
      initials: 'AS',
      avatarColor: '#db2777',
      lastActive: '3/23/2026, 3:45:00 PM PDT',
      sessionCount: 1,
      features: [
        { module: 'SEM',     feature: 'Feed Quality Check', visits: 8, time: '1h 12m',  timeSeconds: 4320, lastVisited: '3/23/2026, 3:40:00 PM PDT' },
        { module: 'Reports', feature: 'Line Chart',         visits: 2, time: '10m 5s',  timeSeconds: 605,  lastVisited: '3/23/2026, 2:30:00 PM PDT' }
      ],
      sessions: [
        { id: 1476, created: '3/23/2026, 3:45:00 PM PDT', expires: '3/30/2026, 3:45:00 PM PDT' }
      ]
    },
    {
      id: 7,
      name: 'Shilo Jones',
      email: 'shilo@statbid.com',
      initials: 'SJ',
      avatarColor: '#4f46e5',
      lastActive: '3/23/2026, 11:20:00 AM PDT',
      sessionCount: 1,
      features: [
        { module: 'Admin',   feature: 'Permission Manager', visits: 3, time: '15m 30s', timeSeconds: 930,  lastVisited: '3/23/2026, 11:15:00 AM PDT' },
        { module: 'Reports', feature: 'Forecasting',        visits: 2, time: '20m 0s',  timeSeconds: 1200, lastVisited: '3/22/2026, 4:00:00 PM PDT' }
      ],
      sessions: [
        { id: 1461, created: '3/23/2026, 11:20:00 AM PDT', expires: '3/30/2026, 11:20:00 AM PDT' }
      ]
    },
    {
      id: 8,
      name: 'Seyifunmi Olufemi',
      email: 'seyifunmi@statbid.com',
      initials: 'SO',
      avatarColor: '#dc2626',
      lastActive: '3/25/2026, 10:30:00 AM PDT',
      sessionCount: 1,
      features: [
        { module: 'Reports',   feature: 'Overview',              visits: 12, time: '2h 4m',   timeSeconds: 7440, lastVisited: '3/25/2026, 10:25:00 AM PDT' },
        { module: 'Dev Tools', feature: 'Pivot Table',           visits: 7,  time: '55m 20s', timeSeconds: 3320, lastVisited: '3/24/2026, 5:00:00 PM PDT' },
        { module: 'SEM',       feature: 'Business Rule Manager', visits: 3,  time: '18m 10s', timeSeconds: 1090, lastVisited: '3/23/2026, 1:00:00 PM PDT' }
      ],
      sessions: [
        { id: 1547, created: '3/25/2026, 10:30:00 AM PDT', expires: '4/1/2026, 10:30:00 AM PDT' }
      ]
    }
  ];

  // ── Feature table data ───────────────────────────────────────────────────────
  var SM_FEATURES = [
    { module: 'SEM',       feature: 'Issue Center',          users: 3, visits: 8,  totalTime: '50m 20s', totalSeconds: 3020, avgTime: '6m 18s',  lastActivity: '3/24/2026, 9:05:00 AM PDT' },
    { module: 'SEM',       feature: 'Feed Quality Check',    users: 2, visits: 10, totalTime: '1h 30m',  totalSeconds: 5400, avgTime: '9m 0s',   lastActivity: '3/23/2026, 3:40:00 PM PDT' },
    { module: 'SEM',       feature: 'Feed Data Tool',        users: 1, visits: 3,  totalTime: '24m 10s', totalSeconds: 1450, avgTime: '8m 3s',   lastActivity: '3/24/2026, 4:30:00 PM PDT' },
    { module: 'SEM',       feature: 'Annotations',           users: 1, visits: 1,  totalTime: '5m 10s',  totalSeconds: 310,  avgTime: '5m 10s',  lastActivity: '3/23/2026, 2:00:00 PM PDT' },
    { module: 'Dev Tools', feature: 'Search Term Grader',    users: 1, visits: 5,  totalTime: '45m 30s', totalSeconds: 2730, avgTime: '9m 6s',   lastActivity: '3/24/2026, 4:15:00 PM PDT' },
    { module: 'Dev Tools', feature: 'Feed Quality Check',    users: 1, visits: 2,  totalTime: '18m 20s', totalSeconds: 1100, avgTime: '9m 10s',  lastActivity: '3/23/2026, 11:30:00 AM PDT' },
    { module: 'Dev Tools', feature: 'Pivot Table',           users: 1, visits: 7,  totalTime: '55m 20s', totalSeconds: 3320, avgTime: '7m 54s',  lastActivity: '3/24/2026, 5:00:00 PM PDT' },
    { module: 'Reports',   feature: 'Overview',              users: 2, visits: 16, totalTime: '2h 26m',  totalSeconds: 8760, avgTime: '9m 8s',   lastActivity: '3/25/2026, 10:25:00 AM PDT' },
    { module: 'Reports',   feature: 'Line Chart',            users: 1, visits: 2,  totalTime: '10m 5s',  totalSeconds: 605,  avgTime: '5m 3s',   lastActivity: '3/23/2026, 2:30:00 PM PDT' },
    { module: 'Reports',   feature: 'Forecasting',           users: 1, visits: 2,  totalTime: '20m 0s',  totalSeconds: 1200, avgTime: '10m 0s',  lastActivity: '3/22/2026, 4:00:00 PM PDT' },
    { module: 'Admin',     feature: 'Client Management',     users: 1, visits: 1,  totalTime: '8m 20s',  totalSeconds: 500,  avgTime: '8m 20s',  lastActivity: '3/25/2026, 3:06:02 PM PDT' },
    { module: 'Admin',     feature: 'Permission Manager',    users: 1, visits: 3,  totalTime: '15m 30s', totalSeconds: 930,  avgTime: '5m 10s',  lastActivity: '3/23/2026, 11:15:00 AM PDT' },
    { module: 'SEM',       feature: 'Business Rule Manager', users: 1, visits: 3,  totalTime: '18m 10s', totalSeconds: 1090, avgTime: '6m 3s',   lastActivity: '3/23/2026, 1:00:00 PM PDT' }
  ];

  // ── State ─────────────────────────────────────────────────────────────────────
  var _state = {
    timeFilter: 'this-week',
    activeTab: 'by-user',
    infoBannerOpen: false,
    expandedUsers: {},
    revokedSessions: {},
    userSearch: '',
    featSearch: '',
    featSortCol: 'visits',
    featSortDir: 'desc',
    ddOpen: false
  };

  // ── Helpers ───────────────────────────────────────────────────────────────────
  function smGetFeatureHeading() {
    return 'Feature Usage (' + (_state.timeFilter === 'this-week' ? 'This Week' : 'All Time') + ')';
  }

  function smFilteredUsers() {
    if (!_state.userSearch) return SM_USERS;
    var term = _state.userSearch.toLowerCase();
    return SM_USERS.filter(function (u) {
      return u.name.toLowerCase().indexOf(term) >= 0 || u.email.toLowerCase().indexOf(term) >= 0;
    });
  }

  function smFilteredFeatures() {
    var arr = SM_FEATURES.slice();
    if (_state.featSearch) {
      var term = _state.featSearch.toLowerCase();
      arr = arr.filter(function (f) {
        return f.module.toLowerCase().indexOf(term) >= 0 || f.feature.toLowerCase().indexOf(term) >= 0;
      });
    }
    arr.sort(function (a, b) {
      var col = _state.featSortCol;
      var aVal = col === 'users' ? a.users : col === 'visits' ? a.visits : a.totalSeconds;
      var bVal = col === 'users' ? b.users : col === 'visits' ? b.visits : b.totalSeconds;
      return _state.featSortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return arr;
  }

  // ── Render By User ────────────────────────────────────────────────────────────
  function smRenderUserList() {
    var tbody = document.getElementById('sm-user-tbody');
    if (!tbody) return;
    var users = smFilteredUsers();
    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="sm-user-td" style="color:var(--color-text-caption);border-bottom:none;">No users match your search.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    var chevSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';

    users.forEach(function (u) {
      var isExp = !!_state.expandedUsers[u.id];

      // User row
      var tr = document.createElement('tr');
      tr.className = 'sm-user-tr' + (isExp ? ' sm-expanded' : '');
      tr.setAttribute('data-toggle-user', u.id);
      tr.innerHTML =
        '<td class="sm-user-td">' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<span class="sm-user-chev">' + chevSvg + '</span>' +
            '<span class="sm-avatar" style="background:' + u.avatarColor + ';">' + u.initials + '</span>' +
            '<div class="sm-user-info">' +
              '<span class="sm-user-name">' + u.name + '</span>' +
              '<span class="sm-user-email">' + u.email + '</span>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td class="sm-user-td">' + u.lastActive + '</td>' +
        '<td class="sm-user-td" id="sm-sess-count-' + u.id + '">' + smActiveSessionCount(u) + '</td>';

      // Detail row
      var detailTr = document.createElement('tr');
      detailTr.className = 'sm-user-detail-tr';
      detailTr.id = 'sm-detail-' + u.id;
      detailTr.style.display = isExp ? '' : 'none';
      detailTr.innerHTML = '<td class="sm-user-detail-td" colspan="3">' + (isExp ? smBuildExpandedContent(u) : '') + '</td>';

      tbody.appendChild(tr);
      tbody.appendChild(detailTr);
    });
  }

  function smActiveSessionCount(u) {
    var count = 0;
    u.sessions.forEach(function (s) {
      if (!_state.revokedSessions[u.id + '-' + s.id]) count++;
    });
    return count;
  }

  function smBuildExpandedContent(u) {
    var featHeading = smGetFeatureHeading();

    // Feature usage table
    var featRows = '';
    var totalVisits = 0, totalSeconds = 0;
    u.features.forEach(function (f) {
      totalVisits += f.visits;
      totalSeconds += f.timeSeconds;
      featRows +=
        '<tr class="sm-sub-tr">' +
          '<td class="sm-sub-td"><div class="sm-mod-name">' + f.module + '</div><div class="sm-feat-name">' + f.feature + '</div></td>' +
          '<td class="sm-sub-td" style="text-align:right;">' + f.visits + '</td>' +
          '<td class="sm-sub-td">' + f.time + '</td>' +
          '<td class="sm-sub-td">' + f.lastVisited + '</td>' +
        '</tr>';
    });
    var totalTime = smFormatSeconds(totalSeconds);
    featRows +=
      '<tr class="sm-sub-tr sm-sub-tr-total">' +
        '<td class="sm-sub-td" style="font-weight:600;">Total</td>' +
        '<td class="sm-sub-td" style="text-align:right;font-weight:600;">' + totalVisits + '</td>' +
        '<td class="sm-sub-td" style="font-weight:600;">' + totalTime + '</td>' +
        '<td class="sm-sub-td">—</td>' +
      '</tr>';

    var featTable =
      '<div class="sm-section-heading">' + featHeading + '</div>' +
      '<div class="sm-sub-table-wrap">' +
        '<table class="sm-sub-table">' +
          '<thead><tr>' +
            '<th class="sm-sub-th" style="width:38%;">Module / Feature</th>' +
            '<th class="sm-sub-th" style="width:14%;text-align:right;">Visit Count</th>' +
            '<th class="sm-sub-th" style="width:18%;">Time Spent</th>' +
            '<th class="sm-sub-th" style="width:30%;">Last Visited</th>' +
          '</tr></thead>' +
          '<tbody>' + featRows + '</tbody>' +
        '</table>' +
      '</div>';

    // Active sessions table
    var sessRows = '';
    u.sessions.forEach(function (s) {
      if (_state.revokedSessions[u.id + '-' + s.id]) return;
      var revokeKey = 'sm-revoke-' + u.id + '-' + s.id;
      var revokeSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      sessRows +=
        '<tr class="sm-sub-tr sm-session-row" id="sm-sess-row-' + u.id + '-' + s.id + '">' +
          '<td class="sm-sub-td">' + s.id + '</td>' +
          '<td class="sm-sub-td">' + s.created + '</td>' +
          '<td class="sm-sub-td">' + s.expires + '</td>' +
          '<td class="sm-sub-td">' +
            '<button class="sm-revoke-btn" id="' + revokeKey + '" data-revoke-user="' + u.id + '" data-revoke-sess="' + s.id + '" title="Revoke session">' +
              revokeSvg +
            '</button>' +
          '</td>' +
        '</tr>';
    });
    if (!sessRows) {
      sessRows = '<tr><td class="sm-sub-td" colspan="4" style="color:var(--color-text-caption);">No active sessions.</td></tr>';
    }
    var sessTable =
      '<div class="sm-section-heading">Active Sessions</div>' +
      '<div class="sm-sub-table-wrap">' +
        '<table class="sm-sub-table">' +
          '<thead><tr>' +
            '<th class="sm-sub-th" style="width:15%;">Session ID</th>' +
            '<th class="sm-sub-th" style="width:35%;">Created At</th>' +
            '<th class="sm-sub-th" style="width:35%;">Expires At</th>' +
            '<th class="sm-sub-th" style="width:15%;">Actions</th>' +
          '</tr></thead>' +
          '<tbody>' + sessRows + '</tbody>' +
        '</table>' +
      '</div>';

    return featTable + '<div class="sm-section-sep">' + sessTable + '</div>';
  }

  function smFormatSeconds(s) {
    if (s >= 3600) {
      var h = Math.floor(s / 3600);
      var m = Math.floor((s % 3600) / 60);
      return h + 'h ' + m + 'm';
    }
    var m = Math.floor(s / 60);
    var sec = s % 60;
    if (m > 0 && sec > 0) return m + 'm ' + sec + 's';
    if (m > 0) return m + 'm';
    return sec + 's';
  }

  // ── Render By Feature ─────────────────────────────────────────────────────────
  function smRenderFeatureTable() {
    smUpdateSortIcons();
    var tbody = document.getElementById('sm-feat-tbody');
    if (!tbody) return;
    var rows = smFilteredFeatures();
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td class="sm-feat-td" colspan="6" style="color:var(--color-text-caption);">No features match your search.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    rows.forEach(function (f) {
      var tr = document.createElement('tr');
      tr.className = 'sm-feat-tr';
      tr.innerHTML =
        '<td class="sm-feat-td"><div class="sm-mod-name">' + f.module + '</div><div class="sm-feat-name">' + f.feature + '</div></td>' +
        '<td class="sm-feat-td">' + f.users + '</td>' +
        '<td class="sm-feat-td">' + f.visits + '</td>' +
        '<td class="sm-feat-td">' + f.totalTime + '</td>' +
        '<td class="sm-feat-td">' + f.avgTime + '</td>' +
        '<td class="sm-feat-td">' + f.lastActivity + '</td>';
      tbody.appendChild(tr);
    });
  }

  function smUpdateSortIcons() {
    var cols = ['users', 'visits', 'time'];
    var ascSvg  = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7-7 7 7"/></svg>';
    var descSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M19 12l-7 7-7-7"/></svg>';
    cols.forEach(function (c) {
      var el = document.getElementById('sm-sort-' + c);
      if (!el) return;
      var isActive = _state.featSortCol === c;
      el.className = 'sm-sort-icon' + (isActive ? ' sm-sort-active' : '');
      el.innerHTML = (isActive && _state.featSortDir === 'asc') ? ascSvg : descSvg;
    });
  }

  // ── Revoke session ────────────────────────────────────────────────────────────
  function smRevokeSession(userId, sessId) {
    var btn = document.getElementById('sm-revoke-' + userId + '-' + sessId);
    var row = document.getElementById('sm-sess-row-' + userId + '-' + sessId);
    if (!btn) return;
    // Show spinning refresh icon
    btn.classList.add('sm-revoking');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>';
    setTimeout(function () {
      _state.revokedSessions[userId + '-' + sessId] = true;
      if (row) {
        row.classList.add('sm-fading');
        setTimeout(function () {
          row.style.display = 'none';
          // Update session count in the user row cell
          var u = SM_USERS.find(function (u) { return u.id === userId; });
          if (u) {
            var countCell = document.getElementById('sm-sess-count-' + userId);
            if (countCell) countCell.textContent = smActiveSessionCount(u);
          }
        }, 300);
      }
    }, 1000);
  }

  // ── Time filter dropdown ──────────────────────────────────────────────────────
  function smOpenTimeDd() {
    var btn   = document.getElementById('sm-time-btn');
    var panel = document.getElementById('sm-time-panel');
    if (!btn || !panel) return;
    var r = btn.getBoundingClientRect();
    panel.style.left = r.left + 'px';
    panel.style.top  = (r.bottom + 4) + 'px';
    panel.style.display = 'block';
    _state.ddOpen = true;
  }

  function smCloseTimeDd() {
    var panel = document.getElementById('sm-time-panel');
    if (panel) panel.style.display = 'none';
    _state.ddOpen = false;
  }

  function smSetTimeFilter(val) {
    _state.timeFilter = val;
    var label = document.getElementById('sm-time-label');
    if (label) label.textContent = val === 'this-week' ? 'This Week' : 'All Time';
    // Update selected state in dropdown
    document.querySelectorAll('[data-time]').forEach(function (el) {
      el.classList.toggle('sm-dd-selected', el.getAttribute('data-time') === val);
    });
    // Update any expanded detail rows to reflect new time filter heading
    document.querySelectorAll('.sm-user-tr.sm-expanded').forEach(function (row) {
      var uid = parseInt(row.getAttribute('data-toggle-user'));
      var u = SM_USERS.find(function (u) { return u.id === uid; });
      if (u) {
        var detailRow = document.getElementById('sm-detail-' + uid);
        if (detailRow) {
          var td = detailRow.querySelector('td');
          if (td) td.innerHTML = smBuildExpandedContent(u);
        }
      }
    });
    smCloseTimeDd();
  }

  // ── Wire events ───────────────────────────────────────────────────────────────
  var _smInit = false;
  function smWireEvents() {
    if (_smInit) return;
    _smInit = true;

    document.addEventListener('click', function (e) {
      var page = document.getElementById('session-monitor-page');
      if (!page || page.style.display === 'none') return;

      // Close time dropdown on outside click
      if (!e.target.closest('#sm-time-btn') && !e.target.closest('#sm-time-panel')) {
        smCloseTimeDd();
      }

      // Time filter dropdown open
      if (e.target.closest('#sm-time-btn')) {
        if (_state.ddOpen) smCloseTimeDd();
        else smOpenTimeDd();
        return;
      }

      // Time filter pick
      var timePick = e.target.closest('[data-time]');
      if (timePick) {
        smSetTimeFilter(timePick.getAttribute('data-time'));
        return;
      }

      // Info banner toggle
      if (e.target.closest('#sm-info-btn')) {
        _state.infoBannerOpen = !_state.infoBannerOpen;
        var banner = document.getElementById('sm-info-banner');
        if (banner) banner.classList.toggle('sm-open', _state.infoBannerOpen);
        return;
      }

      // Refresh button spin
      if (e.target.closest('#sm-refresh-btn')) {
        var icon = document.getElementById('sm-refresh-icon');
        if (icon && !icon.classList.contains('sm-refresh-spin')) {
          icon.classList.add('sm-refresh-spin');
          setTimeout(function () { icon.classList.remove('sm-refresh-spin'); }, 1000);
        }
        return;
      }

      // Tab switch
      var tab = e.target.closest('[data-tab]');
      if (tab) {
        var tabVal = tab.getAttribute('data-tab');
        _state.activeTab = tabVal;
        document.querySelectorAll('.sm-tab').forEach(function (t) {
          t.classList.toggle('sm-tab-active', t.getAttribute('data-tab') === tabVal);
        });
        var byUser    = document.getElementById('sm-by-user-tab');
        var byFeature = document.getElementById('sm-by-feature-tab');
        if (byUser)    byUser.style.display    = tabVal === 'by-user'    ? 'block' : 'none';
        if (byFeature) byFeature.style.display = tabVal === 'by-feature' ? 'block' : 'none';
        if (tabVal === 'by-feature') smRenderFeatureTable();
        return;
      }

      // Toggle user row (click on the tr itself — but not on detail rows or revoke buttons)
      var toggleUser = e.target.closest('[data-toggle-user]');
      if (toggleUser && !e.target.closest('.sm-user-detail-tr')) {
        var uid = parseInt(toggleUser.getAttribute('data-toggle-user'));
        _state.expandedUsers[uid] = !_state.expandedUsers[uid];
        toggleUser.classList.toggle('sm-expanded', !!_state.expandedUsers[uid]);
        var detailRow = document.getElementById('sm-detail-' + uid);
        if (detailRow) {
          if (_state.expandedUsers[uid]) {
            var u = SM_USERS.find(function (u) { return u.id === uid; });
            if (u) {
              var td = detailRow.querySelector('td');
              if (td) td.innerHTML = smBuildExpandedContent(u);
            }
            detailRow.style.display = '';
          } else {
            detailRow.style.display = 'none';
          }
        }
        return;
      }

      // Revoke session
      var revokeBtn = e.target.closest('[data-revoke-user]');
      if (revokeBtn && !revokeBtn.classList.contains('sm-revoking')) {
        var rUid  = parseInt(revokeBtn.getAttribute('data-revoke-user'));
        var rSess = parseInt(revokeBtn.getAttribute('data-revoke-sess'));
        smRevokeSession(rUid, rSess);
        return;
      }

      // Feature table sort
      var sortTh = e.target.closest('.sm-feat-th.sm-sortable[data-sort]');
      if (sortTh) {
        var col = sortTh.getAttribute('data-sort');
        if (_state.featSortCol === col) {
          _state.featSortDir = _state.featSortDir === 'asc' ? 'desc' : 'asc';
        } else {
          _state.featSortCol = col;
          _state.featSortDir = 'desc';
        }
        smRenderFeatureTable();
        return;
      }
    });

    // Search inputs
    document.addEventListener('input', function (e) {
      var page = document.getElementById('session-monitor-page');
      if (!page || page.style.display === 'none') return;
      if (e.target && e.target.id === 'sm-user-search') {
        _state.userSearch = e.target.value;
        smRenderUserList();
      }
      if (e.target && e.target.id === 'sm-feat-search') {
        _state.featSearch = e.target.value;
        smRenderFeatureTable();
      }
    });
  }

  // ── Public entry ──────────────────────────────────────────────────────────────
  window.showSessionMonitorPage = function () {
    if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
    var fdp = document.getElementById('feed-data-page');
    if (fdp) fdp.style.display = 'none';
    var page = document.getElementById('session-monitor-page');
    if (!page) return;
    page.style.display = 'block';
    window.scrollTo(0, 0);
    smWireEvents();
    smRenderUserList();
    if (_state.activeTab === 'by-feature') smRenderFeatureTable();
  };

})();
