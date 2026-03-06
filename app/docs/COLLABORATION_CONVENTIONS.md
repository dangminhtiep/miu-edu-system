# COLLABORATION CONVENTIONS - MIU WEB

Last updated: 2026-03-07
Purpose: store working conventions for communication between the user and AI

## 1. Language Convention
- Main working language is Vietnamese.
- On the first mention of an English technical term in a response, add a short Vietnamese gloss in parentheses.
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
