# RISK REGISTER - MIU WEB MEMORY AND ALIGNMENT

Last updated: 2026-03-06
Purpose: identify risks that can cause long-term user-AI misalignment

## 1. Risk: repo is mistaken for a more advanced system than it is
Impact:
- future sessions assume features exist when they do not

Control:
- keep `MODULE_STATUS.md` current
- treat implementation reality separately from planning

## 2. Risk: UI placeholders are mistaken for product decisions
Impact:
- weak demo structures become accidental architecture

Control:
- record real decisions in `DECISIONS_LOG.md`
- document module intent explicitly

## 3. Risk: chat-only decisions are lost
Impact:
- future sessions restart from wrong assumptions

Control:
- write important decisions into docs before closing a session

## 4. Risk: app scope grows without module boundaries
Impact:
- architecture becomes messy early

Control:
- define module order and role model before large implementation

## 5. Risk: AI provider lock-in creates migration pain later
Impact:
- homework grading workflow becomes tightly coupled to Gemini-specific APIs or response formats

Control:
- isolate AI calls behind a provider adapter
- normalize grading results into app-owned schemas
- store provider metadata without letting provider payload shape leak into core domain logic

## 6. Risk: image-based AI grading is treated as fully reliable
Impact:
- students may receive incorrect scores or feedback because of handwriting and image quality issues

Control:
- store confidence and review flags
- preserve recognized content and model metadata for traceability
- leave room for human override in the domain model

## 7. Risk: small collaboration rules drift between sessions
Impact:
- future replies may ignore language and explanation conventions even when they are already documented

Control:
- keep `COLLABORATION_CONVENTIONS.md` explicit and mandatory rather than soft or optional
- treat collaboration protocol drift as a real memory failure, not just a wording issue
