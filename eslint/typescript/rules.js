// @ts-check
/* eslint-disable @stylistic/max-len */

/** @type import('typescript-eslint').ConfigWithExtends['rules'] */
export default Object.freeze({
    // Requires using either T[] vs Array<T> for arrays,
    // https://typescript-eslint.io/rules/array-type
    '@typescript-eslint/array-type': [
        'error',
        {
            default: 'array',
        },
    ],

    // enforce dot notation whenever possible,
    // https://typescript-eslint.io/rules/dot-notation
    '@typescript-eslint/dot-notation': ['error'],

    // Require explicit accessibility modifiers on class properties and methods,
    // https://typescript-eslint.io/rules/explicit-member-accessibility
    '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
            accessibility: 'explicit',
        },
    ],

    // Require a consistent member declaration order,
    // https://typescript-eslint.io/rules/member-ordering
    '@typescript-eslint/member-ordering': [
        'error',
        {
            default: [
                // Pulled from v5.47.0 default config
                // https://typescript-eslint.io/rules/member-ordering/#default-configuration

                // Index signature
                'signature',
                'call-signature',

                // Fields
                'public-static-field',
                'protected-static-field',
                'private-static-field',
                '#private-static-field',

                'public-decorated-field',
                'protected-decorated-field',
                'private-decorated-field',

                'public-instance-field',
                'protected-instance-field',
                'private-instance-field',
                '#private-instance-field',

                'public-abstract-field',
                'protected-abstract-field',

                'public-field',
                'protected-field',
                'private-field',
                '#private-field',

                'static-field',
                'instance-field',
                'abstract-field',

                'decorated-field',

                'field',

                // Static initialization
                'static-initialization',

                // Constructors
                'public-constructor',
                'protected-constructor',
                'private-constructor',

                'constructor',

                // Keeping get and set at the same level provides harmony with the
                // @typescript-eslint/adjacent-overload-signatures rule.
                ['get', 'set'],

                // Getters
                // "public-static-get",
                // "protected-static-get",
                // "private-static-get",
                // "#private-static-get",

                // "public-decorated-get",
                // "protected-decorated-get",
                // "private-decorated-get",

                // "public-instance-get",
                // "protected-instance-get",
                // "private-instance-get",
                // "#private-instance-get",

                // "public-abstract-get",
                // "protected-abstract-get",

                // "public-get",
                // "protected-get",
                // "private-get",
                // "#private-get",

                // "static-get",
                // "instance-get",
                // "abstract-get",

                // "decorated-get",

                // "get",

                // Setters
                // "public-static-set",
                // "protected-static-set",
                // "private-static-set",
                // "#private-static-set",

                // "public-decorated-set",
                // "protected-decorated-set",
                // "private-decorated-set",

                // "public-instance-set",
                // "protected-instance-set",
                // "private-instance-set",
                // "#private-instance-set",

                // "public-abstract-set",
                // "protected-abstract-set",

                // "public-set",
                // "protected-set",
                // "private-set",
                // "#private-set",

                // "static-set",
                // "instance-set",
                // "abstract-set",

                // "decorated-set",

                // "set",

                // Methods
                'public-static-method',
                'protected-static-method',
                'private-static-method',
                '#private-static-method',

                'public-decorated-method',
                'protected-decorated-method',
                'private-decorated-method',

                'public-instance-method',
                'protected-instance-method',
                'private-instance-method',
                '#private-instance-method',

                'public-abstract-method',
                'protected-abstract-method',

                'public-method',
                'protected-method',
                'private-method',
                '#private-method',

                'static-method',
                'instance-method',
                'abstract-method',

                'decorated-method',

                'method',
            ],
        },
    ],

    // Not on by default?
    // Enforces naming conventions for everything across a codebase,
    // Uses default values, but adds PascalCase for Enums
    // https://typescript-eslint.io/rules/naming-convention
    '@typescript-eslint/naming-convention': [
        'error',
        {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
        },
        {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
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

    // Disallow empty functions,
    // https://typescript-eslint.io/rules/no-empty-function
    // disable base rule in favor of typescript
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['warn'],

    // Require Promise-like statements to be handled appropriately.
    // https://typescript-eslint.io/rules/no-floating-promises
    '@typescript-eslint/no-floating-promises': [
        'error',
        { ignoreVoid: true, ignoreIIFE: true },
    ],

    // Disallow Promises in places not designed to handle them.
    // https://typescript-eslint.io/rules/no-misused-promises
    '@typescript-eslint/no-misused-promises': ['error'],

    // Disallows invocation of require(),
    // https://typescript-eslint.io/rules/no-require-imports
    '@typescript-eslint/no-require-imports': ['error'],

    // Disallow variable declarations from shadowing variables declared in the outer scope,
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
    // disable base rule in favor of typescript
    // Removed apparently-unused 'hoist' option
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // Disallow the use of variables before they are defined,
    // https://typescript-eslint.io/rules/no-shadow
    // disable base rule in favor of typescript
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],

    // Prefer a ‘for-of’ loop over a standard ‘for’ loop if the index is only used to access the array being iterated,
    // https://typescript-eslint.io/rules/prefer-for-of
    '@typescript-eslint/prefer-for-of': ['error'],

    // Use function types instead of interfaces with call signatures,
    // https://typescript-eslint.io/rules/prefer-function-type
    '@typescript-eslint/prefer-function-type': ['error'],

    // Sets preference level for triple slash directives versus ES6-style import declarations,
    // https://typescript-eslint.io/rules/triple-slash-reference
    '@typescript-eslint/triple-slash-reference': [
        'error',
        {
            path: 'always',
            types: 'prefer-import',
            lib: 'always',
        },
    ],

    // Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter,
    // https://typescript-eslint.io/rules/unified-signatures
    '@typescript-eslint/unified-signatures': ['error'],

    // https://typescript-eslint.io/rules/consistent-type-definitions
    '@typescript-eslint/consistent-type-definitions': [
        'error',
        'interface',
    ],

    // https://typescript-eslint.io/rules/consistent-type-imports
    '@typescript-eslint/consistent-type-imports': ['error'],

    /*
        * Enabling non-null-assertion
        * Non-null Assertion prevents the code from being polluted with Type assertion: "as SomeType" or "as unknown as SomeType".
        * Use with caution in the following cases:
        *
        * - when dealing with APIs that return Data | undefined but in some cases,
        *   we know for sure the data is available. eg: new Map(['foo', 'bar']).get('foo')!
        * - Angular's Input sometimes won't have default value, these will be subjected to ESLint's no-initializer rule.
        *   "?:" adds "undefined" to the type but "!:" won't
        */
    // https://typescript-eslint.io/rules/no-non-null-assertion
    '@typescript-eslint/no-non-null-assertion': ['error'],

    // Enhanced TypeScript Rules
    // Prefer nullish coalescing over logical chaining, https://typescript-eslint.io/rules/prefer-nullish-coalescing
    '@typescript-eslint/prefer-nullish-coalescing': 'error',

    // Prefer optional chaining expressions, https://typescript-eslint.io/rules/prefer-optional-chain
    '@typescript-eslint/prefer-optional-chain': 'error',

    // Enforce strict boolean expressions in conditionals, https://typescript-eslint.io/rules/strict-boolean-expressions
    '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
            allowString: false,
            allowNumber: false,
            allowNullableObject: false,
        },
    ],

    // Require exhaustive checks for switch statements, https://typescript-eslint.io/rules/switch-exhaustiveness-check
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    // Disallow unnecessary conditionals, https://typescript-eslint.io/rules/no-unnecessary-condition
    '@typescript-eslint/no-unnecessary-condition': 'error',

    // Prefer readonly arrays and tuples, https://typescript-eslint.io/rules/prefer-readonly
    '@typescript-eslint/prefer-readonly': 'error',

    // Require returning awaited values in async functions, https://typescript-eslint.io/rules/return-await
    // disable base rule in favor of typescript
    'no-return-await': 'off',
    '@typescript-eslint/return-await': ['error', 'always'],

    // Enhanced Import Rules for TypeScript
    // Enforce consistent type import style, https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/consistent-type-specifier-style.md
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

    // included in @typescript-eslint:recommended
    // "@typescript-eslint/adjacent-overload-signatures": "error",
    // "@typescript-eslint/no-empty-interface": "error",
    // "@typescript-eslint/no-misused-new": "error",
    // "@typescript-eslint/no-namespace": "error",
    // "@typescript-eslint/no-this-alias": "error",
    // "@typescript-eslint/no-var-requires": "error",
    // "@typescript-eslint/prefer-namespace-keyword": "error",
    // '@typescript-eslint/no-explicit-any': ['error'],
    // '@typescript-eslint/indent': ['error'],
    // '@typescript-eslint/consistent-type-assertions': ['error'],
});
