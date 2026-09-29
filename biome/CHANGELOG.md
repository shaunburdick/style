# Changelog

All notable changes to this package are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to the repository versioning policy (major = stricter enforcement, minor = relaxed rules,
patch = docs/tooling).

## [1.0.1] - 2026-09-29

### Changed

- Bumped `@biomejs/biome` devDependency 2.5.10 → 2.5.14 and migrated the `$schema` URL in
  `biome.jsonc` to match via `biome migrate`. No rule or formatter changes; the only schema
  difference is the version-pinned URL.

### Fixed

- Corrected the known-divergences list: 13 rules come from Biome's `nursery` group, not ~14.
  `noImportCycles` was listed as one of them but is a stable `suspicious` rule. Because nursery
  rules can change in a **minor** release, an over-stated list meant pinning guidance that didn't
  match the config.
- Replaced the "~91 of the ~124 enforceable rules" figure with the measured 164 unique rules, and
  noted that ~91 is the count of rules with an ESLint counterpart rather than the rule total. The
  `~124` denominator predates `eslint-config-shaunburdick` v10's adoption of the full `unicorn`
  and `llm-core` recommended sets, which took the ESLint side to ~675 active rules.

### Added

- New `biome-config-shaunburdick` agent skill at `.agents/skills/biome-config-shaunburdick/`,
  covering install, setup, the three layers, the nursery-rule stability risk, and the
  `biome migrate` pinning step. Split from the ESLint skill so it fires for Biome-only projects.

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
- Full rule-by-layer mapping with resolved thresholds lives in the
  [`biome-config-shaunburdick` agent skill](<../.agents/skills/biome-config-shaunburdick/SKILL.md>)

### Known gaps (ESLint-side only)

JSDoc linting, security plugin rules, promise discipline (`always-return`, `catch-or-return`),
llm-core guardrails, naming denylist/length, and the custom `shaunburdick/max-inline-disables`
rule have no Biome equivalent.
