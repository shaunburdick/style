# biome-config-shaunburdick

Shaun Burdick's [Biome](https://biomejs.dev) configuration — the fast, Rust-based companion to
[`eslint-config-shaunburdick`](https://github.com/shaunburdick/style/tree/main/eslint).

One `biome.json` provides linting, formatting, and import organization tuned to the same house
style: 4-space indent, 120-char lines, single quotes, semicolons.

Package: [biome-config-shaunburdick](https://www.npmjs.com/package/biome-config-shaunburdick)

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

## Package Setup

To setup linting automatically, we recommend adding these script entries to your `package.json`:

```
"lint": "biome check .",
"lint:fix": "npm run lint -- --write",
```

Then you can add `npm run lint` to your `test` script command to run it before any tests

### Recommended pairing

This config enables **164 unique rules**, ~91 of which correspond to a rule in `eslint-config-shaunburdick`
(measured against `biome.jsonc`; the rest are Biome-native `correctness`/`security` checks with no
ESLint counterpart). The rules that do have ESLint counterparts but are **not** ported
(JSDoc, security plugin, promise discipline, llm-core guardrails, the custom
`shaunburdick/max-inline-disables` rule) have **no Biome equivalent** and require keeping ESLint
alongside. The
[agent skill](<../.agents/skills/biome-config-shaunburdick/SKILL.md>) carries a layer-by-layer
breakdown of the port with each rule's resolved threshold.

## What's inside

| Layer | Glob | Highlights |
| --- | --- | --- |
| Base JS | all files | eqeqeq, no-var, prefer-const, complexity budgets (max 5 params, cognitive 15), no magic numbers, no console/alert/eval, import cycle detection |
| TypeScript | `**/*.{ts,tsx}` | strict TS rules ported from typescript-eslint strict: no-floating-promises, no-misused-promises, no-unnecessary-conditions, exhaustive switches, explicit member accessibility, interface definitions |
| React | `**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}` | full a11y suite, hooks deps (warn), button types, iframe sandbox, array index keys, plus the 15 service-worker globals Biome lacks natively |

Formatting is delegated to Biome's formatter (`indentStyle: space`, `indentWidth: 4`,
`lineWidth: 120`, single quotes); import ordering runs via the `organizeImports` assist action.

## Known divergences from the ESLint config

1. **Magic numbers are stricter** — Biome's `noMagicNumbers` has no ignore-list option; it flags
   3–5, 12, 15, 120 (which our llm-core config ignored) and exempts 24/60 (which we flagged).
2. **Promise discipline is thinner** — only nested promises are checked; `always-return`,
   `catch-or-return`, and `param-names` stay ESLint-only.
3. **No JSDoc, security-plugin, or llm-core coverage** — keep ESLint for those.
4. **`max-inline-disables` is impossible in Biome** — its GritQL plugin system cannot see comments.
5. **13 rules come from Biome's nursery** (unstable API): `noImpliedEval`, `useArraySome`, `useIncludes`,
   `useStringStartsEndsWith`, `noFloatingPromises`, `noMisusedPromises`, `useAwaitThenable`,
   `useExhaustiveSwitchCases`, `useNullishCoalescing`, `noJsxLeakedDollar`, `noJsxNamespace`,
   `useIframeSandbox`, and `useReactAsyncServerFunction` may move or change options in **minor**
   releases. Pin `@biomejs/biome` accordingly — the `>=2.5.0 <3` peer range will not protect you.

## Development

```bash
npm install
npm test          # validates biome.json + runs smoke tests against fixtures
```

Smoke tests live in [`test/`](test/) and assert that representative violations actually fire the
expected Biome rules, while a compliant fixture passes clean.

## Versioning Policy

-   Major (new linting errors)
    -   A new rule is added
    -   An existing rule is made more strict
    -   A new plugin is added to an existing config
    -   A existing plugin is updated to be more strict
-   Minor (same or fewer linting errors)
    -   A rule is removed
    -   An existing rules is made less strict
    -   Adding a new configuration
    -   A existing plugin is updated to be less strict
-   Patch (non-user-facing changes)
    -   Changes to documentation
    -   Fixes for build or publication
    -   Modifying tests

See [CHANGELOG.md](CHANGELOG.md) for the version history.

## Agent Skill

[`biome-config-shaunburdick`](<../.agents/skills/biome-config-shaunburdick/SKILL.md>) is an
agent skill covering install, setup, the three layers, the nursery-rule stability risk, and the
`biome migrate` pinning step — so an agent hitting an unfamiliar Biome diagnostic knows what it
protects against. It opens with a "when to use which" table pointing at the
[ESLint skill](<../.agents/skills/eslint-config-shaunburdick/SKILL.md>), since the two configs are
alternatives rather than companions.

## Publish steps

Publishing is automated: once a version bump lands on `main`, CI compares `package.json` against
npm and publishes with provenance if the version is new, then creates a `biome-vX.Y.Z` GitHub
release.

-   Checkout main (`git checkout main`)
-   Pull main (`git pull`)
-   Examine `CHANGELOG.md` to determine next version (X.Y.Z)
-   Bump `version` in `package.json` and merge to `main`
-   CI publishes the new version and cuts the release
