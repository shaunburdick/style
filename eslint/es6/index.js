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

/**
 * File globs for llm-core's general recommended block.
 *
 * Upstream ships only `.ts`, `.tsx`, `.js`, `.mjs`, and `.cjs` — omitting
 * `.jsx`, `.mjsx`, `.cjsx`, `.mts`, and `.cts` even though this config's React
 * layer explicitly lints jsx/mjsx/tsx. Without widening, a `.jsx` or `.mts`
 * file gets 9 of the guardrails instead of 42. This list matches the
 * extensions we actually ship for.
 */
const LLM_CORE_JS_FILES = [
    '**/*.js',
    '**/*.mjs',
    '**/*.cjs',
    '**/*.jsx',
    '**/*.mjsx',
    '**/*.cjsx',
    '**/*.ts',
    '**/*.tsx',
    '**/*.mts',
    '**/*.cts',
];

/**
 * File globs for llm-core's TypeScript-only block (`explicit-export-types`).
 * Kept off `.jsx` — a JSX file has no TypeScript annotations to require.
 */
const LLM_CORE_TS_FILES = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];

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
    //
    // Upstream's globs are widened (see LLM_CORE_JS_FILES) so `.jsx`/`.mts`/`.cts`
    // are not excluded from the guardrails the rest of this config applies to them.
    ...llmCore.configs.recommended.map((config, index) => ({
        ...config,
        name: `shaunburdick/llm-core:${index}`,
        files: config.files?.some(pattern => pattern.endsWith('.js'))
            ? LLM_CORE_JS_FILES
            : LLM_CORE_TS_FILES,
    })),
    // Relaxations applied on top of the recommended sets. NOTE: this block has
    // no `files` key, so every override here applies to *every* file, not just
    // config files. That is deliberate — adding a `files` key to scope one of
    // them would narrow the other three too, and this block used to disable
    // shaunburdick/max-inline-disables for every consumer file as a side effect.
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
        }
    },
    // Bypass max-inline-disables for config files, which are inherently
    // exemption-heavy: an ESLint flat config legitimately needs one disable per
    // rule it relaxes. Scoped to `*.config.*` so the graduated disable flow
    // still applies to application source — this used to live in the unscoped
    // block above, which silently killed the rule for everyone.
    {
        name: 'shaunburdick/js-config-files',
        files: ['**/*.config.{js,mjs,cjs,ts,mts,cts}'],
        rules: {
            'shaunburdick/max-inline-disables': 'off',
        }
    },
    // sonarjs/no-duplicate-string counts every literal occurrence, but test
    // files legitimately repeat a selector or query at each assertion site —
    // extracting it adds indirection with no behavior to keep in sync. The
    // upstream rule offers only `threshold`/`ignoreStrings` (no `ignoreTests`),
    // so the exemption is scoped here. Globs mirror TEST_FILE_PATTERNS in
    // custom-rules.js so both families agree on what counts as a test.
    // See issue #13.
    {
        name: 'shaunburdick/js-test-files',
        files: [
            '**/__tests__/**',
            '**/test/**',
            '**/tests/**',
            '**/spec/**',
            '**/specs/**',
            '**/*.test.{js,mjs,cjs,jsx,mjsx,cjsx,ts,tsx,mts,cts}',
            '**/*.spec.{js,mjs,cjs,jsx,mjsx,cjsx,ts,tsx,mts,cts}',
        ],
        rules: {
            'sonarjs/no-duplicate-string': 'off',
        }
    }
];
