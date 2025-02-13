const mantineConfig = require('eslint-config-mantine/.prettierrc.js');
const config = {
  ...mantineConfig,
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  jsxSingleQuote: false,
  bracketSpacing: true,
};

module.exports = config;
