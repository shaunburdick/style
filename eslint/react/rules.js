export default Object.freeze({
    // React Performance Rules
    // Disallow usage of Array index in keys, https://@eslint-react/kit/rules/no-array-index-key
    '@eslint-react/no-array-index-key': 'error',

    // Disallow unnecessary fragments, https://@eslint-react/kit/rules/jsx-no-useless-fragment
    '@eslint-react/jsx-no-useless-fragment': 'error',

    // Enforce self-closing components, https://eslint.style/rules/default/jsx-self-closing-comp
    '@stylistic/jsx-self-closing-comp': 'error',

    // Accessibility Rules - Essential for Web Compliance
    // Enforce alt text on images, https://github.com/jsx-eslint/jsx-a11y-x/blob/main/docs/rules/alt-text.md
    'jsx-a11y-x/alt-text': 'error',

    // Enforce anchor elements to contain accessible content, https://github.com/jsx-eslint/jsx-a11y-x/blob/main/docs/rules/anchor-has-content.md
    'jsx-a11y-x/anchor-has-content': 'error',

    // Enforce valid ARIA roles, https://github.com/jsx-eslint/jsx-a11y-x/blob/main/docs/rules/aria-role.md
    'jsx-a11y-x/aria-role': 'error',

    // Enforce keyboard event handlers on interactive elements, https://github.com/jsx-eslint/jsx-a11y-x/blob/main/docs/rules/click-events-have-key-events.md
    'jsx-a11y-x/click-events-have-key-events': 'error',

    // Enforce label elements have associated controls, https://github.com/jsx-eslint/jsx-a11y-x/blob/main/docs/rules/label-has-associated-control.md
    'jsx-a11y-x/label-has-associated-control': 'error',

    // Enforce autofocus is not used on elements, https://github.com/jsx-eslint/jsx-a11y-x/blob/main/docs/rules/no-autofocus.md
    'jsx-a11y-x/no-autofocus': 'error',

    // Enforce static elements do not have event handlers, https://github.com/jsx-eslint/jsx-a11y-x/blob/main/docs/rules/no-static-element-interactions.md
    'jsx-a11y-x/no-static-element-interactions': 'error',

    // Agentic Programming - React Security & DOM Rules
    // These rules target XSS and security issues AI coding agents frequently introduce.

    // Require rel="noopener noreferrer" on external links (security & performance),
    // AI frequently omits this when adding external link targets,
    // https://www.eslint-react.xyz/docs/rules/dom-no-unsafe-target-blank
    '@eslint-react/dom-no-unsafe-target-blank': 'error',

    // Require explicit sandbox attribute on iframes (security),
    // AI adds iframes without sandbox restrictions,
    // https://www.eslint-react.xyz/docs/rules/dom-no-missing-iframe-sandbox
    '@eslint-react/dom-no-missing-iframe-sandbox': 'warn',

    // Require explicit type attribute on button elements (accessibility),
    // AI creates `<button>` without `type="button"`,
    // https://www.eslint-react.xyz/docs/rules/dom-no-missing-button-type
    '@eslint-react/dom-no-missing-button-type': 'warn',
});
