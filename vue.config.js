module.exports = {
    baseUrl: './',
    devServer: {
        port: 9806, // 端口
        watchOptions: {
            ignored: ['node_modules'],
            aggregateTimeout: 300,
            poll: 1500
        },
    },
    lintOnSave: false, // 取消 eslint 验证
    configureWebpack: {
        externals: {
            'AMap': 'AMap' // 高德地图配置
        }
    },
}