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
    ...llmCore.configs.complexity,
    // Override complexity/hygiene defaults for config files that are inherently larger
    {
        name: 'shaunburdick/js-overrides',
        rules: {
            'llm-core/max-file-length': ['error', { max: 500 }],
            'llm-core/no-magic-numbers': ['error', {
                ignore: [0, 1, 2, 3, 4, 5, 10, 12, 15, 120],
                ignoreObjectProperties: true,
            }],
            // Bypass max-inline-disables for config files which may need exemptions
            'shaunburdick/max-inline-disables': 'off',
        }
    }
];
