# Shaun's JS/TS Lint Rules

Rules for [eslint](https://github.com/eslint/eslint)
used in my personal Javascript (etc) development.

Package: [eslint-config-shaunburdick](https://www.npmjs.com/package/eslint-config-shaunburdick)

## Install

Install:

```sh
npm install --save-dev eslint@9 eslint-config-shaunburdick
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

## Publish steps

-   Checkout main (`git checkout main`)
-   Pull master (`git pull`)
-   Examine `CHANGELOG.md` to determine next version (X.Y.Z)
