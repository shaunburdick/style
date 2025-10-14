import js from '@eslint/js';
import security from 'eslint-plugin-security';
import jsdoc from 'eslint-plugin-jsdoc';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import promise from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import rules from './rules.js';

export default [
    js.configs.recommended,
    security.configs.recommended,
    importPlugin.flatConfigs.recommended,
    {
        name: 'shaunburdick/js',
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module'
        },
        plugins: {
            security,
            jsdoc,
            '@stylistic': stylistic,
            promise,
            sonarjs,
            unicorn
        },
        rules
    }
];
