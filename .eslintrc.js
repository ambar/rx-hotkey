module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    // https://eslint.org/docs/rules/
    'eslint:recommended',
    // https://github.com/yannickcr/eslint-plugin-react
    'plugin:react/recommended',
    // https://www.npmjs.com/package/eslint-plugin-react-hooks
    'plugin:react-hooks/recommended',
    // https://github.com/benmosher/eslint-plugin-import
    'plugin:import/recommended',
    // https://github.com/prettier/eslint-plugin-prettier
    'plugin:prettier/recommended',
    // https://github.com/prettier/eslint-config-prettier
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
      },
      extends: [
        // https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
  rules: {
    // prefer ts
    'react/prop-types': 'off',
  },
  settings: {
    // https://github.com/yannickcr/eslint-plugin-react#configuration
    react: {
      version: '16',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
