# OPEN QUESTIONS - MIU WEB

Last updated: 2026-03-07
Purpose: store unresolved product and architecture questions explicitly

## 1. Role Model
- Which roles are in scope first?
- What does each role need to see and do?

## 2. Primary Module Order
- The first operational slice is now `AI homework grading`.
- What is the exact build order around it:
  - teacher assignment creation first?
  - student assignment selection and submission second?
  - grading pipeline third?
  - review / override later?

## 3. Data Source Strategy
- What backend / database should MIU Web use first?
- Is Supabase the intended source from day one?

## 3A. Submission Storage Strategy
- Where should homework images be stored first?
- What file size and page count limits should be enforced?
- What retention and privacy policy should apply to student submissions?

## 4. Navigation Strategy
- What should the main information architecture be?
- Should navigation be role-aware from the start?

## 5. miu-bank Integration
- What data from `miu-bank` should appear in MIU Web first?
- read-only content?
- assignment generation?
- teacher content tools?

## 5A. AI Provider Boundary
- What contract should the `AI provider adapter` expose so Gemini can later be replaced?
- Which fields are mandatory in normalized grading results regardless of provider?
- Which provider-specific raw payloads should still be retained for debugging?
- How strict should normalization be when provider total score conflicts with rubric-level scores?

## 6. Authentication
- Which auth flow should be used?
- admin-created accounts?
- password login?
- magic links?

## 6A. AI Homework Safety and Review
- At what confidence threshold should a submission be flagged for human review?
- Which error cases should block auto-publish of grading results:
  - unreadable image?
  - missing page?
  - ambiguous handwriting?
  - rubric mismatch?

## 7. Core Entity Map
- What are the first canonical entities for phase 1?
- student?
- parent?
- branch?
- class?
- enrollment?
- billing profile?
- homework submission?
- Should the first homework grading entity set be:
  - assignment
  - assignment attachment
  - submission
  - grading job
  - grading result
  - review override?
- Which retry policy should apply to failed grading jobs once a real queue exists?

## 7A. Assignment Authoring Scope
- In the first usable version, what exactly does the teacher need when creating homework?
- Is one assignment linked to one class only, or can one assignment be sent to multiple classes?
- What is the minimum assignment material set:
  - title?
  - plain-text instructions?
  - image attachment?
  - PDF attachment?
  - rubric?

## 7B. Student Submission Experience
- How should the student pick assigned homework:
  - from a list?
  - by due date?
  - by subject/class?
- Should students submit:
  - image only?
  - image + note?
  - multiple pages?

## 7C. Wrong Submission Recovery
- What exact recovery flow should be used when a student submits the wrong work if re-submission is normally blocked?
- Should the student:
  - create a complaint only?
  - request teacher unlock?
  - be allowed one manual reset by teacher?

## 7D. Complaint Workflow
- What data should be captured when the student clicks `Khieu nai`?
- free-text reason?
- attachment?
- category:
  - wrong grading?
  - unreadable image?
  - submitted wrong file?

## 8. HQ vs Branch Boundary
- Which workflows belong to HQ only?
- Which workflows belong to branch managers?
- Which data can branches override vs only view?

## 9. Configuration Boundary
- Which homework rules should become configurable in phase 1 versus remain fixed code for now?
- What settings scopes are needed first:
  - global?
  - branch?
  - class?
  - assignment?
- Which items must be policy data rather than hard-coded constants:
  - submission attempt limits?
  - review thresholds?
  - file size/page limits?
  - provider selection?
  - complaint categories?
