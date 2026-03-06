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
- The first operational slice to build can be `AI homework grading`.
- First input mode should be student-submitted homework images.
- Gemini is the first AI provider candidate because of promising early manual testing.
- The integration must remain provider-agnostic so future AI providers can replace Gemini without rewriting the homework workflow.
- AI grading output must preserve traceability and leave room for future teacher / assistant override.

## 3. What Exists Now
- root app layout
- dashboard placeholder
- students placeholder page
- mock students API route
- homework AI grading workspace page
- homework AI submissions API route
- local file-backed homework submission store
- Gemini provider scaffold and mock provider fallback

## 4. What Is Not Yet Locked
- role model
- exact implementation order around the homework grading slice
- data architecture
- backend strategy
- integration strategy with `miu-bank`
- exact core entity map
- HQ vs branch boundary model
- storage strategy for homework images
- normalized AI provider contract and review thresholds

## 5. Current Implementation Note
- A working prototype scaffold now exists for image-based AI homework grading.
- It is intentionally `provider-agnostic` at the integration boundary.
- Current persistence is local-file based for speed, not production-grade storage.
- The next technical step is to decide the production persistence path and the exact normalized grading contract.
- For local development, `Webpack` is currently safer than `Turbopack` in this environment because `Turbopack panic` errors were observed during testing.
- The current prototype UI does not yet reflect the corrected business flow where teachers define assignments first and students only select assigned homework to submit.
- Additional temporary product rules are now locked:
  - one normal submission only
  - late submission allowed but flagged
  - immediate result for non-flagged submissions
  - `MIU` + `ban` tone
  - answer key shown after grading
  - student complaint action required
  - wrong submission recovery uses complaint plus one teacher unlock
  - Gemini output must stay structured and follow MIU student-facing language rules
- The prototype UI and APIs have now been refactored to reflect the teacher-first assignment flow and student complaint/unlock flow.
- Local lint passed after refactor; full local runtime verification still depends on opening the app manually in the local environment.
## 6. Required Reading Next Session
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

## 7. End-of-Session Rule
- If this repo's architecture understanding changes, docs must be updated before the session is considered complete.
- Use `SESSION_CLOSEOUT_TEMPLATE.md` before closing meaningful sessions.
