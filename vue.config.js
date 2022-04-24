const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 解决控制台公网ip报错问题
  devServer: {
    host: '0.0.0.0',
  // https:true,
    port: 8080,
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // 代理跨域
    proxy: {
      '/api': {
        target:'http://39.98.123.211'
      }
    }
},

  transpileDependencies: true,
  // 关闭eslint校验功能
  lintOnSave:false
})
