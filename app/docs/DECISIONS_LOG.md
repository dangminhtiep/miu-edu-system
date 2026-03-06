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

## 2026-03-06
### Decision: the first operational vertical slice should be `AI homework grading (cham bai tap ve nha bang AI)`
Reason:
- the repo needs one real workflow that serves current students early
- homework grading is an urgent business need with immediate value
- building one narrow operational slice is safer than attempting broad module rollout

Consequence:
- near-term implementation can prioritize homework submission and grading before the full system is locked
- this slice must still be implemented in a way that can later connect to auth, roles, classes, and notifications

## 2026-03-06
### Decision: the first homework grading input should be student-submitted images
Reason:
- the immediate real-world workflow is students submitting photos of homework
- image-based submission matches current operational need better than text-only input

Consequence:
- the system must support image upload, submission storage, AI grading from image input, and review flags for low-confidence cases

## 2026-03-06
### Decision: Gemini is the first AI provider for the homework grading slice, but the system must remain provider-agnostic
Reason:
- Gemini has already shown promising grading quality in direct testing
- vendor lock-in would create avoidable migration risk later

Consequence:
- AI integration must be isolated behind a provider adapter / interface layer
- domain workflow, storage, grading result schema, and UI must not depend directly on Gemini-specific request or response shapes
- future providers should be swappable with minimal change to the homework workflow

## 2026-03-06
### Decision: AI grading results are advisory system output, not irreversible final truth
Reason:
- image-based grading can fail because of handwriting, image quality, missing pages, or model interpretation errors

Consequence:
- the grading schema must preserve model name, prompt version, confidence, recognized content, and review flags
- the system must leave room for future teacher / assistant override without redesigning the core workflow

## 2026-03-06
### Decision: local development should use `Webpack (bo dong goi cu on dinh hon)` instead of `Turbopack (bo dev bundler moi)` for now
Reason:
- the current local environment hit repeated `Turbopack panic` errors during development
- workflow validation is more important than using the newest dev bundler right now

Consequence:
- `npm run dev` should run with `next dev --webpack` until the local instability is resolved

## 2026-03-06
### Decision: homework assignment definition belongs to teacher-facing workflow, not student submission workflow
Reason:
- in the real operating flow, teachers define the assignment, prompt, and grading rubric when assigning homework
- students should only see assigned homework and submit answers

Consequence:
- the current student-side prototype form is only temporary and does not match the intended long-term workflow
- the system must be refactored into at least 2 flows:
  - teacher creates and assigns homework
  - student selects assigned homework and submits work

## 2026-03-06
### Decision: assignment prompt should support attached image or PDF files
Reason:
- the assignment source needs to preserve original visual structure for students and for AI grading context
- image/PDF attachments fit the real teaching workflow better than plain text only

Consequence:
- the homework domain must support assignment attachments
- Gemini input should later be able to receive assignment attachments together with student submission files when needed
- `LaTeX (ngon ngu danh may toan hoc)` conversion is a possible future enhancement, but is not a current priority

## 2026-03-06
### Decision: phase-1 homework submission policy is single-attempt, late submission allowed, with dispute handling
Reason:
- the system needs a simple and enforceable initial rule set
- students may still need a recovery path when they submit the wrong work

Consequence:
- normal phase-1 behavior allows only one submission attempt
- late submissions are still accepted but must be clearly flagged
- the product must include a recovery / complaint path for wrong submission or suspected grading error

## 2026-03-06
### Decision: students can immediately see AI results unless the submission is flagged for review
Reason:
- immediate feedback is part of the early value of the AI grading workflow

Consequence:
- non-flagged submissions can show results right away
- flagged submissions must wait for human review

## 2026-03-06
### Decision: MIU homework AI feedback voice should use `MIU` and `ban`
Reason:
- this matches the desired tone better than the previous draft using `con`

Consequence:
- Gemini output and UI feedback text must use the MIU speaking style with `MIU` and `ban`

## 2026-03-06
### Decision: the initial rubric has 3 core criteria
Locked criteria:
- `Phan tich va huong giai`
- `Ky nang tinh toan`
- `Trinh bay`

Reason:
- the first phase needs a simple rubric structure that still reflects real math homework evaluation

Consequence:
- assignment authoring and AI grading contracts should use these 3 criteria first

## 2026-03-06
### Decision: Gemini output must include score, praise, mistakes, improvements, and answer key comparison support
Reason:
- students need concise feedback they can act on immediately
- the system also needs to show the official answer after grading

Consequence:
- AI grading output must include:
  - total score
  - praise
  - mistakes to note
  - suggestions for improvement
- the assignment definition must also store the teacher-provided answer key
- after grading, the student view should show both AI feedback and the stored answer key for comparison

## 2026-03-06
### Decision: students must have a `Khieu nai` action for AI grading disputes
Reason:
- AI grading can still be wrong
- students need a structured way to request teacher review

Consequence:
- the homework module must support a complaint / dispute state
- teachers need a later review workflow to resolve disputes

## 2026-03-06
### Decision: wrong submission recovery uses `Khieu nai + mo khoa 1 lan`
Reason:
- the product should still enforce single-attempt submission by default
- students need a controlled recovery path when they submit the wrong work

Consequence:
- students cannot freely resubmit after the first submission
- students can file a complaint with reason `Nop nham bai`
- teachers can unlock exactly one additional submission attempt

## 2026-03-06
### Decision: Gemini student-facing feedback must follow MIU tone and structured output rules
Locked feedback principles:
- system voice uses `MIU` and `ban`
- feedback must be respectful, concise, encouraging, and non-judgmental
- feedback must not say or imply that the student is weak, careless, or incapable
- if the model is uncertain, it must lower confidence and request review instead of pretending certainty

Locked minimum output content:
- total score
- praise
- mistakes to note
- suggestions for improvement

Locked structured result requirement:
- Gemini must return app-defined structured output rather than free-form text
- the result must support:
  - rubric-based scoring
  - student-facing feedback
  - confidence and review flags
  - answer-key comparison display

Locked safety rules:
- do not invent unreadable content
- explicitly state image quality or ambiguity problems
- set `needsHumanReview` when confidence is low or evidence is incomplete
