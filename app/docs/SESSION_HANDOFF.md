# SESSION HANDOFF - MIU WEB

Last updated: 2026-03-07
Purpose: concise current handoff note for the next working session

## 1. Current Phase
- MIU Web is still in the foundation and architecture lock phase.
- The repo is currently a thin Next.js shell with minimal demo functionality.

## 2. What Has Been Locked
- Repository docs are the canonical memory.
- External-memory docs set has been created in `app/docs/`.
- Engineering implementation consistency is now governed by `app/docs/ENGINEERING_STANDARDS.md`.
- Architecture direction is now also locked toward `scale-ready (san sang mo rong tai)` and `configuration-driven (dieu khien bang cau hinh)` design for changeable business rules.
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
- initial Homework AI policy module for configurable rules
- app-owned grading normalization layer for provider outputs
- grading job records for async-ready lifecycle tracking
- split domain services for assignment, submission, grading job, complaint, and overview flows
- repository and file-storage adapters now sit between domain services and the current file-backed infrastructure
- repository contract now includes domain-oriented methods rather than only snapshot-style read/write
- grading execution now goes through a dedicated executor layer instead of direct provider calls inside submission flow
- teacher-facing workspace now shows a simple AI processing status panel for queued/processing/failed jobs
- Homework AI workspace text/labels have been normalized back to readable Vietnamese so the screen is easier to review and extend
- teacher-facing workspace now also shows a concrete AI job list with status, provider, timing, and error visibility
- teacher review flow is now locked to preserve AI original output while storing separate review records for teacher-finalized decisions
- teacher review validation and audit fields are now stronger so later SLA/KPI analysis can rely on the review records more safely
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
- settings/policy boundary for changeable homework rules

## 5. Current Implementation Note
- A working prototype scaffold now exists for image-based AI homework grading.
- It is intentionally `provider-agnostic` at the integration boundary.
- Current persistence is local-file based for speed, not production-grade storage.
- The next technical step is to decide the production persistence path and the exact normalized grading contract.
- The next architecture step is to define the settings/policy boundary so current Homework AI rules do not stay hard-coded too deeply.
- The first implementation step in that direction is now done: current Homework AI rules have started moving into a dedicated policy module.
- Another implementation step is now done: provider grading results are normalized by app-owned logic before persistence instead of being trusted as raw provider output.
- Another implementation step is now done: each submission now creates and updates a grading job record even though grading still runs inline today.
- Another implementation step is now done: the old monolithic homework service has been split into smaller domain services while preserving current route imports through a thin facade.
- Another implementation step is now done: domain services no longer call the file store directly; they now go through repository/storage adapters so future persistence migration is less invasive.
- Another implementation step is now done: the repository layer now speaks more in domain actions like finding assignments, saving submissions, updating grading jobs, and working with complaints/unlocks.
- Another implementation step is now done: submission flow no longer calls the provider directly; it now goes through a grading executor abstraction so queue/worker migration later is cleaner.
- Another implementation step is now done: the Homework AI workspace now surfaces basic job-status visibility so operational state is less hidden from the teacher view.
- Another implementation step is now done: the Homework AI workspace file has been rewritten in clean UTF-8 Vietnamese text while preserving the current workflow structure.
- Another implementation step is now done: teachers can now inspect individual AI grading jobs instead of relying only on summary counters.
- Another implementation step is now done: teachers can now approve AI output or create a manual final grading record without overwriting the original AI result.
- Another implementation step is now done: teacher review records now preserve source, version, score delta, latency, and reviewer identity source for later reporting.
- Another implementation step is now done: teacher review UI now keeps homework images visible beside the review form, pre-fills edit fields from AI output, and offers quick teacher-note tags.
- Another implementation direction is now locked: responsive layout must be handled with CSS media queries in `globals.css`, with mobile-safe stacked layouts for Homework AI review screens.
- Another implementation step is now done: a temporary Homework AI seed route can create mock review data so the teacher-review UI can be manually tested without waiting for real AI submissions.
- Another implementation step is now done: fixed two-column review sub-layouts have started moving into responsive CSS classes so the mobile review screen does not overflow horizontally.
- Manual mobile testing found one more UX issue still pending: on very narrow screens, the right-side review content can become too narrow and hard to read even after overflow control. The next UI pass should widen or restack that content more aggressively on small mobile widths.
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
- Recommended next priority if Homework AI continues:
  - connect review identity to real auth/session once Authentication is chosen
  - decide whether review analytics should stay in homework module or move into a reporting layer later
  - then choose between real persistence strategy or broader UI/navigation cleanup based on immediate product need
## 6. Required Reading Next Session
1. `PROJECT_OVERVIEW.md`
2. `PROJECT_MEMORY.md`
3. `DECISIONS_LOG.md`
4. `ENGINEERING_STANDARDS.md`
5. `MODULE_STATUS.md`
6. `OPEN_QUESTIONS.md`
7. `RISK_REGISTER.md`
8. `DOC_MAINTENANCE_PROTOCOL.md`
9. `COLLABORATION_CONVENTIONS.md`
10. `WHEN_TO_START_NEW_SESSION.md`
11. this file

## 7. End-of-Session Rule
- If this repo's architecture understanding changes, docs must be updated before the session is considered complete.
- Use `SESSION_CLOSEOUT_TEMPLATE.md` before closing meaningful sessions.
