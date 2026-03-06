# SYSTEM ARCHITECTURE - MIU WEB

Last updated: 2026-03-06
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
  - return normalized grading result

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
- This is a bridge architecture for speed, not the final production backend.
