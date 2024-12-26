export default Object.freeze({
    // consistent brace style for blocks, https://eslint.style/rules/default/brace-style
    '@stylistic/brace-style': ['error', '1tbs'],

    // Requires following curly brace conventions, https://eslint.org/docs/rules/curly
    curly: ['error'],

    // require the use of `===` and `!==`, https://eslint.org/docs/rules/eqeqeq
    eqeqeq: ['error'],

    // Require newline at end of file, https://eslint.style/rules/default/eol-last
    '@stylistic/eol-last': ['error'],

    // Enforce consistent line breaks inside function parentheses, https://eslint.style/rules/default/function-paren-newline
    '@stylistic/function-paren-newline': ['error', 'consistent'],

    // require `for-in` loops to include an `if` statement, https://eslint.org/docs/rules/guard-for-in
    'guard-for-in': ['error'],

    // disallow specified identifiers, https://eslint.org/docs/rules/id-denylist
    'id-denylist': [
        'error',
        'any',
        'Number',
        'number',
        'String',
        'string',
        'Boolean',
        'boolean',
        'Undefined',
        'undefined',
    ],

    // Reports if a resolved path is imported more than once
    // Replaces eslint version with one that allows separate type imports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md
    'no-duplicate-imports': 'off',
    'import/no-duplicates': ['error'],

    // Forbid the use of extraneous packages,
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['error'],

    // Prevent importing the submodules of other modules,
    // This is here to allowing more specific tree
    // shaking in Angular, add to user client
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-internal-modules.md
    // 'import/no-internal-modules': 'off',

    // Enforce a convention in module import order,
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    'import/order': [
        'error',
        {
            groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        },
    ],

    // enforce consistent indentation, https://eslint.style/rules/default/indent
    '@stylistic/indent': [
        'error',
        4,
        {
            // Allow Switch Case statements to be indented inside switch statements
            SwitchCase: 1,
        },
    ],

    // Reports invalid alignment of JSDoc Block asterisks,
    // https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-alignment
    'jsdoc/check-alignment': ['error'],

    // Reports invalid padding inside JSDoc blocks.
    // https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-indentation
    'jsdoc/check-indentation': 'off',

    // Enforces lines (or no lines) between tags,
    // https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/tag-lines.md#readme
    'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],

    // enforce consistent linebreak style, https://eslint.org/docs/rules/linebreak-style
    'linebreak-style': ['error', 'unix'],

    // enforce a maximum number of classes per file, https://eslint.org/docs/rules/max-classes-per-file
    'max-classes-per-file': ['error', 1],

    // enforce a maximum line length, https://eslint.style/rules/default/max-len
    // Ignore links and shorter width for comments
    '@stylistic/max-len': [
        'error',
        {
            code: 120,
            comments: 120,
            ignoreUrls: true,
        },
    ],

    // enforce or disallow parentheses when invoking
    // a constructor with no arguments,
    // https://eslint.style/rules/default/new-parens
    '@stylistic/new-parens': ['error'],

    // disallow the use of `alert`, `confirm`, and `prompt`, https://eslint.org/docs/rules/no-alert
    'no-alert': ['error'],

    // disallow bitwise operators, https://eslint.org/docs/rules/no-bitwise
    'no-bitwise': ['error'],

    // disallow the use of `arguments.caller` or `arguments.callee`,
    // https://eslint.org/docs/rules/no-caller
    'no-caller': ['error'],

    // disallow the use of `console`, https://eslint.org/docs/rules/no-console
    'no-console': ['error'],

    // disallow empty functions, https://eslint.org/docs/rules/no-empty-function
    'no-empty-function': ['error'],

    // disallow the use of `eval()`, https://eslint.org/docs/rules/no-eval
    'no-eval': ['error'],

    // disallow unnecessary calls to `.bind()`, https://eslint.org/docs/rules/no-extra-bind
    'no-extra-bind': ['error'],

    // disallow `this` keywords outside of classes or class-like objects,
    // https://eslint.org/docs/rules/no-invalid-this
    'no-invalid-this': ['error'],

    // disallow multiple empty lines, https://eslint.style/rules/default/no-multiple-empty-lines
    '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }],

    // disallow `new` operators with the `Function` object, https://eslint.org/docs/rules/no-new-func
    'no-new-func': ['error'],

    // disallow `new` operators with the
    // `String`, `Number`, and `Boolean` objects,
    // https://eslint.org/docs/rules/no-new-wrappers
    'no-new-wrappers': ['error'],

    // disallow unnecessary `return await`, https://eslint.org/docs/rules/no-return-await
    'no-return-await': ['error'],

    // disallow comma operators, https://eslint.org/docs/rules/no-sequences
    'no-sequences': ['error'],

    // disallow variable declarations from shadowing
    // variables declared in the outer scope,
    // https://eslint.org/docs/rules/no-shadow
    'no-shadow': ['error'],

    // disallow template literal placeholder syntax in regular strings,
    // https://eslint.org/docs/rules/no-template-curly-in-string
    'no-template-curly-in-string': ['error'],

    // disallow throwing literals as exceptions, https://eslint.org/docs/rules/no-throw-literal
    'no-throw-literal': ['error'],

    // disallow trailing whitespace at the end of lines, https://eslint.style/rules/default/no-trailing-spaces
    '@stylistic/no-trailing-spaces': ['error'],

    // disallow the use of variables before they are defined, https://eslint.org/docs/rules/no-use-before-define
    'no-use-before-define': ['error'],

    // require `let` or `const` instead of `var`, https://eslint.org/docs/rules/no-var
    'no-var': ['error'],

    // Enforces consistent spacing inside braces,
    // https://eslint.style/rules/default/object-curly-spacing
    '@stylistic/object-curly-spacing': ['error', 'always'],

    // require or disallow method and property
    // shorthand syntax for object literals,
    // https://eslint.org/docs/rules/object-shorthand
    'object-shorthand': ['error'],

    // enforce variables to be declared either
    // together or separately in functions,
    // https://eslint.org/docs/rules/one-var
    'one-var': ['error', 'never'],

    // require `const` declarations for variables
    // that are never reassigned after declared,
    // https://eslint.org/docs/rules/prefer-const
    'prefer-const': ['error'],

    // disallow using Object.assign with an object
    // literal as the first argument
    // and prefer the use of object spread instead,
    // https://eslint.org/docs/rules/prefer-object-spread
    'prefer-object-spread': ['error'],

    // enforce the consistent use of either
    // backticks, double, or single quotes
    // https://eslint.style/rules/default/quotes
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],

    // enforce the consistent use of the radix argument when using `parseInt()`, https://eslint.org/docs/rules/radix
    radix: ['error'],

    // require or disallow semicolons instead of ASI, https://eslint.style/rules/default/semi
    '@stylistic/semi': ['error'],

    // Check other rule
    // enforce sorted import declarations within modules, https://eslint.org/docs/rules/sort-imports
    'sort-imports': ['off', { allowSeparatedGroups: true }],

    // enforce consistent spacing inside parentheses, https://eslint.style/rules/default/space-in-parens
    '@stylistic/space-in-parens': ['error', 'never'],

    // enforce consistent spacing after the `//` or `/*` in a comment, https://eslint.style/rules/default/spaced-comment
    '@stylistic/spaced-comment': [
        'error',
        'always',
        {
            markers: ['/'],
        },
    ],

    // overly strict security rules
    // false positive prone, https://github.com/nodesecurity/eslint-plugin-security/issues/21
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-fs-filename': 'off', // many false positives

    // Included in eslint:recommended
    // 'constructor-super': ['error'],
    // 'no-cond-assign': ['error'],
    // 'no-debugger': ['error'],
    // 'no-duplicate-case': ['error'],
    // 'no-redeclare': ['error'],
    // 'use-isnan': ['error'],
    // 'valid-typeof': 'off',
    // 'no-unsafe-finally': ['error'],
    // 'no-unused-labels': ['error'],
    // "no-unused-vars": "error",
    // 'no-sparse-arrays': ['error'],
    // 'no-empty': ['error'],
});
