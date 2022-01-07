// eslintrc.js file

module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },

  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['react', 'prettier']
};
