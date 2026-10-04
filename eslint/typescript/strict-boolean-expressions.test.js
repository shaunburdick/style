/**
 * Integration tests for `@typescript-eslint/strict-boolean-expressions`.
 *
 * The rule's options are set in two places — `typescript/rules.js` for `.ts`
 * and the `.tsx` override block in `typescript/index.js` — and flat-config
 * option objects are *replaced*, not merged, by a later block, so a change in
 * one never reaches the other. Both blocks ship `allowNullableBoolean: true`
 * (issue #21): for `boolean | undefined`, `if (x)` maps `undefined` to `false`
 * exactly as `if (x === true)` and `if (x ?? false)` do, so refusing the
 * truthy form bought no safety — it only narrowed the choice to a spelling the
 * other enabled rule reported as redundant. `llm-core/no-redundant-logic` is now
 * off by default (11.3.0), so all three spellings are legal.
 *
 * Each fixture holds exactly one construct under test and is linted by the
 * published config (`../index.js`) inside a throwaway directory, so the
 * type-aware rules get a real TypeScript program — `RuleTester` cannot supply
 * one. Assertions count messages by rule id per fixture, which keeps them
 * independent of line numbers. Fixtures live outside the repository, so
 * `eslint .` never sees them; the guardrail fixtures (`nullable-string`,
 * `nullable-object`) are *expected* to fail and would break the self-lint.
 */

import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ESLint } from 'eslint';
import config from '../index.js';

/** The rule whose options changed for issue #21. */
const STRICT_BOOLEAN = '@typescript-eslint/strict-boolean-expressions';

/** The rule that contradicted it: syntactic, so it cannot see a nullable operand. */
const REDUNDANT_LOGIC = 'llm-core/no-redundant-logic';

/** Minimal strict project — the fixtures need type information, not a build. */
const TSCONFIG = JSON.stringify(
    {
        compilerOptions: {
            strict: true,
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            noEmit: true,
        },
        include: ['**/*.ts', '**/*.tsx'],
    },
    null,
    4
);

/** An interface declaring exactly one optional boolean, for the fixture bodies. */
const OPTIONAL_BOOLEAN = ['interface Command {', '    secret?: boolean;', '}'].join('\n');

/** Same shape with the optional field swapped for a nullable string. */
const OPTIONAL_STRING = ['interface Command {', '    label?: string;', '}'].join('\n');

/**
 * Fixture bodies, one construct each so a per-fixture count is unambiguous.
 * The `nullable-*` fixtures are the issue #21 repro spellings that must pass;
 * `nullable-string`/`nullable-object` are guardrails that must keep failing;
 * `explicit-comparison` pins the other half of the conflict.
 */
const FIXTURES = {
    'nullable-boolean.ts': [
        OPTIONAL_BOOLEAN,
        'export function hasSecret(command: Command | undefined): boolean {',
        '    if (command?.secret) {',
        '        return true;',
        '    }',
        '    return false;',
        '}',
    ].join('\n'),
    'nullable-boolean-filter.ts': [
        OPTIONAL_BOOLEAN,
        'export function withoutSecret(commands: Command[]): Command[] {',
        '    return commands.filter(command => !command.secret);',
        '}',
    ].join('\n'),
    // Basename must not collide with a `.ts` fixture: TypeScript's include
    // resolution drops a `.tsx` file when a `.ts` sibling shares its basename
    // (`test.ts` + `test.tsx` -> only `test.ts` joins the project, and the
    // project service then refuses to lint the other). Same quirk is why
    // `eslint/tsconfig.json` lists `test/test.tsx` in `files`.
    'nullable-boolean-component.tsx': [
        OPTIONAL_BOOLEAN,
        'export function hasSecret(command: Command | undefined): boolean {',
        '    if (command?.secret) {',
        '        return true;',
        '    }',
        '    return false;',
        '}',
    ].join('\n'),
    'nullable-string.ts': [
        OPTIONAL_STRING,
        'export function hasLabel(command: Command): boolean {',
        '    if (command.label) {',
        '        return true;',
        '    }',
        '    return false;',
        '}',
    ].join('\n'),
    'nullable-object.ts': [
        'interface Config {',
        '    verbose: boolean;',
        '}',
        'interface CommandWithConfig {',
        '    config?: Config;',
        '}',
        'export function hasConfig(command: CommandWithConfig): boolean {',
        '    if (command.config) {',
        '        return true;',
        '    }',
        '    return false;',
        '}',
    ].join('\n'),
    'explicit-comparison.ts': [
        OPTIONAL_BOOLEAN,
        'export function isSecret(command: Command | undefined): boolean {',
        '    if (command?.secret === true) {',
        '        return true;',
        '    }',
        '    return false;',
        '}',
    ].join('\n'),
};

describe('@typescript-eslint/strict-boolean-expressions on optional booleans (issue #21)', () => {
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
        sandbox = await mkdtemp(path.join(tmpdir(), 'shaunburdick-sbe-'));
        await writeFile(path.join(sandbox, 'tsconfig.json'), TSCONFIG);
        for (const [name, body] of Object.entries(FIXTURES)) {
            await writeFile(path.join(sandbox, name), `${body}\n`);
        }

        // The published config, spread in the documented order (js → react →
        // ts, see the README), so the layer order a consumer actually uses is
        // what gets exercised. The js layer carries llm-core, the ts layer
        // carries strict-boolean-expressions; no later layer restates them.
        const eslint = new ESLint({
            cwd: sandbox,
            overrideConfigFile: true,
            overrideConfig: [...config.config.js, ...config.config.react, ...config.config.ts],
        });
        const lintResults = await eslint.lintFiles(['**/*.ts', '**/*.tsx']);
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
                `${fixture} did not lint cleanly against the TypeScript program`
            );
        }
    });

    it('should allow a truthy read of an optional boolean in .ts', () => {
        assert.equal(countOf('nullable-boolean.ts', STRICT_BOOLEAN), 0);
        assert.equal(countOf('nullable-boolean.ts', REDUNDANT_LOGIC), 0);
    });

    it('should allow a truthy read of an optional boolean in .tsx', () => {
        // The .tsx override restates every option, so omitting the flag here
        // would leave the contradiction alive in components while fixing .ts.
        assert.equal(countOf('nullable-boolean-component.tsx', STRICT_BOOLEAN), 0);
        assert.equal(countOf('nullable-boolean-component.tsx', REDUNDANT_LOGIC), 0);
    });

    it('should allow the filter spelling that issue #21 could not satisfy', () => {
        assert.equal(countOf('nullable-boolean-filter.ts', STRICT_BOOLEAN), 0);
        assert.equal(countOf('nullable-boolean-filter.ts', REDUNDANT_LOGIC), 0);
    });

    it('should still reject a truthy read of an optional string', () => {
        assert.equal(countOf('nullable-string.ts', STRICT_BOOLEAN), 1);
    });

    it('should still reject a truthy read of an optional object', () => {
        assert.equal(countOf('nullable-object.ts', STRICT_BOOLEAN), 1);
    });

    it('should accept the explicit-comparison spelling too', () => {
        // Issue #21 left `x === true` reported by `llm-core/no-redundant-logic`
        // as the one spelling that had to stay. That rule is off by default as
        // of 11.3.0 — it reads syntax only, so it reported the comparison
        // without being able to see that the operand is nullable. With it off,
        // all three spellings are legal and the two-rule deadlock is gone rather
        // than merely narrowed.
        assert.equal(countOf('explicit-comparison.ts', REDUNDANT_LOGIC), 0);
        assert.equal(countOf('explicit-comparison.ts', STRICT_BOOLEAN), 0);
    });
});
