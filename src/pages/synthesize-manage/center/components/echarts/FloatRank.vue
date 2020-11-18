<!--  -->
<template>
    <div class="partcomwithborder" style="padding:10px">
        <line-echarts :echartsData="echarts" chartsId="float-rank-bar" v-loading="loading" height="40vh"></line-echarts>
    </div>
</template>

<script>
import LineEcharts from './Echarts'
export default {
    components: {
        LineEcharts,
    },
    props: {
        place: {
            type: Array,
        },
    },
    data() {
        return {
            echarts: {
                title: {
                    text: '流动人口地区来源TOP10',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: '#53ac85',
                    },
                },
                xAxis: [
                    {
                        position: 'top',
                        show: true,
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontSize: 12, //更改坐标轴文字大小
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisLine: { show: false }, //坐标轴
                        axisTick: [
                            {
                                //坐标轴小标记
                                show: false,
                            },
                        ],

                        axisLabel: {
                            textStyle: {
                                fontSize: 12,
                            },
                        },
                    },
                ],
                grid: {
                    top: '2%',
                },
                series: [
                    {
                        name: '',
                        type: 'bar',
                        barWidth: '30%',
                        data: [],
                        itemStyle: {
                            normal: {
                                color: '#53ac85',
                            },
                        },
                    },
                ],
            },
            loading: false,
        }
    },
    computed: {},
    watch: {
        place: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let data = newVal.map((el) => {
                        return el.nativePlaceName
                    })
                    let series = newVal.map((el) => {
                        return { value: el.number, name: el.nativePlaceName }
                    })
                    this.echarts.series[0].data = series.reverse()
                    this.echarts.yAxis[0].data = data.reverse()
                }
            },
            deep: true,
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.partcomwithborder {
    background: linear-gradient(to bottom, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) left top no-repeat, linear-gradient(to right, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) left top no-repeat,
        linear-gradient(to bottom, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) right top no-repeat, linear-gradient(to left, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) right top no-repeat,
        linear-gradient(to top, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) left bottom no-repeat, linear-gradient(to right, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) left bottom no-repeat,
        linear-gradient(to top, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) right bottom no-repeat, linear-gradient(to left, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) right bottom no-repeat;
    background-size: 18px 18px;
    padding: 4px;
    width: 100%;
    height: 100%;
}
</style>
