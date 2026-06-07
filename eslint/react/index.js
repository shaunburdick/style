import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import jsxA11yX from 'eslint-plugin-jsx-a11y-x';
import globals from 'globals';
import rules from './rules.js';

export default [
    eslintReact.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-you-might-not-need-an-effect': reactYouMightNotNeedAnEffect,
            'jsx-a11y-x': jsxA11yX,
        },
        languageOptions: {
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...reactHooks.configs['recommended-latest'].rules,
            ...reactYouMightNotNeedAnEffect.configs.recommended.rules,
            ...jsxA11yX.configs.recommended.rules,
            ...rules,
        },
    },
];
