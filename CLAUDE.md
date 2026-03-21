# Argos v3 Prototype — Claude Code Context

## MODULE BOUNDARIES — read only what the task needs
* Sidebar / navigation / dark mode → `html/sidebar.html` + `js/core.js`
* Issue Center → `html/issue-center.html` + `js/core.js`
* Feed Data Tool → `html/feed-data-tool.html` + `js/feed-data-tool.js`
* Permission Manager → `html/permission-manager.html` + `js/permission-manager.js`
* Annotations → `html/annotations.html` + `js/annotations.js`
* Alerts Management → `html/alerts.html` + `js/alerts.js`
* Business Rule Manager → `html/business-rules.html` + `js/business-rules.js`
* Overview (SEM/SEO) → `html/overview.html` + `js/overview.js`
* Highlights Table → `html/highlights-table.html` + `js/highlights-table.js`
* Styles only → `css/styles.css`
* Shared modals → `html/modals-shared.html`
* Do NOT read `index.html` for feature work
* Do NOT read files outside the current task's module
* Use `/clear` between unrelated tasks

## What This Project Is
A high-fidelity interactive prototype for **Argos v3**, a StatBid internal tool that helps
account managers monitor and manage client issues, campaigns, and performance. This is
a prototype only — no backend, no real data, everything is hardcoded/simulated.

## Tech Stack
- **Single HTML file** — everything lives in one file (HTML + CSS + JS inline)
- No frameworks, no build tools, no package.json
- Deployed to Netlify via GitHub (repo: argosv3prototype, branch: main)
- Live URL: https://argosv3prototype.netlify.app

## Current File
`index.html` — this is the only file that matters

## What's Already Built
1. **Auth flow** — Sign In, Sign Up screens
2. **Onboarding** — multi-step flow (store name → connect platforms → goals)
3. **Dashboard shell** — sidebar navigation + top bar
4. **Sidebar sections:**
   - User Management
   - Client Management
   - Tools (with Issue Center active)
   - Reports
   - Monitoring
5. **Issue Center (fully built)** — the main landing page after login
   - 32 clients with websites
   - Filters: Client, Website, Severity, Status, Date Range
   - Search
   - Table with columns: Issue, Severity, Status, Date Discovered, Last Modified, Action
   - Severity types: Action Required (red), Review Recommended (yellow), Information (grey)
   - Status types: Needs Review (yellow), Resolved (green), In Progress (blue)
   - Last Modified shows avatar + name + timestamp

## Design System (from Figma file: EHWfuEdchYelARBtWOQylt)
- **Primary blue:** #346ed9
- **Background:** #0f0f0f (dark) / #ffffff (light)
- **Sidebar bg:** #1a1a1a
- **Fonts:** Instrument Sans (headings), DM Sans (body)
- **Border radius:** 8px standard, 20px for pills/badges
- **Figma connector is available** — use it to pull designs before building any new section

## Key Design Rules
- Always pull Figma designs BEFORE writing any code for a new section
- Match designs pixel-accurately — spacing, typography, colors, component shapes
- Keep everything in the single HTML file — no separate CSS or JS files
- All data is hardcoded — no API calls needed
- Prototype should feel real and interactive (hover states, active states, transitions)

## How to Deploy
After making changes:
```
git add .
git commit -m "describe what changed"
git push
```
Netlify auto-deploys within seconds. Live at https://argosv3prototype.netlify.app

## What to Build Next
The following sections still need to be built (in rough priority order):
1. **Client Management** — list of all 32 clients, their status, websites, account managers
2. **Issue Detail view** — clicking an issue row opens a detailed view/drawer
3. **User Management** — team members, roles, permissions
4. **Reports** — performance reports per client
5. **Monitoring** — real-time monitoring dashboard

## Figma Access
- File key: `EHWfuEdchYelARBtWOQylt`
- Always fetch the specific node for the section being built
- The Figma MCP connector is available in this environment

## Tone / Working Style
- Keep responses concise — show code, don't over-explain
- Always preview changes in context of the full file
- When something is ambiguous, make a reasonable design decision and note it
- Never break existing sections when adding new ones
