# Shaun's Lint Rules

Rules used in my personal development.

## Editor Config

Install by copying `.editorconfig` to the root of your source directory

## Javascript / Typescript

Shaun's JS/TS [ESLint](https://eslint.org/) Rules can be found in the [eslint](./eslint) directory

## Biome

A [Biome](https://biomejs.dev/) companion configuration (linting + formatting + import
organization) can be found in the [biome](./biome) directory. It ports the compatible subset of
the ESLint rules; see its [README](./biome/README.md) for usage and known gaps.

## Agent Skill

An [agent skill](./.agents/skills/eslint-config-shaunburdick/SKILL.md) documents how to install
and set up both configs, and maps every rule group to what it protects against — so an agent
hitting an unfamiliar lint error can tell what went wrong instead of reaching for a suppression.
Rule-group details are in its [references](./.agents/skills/eslint-config-shaunburdick/references/).

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
