# Shaun's JS/TS Lint Rules

Rules for [eslint](https://github.com/eslint/eslint)
used in my personal Javascript (etc) development.

Package: [eslint-config-shaunburdick](https://www.npmjs.com/package/eslint-config-shaunburdick)

## Requirements

- **Node.js** >=20.19.0
- **ESLint** >=10

## Install

```sh
npm install --save-dev eslint@10 eslint-config-shaunburdick
```

Create an `eslint.config.mjs` file:

```js
import shaunburdick from 'eslint-config-shaunburdick';

export default [
    ...shaunburdick.config.js
];
```

### Additional Configurations

- *Typescript*: Additional rules for Typescript files
  - To install, add `...shaunburdick.config.ts`
- *React*: Additional rules for React
  - To install, add `...shaunburdick.config.react`

Example with all rules:

```js
import shaunburdick from 'eslint-config-shaunburdick';

export default [
    ...shaunburdick.config.js,
    ...shaunburdick.config.react,
    ...shaunburdick.config.ts
];
```

## Package Setup

To setup linting automatically, we recommend adding these script entries to your `package.json`:

```
"lint": "eslint .",
"lint:fix": "npm run lint -- --fix",
```

Then you can add `npm run lint` to your `test` script command to run it before any tests

TypeScript projects should pair the linter with the compiler:

```
"lint": "eslint . && tsc --noEmit",
"lint:fix": "eslint . --fix && tsc --noEmit"
```

ESLint does not validate autofix output. A fix that changes an expression's
*type* rather than its style can pass `eslint . --fix && eslint .` and still
fail `tsc` — only the compiler sees the difference.

## Versioning Policy

-   Major (new linting errors)
    -   A new rule is added
    -   An existing rule is made more strict
    -   A new plugin is added to an existing config
    -   An existing plugin is updated to be more strict
-   Minor (same or fewer linting errors)
    -   A rule is removed
    -   An existing rule is made less strict
    -   Adding a new configuration
    -   An existing plugin is updated to be less strict
-   Patch (non-user-facing changes)
    -   Changes to documentation
    -   Fixes for build or publication
    -   Modifying tests

## Publish steps

Publishing is automated: once a version bump lands on `main`, CI compares `package.json` against
npm and publishes with provenance if the version is new, then creates a `vX.Y.Z` GitHub
release.

-   Checkout main (`git checkout main`)
-   Pull main (`git pull`)
-   Examine `CHANGELOG.md` to determine next version (X.Y.Z)
-   Bump `version` in `package.json` and merge to `main`
-   CI publishes the new version and cuts the release

## Agent Skill

[`eslint-config-shaunburdick`](<../.agents/skills/eslint-config-shaunburdick/SKILL.md>) is an
agent skill documenting install, setup, every rule group, and the graduated disable flow — so an
agent hitting an unfamiliar lint error knows what it protects against instead of reaching for a
suppression. It opens with a "when to use which" table pointing at the
[Biome skill](<../.agents/skills/biome-config-shaunburdick/SKILL.md>), since the two configs are
alternatives rather than companions.
