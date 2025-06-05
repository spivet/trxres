import antfu from '@antfu/eslint-config'

export default antfu({
  javascript: {
    overrides: {
      'prefer-promise-reject-errors': 'off',
      'no-console': 'warn',
    },
  },
})
