# biome-config-shaunburdick

Shaun Burdick's [Biome](https://biomejs.dev) configuration — the fast, Rust-based companion to
[`eslint-config-shaunburdick`](https://github.com/shaunburdick/style/tree/main/eslint).

One `biome.json` provides linting, formatting, and import organization tuned to the same house
style: 4-space indent, 120-char lines, single quotes, semicolons.

## Requirements

- Node.js >= 22
- `@biomejs/biome` >= 2.5 < 3 (peer dependency)

## Usage

Install the config and Biome:

```bash
npm install --save-dev @biomejs/biome biome-config-shaunburdick
```

Extend it from your project's `biome.json`:

```json
{
    "extends": ["biome-config-shaunburdick"]
}
```

Then run:

```bash
npx biome check .        # lint + format + organize imports
npx biome check --write . # autofix everything fixable
```

### Recommended pairing

This config ports ~91 of the ~124 enforceable rules from `eslint-config-shaunburdick`. The rest
(JSDoc, security plugin, promise discipline, llm-core guardrails, the custom
`shaunburdick/max-inline-disables` rule) have **no Biome equivalent** and require keeping ESLint
alongside. See the [full mapping table](../specs/001-biome-config/research.md) for the
rule-by-rule analysis.

## What's inside

| Layer | Glob | Highlights |
| --- | --- | --- |
| Base JS | all files | eqeqeq, no-var, prefer-const, complexity budgets (max 5 params, cognitive 15), no magic numbers, no console/alert/eval, import cycle detection |
| TypeScript | `**/*.{ts,tsx}` | strict TS rules ported from typescript-eslint strict: no-floating-promises, no-misused-promises, no-unnecessary-conditions, exhaustive switches, explicit member accessibility, interface definitions |
| React | `**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}` | full a11y suite, hooks deps (warn), button types, iframe sandbox, array index keys, plus browser/service-worker globals |

Formatting is delegated to Biome's formatter (`indentStyle: space`, `indentWidth: 4`,
`lineWidth: 120`, single quotes); import ordering runs via the `organizeImports` assist action.

## Known divergences from the ESLint config

1. **Magic numbers are stricter** — Biome's `noMagicNumbers` has no ignore-list option; it flags
   3–5, 12, 15, 120 (which our llm-core config ignored) and exempts 24/60 (which we flagged).
2. **Promise discipline is thinner** — only nested promises are checked; `always-return`,
   `catch-or-return`, and `param-names` stay ESLint-only.
3. **No JSDoc, security-plugin, or llm-core coverage** — keep ESLint for those.
4. **`max-inline-disables` is impossible in Biome** — its GritQL plugin system cannot see comments.
5. **~14 rules come from Biome's nursery** (unstable API): `noFloatingPromises`, `noMisusedPromises`,
   `useAwaitThenable`, `useExhaustiveSwitchCases`, `useNullishCoalescing`, `noImpliedEval`,
   `useArraySome`, `useIncludes`, `useStringStartsEndsWith`, `useIframeSandbox`, `noJsxLeakedDollar`,
   `noJsxNamespace`, `useReactAsyncServerFunction`, `noImportCycles` may move or change options in
   minor releases. Pin `@biomejs/biome` accordingly.

## Development

```bash
npm install
npm test          # validates biome.json + runs smoke tests against fixtures
```

Smoke tests live in [`test/`](test/) and assert that representative violations actually fire the
expected Biome rules, while a compliant fixture passes clean.

## Versioning

Follows the repo policy: major = stricter enforcement or new rules, minor = relaxed/removed rules,
patch = docs and tooling fixes. See [CHANGELOG.md](CHANGELOG.md).
