(function () {
  'use strict';

  // ── Chart colour palette ──
  var CHART_COLORS = ['#346ed9','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899'];

  // ── Dual y-axis scale groups ──
  // LEFT  = large-magnitude values (currency / counts)
  // RIGHT = ratios, percentages, small-unit values
  var LEFT_AXIS_IDS  = ['spend', 'revenue', 'orgRevenue', 'conversions', 'clicks', 'sessions', 'impressions'];
  var RIGHT_AXIS_IDS = ['cos', 'roas', 'convRate', 'cpc', 'aov', 'bounceRate', 'ctr', 'cpa'];

  // ── Dimension groups by channel ──
  var DIM_GROUPS = [
    { channel: 'sem', label: 'SEM Dimensions',
      dims: ['Client','Website','Channel','Labels','Ad Type','Campaign','Brand/No Brand'] },
    { channel: 'seo', label: 'SEO Dimensions',
      dims: ['Page Type','Page URL','Brand / No Brand','Channel'] }
  ];
  var SEM_DIMS = DIM_GROUPS[0].dims;
  var SEO_DIMS = DIM_GROUPS[1].dims;

  // Chart groupBy → data depth (0=top-level, 1=children, 2=grandchildren)
  var GROUPBY_DEPTH = {
    'Client': 0, 'Website': 0, 'Channel': 0, 'Labels': 0,
    'Ad Type': 0, 'Campaign': 1, 'Brand/No Brand': 0,
    'Page Type': 0, 'Page URL': 1
  };

  // ── All metric columns ──
  var ALL_COLS = [
    // SEM metrics
    { id: 'spend',       label: 'Spend',          fmt: 'currency', agg: 'sum',  cosColor: false },
    { id: 'revenue',     label: 'Revenue',        fmt: 'currency', agg: 'sum',  cosColor: false },
    { id: 'cos',         label: 'COS',            fmt: 'pct',      agg: 'wavg', cosColor: true  },
    { id: 'roas',        label: 'ROAS',           fmt: 'roas',     agg: 'wavg', cosColor: false },
    { id: 'conversions', label: 'Conversions',    fmt: 'int',      agg: 'sum',  cosColor: false },
    { id: 'convRate',    label: 'Conv. Rate',     fmt: 'pct',      agg: 'wavg', cosColor: false },
    { id: 'clicks',      label: 'Clicks',         fmt: 'int',      agg: 'sum',  cosColor: false },
    { id: 'cpc',         label: 'CPC',            fmt: 'currency', agg: 'wavg', cosColor: false },
    { id: 'impressions', label: 'Impressions',    fmt: 'int',      agg: 'sum',  cosColor: false },
    { id: 'ctr',         label: 'CTR',            fmt: 'pct',      agg: 'wavg', cosColor: false },
    { id: 'cpa',         label: 'CPA',            fmt: 'currency', agg: 'wavg', cosColor: false },
    // SEO metrics
    { id: 'orgRevenue',  label: 'Org. Revenue',   fmt: 'currency', agg: 'sum',  cosColor: false },
    { id: 'sessions',    label: 'Org. Sessions',  fmt: 'int',      agg: 'sum',  cosColor: false },
    { id: 'aov',         label: 'AOV',            fmt: 'currency', agg: 'wavg', cosColor: false },
    { id: 'bounceRate',  label: 'Bounce Rate',    fmt: 'pct',      agg: 'wavg', cosColor: false }
  ];

  // ── Channel metric lists ──
  var SEM_COL_IDS  = ['spend','revenue','cos','roas','conversions','convRate','clicks','cpc','impressions','ctr','cpa'];
  var SEO_COL_IDS  = ['orgRevenue','sessions','convRate','aov','bounceRate'];
  var SEM_DEFAULTS = ['spend','revenue','cos','roas','conversions','convRate','clicks','cpc'];
  var SEO_DEFAULTS = ['orgRevenue','sessions','convRate','aov','bounceRate'];

  // ── SEO page hierarchy (Outdoor Research) ──
  var OR_SEO_PAGES = [
    { name: 'Product Pages', orgRevenue: 142400, sessions: 56800, convRate: 0.028, aov: 89, bounceRate: 0.41,
      children: [
        { name: 'Jackets',       orgRevenue: 51264, sessions: 20448, convRate: 0.031, aov: 94, bounceRate: 0.38 },
        { name: 'Footwear',      orgRevenue: 42720, sessions: 17040, convRate: 0.027, aov: 88, bounceRate: 0.42 },
        { name: 'Fleece',        orgRevenue: 34176, sessions: 13632, convRate: 0.026, aov: 87, bounceRate: 0.43 },
        { name: 'Sleeping Bags', orgRevenue: 14240, sessions:  5680, convRate: 0.022, aov: 91, bounceRate: 0.47 }
      ]
    },
    { name: 'Category Pages', orgRevenue: 68200, sessions: 32400, convRate: 0.019, aov: 95, bounceRate: 0.52,
      children: [
        { name: 'Apparel',  orgRevenue: 27280, sessions: 12960, convRate: 0.020, aov: 97, bounceRate: 0.50 },
        { name: 'Footwear', orgRevenue: 20460, sessions:  9720, convRate: 0.018, aov: 94, bounceRate: 0.54 },
        { name: 'Gear',     orgRevenue: 20460, sessions:  9720, convRate: 0.018, aov: 93, bounceRate: 0.53 }
      ]
    },
    { name: 'Blog & Guides', orgRevenue: 24800, sessions: 16200, convRate: 0.011, aov: 82, bounceRate: 0.67,
      children: [
        { name: 'Gear Guides',     orgRevenue: 14880, sessions: 9720, convRate: 0.012, aov: 84, bounceRate: 0.64 },
        { name: 'How-To Articles', orgRevenue:  9920, sessions: 6480, convRate: 0.009, aov: 78, bounceRate: 0.71 }
      ]
    },
    { name: 'Brand Pages', orgRevenue: 18200, sessions: 4760, convRate: 0.041, aov: 112, bounceRate: 0.32 },
    { name: 'Other',       orgRevenue: 11682, sessions: 1800, convRate: 0.015, aov:  86, bounceRate: 0.58 }
  ];

  // ── SEM campaign hierarchy (Outdoor Research) — Channel → Campaign ──
  var OR_CAMPAIGNS = [
    {
      name: 'Google Ads',
      spend: 69000, revenue: 342000, cos: 0.202, roas: 4.96, conversions: 1875, convRate: 0.031, clicks: 61490, cpc: 1.12,
      impressions: 3074500, ctr: 0.020, cpa: 36.80,
      children: [
        { name: '[SB] Tier A: Nonbrand USA / Core (AC) - US',
          spend: 18600, revenue: 82000, cos: 0.227, roas: 4.41, conversions: 480, convRate: 0.028, clicks: 17150, cpc: 1.08, impressions: 857500, ctr: 0.020, cpa: 38.75 },
        { name: '[SB] Tier B: Nonbrand CA / Core (AC) - CA',
          spend: 8100,  revenue: 37400, cos: 0.217, roas: 4.62, conversions: 210, convRate: 0.026, clicks:  7500, cpc: 1.08, impressions: 375000, ctr: 0.020, cpa: 38.57 },
        { name: '[SB] Tier Brand: Branded Ads / Brand (AC) - US',
          spend: 6200,  revenue: 44600, cos: 0.139, roas: 7.19, conversions: 240, convRate: 0.040, clicks:  5900, cpc: 1.05, impressions: 295000, ctr: 0.020, cpa: 25.83 },
        { name: '[SB] Tier Brand: Branded Ads / Brand (AC) - CA',
          spend: 2400,  revenue: 17200, cos: 0.140, roas: 7.17, conversions:  93, convRate: 0.040, clicks:  2290, cpc: 1.05, impressions: 114500, ctr: 0.020, cpa: 25.81 },
        { name: '[SB] Tier C: Brand Adjacent / Brand + Category (AC) - US',
          spend: 14800, revenue: 84200, cos: 0.176, roas: 5.69, conversions: 452, convRate: 0.033, clicks: 13700, cpc: 1.08, impressions: 685000, ctr: 0.020, cpa: 32.74 },
        { name: '[SB] Tier C: Brand Adjacent / Brand + Category (AC) - CA',
          spend: 6100,  revenue: 34400, cos: 0.177, roas: 5.64, conversions: 185, convRate: 0.033, clicks:  5640, cpc: 1.08, impressions: 282000, ctr: 0.020, cpa: 32.97 },
        { name: '[SB] Tier C: PMax (Brand Adjacent) (AC) - US',
          spend: 8400,  revenue: 28600, cos: 0.294, roas: 3.40, conversions: 268, convRate: 0.037, clicks:  7250, cpc: 1.16, impressions: 362500, ctr: 0.020, cpa: 31.34 },
        { name: '[SB] Tier C: PMax (Brand Adjacent) (AC) - CA',
          spend: 2100,  revenue:  7100, cos: 0.296, roas: 3.38, conversions:  67, convRate: 0.037, clicks:  1810, cpc: 1.16, impressions:  90500, ctr: 0.020, cpa: 31.34 },
        { name: '[SB] Tactical: Broad Match (Prospecting) / Brand + Category (AC) - US',
          spend: 2300,  revenue:  6500, cos: 0.354, roas: 2.83, conversions:  58, convRate: 0.024, clicks:  2400, cpc: 0.96, impressions: 120000, ctr: 0.020, cpa: 39.66 }
      ]
    },
    {
      name: 'Microsoft Ads',
      spend: 29450, revenue: 145320, cos: 0.203, roas: 4.94, conversions: 679, convRate: 0.031, clicks: 27600, cpc: 1.07,
      impressions: 1380000, ctr: 0.020, cpa: 43.37,
      children: [
        { name: '[SB] Tier A: Nonbrand USA / Core (AC) - US',
          spend: 9800,  revenue: 42600, cos: 0.230, roas: 4.35, conversions: 248, convRate: 0.026, clicks:  9540, cpc: 1.03, impressions: 477000, ctr: 0.020, cpa: 39.52 },
        { name: '[SB] Tier Brand: Branded Ads / Brand (AC) - US',
          spend: 3700,  revenue: 26800, cos: 0.138, roas: 7.24, conversions: 146, convRate: 0.041, clicks:  3520, cpc: 1.05, impressions: 176000, ctr: 0.020, cpa: 25.34 },
        { name: '[SB] Tier Brand: Branded Ads / Brand (AC) - CA',
          spend: 1400,  revenue: 10100, cos: 0.139, roas: 7.21, conversions:  55, convRate: 0.041, clicks:  1330, cpc: 1.05, impressions:  66500, ctr: 0.020, cpa: 25.45 },
        { name: '[SB] Tier C: Brand Adjacent / Brand + Category (AC) - US',
          spend: 8100,  revenue: 42200, cos: 0.192, roas: 5.21, conversions: 216, convRate: 0.031, clicks:  7700, cpc: 1.05, impressions: 385000, ctr: 0.020, cpa: 37.50 },
        { name: '[SB] Tier C: PMax (Brand Adjacent) (AC) - US',
          spend: 6450,  revenue: 23620, cos: 0.273, roas: 3.66, conversions: 162, convRate: 0.036, clicks:  5510, cpc: 1.17, impressions: 275500, ctr: 0.020, cpa: 39.81 }
      ]
    }
  ];

  // ── OR flat campaign list (all channels combined, for Campaign groupBy) ──
  var OR_ALL_CAMPAIGNS = [
    { name: '[SB] Tier A: Nonbrand USA / Core (AC) - US',                              spend: 18600, revenue:  82000, cos: 0.227, roas: 4.41, conversions: 480, convRate: 0.028, clicks: 17150, cpc: 1.08, impressions:  857500, ctr: 0.020, cpa: 38.75 },
    { name: '[SB] Tier B: Nonbrand CA / Core (AC) - CA',                               spend:  8100, revenue:  37400, cos: 0.217, roas: 4.62, conversions: 210, convRate: 0.026, clicks:  7500, cpc: 1.08, impressions:  375000, ctr: 0.020, cpa: 38.57 },
    { name: '[SB] Tier Brand: Branded Ads / Brand (AC) - US',                          spend:  6200, revenue:  44600, cos: 0.139, roas: 7.19, conversions: 240, convRate: 0.040, clicks:  5900, cpc: 1.05, impressions:  295000, ctr: 0.020, cpa: 25.83 },
    { name: '[SB] Tier Brand: Branded Ads / Brand (AC) - CA',                          spend:  2400, revenue:  17200, cos: 0.140, roas: 7.17, conversions:  93, convRate: 0.040, clicks:  2290, cpc: 1.05, impressions:  114500, ctr: 0.020, cpa: 25.81 },
    { name: '[SB] Tier C: Brand Adjacent / Brand + Category (AC) - US',                spend: 14800, revenue:  84200, cos: 0.176, roas: 5.69, conversions: 452, convRate: 0.033, clicks: 13700, cpc: 1.08, impressions:  685000, ctr: 0.020, cpa: 32.74 },
    { name: '[SB] Tier C: Brand Adjacent / Brand + Category (AC) - CA',                spend:  6100, revenue:  34400, cos: 0.177, roas: 5.64, conversions: 185, convRate: 0.033, clicks:  5640, cpc: 1.08, impressions:  282000, ctr: 0.020, cpa: 32.97 },
    { name: '[SB] Tier C: PMax (Brand Adjacent) (AC) - US',                            spend:  8400, revenue:  28600, cos: 0.294, roas: 3.40, conversions: 268, convRate: 0.037, clicks:  7250, cpc: 1.16, impressions:  362500, ctr: 0.020, cpa: 31.34 },
    { name: '[SB] Tier C: PMax (Brand Adjacent) (AC) - CA',                            spend:  2100, revenue:   7100, cos: 0.296, roas: 3.38, conversions:  67, convRate: 0.037, clicks:  1810, cpc: 1.16, impressions:   90500, ctr: 0.020, cpa: 31.34 },
    { name: '[SB] Tactical: Broad Match (Prospecting) / Brand + Category (AC) - US',  spend:  2300, revenue:   6500, cos: 0.354, roas: 2.83, conversions:  58, convRate: 0.024, clicks:  2400, cpc: 0.96, impressions:  120000, ctr: 0.020, cpa: 39.66 },
    { name: '[SB] Tier A: Nonbrand USA / Core (AC) - US (MSFT)',                       spend:  9800, revenue:  42600, cos: 0.230, roas: 4.35, conversions: 248, convRate: 0.026, clicks:  9540, cpc: 1.03, impressions:  477000, ctr: 0.020, cpa: 39.52 },
    { name: '[SB] Tier Brand: Branded Ads / Brand (AC) - US (MSFT)',                   spend:  3700, revenue:  26800, cos: 0.138, roas: 7.24, conversions: 146, convRate: 0.041, clicks:  3520, cpc: 1.05, impressions:  176000, ctr: 0.020, cpa: 25.34 },
    { name: '[SB] Tier Brand: Branded Ads / Brand (AC) - CA (MSFT)',                   spend:  1400, revenue:  10100, cos: 0.139, roas: 7.21, conversions:  55, convRate: 0.041, clicks:  1330, cpc: 1.05, impressions:   66500, ctr: 0.020, cpa: 25.45 },
    { name: '[SB] Tier C: Brand Adjacent / Brand + Category (AC) - US (MSFT)',         spend:  8100, revenue:  42200, cos: 0.192, roas: 5.21, conversions: 216, convRate: 0.031, clicks:  7700, cpc: 1.05, impressions:  385000, ctr: 0.020, cpa: 37.50 },
    { name: '[SB] Tier C: PMax (Brand Adjacent) (AC) - US (MSFT)',                     spend:  6450, revenue:  23620, cos: 0.273, roas: 3.66, conversions: 162, convRate: 0.036, clicks:  5510, cpc: 1.17, impressions:  275500, ctr: 0.020, cpa: 39.81 }
  ];

  // ── OR dimension-keyed data (each key = what to show when that dim is selected) ──
  var OR_DIM_DATA = {
    'Channel': OR_CAMPAIGNS,
    'Labels': [
      { name: 'Nonbrand USA (Tier A)',         spend: 28400, revenue: 124600, cos: 0.228, roas: 4.39, conversions:  728, convRate: 0.027, clicks: 26690, cpc: 1.06, impressions: 1334500, ctr: 0.020, cpa: 39.01 },
      { name: 'Nonbrand CA (Tier B)',           spend:  8100, revenue:  37400, cos: 0.217, roas: 4.62, conversions:  210, convRate: 0.026, clicks:  7500, cpc: 1.08, impressions:  375000, ctr: 0.020, cpa: 38.57 },
      { name: 'Branded Ads USA/CA (Tier Brand)',spend: 13700, revenue:  98700, cos: 0.139, roas: 7.20, conversions:  534, convRate: 0.040, clicks: 13040, cpc: 1.05, impressions:  652000, ctr: 0.020, cpa: 25.66 },
      { name: 'Brand Adjacent USA/CA (Tier C)', spend: 45950, revenue: 220120, cos: 0.209, roas: 4.79, conversions: 1350, convRate: 0.033, clicks: 41610, cpc: 1.10, impressions: 2080000, ctr: 0.020, cpa: 34.04 },
      { name: 'Tactical Spend USA',             spend:  2300, revenue:   6500, cos: 0.354, roas: 2.83, conversions:   58, convRate: 0.024, clicks:  2400, cpc: 0.96, impressions:  120000, ctr: 0.020, cpa: 39.66 }
    ],
    'Ad Type': [
      { name: 'Shopping',    spend: 28400, revenue: 124600, cos: 0.228, roas: 4.39, conversions:  728, convRate: 0.027, clicks: 26690, cpc: 1.06, impressions: 1334500, ctr: 0.020, cpa: 39.01 },
      { name: 'Text/Other',  spend: 53100, revenue: 303400, cos: 0.175, roas: 5.71, conversions: 1648, convRate: 0.034, clicks: 47940, cpc: 1.11, impressions: 2397000, ctr: 0.020, cpa: 32.22 },
      { name: 'PMax',        spend: 16950, revenue:  59320, cos: 0.286, roas: 3.50, conversions:  497, convRate: 0.036, clicks: 14570, cpc: 1.16, impressions:  728500, ctr: 0.020, cpa: 34.11 }
    ],
    'Campaign': OR_ALL_CAMPAIGNS,
    'Brand/No Brand': [
      { name: 'Brand',     spend: 13700, revenue:  98700, cos: 0.139, roas: 7.20, conversions:  534, convRate: 0.040, clicks: 13040, cpc: 1.05, impressions:  652000, ctr: 0.020, cpa: 25.66 },
      { name: 'Non-Brand', spend: 84750, revenue: 388620, cos: 0.218, roas: 4.59, conversions: 2020, convRate: 0.029, clicks: 71000, cpc: 1.19, impressions: 3552500, ctr: 0.020, cpa: 41.96 }
    ],
    'Client':  null,
    'Website': null
  };

  // ── Per-client aggregate metrics (keyed by client name) ──
  var CLIENT_METRICS = {
    'Link Imaging':                { spend: 142800, revenue: 524600, cos: 0.272, roas: 3.67, conversions: 2841, convRate: 0.021, clicks: 135200, cpc: 1.06 },
    'Biddy Murphy':                { spend:  18400, revenue:  62800, cos: 0.293, roas: 3.41, conversions:  412, convRate: 0.028, clicks:  14720, cpc: 1.25 },
    "People's Choice Beef Jerky":  { spend:  24600, revenue:  98400, cos: 0.250, roas: 4.00, conversions:  621, convRate: 0.031, clicks:  20050, cpc: 1.23 },
    'Simply Authentic LLC':        { spend:  11200, revenue:  38600, cos: 0.290, roas: 3.45, conversions:  284, convRate: 0.026, clicks:  10920, cpc: 1.03 },
    'MojoMotoSport.com':           { spend:  38400, revenue: 124800, cos: 0.308, roas: 3.25, conversions:  714, convRate: 0.019, clicks:  37600, cpc: 1.02 },
    'Danielhouse Studios Inc':     { spend:   8200, revenue:  31400, cos: 0.261, roas: 3.83, conversions:  198, convRate: 0.022, clicks:   9000, cpc: 0.91 },
    'ScaffoldMart':                { spend:  22400, revenue:  72000, cos: 0.311, roas: 3.21, conversions:  386, convRate: 0.018, clicks:  21440, cpc: 1.04 },
    'BRobinson, LLC':              { spend:  31200, revenue: 142000, cos: 0.220, roas: 4.55, conversions:  892, convRate: 0.034, clicks:  26240, cpc: 1.19 },
    'Microscope.com':              { spend:  19400, revenue:  89200, cos: 0.217, roas: 4.60, conversions:  412, convRate: 0.029, clicks:  14200, cpc: 1.37 },
    'Grovemade':                   { spend:  28600, revenue: 104800, cos: 0.273, roas: 3.66, conversions:  634, convRate: 0.027, clicks:  23480, cpc: 1.22 },
    'Dungarees':                   { spend:  44200, revenue: 184800, cos: 0.239, roas: 4.18, conversions: 1124, convRate: 0.032, clicks:  35120, cpc: 1.26 },
    'Outdoor Research':            { spend:  98450, revenue: 487320, cos: 0.202, roas: 4.95, conversions: 2554, convRate: 0.030, clicks:  84040, cpc: 1.17,
                                     orgRevenue: 265282, sessions: 111960, aov: 175, bounceRate: 0.47 },
    'Chantelle Lingerie Inc':      { spend:  34800, revenue: 128200, cos: 0.271, roas: 3.68, conversions:  782, convRate: 0.024, clicks:  32560, cpc: 1.07 },
    'Weaver':                      { spend:  52400, revenue: 198600, cos: 0.264, roas: 3.79, conversions: 1248, convRate: 0.022, clicks:  56780, cpc: 0.92 },
    'MonkeySports':                { spend: 124600, revenue: 412000, cos: 0.302, roas: 3.31, conversions: 2841, convRate: 0.020, clicks: 142100, cpc: 0.88 },
    'Orchard and Vineyard Supply': { spend:  16800, revenue:  68400, cos: 0.246, roas: 4.07, conversions:  412, convRate: 0.028, clicks:  14720, cpc: 1.14 },
    'Sunflora Inc':                { spend:  62800, revenue: 214200, cos: 0.293, roas: 3.41, conversions: 1482, convRate: 0.026, clicks:  57020, cpc: 1.10 },
    'Royal Swimming Pools':        { spend:  28400, revenue: 124600, cos: 0.228, roas: 4.39, conversions:  624, convRate: 0.031, clicks:  20160, cpc: 1.41 },
    'My Binding':                  { spend:  42600, revenue: 148800, cos: 0.286, roas: 3.49, conversions: 1024, convRate: 0.024, clicks:  42680, cpc: 1.00 },
    'eOutdoors':                   { spend:  58200, revenue: 218400, cos: 0.267, roas: 3.75, conversions: 1412, convRate: 0.025, clicks:  56520, cpc: 1.03 },
    'Nomadic Vintage Rugs':        { spend:  21600, revenue:  96200, cos: 0.225, roas: 4.45, conversions:  512, convRate: 0.033, clicks:  15520, cpc: 1.39 }
  };

  // ── Build clients array from ARGOS_CLIENTS global ──
  function buildClients() {
    var src = (typeof ARGOS_CLIENTS !== 'undefined' ? ARGOS_CLIENTS : []);
    return src.map(function (c) {
      var m = CLIENT_METRICS[c.name] || { spend: 0, revenue: 0, cos: 0, roas: 0, conversions: 0, convRate: 0, clicks: 0, cpc: 0 };
      var n = c.websites.length;
      var websites = c.websites.map(function (w, i) {
        // distribute metrics proportionally with slight variation
        var factor = (1 / n) * (0.9 + 0.2 * (i % 3) / 2);
        var wm = {};
        Object.keys(m).forEach(function (k) {
          wm[k] = (k === 'cos' || k === 'roas' || k === 'convRate' || k === 'cpc' || k === 'aov' || k === 'bounceRate')
            ? m[k] * (0.95 + 0.1 * ((i * 7) % 10) / 10)
            : m[k] * factor;
        });
        var site = { name: w, spend: wm.spend, revenue: wm.revenue, cos: wm.cos || m.cos, roas: wm.roas || m.roas, conversions: wm.conversions, convRate: wm.convRate || m.convRate, clicks: wm.clicks, cpc: wm.cpc || m.cpc };
        site.impressions = site.clicks ? Math.round(site.clicks / 0.02) : 0;
        site.ctr = 0.02;
        site.cpa = site.conversions ? site.spend / site.conversions : 0;
        if (wm.orgRevenue) { site.orgRevenue = wm.orgRevenue; site.sessions = wm.sessions; site.aov = wm.aov; site.bounceRate = wm.bounceRate; }
        // Outdoor Research gets drill-down for both channels
        if (c.name === 'Outdoor Research') { site.dimChildren = OR_CAMPAIGNS; site.dimData = OR_DIM_DATA; site.seoDimChildren = OR_SEO_PAGES; }
        return site;
      });
      var client = Object.assign({ name: c.name, websites: websites }, m);
      client.impressions = m.clicks ? Math.round(m.clicks / 0.02) : 0;
      client.ctr = 0.02;
      client.cpa = m.conversions ? m.spend / m.conversions : 0;
      return client;
    });
  }

  // ── State ──
  var state = {
    selectedClient:  'Outdoor Research',
    selectedWebsite: 'OutdoorResearch.com',
    dimensions: [],
    visibleCols: ['spend', 'revenue', 'cos', 'roas', 'conversions', 'convRate', 'clicks', 'cpc'],
    dateRange:      'Last 30 Days',
    sortCol:        null,
    sortDir:        'desc',
    expanded:       {},
    chartMetrics:   ['revenue'],
    chartType:      'bar',
    activeChannel:  'sem',
    chartGroupBy:   'Channel',
    dimConflict:    false
  };

  var CLIENTS_DATA = [];
  var pvChart = null;
  var initialized = false;

  // ── Format helpers ──
  function fmtCurrency(v) {
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000)    return '$' + (v / 1000).toFixed(1) + 'k';
    if (v >= 100)     return '$' + Math.round(v);
    if (v >= 10)      return '$' + v.toFixed(1);
    return '$' + v.toFixed(2);
  }
  function fmtInt(v)  { return Math.round(v).toLocaleString(); }
  function fmtPct(v)  { return (v * 100).toFixed(1) + '%'; }
  function fmtRoas(v) { return v.toFixed(1) + 'x'; }
  function fmtVal(col, v) {
    if (v === undefined || v === null || isNaN(v)) return '—';
    if (col.fmt === 'currency') return fmtCurrency(v);
    if (col.fmt === 'int')      return fmtInt(v);
    if (col.fmt === 'pct')      return fmtPct(v);
    if (col.fmt === 'roas')     return fmtRoas(v);
    return String(v);
  }
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function hexToRgba(hex, a) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function cosClass(v) {
    if (v < 0.20) return ' pv-cos-good';
    if (v > 0.29) return ' pv-cos-warn';
    return '';
  }

  // ── Weighted average for totals ──
  function computeTotal(colDef, rows) {
    if (!rows.length) return 0;
    if (colDef.agg === 'sum') {
      return rows.reduce(function (a, r) { return a + (r[colDef.id] || 0); }, 0);
    }
    var totalW = rows.reduce(function (a, r) { return a + (r.spend || 0); }, 0);
    if (totalW === 0) return rows[0][colDef.id] || 0;
    return rows.reduce(function (a, r) { return a + (r[colDef.id] || 0) * (r.spend || 0); }, 0) / totalW;
  }

  // ── Active columns (in definition order) ──
  function getActiveCols() {
    var vis = state.visibleCols;
    return ALL_COLS.filter(function (c) { return vis.indexOf(c.id) !== -1; });
  }

  // ── Sort icon SVG ──
  function sortIcon(id) {
    if (state.sortCol !== id) {
      return '<svg class="pv-sort" width="10" height="10" viewBox="0 0 10 10" fill="none">' +
        '<path d="M3 3.5L5 1.5L7 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
        '<path d="M3 6.5L5 8.5L7 6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>';
    }
    var d = state.sortDir === 'asc'
      ? '<path d="M3 6L5 4L7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
      : '<path d="M3 4L5 6L7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
    return '<svg class="pv-sort pv-sort-active" width="10" height="10" viewBox="0 0 10 10" fill="none">' + d + '</svg>';
  }

  function chevron(open) {
    return '<svg class="pv-chev' + (open ? ' open' : '') + '" width="12" height="12" viewBox="0 0 12 12" fill="none">' +
      '<path d="M4 4.5L6 6.5L8 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function metricTd(col, v) {
    var cls = 'pv-td';
    if (col.cosColor) cls += cosClass(v);
    return '<td class="' + cls + '">' + fmtVal(col, v) + '</td>';
  }

  // ── Filtered clients list ──
  function filteredClients() {
    if (state.selectedClient === 'All Clients') return CLIENTS_DATA;
    return CLIENTS_DATA.filter(function (c) { return c.name === state.selectedClient; });
  }

  // ── Chart rows: channel-aware, respects chartGroupBy depth ──
  function getChartRows() {
    if (state.selectedClient === 'All Clients') return CLIENTS_DATA;

    var client = CLIENTS_DATA.filter(function (c) { return c.name === state.selectedClient; })[0];
    if (!client) return CLIENTS_DATA;
    if (state.selectedWebsite === 'All Websites') return client.websites;

    var site = client.websites.filter(function (w) { return w.name === state.selectedWebsite; })[0];
    if (!site) return client.websites;

    // SEM with dimData: pick the chartGroupBy dimension's rows directly
    if (state.activeChannel === 'sem' && site.dimData) {
      var gb = state.chartGroupBy;
      if (gb === 'Client') return CLIENTS_DATA;
      if (gb === 'Website') return client.websites;
      var gbRows = site.dimData[gb] || site.dimData['Channel'] || [];
      return gbRows.length ? gbRows : client.websites;
    }

    var topLevel = getChannelDimChildren(site);
    if (!topLevel || !topLevel.length) return client.websites;

    var depth = GROUPBY_DEPTH[state.chartGroupBy] || 0;
    if (depth === 0) return topLevel;

    // Level 1: flatten children of top-level
    var level1 = [];
    topLevel.forEach(function (p) { if (p.children) level1 = level1.concat(p.children); });
    if (!level1.length) return topLevel;
    if (depth === 1) return level1;

    // Level 2: flatten grandchildren
    var level2 = [];
    level1.forEach(function (p) { if (p.children) level2 = level2.concat(p.children); });
    return level2.length ? level2 : level1;
  }

  // ── Filtered websites for a client ──
  function filteredWebsites(client) {
    if (state.selectedWebsite === 'All Websites') return client.websites;
    return client.websites.filter(function (w) { return w.name === state.selectedWebsite; });
  }

  // ── Channel-aware dim children for a site ──
  function getChannelDimChildren(site) {
    if (state.activeChannel === 'seo') return site.seoDimChildren || [];
    // SEM: use dimension-keyed data when available
    if (site.dimData) {
      var dim = state.dimensions[0] || 'Channel';
      // Client/Website dims fall back to the default channel view
      return site.dimData[dim] || site.dimData['Channel'] || [];
    }
    return site.dimChildren || [];
  }

  // ── Default Group By: first dim selected, or first in active channel ──
  function getDefaultGroupBy() {
    if (state.dimensions.length) return state.dimensions[0];
    return state.activeChannel === 'seo' ? SEO_DIMS[0] : SEM_DIMS[0];
  }

  // ── Sync channel tab pill UI ──
  function pvSyncChannelTabs() {
    var semBtn = document.getElementById('pv-tab-sem');
    var seoBtn = document.getElementById('pv-tab-seo');
    if (!semBtn || !seoBtn) return;
    semBtn.className = 'pv-channel-tab' + (state.activeChannel === 'sem' ? ' pv-channel-tab-active' : '');
    seoBtn.className = 'pv-channel-tab' + (state.activeChannel === 'seo' ? ' pv-channel-tab-active' : '');
  }

  // ── Switch active channel, reset cols + chart defaults ──
  function switchChannel(newChannel) {
    if (state.activeChannel === newChannel) return;
    state.activeChannel = newChannel;
    var defaults = newChannel === 'sem' ? SEM_DEFAULTS : SEO_DEFAULTS;
    state.visibleCols   = defaults.slice();
    state.chartMetrics  = [defaults[0]];
    state.chartGroupBy  = getDefaultGroupBy();
    state.expanded      = {};
    state.sortCol       = null;
    state.dimensions    = [];
    pvSyncChannelTabs();
  }

  // ── Sort an array of rows ──
  function sortedRows(rows) {
    if (!state.sortCol) return rows.slice();
    return rows.slice().sort(function (a, b) {
      if (state.sortCol === '__name__') {
        var av = a.name || '', bv = b.name || '';
        return state.sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      var av = a[state.sortCol] || 0, bv = b[state.sortCol] || 0;
      return state.sortDir === 'asc' ? av - bv : bv - av;
    });
  }

  // ── Render header ──
  function renderHeader() {
    var thead = document.getElementById('pivot-thead');
    if (!thead) return;
    var cols = getActiveCols();
    var html = '<tr>';
    html += '<th class="pv-th pv-th-name" data-sort="__name__">Client' + sortIcon('__name__') + '</th>';
    cols.forEach(function (col) {
      html += '<th class="pv-th" data-sort="' + col.id + '">' + escHtml(col.label) + sortIcon(col.id) + '</th>';
    });
    html += '</tr>';
    thead.innerHTML = html;
  }

  // ── Render rows ──
  function renderRows() {
    var tbody = document.getElementById('pivot-tbody');
    if (!tbody) return;
    var cols = getActiveCols();
    var numDims = state.dimensions.length;
    var html = '';

    sortedRows(filteredClients()).forEach(function (client, ci) {
      var k0 = 'c' + ci;
      var open0 = !!state.expanded[k0];
      var websites = filteredWebsites(client);
      var hasKids0 = websites.length > 0;

      html += '<tr class="pv-row pv-row-l0">';
      html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
      html += hasKids0
        ? '<button class="pv-exp-btn" data-key="' + k0 + '">' + chevron(open0) + '</button>'
        : '<span class="pv-spacer"></span>';
      html += '<span class="pv-row-label">' + escHtml(client.name) + '</span></div></td>';
      cols.forEach(function (col) { html += metricTd(col, client[col.id]); });
      html += '</tr>';

      if (!hasKids0 || !open0) return;

      websites.forEach(function (site, wi) {
        var k1 = k0 + 'w' + wi;
        var open1 = !!state.expanded[k1];
        var siteDimKids = getChannelDimChildren(site);
        var hasDims = numDims > 0 && siteDimKids.length;

        html += '<tr class="pv-row pv-row-l1">';
        html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
        html += hasDims
          ? '<button class="pv-exp-btn" data-key="' + k1 + '">' + chevron(open1) + '</button>'
          : '<span class="pv-spacer"></span>';
        html += '<span class="pv-row-label">' + escHtml(site.name) + '</span></div></td>';
        cols.forEach(function (col) { html += metricTd(col, site[col.id]); });
        html += '</tr>';

        if (!hasDims || !open1) return;

        // Level 2 — first selected dimension (e.g. Campaigns)
        sortedRows(siteDimKids).forEach(function (d1, d1i) {
          var k2 = k1 + 'd' + d1i;
          var open2 = !!state.expanded[k2];
          var hasL3 = numDims > 1 && d1.children && d1.children.length;

          html += '<tr class="pv-row pv-row-l2">';
          html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
          html += hasL3
            ? '<button class="pv-exp-btn" data-key="' + k2 + '">' + chevron(open2) + '</button>'
            : '<span class="pv-spacer"></span>';
          html += '<span class="pv-row-label">' + escHtml(d1.name) + '</span></div></td>';
          cols.forEach(function (col) { html += metricTd(col, d1[col.id]); });
          html += '</tr>';

          if (!hasL3 || !open2) return;

          // Level 3 — second selected dimension (e.g. Ad Groups)
          sortedRows(d1.children).forEach(function (d2, d2i) {
            var k3 = k2 + 's' + d2i;
            var open3 = !!state.expanded[k3];
            var hasL4 = numDims > 2 && d2.children && d2.children.length;

            html += '<tr class="pv-row pv-row-l3">';
            html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
            html += hasL4
              ? '<button class="pv-exp-btn" data-key="' + k3 + '">' + chevron(open3) + '</button>'
              : '<span class="pv-spacer"></span>';
            html += '<span class="pv-row-label">' + escHtml(d2.name) + '</span></div></td>';
            cols.forEach(function (col) { html += metricTd(col, d2[col.id]); });
            html += '</tr>';

            if (!hasL4 || !open3) return;

            // Level 4 — third selected dimension (e.g. Product Segments)
            d2.children.forEach(function (d3) {
              html += '<tr class="pv-row pv-row-l4">';
              html += '<td class="pv-td pv-td-name"><div class="pv-name-cell">';
              html += '<span class="pv-spacer"></span>';
              html += '<span class="pv-row-label">' + escHtml(d3.name) + '</span></div></td>';
              cols.forEach(function (col) { html += metricTd(col, d3[col.id]); });
              html += '</tr>';
            });
          });
        });
      });
    });

    tbody.innerHTML = html;
  }

  // ── Render totals ──
  function renderTotals() {
    var tfoot = document.getElementById('pivot-tfoot');
    if (!tfoot) return;
    var cols = getActiveCols();
    var clients = filteredClients();
    var html = '<tr class="pv-total-row">';
    html += '<td class="pv-td pv-td-name" style="font-weight:600;">Total</td>';
    cols.forEach(function (col) {
      var v = computeTotal(col, clients);
      var cls = 'pv-td';
      if (col.cosColor) cls += cosClass(v);
      html += '<td class="' + cls + '">' + fmtVal(col, v) + '</td>';
    });
    html += '</tr>';
    tfoot.innerHTML = html;
  }

  // ── Chart metric label ──
  function updateChartMetricLabel() {
    var el = document.getElementById('pivot-chart-metric-label');
    if (!el) return;
    if (state.chartMetrics.length === 1) {
      var col = ALL_COLS.filter(function (c) { return c.id === state.chartMetrics[0]; })[0];
      el.textContent = col ? col.label : state.chartMetrics[0];
    } else {
      el.textContent = state.chartMetrics.length + ' Metrics';
    }
  }

  // ── Chart type toggle icon colours ──
  function updateChartTypeToggle() {
    var cs      = getComputedStyle(document.documentElement);
    var blue    = cs.getPropertyValue('--color-blue').trim()         || '#346ed9';
    var caption = cs.getPropertyValue('--color-text-caption').trim() || '#9ca3af';
    var barIcon  = document.getElementById('pv-bar-icon');
    var lineIcon = document.getElementById('pv-line-icon');
    if (barIcon)  barIcon.setAttribute('stroke',  state.chartType === 'bar'  ? blue : caption);
    if (lineIcon) lineIcon.setAttribute('stroke', state.chartType === 'line' ? blue : caption);
  }

  // ── Chart metric panel (checkboxes, channel-filtered) ──
  function buildChartMetricPanel() {
    var panel = document.getElementById('pivot-chart-metric-panel');
    if (!panel) return;
    var channelIds = state.activeChannel === 'sem' ? SEM_COL_IDS : SEO_COL_IDS;
    var cols = ALL_COLS.filter(function (c) { return channelIds.indexOf(c.id) !== -1; });
    var html = '';
    cols.forEach(function (col) {
      var checked = state.chartMetrics.indexOf(col.id) !== -1;
      html += '<label class="pv-check-opt">' +
        '<input type="checkbox" data-chart-metric="' + col.id + '"' + (checked ? ' checked' : '') + '>' +
        '<span>' + escHtml(col.label) + '</span></label>';
    });
    panel.innerHTML = html || '<div class="pv-dd-item" style="color:var(--color-text-subtitle);padding:8px 12px;">No metrics visible</div>';
  }

  // ── Chart group-by label ──
  function updateChartGroupByLabel() {
    var el = document.getElementById('pivot-chart-groupby-label');
    if (el) el.textContent = state.chartGroupBy;
  }

  // ── Chart group-by panel (single-select) ──
  function buildChartGroupByPanel() {
    var panel = document.getElementById('pivot-chart-groupby-panel');
    if (!panel) return;
    var dims = state.activeChannel === 'sem' ? SEM_DIMS : SEO_DIMS;
    var html = '';
    dims.forEach(function (dim) {
      html += '<div class="pv-dd-item' + (state.chartGroupBy === dim ? ' pv-selected' : '') + '" data-pick-groupby="' + escHtml(dim) + '">' + escHtml(dim) + '</div>';
    });
    panel.innerHTML = html;
  }

  // ── Load Chart.js dynamically (script tags in innerHTML partials are not executed) ──
  function loadChartJs(cb) {
    if (typeof Chart !== 'undefined') { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    s.onload = cb;
    s.onerror = function () { console.warn('Pivot: failed to load Chart.js'); };
    document.head.appendChild(s);
  }

  // ── Render chart ──
  function renderChart() {
    var canvas  = document.getElementById('pivot-chart-canvas');
    var emptyEl = document.getElementById('pivot-chart-empty');
    if (!canvas || typeof Chart === 'undefined') return;

    // Sync type toggle icons
    updateChartTypeToggle();

    var activeCols = getActiveCols();

    // Drop charted metrics that are no longer visible
    state.chartMetrics = state.chartMetrics.filter(function (id) {
      return state.visibleCols.indexOf(id) !== -1;
    });
    if (!state.chartMetrics.length && activeCols.length) state.chartMetrics = [activeCols[0].id];
    updateChartMetricLabel();

    // ── Empty state: no metrics at all ──
    if (!state.chartMetrics.length) {
      if (pvChart) { pvChart.destroy(); pvChart = null; }
      canvas.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'flex';
      return;
    }
    canvas.style.display = '';
    if (emptyEl) emptyEl.style.display = 'none';

    var rows   = getChartRows();
    var labels = rows.map(function (r) { return r.name; });

    var cs          = getComputedStyle(document.documentElement);
    var gridColor   = cs.getPropertyValue('--color-border').trim()        || '#e5e7eb';
    var tickColor   = cs.getPropertyValue('--color-text-caption').trim()  || '#9ca3af';
    var textPrimary = cs.getPropertyValue('--color-text-primary').trim()  || '#111827';

    // ── Determine dual-axis need ──
    var hasLeft  = state.chartMetrics.some(function (id) { return LEFT_AXIS_IDS.indexOf(id)  !== -1; });
    var hasRight = state.chartMetrics.some(function (id) { return RIGHT_AXIS_IDS.indexOf(id) !== -1; });
    var dual = hasLeft && hasRight;

    var isBar = state.chartType === 'bar';

    // ── Datasets ──
    var datasets = state.chartMetrics.map(function (id, i) {
      var col    = ALL_COLS.filter(function (c) { return c.id === id; })[0];
      var color  = CHART_COLORS[i % CHART_COLORS.length];
      var axisId = dual ? ((LEFT_AXIS_IDS.indexOf(id) !== -1) ? 'left' : 'right') : 'left';

      if (isBar) {
        return {
          label:           col ? col.label : id,
          data:            rows.map(function (r) { return r[id] || 0; }),
          backgroundColor: hexToRgba(color, 0.75),
          borderColor:     color,
          borderWidth:     1,
          borderRadius:    3,
          yAxisID:         axisId
        };
      } else {
        return {
          label:                col ? col.label : id,
          data:                 rows.map(function (r) { return r[id] || 0; }),
          tension:              0,
          borderColor:          color,
          backgroundColor:      'transparent',
          pointBackgroundColor: '#ffffff',
          pointBorderColor:     color,
          pointBorderWidth:     2,
          pointRadius:          5,
          pointHoverRadius:     7,
          fill:                 false,
          yAxisID:              axisId
        };
      }
    });

    // ── Build scales ──
    function axisTicks(repId) {
      var col = ALL_COLS.filter(function (c) { return c.id === repId; })[0];
      return {
        font:     { size: 12 },
        color:    tickColor,
        callback: (function (colDef) {
          return function (v) { return colDef ? fmtVal(colDef, v) : v; };
        }(col))
      };
    }

    var leftRepId  = state.chartMetrics.filter(function (id) { return LEFT_AXIS_IDS.indexOf(id)  !== -1; })[0]
                  || state.chartMetrics[0];
    var rightRepId = state.chartMetrics.filter(function (id) { return RIGHT_AXIS_IDS.indexOf(id) !== -1; })[0];

    var scales = {
      x: {
        grid:  { color: gridColor },
        ticks: { font: { size: 12 }, color: tickColor, maxRotation: 35 }
      },
      left: {
        display:  true,
        position: 'left',
        grid:     { color: gridColor },
        ticks:    axisTicks(leftRepId)
      }
    };
    if (dual && rightRepId) {
      scales.right = {
        display:  true,
        position: 'right',
        grid:     { drawOnChartArea: false },
        ticks:    axisTicks(rightRepId)
      };
    }

    if (pvChart) { pvChart.destroy(); pvChart = null; }

    pvChart = new Chart(canvas.getContext('2d'), {
      type: isBar ? 'bar' : 'line',
      data: { labels: labels, datasets: datasets },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        interaction:         { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: state.chartMetrics.length > 1,
            labels:  { font: { size: 12 }, color: tickColor, boxWidth: 12, padding: 14 }
          },
          tooltip: {
            backgroundColor: '#ffffff',
            borderColor:     gridColor,
            borderWidth:     1,
            titleColor:      textPrimary,
            bodyColor:       textPrimary,
            padding:         8,
            cornerRadius:    4,
            callbacks: {
              label: (function (metrics) {
                return function (ctx) {
                  var id     = metrics[ctx.datasetIndex];
                  var colDef = id ? ALL_COLS.filter(function (c) { return c.id === id; })[0] : null;
                  return ' ' + (colDef ? colDef.label : ctx.dataset.label) + ': ' +
                         (colDef ? fmtVal(colDef, ctx.raw) : ctx.raw);
                };
              }(state.chartMetrics.slice()))
            }
          }
        },
        scales: scales
      }
    });
  }

  function render() { renderHeader(); renderRows(); renderTotals(); renderChart(); updateChartGroupByLabel(); }

  // ── Panel helpers ──
  var PANEL_IDS = ['pivot-client-panel','pivot-website-panel','pivot-dim-panel','pivot-metrics-panel','pivot-date-panel','pivot-chart-metric-panel','pivot-chart-groupby-panel'];

  function closeAllPanels(except) {
    PANEL_IDS.forEach(function (id) {
      if (id === except) return;
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function positionPanel(btnId, panelId) {
    var btn = document.getElementById(btnId);
    var panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    var r = btn.getBoundingClientRect();
    panel.style.top  = (r.bottom + 4) + 'px';
    panel.style.left = r.left + 'px';
    panel.style.display = 'block';
  }

  // Position a panel above its button (avoids overlapping content below, e.g. the chart canvas)
  function positionPanelAbove(btnId, panelId) {
    var btn = document.getElementById(btnId);
    var panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    panel.style.visibility = 'hidden';
    panel.style.display = 'block';
    var panelH = panel.offsetHeight;
    panel.style.visibility = '';
    var r = btn.getBoundingClientRect();
    panel.style.top  = (r.top - panelH - 4) + 'px';
    panel.style.left = r.left + 'px';
  }

  function togglePanel(btnId, panelId, buildFn, posFn) {
    var panel = document.getElementById(panelId);
    if (panel && panel.style.display !== 'none') {
      panel.style.display = 'none';
      return;
    }
    closeAllPanels(panelId);
    buildFn();
    (posFn || positionPanel)(btnId, panelId);
  }

  // ── Client panel ──
  function buildClientPanel() {
    var panel = document.getElementById('pivot-client-panel');
    if (!panel) return;
    var html = '<div class="pv-dd-item' + (state.selectedClient === 'All Clients' ? ' pv-selected' : '') + '" data-pick-client="All Clients">All Clients</div>';
    CLIENTS_DATA.forEach(function (c) {
      html += '<div class="pv-dd-item' + (state.selectedClient === c.name ? ' pv-selected' : '') + '" data-pick-client="' + escHtml(c.name) + '">' + escHtml(c.name) + '</div>';
    });
    panel.innerHTML = html;
  }

  // ── Website panel ──
  function buildWebsitePanel() {
    var panel = document.getElementById('pivot-website-panel');
    if (!panel) return;
    var client = CLIENTS_DATA.filter(function (c) { return c.name === state.selectedClient; })[0];
    var sites = client ? client.websites : [];
    var html = '<div class="pv-dd-item' + (state.selectedWebsite === 'All Websites' ? ' pv-selected' : '') + '" data-pick-website="All Websites">All Websites</div>';
    sites.forEach(function (s) {
      html += '<div class="pv-dd-item' + (state.selectedWebsite === s.name ? ' pv-selected' : '') + '" data-pick-website="' + escHtml(s.name) + '">' + escHtml(s.name) + '</div>';
    });
    panel.innerHTML = html;
  }

  // ── Dimensions panel — grouped by channel ──
  function buildDimPanel() {
    var panel = document.getElementById('pivot-dim-panel');
    if (!panel) return;
    var html = '';
    // Only show dimensions for the active channel
    DIM_GROUPS.filter(function(grp){ return grp.channel === state.activeChannel; }).forEach(function (grp) {
      grp.dims.forEach(function (dim) {
        var checked = state.dimensions.indexOf(dim) !== -1;
        html += '<label class="pv-check-opt">' +
          '<input type="checkbox" data-dim="' + escHtml(dim) + '" data-dim-channel="' + grp.channel + '"' + (checked ? ' checked' : '') + '>' +
          '<span>' + escHtml(dim) + '</span></label>';
      });
    });
    if (state.dimConflict) {
      html += '<div style="padding:6px 12px 8px; font-size:11.5px; color:var(--color-text-warning); border-top:1px solid var(--color-border); margin-top:4px;">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>' +
        'Dimensions must be from the same channel</div>';
    }
    panel.innerHTML = html;
  }

  // ── Metrics panel — channel-filtered ──
  function buildMetricsPanel() {
    var panel = document.getElementById('pivot-metrics-panel');
    if (!panel) return;
    var channelIds = state.activeChannel === 'sem' ? SEM_COL_IDS : SEO_COL_IDS;
    var html = '';
    ALL_COLS.filter(function (c) { return channelIds.indexOf(c.id) !== -1; }).forEach(function (col) {
      var checked = state.visibleCols.indexOf(col.id) !== -1;
      html += '<label class="pv-check-opt">' +
        '<input type="checkbox" data-col="' + col.id + '"' + (checked ? ' checked' : '') + '>' +
        '<span>' + escHtml(col.label) + '</span></label>';
    });
    panel.innerHTML = html;
  }

  // ── Date panel ──
  function buildDatePanel() {
    var panel = document.getElementById('pivot-date-panel');
    if (!panel) return;
    var opts = ['Last 7 Days','Last 30 Days','Last 90 Days','Last 12 Months','This Month','Last Month'];
    var html = '';
    opts.forEach(function (o) {
      html += '<div class="pv-dd-item' + (state.dateRange === o ? ' pv-selected' : '') + '" data-pick-date="' + escHtml(o) + '">' + escHtml(o) + '</div>';
    });
    panel.innerHTML = html;
  }

  // ── Update dim label button text ──
  function updateDimLabel() {
    var el = document.getElementById('pivot-dim-label');
    if (!el) return;
    el.textContent = state.dimensions.length === 0 ? 'Dimensions'
      : state.dimensions.length === 1 ? state.dimensions[0]
      : state.dimensions.length + ' Dimensions';
  }

  // ── CSV export ──
  function exportCsv() {
    var cols = getActiveCols();
    var lines = [];
    var header = ['"Client"'].concat(cols.map(function (c) { return '"' + c.label + '"'; }));
    lines.push(header.join(','));

    function addLine(name, row, depth) {
      var prefix = depth > 0 ? Array(depth + 1).join('  ') : '';
      var cells = ['"' + prefix + name + '"'];
      cols.forEach(function (col) { cells.push('"' + fmtVal(col, row[col.id]) + '"'); });
      lines.push(cells.join(','));
    }

    var numDims = state.dimensions.length;
    filteredClients().forEach(function (client) {
      addLine(client.name, client, 0);
      filteredWebsites(client).forEach(function (site) {
        addLine(site.name, site, 1);
        var exportKids = getChannelDimChildren(site);
        if (numDims > 0 && exportKids.length) {
          exportKids.forEach(function (d1) {
            addLine(d1.name, d1, 2);
            if (numDims > 1 && d1.children) {
              d1.children.forEach(function (d2) {
                addLine(d2.name, d2, 3);
                if (numDims > 2 && d2.children) {
                  d2.children.forEach(function (d3) { addLine(d3.name, d3, 4); });
                }
              });
            }
          });
        }
      });
    });

    var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'pivot-table.csv';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  // ── Init ──
  function init() {
    CLIENTS_DATA = buildClients();

    var page = document.getElementById('pivot-page');
    if (!page) return;

    // ── Click delegation ──
    page.addEventListener('click', function (e) {

      // Expand / collapse row
      var expBtn = e.target.closest('.pv-exp-btn');
      if (expBtn) {
        var key = expBtn.getAttribute('data-key');
        state.expanded[key] = !state.expanded[key];
        renderRows();
        return;
      }

      // Sort header
      var th = e.target.closest('th[data-sort]');
      if (th) {
        var col = th.getAttribute('data-sort');
        state.sortDir = (state.sortCol === col && state.sortDir === 'desc') ? 'asc' : 'desc';
        state.sortCol = col;
        render();
        return;
      }

      // Client button
      if (e.target.closest('#pivot-client-btn')) {
        togglePanel('pivot-client-btn', 'pivot-client-panel', buildClientPanel);
        return;
      }
      // Website button
      if (e.target.closest('#pivot-website-btn')) {
        togglePanel('pivot-website-btn', 'pivot-website-panel', buildWebsitePanel);
        return;
      }
      // SEM / SEO channel tab buttons
      if (e.target.closest('#pv-tab-sem')) {
        closeAllPanels();
        switchChannel('sem');
        updateDimLabel();
        updateChartGroupByLabel();
        buildDimPanel();
        render();
        return;
      }
      if (e.target.closest('#pv-tab-seo')) {
        closeAllPanels();
        switchChannel('seo');
        updateDimLabel();
        updateChartGroupByLabel();
        buildDimPanel();
        render();
        return;
      }

      // Dimensions button
      if (e.target.closest('#pivot-dim-btn')) {
        togglePanel('pivot-dim-btn', 'pivot-dim-panel', buildDimPanel);
        return;
      }
      // Metrics button
      if (e.target.closest('#pivot-metrics-btn')) {
        togglePanel('pivot-metrics-btn', 'pivot-metrics-panel', buildMetricsPanel);
        return;
      }
      // Date button
      if (e.target.closest('#pivot-date-btn')) {
        togglePanel('pivot-date-btn', 'pivot-date-panel', buildDatePanel);
        return;
      }
      // Chart type toggles
      if (e.target.closest('#pivot-chart-type-bar')) {
        state.chartType = 'bar';
        renderChart();
        return;
      }
      if (e.target.closest('#pivot-chart-type-line')) {
        state.chartType = 'line';
        renderChart();
        return;
      }
      // Chart group-by button
      if (e.target.closest('#pivot-chart-groupby-btn')) {
        togglePanel('pivot-chart-groupby-btn', 'pivot-chart-groupby-panel', buildChartGroupByPanel, positionPanelAbove);
        return;
      }
      // Chart metric button — panel opens above to avoid covering the canvas
      if (e.target.closest('#pivot-chart-metric-btn')) {
        togglePanel('pivot-chart-metric-btn', 'pivot-chart-metric-panel', buildChartMetricPanel, positionPanelAbove);
        return;
      }
      // Export button
      if (e.target.closest('#pivot-export-btn')) {
        exportCsv();
        return;
      }
    });

    // ── Panel item clicks (delegated from document since panels are fixed outside page) ──
    document.addEventListener('click', function (e) {

      // Client pick
      var cp = e.target.closest('[data-pick-client]');
      if (cp) {
        var picked = cp.getAttribute('data-pick-client');
        state.selectedClient = picked;
        document.getElementById('pivot-client-label').textContent = picked;
        // reset website
        state.selectedWebsite = 'All Websites';
        document.getElementById('pivot-website-label').textContent = 'All Websites';
        state.expanded = {};
        document.getElementById('pivot-client-panel').style.display = 'none';
        render();
        return;
      }

      // Website pick
      var wp = e.target.closest('[data-pick-website]');
      if (wp) {
        var wpicked = wp.getAttribute('data-pick-website');
        state.selectedWebsite = wpicked;
        document.getElementById('pivot-website-label').textContent = wpicked;
        state.expanded = {};
        document.getElementById('pivot-website-panel').style.display = 'none';
        render();
        return;
      }

      // Date pick
      var dp = e.target.closest('[data-pick-date]');
      if (dp) {
        var dpicked = dp.getAttribute('data-pick-date');
        state.dateRange = dpicked;
        document.getElementById('pivot-date-label').textContent = dpicked;
        document.getElementById('pivot-date-panel').style.display = 'none';
        render();
        return;
      }

      // Group-by pick
      var gbp = e.target.closest('[data-pick-groupby]');
      if (gbp) {
        state.chartGroupBy = gbp.getAttribute('data-pick-groupby');
        document.getElementById('pivot-chart-groupby-panel').style.display = 'none';
        updateChartGroupByLabel();
        renderChart();
        return;
      }

      // Close panels on outside click
      var inPanel = PANEL_IDS.some(function (id) { return e.target.closest('#' + id); });
      var inBtn = ['pivot-client-btn','pivot-website-btn','pivot-dim-btn','pivot-metrics-btn','pivot-date-btn','pivot-chart-metric-btn','pivot-chart-type-bar','pivot-chart-type-line','pivot-chart-groupby-btn','pv-tab-sem','pv-tab-seo']
        .some(function (id) { return e.target.closest('#' + id); });
      if (!inPanel && !inBtn) closeAllPanels();
    });

    // ── Checkbox changes (dimension / metric) ──
    document.addEventListener('change', function (e) {
      var dimCb = e.target.closest('input[data-dim]');
      if (dimCb) {
        var dim    = dimCb.getAttribute('data-dim');
        var dimCh  = dimCb.getAttribute('data-dim-channel');
        if (dimCb.checked) {
          if (state.dimensions.indexOf(dim) === -1) state.dimensions.push(dim);
        } else {
          var idx = state.dimensions.indexOf(dim);
          if (idx !== -1) state.dimensions.splice(idx, 1);
        }
        state.dimConflict = false;
        state.chartGroupBy = getDefaultGroupBy();
        state.expanded = {};
        updateDimLabel();
        updateChartGroupByLabel();
        buildDimPanel(); // rebuild to show/hide conflict note and update checked state
        render();
        return;
      }

      // Chart metric checkbox
      var cmCb = e.target.closest('input[data-chart-metric]');
      if (cmCb) {
        var cmId = cmCb.getAttribute('data-chart-metric');
        var cmi  = state.chartMetrics.indexOf(cmId);
        if (cmCb.checked) {
          if (cmi === -1) state.chartMetrics.push(cmId);
        } else {
          if (cmi !== -1) state.chartMetrics.splice(cmi, 1);
        }
        updateChartMetricLabel();
        renderChart();
        return;
      }

      var colCb = e.target.closest('input[data-col]');
      if (colCb) {
        var colId = colCb.getAttribute('data-col');
        var vi = state.visibleCols.indexOf(colId);
        if (colCb.checked && vi === -1) state.visibleCols.push(colId);
        if (!colCb.checked && vi !== -1) state.visibleCols.splice(vi, 1);
        // renderChart handles chartMetric fallback if the charted col was removed
        render();
        return;
      }
    });
  }

  // ── Public ──
  function showPivotPage() {
    if (typeof hideFeedDetailPages === 'function') hideFeedDetailPages();
    ['ic-list','ic-detail','integrations-page','feed-data-page'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.style.display = 'none';
    });
    var page = document.getElementById('pivot-page');
    if (page) page.style.display = 'block';
    window.scrollTo(0, 0);
    if (!initialized) { init(); initialized = true; }
    pvSyncChannelTabs();
    render();                        // renders table immediately
    loadChartJs(renderChart);        // loads Chart.js if needed, then renders chart
  }

  window.showPivotPage = showPivotPage;
})();
