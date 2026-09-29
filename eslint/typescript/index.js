// @ts-check

import tseslint from 'typescript-eslint';
import importXPlugin from 'eslint-plugin-import-x';
import rules from './rules.js';

export default tseslint.config(
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        name: 'shaunburdick/ts',
        // `.tsx` included: without it the layer applied zero `@typescript-eslint`
        // rules to components (no `no-misused-promises` on async handlers), and
        // type-aware coverage silently vanished where React code lives.
        // `.mts`/`.cts` remain outside this scope. See issue #14.
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            // ecmaVersion: 12,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'import-x': importXPlugin,
        },
        rules
    },
    {
        // React-idiom relaxations scoped to `.tsx`. PascalCase component
        // names (`function Button()`, `const Button = ...`) and
        // `{nullableThing && <JSX/>}` conditionals are correct React, but the
        // `.ts`-oriented defaults in rules.js reject both — and options for a
        // rule are *replaced*, not merged, by a later block, so the full
        // option set is restated here with only the two selectors widened.
        name: 'shaunburdick/ts-tsx',
        files: ['**/*.tsx'],
        rules: {
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'default',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                {
                    // PascalCase: component constants (`const Button = ...`).
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                {
                    // PascalCase: function-declared components; camelCase
                    // keeps local helper functions honest.
                    selector: 'function',
                    format: ['camelCase', 'PascalCase'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                {
                    // PascalCase: `import React ...` default imports.
                    selector: 'import',
                    format: ['camelCase', 'PascalCase'],
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                {
                    selector: 'enumMember',
                    format: ['PascalCase'],
                },
            ],
            // `{title && <h1>{title}</h1>}` is idiomatic JSX; strings and
            // numbers (nullable or not) are expected in those conditionals.
            // Nullable *booleans* and objects stay strict — those still
            // signal a missing explicit check.
            '@typescript-eslint/strict-boolean-expressions': [
                'error',
                {
                    allowString: true,
                    allowNumber: true,
                    allowNullableString: true,
                    allowNullableNumber: true,
                    allowNullableObject: false,
                },
            ],
        },
    }
);
