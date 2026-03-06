# OPEN QUESTIONS - MIU WEB

Last updated: 2026-03-06
Purpose: store unresolved product and architecture questions explicitly

## 1. Role Model
- Which roles are in scope first?
- What does each role need to see and do?

## 2. Primary Module Order
- In what exact order should phase 1 modules be built after `Foundation OS (nen mong he thong van hanh)`?
- Which business workflow is the first operational slice:
  - students?
  - classes?
  - attendance?
  - homework?
  - billing?

## 3. Data Source Strategy
- What backend / database should MIU Web use first?
- Is Supabase the intended source from day one?

## 4. Navigation Strategy
- What should the main information architecture be?
- Should navigation be role-aware from the start?

## 5. miu-bank Integration
- What data from `miu-bank` should appear in MIU Web first?
- read-only content?
- assignment generation?
- teacher content tools?

## 6. Authentication
- Which auth flow should be used?
- admin-created accounts?
- password login?
- magic links?

## 7. Core Entity Map
- What are the first canonical entities for phase 1?
- student?
- parent?
- branch?
- class?
- enrollment?
- billing profile?
- homework submission?

## 8. HQ vs Branch Boundary
- Which workflows belong to HQ only?
- Which workflows belong to branch managers?
- Which data can branches override vs only view?
