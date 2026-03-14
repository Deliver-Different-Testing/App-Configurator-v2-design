# App Configurator v2 (Automation Engine)
**Last Updated:** 2026-03-14

## Status
- **Frontend:** Deployed to GitHub Pages (clean repo, Tailwind v3)
- **Backend:** 3-project .NET solution (Core/Infrastructure/Api), 49 C# files — Steve approved full rebuild from scaffold
- **Handover:** HANDOVER-GARRY.md + FiltersUpdate.md on `feature/automation-engine-backend` branch
- **SP analysis complete:** 1,152 lines, 6 condition types, 4 action types

## Key Decisions
- Rebuild backend from clean scaffold, not retrofit existing code
- App-Configurator-v2 is the clean repo (Tailwind v3 + PostCSS) — the v4 rebuild broke styling
- Sidebar must match staging — full nav with General, Services, Users & Permissions, Advanced
- Demo mode: `IS_DEMO` flag (true when `VITE_API_BASE_URL` not set); rich `sampleData.ts`

## Architecture Notes
- **SP → C# migration:** Cursor-based rule processing with `#MatchingJobs` temp table
- Condition types: RUN_SCAN, UNASSIGNED, ASSIGNED, SCHEDULE_BASED_BEFORE/AFTER/AT
- Action types: UPDATE_STATUS, CREATE_EVENT, CREATE_TASK, SEND_EMAIL
- Filter logic: CHARINDEX on comma-separated values
- 6 inline filters: Priority, From/To Site, From/To Region, Time Threshold
- Frontend live: `https://deliver-different-testing.github.io/App-Configurator-v2/`

## Handover Log
| Date | Event |
|------|-------|
| 2026-03-09 | Original App-Configurator baseline preserved |
| 2026-03-10 | v2 repo created with Tailwind v3 source (fixing v4 styling breakage) |
| 2026-03-11 | HANDOVER-GARRY.md + FiltersUpdate.md pushed to `feature/automation-engine-backend` |
| 2026-03-14 | PROJECT-STATUS.md added for dev productivity tracking |
