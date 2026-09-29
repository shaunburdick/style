---
name: eslint-config-shaunburdick
description: Install, set up, and debug the eslint-config-shaunburdick ESLint config (v10) and the biome-config-shaunburdick Biome companion. Use when linting fails with a rule you don't recognize, when adding this config to a project, when deciding whether to fix or suppress a violation, or when upgrading across a major version. Covers the three config layers (js/ts/react), rule groups and what they mean, the graduated disable flow, and the known gaps versus Biome.
---

# eslint-config-shaunburdick

A strict ESLint flat config for JavaScript, TypeScript, and React, plus a
[Biome](https://biomejs.dev/) companion that ports the compatible subset.

The config is opinionated and deliberately hostile to common AI-generated code
patterns. Roughly 700 rules are active on a TypeScript file. When lint fails,
the cause is almost always one of a few recurring groups — read
`references/rule-groups.md` before deciding how to respond.

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

Create `eslint.config.mjs` and spread only the layers you need. Order does not
matter — the layers are self-contained and each declares its own `files` scope.

```js
import shaunburdick from 'eslint-config-shaunburdick';

export default [
    ...shaunburdick.config.js,     // base JS — always required
    ...shaunburdick.config.ts,      // TypeScript rules (**/*.ts)
    ...shaunburdick.config.react,   // React + a11y
];
```

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

**Known gap:** the `ts` layer targets `**/*.ts` only, so `.tsx` files receive
neither the type-aware `@typescript-eslint` rules nor project service type
information. `llm-core`'s type-aware rules still work on `.tsx`; the
`@typescript-eslint` ones (including `no-floating-promises` and
`no-misused-promises`) silently do not. Add `...shaunburdick.config.ts` after
narrowing its `files` yourself if you need that coverage.

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

`references/rule-groups.md` maps each group to what it is actually protecting
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

The `shaunburdick/max-inline-disables` rule (default `max: 2`) enforces an
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

## Upgrading across a major version

Major versions of this config only ship for breaking rule changes. Read the
`CHANGELOG.md` entry for the version you are crossing before upgrading — each
one names the rules added, relaxed, or disabled and why. v10.0.0, for example,
adopted the full `unicorn` and `llm-core` recommended sets (~360 new rules) and
disabled five `unicorn` rules that conflicted with the config's own policies.

Expect new errors on upgrade. That is the point of a major bump, not a
regression. Do not suppress your way through it — fix, or override in config
with a stated reason.

## Biome companion

`biome-config-shaunburdick` ports the subset of rules Biome 2.5 supports. Use
it as an alternative to the ESLint config, not alongside it:

```json
{
    "extends": ["biome-config-shaunburdick"]
}
```

It ships as a single `biome.jsonc` by design: Biome 2.5 drops `linter` sections
from transitive `extends` inside published packages, so the three layers cannot
be split across files.

**No Biome equivalent** for: JSDoc rules, the `security` plugin, promise
discipline (`always-return`, `catch-or-return`), all `llm-core` guardrails, the
naming denylist and `id-length`, and the custom `max-inline-disables` rule. If
you rely on those, use the ESLint config.

## Reference files

- `references/rule-groups.md` — every rule group, what it protects against,
  and how to fix the most common findings
- `references/biome-mapping.md` — ESLint-to-Biome rule mapping and known gaps
