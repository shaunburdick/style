// @ts-check

import tseslint from 'typescript-eslint';
import importXPlugin from 'eslint-plugin-import-x';
import rules from './rules.js';

export default tseslint.config(
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        name: 'shaunburdick/ts',
        files: ['**/*.ts'],
        languageOptions: {
            // ecmaVersion: 12,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'import-x': importXPlugin,
        },
        rules
    }
);
