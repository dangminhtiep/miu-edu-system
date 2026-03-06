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

