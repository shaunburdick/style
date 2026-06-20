# AGENTS.md - Repository Context for AI Assistants

This document provides comprehensive context about the `style` repository to help AI agents understand the codebase structure, purpose, and patterns.

## Repository Overview

**Repository Name:** `shaunburdick/style`
**Purpose:** Personal ESLint configuration package for JavaScript, TypeScript, and React development
**Package Name:** `eslint-config-shaunburdick`
**Current Version:** 9.0.0
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
```

## Configuration Architecture

The package uses **ESLint Flat Config** (ESLint 10+) format and provides three main configurations:

### 1. Base JavaScript/ES6 Config (`es6/`)
- **Entry Point:** `es6/index.js`
- **File Pattern:** All JavaScript files
- **Base Config:** `@eslint/js` recommended + security + import-x plugins
- **Key Plugins:**
  - `@stylistic/eslint-plugin` - Code formatting and style
  - `eslint-plugin-security` - Security vulnerability detection
  - `eslint-plugin-import-x` - Import/export best practices
  - `eslint-plugin-promise` - Promise handling
  - `eslint-plugin-sonarjs` - Code quality and complexity
  - `eslint-plugin-unicorn` - Modern JavaScript patterns
  - `eslint-plugin-jsdoc` - JSDoc documentation standards
  - `eslint-plugin-llm-core` - Agentic programming anti-pattern detection (file length, magic numbers, early returns, etc.)
- **Custom Rules:** `eslint-config-shaunburdick` ships a `shaunburdick` plugin namespace with inline-defined rules in `es6/custom-rules.js`:
  - `shaunburdick/max-inline-disables` — Warns when a file exceeds 2 inline `eslint-disable` comments, enforcing a graduated disable flow (single-line → block-level → config override)
- **Global Linter Options:**
  - `reportUnusedDisableDirectives: 'error'` — catches stale `eslint-disable` comments (replaces the deprecated `@eslint-community/eslint-comments/no-unused-disable` rule)

### 2. TypeScript Config (`typescript/`)
- **Entry Point:** `typescript/index.js`
- **File Pattern:** `**/*.ts`
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
- Requires JSDoc documentation
- Mandates accessibility standards for React

## Version History

See [`eslint/CHANGELOG.md`](eslint/CHANGELOG.md) for the full version history and breaking changes. Major milestones:

- **v9.0.0** — Graduated disable flow, `reportUnusedDisableDirectives`, custom `shaunburdick/max-inline-disables` rule
- **v8.0.0** — Agentic programming guardrails, `eslint-plugin-llm-core` integration, React DOM/web API security rules
- **v7.0.0** — ESLint 10 upgrade, plugin replacements (`@eslint-react`, `import-x`, `jsx-a11y-x`), TypeScript 6.0
- **v5.0.0** — Flat config overhaul with comprehensive plugin suite
- **v1.0.0** — Initial flat config release

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
5. **Adding custom rule:** Define the rule in `es6/custom-rules.js`, configure it in `es6/rules.js`, wire it in `es6/index.js`, test it in `es6/custom-rules.test.js`
6. **Plugin renames:** `import/` → `import-x/`, `react/` → `@eslint-react/`, `jsx-a11y/` → `jsx-a11y-x/` — old `eslint-disable` prefixes silently stop working

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

This is a foundational development tool used across multiple projects, so reliability and consistency are paramount.
