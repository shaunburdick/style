import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import rules from './rules.js';

export default [
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
            'react-you-might-not-need-an-effect': reactYouMightNotNeedAnEffect,
            'jsx-a11y': jsxA11y,
        },
        languageOptions: {
            ...reactPlugin.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            ...reactPlugin.configs.flat.recommended.rules,
            ...reactPlugin.configs.flat['jsx-runtime'].rules,
            ...reactHooks.configs['recommended-latest'].rules,
            ...reactYouMightNotNeedAnEffect.configs.recommended.rules,
            ...jsxA11y.flatConfigs.recommended.rules,
            ...rules
        }
    }
];
