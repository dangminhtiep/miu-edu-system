# ROADMAP - MIU WEB

Last updated: 2026-03-06
Status: active planning roadmap

## Phase 1. External Memory Lock
Goal:
- create durable project memory in repo docs

Status:
- completed

## Phase 2. Role Model and Scope Lock
Goal:
- define who uses the app, what each role does, and what is truly in scope for phase 1

Deliverables:
- `ROLE_MODEL (mo hinh vai tro)`
- `PHASE_1_SCOPE (pham vi giai doan 1)`
- role-based visibility assumptions

Status:
- active, but now running in parallel with the first operational slice definition

## Phase 3. Core Entity and Data Architecture
Goal:
- define the initial app data model

Deliverables:
- entities
- ownership boundaries
- API/data flow assumptions
- state/lifecycle assumptions

Status:
- next priority for the homework grading slice

## Phase 4. Foundation OS
Goal:
- build the non-negotiable platform base

Deliverables:
- auth
- RBAC
- branch / tenant scope
- settings engine
- audit log

Status:
- not started

## Phase 5. Operational Core
Goal:
- build the first real operating modules

Deliverables:
- student and parent management
- class and enrollment management
- attendance
- homework workflow
- mini-test workflow
- billing basic

Status:
- not started

Immediate wedge inside this phase:
- `AI homework grading` is the first operational slice to implement
- first target submission mode is student-submitted images
- first AI provider is Gemini, but integration must remain provider-agnostic

## Phase 6. Replace Placeholder UI
Goal:
- turn starter UI into intentional product interfaces

Deliverables:
- home page
- dashboard
- module dashboards

Status:
- not started

## Phase 7. Integration Foundations
Goal:
- prepare real backend and cross-system integration

Deliverables:
- database connection plan
- notification integration plan
- miu-bank integration plan

Status:
- not started

## Phase 8. Intelligence Layers
Goal:
- introduce analytics and strategic intelligence after the operational core is stable

Deliverables:
- QA analytics
- KPI layers
- MPI advisory engine
- talent radar planning

Status:
- not started
