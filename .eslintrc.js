module.exports = {
  extends: [
    'mantine',
    'plugin:@next/next/recommended',
    'plugin:jest/recommended',
    'plugin:storybook/recommended',
  ],
  plugins: ['testing-library', 'jest'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-return-assign': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    eqeqeq: 'off',
    'no-case-declarations': 'off',
    'jsx-a11y/alt-text': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'prefer-destructuring': 'off',
    'prefer-regex-literals': 'off',
    'linebreak-style': 'off',
  },
  reportUnusedDisableDirectives: true,
};
