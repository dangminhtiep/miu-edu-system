# HOMEWORK AI POLICY NOTES - MIU WEB

Last updated: 2026-03-07
Purpose: identify which Homework AI rules are stable domain rules and which are policy candidates

## 1. Stable Domain Objects
- assignment
- submission
- grading result
- complaint
- unlock

These objects should remain stable even if MIU later changes provider, storage backend, or operational policy.

## 2. Policy Candidates
- maximum normal attempts
- whether late submission is accepted
- maximum images per submission
- allowed submission mime types
- allowed assignment attachment mime types
- active AI provider
- complaint categories
- review thresholds
- prompt version selection

## 3. Immediate Implementation Guidance
- Current MVP may keep policy in code, but policy should live in one module rather than scattered constants.
- The next step after this note is to move current Homework AI rules behind a single policy access layer.
