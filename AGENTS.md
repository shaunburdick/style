# AGENTS.md - Repository Context for AI Assistants

This document provides comprehensive context about the `style` repository to help AI agents understand the codebase structure, purpose, and patterns.

## Repository Overview

**Repository Name:** `shaunburdick/style`
**Purpose:** Personal ESLint configuration package for JavaScript, TypeScript, and React development
**Package Name:** `eslint-config-shaunburdick`
**Current Version:** 11.3.0
**License:** UNLICENSED (Public Domain)

## Project Structure

```
/
├── LICENSE                           # Public domain license
├── README.md                         # Main repository documentation
├── .github/workflows/eslint.yml      # CI/CD pipeline for testing
└── eslint/                          # Main ESLint configuration package
    ├── package.json                 # Package configuration and dependencies
    ├── README.md                    # Package-specific documentation
    ├── CHANGELOG.md                 # Version history and changes
    ├── eslint.config.mjs            # Self-testing configuration
    ├── index.js                     # Main entry point - exports all configs
    ├── es6/                         # JavaScript/ES6 base configuration
    │   ├── index.js                 # ES6 config entry point
    │   ├── rules.js                 # ES6-specific ESLint rules (config + severity)
    │   ├── custom-rules.js          # Custom ESLint rule definitions
    │   └── custom-rules.test.js     # Tests for custom rules (co-located with source)
    ├── typescript/                  # TypeScript configuration
    │   ├── index.js                 # TypeScript config entry point
    │   └── rules.js                 # TypeScript-specific ESLint rules
    ├── react/                       # React configuration
    │   ├── index.js                 # React config entry point
    │   └── rules.js                 # React-specific ESLint rules
    └── test/                        # Pattern example files for self-linting
        ├── test.js                  # JavaScript pattern examples
        ├── test.ts                  # TypeScript pattern examples
        ├── test.tsx                 # React/TypeScript pattern examples
        └── test-utils.ts            # TypeScript utility examples
├── .agents/skills/                 # Agent Skills consumed by AI coding agents
│   ├── eslint-config-shaunburdick/
│   │   ├── SKILL.md                # Install, setup, and triage guidance
│   │   └── references/
│   │       └── rule-groups.md      # Every rule group + how to respond
│   └── biome-config-shaunburdick/
│       ├── SKILL.md                # Biome install, setup, nursery/pinning risk
│       └── references/
│           └── biome-mapping.md    # ESLint→Biome mapping + known gaps
├── biome/                           # Biome companion configuration package
│   ├── package.json                 # Package configuration (biome-config-shaunburdick)
│   ├── README.md                    # Usage docs + known gaps vs the ESLint config
│   ├── CHANGELOG.md                 # Version history
│   ├── biome.jsonc                  # Shareable config (JSONC): base JS + TS + React layers
│   └── test/                        # Smoke tests + violation/compliant fixtures
└── specs/                           # Feature planning artifacts (research, mappings)
    └── 001-biome-config/
        └── research.md              # Full ESLint→Biome rule-by-rule mapping analysis
```

## Configuration Architecture

The package uses **ESLint Flat Config** (ESLint 10+) format and provides three main configurations:

### 1. Base JavaScript/ES6 Config (`es6/`)
- **Entry Point:** `es6/index.js`
- **File Pattern:** All JavaScript files
- **Base Config:** `@eslint/js` recommended + security + import-x + **unicorn recommended (361 rules, 309 active)** + **llm-core recommended (44 rules, 39-40 active per extension)**
- **Deliberate `off` entries:** 6 unicorn rules and 5 llm-core rules are disabled. The unicorn six contradict this config's policies (React `Props` abbreviations, guard-clause style, graduated disable flow, boolean `||` false positives, `parseInt(id, 10)`, TypeScript-breaking autofixes). The llm-core five — `no-unknown-parameters`, `no-unsafe-dictionary-type`, `no-redundant-logic`, `no-inline-disable`, `prefer-nullish-coalescing` — are either architectural assumptions stated as per-node syntax errors, or superseded by a rule this config already enables. Each carries a rationale comment — see the skill's `references/rule-groups.md` for how to re-enable any of them
- **Layer order matters:** `unicorn.configs.recommended` and `llm-core.configs.recommended` are both spread *before* the `shaunburdick/js` block, so `rules.js` is the single place any of their rules are configured — flat config resolves last-one-wins, so a recommended set spread after that block would silently overwrite whatever `rules.js` says about its own rules. Keep it that way: any new plugin whose recommended set gets adopted must go above `shaunburdick/js`, not below. The failure mode is invisible — the entry looks right and lints clean. `es6/llm-core-disabled.test.js` guards it by reading severity back from `calculateConfigForFile` rather than inferring it from findings. Blocks *after* `shaunburdick/js` are only for `files`-scoped exceptions (`js-config-files`, `js-test-files`)
- **Key Plugins:**
  - `@stylistic/eslint-plugin` - Code formatting and style
  - `eslint-plugin-security` - Security vulnerability detection
  - `eslint-plugin-import-x` - Import/export best practices
  - `eslint-plugin-promise` - Promise handling
  - `eslint-plugin-sonarjs` - Code quality and complexity
  - `eslint-plugin-unicorn` - Modern JavaScript patterns (full recommended set since v10)
  - `eslint-plugin-jsdoc` - JSDoc documentation standards
  - `eslint-plugin-llm-core` - Agentic programming anti-pattern detection (file length, magic numbers, early returns, etc.)
- **Custom Rules:** `eslint-config-shaunburdick` ships a `shaunburdick` plugin namespace with inline-defined rules in `es6/custom-rules.js`:
  - `shaunburdick/max-inline-disables` — Warns when a file exceeds 2 inline `eslint-disable` comments, enforcing a graduated disable flow (single-line → block-level → config override). Enabled with `skipTestFiles: true`, and bypassed for `**/*.config.*` files by a separately scoped override block — a rule left in an unscoped override block silently dies
- **Widened llm-core globs:** upstream scopes `llm-core.configs.recommended` to `.js`/`.mjs`/`.cjs`/`.ts`/`.tsx` only, which would strand `.jsx`/`.mjsx`/`.cjsx`/`.mts`/`.cts` despite the React layer linting them. `es6/index.js` re-maps each block's `files` (detecting which is the general set by the presence of a `.js` glob) so every extension the config ships for gets the guardrails
- **Global Linter Options:**
  - `reportUnusedDisableDirectives: 'error'` — catches stale `eslint-disable` comments (replaces the deprecated `@eslint-community/eslint-comments/no-unused-disable` rule)

### 2. TypeScript Config (`typescript/`)
- **Entry Point:** `typescript/index.js`
- **File Pattern:** `**/*.{ts,tsx}` (`.tsx` receives React-idiom relaxations — PascalCase component names/imports, strings and numbers in JSX conditionals; `.mts`/`.cts` are not in scope)
- **Base Config:** `typescript-eslint` strict + stylistic
- **Key Features:**
  - Strict type checking
  - Member ordering enforcement
  - Explicit accessibility modifiers
  - TypeScript-specific naming conventions

### 3. React Config (`react/`)
- **Entry Point:** `react/index.js`
- **File Pattern:** `**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}`
- **Key Plugins:**
  - `@eslint-react/eslint-plugin` - React best practices
  - `eslint-plugin-react-hooks` - Hooks rules
  - `eslint-plugin-react-you-might-not-need-an-effect` - Effect optimization
  - `eslint-plugin-jsx-a11y-x` - Accessibility compliance
- **Browser Globals:** Includes service worker and browser globals

## Key Configuration Patterns

### Code Style Standards
- **Indentation:** 4 spaces
- **Line Length:** 120 characters (code and comments)
- **Brace Style:** 1TBS (one true brace style)
- **Quotes:** Enforced via stylistic rules
- **Line Endings:** Unix (LF)

### Import Organization
```javascript
// Order: builtin, external, parent, sibling, index
import fs from 'fs';              // builtin
import express from 'express';     // external
import '../parent';               // parent
import './sibling';               // sibling
import './';                      // index
```

### Naming Conventions
- **Forbidden identifiers:** `any`, `Number`, `String`, `Boolean`, `Undefined` (and lowercase variants)
- **TypeScript:** PascalCase for types, camelCase for variables
- **React:** PascalCase for components

### Security & Quality Rules
- Prevents use of dangerous patterns
- Enforces modern JavaScript practices
- No rule requires a JSDoc block on a function — `jsdoc/` only checks the
  formatting of blocks you write. Documenting every function is a convention,
  not a lint requirement
- Mandates accessibility standards for React

## Version History

See [`eslint/CHANGELOG.md`](eslint/CHANGELOG.md) for the full version history and breaking changes. Major milestones:

- **v11.0.0** — TS layer covers `.tsx` (React-idiom relaxations included); dropped `unicorn/no-instanceof-builtins` and `@eslint-react/web-api-no-leaked-event-listener`; test-file and spy exemptions; lint-script + `tsc` pairing docs
- **v10.0.0** — Adopted `unicorn` and `llm-core` recommended configs (~360 new rules); dependency refresh across majors
- **v9.0.0** — Graduated disable flow, `reportUnusedDisableDirectives`, custom `shaunburdick/max-inline-disables` rule
- **v8.0.0** — Agentic programming guardrails, `eslint-plugin-llm-core` integration, React DOM/web API security rules
- **v7.0.0** — ESLint 10 upgrade, plugin replacements (`@eslint-react`, `import-x`, `jsx-a11y-x`), TypeScript 6.0
- **v5.0.0** — Flat config overhaul with comprehensive plugin suite
- **v1.0.0** — Initial flat config release

## Biome Configuration Package (`biome/`)

A companion [Biome](https://biomejs.dev/) config (`biome-config-shaunburdick`) ports the
compatible subset of the ESLint rules to Biome 2.5+:

- **Layers:** base JS rules, `**/*.{ts,tsx}` override (typescript-eslint strict ports incl.
  native type-aware `noFloatingPromises`/`noMisusedPromises`), React override (full a11y suite +
  service-worker globals Biome lacks natively)
- **Style:** formatter owns formatting (4-space indent, 120-char lines, single quotes);
  `organizeImports` assist replaces `import-x/order`
- **Usage:** consumers add `"extends": ["biome-config-shaunburdick"]` to their own `biome.json`
- **Single-file by design:** Biome 2.5 drops `linter` sections from transitive `extends` inside
  published packages and does not resolve bare package subpaths in `extends`, so the three layers
  ship as one commented `biome.jsonc` (see research.md "Extends partitioning findings")
- **Known gaps:** JSDoc, security plugin, promise discipline (`always-return`,
  `catch-or-return`), llm-core guardrails, and the custom `max-inline-disables` rule have no
  Biome equivalent — see `.agents/skills/biome-config-shaunburdick/references/biome-mapping.md`
  for the living mapping table (`specs/001-biome-config/research.md` holds the original
  methodology and per-rule reasoning, but is dated and no longer authoritative for counts)
- **Testing:** `npm test` in `biome/` validates the config and runs smoke fixtures proving
  enabled rules fire

## Usage Patterns

### Basic JavaScript Project
```javascript
import shaunburdick from 'eslint-config-shaunburdick';
export default [...shaunburdick.config.js];
```

### Full Stack TypeScript + React Project
```javascript
import shaunburdick from 'eslint-config-shaunburdick';
export default [
    ...shaunburdick.config.js,
    ...shaunburdick.config.react,
    ...shaunburdick.config.ts
];
```

## Development & Testing

### Test Strategy
- **Self-Testing:** Package lints itself using its own configuration
- **Pattern Files:** Test files demonstrate correct coding patterns
- **Rule Tests:** Custom rules have unit tests using ESLint's `RuleTester` and Node.js `node:test` — tests live alongside their source (e.g., `es6/custom-rules.test.js` → `es6/custom-rules.js`)
- **CI/CD:** GitHub Actions tests on Node.js 22.x, 24.x, 26.x (all actions pinned by commit SHA for supply chain security)

### Package Scripts
```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "test": "npm run lint",
  "test:rules": "node --test es6/*.test.js"
}
```

## Dependencies & Peer Requirements

### Peer Dependencies
- `eslint: >=10` (ESLint 10+ required for flat config)
- `typescript` (optional, for TypeScript support)

### Key Dependencies
- `typescript-eslint` - TypeScript integration
- `@stylistic/eslint-plugin` - Code formatting
- `@eslint-react/eslint-plugin` - React support
- `eslint-plugin-security` - Security scanning
- `eslint-plugin-llm-core` - Agentic programming anti-pattern detection
- And 9+ other specialized plugins

## Maintenance Notes

### Versioning Policy
- **Major:** New rules, stricter enforcement, new plugins
- **Minor:** Removed/relaxed rules, new configurations
- **Patch:** Documentation, build fixes, test changes

### File Modification Guidelines
- **Rules files:** Use `Object.freeze()` for immutable exports
- **Index files:** Simple re-exports and plugin registration
- **Test files:** Demonstrate CORRECT patterns only
- **Documentation:** Keep README.md and CHANGELOG.md synchronized

### Common Tasks
1. **Adding new rule:** Update appropriate `rules.js` file
2. **Adding plugin:** Update `index.js` and `package.json`
3. **New configuration:** Create new folder structure
4. **Version bump:** Update `package.json`, add CHANGELOG entry
5. **Biome rule change:** Edit `biome/biome.jsonc`, update the mapping in `.agents/skills/biome-config-shaunburdick/references/biome-mapping.md` (the living reference — `specs/001-biome-config/research.md` is a dated point-in-time analysis), bump `biome/package.json` + CHANGELOG, and run `npm test` in `biome/`
6. **Adding custom rule:** Define the rule in `es6/custom-rules.js`, configure it in `es6/rules.js`, wire it in `es6/index.js`, test it in `es6/custom-rules.test.js`
7. **Plugin renames:** `import/` → `import-x/`, `react/` → `@eslint-react/`, `jsx-a11y/` → `jsx-a11y-x/` — old `eslint-disable` prefixes silently stop working
8. **Dependency update:** Bump the dep, run `npm test` in that package, fix any new violations in `test/` fixtures, and record a rule rename if one occurred. A dep bump that adds or tightens rules is a **major** version per the policy above
9. **Adopting a plugin's recommended config:** Put it in the relevant `index.js` *before* the `shaunburdick/*` rules block so explicit rules win conflicts, then reconcile the new findings — some rules in a recommended set will conflict with this config's policies and need an `'off'` with a rationale comment

## Context for AI Agents

When working on this repository:

1. **ESLint Knowledge Required:** Understand ESLint 10+ flat config format
2. **Plugin Architecture:** Each config is composable and standalone
3. **Testing Strategy:** Changes must pass self-linting; custom rules must have `RuleTester` tests alongside their source
4. **Documentation:** All rule additions should include rationale comments
5. **Backwards Compatibility:** Major version changes expected for new rules
6. **Performance Consideration:** Rule additions affect all users' build times
7. **Accessibility Focus:** React config emphasizes a11y compliance
8. **Security Priority:** Security rules are non-negotiable requirements
9. **Graduated Disable Flow:** Inline `eslint-disable` comments follow a graduated flow — 1-2 per file is fine, 3+ should use block-level pairs, and 3+ files with the same need should use a config override. The `shaunburdick/max-inline-disables` rule enforces the first threshold
10. **Custom Rules:** The `shaunburdick` plugin namespace (`es6/custom-rules.js`) contains rules defined inline for this project. Rule definitions live in `custom-rules.js`, configurations in `rules.js`, wiring in `index.js`, and tests in `custom-rules.test.js`
11. **Agent Skills:** `.agents/skills/eslint-config-shaunburdick/` documents install, setup, and rule-group triage for AI agents; `.agents/skills/biome-config-shaunburdick/` covers the Biome package's own setup, the nursery-rule stability risk, and `biome migrate` pinning. They are separate skills deliberately — skill selection keys off the frontmatter `name`, so a skill named `eslint-config-shaunburdick` will not fire for someone in a Biome-only project. Each opens with a "when to use which" table pointing at the other. Update them when rules are added, removed, or disabled; a new rule group or a change to the graduated disable flow makes the ESLint skill's guidance wrong. Both SKILL.md files carry a `metadata.version` in frontmatter that tracks the package version they document — bump it whenever the skill changes
12. **Shared versioning policy:** the policy in AGENTS.md is the single source of truth. `README.md`, `eslint/README.md`, and `biome/README.md` each restate it in expanded form — the three blocks are intentionally byte-identical, so a change to one must be made to all three
13. **TypeScript is pinned at 6.x on purpose:** TypeScript 7.0 ships no programmatic API, and `typescript-eslint` requires one for `projectService`-based type-aware linting. Do not bump to 7.x until `typescript-eslint` supports it

This is a foundational development tool used across multiple projects, so reliability and consistency are paramount.
