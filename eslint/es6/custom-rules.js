/**
 * Custom ESLint rules for the shaunburdick JS config
 *
 * These rules are defined inline rather than imported from a plugin,
 * tailored specifically to this project's conventions.
 *
 * Following the standard plugin pattern where rules are exported as
 * a `rules` object keyed by rule name — mirrors how all ESLint
 * plugins structure their exports.
 */

/**
 * Path shapes that mark a file as a test file.
 *
 * Mirrors the `skipTestFiles` option that llm-core's own complexity rules use,
 * so the two families agree on what counts as a test. Test files legitimately
 * need many inline disables — they exist to construct invalid code.
 */
const TEST_FILE_PATTERNS = [
    /(^|\/)(__tests__|tests?|specs?)\//u,
    /\.(?:test|spec)\.[cm]?[jt]sx?$/u,
];

const maxInlineDisables = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce graduated inline disable flow — use block-level disables for 3+ occurrences per file',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    max: {
                        type: 'integer',
                        minimum: 0,
                    },
                    skipTestFiles: {
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            tooManyInline: [
                'Found {{ count }} inline eslint-disable comments (max {{ max }}).',
                'Use a block-level disable/enable pair for {{ max }}+ suppressions in the same file:',
                '',
                '  /* eslint-disable <rule> -- reason */',
                '  // ... all lines needing suppression',
                '  /* eslint-enable <rule> */',
            ].join('\n'),
        },
    },
    create(context) {
        const { max = 2, skipTestFiles = false } = context.options[0] ?? {};

        if (skipTestFiles && TEST_FILE_PATTERNS.some(pattern => pattern.test(context.filename))) {
            return {};
        }

        return {
            Program() {
                const { sourceCode } = context;
                const allComments = sourceCode.getAllComments();
                const inlineDisables = allComments.filter(commentNode => {
                    const text = commentNode.value.trim();

                    return text.includes('eslint-disable-next-line')
                        || text.includes('eslint-disable-line');
                });

                if (inlineDisables.length > max) {
                    context.report({
                        loc: inlineDisables[max].loc,
                        messageId: 'tooManyInline',
                        data: {
                            count: String(inlineDisables.length),
                            max: String(max),
                        },
                    });
                }
            },
        };
    },
};

/** @type {Record<string, import('eslint').Rule.RuleModule>} */
export default {
    'max-inline-disables': maxInlineDisables,
};
