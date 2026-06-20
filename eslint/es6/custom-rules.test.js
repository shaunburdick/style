/**
 * Tests for the shaunburdick/max-inline-disables custom rule
 *
 * Validates the graduated disable flow:
 * - Files with 0-2 inline eslint-disable comments are clean
 * - Files with 3+ inline disables trigger a warning
 * - Block-level disable/enable pairs don't count toward the limit
 * - Custom max option overrides the default threshold
 */

import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import customRules from './custom-rules.js';

const RULE_NAME = 'max-inline-disables';
const rule = customRules[RULE_NAME];

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
});

// Shared test snippets — extracted to satisfy sonarjs/no-duplicate-string
const DISABLE_CONSOLE = '// eslint-disable-next-line no-console -- reason';
const DISABLE_ALERT = '// eslint-disable-next-line no-alert -- reason';
const DISABLE_DEBUG = '// eslint-disable-next-line no-debugger -- reason';
const LOG_A = 'console.log("a");';
const ALERT_B = 'alert("b");';

describe('shaunburdick/max-inline-disables', () => {
    it('should allow files with no eslint-disable comments', () => {
        ruleTester.run(RULE_NAME, rule, {
            valid: [
                'const x = 1;',
                'export function add(a, b) { return a + b; }',
            ],
            invalid: [],
        });
    });

    it('should allow files with 1-2 inline disables', () => {
        ruleTester.run(RULE_NAME, rule, {
            valid: [
                // 1 inline disable — under the limit
                [
                    '// eslint-disable-next-line no-console -- logging during development',
                    'console.log("test");',
                ].join('\n'),

                // 2 inline disables — at the limit
                [
                    '// eslint-disable-next-line no-console -- logging during development',
                    LOG_A,
                    '// eslint-disable-next-line no-alert -- user confirmation needed',
                    ALERT_B,
                ].join('\n'),
            ],
            invalid: [],
        });
    });

    it('should warn on files with 3+ inline disables (exceeds max of 2)', () => {
        const threeDisables = [
            DISABLE_CONSOLE,
            LOG_A,
            DISABLE_ALERT,
            ALERT_B,
            DISABLE_DEBUG,
            'debugger;',
        ].join('\n');

        ruleTester.run(RULE_NAME, rule, {
            valid: [],
            invalid: [
                {
                    code: threeDisables,
                    options: [{ max: 2 }],
                    errors: [
                        {
                            messageId: 'tooManyInline',
                            data: { count: '3', max: '2' },
                        },
                    ],
                },
            ],
        });
    });

    it('should not count block-level disable/enable pairs', () => {
        ruleTester.run(RULE_NAME, rule, {
            valid: [
                // Block-level pair with 1 inline disable — only 1 counts
                [
                    '/* eslint-disable no-console -- block-level suppression */',
                    LOG_A,
                    'console.log("b");',
                    '/* eslint-enable no-console */',
                    DISABLE_ALERT,
                    'alert("c");',
                ].join('\n'),
            ],
            invalid: [],
        });
    });

    it('should count eslint-disable-line as an inline disable', () => {
        const threeLineDisables = [
            'const a = 1; // eslint-disable-line no-console -- reason',
            'const b = 2; // eslint-disable-line no-alert -- reason',
            'const c = 3; // eslint-disable-line no-debugger -- reason',
        ].join('\n');

        ruleTester.run(RULE_NAME, rule, {
            valid: [],
            invalid: [
                {
                    code: threeLineDisables,
                    errors: [
                        {
                            messageId: 'tooManyInline',
                            data: { count: '3', max: '2' },
                        },
                    ],
                },
            ],
        });
    });

    it('should respect a custom max option', () => {
        const threeDisables = [
            DISABLE_CONSOLE,
            LOG_A,
            DISABLE_ALERT,
            ALERT_B,
            DISABLE_DEBUG,
            'debugger;',
        ].join('\n');

        ruleTester.run(RULE_NAME, rule, {
            valid: [
                // 3 inline disables but max is 5 — should pass
                {
                    code: threeDisables,
                    options: [{ max: 5 }],
                },
            ],
            invalid: [
                // 3 inline disables with max of 2 — should fail
                {
                    code: threeDisables,
                    options: [{ max: 2 }],
                    errors: [
                        {
                            messageId: 'tooManyInline',
                            data: { count: '3', max: '2' },
                        },
                    ],
                },
            ],
        });
    });
});
