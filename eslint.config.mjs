import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
    overridesTypeAware: {
      'ts/strict-boolean-expressions': 'off',
    },
  },
}, {
  rules: {
    'vue/no-restricted-block': ['error', {
      element: 'style',
      message: 'Do not use <style> block in this project. Use TailwindCSS classes instead.',
    }],
  },
}))