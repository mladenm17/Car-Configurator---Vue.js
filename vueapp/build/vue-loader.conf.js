'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap
  const path = require('path')

module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config
      .module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        options.loaders.scss = options.loaders.scss.concat({
          loader: 'sass-resources-loader',
          options: {
            resources: path.resolve('../src/assets/hamburgers/hamburgers.scss'),
          },
        })
        return options
      })

    config
      .module
      .rule('scss')
      .use('sass-resources-loader')
      .loader('sass-resources-loader')
      .options({
        resources: path.resolve('../src/assets/hamburgers/hamburgers.scss'),
      })
  },
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
