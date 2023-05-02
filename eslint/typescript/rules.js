/* eslint-disable max-len */
module.exports = {
    rules: {
        // Requires using either T[] vs Array<T> for arrays,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/array-type.md
        '@typescript-eslint/array-type': [
            'error',
            {
                default: 'array',
            },
        ],

        // enforce dot notation whenever possible,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
        '@typescript-eslint/dot-notation': ['error'],

        // Require explicit accessibility modifiers on class properties and methods,
        // eslint-disable-next-line max-len
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
            },
        ],

        // Enforces consistent indentation.
        // https://typescript-eslint.io/rules/indent
        // Disable JS version
        indent: 'off',
        '@typescript-eslint/indent': [
            'error',
            4,
            {
                // Allow Switch Case statements to be indented inside switch statements
                SwitchCase: 1,
            },
        ],

        // Require a consistent member declaration order,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-ordering.md

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
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
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
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
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

        // off by default?
        // Disallow the use of parameter properties in class constructors,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-parameter-properties.md
        '@typescript-eslint/no-parameter-properties': 'off',

        // Disallows invocation of require(),
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-require-imports.md
        '@typescript-eslint/no-require-imports': ['error'],

        // Disallow variable declarations from shadowing variables declared in the outer scope,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
        // disable base rule in favor of typescript
        // Removed apparently-unused 'hoist' option
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],

        // Disallow the use of variables before they are defined,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
        // disable base rule in favor of typescript
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],

        // Prefer a ‘for-of’ loop over a standard ‘for’ loop if the index is only used to access the array being iterated,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-for-of.md
        '@typescript-eslint/prefer-for-of': ['error'],

        // Use function types instead of interfaces with call signatures,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-function-type.md
        '@typescript-eslint/prefer-function-type': ['error'],

        // Enforce the consistent use of either backticks, double, or single quotes,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/quotes.md
        // disable base rule in favor of typescript
        quotes: 'off',
        '@typescript-eslint/quotes': ['error', 'single'],

        // Sets preference level for triple slash directives versus ES6-style import declarations,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/triple-slash-reference.md
        '@typescript-eslint/triple-slash-reference': [
            'error',
            {
                path: 'always',
                types: 'prefer-import',
                lib: 'always',
            },
        ],

        // Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter,
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unified-signatures.md
        '@typescript-eslint/unified-signatures': ['error'],

        // Bans // tslint:<rule-flag> comments from being used
        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
        '@typescript-eslint/ban-tslint-comment': ['error'],

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-definitions.md
        '@typescript-eslint/consistent-type-definitions': [
            'error',
            'interface',
        ],

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-imports.md
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
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
        '@typescript-eslint/no-non-null-assertion': ['error'],

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
    },
};
