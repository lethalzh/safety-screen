<template>
    <div class="line-chart" :id="chartsId" v-loading="chartLoading" :style="{ height: height }"></div>
</template>

<script>
import echart from 'echarts'
import { redrawChartsWhenResize } from '@/utils/index'

export default {
    name: 'LineEcharts',
    props: {
        echartsData: {
            type: Object,
            required: true,
        },
        chartsId: {
            type: String,
            required: true,
        },
        height: {
            type: String,
            default: '30vh',
        },
    },
    data() {
        return {
            chartLoading: false,
            options: {
                tooltip: {
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#339AFF',
                        },
                    },
                },
                legend: {
                    data: [],
                },
                toolbox: {},
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    top: '5%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'time',
                    axisLine: {
                        //x轴
                        show: false,
                    },
                    axisTick: {
                        //x轴刻度线
                        show: false,
                    },
                },
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                            },
                        },
                        axisLine: {
                            //y轴
                            show: false,
                        },
                        axisTick: {
                            //y轴刻度线
                            show: false,
                        },
                    },
                ],
                series: [],
            },
        }
    },
    mounted() {
        this.options.title = this.echartsData.title || {}
        this.options.series = this.echartsData.series || []
        this.options.legend = this.echartsData.legend || {}
        this.options.xAxis = this.echartsData.xAxis || this.options.xAxis
        this.options.yAxis = this.echartsData.yAxis || this.options.yAxis
        this.loadChart()
    },
    methods: {
        loadChart() {
            this.chartLoading = true
            this.myChart = echart.init(document.querySelector(`#${this.chartsId}`))
            this.myChart.setOption(this.options)
            redrawChartsWhenResize.call(this, this.myChart)
            this.chartLoading = false
        },
    },
    watch: {
        echartsData: {
            handler(newV, oldV) {
                if (newV.constructor.name === 'Object') {
                    Object.keys(newV).forEach((key) => {
                        this.options[key] = newV[key]
                    })
                    this.loadChart()
                }
            },
            deep: true,
        },
    },
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.line-chart {
    // width: 99%;
    // height: calc(34vh - 56px);
    // height: 40vh;
    // height: 100%;
    width: 100%;
    // margin-top: 24px;
}
</style>
