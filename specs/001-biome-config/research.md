# Research: Biome Companion Config (`biome/`)

Feature: [001-biome-config](.) · Branch: `001-biome-config` · Date: 2026-08-23
Target: Biome **2.5.10** (latest stable at time of writing)

## Methodology

1. Static analysis of every rule in `eslint/es6/rules.js`, `eslint/typescript/rules.js`, `eslint/react/rules.js`, plus config-level settings in the three `index.js` files.
2. Cross-reference against Biome's official ESLint sources table (biomejs.dev/linter/javascript/sources).
3. **Ground truth pass**: ran the official migrator (`biome migrate eslint --write --include-inspired --include-nursery`) against this repo's own flat config in a scratch workspace, then verified every candidate rule name/group with `biome explain` on the actual binary. No rule appears below unless its `lint/<group>/<rule>` category was machine-verified.

Migrator stats over our 382 configured ESLint rules: **45% fully covered**, 152 direct-migrated, 11 obsolete-by-formatter.

## Status Legend

| Mark | Meaning |
| --- | --- |
| ✅ | Ported — direct Biome equivalent, enabled in `biome.json` |
| 🔶 | Inspired-tier mapping (semantics looser than the ESLint original) |
| 🧪 | Nursery rule — unstable; may graduate/rename in minor releases |
| 🎨 | Enforced by the Biome **formatter**, not the linter |
| 📦 | Handled by the `organizeImports` **assist** action |
| ⚠️ | Partial — related rule covers a subset or superset |
| ❌ | No equivalent — stays ESLint-side |

---

## 1. Core JavaScript rules (`es6/rules.js`)

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `curly` | `style/useBlockStatements` | ✅ | |
| `eqeqeq` | `suspicious/noDoubleEquals` | ✅ | Both allow `== null` comparisons by default |
| `guard-for-in` | `suspicious/useGuardForIn` | ✅ | |
| `id-denylist` | — | ❌ | Banned identifiers (`any`, `Number`, …) unenforceable |
| `id-length` | — | ❌ | |
| `max-classes-per-file: 1` | `style/noExcessiveClassesPerFile {maxClasses:1}` | ✅ | |
| `max-depth: 4` | — | ❌ | |
| `max-params: 5` | `complexity/useMaxParams {max:5}` | ✅ | |
| `no-alert` | `suspicious/noAlert` | ✅ | |
| `no-bitwise` | `suspicious/noBitwiseOperators` | ✅ | |
| `no-caller` | — | ❌ | |
| `no-console` | `suspicious/noConsole` | ✅ | |
| `no-empty-function` | `suspicious/noEmptyBlockStatements` | ⚠️✅ | Superset: covers all empty blocks incl. functions |
| `no-eval` | `security/noGlobalEval` | ✅ | |
| `no-extra-bind` | — | ❌ | |
| `no-invalid-this` | — | ❌ | |
| `no-nested-ternary` | `style/noNestedTernary` | ✅ | |
| `no-new-func` | `nursery/noImpliedEval` | 🔶🧪 | Inspired mapping; also covers `setTimeout("…")` |
| `no-new-wrappers` | `style/useConsistentBuiltinInstantiation` | ✅ | |
| `no-return-await` | — | ❌ | Rule does not exist in 2.5.10; ESLint-side |
| `no-sequences` | `complexity/noCommaOperator` | ✅ | |
| `no-shadow` | `suspicious/noShadow` | ✅ | |
| `no-template-curly-in-string` | `suspicious/noTemplateCurlyInString` | ✅ | |
| `no-throw-literal` | `style/useThrowOnlyError` | 🔶 | |
| `no-useless-assignment` | — | ❌ | |
| `no-use-before-define` | `correctness/noInvalidUseBeforeDeclaration` | ⚠️ | TDZ errors only; function hoisting allowed (matches our intent) |
| `no-var` | `suspicious/noVar` | ✅ | |
| `object-shorthand` | `style/useConsistentObjectDefinitions` | 🔶 | |
| `one-var: never` | `style/useSingleVarDeclarator` | ⚠️ | One declarator per statement (not per scope) |
| `prefer-const` | `style/useConst` | ✅ | |
| `prefer-object-spread` | `style/useObjectSpread` | ✅ | |
| `radix` | `correctness/useParseIntRadix` | ✅ | |
| `prefer-destructuring` (objects) | `style/useDestructuring` | 🔶⚠️ | Applies to arrays too; no object-only option |
| `prefer-template` | `style/useTemplate` | ✅ | |
| `prefer-rest-params` | `complexity/noArguments` | ✅ | |
| `prefer-spread` | `style/useSpreadOverApply` | ⚠️ | `apply()` cases only |

## 2. Formatting rules (`@stylistic`) → formatter options

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `indent: 4, SwitchCase:1` | `formatter.indentStyle:"space", indentWidth:4` | 🎨 | Switch-case indent is the formatter's own opinion |
| `max-len: 120 ignoreUrls` | `formatter.lineWidth:120` | 🎨⚠️ | No URL exemption; long URLs may wrap |
| `quotes: single avoidEscape` | `javascript.formatter.quoteStyle:"single"` | 🎨⚠️ | Backticks still allowed where templates are required |
| `semi` | `javascript.formatter.semicolons:"always"` | 🎨 | |
| `eol-last` / `no-trailing-spaces` / `new-parens` | formatter defaults | 🎨 | Always enforced |
| `object-curly-spacing: always` | `javascript.formatter.bracketSpacing:true` | 🎨✅ | Direct equivalent |
| `brace-style: 1tbs` | — | 🎨⚠️ | Formatter's brace placement is Prettier-compatible (≈1tBS); not configurable |
| `space-in-parens: never` | — | 🎨⚠️ | Formatter never pads parens anyway — outcome matches |
| `function-paren-newline: consistent` | — | ❌ | Formatter owns line breaking |
| `spaced-comment` | — | ❌ | |
| `no-multiple-empty-lines: max 2` | — | ❌ | Formatter collapses to max 1 blank line |

## 3. Import rules (`import-x`)

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `order` (builtin/external/parent/sibling/index) | `assist.actions.source.organizeImports:"on"` | 📦⚠️ | Biome's grouping differs (url/package/alias…); sorted output is equivalent in spirit |
| `no-cycle` | `suspicious/noImportCycles` | ✅ | Multi-file analysis |
| `no-extraneous-dependencies` | `correctness/noUndeclaredDependencies` | ✅ | |
| `no-duplicates` | — | ❌ | Not in 2.5.10 |
| `no-self-import` | — | ❌ | |
| `no-useless-path-segments` | — | ❌ | |

## 4. JSDoc rules (`eslint-plugin-jsdoc`) — all ❌

`check-alignment`, `check-indentation`, `tag-lines`: Biome has no JSDoc linting whatsoever. Stays ESLint-side.

## 5. Promise rules (`eslint-plugin-promise`)

| ESLint | Biome | Status |
| --- | --- | --- |
| `always-return` | — | ❌ |
| `no-return-wrap` | — | ❌ |
| `param-names` | — | ❌ |
| `catch-or-return` | — | ❌ |
| `no-nesting` | `suspicious/noNestedPromises` | ✅ |

## 6. SonarJS rules

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `cognitive-complexity: 15` | `complexity/noExcessiveCognitiveComplexity {maxAllowedComplexity:15}` | ✅ | |
| `no-duplicate-string` | — | ❌ | |
| `no-duplicated-branches` | — | ❌ | |
| `no-identical-functions` | — | ❌ | |

## 7. Unicorn rules

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `consistent-function-scoping` | — | ❌ | |
| `expiring-todo-comments` | — | ❌ | No TODO-comment linting (`noTodoComments` does not exist) |
| `no-array-for-each` | `complexity/noForEach` | ✅ | |
| `no-await-expression-member` | — | ❌ | |
| `no-useless-spread` | — | ❌ | Does not exist in 2.5.10 |
| `no-useless-undefined` | `complexity/noUselessUndefined` | ✅ | |
| `prefer-array-some` | `nursery/useArraySome` | 🔶🧪 | |
| `prefer-includes` | `nursery/useIncludes` | 🔶🧪 | |
| `prefer-module` | — | ⚠️ | Only fragments port (`useImportType`, `noCommonJs` in TS layer) |
| `prefer-node-protocol` | `style/useNodejsImportProtocol` | ✅ | |
| `prefer-string-starts-ends-with` | `nursery/useStringStartsEndsWith` | 🔶🧪 | |
| `throw-new-error` | `style/useThrowNewError` | ✅ | |

## 8. llm-core rules — custom plugin, all ❌ except magic numbers

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `no-magic-numbers` (ignore `[0-5,10,12,15,120]`, objects) | `style/noMagicNumbers` (error) | ⚠️✅ | No options. Built-in ignores: 0,1,2,10,24,60, array indices, enum values, initializers, defaults, parseInt radix, object property values (= our `ignoreObjectProperties`). Drift: 3,4,5,12,15,120 now flagged; 24/60 extra-ignored. Accepted. |
| `max-file-length: 500` | — | ❌ | |
| `no-async-array-callbacks` | — | ⚠️ | `noForEach` covers the common case |
| `no-commented-out-code` | — | ❌ | |
| `no-empty-catch` | — | ⚠️ | `noEmptyBlockStatements` flags empty catch blocks |
| `no-llm-artifacts` | — | ❌ | |
| `no-swallowed-errors` | — | ❌ | |
| `prefer-early-return` | — | ❌ | |
| `throw-error-objects` | `style/useThrowOnlyError` | ⚠️🔶 | Same underlying mapping as `no-throw-literal` |

## 9. Security & comment policies

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `security/recommended` (minus 2 FP-prone rules) | — | ❌ | Only overlap is `no-eval`→`noGlobalEval` (already counted). Object injection / non-literal fs checks have no equivalent |
| `@eslint-community/eslint-comments/require-description` | — | ⚠️ | Biome suppressions *require* a reason syntactically (`// biome-ignore rule: reason`), so the intent is structurally enforced |
| `reportUnusedDisableDirectives: 'error'` | — | ⚠️ | Biome warns on unused suppressions via `--suppress` flow, not lint diagnostics |
| `shaunburdick/max-inline-disables` | — | ❌ | **Impossible**: GritQL plugins cannot match comments (trivia is ignored by design). Permanently ESLint-side |

## 10. TypeScript rules (`typescript/rules.js`)

Applied to `**/*.{ts,tsx}` via override.

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `array-type: array` | `style/useConsistentArrayType {syntax:"array"}` | ✅ | |
| `await-thenable` | `nursery/useAwaitThenable` | ✅🧪 | Native type inference — no tsc needed |
| `dot-notation` | `complexity/useLiteralKeys` | ⚠️ | Also enforces non-computed keys |
| `explicit-member-accessibility` | `style/useConsistentMemberAccessibility` | ✅ | |
| `member-ordering` | — | ❌ | |
| `naming-convention` | `style/useNamingConvention` | 🔶⚠️ | Far fewer knobs than typescript-eslint; defaults align (camelCase vars, PascalCase types) |
| `no-empty-function` (warn) | `suspicious/noEmptyBlockStatements` (warn in TS) | ⚠️✅ | |
| `no-floating-promises {ignoreVoid,ignoreIIFE}` | `nursery/noFloatingPromises` | ✅🧪⚠️ | No option granularity yet |
| `no-misused-promises` | `nursery/noMisusedPromises` | ✅🧪 | |
| `no-require-imports` | `style/noCommonJs` | ✅ | |
| `prefer-for-of` | `style/useForOf` | ✅ | |
| `prefer-function-type` | `style/useShorthandFunctionType` | ✅ | |
| `triple-slash-reference` | — | ❌ | |
| `unified-signatures` | `style/useUnifiedTypeSignatures` | ✅ | |
| `use-unknown-in-catch-callback-variable` | — | ❌ | |
| `unbound-method {ignoreStatic}` | — | ❌ | |
| `consistent-type-definitions: interface` | `style/useConsistentTypeDefinitions {declarations:"interface"}` | ✅ | |
| `consistent-type-imports` | `style/useImportType` | 🔶 | |
| `no-non-null-assertion` | `style/noNonNullAssertion` | ✅ | |
| `prefer-nullish-coalescing` | `nursery/useNullishCoalescing` | 🔶🧪 | |
| `prefer-optional-chain` | `complexity/useOptionalChain` | ✅ | |
| `strict-boolean-expressions` | — | ❌ | |
| `switch-exhaustiveness-check` | `nursery/useExhaustiveSwitchCases` | ✅🧪 | |
| `no-unnecessary-condition` | `suspicious/noUnnecessaryConditions` | 🔶 | |
| `no-unnecessary-type-assertion` | — | ⚠️ | Partially subsumed by `noUnnecessaryConditions` |
| `prefer-readonly` | `style/useReadonlyClassProperties` | ✅ | |
| `restrict-template-expressions` | — | ❌ | |
| `return-await: always` | — | ❌ | No equivalent in 2.5.10 |
| `import-x/consistent-type-specifier-style` | — | ⚠️ | `useImportType` covers type-only imports; top-level preference not configurable |

**Carried over from the typescript-eslint strict preset sweep** (active in our ESLint config via `strict`; migrated automatically): `suspicious/noExplicitAny`, `complexity/noBannedTypes`, `suspicious/noConfusingVoidType`, `suspicious/noTsIgnore`, `style/noNamespace`, `style/noInferrableTypes`, `suspicious/noDuplicateEnumValues`, `suspicious/noUnsafeDeclarationMerging`, `suspicious/noNonNullAssertedOptionalChain`, `suspicious/noExtraNonNullAssertion`, `style/useAsConstAssertion`, `style/useArrayLiterals`, `suspicious/useAdjacentOverloadSignatures`, `style/useLiteralEnumMembers`, `suspicious/noMisleadingInstantiator`.

## 11. React rules (`react/rules.js` + presets)

Applied to `**/*.{jsx,tsx,…}` via override with browser/service-worker globals.

| ESLint | Biome | Status | Notes |
| --- | --- | --- | --- |
| `dom-no-missing-button-type` (warn) | `a11y/useButtonType` (warn) | ✅ | |
| `dom-no-missing-iframe-sandbox` (warn) | `nursery/useIframeSandbox` (warn) | ✅🧪 | |
| `dom-no-unsafe-target-blank` | `security/noBlankTarget` | ✅ | |
| `jsx-no-useless-fragment` | `complexity/noUselessFragments` | ✅ | |
| `no-array-index-key` | `suspicious/noArrayIndexKey` | ✅ | |
| `@stylistic/jsx-self-closing-comp` | `style/useSelfClosingElements` | ✅ | |
| `alt-text` | `a11y/useAltText` | ✅ | |
| `anchor-has-content` | `a11y/useAnchorContent` | ✅ | |
| `aria-role` | `a11y/useValidAriaRole` | ✅ | |
| `click-events-have-key-events` | `a11y/useKeyWithClickEvents` | ✅ | |
| `label-has-associated-control` | `a11y/noLabelWithoutControl` | ✅ | |
| `no-autofocus` | `a11y/noAutofocus` | ✅ | |
| `no-static-element-interactions` | `a11y/noStaticElementInteractions` | ✅ | |
| react-hooks `exhaustive-deps` | `correctness/useExhaustiveDependencies` (warn) | ✅ | |
| @eslint-react preset sweep | `correctness/noChildrenProp` (warn), `suspicious/noReactForwardRef` (warn), `nursery/noJsxLeakedDollar` (warn), `nursery/noJsxNamespace`, `nursery/useReactAsyncServerFunction` | ✅ | Emitted by migration from the @eslint-react recommended preset our config extends |

## Scorecard

| Layer | Enabled in `biome.json` | Dropped (ESLint-side) |
| --- | --- | --- |
| Base JS | ~41 rules + formatter + assist | ~24 |
| TypeScript | ~31 rules | ~9 |
| React | ~19 rules | 0 |
| **Total** | **~91** | **~33** |

## Key Divergences (documented, accepted)

1. **Formatting opinions**: Biome's formatter replaces @stylistic wholesale; spacing/newline micro-rules without formatter knobs are gone (`spaced-comment`, `function-paren-newline`, `no-multiple-empty-lines`).
2. **Magic numbers**: stricter than our llm-core config (3–5, 12, 15, 120 flagged; 24/60 exempt).
3. **Promise discipline**: only nesting is checked; `always-return`/`catch-or-return` remain ESLint-only.
4. **JSDoc, security, llm-core, naming denylist**: zero coverage — consumers wanting them keep ESLint alongside.
5. **Nursery rules** (~14): may change or graduate in minor versions; pin Biome to `^2.5` and review release notes.
6. **Custom rule gap**: `shaunburdick/max-inline-disables` is architecturally impossible in Biome (GritQL cannot see comments).

## Sources

- https://biomejs.dev/linter/javascript/sources/ (official ESLint→Biome mapping)
- https://biomejs.dev/docs/ (formatter options, assists, overrides, GritQL plugins)
- Official migrator run against this repo's flat config (scratch workspace, Biome 2.5.10)
- `biome explain <rule>` verification of every rule category above
