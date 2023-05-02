# Shaun's JS/TS Lint Rules

Rules for [eslint](https://github.com/eslint/eslint)
used in my personal Javascript (etc) development.

## Javascript (es6)

Install:

```sh
npm install --save-dev eslint@8 eslint-plugin-import@2 @shaunburdick/eslint-config
```

Create an .eslintrc.yml file with the following:

```yaml
env:
    browser: true
    commonjs: true
    es2021: true
extends:
    - "@shaunburdick"
parserOptions:
    ecmaVersion: 12
```

## TypeScript

Install:

```sh
npm install --save-dev eslint@8 eslint-plugin-import@2 @shaunburdick/eslint-config @typescript-eslint/parser@5 @typescript-eslint/eslint-plugin@5
```

Create an `.eslintrc.yml` file with the following:

```yaml
env:
    browser: true
    es2021: true
    node: true
extends:
    - "@shaunburdick/eslint-config/typescript"
parserOptions:
    ecmaVersion: 12
    sourceType: module
    project: ./tsconfig.json
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
