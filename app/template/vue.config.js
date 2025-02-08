import module from 'module'
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        options.compilerOptions = {
          ...options.compilerOptions,
          isCustomElement: (tag) => tag === 'line-chart' || tag === 'pie-chart'
        }
        return options
      })
  }
}
