# SESSION HANDOFF - MIU WEB

Last updated: 2026-03-06
Purpose: concise current handoff note for the next working session

## 1. Current Phase
- MIU Web is still in the foundation and architecture lock phase.
- The repo is currently a thin Next.js shell with minimal demo functionality.

## 2. What Has Been Locked
- Repository docs are the canonical memory.
- External-memory docs set has been created in `app/docs/`.
- The master document is now understood as a `vision document (tai lieu tam nhin)`, not yet a final implementation spec.
- The system should be broken into 4 layers:
  - Foundation OS
  - Operational Core
  - Business Intelligence
  - Strategic Intelligence
- Current priority is to define system scope, modules, roles, and data architecture before scaling features.
- Recommended phase 1 focus:
  - auth
  - RBAC
  - student/parent/class/enrollment
  - attendance
  - homework basic
  - mini-test basic
  - billing basic
  - notification basic
  - settings basic
  - audit log basic

## 3. What Exists Now
- root app layout
- dashboard placeholder
- students placeholder page
- mock students API route

## 4. What Is Not Yet Locked
- role model
- module priority order
- data architecture
- backend strategy
- integration strategy with `miu-bank`
- exact core entity map
- HQ vs branch boundary model

## 5. Required Reading Next Session
1. `PROJECT_OVERVIEW.md`
2. `PROJECT_MEMORY.md`
3. `DECISIONS_LOG.md`
4. `MODULE_STATUS.md`
5. `OPEN_QUESTIONS.md`
6. `RISK_REGISTER.md`
7. `DOC_MAINTENANCE_PROTOCOL.md`
8. `COLLABORATION_CONVENTIONS.md`
9. `WHEN_TO_START_NEW_SESSION.md`
10. this file

## 6. End-of-Session Rule
- If this repo's architecture understanding changes, docs must be updated before the session is considered complete.
- Use `SESSION_CLOSEOUT_TEMPLATE.md` before closing meaningful sessions.
