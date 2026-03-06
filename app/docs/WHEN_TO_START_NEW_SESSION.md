# WHEN TO START A NEW SESSION - MIU WEB

Last updated: 2026-03-06
Purpose: define when a fresh chat session is safer and more efficient than continuing one very long session

## 1. Why This File Exists
- The `context window (cua so ngu canh)` is limited working memory.
- Long app discussions can drift if key checkpoints are not moved into repo docs.

## 2. Start a New Session When
### A. A major architecture checkpoint is complete
Examples:
- role model locked
- core entity map locked
- phase 1 scope locked
- a major implementation slice completed

### B. You are switching work modes
Examples:
- from strategy to implementation
- from architecture to UI work
- from MIU Web to another repo

### C. The current chat is getting too full
Signals:
- repeated context recap is needed
- many topics are mixed together
- the `context window (cua so ngu canh)` is becoming crowded

### D. Docs have already captured the checkpoint
- once continuity is safely in docs, a fresh session is often better than continuing a bloated one

## 3. Before Ending a Session
1. update relevant docs
2. update `SESSION_HANDOFF.md`
3. review `SESSION_CLOSEOUT_TEMPLATE.md`
4. make sure unresolved items are in `OPEN_QUESTIONS.md`

## 4. At the Start of a New Session
The AI should re-read:
1. `PROJECT_OVERVIEW.md`
2. `PROJECT_MEMORY.md`
3. `DECISIONS_LOG.md`
4. `MODULE_STATUS.md`
5. `OPEN_QUESTIONS.md`
6. `RISK_REGISTER.md`
7. `SESSION_HANDOFF.md`
8. `DOC_MAINTENANCE_PROTOCOL.md`
9. `COLLABORATION_CONVENTIONS.md`
10. this file

## 5. Non-Negotiable Principle
- A fresh session is safe only when continuity is in docs, not only in chat.

