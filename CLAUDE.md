# automationexercise.com QA project

Target: https://www.automationexercise.com/ (practice e-commerce site).
Stack: Playwright + TypeScript. Scope: UI end-to-end flows (no API, no cross-browser for now).

## Team (see `.claude/agents/`)
- `qa-lead`: orchestrates; owns `workflow/BOARD.md`. Run the team with `claude --agent qa-lead`.
- `manual-tester`: explores the site, writes `test-cases/TestCases.csv`.
- `automation-engineer`: builds `src/` and `tests/`.
- `qa-reviewer`: reviews everything, writes `reviews/REVIEW-<n>.md`.

Only the lead spawns the others (subagents cannot spawn subagents), so always start from the lead.

## Conventions
- Case IDs `TC-<MODULE>-<NNN>`; specs titled `[TC-...] ...`; tags `@smoke` (P0) and `@regression`.
- Page objects: no assertions. Specs: web-first assertions only. No `waitForTimeout`.
- Each test creates its own data and cleans up. Emails must be unique per run.
- Site defects go to `workflow/KNOWN_ISSUES.md`; never weaken a test to hide one.

## Commands
```
npm install && npx playwright install chromium
npm run typecheck
npm test                 # whole suite
npm run test:smoke       # P0 only
npm run test:stable      # run 3x to detect flakiness
npm run report           # open HTML report
```
