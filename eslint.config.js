import reactNativeGlobals from 'eslint-plugin-react-native-globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactNativePlugin from 'eslint-plugin-react-native';

export default tseslint.config(
  // Базовые настройки
  {
    languageOptions: {
      globals: {
        ...reactNativeGlobals.environment,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Основные правила
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // React
  {
    plugins: {
      react: reactPlugin,
      'react-native': reactNativePlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off', // Не требуется с новым JSX
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'warn',
    },
  },

  // Кастомные правила
  {
    rules: {
      'indent': ['error', 2, { SwitchCase: 1 }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'always',
        'asyncArrow': 'always',
      }],
      'react/jsx-closing-tag-location': ['error', 'line-aligned'],
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'array-bracket-spacing': ['error', 'never'],
      'newline-before-return': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ no-explicit-any': 0,
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': false,
        'ts-nocheck': false,
        'ts-check': false,
      }],
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-use-before-declare': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-shadow': 'error',
      'no-extra-boolean-cast': 'off',
      // 'arrow-body-style': 'error',
      'arrow-parens': [
        'off',
        'as-needed',
      ],
      'capitalized-comments': 'off',
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
      'complexity': 'off',
      'constructor-super': 'error',
      'curly': 'error',
      'dot-notation': 'off',
      'eol-last': 'error',
      'eqeqeq': [
        'error',
        'smart',
      ],
      'guard-for-in': 'error',
      'id-blacklist': [
        'error',
        'any',
      ],
      'id-match': 'error',
      // 'ordered-imports': 'error',
      // 'import/order': ['error', {'alphabetize': true}],
      'max-classes-per-file': 'off',
      'max-len': [
        'error',
        {
          'code': 160,
        },
      ],
      'new-parens': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': 'error',
      'no-console': ['warn'],
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-eval': 'error',
      'no-fallthrough': 'off',
      'no-invalid-this': 'off',
      'no-multiple-empty-lines': 'error',
      'no-new-wrappers': 'error',
      'no-shadow': 'off',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef-init': 'error',
      'no-underscore-dangle': [
        'off',
      ],
      'no-unsafe-finally': 'error',
      'no-unused-expressions': 'error',
      'no-unused-labels': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'one-var': [
        'error',
        'never',
      ],
      'padding-line-between-statements': ['error'],
      'prefer-arrow/prefer-arrow-functions': 'off',
      'prefer-const': 'error',
      'quote-props': 'off',
      'radix': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'off',
      'padded-blocks': ['error', 'never'],
      'space-in-parens': ['error'],
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      'object-curly-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
      'space-before-blocks': ['error'],
      'space-infix-ops': ['error'],
      'space-unary-ops': ['error'],
      'spaced-comment': ['error', 'always', {
        'block': { 'balanced': true },
      }],
      'react/jsx-no-bind': ['error', {
        ignoreRefs: true,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false,
      }],
      'react/no-string-refs': ['error'],
      'react/self-closing-comp': ['error'],
      'react/jsx-tag-spacing': ['error', {
        'beforeClosing': 'never',
      }],
      'react/jsx-wrap-multilines': ['error', {
        'declaration': 'parens-new-line',
        'assignment': 'parens-new-line',
        'return': 'parens-new-line',
        'arrow': 'parens-new-line',
        'condition': 'parens-new-line',
        'logical': 'parens-new-line',
        'prop': 'parens-new-line',
      }],
      'react/jsx-closing-bracket-location': ['error', {
        'nonEmpty': 'after-props',
        'selfClosing': 'after-props',
      }],
      'react/jsx-first-prop-new-line': ['warn', 'multiline'],
    },
  },

  // Игнорируемые файлы
  {
    ignores: [
      '**/android/**',
      '**/ios/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/.expo/**',
    ],
  },
);
