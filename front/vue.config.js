const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: `http://${process.env.VUE_APP_HOST_IP}:3000`
  }
})
