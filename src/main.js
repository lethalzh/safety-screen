import Vue from 'vue'
import router from '@/router'
import store, { getState, setState } from './store'
import { EventGloablFactory } from '@/utils/index'
import { mapState } from 'vuex'
import HttpRequest from './api/HttpRequest'
import App from './App.vue'
Vue.config.productionTip = false
import ElementUI from 'element-ui' //element-ui的全部组件
import './style/theme/index.css'
Vue.use(ElementUI) //使用elementUI
import './assets/css/common.less'

Vue.prototype.$log = console.log
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import dayjs from 'dayjs'

Vue.prototype.$dayjs = dayjs

Vue.prototype.$formatDay = function (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return (date ? dayjs(date) : dayjs()).format(format)
}
import VueAnime from 'vue-animejs';

Vue.prototype.$bus = EventGloablFactory()

Vue.prototype.$getState = getState
Vue.prototype.$setState = setState
Vue.prototype.$http = new HttpRequest()

Vue.mixin({
    computed: {
        ...mapState({
            _api: state => state.api,
            _dict: state => state.dict,
            _settings: state => state.settings,
            _user: state => state.user
        })
    }
})

Vue.use(VueAnime)

window.$$vue = new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')