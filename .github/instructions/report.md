# Anti-Hallucination Agent Review Report

**Repository:** AI Job Tracker
**Review date:** 2026-09-11
**Reviewed example:** `ch_01_anti_hallucination_guard_agent.yaml`
**Reviewed implementation:** `ch_01_anti_hallucination.instructions.md`
**Review scope:** Verify whether the example provides useful agent improvements and compare it with the current repository implementation.

## Executive Summary

The YAML example is a clear policy specification for evidence-grounded responses. It defines four useful control areas:

- Blocking unsupported claims
- Requiring an explicit insufficient-information response
- Running a repeatable self-validation process
- Returning a structured response for investigations and reviews

The active repository instruction implements these controls as Copilot guidance and adds important security requirements for secrets, local data, AI providers, imported JSON, dependency safety, and Git operations.

The example should not be treated as a working enforcement agent by itself. It is stored as a `.yaml` file under `.github/instructions/`, but VS Code file instructions are discovered through `*.instructions.md` files with YAML frontmatter. A YAML document with an `agent:` object is therefore a design/reference artifact unless it is converted into a supported custom-agent format or its rules are copied into a recognized instruction file.

## Verified Facts

### Example file

The reviewed YAML contains:

- Agent name: `anti_hallucination_guard`
- Agent type: `validation_agent`
- Version: `1.0`
- Responsibilities named `block_unsupported_claims`, `force_insufficient_information`, and `run_self_validation`
- Validation checks for grounding, assumptions, confidence, and consistency
- Required output fields for verified facts, missing information, generated output, and self-validation
- Stop or halt behavior for validation failures and missing input
- Logging settings for blocked claims and validation results

### Active repository instruction

The repository contains `.github/instructions/ch_01_anti_hallucination.instructions.md` with valid frontmatter:

- `name: anti-hallucination`
- A repository-specific `description`
- `applyTo: "**/*"`

The instruction includes:

- Repository and product requirements as evidence sources
- A prohibition on invented files, features, APIs, dependencies, test results, Git history, and deployment state
- A requirement to read relevant local code before making implementation claims
- Explicit separation of verified facts, assumptions, inferences, and recommendations
- The exact fallback response `Insufficient information to determine.`
- A requirement to report only observed command, test, build, lint, deployment, and Git results
- Security rules covering secrets, LocalStorage, IndexedDB, backups, URLs, AI providers, imported JSON, external text, dependencies, and destructive Git actions
- A required reasoning process and an investigation/review response format

### Application implementation relevant to security claims

The application currently has these observed data paths:

- Job records are persisted through `src/db/indexedDB.ts` using IndexedDB.
- AI settings are persisted in browser LocalStorage through `src/db/indexedDB.ts`.
- The default AI provider is `offline` in the settings fallback.
- Optional OpenAI, Anthropic, and Ollama provider paths exist in `src/services/aiService.ts`.
- The app supports JSON export and import.
- `src/App.tsx` parses imported JSON and checks that `data.jobs` exists and is an array before passing it to the database import helper.
- The import path does not, in the reviewed code, validate every field of every imported job against the `Job` structure before persistence.
- The package has `build` and `lint` scripts. The build command was previously observed to pass. The lint command was previously observed to fail because `eslint` was not recognized.

## Comparison Against the Example

| Example capability | Repository status | Assessment |
|---|---|---|
| Grounding check | Implemented in instruction text | Good advisory coverage; no deterministic tool-level blocker is configured |
| Unsupported-claim blocking | Implemented as a written rule | The response instruction says not to make unsupported claims, but cannot technically reject an output by itself |
| Insufficient-information response | Implemented | Exact fallback wording is preserved |
| Fact extraction | Implemented | Included in the required reasoning process |
| Unknown-information listing | Implemented | Included in the required reasoning process and response format |
| Assumption labeling | Implemented | Requires assumptions and inferences to be distinguished |
| Confidence labeling | Partially implemented | The instruction requires distinctions but does not mandate a fixed confidence vocabulary for every inference |
| Consistency/determinism check | Partially implemented | The example says deterministic and repeatable; the repository instruction requires evidence-based output but does not define a repeatability test |
| Self-validation | Implemented | Includes a self-check for unsupported claims, contradictions, secrets, and security regressions |
| Failure stop behavior | Partially implemented | The instruction says to stop a line of reasoning when required information is missing; it cannot enforce a runtime halt |
| Blocked-claim logging | Not implemented | No logging system for assistant validation events is present in the reviewed repository |
| Validation-result logging | Not implemented | No agent telemetry or audit log is present in the reviewed repository |
| Security-conscious verification | Improved beyond example | The active instruction adds concrete repository security rules |

## Agent Format and Placement Assessment

### Current YAML placement

`ch_01_anti_hallucination_guard_agent.yaml` is useful as a human-readable policy schema. However, based on the supported workspace customization conventions used by this repository:

- File instructions belong in `.github/instructions/` and use the `*.instructions.md` filename pattern.
- Custom agents belong in `.github/agents/` and use the `*.agent.md` filename pattern.
- The YAML `agent:` structure is not a substitute for the Markdown custom-agent format.

Therefore, the YAML file is best retained as a reference specification, not relied upon as the mechanism that activates the rules.

### Current active instruction

`ch_01_anti_hallucination.instructions.md` is the correct active mechanism for broad repository guidance because it has frontmatter and `applyTo: "**/*"`. It is the file that should be maintained when the goal is to guide all repository analysis, edits, tests, documentation, and reviews.

## Recommended Improvements

### Priority 1: Keep one authoritative policy

Avoid maintaining independent copies of the same rules in the YAML and Markdown files. Choose one authoritative source:

- Keep the Markdown instruction authoritative for this repository.
- Keep the YAML file as a reference or migration specification.
- Update both only when the YAML is intentionally used as documentation for another agent framework.

This prevents rules from drifting apart.

### Priority 2: Narrow the broad instruction scope if context cost becomes a problem

`applyTo: "**/*"` applies the instruction to every file. This is appropriate for the current security policy, but it increases context usage and can add review-format requirements to unrelated requests. If that becomes disruptive, split the policy into focused instructions such as:

- `**/*.{ts,tsx,js,jsx}` for application changes
- `src/db/**` and `src/services/**` for data and provider security
- `.github/**` for customization files
- `JobTracker.md` and `README.md` for documentation claims

Do not narrow the scope without preserving security rules for sensitive data paths.

### Priority 3: Strengthen imported-data validation in application code

The current import boundary checks only that `jobs` is an array before persistence. A stronger implementation should validate each imported record before writing it to IndexedDB, including:

- Required string fields such as `id`, `company`, `title`, `status`, and `appliedDate`
- Allowed values for `status` and `workMode`
- Arrays such as `techStack`, `timeline`, and `interviewPipeline`
- Nested object shapes for financials, referral data, assets, AI data, timeline events, and milestones
- Reasonable string and array size limits to reduce accidental or malicious oversized imports
- Rejection or quarantine of invalid records with a user-visible summary

Use a structured schema validator or a repository-native validation helper instead of trusting imported JSON.

### Priority 4: Add safe error handling around asynchronous import parsing

The current `FileReader.onload` callback performs asynchronous JSON parsing and database work inside the callback, while the outer `try/catch` does not reliably catch errors thrown later by the callback. The import workflow should use a Promise-based file reader and handle parse, validation, and persistence errors in one awaited flow.

### Priority 5: Define what confidence labels mean

The instruction should define a small vocabulary, for example:

- `Verified`: directly observed in repository files, command output, diagnostics, or user-provided evidence
- `Inference (low confidence)`: a reasoned interpretation not directly stated by evidence
- `Unknown`: insufficient evidence to conclude

This makes confidence reporting more repeatable than an informal distinction.

### Priority 6: Separate advisory guidance from deterministic enforcement

The instruction can guide the assistant, but it cannot guarantee that a claim is blocked or that logs are written. If true enforcement is required, add supported automation around the repository workflow, such as:

- Pre-commit secret scanning
- CI checks for build and tests
- Dependency auditing
- JSON schema tests for backup imports
- Review templates requiring evidence and validation results

These controls should complement, not replace, the Copilot instruction.

### Priority 7: Do not claim logging exists without an implementation

The YAML sets `logging.enabled: true`, but no logging implementation was verified in this repository. Keep that setting clearly labeled as a target behavior or implement a privacy-conscious audit mechanism with explicit approval. Do not add telemetry or remote logging to this local-first application without documenting data flow and obtaining approval.

## Suggested Supported Custom-Agent Conversion

If a separately selectable custom agent is required, create a file under `.github/agents/` using the supported `.agent.md` format. The agent should:

1. Reference the repository's evidence boundaries.
2. Require a local code read before implementation claims.
3. Require focused validation after edits.
4. Require secret and sensitive-data checks before Git operations.
5. Preserve the offline AI path and local-first privacy model.
6. Avoid claiming that it can technically block, log, or halt output unless the surrounding tooling implements those actions.

The existing file instruction should remain active even if a custom agent is added, because file instructions and custom agents serve different scopes.

## Implementation Decision

The current repository has the main guidance improvement from the example implemented in the active `.instructions.md` file, with stronger security coverage than the YAML example. The recommended runtime changes for API-key-safe exports, imported-record validation, awaitable import handling, provider-response validation, and settings normalization have now been implemented.

The remaining code-level security work is focused automated testing and deterministic repository checks. Those changes require separate approval because the repository does not currently have a verified test runner or CI security workflow.

## Unknowns and Limitations

- No official VS Code customization documentation was consulted during this report beyond the local agent-customization guidance available in the environment.
- No deterministic agent runtime was found in the repository that could enforce `reject`, `stop`, `halt`, or logging actions from the YAML.
- No automated tests for backup import validation were found in the reviewed workspace structure.
- The report does not claim that the application is secure in an absolute sense. It records the observed rules and data paths only.

## Self-Validation Check

- Read the YAML example from the specified instructions folder.
- Read the active anti-hallucination instruction from the same folder.
- Read the local agent customization guidance.
- Read the relevant IndexedDB, application orchestration, and AI service code.
- Compared each example capability against observed repository files and behavior.
- Did not modify application source code or add network calls, telemetry, credentials, or secrets.
- Created this report at `.github/instructions/report.md`.
