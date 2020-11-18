<!--  -->
<template>
    <div class="production" style="padding:24px">
        <line-echarts :echartsData="echarts" chartsId="production-bar" v-loading="loading" height="40vh"></line-echarts>
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
                tooltip:{
                },
                title: {
                    text: '生产运行图',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: '#53ac85',
                    },
                    bottom: '12%',
                    left: '40%',
                },
                angleAxis: {
                    max: 120,
                    // startAngle: 0,
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                },
                radiusAxis: {
                    type: 'category',
                    data: ['未开启治污设备', '未响应减产', '未响应停产', '停工', '合规生产'],
                    z: 20,
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        fontSize: 8,
                    },
                    axisLabel: {
                        interval: 0, //代表显示所有x轴标签显示
                    },
                },
                polar: {
                    center: ['50%', '40%'],
                    radius: '85%'
                },
                series: [
                    {
                        type: 'bar',
                        data: [0, 0, 0, 0, 0],
                        coordinateSystem: 'polar',
                        roundCap: true,
                        itemStyle: {
                            color: function(params) {
                                var colorlist = ['#d3d4d9', '#ff7277', '#ffcbcc', '#645574', '#94f1e7']
                                return colorlist[params.dataIndex]
                            },
                        },
                    }
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
                this.getList()
            },
            null,
            false,
            'Asia/Chongqing'
        )
        this.cron.start()
        this.loading = true
        this.getList()
        this.loading = false
    },
    beforeDestroy() {
        this.cron.stop()
    },
    methods: {
        mouseEvent(){
            document.querySelector('.production').addEventListener('mouseover',()=>{
                this.$emit('show', 3)
            })
            document.querySelector('.production').addEventListener('mouseout',()=>{
                this.$emit('clear')
            })
        },
        async getList() {
            const res = await this.$http.reqApi('data', 'monStatCount', {
                regionId: this._dict.regionRoot.code,
                type: this._settings.electricType
            })
            if (res && res.rows && !res.error) {
                let countData = res.rows[0]
                let arr = [];
                arr.push(countData.unTreatmentCount || 0)
                arr.push(countData.unEnergyCount || 0)
                arr.push(countData.unStopCount || 0)
                arr.push(countData.unrunCount || 0)
                arr.push(countData.qualifiedCount)
                this.echarts.angleAxis.max = countData.factoryCount || 1
                this.echarts.series[0].data = arr
            } else {
                return
            }
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.production {
    width: 100%;
    height: 100%;
}
.production:hover {
    background: #e5fbf9;
}
</style>
