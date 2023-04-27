module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['security', 'eslint-plugin-import', 'eslint-plugin-jsdoc'],
    extends: ['eslint:recommended', 'plugin:security/recommended', './rules'],
    rules: {}
};
