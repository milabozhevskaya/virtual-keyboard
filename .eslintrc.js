module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // 'import/extensions': ['error', 'always'],
    'import/prefer-default-export': 'off',
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "class-methods-use-this": ["error", { "exceptMethods": ["getLocalStorageData", "toLocalStorageData"]}]
    // "class-methods-use-this": ["error", { "exceptMethods": ["toJson", "fromJson"] }]
  },
};
