# MODULE STATUS - MIU WEB

Last updated: 2026-03-07
Purpose: track implemented vs planned app modules

## 1. App Shell
Status: active foundation

Current state:
- sidebar layout exists
- basic page shell exists
- shell navigation now includes the early `homework AI` workspace

Key file:
- `app/layout.tsx`

## 2. Landing Page
Status: early product-facing placeholder

Current state:
- default starter content has been replaced
- page now points to the AI homework grading workflow as the first live slice

Key file:
- `app/page.tsx`

## 3. Dashboard
Status: placeholder

Current state:
- minimal content only

Key file:
- `app/dashboard/page.tsx`

## 4. Students Module
Status: mock foundation

Current state:
- page exists
- fetches mock local data
- no real CRUD

Key files:
- `app/students/page.tsx`
- `app/api/students/route.ts`

## 5. Authentication
Status: not implemented

## 6. Authorization / Roles
Status: not implemented

## 7. Database Layer
Status: not implemented

## 8. Admin Module
Status: not implemented

## 9. Teacher Module
Status: not implemented

## 10. Student Portal
Status: not implemented

## 11. Content Integration with miu-bank
Status: not implemented

## 12. Overall Assessment
- technical base exists
- product structure is not locked
- data architecture is not locked
- the repo is still in setup / architecture phase

## 13. Homework AI Grading Slice
Status: active workflow prototype

Current state:
- teacher assignment flow now exists in prototype form
- student submission flow now exists in prototype form
- local file storage for assignment attachments and student submissions now exists
- file-backed store now tracks assignments, submissions, complaints, and unlocks
- initial Homework AI policy module now exists so core rules are no longer only scattered constants
- provider grading output now passes through an app-owned normalization layer before storage
- grading job records now exist so inline grading already follows a future async-ready model
- domain services are now split by responsibility instead of staying in one large homework service file
- domain services now go through repository/storage adapters instead of calling file store primitives directly
- repository layer now exposes domain-oriented methods instead of only raw database snapshot read/write
- grading execution is now behind a dedicated executor layer instead of being invoked directly inside submission flow
- teacher-facing Homework AI workspace now exposes a basic AI job-status panel
- Homework AI workspace UI copy has been normalized back to readable Vietnamese UTF-8 text
- teacher-facing Homework AI workspace now exposes a concrete AI job list with per-job status and timing
- teacher review actions now exist for approving AI results or manually editing final scores/feedback
- teacher review history is now stored as separate review records instead of overwriting AI original output
- student-facing result view now prefers the latest teacher-finalized result when a review exists
- teacher review records now include audit-ready fields for review source, version, score delta, latency, and identity source
- teacher review validation now blocks weak edited results unless a teacher note exists and at least one rubric criterion was truly changed
- teacher review UI now uses split-view so the student homework image stays visible beside the review form
- edited review forms now pre-fill from AI output and expose quick teacher-note tags for common correction reasons
- Homework AI workspace is now being normalized toward responsive behavior for mobile, tablet, and desktop instead of assuming desktop-only split layout
- teacher workspace now has a temporary mock-data seed action so manual UI testing can create a sample assignment, submission-with-result, and grading complaint on demand
- mobile horizontal overflow in Homework AI review is now being controlled by responsive CSS classes instead of inline fixed two-column layout rules
- provider adapter structure now exists
- Gemini provider scaffold now follows the current MIU feedback contract draft
- mock provider fallback now exists
- answer key display exists in the student result view
- complaint action exists in the student flow
- one-time unlock action exists in the teacher flow

Key files:
- `app/homework-ai/page.tsx`
- `app/homework-ai/HomeworkAiWorkspace.tsx`
- `app/api/homework-ai/submissions/route.ts`
- `app/api/homework-ai/assignments/route.ts`
- `app/api/homework-ai/complaints/route.ts`
- `app/api/homework-ai/unlocks/route.ts`
- `lib/homework-ai/constants.ts`
- `lib/homework-ai/grading.ts`
- `lib/homework-ai/grading-job-service.ts`
- `lib/homework-ai/grading-executor.ts`
- `lib/homework-ai/assignment-service.ts`
- `lib/homework-ai/submission-service.ts`
- `lib/homework-ai/complaint-service.ts`
- `lib/homework-ai/overview-service.ts`
- `lib/homework-ai/repository.ts`
- `lib/homework-ai/file-repository.ts`
- `lib/homework-ai/file-storage.ts`
- `lib/homework-ai/shared.ts`
- `lib/homework-ai/service.ts`
- `lib/homework-ai/policy.ts`
- `lib/homework-ai/store.ts`
- `lib/homework-ai/types.ts`
- `lib/homework-ai/providers/gemini.ts`
- `lib/homework-ai/providers/mock.ts`

Not implemented yet:
- real database-backed persistence
- background grading job queue
- auth and role protection
- richer teacher review audit/reporting and stricter review validation policies
- production storage strategy
- stricter provider response validation rules and review thresholds
- lifecycle rule for removing temporary seed/testing helpers before production hardening
