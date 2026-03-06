# SYSTEM ARCHITECTURE - MIU WEB

Last updated: 2026-03-07
Status: draft foundation architecture

## 1. Current Technical Stack
- `Next.js (ung dung web Next.js)`
- `React (thu vien giao dien React)`
- `TypeScript (ngon ngu TypeScript)`
- `App Router (bo dinh tuyen App Router)`

## 2. Current Structure
- `app/layout.tsx`
- `app/page.tsx`
- `app/dashboard/page.tsx`
- `app/students/page.tsx`
- `app/api/students/route.ts`
- `app/homework-ai/page.tsx`
- `app/homework-ai/HomeworkAiWorkspace.tsx`
- `app/api/homework-ai/submissions/route.ts`
- `lib/homework-ai/*`

## 3. Near-Term Intended Architecture
- presentation layer
- page/module layer
- data access layer
- API layer
- integration layer

For the first homework grading slice, the intended separation is:
- presentation layer for assignment, submission, and results
- homework domain layer for assignments, submissions, grading jobs, and grading results
- storage layer for submission images
- AI provider adapter layer
- normalization layer that converts provider output into app-owned grading schemas

## 4. Role-Oriented Direction
The app is expected to support:
- admin views
- teacher views
- student views
- operations views

This is not implemented yet, but it should shape navigation, data visibility, and future module design.

## 5. Integration Direction
The web app is expected to integrate later with:
- student and center data sources
- financial / operational data
- content assets and structured educational content from `miu-bank`

## 6. Current Gap
- No stable domain model is defined yet.
- No data ownership boundaries are defined yet.
- No route/module structure for long-term scale is locked yet.

## 6A. Locked Architecture Direction For Scale And Change
The system should be designed around 3 layers of change:
- `stable domain lifecycle (vong doi nghiep vu on dinh)`
  - assignments
  - submissions
  - grading jobs
  - grading results
  - complaints
  - review actions
- `configuration/policy layer (lop cau hinh/chinh sach)`
  - submission limits
  - late handling
  - review thresholds
  - attachment limits
  - provider selection
  - feature toggles
- `infrastructure adapter layer (lop ket noi ha tang)`
  - database adapter
  - object storage adapter
  - AI provider adapter
  - grading executor adapter
  - queue/worker adapter
  - notification adapter

Rules:
- stable lifecycle rules should not depend on one specific provider, storage backend, or temporary UI shape
- changeable business rules should not be scattered as magic constants across pages and route handlers
- infrastructure choices must be replaceable without redesigning the homework domain

## 6B. Scale-Ready Production Direction
The current prototype is intentionally small, but production direction should assume:
- stateless web application nodes
- metadata stored in a real database
- uploaded files stored in object storage rather than local disk
- AI grading executed through async jobs/workers rather than long synchronous request cycles
- idempotent submission/grading actions where retry may happen
- audit log coverage for important teacher/student actions
- observability for queue failures, provider failures, and review rates

This does not mean building all of it immediately.
It means current design should avoid blocking that future path.

## 7. AI Homework Integration Direction
- The first AI workflow is image-based homework grading.
- Gemini is the first intended provider, but it must not be wired directly into page logic or domain logic.
- The system should define an internal grading contract first, then implement Gemini as one provider adapter.
- Provider-specific concerns should stay in the integration layer:
  - model IDs
  - request formatting
  - file upload conventions
  - raw provider responses
- App-owned concerns should stay outside the provider layer:
  - assignment authoring
  - assignment attachment lifecycle
  - assignment lifecycle
  - submission lifecycle
  - grading status
  - normalized result schema
  - review flags
  - future teacher override
  - provider result normalization before persistence

Recommended homework slice split:
- teacher flow:
  - create assignment
  - attach prompt materials
  - define rubric
  - define answer key
  - assign to students/classes
- student flow:
  - view assigned homework
  - open prompt materials
  - submit answer images
  - view AI result if not flagged
  - compare with answer key
  - submit complaint if needed
  - resubmit only if teacher unlocks one extra attempt after complaint
- AI flow:
  - receive assignment context plus student submission
  - create grading job record
  - return normalized grading result

Recommended policy/config split for homework:
- stable in domain:
  - assignment entity
  - submission entity
  - complaint entity
  - unlock entity
  - grading result entity
- configurable over time:
  - max attempts
  - late policy
  - accepted file types and size/page limits
  - review threshold
  - active AI provider
  - complaint categories
  - prompt version selection

Student-facing AI response contract should contain:
- total score
- praise
- mistakes to note
- suggestions for improvement
- confidence
- review flag

Student-facing AI language rules should contain:
- speaker is `MIU`
- learner is addressed as `ban`
- wording is respectful, concise, encouraging, and non-judgmental
- uncertain cases must escalate to review rather than sounding falsely certain

## 8. Prototype Implementation Added
- The current prototype uses:
  - a page workspace with separate teacher and student areas
  - API routes for assignments, submissions, complaints, and unlocks
  - local file persistence under `public/uploads/homework-ai/`
  - file-backed metadata persistence under `data/homework-ai/database.json`
  - a provider registry that can switch between `gemini` and `mock`
  - app-owned policy and grading normalization modules inside `lib/homework-ai/`
  - grading job records even though execution is still inline
- This is a bridge architecture for speed, not the final production backend.

## 9. Architecture Advice For Current Homework App Work
To keep the current slice extensible, near-term implementation should move toward:
- explicit domain services for assignments, submissions, complaints, and unlocks
- a policy/settings module that owns changeable homework rules
- storage/provider interfaces that hide local-file MVP details
- a grading job concept even if the first implementation still executes inline
- persistence models that preserve provider metadata, review state, and future teacher override
- an app-owned normalization layer that validates and stabilizes provider grading output before storing it

Current implementation has now started this split with separate service files for:
- assignment creation
- submission and grading
- grading job lifecycle
- complaint and unlock handling
- overview aggregation

Current implementation has also started the infrastructure boundary with:
- repository adapter for metadata persistence
- file storage adapter for uploaded files
- file-backed implementations used underneath those adapters for the current MVP
- repository methods increasingly follow domain behavior such as finding assignments, saving submissions, updating jobs, and resolving complaints
- grading executor abstraction so current inline execution can later be replaced by queued execution with smaller domain impact
