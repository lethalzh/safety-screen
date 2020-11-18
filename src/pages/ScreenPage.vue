<template>
    <div id="main">
        <!-- 菜单样式为active类 -->

        <div class="screen">
            <!-- <div id="share-map"></div> -->
            <header class="header">
                <div class="left">
                    <el-popover
                        placement="bottom"
                        width="200"
                        trigger="hover"
                    >
                        <div class="title" style="height: 100%" slot="reference">智慧东段数据平台指挥中心</div>
                        <div class="logout" @click="logout">退出登录</div>
                        <div class="logout" @click="toallvideo" v-if="$getState('user','userId')=='test'">测试监控视频</div>
                    </el-popover>
                    <nav :class="active">
                        <!-- 当菜单链接被点击，调用makeActive方法 -->
                        <template v-for="item in components">
                            <a
                                v-if="item.title == '首页' || ownPowerList.includes(+item.code)"
                                :href="`#${item.path}`"
                                style="color: #12C9B4 !important"
                                :class="{ checked: item.title == active }"
                                :key="item.title"
                                @click="active = item.title"
                            ><span>{{ item.title }}</span></a>
                        </template>
                    </nav>
                </div>
                <div class="right">
                    <div class="weather">
                        <img :src="cloudSvg" width="32" height="32"/>
                        <span style="font-size: 1.8rem">{{ weather.wendu }}c°</span>
                        {{ weather.type }}
                    </div>
                    <div class="addr">
                        <span style="margin-right: 16px">河北省廊坊市霸州市东段乡</span>
                        <span>{{$dayjs().format("YYYY年MM月DD日")}}</span>
                    </div>
                </div>
                <svg
                    width="100vw"
                    height="12px"
                    class="pa"
                    style="padding-top: 10px; overflow: visible; z-index: 9999; pointer-events: none; bottom: 0px;"
                >
                    <polyline
                        :points="polylineUp"
                        style="fill: rgba(0,0,0,0); stroke:#12C9B4; stroke-width:1"
                    />
                    <polyline
                        :points="polylineDown"
                        style="fill: rgba(0,0,0,0); stroke:#12C9B4; stroke-width:1"
                    />
                    <line x1="0" y1="10" x2="20" y2="10" style="stroke:#12C9B4;stroke-width:4" />
                    <line x1="29%" y1="10" x2="30%" y2="10" style="stroke:#12C9B4;stroke-width:4" />
                    <line x1="39%" y1="0" x2="40%" y2="0" style="stroke:#12C9B4;stroke-width:4" />
                    <line x1="96%" y1="-80" x2="97%" y2="-80" style="stroke:#12C9B4;stroke-width:4" />
                </svg>
            </header>

             <!-- 消防告警弹窗 -->
            <fire-warning-dialog 
                :company-list="warningCompany"
                :visible.sync="fireWarningVisible"
                @pause-alarm="$refs['audio'].pause()"
                @on-choose="onChooseWarning"
                v-if="!!warningCompany.length"
            >
                <div style="text-align: right">
                    <el-button size="mini" @click="$refs['audio'].play()">开启声音提示</el-button>
                </div>
            </fire-warning-dialog>

            <audio :src="require('@/assets/mp3/alarm.mp3')" ref="audio" loop/>

            <div class="content">
                <router-view :company-list="companyList"/>
            </div>
        </div>
    </div>
</template>

<script>
import SafeProduction from "./safe-production/SafeProductionPage"
import Monitor from "./environmental-monitor/MonitorPage"
import SynthesizeManage from "./synthesize-manage/SynthesizeManagePage"
import Electric from "./electric/ElectricPage"
import HomePage from "./home/HomePage"
import md5 from "js-md5"
import dayjs from "dayjs"
import cloudSvg from '@/assets/img/cloud.svg'
import FireWarningDialog from './safe-production/map-component/FireWarningDialog'
import { polling } from '@/utils/index'
// var CronJob = require("cron").CronJob

export default {
    name: "Screen",
    components: {
        SafeProduction,
        Monitor,
        SynthesizeManage,
        Electric,
        HomePage,
        FireWarningDialog
    },
    data() {
        return {
            active: "home-page",
            map: null,
            components: [
                { title: "首页", path: '/screen/home' },
                { title: "安全生产", code: 2, path: '/screen/safe-production' },
                { title: "人居环境", code: 4, path: '/screen/environmental-monitor' },
                { title: "分表计电", code: 1, path: '/screen/electric' },
                { title: "综合治理", code: 3, path: '/screen/synthesize-manage' }
            ],
            polylineUp: "",
            polylineDown: "",
            ownPowerList: JSON.parse(sessionStorage.getItem('power') || '[]'),
            weather: {},
            timer: null,
            companyList: [],
            fireWarningVisible: false
        }
    },
    watch: {
        warningCompany(warnList, oldList) {
            if(!this.ownPowerList.includes(2)) return
            if(JSON.stringify(warnList) == JSON.stringify(oldList)) {
                // 轮询前后消防告警的相同且告警时间阈值小于当前时间
                if(!!warnList.length && this._settings.fireAlarmExpire <= Date.now()) {
                    this.fireWarningVisible = true
                    this.$refs['audio'] && this.$refs['audio'].play()
                } else {
                    this.$refs['audio'] && this.$refs['audio'].pause()
                }
            } else {
                // oldList为空代表第一次(或重新)进入页面 通过判断时间阈值决定当前是第一次进入还是重新进入
                if(!oldList.length && this._settings.fireAlarmExpire <= Date.now()) {
                    // 与上次轮询结果不同直接告警 并将告警阈值调整至当前时间 避免出现在下一次告警阈值时间内数组改变的情况
                    this.$setState('settings', 'fireAlarmExpire', Date.now())
                    this.fireWarningVisible = true
                    this.$refs['audio'] && this.$refs['audio'].play()
                }
            }
        },
        $route: {
            handler(route) {
                this.active = this.components.find(comp=> route.path == comp.path).title
            },
            immediate: true
            // console.log(route)
        }
    },
    computed: {
        cloudSvg: ()=> cloudSvg,
        // 当前是否有着火企业
        warningCompany() {
            return this.companyList.filter(com=> com.devStat == 2)
        }
    },
    created() {
        // 根据title同步enum接口的powerList
        Object.keys(this._dict.powerList).forEach(key=> {
            const index = this.components.findIndex(comp=> comp.title == this._dict.powerList[key])
            if(index !== -1) this.$set(this.components[index], 'code', key)
        })
        this.getEnums()
    },
    mounted() {
        this.onResize()
        window.addEventListener("resize", this.onResize)
        this.$once("hook:beforeDestory", () => {
            window.removeEventListener("resize", this.onResize)
        })
        this.getWeather()
        polling.call(this,
            async () => {
                await this.getCompanyList()
            }, 15000
        )
    },
    methods: {
        onResize() {
            let clientWidth = window.innerWidth,
                rate = (document.querySelector(".title").offsetWidth +
                        document.querySelector(`.${this.active}`).offsetWidth +
                        88) /
                    clientWidth
            this.polylineUp = `0 0, ${clientWidth * rate} 0, ${
                clientWidth * (rate + 0.02)
            } -80, ${clientWidth} -80`
            this.polylineDown = `0 10, ${clientWidth * (rate - 0.01)} 10, ${
                clientWidth * (rate + 0.012)
            } -80, ${clientWidth} -80`
        },
        // 获取枚举
        async getEnums() {
            var res = await this.$http.reqApi("data", "enums")
            Object.keys(res).forEach(key=> {
                let stateMap = {}
                Array.isArray(res[key]) && res[key].forEach(_res=> {
                    stateMap[_res.code] = _res.value
                })
                this.$setState("dict", key, stateMap)
            })
        },
        // 获取天气
        async getWeather() {
            const res = await this.$http.reqApi('data', 'weather', {}, 'get', { city: 101090606 })
            if(res) this.weather = res
        },
        // 登出
        logout() {
            this.$confirm(`确定要退出登录吗?`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    localStorage.removeItem('token')
                    this.$router.replace('/login')
                }).catch(()=> {})
        },
        // 全局监听安全生产消防告警企业
        async getCompanyList() {
            var res = await this.$http.reqApi(
                "data", "safeCompanyList", { pageNum: 1, pageSize: 2000 }, "get",
                {
                    type: 0,
                    dateTime: dayjs().format("YYYYMMDDHHmmss"),
                    stat: 0,
                }
            )
            if(res && res.rows)
                this.companyList = res.rows.filter(row=> !!row.longitude && !!row.latitude)
        },
        onChooseWarning(comp) {
            if(!location.hash.includes('safe-production')) {
                this.$router.push({
                    name: 'SafeProduction',
                    params: {
                        warnCompany: comp
                    }
                })
            } else {
                this.$bus.$emit('fire-warning-choosed', '企业', comp)
            }
            this.active = "安全生产"
        },
        toallvideo(){
            this.$router.push('/all-video')
        }
    },
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
@height: ~"calc(100vh - 20px - 20px - 20px - (100vh - 20px - 20px) * .10)";
.logout {
    .cursor-p;
    &:hover {
        .theme-color-2;
    }
}
.screen {
    position: relative;
    .header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        height: 10vh;
        // .pb16;
        width: 100vw;
        .flex(row, space-between, flex-start);
        background: @background;
        .left {
            display: flex;
            flex: 2;
            .title {
                .pl24;
                .pt16;
                margin-right: 64px;
                font-size: 2.8rem;
                color: @base-font-color;
                .flex(row, flex-start, center);
            }

            @media only screen and (max-width: 1300px) {
                .title {
                    font-size: 3.2rem;
                }
            }

            @media only screen and (max-width: 1100px) {
                .title {
                    font-size: 3rem;
                }
            }

            @media only screen and (max-width: 1000px) {
                .title {
                    font-size: 2.8rem;
                }
            }

            @media only screen and (max-width: 900px) {
                .title {
                    font-size: 2.6rem;
                }
            }

            @media only screen and (max-width: 800px) {
                .title {
                    font-size: 2.4rem;
                }
            }

            @media only screen and (max-width: 700px) {
                .title {
                    font-size: 2.1rem;
                }
            }

            nav {
                display: flex;
                flex-wrap: nowrap;
            }

            nav a {
                width: 4vw;
                height: 4vh;
                display: inline-block;
                padding: 2rem;
                color: #fff !important;
                font-weight: bold;
                text-decoration: none !important;
                line-height: 6vh;
                text-transform: uppercase;
                transform: skew(-20deg);
                text-align: center;
                -webkit-transition: background-color 0.25s;
                -moz-transition: background-color 0.25s;
                transition: background-color 0.25s;
                span {
                    .dib;
                    color: @theme-color-second;
                    transform: skew(20deg);
                    font-size: 16px;
                }
            }

            @media only screen and (max-width: 1600px) {
                nav a {
                    span {
                        font-size: 14px;
                    }
                    width: 5vw;
                }
            }
            @media only screen and (max-width: 1300px) {
                nav a {
                    span {
                        font-size: 12px;
                    }
                    width: 4.6vw;
                }
            }

            @media only screen and (max-width: 1000px) {
                nav a {
                    span {
                        font-size: 10px;
                    }
                    width: 5.5vw;
                }
            }

            nav a:first-child {
                border-radius: 2px 0 0 2px;
            }

            nav a:last-child {
                border-radius: 0 2px 2px 0;
            }

            .checked {
                .theme-color-3;
                transform: skew(-200deg);
            }

            p {
                font-size: 22px;
                font-weight: bold;
                color: #7d9098;
            }

            p b {
                color: #ffffff;
                display: inline-block;
                padding: 5px 10px;
                background-color: #c4d7e0;
                border-radius: 2px;
                text-transform: uppercase;
                font-size: 18px;
            }
        }
        .right {
            align-self: stretch;
            .flex(column, center, flex-end);
            flex: 1;
            .pr24;
            .pt16;
            color: @base-font-color;
            .weather {
                .flex(row, space-between);
                span {
                    padding-left: 1rem;
                    font-size: 1.5rem;
                }
            }
            .addr {
                span {
                    font-size: 1.5rem;
                }
            }
        }
    }

    .content {
        margin-top: calc(10vh);
        @media only screen and (max-width: 1536px) {
            margin-top: calc(10vh + 12px);
        }
        width: 100vw;
        height: 90vh
    }
}
</style>
