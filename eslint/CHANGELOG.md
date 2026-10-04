CHANGELOG
=========
## 11.3.0 (2026-10-04)

All four reconfigurations below came from issue #24, filed by the first consumer
to adopt 11.2.0. Each was reproduced against the shipped config before being
applied, and each keeps its rule on with a narrower scope rather than
disabling it. Expect *fewer* findings, except where noted under
"Rules Tightened". Three further `llm-core` rules are disabled outright —
see "Rules Disabled".

### Rules Relaxed
* **RELAXED:** `unicorn/prefer-export-from` now ships `checkUsedVariables: false` in `es6/rules.js`. Upstream defaults it to `true`, and the skip at `prefer-export-from.js:342-347` only runs when the option is `false` — so by default the rule reports a re-exported binding that the module body also reads, and its fix appends `from './m'` to the existing `export {x}`, leaving both `import {x} from './m'` and `export {x} from './m'` in the file. The module specifier has to be written twice to satisfy a rule that never had a working alternative. With the option `false` the rule still reports a binding whose *only* reference is the export specifier itself — the genuine passthrough case, where `export {x} from './m'` is a real improvement and is still autofixed
* **RELAXED:** `unicorn/consistent-boolean-name` now ships `checkFunctions: 'never'` in `es6/rules.js`. The variable half is sound and stays on. The function half required `is`/`has` prefixes on boolean-returning functions, which reads as worse English for a function named for what it did — `appendConfigApplied` had to become `isAppendConfigApplied`. A verb phrase is not a boolean state name. `checkVariables`, `checkArguments`, `checkMethods`, and `checkFields` keep their upstream defaults
* **RELAXED:** `unicorn/no-top-level-assignment-in-function` is off in test files, joining `sonarjs/no-duplicate-string` in the existing `shaunburdick/js-test-files` block in `es6/index.js` (same globs, same rationale: a suite built on fixtures declares them at module scope and assigns them in a `beforeEach` hook, which is the only way to get per-test isolation). Upstream offers no option to exempt tests. Product code is unaffected

### Rules Tightened
* **TIGHTENED:** `unicorn/numeric-separators-style` now ships `number: { minimumDigits: 4 }` in `es6/rules.js` (the radix key is quoted — `id-denylist` forbids `number` as an identifier). Upstream ships `5`, so a hand-written `1_000` was reported and "fixed" down to `1000`: the rule's first act on a correctly grouped literal was to delete the grouping. Other radixes keep their upstream defaults. **This is the one change in the release that produces new errors.** A bare four-digit literal (`1000`) now reports where it previously did not, so consumers carrying ungrouped four-digit numbers will see new findings on upgrade; four literals in this package were grouped to comply. A minor release rather than a patch, since it tightens enforcement

### Rules Disabled
* **DISABLED:** `llm-core/no-unknown-parameters`, `llm-core/no-unsafe-dictionary-type`, and `llm-core/no-redundant-logic`. All three state an architectural assumption as a per-node syntactic error, and none can distinguish the case they target from the cases they break — so each fires about as often on correct code as on the pattern it was written for. Each is one line to re-enable by id; the rule-groups reference carries the reasoning and a table of when you would want one back
  * `no-unknown-parameters` fires on *every* `unknown` parameter, including a queue forwarder and an error-details passthrough, and declares `schema: []` / `defaultOptions: []` — exempting only `cause`. Where a decoder takes `unknown` by design, the rule asks it not to do the thing it exists to do, and the only ways to satisfy it are renaming the parameter or misdeclaring its type
  * `no-unsafe-dictionary-type` fires on a function-local `Record<string, unknown>` and on a plain in-memory cache, neither of which is an external payload — contradicting its own message ("parse external payloads before insertion")
  * `no-redundant-logic` reads syntax only, so it reports `x === true` whether `x` is `boolean`, `boolean | undefined`, or `unknown`, justified by "the expression already evaluates to a boolean" — a type claim it cannot check. On `unknown` the suggestion breaks compilation and no other spelling is legal; on a real `boolean` the comparison is redundant code that type-aware `@typescript-eslint/no-unnecessary-condition` already catches correctly. It still catches one defect the type-aware rule does not — comparing a non-boolean to a boolean literal, which is always false — so it is off rather than dismissed
* **BREAKING, in the useful direction:** these three were `error`; they are now off, so a consumer carrying local overrides for them can delete those lines. `llm-core` active rules drop from 42 to 39 on `.js`/`.jsx` and 43 to 40 on `.ts`/`.tsx`
* Side effect worth knowing: the issue #21 deadlock is gone rather than narrowed. `strict-boolean-expressions` with `allowNullableBoolean: true` previously left `x === true` reported by `no-redundant-logic`, so `x ?? false` was the only survivable spelling for a `boolean | undefined` field. With that rule off, all three spellings are legal

### Documentation
* **NEW:** `es6/llm-core-disabled.test.js` — asserts severity `0` for all three rules on `.ts` and `.js`, read back from `calculateConfigForFile` rather than inferred from findings, plus a re-enabled pass proving each fixture carries a real trigger. It exists because an `llm-core/` entry written in `rules.js` resolves to nothing (that recommended set is spread *after* it) and fails silently; the same assertion catches that mistake
* **NEW:** `es6/rule-defaults.test.js` — integration tests asserting the shipped config for all four reconfigurations. Each case pairs its suppression assertion with a control that must still fire, so the suite fails if a rule is switched off wholesale rather than narrowed; verified by reverting `checkUsedVariables` and confirming exactly the one covering test fails
* **FIXED:** `rules.js` is now the single place any `unicorn/` or `llm-core/` rule is configured. `llm-core.configs.recommended` was spread *after* the `shaunburdick/js` block, so an `llm-core/` entry in `rules.js` was silently overwritten back to `'error'` on flattening — invisible, because the entry looks right and the file lints clean. That is why the three disabled rules in this release initially had to live in a separate `shaunburdick/js-overrides` block. The spread now sits above `shaunburdick/js` alongside unicorn's, and those nine rules moved into `rules.js`, where they belong. `AGENTS.md` carried the same incorrect claim ("upstream recommended configs are spread *before* the rules block") and is corrected. Blocks after `shaunburdick/js` are now only the `files`-scoped `js-config-files` and `js-test-files` exceptions. Verified behavior-preserving: the resolved config for 10 representative file types is byte-identical before and after, rule for rule
* `AGENTS.md` and the rule-groups reference: llm-core active counts updated to 39/40, disabled-rule count to 5, and a re-enable table with copy-pasteable config added
* `typescript/rules.js` and `typescript/strict-boolean-expressions.test.js`: the issue #21 notes described `x === true` as still reported by `no-redundant-logic`. That is no longer true, so the deadlock those comments described is resolved rather than narrowed
* rule-groups reference records the three `unicorn/` reconfigurations and the `no-top-level-assignment-in-function` test-file exemption alongside the existing `no-non-function-verb-prefix` note
* agent skill `metadata.version` and `AGENTS.md` "Current Version" → 11.3.0

### Not Taken
* `llm-core/no-unknown-parameters` and `llm-core/no-redundant-logic` are both genuinely unsatisfiable in some architectures — the first declares `schema: []` and `defaultOptions: []`, the second reads syntax only and so asserts "the expression already evaluates to a boolean" about operands it cannot see. Neither is fixable from this config, and disabling either by default would cost every consumer a guardrail to serve one architecture. They stay on. `unicorn/prefer-combined-guards` was also left alone: it *does* compare consequent bodies (`prefer-combined-guards.js:149`), so two guards throwing different messages are not reported

## 11.2.0 (2026-10-03)

### Rules Relaxed
* **RELAXED:** `llm-core/max-file-length` `max: 500` → `1000`, `llm-core/max-function-length` `max: 50` → `100`, and `llm-core/max-params` `max: 2` → `4`, in `es6/index.js`. The length caps were the most-cited source of file and helper-count growth in consuming projects: under a 50-line function cap an agent decomposes aggressively, and every extraction is another named, documented, tested unit. The function cap is what actually relieves the pressure; the file cap is the ceiling that let the churn accumulate, so it moves with it. `max-params` at 2 forced either bundling wrappers or a rest-parameter-plus-destructuring workaround that then tripped `no-unsafe-array-access`; 4 sits under the core `max-params: 5` in `rules.js`, which remains the backstop. `maxConstructor` (5) and `maxInternal` fall back via `??`, so naming `max` alone leaves constructors untouched
* **CAVEAT:** neither length rule can skip comments. Both accept only `max`, `skipBlankLines`, and `skipTestFiles`, count every non-blank line, and declare `additionalProperties: false` — so a `skipComments` option fails config validation rather than being silently ignored, and a heavily documented file buys no headroom. ESLint core's `max-lines` and `max-lines-per-function` do support `skipComments`, if comment-insensitive counting is ever wanted

### Security
* **FIXED:** `brace-expansion` `5.0.9` → `5.0.12` in `package-lock.json`, resolving a high-severity DoS advisory (GHSA-q2hr-2g5m-vwhr, GHSA-qhr7-859c-m2p7, GHSA-6j4f-fj2g-mc7p). Reached transitively via `eslint-plugin-import-x` → `minimatch@10.2.6`, which was already at latest, so this is a lockfile refresh rather than a constraint change — no declared dependency range moved. Unrelated to the rule relaxations above; bundled because it fails the `ES Lint Dependency Audit` gate

### Documentation
* **FIXED:** `AGENTS.md` claimed the config "Requires JSDoc documentation". No rule does — `jsdoc/require-jsdoc` is not enabled, and ESLint core's `require-jsdoc` was removed in v9. All three configured `jsdoc/` rules (`check-alignment`, `tag-lines`, and the off `check-indentation`) are formatters that only inspect blocks you already wrote. The false claim was a likelier driver of doc bloat than any lint error, since agents read `AGENTS.md`
* **FIXED:** rule-groups reference now states plainly that nothing requires a JSDoc block, drops the `max-params` example that no longer trips (webpack's 3-argument `generate` is legal again), records the resolved 1000/100/4 values, and documents the absent `skipComments` option
* **FIXED:** `AGENTS.md` "Current Version" read 11.0.0 while the package was already at 11.1.0

## 11.1.0 (2026-09-29)

### Rules Relaxed
* **RELAXED:** `@typescript-eslint/strict-boolean-expressions` gains `allowNullableBoolean: true`, in `typescript/rules.js` **and** in the `.tsx` override in `typescript/index.js` — flat-config options are *replaced*, not merged, by a later block, so a change to one never reaches the other and the contradiction survived in components while `.ts` looked fixed. For a `boolean | undefined` field, `if (x)`, `if (x === true)` and `if (x ?? false)` all map `undefined` to `false`: the same program in three spellings, so refusing the truthy form bought no safety, only a spelling — and the two spellings it forced were each punished by another rule this config enables. `if (x)` is banned by this rule; `if (x === true)` is reported by `llm-core/no-redundant-logic`, which reads syntax only and cannot see that the operand is nullable; `x ?? false` was left as the sole survivor, discoverable only by iterating on two contradictory errors. Nullable strings, numbers and objects keep their guardrails (`allowNullableObject` stays `false`), and `x === true` is still reported as redundant. See issue #21

### Documentation
* **NEW:** rule-groups reference records the `llm-core/no-redundant-logic` × `@typescript-eslint/strict-boolean-expressions` interaction from issue #21 (previously undocumented — the rule appeared in no reference file), adds the missing `no-redundant-logic` row, and updates the `strict-boolean-expressions` row and the `@typescript-eslint/` section for the relaxed nullable-boolean option

## 11.0.0 (2026-09-29)

### Bugs Fixed
* **BREAKING:** The `ts` layer now targets `**/*.{ts,tsx}` instead of `**/*.ts`. Previously **zero** `@typescript-eslint` rules — type-aware or otherwise — applied to `.tsx` files, so the canonical React promise bug (`<button onClick={asyncHandler} />`) went unguarded alongside `no-unsafe-arguments`, `no-unnecessary-condition`, `await-thenable`, and the rest of the type-aware set. Two React-idiom relaxations ship with the widening (options are restated in full in `typescript/index.js`, since a later block *replaces* rule options): PascalCase component names/imports/variables, and nullable strings/numbers in JSX conditionals (`{title && <h1>}`); nullable booleans and objects stay strict. See issue #14

### Rules Relaxed
* **RELAXED:** `sonarjs/no-duplicate-string` is off in test files (globs mirror `TEST_FILE_PATTERNS` in `custom-rules.js`: `*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/`, `spec/`). Specs legitimately repeat a selector at each assertion site; upstream offers only `threshold`/`ignoreStrings`, no `ignoreTests`. See issue #13
* **RELAXED:** `unicorn/no-non-function-verb-prefix` now ships `ignore: ['.*(?:Spy|Mock)$']`. Jest spies (`MockInstance` types have no call signature) were reported for starting with a verb — `addEventListenerSpy` failed while `dispatchEventSpy` passed, pure verb luck. See issue #18

### Rules Disabled
* **DISABLED:** `unicorn/no-instanceof-builtins` — its autofix rewrites `x instanceof Function` to `typeof x === 'function'`, which narrows a naked type parameter to `T & Function` (no call signatures) and turns compiling TypeScript into TS2349 while `eslint . --fix && eslint .` exits 0. Reproduced against tsc 6.x strict. See issue #9
* **DISABLED:** `@eslint-react/web-api-no-leaked-event-listener` — its pairing logic (`isSameObject` in `eslint-plugin-react-web-api` 5.23) only matches `MemberExpression` callees, so a bare `addEventListener(...)` in `useEffect` can never pair with its `removeEventListener(...)` cleanup: correct code reports unconditionally. The bare form is exactly what `unicorn/no-unnecessary-global-this` demands, making the two mutually unsatisfiable — the only escape was aliasing `globalThis` to appease a linter. See issue #12

### Documentation
* **NEW:** README pairs the suggested lint scripts with `tsc --noEmit` and notes that autofixes changing an expression's *type* are invisible to ESLint. See issue #19
* **NEW:** rule-groups reference gains the three supported `JSX.Element` forms for `explicit-export-types` on `.tsx` (issue #17), the three-rules-one-answer pattern for joining JSX cell arrays with spaces (issue #16), and the rest-params + destructuring-defaults form for mandated third-party callback signatures under `max-params`/`no-unsafe-array-access` (issue #10), plus notes for both disabled rules

## 10.0.0 (2026-09-29)

### Bugs Fixed
* **FIXED:** `shaunburdick/max-inline-disables` now actually runs. The `shaunburdick/js-overrides` block that disabled it had no `files` key, so it turned the rule off for *every* file rather than for config files as its comment intended. A consumer file with 3+ inline disables reported nothing. The bypass is now scoped to `**/*.config.{js,mjs,cjs,ts,mts,cts}`
* **FIXED:** The rule gained a `skipTestFiles` option (enabled in `es6/rules.js`), matching the convention `llm-core`'s own complexity rules use. Test files exist to construct invalid code and legitimately need many inline disables
* **FIXED:** `llm-core`'s recommended set applies to `.jsx`, `.mjsx`, `.cjsx`, `.mts`, and `.cts`. Upstream scopes it to `.js`/`.mjs`/`.cjs`/`.ts`/`.tsx` only, so those extensions received 9 of 44 guardrails while `.js`/`.tsx` received 42/43. **BREAKING for `.jsx`/`.mts`/`.cts` users:** expect up to 33 new errors per file

### Requirements Changes
* **BREAKING:** Adopting `unicorn.configs.recommended` and `llm-core.configs.recommended` enables roughly 360 additional rules. Expect substantial new lint errors on upgrade — see the `eslint-config-shaunburdick` agent skill for a rule-group map and remediation guidance
* **BREAKING:** `unicorn/no-array-for-each` was renamed to `unicorn/no-for-each` upstream (same semantics, no action needed if you had not overridden it)

### New Rules — Recommended Config Adoption
* **NEW:** `unicorn.configs.recommended` — the full upstream recommended set (361 rules, of which 310 end up active) is now wired into the base `js` config. Our explicit rules in `es6/rules.js` are applied after it and win any conflict
* **NEW:** `llm-core.configs.recommended` replaces the narrower `llm-core.configs.complexity`, adding the typescript, best-practices, style, and hygiene groups. Notable additions include `no-unknown-parameters`, `no-unknown-returns`, `no-unsafe-array-access`, `no-dynamic-code-execution`, `explicit-export-types`, `no-redundant-comments`, and `no-debug-scaffolding`
* **NEW:** `llm-core` guardrails now reach `.jsx`, `.mjsx`, `.cjsx`, `.mts`, and `.cts` — previously excluded by upstream's `files` globs, despite the React layer linting those extensions

### Documentation
* **NEW:** The `eslint-config-shaunburdick` agent skill (`.agents/skills/`) documents install, setup, rule groups, and the graduated disable flow
* **NEW:** A companion `biome-config-shaunburdick` agent skill at `.agents/skills/biome-config-shaunburdick/`, split out so it fires for Biome-only projects. Skill selection keys off the package name, so a skill named `eslint-config-shaunburdick` cannot match a Biome context

### Rules Relaxed
* **RELAXED:** `llm-core/no-inline-disable` turned off — the graduated disable flow (`shaunburdick/max-inline-disables`) already permits 1-2 inline disables per file and escalates beyond that, so a blanket ban was redundant. This only became load-bearing once the `max-inline-disables` bypass was properly scoped (see Bugs Fixed)
* **RELAXED:** `llm-core/prefer-nullish-coalescing` turned off in the base config — the syntactic check false-positives on boolean operands where `??` is not a valid substitute. TypeScript projects still get the type-aware `@typescript-eslint/prefer-nullish-coalescing` from the `ts` config

### Rules Disabled from unicorn recommended
Each is off deliberately, with rationale in `es6/rules.js`:
* `unicorn/name-replacements` — forces `ButtonProps` → `ButtonProperties` and `e` → `error`; abbreviated `Props` is the React community convention
* `unicorn/no-null` — distinguishing a present-but-empty value from an absent one is an API design decision
* `unicorn/prefer-ternary` — contradicts `llm-core/prefer-early-return` and the guard-clause style this config is built around
* `unicorn/single-line-block-comment-style` — fights compact single-line JSDoc under `@stylistic/max-len: 120`
* `unicorn/prefer-number-coercion` — rewrites `parseInt(value, 10)` to `Math.trunc(Number(value))`, a semantic change rather than a style preference

### Dependency Updates
* **UPDATED:** `eslint` 10.4.1 → 10.11.0, `typescript-eslint` 8.60.1 → 8.71.0, `globals` 17.6.0 → 17.12.0, `eslint-plugin-import-x` 4.16.2 → 4.17.1, `eslint-plugin-jsdoc` 63.0.2 → 65.0.0, `eslint-plugin-unicorn` 64.0.0 → 76.0.0, `eslint-plugin-llm-core` 0.26.0 → 0.37.0, `eslint-plugin-sonarjs` 4.0.3 → 4.2.2, `@eslint-react/eslint-plugin` 5.8.13 → 5.23.0, `eslint-plugin-security` 4.0.0 → 4.1.0, `@biomejs/biome` 2.5.10 → 2.5.14, and others
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

