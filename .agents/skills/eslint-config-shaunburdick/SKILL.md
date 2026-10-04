---
name: eslint-config-shaunburdick
description: Install, set up, and debug the eslint-config-shaunburdick ESLint config (v11). Use when linting fails with a rule you don't recognize, when adding this config to a project, when deciding whether to fix or suppress a violation, or when upgrading across a major version. Covers the three config layers (js/ts/react), rule groups and what they mean, the graduated disable flow, and when to use the Biome alternative instead.
metadata:
  author: shaunburdick
  version: "11.3.0"
---

# eslint-config-shaunburdick

A strict ESLint flat config for JavaScript, TypeScript, and React, plus a
[Biome](https://biomejs.dev/) alternative that ports the compatible subset —
see the `biome-config-shaunburdick` skill.

The config is opinionated and deliberately hostile to common AI-generated code
patterns. Roughly 650–680 rules are active depending on which layers you spread
and which file extension is being linted. When lint fails, the cause is almost
always one of a few recurring groups — read [`references/rule-groups.md`](references/rule-groups.md) before
deciding how to respond.

## Install

Requires **Node.js >=20.19.0** and **ESLint >=10** (flat config only).

```sh
npm install --save-dev eslint@10 eslint-config-shaunburdick
```

TypeScript projects must also have `typescript` installed; the `ts` config uses
`projectService: true` and needs a resolvable `tsconfig.json`.

```sh
npm install --save-dev typescript
```

Biome is a separate package and an alternative to ESLint, not a companion
installed alongside it:

```sh
npm install --save-dev @biomejs/biome@^2.5.0 biome-config-shaunburdick
```

## Set up

Create `eslint.config.mjs` and spread only the layers you need. **Spread them in
`js` → `ts` → `react` order** — later layers win, and the order is load-bearing:

```js
import shaunburdick from 'eslint-config-shaunburdick';

export default [
    ...shaunburdick.config.js,     // base JS — always required
    ...shaunburdick.config.ts,      // TypeScript rules (**/*.{ts,tsx})
    ...shaunburdick.config.react,   // React + a11y
];
```

**Why the order matters:** the `ts` layer turns off the core `no-shadow`,
`no-use-before-define`, and `no-return-await` because their TypeScript-aware
equivalents cover the same ground more accurately. Spreading `js` after `ts`
re-enables all three alongside the TS versions, so a single shadowed identifier
gets reported twice. `js` first, always. `react` is order-independent relative
to the other two — it owns its own file scope and enables no core rules.

JavaScript-only project:

```js
export default [...shaunburdick.config.js];
```

Then wire up the scripts so lint runs as part of your test cycle:

```json
{
    "scripts": {
        "lint": "eslint .",
        "lint:fix": "npm run lint -- --fix",
        "test": "npm run lint && jest"
    }
}
```

TypeScript projects should pair the linter with the compiler —
`"lint": "eslint . && tsc --noEmit"`. ESLint does not validate autofix output:
a fix that changes an expression's *type* (rather than its style) can pass a
green `eslint . --fix && eslint .` and still fail `tsc`.

**Scope:** the `ts` layer targets `**/*.{ts,tsx}` — `.tsx` receives full
type-aware coverage (including `no-misused-promises` on async handlers), with
two React-idiom relaxations: PascalCase component names/imports and nullable
strings/numbers in JSX conditionals. `.mts` and `.cts` remain outside the
scope: they get neither the type-aware `@typescript-eslint` rules nor project
service type information. `llm-core`'s type-aware rules still work on those
extensions. Add `...shaunburdick.config.ts` after widening its `files` yourself
if you need that coverage.

## When lint fails

Read the rule ID in the ESLint output — it is always namespaced. The prefix
tells you which group you are in:

| Prefix | Group |
| --- | --- |
| `unicorn/` | Modern JS idioms; the largest group, many are autofixable |
| `llm-core/` | Agentic guardrails — over-engineering, unsafe types, swallowed errors |
| `@typescript-eslint/` | Type-aware TypeScript correctness |
| `@stylistic/` | Formatting — almost all autofixable, never suppress |
| `jsx-a11y-x/`, `@eslint-react/` | Accessibility and React security |
| `sonarjs/` | Complexity and duplication |
| `import-x/` | Import hygiene and ordering |
| `shaunburdick/` | This config's own custom rules |

[`references/rule-groups.md`](references/rule-groups.md) maps each group to what it is actually protecting
against, with the most common violations and their fixes.

## Responding to a violation

Work through these in order:

1. **Fix the code.** This is the expected outcome for the overwhelming majority
   of findings. Most `unicorn/` and `@stylistic/` findings have autofixes:
   run `npm run lint:fix` first, then review the diff.
2. **Reconsider the rule** if it is genuinely wrong for the code at hand. A
   few rules encode opinions that legitimate code can violate. Change the rule
   in your `eslint.config.mjs` with a comment explaining why — that is a
   config decision, and it is legitimate.
3. **Suppress** only as a last resort, and only by following the graduated
   disable flow below.

Never suppress `@stylistic/` formatting rules — they are machine-enforced
style, and the fix is the autofix.

## Graduated disable flow

`reportUnusedDisableDirectives: 'error'` means a stale `eslint-disable` is
itself a lint error, so suppressions cannot silently rot.

The `shaunburdick/max-inline-disables` rule (`warn`, `max: 2`) enforces an
escalation ladder:

1. **One or two inline disables in a file** — fine. Use
   `// eslint-disable-next-line rule-name -- reason`. The `-- reason` suffix is
   required by `@eslint-community/eslint-comments/require-description`.
2. **Three or more in one file** — the rule warns. Switch to a block-level
   pair around the region:
   ```js
   /* eslint-disable some-rule -- reason */
   // ...all lines needing suppression
   /* eslint-enable some-rule */
   ```
3. **The same need across three or more files** — add a config override in
   `eslint.config.mjs` scoping that rule to those paths. This is the only
   approach that scales.

A blanket `eslint-disable` at the top of a file is never the answer.

**Two exemptions are built in**, both deliberate:

- `**/*.config.{js,mjs,cjs,ts,mts,cts}` — build-tool and ESLint config files
  are inherently exemption-heavy (one disable per rule they relax), so the cap
  does not apply to them.
- Test files (`*.test.*`, `*.spec.*`, `__tests__/`, `test/`, `tests/`, `spec/`)
  are skipped via the rule's `skipTestFiles` option, because they exist to
  construct invalid code.

To turn the cap off entirely — or change the threshold — override it in your own
`eslint.config.mjs`:

```js
{
    rules: {
        'shaunburdick/max-inline-disables': ['warn', { max: 5, skipTestFiles: true }],
    },
}
```

## Upgrading across a major version

Major versions of this config only ship for breaking rule changes. Read the
`CHANGELOG.md` entry for the version you are crossing before upgrading — each
one names the rules added, relaxed, or disabled and why. v11.0.0, for example,
widened the `ts` layer to `.tsx`, dropped two rules that either broke correct
code on autofix or could never be satisfied alongside another rule, and
exempted test files and jest spies.

Expect new errors on upgrade. That is the point of a major bump, not a
regression. Do not suppress your way through it — fix, or override in config
with a stated reason.

## Biome alternative

`biome-config-shaunburdick` ports the subset of rules Biome 2.5 supports — 164
unique rules, ~91 of them corresponding to an ESLint rule here. Use it as an
**alternative** to this config, not alongside it:

```json
{
    "extends": ["biome-config-shaunburdick"]
}
```

**No Biome equivalent** for: JSDoc rules, the `security` plugin, promise
discipline (`always-return`, `catch-or-return`), all `llm-core` guardrails, the
naming denylist and `id-length`, the `max-file-length` / `max-function-length` /
`max-nesting-depth` complexity budgets, and the custom `max-inline-disables`
rule. If you rely on any of those, use this config.

If you are working in a Biome project rather than an ESLint one, read the
`biome-config-shaunburdick` skill instead — it covers the nursery-rule
stability risk and `biome migrate` pinning that do not apply here.

## Reference files

- [`references/rule-groups.md`](references/rule-groups.md) — every rule group,
  what it protects against, and how to fix the most common findings

Beyond this skill, the `biome-config-shaunburdick` skill carries
`references/biome-mapping.md`, the ESLint-to-Biome rule mapping. It names every
ESLint rule here that has a Biome equivalent — and those that don't.
