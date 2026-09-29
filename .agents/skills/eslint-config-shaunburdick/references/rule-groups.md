# Rule Groups

Every rule ID in ESLint output is namespaced. The prefix identifies the group,
which determines both what the rule protects against and how you should respond
to a violation.

Roughly 700 rules are active on a TypeScript file. The groups below are ordered
by how often they fire in practice.

---

## `unicorn/` — Modern JavaScript idioms

The largest group (361 rules, from `unicorn.configs.recommended`). These
enforce current JS conventions and reject deprecated or error-prone patterns.
**Most have autofixes** — run `npx eslint . --fix` and review the diff.

### High-frequency findings

| Rule | What it wants | Fix |
| --- | --- | --- |
| `unicorn/no-for-each` | `for...of` over `forEach` | Rewrite the loop. Renamed from `no-array-for-each` in v74 |
| `unicorn/prefer-node-protocol` | `node:fs` over `fs` | Add the `node:` prefix |
| `unicorn/prefer-module` | ESM over CJS | `import`/`export`, not `require` |
| `unicorn/prefer-includes` | `includes()` over `indexOf() !== -1` | Autofixable |
| `unicorn/prefer-string-starts-ends-with` | `startsWith`/`endsWith` over `slice`/`substr` | Autofixable |
| `unicorn/no-useless-undefined` | Drop redundant `undefined` | Remove `return undefined`; drop `= undefined` defaults |
| `unicorn/prefer-spread` | Spread over `Function.apply` | Autofixable |
| `unicorn/no-await-expression-member` | Destructure rather than `(await x).y` | `const { y } = await x;` |
| `unicorn/consistent-function-scoping` | Hoist functions to the topmost scope | Move the function out of the enclosing block |
| `unicorn/throw-new-error` | `new Error()` over `throw 'msg'` | Construct an Error |

### Disabled from recommended, on purpose

Do not "fix" these — they are off by design and re-enabling them will not
help. Rationale is in `es6/rules.js`.

- `name-replacements` — would rewrite `ButtonProps` → `ButtonProperties` and
  `e` → `error`. Abbreviated `Props` is the React community convention.
- `no-null` — distinguishing a present-but-empty value from an absent one is
  an API design decision, not a lint concern.
- `prefer-ternary` — collapses `if (cond) { return a; } return b;` into a
  ternary, directly contradicting `llm-core/prefer-early-return` below.
- `single-line-block-comment-style` — fights compact single-line JSDoc under
  the 120-char limit.
- `prefer-number-coercion` — rewrites `parseInt(value, 10)` to
  `Math.trunc(Number(value))`, which is a semantic change, not style.

---

## `llm-core/` — Agentic programming guardrails

The config's reason for existing. These target patterns that AI coding agents
produce consistently: over-engineering, swallowed errors, unsafe types, and
type assertions that hide real problems. Backed by research on machine
signatures of defects (Columbia DAPLab, arXiv 2605.02741, SlopCodeBench).

### Error handling

| Rule | What it wants |
| --- | --- |
| `llm-core/no-empty-catch` | Never swallow an exception silently — handle or rethrow with context |
| `llm-core/no-swallowed-errors` | A `catch` that only logs is not handling; add recovery or rethrow |
| `llm-core/throw-error-objects` | `throw new Error(...)`, never a raw string or object |
| `llm-core/consistent-catch-param-name` | One catch-parameter name across the codebase |

### Type safety

| Rule | What it wants |
| --- | --- |
| `llm-core/no-unknown-parameters` | Annotate every exported parameter — do not infer from usage |
| `llm-core/no-unknown-returns` | Annotate every exported return type |
| `llm-core/no-object-parameters` | Prefer positional params over an options object |
| `llm-core/no-type-assertion-any` | `as` casts to `any` are banned |
| `llm-core/no-chained-type-assertions` | `as unknown as T` double-casts are banned |
| `llm-core/no-widen-then-assert` | Do not widen a type then cast back |
| `llm-core/no-unsafe-dictionary-type` | Ban untyped `Record<string, unknown>` maps |
| `llm-core/no-unsafe-array-access` | Guard or destructure before `arr[0]` |
| `llm-core/explicit-export-types` | Exported symbols carry explicit types |

### Code quality

| Rule | What it wants |
| --- | --- |
| `llm-core/prefer-early-return` | Guard clauses instead of one big `if` wrapping the body |
| `llm-core/no-commented-out-code` | Remove dead code left from exploration |
| `llm-core/no-llm-artifacts` | Remove `TODO: implement` and similar placeholders |
| `llm-core/no-redundant-comments` | Delete comments that restate the code |
| `llm-core/no-debug-scaffolding` | Remove leftover debug code |
| `llm-core/no-dynamic-code-execution` | Ban `eval` and `new Function` |
| `llm-core/filename-match-export` | A file's single export should match its filename |
| `llm-core/no-async-array-callbacks` | `array.map(async ...)` does not do what it looks like |

### Complexity limits

From `llm-core.configs.recommended`: `max-complexity`, `max-function-length`,
`max-nesting-depth`, `max-params` (5), and `max-file-length`. Our config
overrides `max-file-length` to 500 for config files, and
`no-magic-numbers` ignores `[0, 1, 2, 3, 4, 5, 10, 12, 15, 120]` so common
values like a `parseInt` radix do not need named constants.

### Disabled, on purpose

- `no-inline-disable` — redundant with the graduated disable flow, which
  already permits 1-2 inline disables per file and escalates beyond that.
- `prefer-nullish-coalescing` — the syntactic check false-positives on boolean
  operands (`a.includes(x) || a.includes(y)`), where `??` is not a valid
  substitute. TypeScript projects get the type-aware
  `@typescript-eslint/prefer-nullish-coalescing` instead.

---

## `@typescript-eslint/` — Type-aware correctness

Only active on `**/*.ts` (see the `.tsx` gap in SKILL.md). These need real type
information, so they catch what syntax alone cannot.

| Rule | What it wants |
| --- | --- |
| `no-floating-promises` | Handle or `void` an un-awaited promise (`ignoreVoid`, `ignoreIIFE` set) |
| `no-misused-promises` | Do not pass an async function where a void one is expected |
| `await-thenable` | Do not `await` a non-Promise |
| `no-unnecessary-condition` | Remove always-true/false checks the types make redundant |
| `strict-boolean-expressions` | No truthy checks on strings or numbers — be explicit |
| `restrict-template-expressions` | Template literals take only safe types |
| `no-non-null-assertion` | `!` is banned; handle the null case |
| `unbound-method` | Bind methods before passing them as references (`ignoreStatic`) |
| `switch-exhaustiveness-check` | Handle every enum member or add a default |
| `member-ordering` | Fields, then constructors, then getters/setters, then methods |
| `explicit-member-accessibility` | Every class member declares `public`/`private` |
| `naming-convention` | camelCase values, PascalCase types and enum members |
| `consistent-type-definitions` | `interface` over `type` for object shapes |
| `prefer-readonly` | Mark never-reassigned properties `readonly` |

---

## `@stylistic/` — Formatting

Machine-enforced style. **Never suppress these;** run `eslint . --fix`.

4-space indent (switch cases +1), 120-char lines, single quotes with
`avoidEscape`, semicolons required, 1TBS braces, no trailing whitespace,
newline at EOF, curly required on all control flow.

---

## `jsx-a11y-x/` and `@eslint-react/` — Accessibility and React security

Accessibility is a non-negotiable requirement in this config, not a suggestion.

| Rule | What it wants |
| --- | --- |
| `jsx-a11y-x/alt-text` | Every image needs alt text |
| `jsx-a11y-x/anchor-has-content` | Anchors need accessible content |
| `jsx-a11y-x/aria-role` | Only valid ARIA roles |
| `jsx-a11y-x/click-events-have-key-events` | `onClick` needs keyboard equivalent |
| `jsx-a11y-x/label-has-associated-control` | Labels must point at a control |
| `jsx-a11y-x/no-autofocus` | No `autoFocus` |
| `jsx-a11y-x/no-static-element-interactions` | Handlers need an interactive element |
| `@eslint-react/dom-no-missing-button-type` | `<button>` needs an explicit `type` |
| `@eslint-react/dom-no-missing-iframe-sandbox` | `<iframe>` needs `sandbox` |
| `@eslint-react/dom-no-unsafe-target-blank` | `target="_blank"` needs `rel="noopener noreferrer"` |
| `@eslint-react/no-array-index-key` | Do not key lists by array index |
| `@eslint-react/jsx-no-useless-fragment` | Drop fragments that wrap a single child |

Also active: all of `react-hooks` `recommended-latest` and
`react-you-might-not-need-an-effect` `recommended`. The latter flags `useEffect`
used for derived state or event handling that belongs in render or a handler.

---

## `sonarjs/` — Complexity and duplication

| Rule | Threshold |
| --- | --- |
| `sonarjs/cognitive-complexity` | 15 |
| `sonarjs/no-duplicate-string` | no repeated string literals |
| `sonarjs/no-duplicated-branches` | no identical branches in an if/else chain |
| `sonarjs/no-identical-functions` | no copy-pasted function bodies |

The duplicate-string rule is stricter than it sounds — extract a named constant
rather than repeating a literal.

---

## `import-x/` — Import hygiene

`import-x/order` enforces builtin → external → parent → sibling → index. Plus
`no-cycle`, `no-self-import`, `no-useless-path-segments`, `no-duplicates`
(the base `no-duplicate-imports` is off because it cannot handle separate type
imports), and `no-extraneous-dependencies`.

In TypeScript files, `consistent-type-specifier-style` requires top-level
`import type`.

---

## `security/` — Vulnerability patterns

`security.configs.recommended`, with two rules off because they are
false-positive prone: `detect-object-injection` and
`detect-non-literal-fs-filename`.

13 rules active, including `detect-eval-with-expression`, `detect-child-process`,
`detect-non-literal-require`, `detect-non-literal-regexp`, `detect-unsafe-regex`
(ReDoS), `detect-possible-timing-attacks`, `detect-pseudoRandomBytes`
(insecure randomness), `detect-buffer-noassert`, and the invisible/bidi
character checks.

---

## `promise/` — Promise discipline

`always-return`, `catch-or-return`, `no-return-wrap`, `param-names`, `no-nesting`.
Every promise chain needs a `return`, needs a `catch` or an explicit return, and
should not be nested.

---

## `jsdoc/` — Documentation

Two rules are active: `check-alignment` (asterisk alignment) and `tag-lines`
(`'any'`, `startLines: 1` — a blank line before the tag block).
`check-indentation` is off. The remaining 75 rules in the plugin are not
enabled, including the type-aware additions shipped in v65
(`no-unnecessary-type-assertion`, `normalize-see-links`, `ts-ban-ts-comment`).

---

## `@eslint-community/eslint-comments/` — Directive hygiene

`require-description` — every `eslint-disable` needs a `-- reason` suffix. This
is what makes suppressions reviewable.

---

## `shaunburdick/` — This config's own rules

`shaunburdick/max-inline-disables` (`warn`, `max: 2`) — see the graduated
disable flow in SKILL.md. Defined in `es6/custom-rules.js`, tested alongside its
source in `es6/custom-rules.test.js`.
