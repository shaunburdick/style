import js from '@eslint/js';
import security from 'eslint-plugin-security';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import stylistic from '@stylistic/eslint-plugin';
import importXPlugin, { flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import rules from './rules.js';

export default [
    js.configs.recommended,
    comments.recommended,
    security.configs.recommended,
    importXFlatConfigs.recommended,
    {
        name: 'shaunburdick/js',
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module'
        },
        plugins: {
            security,
            jsdoc: jsdocPlugin,
            '@stylistic': stylistic,
            promise,
            sonarjs,
            unicorn,
            'import-x': importXPlugin
        },
        rules
    }
];
