/**
 * 统一的请求对象
 */
import axios from 'axios'
import dayjs from 'dayjs'
import md5 from 'js-md5'
import ResponseData from './ResponseData'
import { getState, setState } from "@/store";
import { getApi } from "./ApiFactory.js";
const CancelToken = axios.CancelToken;

export default class HttpRequest {
    constructor(cancel) {
        this.cancel = cancel
    }
    /* 中断请求 */
    requestAbort() {
        if(this.cancel){
            this.cancel();
        }
    }
    /**
     * 请求api
     * @param module
     * @param api
     * @param post
     */
    async reqApi (module, api, post = {}, method = 'get', pathParam = '') {
        var apiObj = getApi(module, api)
        let res = null
        try {
            res = await this.req(
                `http://${getState('api', 'baseUrl')}${apiObj.url}`,
                post,
                apiObj.mock, 
                apiObj.excludRcCodes, 
                apiObj.noToken, 
                method, 
                pathParam
            )
            return res
        } catch(err) {
            return { error: err }
        }
    }

    /**
     * 基础请求接口
     * @param url
     * @param post
     */
    async req (url, post, mock = null, excludRcCodes = null, noToken = false, method = 'get', pathParam) {
        if (mock&&getState('settings','mock')) {
            return new Promise((resolve, reject) => {
                resolve(mock)
            })
        }
        var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'content-Type': 'application/json;charset=UTF-8'
        }
        if (!noToken) {
            headers.token = localStorage.getItem('token')//getState('user', "token")
            // 若token还有半小时过期，重新申请
            if((Date.now() - localStorage.getItem('token').split('|')[1]) >= (getState('settings', 'tokenExpire') - 1800000)) {
                try {
                    const adminId = JSON.parse(sessionStorage.getItem('auth-info'))[0],
                      password = JSON.parse(sessionStorage.getItem('auth-info'))[1]
                    const res = await this.reqApi('data', 'auth', {
                        adminId,
                        auth: md5(md5(adminId)+md5(password)+md5(dayjs().format('YYYYMMDDHHmmss'))),
                        ts: dayjs().format('YYYYMMDDHHmmss'),
                        utype: "1"
                    }, 'post')
                    if(!res.error) {
                        setState('user', 'token', res.token)
                        localStorage.setItem('token', res.token)
                    }
                } catch(error) {
                    console.error(error)
                }
            }
        }
            
        var conf = {
            method,
            baseURL: '',
            url,
            [['post', 'put'].includes(method) ? 'data' : 'params']: post,
            timeout: 60000,
            headers,
            dataType: 'JSON'
        } 

        /**
         *   拼接path参数,将带有{}的url分割为参数数组，并以参数字段作为key，从传入的pathParam映射值
         */
        if(/{*}/g.test(url)) {
            let urlToArray = url.split(/\/\{(.+?)\}/g),
                targetPathParam = ''
            urlToArray.forEach(urlPiece=> {
                if(!urlPiece.includes('/') && !!urlPiece) {
                    targetPathParam += '/' + pathParam[urlPiece]
                } else {
                    targetPathParam += urlPiece
                }
            })    
            conf.url = targetPathParam
        }
        let self = this
        return new Promise((resolve, reject)=> {
            axios({...conf , cancelToken:new CancelToken(function executor(c) {
                self.cancel = c
                // 参数 c : CancelToken构造函数里面自带的取消请求的函数
            })})
            .then((response) => {
                // console.log('response.data',response.data)
                if (typeof response.data!='object'){
                    resolve(response.data)
                    return
                }
                                            
                // loading
                // 如果http状态码正常，则直接返回数据
                if (!response.data) {
                    $$vue.$hint('接口报错，报文无data数据', true)
                    reject(new ResponseData(
                        -1000,
                        undefined,
                        '接口报错，报文无data数据'
                    ))
                }
                if (response && (response.status === 200 || response.status === 304 ||
                    response.status === 400)) {
                    // if (response.config.responseType == 'blob') {
                    //     return response
                    // }
                    // if (response.config.excludRcCodes) {
                    //     var excludRcCodes = []
                    //     for (var i in response.config.excludRcCodes) {
                    //         excludRcCodes.push(response.config.excludRcCodes[i])
                    //     }
                    //     //哪些响应码可以排除
                    if (!('rc' in response.data))
                    response.data.rc = 0
                    switch (response.data.rc) {
                        // 当请求返回是的状态码正确是才返回数据
                        case 0:
                            resolve(response.data)
                            break
                        // token无效时让用户返回登录
                        case 1:
                            setState('user', 'openid', null)
                            setState('user', 'userInfo', {})
                            reject(response.data)
                            break
                        // 权限不足时返回上已经
                        case 2:
                            $$vue.$message.error('很抱歉，你的权限不足', true)
                            reject(response.data)
                            break
                        default:
                            if (!(excludRcCodes && excludRcCodes.indexOf(response.data.rc) != -1))
                                $$vue.$message.error(`请求失败，错误码：${response.data.rc}，错误描述：${response.data.des || '无'}`, true)
                            reject(response.data)
                    }
                } else {
                    $$vue.$message.error(`网络异常${!response ? '无响应报文' : (response.status || '')}`, true)
                    reject(new ResponseData(
                        -404,
                        '',
                        '网络异常'
                    ))
                }
            })
            .catch((err) => {
                reject(err)
            })
        })
    }
}
