# COLLABORATION CONVENTIONS - MIU WEB

Last updated: 2026-03-07
Purpose: store working conventions for communication between the user and AI

## 1. Language Convention
- Main working language is Vietnamese.
- On the first mention of an English technical term in a response, add a short Vietnamese gloss in parentheses.
- When introducing new English names in code such as function names, variable names, file names, or folder names, briefly explain their meaning in Vietnamese the first time they matter in the discussion.
- Do not treat this as optional wording polish; it is a required continuity rule for this repo.
- If the same response introduces many English terms, each important new term should be glossed at least once.
- If a reply misses this rule, that is a protocol failure, not a style preference.

Examples:
- `role model (mo hinh vai tro)`
- `system architecture (kien truc he thong)`
- `module status (trang thai module)`
- `dashboard (bang dieu khien)`

## 2. Memory Rule
- This convention is part of the long-term collaboration protocol for this repo.
- Small collaboration rules are part of project memory and must be preserved across sessions the same way major architecture decisions are preserved.

## 3. Coordination With Engineering Standards
- Communication conventions and engineering conventions are different files on purpose.
- `COLLABORATION_CONVENTIONS.md` governs how we talk and explain.
- `ENGINEERING_STANDARDS.md` governs how code should be produced consistently across sessions.

## 4. Explanation Standard
- When recommending architecture or implementation order, explain:
  - why this step is before another step
  - what future risk it reduces
  - what is intentionally postponed
- Prefer plain Vietnamese explanation for major tradeoffs.
- Do not assume the user already knows specialist terms; explain them briefly when they matter to the decision.

## 5. Ambiguity And Drift Control
- During implementation, continuously compare the task against known open questions, locked decisions, and current phase scope.
- If a new step risks drifting away from locked product intent, architecture direction, or current-slice priority, pause and ask the user to lock the missing point before continuing.
- Do not silently choose a business rule when that choice would create likely rework later.
- Treat this pause-to-clarify behavior as mandatory coordination, not optional caution.

## 6. Option Explanation Rule
- When asking the user to choose between options, explain:
  - what each option means in practice
  - why it matters to the code or architecture
  - strengths
  - weaknesses
  - the recommended option and why it is recommended
- Do not ask the user to choose from under-explained options when the choice affects product flow, data shape, or future rework cost.
