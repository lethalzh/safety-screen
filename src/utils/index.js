import Vue from 'vue'
import { getState } from '@/store'
/**
 * 对象深拷贝
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = Array.isArray(source) ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

/**
 * 根据字段的值，将列表转为map，同值字段会存在覆盖
 * @param {Object} list
 * @param {Object} field 字段名 为null，表示以自身做key
 * @param {Object} valueField 字段名 为null，表示以自身做key
 */
export function arrayToMap(list, field = null, valueField = null) {
    var map = {}
    for (var i in list) {
        map[field ? list[i][field] : list[i]] = valueField == null ? list[i] : list[i][valueField]
    }
    return map
}

/**
 * 创建随机码
 * @returns {string}
 */
export function createUniqueString() {
    const timestamp = new Date().getTime() + ''
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
    return (+(randomNum + timestamp)).toString(32)
}

export function formatDevStateIcon(devList, stat = null) {
    var isArray = Array.isArray(devList);
    !isArray && (devList = [devList])
    var dtype = getState('dict', 'devTypeIcon')
    for (var i of devList) {
        var icon = ''
        stat = stat !== null ? stat : i.deviceStat
        //正常
        if (stat === 0)
            icon = (dtype[i.deviceType] && dtype[i.deviceType][3]) ? dtype[i.deviceType][3] : '/static/images/lists/fireZC.png'
        //告警
        else if (stat == 1)
            icon = (dtype[i.deviceType] && dtype[i.deviceType][0]) ? dtype[i.deviceType][0] :
                '/static/images/lists/xiaofang.png'
        //离线
        else if (stat == 2)
            icon = dtype[i.deviceType] ? dtype[i.deviceType][2] : ''
        //故障
        else if (stat == 3)
            icon = dtype[i.deviceType] ? dtype[i.deviceType][1] : ''
        i.icon = dtype[i.deviceType] ? `http://${getState('api', 'baseUrl')}/static${icon}` : icon
    }
    return isArray ? devList : devList[0]
}

export function flashChecker() {
    var hasFlash = 0;　　　　 //是否安装了flash
    var flashVersion = 0;　　 //flash版本
    if (document.all) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
            hasFlash = 1;
            VSwf = swf.GetVariable("$version");
            flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                hasFlash = 1;
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) {
                        continue;
                    }
                    flashVersion = parseInt(words[i]);
                }
            }
        }
    }
    return { hasFlash, flashVersion }
}

/**
 * @param {Object} instance
 * @returns {void}
 */
export function redrawChartsWhenResize(instance) {
    if (typeof instance.resize !== "function") throw new Error("请确认传入了正确的charts实例")
    let resizeChart = () => {
        instance.resize()
    }
    window.addEventListener('resize', resizeChart)
    // 注销事件与注册事件放在一起 提高可读性
    this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', resizeChart)
    })
}


/**
 * ExtendGlobalEvent,继承自Vue,调用全局总线调用同原生事件总线相同，
 * 当注册以$on.call形式调用时，会自动注册一个注销事件。
 */
class ExtendGlobalEvent extends Vue {
    constructor() {
        super()
    }
    // @override
    _on(...args) {
        super.$on(...args)
    }
    _emit(...args) {
        super.$emit(...args)
    }
}

// 全局事件的工厂函数，为了兼容原生$on的调用方式
export function EventGloablFactory() {
    const Event = new ExtendGlobalEvent()
    return {
        $on(...args) {
            Event._on(...args)
            return this
        },
        $emit(...args) {
            Event._emit(...args)
        },
        $off(...args) {
            Event.$off(...args)
        },
        off(context, eventName) {
            if (context && context._isVue) {
                context.$once('hook:beforeDestroy', () => {
                    this.$off(eventName)
                })
            }
        }
    }
}

/**
 * 按位运算的枚举转换 返回一个指定分隔符的字符串
 * @param {Object} dictObj 枚举表
 * @param {Number} value 后端返回枚举值
 * @param {string} separate 分隔符
 * @param {string} result 结果 此参数为递归时传入
 * @returns {string}
 */

export function dictByBit(dictObj, value, separate = '、', result = "") {
    if (Object.prototype.toString.call(dictObj) != "[object Object]") return ''

    let dictLocation = []
    Object.keys(dictObj).forEach(bit => {
        dictLocation.push(bit)
    })
    if (dictObj[value]) {
        return (result ? (result + separate) : '') + dictObj[value]
    }
    for (let i = 1; i < 1024; i++) {
        if (value >> i === 1) {
            let afterMove = value - dictLocation[i]
            return dictByBit(dictObj, afterMove, separate, (result ? (result + separate) : '') + dictObj[dictLocation[i]])
        }
    }
}

export function transitionMove(el, direction = 'left', offset = '16px') {
    if(!el || !el instanceof HTMLElement) throw TypeError('参数1为falsy值或传入了非元素参数')
    el.style.transition = 'all 1s'
    if(direction === 'left') {
        el.style.transform = `translateX(calc(-100% - ${offset}))`
    } else if(direction === 'right') {
        el.style.transform = `translateX(calc(100% + ${offset}))`
    } else {
        el.style.transform = "translateX(0)"
    }
}

export async function polling(fn, delay) {
    await fn()
    if(this.timer == -1) return
    this.timer = setTimeout(async ()=> {
        clearTimeout(this.timer)
        await polling.call(this, fn, delay)
    }, delay)
}