# ENGINEERING STANDARDS - MIU WEB

Last updated: 2026-03-07
Purpose: lock the working engineering standards so code generated across sessions stays consistent

## 1. Default Technical Stack
- Primary language is `TypeScript (ngon ngu TypeScript)`.
- Application framework is `Next.js App Router (khung ung dung Next.js App Router)`.
- UI layer uses `React function components (component ham React)` with server/client boundaries chosen intentionally.
- Styling default is the current repo-native approach:
  - global styles in `app/globals.css`
  - local UI styles may use typed inline style objects when the screen is still in prototype phase
- Linting standard is `ESLint (bo kiem tra quy tac ma nguon)` via `eslint.config.mjs`.
- Local development standard remains `next dev --webpack`.

## 2. What Is Standardized Now
### Language and file types
- New application code should default to `.ts` or `.tsx`.
- Do not introduce new runtime languages for product code unless explicitly approved.
- Do not add parallel implementations in another language for the same feature.
- Shell scripts for local ops are acceptable only when clearly operational and small in scope.

### Type safety
- Keep `strict` TypeScript as the baseline.
- Prefer explicit domain types in `lib/.../types.ts` for shared contracts.
- Prefer `type`/`interface` declarations over ad-hoc object shapes repeated across files.
- Avoid `any`; use `unknown` first when a value is not yet trusted.
- Normalize provider or transport responses into app-owned types before they touch UI or domain logic.

### Naming
- Use `PascalCase (kieu dat ten PascalCase)` for React component names and exported type names.
- Use `camelCase (kieu dat ten camelCase)` for variables, functions, and object fields.
- Use `UPPER_SNAKE_CASE` only for module-level constants.
- Use ASCII identifiers in code.
- UI copy may use Vietnamese with diacritics, but stored enum values, field keys, filenames, and code identifiers should stay ASCII and stable.

### Module boundaries
- `app/` owns routes, pages, layouts, and route handlers.
- `lib/` owns domain logic, storage helpers, provider adapters, and reusable pure utilities.
- Shared domain contracts should live in `lib/<module>/types.ts` when they are used by more than one file.
- Avoid placing business logic directly inside `page.tsx` or route files when it can live in `lib/`.
- Avoid hard-coding changeable business rules directly in page files; prefer a policy/config module when a rule is likely to evolve.

### React conventions
- Default to `Server Components (component may chu)` unless client state, browser APIs, or interactive handlers are required.
- Add `"use client"` only where needed.
- Keep components small enough that state and submission flow are locally understandable.
- Extract repeated UI pieces into small local components before duplication spreads.
- Do not add `useMemo`/`useCallback` by default unless there is a clear render or dependency reason.

### API and server conventions
- Route handlers should stay thin and delegate domain work to `lib/`.
- Validate all `FormData (du lieu form)` or request payloads at the boundary.
- Throw user-facing errors in controlled Vietnamese copy when the error is part of normal product behavior.
- Keep internal normalization, provider metadata, and storage details out of the route layer where possible.
- Design server actions and route handlers so they can later move behind queues, workers, or other infrastructure without changing the domain contract.

### Data and time
- Persist timestamps as ISO 8601 strings in UTC via `toISOString()`.
- Store machine-stable values in English/ASCII for statuses, enums, provider ids, and data keys.
- Separate display text from stored values.
- Prefer app-owned identifiers and lifecycle states over provider-owned or UI-owned state naming.

### Changeability and scale
- Distinguish `stable domain rules (quy tac nghiep vu on dinh)` from `changeable policy (chinh sach co the thay doi)`.
- If a rule is likely to vary by phase, branch, provider, or operations policy, do not bury it as a magic number/string deep in implementation code.
- Default long-term production direction should assume:
  - stateless app nodes
  - database-backed metadata
  - object storage for files
  - async processing for AI-heavy work
  - auditability for important state changes

### Styling and UI
- Reuse the current visual language inside an existing feature unless there is an intentional redesign.
- Prefer a shared style token/object within the same file over repeating raw inline values many times.
- When a screen moves beyond prototype complexity, promote repeated visual rules into `app/globals.css` or a dedicated shared UI layer instead of expanding giant inline-style files indefinitely.

### Text and encoding
- Source files should use UTF-8 encoding.
- Vietnamese user-facing text should keep full diacritics in docs and UI copy.
- If tooling or terminal output shows mojibake, treat that as an encoding/tooling issue, not a reason to downgrade product copy into ASCII.

## 3. Deferred Standards
- `Prettier (bo dinh dang ma nguon)` is not locked yet because the repo does not currently use it.
- A component library or design system is not locked yet.
- Database ORM / schema tooling is not locked yet.
- Test framework is not locked yet.

## 4. Why This Standard Was Chosen
- It matches the repo's real stack today instead of inventing a second standard.
- It minimizes cross-session drift by reducing freedom in language, naming, and file placement.
- It keeps the current prototype moving without forcing a premature design-system or infra migration.

## 5. Known Tradeoffs
- Strength:
  - lower drift across sessions
  - easier review because patterns stay predictable
  - preserves provider-agnostic domain layering already started in Homework AI
- Weakness:
  - inline styling can become hard to scale if left unchecked
  - no formatter lock means some whitespace/style variance can still appear
  - no test standard yet means quality checks are still lighter than desired

## 6. Rule For Future Sessions
- Before implementing meaningful new code, align with this file unless the user explicitly approves an exception.
- If a new standard is introduced later, record:
  - the decision in `DECISIONS_LOG.md`
  - the working rule here
  - any changed reading order in `DOC_MAINTENANCE_PROTOCOL.md` and `SESSION_HANDOFF.md`
