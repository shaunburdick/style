/**
 * Integration tests for the rule defaults changed in issue #24.
 *
 * These assert the *published* config rather than the upstream rules, because
 * every change here is a configuration choice — `checkUsedVariables`,
 * `checkFunctions`, `minimumDigits`, a file-scope exemption — so a rule-level
 * `RuleTester` would be testing unicorn rather than this package. Fixtures are
 * linted by `../index.js` inside a throwaway directory and assertions count
 * messages by rule id, which keeps them independent of line numbers. Fixtures
 * live outside the repository so `eslint .` never sees them.
 *
 * Every case pairs its suppression assertion with a control that must still
 * fire. Without the controls this suite would also pass against a rule switched
 * off wholesale — the failure mode a default change is best able to hide.
 */

import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import config from '../index.js';

const REEXPORT = 'unicorn/prefer-export-from';
const BOOLEAN_NAME = 'unicorn/consistent-boolean-name';
const SEPARATORS = 'unicorn/numeric-separators-style';
const TOP_LEVEL_ASSIGNMENT = 'unicorn/no-top-level-assignment-in-function';

/** Imported so both re-export fixtures resolve; not itself under test. */
const HELPER = 'export function helper(value) {\n    return value + 1;\n}\n';

/**
 * Fixture bodies, one construct each so a per-fixture count is unambiguous.
 * `reexport-unused`, `boolean-variable`, `bare-literal`, and `fixture-source`
 * are the controls: the opposite spelling that must still report.
 */
const FIXTURES = {
    'helper.js': HELPER,
    // Body reads `helper`, so the export cannot become an `export … from` without
    // duplicating the specifier. Must be silent.
    'reexport-used.js': [
        "import { helper } from './helper.js';",
        '',
        'export const wrapped = helper(1);',
        'export { helper };',
    ].join('\n'),
    // `helper` is a pure passthrough — the fix here is correct. Must still report.
    'reexport-unused.js': ["import { helper } from './helper.js';", '', 'export { helper };'].join('\n'),
    // A verb phrase is not a boolean state name. Must be silent.
    'boolean-function.js': 'export function appendConfigApplied() {\n    return true;\n}',
    // Genuine boolean state. The variable half of the rule stays on.
    'boolean-variable.js': 'export const present = true;',
    // Four digits is now where a separator is wanted. Must be silent.
    'grouped-literal.js': 'export const MILLIS = 1_000;',
    // The threshold moved to four, not away: an ungrouped four-digit literal reports.
    'bare-literal.js': 'export const MILLIS = 1000;',
};

/**
 * One body, two filenames: identical module-scope fixture built by a function,
 * linted once as product code and once as a test file. The exemption is scoped
 * to the filename, so the pair is the only way to show it is scoped.
 */
const FIXTURE_ASSIGNMENT = [
    'let tempRoot;',
    '',
    'export function setRoot(value) {',
    '    tempRoot = value;',
    '}',
].join('\n');

FIXTURES['fixture-source.js'] = FIXTURE_ASSIGNMENT;
FIXTURES['fixture.test.js'] = FIXTURE_ASSIGNMENT;

describe('rule defaults changed in issue #24', () => {
    /** Directory the fixtures are written to; removed in the `after` hook. */
    let sandbox = '';

    /** Lint results keyed by fixture filename. */
    const results = new Map();

    /**
     * Count one rule's findings in a fixture's lint result.
     *
     * @param {string} fixture - Fixture filename.
     * @param {string} ruleId - Rule id to count.
     * @returns {number} How many times the rule fired on that fixture.
     */
    function countOf(fixture, ruleId) {
        const result = results.get(fixture);
        assert.ok(result, `no lint result for ${fixture}`);
        return result.messages.filter(message => message.ruleId === ruleId).length;
    }

    before(async () => {
        sandbox = await mkdtemp(path.join(tmpdir(), 'shaunburdick-defaults-'));
        for (const [name, body] of Object.entries(FIXTURES)) {
            await writeFile(path.join(sandbox, name), `${body}\n`);
        }

        // Only the js layer: every rule under test is configured there, and the
        // exemption under test is a block in that layer's own config.
        const eslint = new ESLint({
            cwd: sandbox,
            overrideConfigFile: true,
            overrideConfig: config.config.js,
        });
        const lintResults = await eslint.lintFiles(['**/*.js']);
        for (const result of lintResults) {
            results.set(path.basename(result.filePath), result);
        }
    });

    after(async () => {
        if (sandbox !== '') {
            await rm(sandbox, { recursive: true, force: true });
        }
    });

    it('should lint every fixture without a parse error', () => {
        for (const [fixture, result] of results) {
            const parseErrors = result.messages.filter(message => message.ruleId === null);
            assert.deepEqual(
                parseErrors.map(message => message.message),
                [],
                `${fixture} did not lint cleanly`
            );
        }
    });

    it('should not report a re-export whose binding the body reads', () => {
        assert.equal(countOf('reexport-used.js', REEXPORT), 0);
    });

    it('should still report a re-export that is a pure passthrough', () => {
        assert.equal(countOf('reexport-unused.js', REEXPORT), 1);
    });

    it('should not require a boolean prefix on function names', () => {
        assert.equal(countOf('boolean-function.js', BOOLEAN_NAME), 0);
    });

    it('should still require a boolean prefix on variables', () => {
        assert.equal(countOf('boolean-variable.js', BOOLEAN_NAME), 1);
    });

    it('should accept a separator on a four-digit literal', () => {
        assert.equal(countOf('grouped-literal.js', SEPARATORS), 0);
    });

    it('should now require a separator on a four-digit literal', () => {
        assert.equal(countOf('bare-literal.js', SEPARATORS), 1);
    });

    it('should still report a module-scope fixture assignment in product code', () => {
        assert.equal(countOf('fixture-source.js', TOP_LEVEL_ASSIGNMENT), 1);
    });

    it('should exempt the same assignment in a test file', () => {
        assert.equal(countOf('fixture.test.js', TOP_LEVEL_ASSIGNMENT), 0);
    });
});
