import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import rules from './rules.js';

export default [
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        ...reactPlugin.configs.flat.recommended,
        ...reactPlugin.configs.flat['jsx-runtime'],
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
