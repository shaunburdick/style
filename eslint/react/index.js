import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import globals from 'globals';
import rules from './rules.js';

export default [
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        ...reactPlugin.configs.flat.recommended,
        ...reactPlugin.configs.flat['jsx-runtime'],
        ...reactHooks.configs['recommended-latest'],
        ...reactYouMightNotNeedAnEffect.configs.recommended,
        languageOptions: {
            ...reactPlugin.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },
        },
        rules
    }
];
