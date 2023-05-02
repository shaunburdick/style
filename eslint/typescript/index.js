module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    plugins: ['@typescript-eslint', 'security', 'eslint-plugin-import', 'eslint-plugin-jsdoc'],
    extends: [
        'eslint:recommended',
        '../es6/rules',
        'plugin:@typescript-eslint/recommended',
        'plugin:security/recommended',
        './rules'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {}
};
