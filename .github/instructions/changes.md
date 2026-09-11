# Proposed Security Changes

**Status:** Changes 1-5 implemented; Changes 6-8 remain approval-gated
**Scope:** This file records the approved implementation slice and the remaining proposed work.
**Source of recommendations:** `ch_01_anti_hallucination_guard_agent.yaml`, `ch_01_anti_hallucination.instructions.md`, `report.md`, and the reviewed application code.

## Decision Requested

Changes 1-5 have been implemented in the application. Please approve or reject Changes 6-8 before implementation. The first implementation slice addressed imported JSON because it is untrusted input and is written to IndexedDB.

## Verified Current State

- `src/App.tsx` parses imported JSON and checks only that `data.jobs` is an array.
- `src/db/indexedDB.ts` writes each item supplied to `bulkImportJobs` without runtime validation.
- `src/services/aiService.ts` sends job-description and role data to configured providers and parses provider JSON responses.
- AI settings, including an optional API key, are stored in browser LocalStorage.
- The offline AI provider is the default fallback.
- The repository has no automated test files visible in the reviewed workspace structure.
- The active anti-hallucination instruction is advisory; no repository hook or agent runtime was verified that can technically block, halt, or log assistant output.

## Proposed Changes

### Change 1: Validate imported backup records before persistence

**Priority:** High

Add a runtime validation boundary for imported backup data before any record reaches IndexedDB.

Validation should cover:

- Backup object shape and supported version.
- Required job fields: `id`, `company`, `title`, `status`, `techStack`, `workMode`, `timeline`, `interviewPipeline`, `appliedDate`, and `updatedAt`.
- Allowed `status` and `workMode` values.
- Array element types for technology tags, timeline entries, and interview milestones.
- Nested optional objects: referral, assets, financials, and AI data.
- Timeline event and interview milestone field types.
- Maximum lengths/counts for imported strings and arrays to reduce accidental oversized data.
- Duplicate IDs and invalid records.

**Expected behavior:** Reject invalid records before persistence and show a safe summary of accepted/rejected records without displaying secret values.

**Implementation options:**

1. Add a small repository-native type guard in the database boundary.
2. Add a schema validation dependency such as Zod and keep the schema close to `src/types/job.ts`.

**Recommendation:** Prefer a structured schema validator if dependency policy allows it; otherwise implement a focused type guard with tests.

### Change 2: Make backup import error handling awaitable

**Priority:** High

Replace the callback-only `FileReader` flow in `src/App.tsx` with a Promise-based reader or equivalent awaited helper. Handle file reading, JSON parsing, validation, database persistence, and user-facing failure reporting within one controlled async flow.

**Reason:** The current outer `try/catch` does not reliably cover errors thrown later inside `FileReader.onload`.

**Expected behavior:** Malformed files and persistence failures produce a controlled error message, do not partially update the UI, and do not leave an unhandled promise rejection.

### Change 3: Validate external AI responses

**Priority:** High

Validate the shape of OpenAI and Ollama responses before reading nested fields or persisting generated results.

Validation should confirm:

- The provider response has the expected object shape.
- The content is valid JSON when JSON is required.
- Competencies and questions are arrays of strings.
- Required experience and generated messages are strings when present.
- Arrays and strings are bounded before rendering or saving.

**Expected behavior:** Invalid provider responses fall back to the offline engine without exposing raw provider response data in the UI.

### Change 4: Validate AI provider settings and endpoint URLs

**Priority:** Medium

Validate settings before saving or making a request:

- Accept only the known provider identifiers.
- Require an API key only for providers that use one.
- Validate Ollama URLs as explicitly permitted HTTP(S) endpoints, with a clear policy for localhost and private-network addresses.
- Normalize or reject unexpected model names and excessive input lengths.
- Avoid placing API keys in exported backup files unless the user explicitly chooses that behavior.

**Important privacy note:** The current export path includes `settings`, which may include an API key. This should be confirmed and addressed because backup files are sensitive artifacts.

### Change 5: Stop exporting API keys by default

**Priority:** High

Change JSON export so API keys are excluded by default. If settings are exported, write only non-secret provider configuration, or require a clearly labeled explicit opt-in for secrets with a warning.

**Expected behavior:** A normal backup cannot disclose an OpenAI or Anthropic API key.

### Change 6: Add focused automated tests

**Priority:** High

Add tests for the security boundaries introduced above:

- Valid backup accepted.
- Missing required fields rejected.
- Invalid status/work mode rejected.
- Invalid nested objects rejected.
- Oversized strings/arrays rejected.
- Duplicate IDs handled safely.
- Malformed JSON handled without an unhandled rejection.
- Provider response shape validation falls back offline.
- API keys are absent from default exports.

**Constraint:** The repository currently has no verified test runner in `package.json`. Select and add a test runner only after approval; do not claim tests exist until they are implemented and executed.

### Change 7: Add deterministic repository checks

**Priority:** Medium

Add approved automation that provides enforcement beyond advisory Copilot instructions:

- Build check in CI.
- Secret scanning before commit or in CI.
- Dependency vulnerability review.
- Tests for import validation.
- Optional review checklist requiring verified facts and validation output.

Do not add telemetry, remote logging, or network reporting for assistant activity without explicit approval and documented data flow.

### Change 8: Consider a separately selectable custom agent

**Priority:** Low

If a dedicated anti-hallucination agent is needed, convert the YAML policy into a supported `.agent.md` file under `.github/agents/`. Keep the current `.instructions.md` because custom agents and file instructions have different scopes.

The custom agent must describe advisory behavior accurately. It should not claim technical `reject`, `halt`, or logging enforcement unless supported tooling implements those actions.

## Recommended Implementation Order

1. Change 5: exclude API keys from normal exports.
2. Change 1: validate imported backup records.
3. Change 2: make import handling awaitable and failure-safe.
4. Change 3: validate provider responses.
5. Change 4: validate settings and endpoint URLs.
6. Change 6: add focused tests and a test runner if approved.
7. Change 7: add deterministic CI/security checks if approved.
8. Change 8: add a custom agent only if separate agent selection is required.

## Risks and Tradeoffs

- Runtime validation can reject old or hand-edited backups that do not match the current schema. Support a deliberate migration path if backward compatibility is required.
- Excluding API keys from backups improves security but means settings must be re-entered on another browser or device.
- URL restrictions may prevent valid custom Ollama deployments unless the allowed-origin policy is explicit.
- Adding a schema or test dependency increases the package surface and requires a lockfile update.
- Local-only logging can expose sensitive job metadata if implemented carelessly; no logging is recommended until its data minimization is designed.

## Approval Checklist

Mark the desired scope before implementation:

- [x] Implemented Change 1: imported backup validation
- [x] Implemented Change 2: awaitable import/error handling
- [x] Implemented Change 3: AI response validation
- [x] Implemented Change 4: provider setting normalization and bounded endpoint configuration
- [x] Implemented Change 5: exclude API keys from exports
- [ ] Approve Change 6: focused automated tests
- [ ] Approve Change 7: CI and deterministic security checks
- [ ] Approve Change 8: supported custom agent conversion

**Approval notes:**

_Add approval, exclusions, compatibility requirements, or other constraints here._

## Validation Required After Approval

For the implemented Changes 1-5, run and report:

```text
npm run build
npm run lint
```

If a test runner is added:

```text
npm test
```

Also perform focused manual checks for backup import/export, API-key handling, offline AI behavior, and configured provider requests. Report unavailable commands accurately; the current repository has previously shown that `npm run lint` fails when ESLint is not installed.
