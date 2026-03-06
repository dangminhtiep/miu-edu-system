# DOC MAINTENANCE PROTOCOL - MIU WEB

Last updated: 2026-03-06
Purpose: define where project knowledge must be recorded so future sessions do not depend on chat memory

## 1. Mandatory Update Rules
### When a new decision is finalized
Update:
- `app/docs/DECISIONS_LOG.md`

### When architecture direction or priority changes
Update:
- `app/docs/PROJECT_OVERVIEW.md`
- `app/docs/ROADMAP.md`

### When implementation status changes
Update:
- `app/docs/MODULE_STATUS.md`

### When engineering standards or coding conventions change
Update:
- `app/docs/ENGINEERING_STANDARDS.md`
- `app/docs/DECISIONS_LOG.md`

### When system/module architecture changes
Update:
- `app/docs/SYSTEM_ARCHITECTURE.md`

### When a question is not resolved
Update:
- `app/docs/OPEN_QUESTIONS.md`

## 2. Operational Rule for Future Sessions
- At the start of a meaningful work session, read:
  1. `PROJECT_OVERVIEW.md`
  2. `PROJECT_MEMORY.md`
  3. `DECISIONS_LOG.md`
  4. `ENGINEERING_STANDARDS.md`
  5. `MODULE_STATUS.md`
  6. `OPEN_QUESTIONS.md`
  7. `RISK_REGISTER.md`
  8. `SESSION_HANDOFF.md`
  9. this file
  10. `COLLABORATION_CONVENTIONS.md`
  11. `WHEN_TO_START_NEW_SESSION.md`
- Before ending a meaningful session, update the affected docs before closing the task.
- Before ending a meaningful session, review `SESSION_CLOSEOUT_TEMPLATE.md` as a mandatory closeout pass.
- Use `WHEN_TO_START_NEW_SESSION.md` to decide whether the current chat should be closed and resumed in a fresh session.
- If the user provides a new master document, strategy note, or high-level architecture clarification, it must be reflected into the relevant docs before the session is treated as complete.

## 3. Non-Negotiable Principle
- Chat is temporary.
- Repository docs are canonical memory.
- If docs and chat diverge, either update the docs or explicitly record the unresolved gap in `OPEN_QUESTIONS.md`.
- This rule also applies to collaboration conventions and small operating rules, not only large product or architecture decisions.
