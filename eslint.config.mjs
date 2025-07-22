import config from '@rocketseat/eslint-config/react.mjs'

export default [
  ...config,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@stylistic/max-len': 'off',
    },
  },
]
