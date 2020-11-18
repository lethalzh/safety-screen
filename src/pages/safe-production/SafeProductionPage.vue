<template>
    <div class="safe-production">
        <div class="left-container" ref="left-container">
            <i 
                class="hidden-icon" 
                :class="leftRightState[0]?'el-icon-caret-left':'el-icon-caret-right always-show'"
                :style="leftRightState[0]?'right: -10px':'right: -40px'"
                @click="transitionMove($refs['left-container'], leftRightState[0]?'left':'recover'); $set(leftRightState, 0, !leftRightState[0])"
            />
            <component
                v-for="comp in ['statistics-count', 'statistics-bar']"
                :key="comp"
                :is="comp"
                :count-data="countData"
                
            />
            <monitor
                :company-list="companyList" 
                :company-camera-map="companyCameraMap"
                ref="monitor"
            />
        </div>
        <div class="center-container">
            <scenter
                ref="scenter"
                class="scenter"
                :alarm-list="alarmList"
                :company-list="companyList"
                :monitor-list="monitorList"
                :firetruck-list="firetruckList"
                :company-camera-map="companyCameraMap"
            ></scenter>
        </div>
        <div class="right-container" ref="right-container">
            <i 
                class="hidden-icon" 
                :class="leftRightState[1]?'el-icon-caret-right':'el-icon-caret-left always-show'"
                :style="leftRightState[1]?'left: -10px':'left: -42px'"
                @click="transitionMove($refs['right-container'], leftRightState[1]?'right':'recover'); $set(leftRightState, 1, !leftRightState[1])"
            />
            <alarm :company-list="companyList"></alarm>
            <regtime :article-list="articleList"></regtime>
            <dev :company-list="companyList"></dev>
        </div>
    </div>
</template>

<script>
import StatisticsCount from "./left/StatisticsCount"
import StatisticsBar from "./left/StatisticsBar"
import Monitor from "./left/Monitoring"

import Alarm from "./right/Alarm";
import Regtime from "./right/Regtime";
import Dev from "./right/Dev.vue";

import Scenter from "./Scenter.vue"
import md5 from "js-md5"
import dayjs from "dayjs"

import { transitionMove, polling } from '@/utils/index'

export default {
    name: "SafeProduction",
    components: {
        StatisticsCount, StatisticsBar,
        Monitor, Scenter, Alarm, Regtime, Dev 
    },
    props: {
        companyList: {
            type: Array,
            default: ()=> []
        }
    },
    data() {
        return {
            loading: false,
            //统计数据
            countData: null,
            companyCameraMap: {},
            cameraMap: {},
            // 监控列表
            monitorList: [],
            // 消防车列表
            firetruckList: [],
            //告警列表
            alarmList: null,
            //文章数据（安全生产制度）
            articleList: null,
            timer: null,
            leftRightState: [true, true]
        }
    },
    mounted() {
        this.initEventListen()
        // 轮询
        polling.call(this,
            async () => {
                await this.getBaseData()
            }, 15000
        )
    },
    beforeDestroy() {
        clearTimeout(this.timer)
        this.timer = -1
    },
    methods: {
        transitionMove,
        async getBaseData() {
            this.getCountData()
            this.getFireTruck()
            this.getMonitorList()
        },
        // 消防车列表
        async getFireTruck() {
            const res = await this.$http.reqApi("data", "firetruckList", { pageNum: 1, pageSize: 2000 })
            if(res && res.rows)
                this.firetruckList = res.rows.filter(row=> !!row.longitude && !!row.latitude)
        },
        // 监控列表
        async getMonitorList() {
            const res = await this.$http.reqApi(
                "data",
                "devList",
                { pageNum: 1, pageSize: 2000 }
            ), recursionFn = (cb, times = 0)=> { // 摄像头列表拿到后要对应写入企业列表，但企业列表获取在外层，这里需要递归来耦合
                if(!this.companyList.length && times < 60) {
                    setTimeout(()=> {
                        recursionFn(cb, ++times)
                    }, 300)
                } else {
                    cb() 
                }
            }
            if(res && res.rows) {
                this.monitorList = res.rows
                recursionFn(()=> {
                    this.matchCompanyCamera()
                })
            }
        },
        // 获取统计数据
        async getCountData() {
            var res = await this.$http.reqApi("data", "countData", {}, 'get', {
                dateTime: dayjs().format("YYYYMMDDHHmmss"),
                stat: 0
            })
            if(!res.error) 
                this.countData = res
        },
        initEventListen() {
            this.$bus.$on("map-choose-company", async (param) => {
                this.$bus.$emit("close-deal-ledger-alarm-win")
                this.$bus.$emit("close-alarm-more-win")
                this.$bus.$emit("close-camera-more-win")
                this.$bus.$emit("close-video-win")
            }).off(this, "map-choose-company")
        },
        // 将每个企业的监控与企业列表对应
        matchCompanyCamera() {
            this.monitorList.forEach(monitor=> {
                this.companyList.map(company=> {
                    !this.companyCameraMap[company.companyNo] && this.$set(this.companyCameraMap, company.companyNo, [])
                    const isRepeat = this.companyCameraMap[company.companyNo].find(camera=> camera.deviceId == monitor.deviceId)
                    if(monitor.companyNo == company.companyNo && !isRepeat) {
                        this.companyCameraMap[company.companyNo].push(monitor)
                    }
                })
            })
            // console.log('>>>>>>>>>>企业对应摄像头map:', this.companyCameraMap)
        }
    }
}
</script>

<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
@height: ~"calc(90vh - 20px - 20px - (90vh - 20px - 20px) * .10)";
.safe-production {
    .p16;
    height: 100%;
    .flex(row, space-between, flex-start);
    .left-container {
        .pr;
        .p10;
        z-index: 9;
        flex: .8;
        height: 100%;
        &:hover {
            i {
                display: block;
            }
        }
        .shadow-light;
        background: @background;
    }
    .center-container {
        .pr;
        flex: 3;
        height: 100%;
    }
    .right-container {
        flex: 1;
        height: 100%;
        background: @background !important;
        filter: blur(0px);
        .shadow-light;
        .p10;
        &:hover {
            i {
                display: block;
            }
        }
    }
}
</style>