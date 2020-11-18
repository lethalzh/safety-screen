/**
 * 接口module的门面
 */
const apiMap = {}


/* 加载modules下所有的接口文件 */
var moduleFiles = require.context('./modules', true, /\.js$/)
moduleFiles.keys().map(function(modulePath) {
    var moduleName = modulePath.substr(modulePath.lastIndexOf('/') + 1, modulePath.length - 5)
    var apis = moduleFiles(modulePath).default
    apiMap[moduleName] = apis
})
/**
 * 读取模块下的api配置对象
 * @param moduleName
 * @param apiName
 */
export function getApi(moduleName, apiName) {
    return apiMap[moduleName][apiName]
}
