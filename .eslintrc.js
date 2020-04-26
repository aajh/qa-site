module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
        'airbnb-typescript'
    ],
    parserOptions: {
        project: './tsconfig.json'
    },
    rules: {
        "@typescript-eslint/indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "arrow-parens" : ["error", "as-needed"],
        "comma-dangle": "off",
        "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
        "jsx-a11y/label-has-associated-control": "off",
        "key-spacing": ["error", { "mode": "minimum" }],
        "@typescript-eslint/space-before-function-paren": "off",
        "no-param-reassign": "off",
        "import/no-cycle": "off",
        "no-else-return": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "react/jsx-indent-props": ["error", 4],
        "no-restricted-syntax": "off",
    },
};
