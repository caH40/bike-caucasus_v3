import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import unusedImports from 'eslint-plugin-unused-imports';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextCoreWebVitals,

  // Замена удалённого .eslintignore.
  { ignores: ['src/documents/**'] },

  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'react-hooks/set-state-in-effect': 'warn', // долг миграции на React Compiler
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-template-curly-in-string': 'error',
      curly: ['error', 'all'],
    },
  },

  // В .js/.jsx работает базовое правило ESLint.
  {
    files: ['**/*.{js,jsx,mjs}'],
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // В TS базовое no-unused-vars даёт ложные срабатывания на типах —
  // оно выключается, вместо него TS-версия с тем же уровнем.
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
