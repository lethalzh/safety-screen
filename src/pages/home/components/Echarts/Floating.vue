<!--  -->
<template>
    <div class="partcomwithborder" style="padding:24px">
        <line-echarts :echartsData="echarts" chartsId="float-rank-bar" v-loading="loading" height="35vh"></line-echarts>
    </div>
</template>

<script>
var CronJob = require('cron').CronJob
import LineEcharts from './Echarts'
export default { 
    components: {
        LineEcharts,
    },
    data() {
        return {
            nativePlace: [],
            echarts: {
                title: {
                    text: '流动人口来源地前五',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: '#53ac85',
                    },
                    bottom: '0',
                    left: '40%',
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    top: '5%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        position: 'top',
                        show: true,
                        type: 'value',
                        axisTick: {
                            show: false,
                        },
                        // axisLine: {
                        //     show: false,
                        // },
                        // axisLabel: {
                        //     show: true,
                        //     textStyle: {
                        //         fontSize: 12, //更改坐标轴文字大小
                        //     },
                        // },
                        splitLine: {
                            //网格线
                            show: false,
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
                series: [
                    {
                        name: '',
                        type: 'bar',
                        barWidth: '30%',
                        data: [],
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorlist = ['#97efe7', '#95efe9', '#62aefe', '#ff7075', '#01cdaf']
                                    return colorlist[params.dataIndex]
                                },
                            },
                        },
                    },
                ],
            },
            loading: false,
        }
    },
    mounted() {
        this.mouseEvent()
        this.cron = new CronJob(
            '*/15 * * * * *',
            () => {
                this.getData()
            },
            null,
            false,
            'Asia/Chongqing'
        )
        this.cron.start()
        this.loading = true
        this.getData()
        this.loading = false
    },
    beforeDestroy() {
        this.cron.stop()
    },
    methods: {
        mouseEvent(){
            document.querySelector('.partcomwithborder').addEventListener('mouseover',()=>{
                this.$emit('show', 4)
            })
            document.querySelector('.partcomwithborder').addEventListener('mouseout',()=>{
                this.$emit('clear')
            })
        },
        async getData() {
            const res = await this.$http.reqApi('data', 'flowPeopleCount', {})
            if (res && !res.error) {
                this.nativePlace = res.nativePlace
                let data = this.nativePlace.map((el) => {
                    return el.nativePlaceName
                })
                let series = this.nativePlace.map((el) => {
                    return { value: el.number, name: el.nativePlaceName }
                })
                this.echarts.series[0].data = series.reverse().slice(5)
                this.echarts.yAxis[0].data = data.reverse().slice(5)
            } else {
                return
            }
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.partcomwithborder {
    // background: linear-gradient(to bottom, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) left top no-repeat, linear-gradient(to right, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) left top no-repeat,
    //     linear-gradient(to bottom, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) right top no-repeat, linear-gradient(to left, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) right top no-repeat,
    //     linear-gradient(to top, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) left bottom no-repeat, linear-gradient(to right, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) left bottom no-repeat,
    //     linear-gradient(to top, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) right bottom no-repeat, linear-gradient(to left, @theme-color 0px, @theme-color 2px, transparent 3px, transparent 100%) right bottom no-repeat;
    // background-size: 18px 18px;
    width: 100%;
    height: 100%;
}
.partcomwithborder:hover {
    background: #e5fbf9;
}
</style>
