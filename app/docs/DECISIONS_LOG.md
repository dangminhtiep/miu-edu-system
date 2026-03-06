# DECISIONS LOG - MIU WEB

Last updated: 2026-03-06
Purpose: store finalized app decisions so future sessions do not depend on chat memory

## 2026-03-06
### Decision: repository docs are the canonical project memory for MIU Web
Reason:
- chat memory is not reliable enough for long-term app architecture continuity

Consequence:
- major product and architecture decisions must be written back into repo docs

## 2026-03-06
### Decision: current phase is foundation and architecture lock, not feature scale-up
Reason:
- the repo is still near the default starter state
- the module structure and domain model are not locked yet

Consequence:
- prioritize documentation, scope definition, and architecture before large implementation

## 2026-03-06
### Decision: repo reality must be tracked separately from planned architecture
Reason:
- planning can get ahead of actual implementation very quickly

Consequence:
- `MODULE_STATUS.md` must describe what truly exists

## 2026-03-06
### Decision: the master document for MIU Web is treated as a vision document, not yet a final implementation specification
Reason:
- it contains rich strategic ideas but some areas are still exploratory or not fully reconciled

Consequence:
- future work must convert the master vision into phased architecture before deep implementation

## 2026-03-06
### Decision: MIU Web should be broken into 4 implementation layers
Locked layers:
- `Foundation OS (nen mong he thong van hanh)`
- `Operational Core (loi van hanh)`
- `Business Intelligence (tri tue kinh doanh)`
- `Strategic Intelligence (tri tue chien luoc)`

Reason:
- this prevents scope overload and keeps long-term intelligence layers from blocking phase 1 execution

Consequence:
- phase 1 should focus on Foundation OS and part of Operational Core

## 2026-03-06
### Decision: phase 1 should not attempt to build the full master vision
Reason:
- the current repo is too early for full-scope implementation

Consequence:
- phase 1 should prioritize:
  - auth
  - RBAC
  - student/parent/class/enrollment
  - attendance
  - homework basic
  - mini-test basic
  - billing basic
  - notifications basic
  - settings basic
  - audit log basic
