/**
 * Integration tests for the three `llm-core` rules disabled in issue #24.
 *
 * These assert the *published* config rather than the upstream rules, since the
 * change under test is a severity, not a behaviour. Two things are checked, and
 * the second is what makes the first meaningful:
 *
 * 1. The resolved config carries severity `0` for all three, on `.ts` and `.js`
 *    alike. Severity is read back from `calculateConfigForFile` rather than
 *    inferred from findings, because llm-core's recommended set must be spread
 *    *before* the `shaunburdick/js` block for `rules.js` to win — and if that
 *    order ever regresses, an `llm-core/` entry in `rules.js` resolves back to
 *    `'error'` and fails silently. That mistake looks exactly like a working
 *    config, which is why it needs an assertion of its own.
 * 2. The same fixtures still fire when the three rules are forced back on. A
 *    bare "expect zero findings" assertion would also pass on a fixture that
 *    failed to parse or never contained the trigger; re-enabling proves the
 *    trigger is real and exercises the opt-in path a consumer would use.
 */

import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import config from '../index.js';

const DISABLED = {
    'llm-core/no-unknown-parameters': 'off',
    'llm-core/no-unsafe-dictionary-type': 'off',
    'llm-core/no-redundant-logic': 'off',
};

/**
 * Fixtures, one triggering shape each, so a per-fixture count is unambiguous.
 * `decoder.ts` is the architecture these rules cannot express: its whole job is
 * to take `unknown` and return a domain type.
 */
const FIXTURES = {
    'decoder.ts': [
        'export type Row = Record<string, unknown>;',
        '',
        'export function parseRunScope(raw: unknown): string | null {',
        '    if (typeof raw !== "object" || raw === null) {',
        '        return null;',
        '    }',
        '    return JSON.stringify(raw);',
        '}',
    ].join('\n'),
    'flagged.ts': [
        'export function isEnabled(flag: unknown): boolean {',
        '    return flag === true;',
        '}',
    ].join('\n'),
    // No trigger on purpose: it proves the `.js` glob reaches the same resolved
    // config without needing one.
    'passthrough.js': ['export function queueForRetry(body) {', '    return body;', '}'].join('\n'),
};

/**
 * Which disabled rule each fixture is expected to trigger when re-enabled.
 * `passthrough.js` is absent — see above.
 */
const EXPECTED_WHEN_RE_ENABLED = {
    'decoder.ts': ['llm-core/no-unknown-parameters', 'llm-core/no-unsafe-dictionary-type'],
    'flagged.ts': ['llm-core/no-redundant-logic'],
};

/**
 * Count one rule's findings in a lint result.
 *
 * @param {Map<string, object>} results - Results keyed by fixture filename.
 * @param {string} fixture - Fixture filename.
 * @param {string} ruleId - Rule id to count.
 * @returns {number} How many times the rule fired on that fixture.
 */
function countOf(results, fixture, ruleId) {
    const result = results.get(fixture);
    assert.ok(result, `no lint result for ${fixture}`);
    return result.messages.filter(message => message.ruleId === ruleId).length;
}

/**
 * Read one rule's numeric severity out of a resolved config.
 *
 * `calculateConfigForFile` normalises every severity to a number, so `off`
 * arrives as `0` — comparing against the string `'off'` would fail against the
 * very config this test exists to confirm.
 *
 * @param {object} resolvedFor - Resolved config for one file.
 * @param {string} ruleId - Rule id to read.
 * @returns {number} The resolved severity; `0` means off.
 */
function severityOf(resolvedFor, ruleId) {
    const entry = resolvedFor.rules[ruleId];
    assert.ok(entry !== undefined, `${ruleId} resolves to nothing — the block's files globs never matched`);
    const severity = Array.isArray(entry) ? entry.at(0) : entry;
    assert.ok(typeof severity === 'number', `${ruleId} resolved to ${JSON.stringify(entry)}, not a severity`);
    return severity;
}

/**
 * The parser the ts layer actually ships, reused rather than imported.
 *
 * `@typescript-eslint/parser` is only a transitive dependency here, so
 * importing it directly would need a new declared dependency for one test.
 * These three rules are purely syntactic and need a TS *parser* only — the
 * type-aware `projectService` in the ts layer would require a real program and
 * is deliberately not spread in.
 *
 * @returns {object} A parser accepting TypeScript syntax.
 */
function shippedTsParser() {
    const block = config.config.ts.find(entry => entry.languageOptions?.parser);
    assert.ok(block, 'the ts layer exposes no parser to reuse');
    return block.languageOptions.parser;
}

describe('llm-core rules disabled in issue #24', () => {
    /** Directory the fixtures are written to; removed in the `after` hook. */
    let sandbox = '';

    /** Findings from the published config, keyed by fixture filename. */
    const published = new Map();

    /** Findings with the three rules forced back on, keyed by fixture filename. */
    const reEnabledResults = new Map();

    /** Resolved config per fixture under the published config. */
    const resolved = new Map();

    /** Absolute path of a fixture inside the sandbox. */
    const fixturePath = name => path.join(sandbox, name);

    before(async () => {
        sandbox = await mkdtemp(path.join(tmpdir(), 'shaunburdick-llmcore-'));
        const names = Object.keys(FIXTURES);
        for (const name of names) {
            await writeFile(fixturePath(name), `${FIXTURES[name]}\n`);
        }

        const layers = [
            ...config.config.js,
            { files: ['**/*.ts'], languageOptions: { parser: shippedTsParser() } },
        ];
        const forcedOn = { rules: Object.fromEntries(Object.keys(DISABLED).map(id => [id, 'error'])) };
        const paths = names.map(name => fixturePath(name));

        const publishedRun = new ESLint({ cwd: sandbox, overrideConfigFile: true, overrideConfig: layers });
        const reEnabledRun = new ESLint({
            cwd: sandbox,
            overrideConfigFile: true,
            overrideConfig: [...layers, forcedOn],
        });

        const publishedResults = await publishedRun.lintFiles(paths);
        for (const result of publishedResults) {
            const name = path.basename(result.filePath);
            published.set(name, result);
            resolved.set(name, await publishedRun.calculateConfigForFile(result.filePath));
        }
        const reEnabledLint = await reEnabledRun.lintFiles(paths);
        for (const result of reEnabledLint) {
            reEnabledResults.set(path.basename(result.filePath), result);
        }
    });

    after(async () => {
        if (sandbox !== '') {
            await rm(sandbox, { recursive: true, force: true });
        }
    });

    it('should lint every fixture without a parse error', () => {
        for (const [fixture, result] of published) {
            const parseErrors = result.messages.filter(message => message.ruleId === null);
            assert.deepEqual(
                parseErrors.map(message => message.message),
                [],
                `${fixture} did not lint cleanly — a fixture that fails to parse makes every assertion below vacuous`
            );
        }
    });

    it('should resolve all three rules to off on a .ts file', () => {
        for (const ruleId of Object.keys(DISABLED)) {
            assert.equal(severityOf(resolved.get('decoder.ts'), ruleId), 0, `${ruleId} is not off for .ts`);
        }
    });

    it('should resolve all three rules to off on a .js file', () => {
        for (const ruleId of Object.keys(DISABLED)) {
            assert.equal(severityOf(resolved.get('passthrough.js'), ruleId), 0, `${ruleId} is not off for .js`);
        }
    });

    it('should report nothing for the decoder shapes', () => {
        for (const fixture of Object.keys(FIXTURES)) {
            for (const ruleId of Object.keys(DISABLED)) {
                assert.equal(countOf(published, fixture, ruleId), 0, `${ruleId} fired on ${fixture}`);
            }
        }
    });

    it('should still fire when the three rules are re-enabled', () => {
        for (const [fixture, ruleIds] of Object.entries(EXPECTED_WHEN_RE_ENABLED)) {
            for (const ruleId of ruleIds) {
                assert.ok(
                    countOf(reEnabledResults, fixture, ruleId) > 0,
                    `${ruleId} did not fire on ${fixture} even when enabled — the fixture carries no trigger, `
                        + 'so the assertions above prove nothing'
                );
            }
        }
    });
});
