import js from '@eslint/js';
import security from 'eslint-plugin-security';
import jsdoc from 'eslint-plugin-jsdoc';
import stylistic from '@stylistic/eslint-plugin';
import rules from './rules.js';

export default [
    js.configs.recommended,
    security.configs.recommended,
    {
        name: 'shaunburdick/js',
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module'
        },
        plugins: {
            security,
            jsdoc,
            '@stylistic': stylistic
        },
        rules
    }
];
