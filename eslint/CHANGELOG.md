CHANGELOG
=========
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

