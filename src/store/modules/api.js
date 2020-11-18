// var baseUrl = '192.168.0.181:8010';
// var baseUrl = 'www.freelytime.com';
// const baseUrl ='safety.zl9c.cn:8014'
// const baseUrl ='192.168.0.185:8014'
// var baseUrl = '192.168.0.172:8010';
// var baseUrl = '192.168.0.121:8014';
// var baseUrl = 'safety.zl9c.cn:8014'
var baseUrl = process.env.NODE_ENV == 'development'?'safetydd.zl9c.cn:8014':(location.hostname + ':8014')
 
// var baseUrl = '121.36.173.25:8014';
export default {
    baseUrl: baseUrl
}
