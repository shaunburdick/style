import js from '@eslint/js';
import security from 'eslint-plugin-security';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import stylistic from '@stylistic/eslint-plugin';
import importXPlugin, { flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import llmCore from 'eslint-plugin-llm-core';
import rules from './rules.js';
import customRules from './custom-rules.js';

export default [
    // Global linter options — applies to all files
    {
        linterOptions: {
            // Report unused eslint-disable comments (replaces deprecated
            // @eslint-community/eslint-comments/no-unused-disable)
            reportUnusedDisableDirectives: 'error',
        },
    },
    js.configs.recommended,
    comments.recommended,
    security.configs.recommended,
    importXFlatConfigs.recommended,
    // eslint-plugin-unicorn's recommended set. Must precede the
    // `shaunburdick/js` block so our explicit rules below win any conflict.
    unicorn.configs.recommended,
    {
        name: 'shaunburdick/js',
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module'
        },
        plugins: {
            security,
            jsdoc: jsdocPlugin,
            '@stylistic': stylistic,
            promise,
            sonarjs,
            unicorn,
            'import-x': importXPlugin,
            'llm-core': llmCore,
            'shaunburdick': {
                rules: customRules,
            },
        },
        rules
    },
    // eslint-plugin-llm-core's recommended set (complexity + typescript +
    // best-practices + style + hygiene). Type-aware members are re-applied to
    // .ts files by typescript/index.js, since this block has no type info.
    ...llmCore.configs.recommended,
    // Override complexity/hygiene defaults for config files that are inherently larger
    {
        name: 'shaunburdick/js-overrides',
        rules: {
            'llm-core/max-file-length': ['error', { max: 500 }],
            'llm-core/no-magic-numbers': ['error', {
                ignore: [0, 1, 2, 3, 4, 5, 10, 12, 15, 120],
                ignoreObjectProperties: true,
            }],
            // Our graduated disable flow permits 1-2 inline disables per file and
            // escalates beyond that, so llm-core's blanket ban is redundant.
            'llm-core/no-inline-disable': 'off',

            // Syntactic `||` -> `??` suggestion that false-positives on boolean
            // operands (`foo.includes(x) || foo.includes(y)`), where `??` is not
            // a valid substitute. TypeScript projects get the type-aware, correct
            // `@typescript-eslint/prefer-nullish-coalescing` from the ts config.
            'llm-core/prefer-nullish-coalescing': 'off',

            // Bypass max-inline-disables for config files which may need exemptions
            'shaunburdick/max-inline-disables': 'off',
        }
    }
];
