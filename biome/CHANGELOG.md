# Changelog

All notable changes to this package are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to the repository versioning policy (major = stricter enforcement, minor = relaxed rules,
patch = docs/tooling).

## [1.0.0] - 2026-08-23

### Added

- Initial Biome 2.5 configuration ported from `eslint-config-shaunburdick` v9:
    - Base JS layer: ~41 linter rules plus formatter (4-space indent, 120-char lines, single
      quotes) and `organizeImports` assist
    - TypeScript layer (`**/*.{ts,tsx}`): ~31 rules ported from typescript-eslint strict,
      including native type-aware checks (`noFloatingPromises`, `noMisusedPromises`,
      `noUnnecessaryConditions`) that require no tsc
    - React layer: full a11y suite, hooks dependency checking, React security rules, and
      browser/service-worker globals
- Smoke test suite proving enabled rules fire on violation fixtures
- Full rule-by-rule ESLint→Biome mapping analysis in
  [`specs/001-biome-config/research.md`](../specs/001-biome-config/research.md)

### Known gaps (ESLint-side only)

JSDoc linting, security plugin rules, promise discipline (`always-return`, `catch-or-return`),
llm-core guardrails, naming denylist/length, and the custom `shaunburdick/max-inline-disables`
rule have no Biome equivalent.
