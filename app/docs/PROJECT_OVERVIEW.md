# PROJECT OVERVIEW - MIU WEB

Last updated: 2026-03-07
Status: foundation stage with first operational slice selected
Purpose: external memory for the MIU Web application

## 1. North Star
- Build MIU Web as the operational interface for the MIU ecosystem.
- The system is expected to serve multiple roles over time:
  - admin
  - teacher
  - student
  - operations / center management
- It will later connect with MIU content systems such as `miu-bank` and other operational data sources.

Expanded interpretation from master vision:
- MIU Web is not just a website or a simple CRM.
- It is intended to become a `role-based web operating system (he thong van hanh web theo vai tro)` for the whole MIU EDU ecosystem.
- Long-term scope includes:
  - growth and enrollment workflows
  - academic operations
  - finance and billing operations
  - HR and teaching quality operations
  - branch and franchise operations
  - internal intelligence and early-warning layers

## 2. Current Reality
- The repository is currently a minimal `Next.js app (ung dung Next.js)` foundation.
- It contains:
  - a root layout with sidebar
  - a dashboard page
  - a students page
  - a sample students API route
- The landing page is still mostly default template content.
- No real backend integration exists yet.

## 3. Strategic Principles
- Docs in this repo must act as canonical memory for app architecture and product decisions.
- Repo reality must be tracked separately from planned architecture.
- UI exploration should not be confused with stable business logic.
- The app should be designed for role-based visibility and future integration with MIU systems.

Additional strategic principle now locked:
- The master document is a `vision document (tai lieu tam nhin)`, not yet a final `implementation specification (dac ta trien khai)`.
- Therefore the project must be broken into implementation phases before large feature work starts.

Additional strategic principle now locked:
- MIU Web should prefer `configuration-driven (dieu khien bang cau hinh)` design for rules that may change across phases, branches, or modules.
- The system should distinguish:
  - stable domain lifecycle
  - changeable policy/configuration
  - replaceable infrastructure adapters
- Near-term implementation must avoid hard-coding temporary MVP rules so deeply that later scale or policy changes require full rewrites.

Additional strategic principle now locked:
- MIU Web should avoid `over-engineering (thiet ke qua tay)` that slows the currently locked operational slice.
- Technical work must be prioritized by:
  - current phase goals
  - immediate product value
  - architectural leverage for the next likely step
- Future-ready structure is required, but it must not become an excuse to drift away from the current Homework AI goal.

## 4. What Exists Right Now
- `app/layout.tsx`
  - app shell with sidebar and main content area
- `app/dashboard/page.tsx`
  - simple dashboard placeholder
- `app/students/page.tsx`
  - server page fetching from local API
- `app/api/students/route.ts`
  - mock JSON response
- `app/homework-ai/page.tsx`
  - early AI homework grading workspace
- `app/api/homework-ai/submissions/route.ts`
  - submission and grading API prototype
- `lib/homework-ai/*`
  - provider-agnostic homework grading scaffold
- `app/docs/SYSTEM_STATE.md`
  - very early project state note

## 5. What Is Not Implemented Yet
- authentication
- authorization / role system
- real database connection
- domain models
- dashboard metrics
- student management workflows
- teacher workflows
- admin workflows
- content integration with `miu-bank`

## 6. Immediate Priorities
1. Lock the external-memory documentation set for this repo.
2. Design the first operational slice: `AI homework grading (cham bai tap ve nha bang AI)` for current students.
3. Define the intended system modules.
4. Define the `role model (mo hinh vai tro)`.
5. Define the initial `data architecture (kien truc du lieu)`.
6. Replace template pages with intentional product-facing structure.
7. Separate `phase 1 must-have (bat buoc giai doan 1)` from long-term strategic layers.
8. Define which rules belong in code now and which should become configurable settings/policies.

## 7. Recommended System Layers
To avoid scope overload, MIU Web should be viewed as 4 layers:
- `Foundation OS (nen mong he thong van hanh)`
  - auth
  - RBAC
  - branch / tenant scope
  - settings
  - audit log
- `Operational Core (loi van hanh)`
  - students
  - parents
  - classes
  - enrollment
  - attendance
  - homework
  - mini-test
  - billing
- `Business Intelligence (tri tue kinh doanh)`
  - KPI
  - payroll
  - P&L
  - QA analytics
  - funnel analytics
- `Strategic Intelligence (tri tue chien luoc)`
  - MPI
  - talent radar
  - franchise intelligence
  - advanced anti-leak

## 8. Implementation Truth
- The master document contains many strong strategic ideas.
- The current repo only implements a very small foundation subset.
- Future sessions must not confuse:
  - vision
  - planned modules
  - actually implemented features

## 9. First Operational Slice Now Chosen
- The first real workflow to build can be `AI homework grading` because it serves an immediate operational need.
- The first submission mode should be student-submitted images of homework.
- Gemini is the first intended AI provider because it has shown good early grading quality in manual testing.
- However, the system must be designed so the AI provider can be replaced later without changing the core homework workflow.
- This means the app should separate:
  - homework domain data
  - submission storage
  - AI provider adapter
  - grading result normalization
  - future human review / override
  - teacher review records that preserve final human decisions separately from AI output
## 10. Source of Truth for Future Sessions
Read these first in order:
1. `app/docs/PROJECT_OVERVIEW.md`
2. `app/docs/PROJECT_MEMORY.md`
3. `app/docs/DECISIONS_LOG.md`
4. `app/docs/ENGINEERING_STANDARDS.md`
5. `app/docs/MODULE_STATUS.md`
6. `app/docs/OPEN_QUESTIONS.md`
7. `app/docs/RISK_REGISTER.md`
8. `app/docs/SESSION_HANDOFF.md`
9. `app/docs/DOC_MAINTENANCE_PROTOCOL.md`
10. `app/docs/COLLABORATION_CONVENTIONS.md`
