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

## 3. Near-Term Intended Architecture
- presentation layer
- page/module layer
- data access layer
- API layer
- integration layer

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

