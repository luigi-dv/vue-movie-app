import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': ['warn', { html: { void: 'always', normal: 'never', component: 'always' } }]
    }
  },
  {
    files: ['api/**/*.js', '*.config.js', 'e2e/**/*.js'],
    languageOptions: { globals: { ...globals.node } }
  },
  {
    files: ['**/*.spec.js', '**/*.test.js'],
    languageOptions: { globals: { ...globals.node } }
  }
]
