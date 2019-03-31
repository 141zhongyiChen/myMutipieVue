// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    /* jquery */
    jquery: true
    /* jquery */
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 关闭自闭合标签检索
    "vue/no-parsing-error": [2, {"x-invalid-end-tag": false}],
    // terminalLightTime Array
    'no-array-constructor': 0,
    // 方法前 空格
    'space-before-function-paren': 0,
    // 驼峰命名
    'camelcase': 0,
    // 注释风格 空格
    'spaced-comment': 0,
    // new时加小括号
    'new-parens': 0,
    // 使用__proto__属性
    'no-proto': 0,
    // 使用new构造一个实例后不赋值
    'no-new': 0,
    //
    'no-useless-escape': 0,
    //
    'no-mixed-operators': 0
  }
}
