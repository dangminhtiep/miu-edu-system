# MODULE STATUS - MIU WEB

Last updated: 2026-03-06
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
- `lib/homework-ai/service.ts`
- `lib/homework-ai/providers/gemini.ts`
- `lib/homework-ai/providers/mock.ts`

Not implemented yet:
- real database-backed persistence
- background grading job queue
- auth and role protection
- teacher review resolution flow beyond the current unlock action
- production storage strategy
- stronger provider response validation
