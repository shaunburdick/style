CHANGELOG
=========
## 10.0.0 (2026-09-29)

### Requirements Changes
* **BREAKING:** Adopting `unicorn.configs.recommended` and `llm-core.configs.recommended` enables roughly 360 additional rules. Expect substantial new lint errors on upgrade — see the `eslint-config-shaunburdick` agent skill for a rule-group map and remediation guidance
* **BREAKING:** `unicorn/no-array-for-each` was renamed to `unicorn/no-for-each` upstream (same semantics, no action needed if you had not overridden it)

### New Rules — Recommended Config Adoption
* **NEW:** `unicorn.configs.recommended` — the full upstream recommended set (361 rules) is now wired into the base `js` config. Our explicit rules in `es6/rules.js` are applied after it and win any conflict
* **NEW:** `llm-core.configs.recommended` replaces the narrower `llm-core.configs.complexity`, adding the typescript, best-practices, style, and hygiene groups. Notable additions include `no-unknown-parameters`, `no-unknown-returns`, `no-unsafe-array-access`, `no-dynamic-code-execution`, `explicit-export-types`, `no-redundant-comments`, and `no-debug-scaffolding`
* **NEW:** jsdoc `no-unnecessary-type-assertion`, `normalize-see-links`, and `ts-ban-ts-comment` are available

### Rules Relaxed
* **RELAXED:** `llm-core/no-inline-disable` turned off — the graduated disable flow (`shaunburdick/max-inline-disables`) already permits 1-2 inline disables per file and escalates beyond that, so a blanket ban was redundant
* **RELAXED:** `llm-core/prefer-nullish-coalescing` turned off in the base config — the syntactic check false-positives on boolean operands where `??` is not a valid substitute. TypeScript projects still get the type-aware `@typescript-eslint/prefer-nullish-coalescing` from the `ts` config

### Rules Disabled from unicorn recommended
Each is off deliberately, with rationale in `es6/rules.js`:
* `unicorn/name-replacements` — forces `ButtonProps` → `ButtonProperties` and `e` → `error`; abbreviated `Props` is the React community convention
* `unicorn/no-null` — distinguishing a present-but-empty value from an absent one is an API design decision
* `unicorn/prefer-ternary` — contradicts `llm-core/prefer-early-return` and the guard-clause style this config is built around
* `unicorn/single-line-block-comment-style` — fights compact single-line JSDoc under `@stylistic/max-len: 120`
* `unicorn/prefer-number-coercion` — rewrites `parseInt(value, 10)` to `Math.trunc(Number(value))`, a semantic change rather than a style preference

### Dependency Updates
* **UPDATED:** `eslint` 10.4.1 → 10.11.0, `typescript-eslint` 8.60.1 → 8.71.0, `globals` 17.6.0 → 17.12.0, `eslint-plugin-import-x` 4.16.2 → 4.17.1, `eslint-plugin-jsdoc` 63.0.2 → 65.0.0, `eslint-plugin-unicorn` 64.0.0 → 76.0.0, `eslint-plugin-llm-core` 0.26.0 → 0.37.0, `eslint-plugin-sonarjs` 4.0.3 → 4.2.2, `@eslint-react/eslint-plugin` 5.8.13 → 5.23.0, `eslint-plugin-security` 4.0.0 → 4.1.0, and others
* **HELD:** `typescript` stays at 6.0.3. TypeScript 7.0 ships no programmatic API, and `typescript-eslint@8.71` declares `peerDependencies.typescript: ">=4.8.4 <6.1.0"`. The `ts` config uses `projectService: true` and needs the compiler API, so TS 7 would break type-aware linting. Revisit once `typescript-eslint` supports 7.x (expected with TS 7.1's new API)
* **SECURITY:** `npm audit fix` cleared the `@humanfs/node`, `baseline-browser-mapping`, and `browserslist` advisories. Lockfile-only

## 9.0.1 (2026-08-23)

### Changes
* **SECURITY:** Refreshed `package-lock.json` via `npm audit fix` — clears newly published advisories (incl. `brace-expansion` high severity GHSA-3jxr-9vmj-r5cp, deduplicated to 5.0.9; `@babel/core` low). No rule changes; lockfile-only release so the patched dependency tree ships to npm

## 9.0.0 (2026-06-20)

### Requirements Changes
* **BREAKING:** `reportUnusedDisableDirectives: 'error'` — stale `eslint-disable` comments that were previously silently ignored now fail lint. Replace the deprecated `@eslint-community/eslint-comments/no-unused-disable` rule that was never activated

### New Features — Graduated Disable Flow
* **NEW:** `reportUnusedDisableDirectives: 'error'` — ESLint-native unused disable detection (replaces deprecated plugin rule)
* **NEW:** `shaunburdick/max-inline-disables: warn` — custom rule enforcing the graduated disable flow: 1-2 inline disables per file is fine, 3+ should use block-level pairs, across 3+ files should use a config override
* **NEW:** `es6/custom-rules.js` — dedicated file for inline-defined custom rules, tested alongside the source via `es6/custom-rules.test.js`

## 8.1.0 (2026-06-18)

### Changes
* **RELAXED:** Added `10` to `llm-core/no-magic-numbers` ignore list so `parseInt(id, 10)` no longer requires extracting `DECIMAL_RADIX` to a named constant

## 8.0.0 (2026-06-07)

### Requirements Changes
* **BREAKING:** New rules will cause lint errors in codebases with AI-generated code patterns

### New Rules — Agentic Programming Guardrails

These rules are designed to catch common patterns in AI-generated code. They were added
based on research from Columbia DAPLab, arXiv 2605.02741 (machine signature of defects),
SlopCodeBench, and the eslint-plugin-llm-core research-backed rule set.

#### Built-in ESLint Rules (Phase 1)
* **NEW:** `max-params: [error, 5]` — Prevent parameter bloat, common in AI-generated functions
* **NEW:** `max-depth: [error, 4]` — Prevent pyramid-of-doom control flow
* **NEW:** `no-nested-ternary: error` — AI excessively nests ternaries
* **NEW:** `id-length: [error, { min: 2 }]` — Prevent single-letter variable names
* **NEW:** `no-useless-assignment: error` — Catch redundant intermediate variables

#### eslint-plugin-unicorn Rules (Phase 1)
* **NEW:** `unicorn/throw-new-error: error` — Require `new Error()` over raw throws
* **NEW:** `unicorn/no-await-expression-member: error` — Prefer destructuring over `(await x).y`
* **NEW:** `unicorn/no-useless-undefined: error` — Remove redundant `undefined`
* **NEW:** `unicorn/no-useless-spread: error` — Remove unnecessary spread
* **NEW:** `unicorn/consistent-function-scoping: error` — Move inner functions to higher scope
* **NEW:** `unicorn/expiring-todo-comments: warn` — Require deadlines on TODOs

#### TypeScript Type-Checked Rules (Phase 1)
* **NEW:** `@typescript-eslint/await-thenable: error` — Don't await non-Promise values
* **NEW:** `@typescript-eslint/use-unknown-in-catch-callback-variable: error` — Prefer `unknown` in catch
* **NEW:** `@typescript-eslint/no-unnecessary-type-assertion: error` — Remove redundant casts
* **NEW:** `@typescript-eslint/restrict-template-expressions: error` — Type-safe templates
* **NEW:** `@typescript-eslint/unbound-method: error` — Prevent unbound method references

#### eslint-plugin-llm-core Integration (Phase 2 — New Dependency)
* **NEW:** `eslint-plugin-llm-core` added as dependency (v0.18+)
* **NEW:** Complexity config: max-file-length (500), max-function-length, max-nesting-depth, max-params
* **NEW:** `llm-core/no-async-array-callbacks: error` — Catch `.map(async ...)` returning Promise[]
* **NEW:** `llm-core/no-empty-catch: error` — Prevent silent error swallowing
* **NEW:** `llm-core/no-magic-numbers: error` — Require named constants (with sensible ignore list)
* **NEW:** `llm-core/prefer-early-return: error` — Enforce guard clauses over deep nesting
* **NEW:** `llm-core/throw-error-objects: error` — Require Error instances over raw values
* **NEW:** `llm-core/no-swallowed-errors: error` — Prevent catch-only-log patterns
* **NEW:** `llm-core/no-commented-out-code: error` — Remove dead code
* **NEW:** `llm-core/no-llm-artifacts: error` — Remove incomplete markers (TODO: implement)

#### @eslint-react DOM Security Rules (Phase 3)
* **NEW:** `@eslint-react/dom-no-unsafe-target-blank: error` — Require rel=noopener on external links
* **NEW:** `@eslint-react/dom-no-missing-iframe-sandbox: warn` — Require sandbox on iframes
* **NEW:** `@eslint-react/dom-no-missing-button-type: warn` — Require explicit button type

### Refactored Test Files
* Refactored test pattern files to use named constants and follow the new rules

### Dependency Changes
* **NEW:** `eslint-plugin-llm-core` added (`^0.18.0`)

## 7.0.0 (2026-06-07)

### Requirements Changes
* **BREAKING:** Bump minimum Node.js to ^20.19.0
* **BREAKING:** Bump peer dependency eslint to >=10 (ESLint 10)
* **BREAKING:** Bump TypeScript to ^6.0.3 (dev dependency)

### Plugin Replacements — Rule Prefix Changes

> **WARNING:** If you have `eslint-disable` comments referencing old rule names, **they will silently stop working**.
Search your codebase for these prefixes and update them accordingly.

**eslint-plugin-import → eslint-plugin-import-x**
All rules under the `import/` prefix moved to `import-x/`.
```diff
- import/no-duplicates
- import/no-extraneous-dependencies
- import/no-cycle
- import/no-self-import
- import/no-useless-path-segments
- import/order
+ import-x/no-duplicates
+ import-x/no-extraneous-dependencies
+ import-x/no-cycle
+ import-x/no-self-import
+ import-x/no-useless-path-segments
+ import-x/order
```
Plus all rules from the built-in `recommended` and `typescript` configs.

**eslint-plugin-react → @eslint-react/eslint-plugin**
All rules under the `react/` prefix moved to `@eslint-react/`.
```diff
- react/no-array-index-key
- react/jsx-no-useless-fragment
- react/self-closing-comp          → @stylistic/jsx-self-closing-comp
+ @eslint-react/no-array-index-key
+ @eslint-react/jsx-no-useless-fragment
+ @stylistic/jsx-self-closing-comp
```
Additionally, `react/jsx-no-bind` and `react/jsx-fragments` were removed from explicit rules
(covered by @eslint-react recommended). All rules from the old recommended and jsx-runtime configs
now live under `@eslint-react/` prefix.

**eslint-plugin-jsx-a11y → eslint-plugin-jsx-a11y-x**
All rules under the `jsx-a11y/` prefix moved to `jsx-a11y-x/`.
```diff
- jsx-a11y/alt-text
- jsx-a11y/anchor-has-content
- jsx-a11y/aria-role
- jsx-a11y/click-events-have-key-events
- jsx-a11y/label-has-associated-control
- jsx-a11y/no-autofocus
- jsx-a11y/no-static-element-interactions
+ jsx-a11y-x/alt-text
+ jsx-a11y-x/anchor-has-content
+ jsx-a11y-x/aria-role
+ jsx-a11y-x/click-events-have-key-events
+ jsx-a11y-x/label-has-associated-control
+ jsx-a11y-x/no-autofocus
+ jsx-a11y-x/no-static-element-interactions
```
Plus all rules from the built-in `recommended` config.

**eslint-plugin-react-hooks** — Unchanged (`react-hooks/` prefix)
**eslint-plugin-react-you-might-not-need-an-effect** — Unchanged (`react-you-might-not-need-an-effect/` prefix)

### Dependency Updates
* Updated typescript-eslint to ^8.60.1
* Updated @stylistic/eslint-plugin to ^5.10.0
* Updated eslint-plugin-react-hooks to ^7.1.1
* Updated eslint-plugin-unicorn to ^64.0.0
* Updated eslint-plugin-jsdoc to ^63.0.2
* Updated globals to ^17.6.0
* Updated eslint-plugin-promise to ^7.3.0
* Updated eslint-plugin-sonarjs to ^4.0.3
* Updated @eslint-community/eslint-plugin-eslint-comments to ^4.7.2
* Updated multiple dev dependencies (@types/node, @types/react, react)

### CI
* Dropped Node 20, added Node 26 to test matrix

## 6.0.3 (2026-04-01)
* Bumped dependencies for security fixes

## 6.0.2 (2026-02-15)
* Bumped dependencies to fix security issue

## 6.0.1 (2025-12-10)
* Fixed missing dependency

## 6.0.0 (2025-12-01)
* Bumped dependencies
* Added eslint-comments rules for AI workloads
* Updated repository URL format

## 5.0.0 (2025-10-13)
* **BREAKING:** Fixed React plugin configuration for ESLint flat config
* **NEW:** Added proper React settings (automatic version detection)
* **NEW:** Added comprehensive React rules including performance and accessibility
* **NEW:** Added JSX accessibility rules (jsx-a11y plugin)
* **NEW:** Added security rules (eslint-plugin-security)
* **NEW:** Added code quality rules (eslint-plugin-sonarjs)
* **NEW:** Added stylistic formatting rules (@stylistic/eslint-plugin)
* **NEW:** Added import/export rules (eslint-plugin-import)
* **NEW:** Added promise handling rules (eslint-plugin-promise)
* **NEW:** Added modern JavaScript rules (eslint-plugin-unicorn)
* **NEW:** Added JSDoc documentation rules (eslint-plugin-jsdoc)
* **NEW:** Added TypeScript member ordering and accessibility rules

## 4.0.0 (2025-09-28)
* Update dependencies
* Added [you might not need an effect](https://github.com/NickvanDyke/eslint-plugin-react-you-might-not-need-an-effect)
* Added [React Hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)

## 3.0.0 (2024-12-26)
* Release major version after testing

## 3.0.0-beta.0 (2024-12-26)
* Re-added import library
* Updated dependencies

## 2.0.1 (2024-08-12)
* Fixed missing `react` folder

## 2.0.0 (2024-08-12)
* Added React rules

## 1.0.0 (2024-08-10)
* Complete rewrite for eslint 9+
* Added some test files to test some rules

## 0.0.1 (2023-05-02)
* Initial Release

