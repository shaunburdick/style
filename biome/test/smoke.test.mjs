/**
 * Smoke tests for biome-config-shaunburdick.
 *
 * Each fixture is linted with the package's own biome.json. Violation fixtures
 * must exit non-zero AND emit diagnostics for every rule category asserted
 * below; the compliant fixture must exit clean. This proves the shipped
 * config parses, resolves every rule name, and actually enforces the ported
 * ESLint rules.
 */
import { execFile } from 'node:child_process';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

const run = promisify(execFile);

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const biomeBin = join(packageRoot, 'node_modules', '@biomejs', 'biome', 'bin', 'biome');
const fixturesDir = join(packageRoot, 'test', 'fixtures');

/**
 * Runs `biome lint` on a fixture and returns stdout/stderr plus the exit code.
 * @param {string} fixture - Fixture file name inside test/fixtures.
 * @returns {Promise<{code: number, output: string}>} Lint result.
 */
async function lintFixture(fixture) {
    try {
        const { stdout, stderr } = await run(process.execPath, [biomeBin, 'lint', join(fixturesDir, fixture)], {
            cwd: packageRoot,
        });
        return { code: 0, output: `${stdout}\n${stderr}` };
    } catch (error) {
        return { code: error.code ?? 1, output: `${error.stdout ?? ''}\n${error.stderr ?? ''}` };
    }
}

/** @param {string} output - Raw CLI output to scan. @param {string[]} categories - Rule categories that must appear. */
function assertCategoriesPresent(output, categories) {
    for (const category of categories) {
        assert.ok(output.includes(category), `expected diagnostic category "${category}" in output`);
    }
}

test('compliant fixture passes with zero findings', async () => {
    const { code, output } = await lintFixture('compliant.js');
    assert.equal(code, 0, `expected clean exit, got ${code}:\n${output}`);
});

test('base JS violations fire expected rules', async () => {
    const { code, output } = await lintFixture('violations.js');
    assert.notEqual(code, 0, 'violations.js must fail linting');
    assertCategoriesPresent(output, [
        'lint/suspicious/noVar',
        'lint/suspicious/noDoubleEquals',
        'lint/suspicious/noConsole',
        'lint/suspicious/noAlert',
        'lint/security/noGlobalEval',
        'lint/style/noMagicNumbers',
        'lint/suspicious/useGuardForIn',
        'lint/suspicious/noTemplateCurlyInString',
        'lint/complexity/noForEach',
        'lint/correctness/useParseIntRadix',
        'lint/style/noNestedTernary',
        'lint/suspicious/noEmptyBlockStatements',
        'lint/complexity/noArguments',
        'lint/suspicious/noBitwiseOperators',
        'lint/suspicious/noShadow',
    ]);
});

test('TypeScript override violations fire expected rules', async () => {
    const { code, output } = await lintFixture('violations.ts');
    assert.notEqual(code, 0, 'violations.ts must fail linting');
    assertCategoriesPresent(output, [
        'lint/suspicious/noExplicitAny',
        'lint/style/noNonNullAssertion',
        'lint/style/useConsistentMemberAccessibility',
        'lint/style/useConsistentTypeDefinitions',
        'lint/nursery/noFloatingPromises',
        'lint/nursery/useNullishCoalescing',
    ]);
});

test('React override violations fire expected rules', async () => {
    const { code, output } = await lintFixture('violations.tsx');
    assert.notEqual(code, 0, 'violations.tsx must fail linting');
    assertCategoriesPresent(output, [
        'lint/a11y/useAltText',
        'lint/a11y/noStaticElementInteractions',
        'lint/a11y/useButtonType',
        'lint/a11y/noAutofocus',
        'lint/security/noBlankTarget',
        'lint/suspicious/noArrayIndexKey',
    ]);
});
