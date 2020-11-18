<template>
    <div class="historical-electric">
        <div class="title">
            <span v-if="chartTitle">{{ chartTitle }}</span>
            <div class="change-button">
                <div v-for="(i, index) in nav" :key="index" class="btn" :class="{ active: currentTab === index }" @click="navClick(index)">
                    {{ i }}
                </div>
            </div>
        </div>

        <div id="chart-columnar" class="line-chart" v-loading="loading"></div>
    </div>
</template>
<script>
import echarts from 'echarts'
import { redrawChartsWhenResize } from '@/utils/index'
var CronJob = require('cron').CronJob
export default {
    name: 'ElectricHistoricalEle',
    props: {
        chartTitle: {
            type: String,
            default: '',
        },
        companyNo: {
            type: String,
        },
        // 首页会引入此组件两个，此属性避免id冲突
        customizeChartId: {
            type: String,
            default: 'line-chart',
        },
        shadow: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        const _this = this
        return {
            cron: null,
            nav: ['7天', '14天'],
            currentTab: 0,
            loading: false,
            chartData: {},
            chartIns: null,
            chartOptions: {
                color: ['#1BFFE4', '#FA8E8E'],
                legend: {
                    data: ['生产设备用电', '治污设备用电'],
                    bottom: 0,
                },
                barMaxWidth: 30,
                tooltip: {
                    trigger: 'axis',
                    formatter: (ins) => {
                        return `
                            ${ins[0].seriesName}：${ins[0].value.toFixed(2)} <br/>
                            ${ins[1].seriesName}：${ins[1].value.toFixed(2)}
                        `
                    },
                    //'{a0}: {c0}<br/>{a1}: {c1}',
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                grid: {
                    top: '5%',
                    left: '0%',
                    right: '1%',
                    bottom: '15%',
                    containLabel: true,
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                        },
                    },
                },
                xAxis: {
                    type: 'category',
                    data: [this.$dayjs().format('MM.DD')],
                },
                series: [
                    // {
                    //     name: "总用电量",
                    //     type: "bar",
                    //     stack: "总量",
                    //     data: []
                    // },
                    {
                        name: '生产设备用电',
                        type: 'bar',
                        stack: '总量',
                        data: [0],
                    },
                    {
                        name: '治污设备用电',
                        type: 'bar',
                        stack: '总量',
                        data: [0],
                    },
                ],
            },
        }
    },
    created() {
        this.$bus.$on('updateElectricType',()=>{
            this.getVoltameterDetail();
        }).off(this,'updateElectricType')
    },
    mounted() {
        this.cron = new CronJob(
            '*/15 * * * * *',
            () => {
                this.getVoltameterDetail()
            },
            null,
            false,
            'Asia/Chongqing'
        )
        this.init()
        this.cron.start()
        this.getVoltameterDetail()
    },
    beforeDestroy() {
        this.cron.stop()
    },
    methods: {
        init() {
            this.chartIns = null
            this.chartIns = echarts.init(document.querySelector('#chart-columnar'))
            this.chartIns.setOption(this.chartOptions)
            redrawChartsWhenResize.call(this, this.chartIns)
        },
        navClick(index) {
            this.currentTab = index
            this.radioChanges(index)
        },
        async getVoltameterDetail(
            startDate = this.$dayjs()
                .subtract(14, 'day')
                .startOf('day')
                .format('YYYYMMDDHHmmss'),
            endDate = this.$dayjs()
                .subtract(1, 'day')
                .endOf('day')
                .format('YYYYMMDDHHmmss')
        ) {
            this.loading = true
            const res = await this.$http.reqApi('data', 'electric', {
                startDate,
                endDate,
                type: this._settings.electricType,
                regionId: this._dict.regionRoot.code
            })
            this.loading = false
            if (res && res.rows.length > 0 && !res.error) {
                this.chartData = res.rows[0]
                for (let i = 0; i < this.chartData.date.length; i++) {
                    this.chartData.date[i] = this.$dayjs(this.chartData.date[i]).format('MM.DD')
                }
                if (!this.chartIns) {
                    this.chartIns = echarts.init(document.querySelector('#chart-columnar'))
                    redrawChartsWhenResize.call(this, this.chartIns)
                }
                this.radioChanges(this.currentTab)
            } else {
                this.init()
                return
            }
        },
        radioChanges(value) {
            if (value == 0) {
                this.chartOptions.xAxis.data = this.chartData.date.slice(8)
                this.chartOptions.series[0].data = this.chartData.dev1.slice(8)
                this.chartOptions.series[1].data = this.chartData.dev2.slice(8)
            } else {
                this.chartOptions.xAxis.data = this.chartData.date
                this.chartOptions.series[0].data = this.chartData.dev1
                this.chartOptions.series[1].data = this.chartData.dev2
            }
            this.chartIns.setOption(this.chartOptions)
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
/deep/ .el-loading-mask {
    background-color: @loading-background;
}
.historical-electric {
    height: 40vh;
    // width: 20vw;
    .p10;
    .title {
        height: 6vh;
        .flex(row, space-between);
        padding: 10px 10px 0 10px;
        .change-button {
            z-index: 9;
            width: 20vw;
            display: flex;
            flex-wrap: nowrap;
            /deep/.el-radio-button__inner,
            .el-radio-group {
                width: 9vw;
                display: flex;
                margin-right: 0.5vw;
            }
        }
        
        /deep/.el-radio-button__inner {
            width: 6vw;
            height: 3.9vh;
            margin-right: 1vw;
            background: transparent;
            border: 2px solid #1ed6c1;
            padding-left: 3.8vw;
            border-radius: 0.5rem;
        }
        /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
            flex: 1;
            background: transparent;
            border: 2px solid #1ed6c1;
        }
        /deep/.el-radio-button:last-child .el-radio-button__inner {
            background: transparent;
            border: 2px solid #1ed6c1;
        }
    }
    .line-chart {
        z-index: 9;
        width: 20vw;
        height: 30vh;
        margin-left: auto;
        margin-right: auto;
        margin-top: 3rem;
    }
    .change-button {
        display: flex;
        justify-content: space-between;
        width: 40%;
        > div {
            cursor: pointer;
            color: @theme-color;
            z-index: 1;
            width: 45%;
            border-radius: 5px;
            text-align: center;
            border: 1px solid @theme-color-second;
            padding: 6px 0;
        }
        .btn {
            color: #606266;
            &:active {
                background: #cecece;
            }
        }
        .active {
            color: @theme-color-second;
            .theme-color-10;
        }
    }
}
</style>
