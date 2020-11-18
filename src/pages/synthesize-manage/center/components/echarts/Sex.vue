<!--  -->
<template>
    <div class="partcomwithborder" style="padding:10px">
        <line-echarts :echartsData="echartsData" chartsId="sex-pie" v-loading="loading" height="30vh"></line-echarts>
    </div>
</template>

<script>
import LineEcharts from './Echarts'
export default {
    components: {
        LineEcharts,
    },
    props: {
        sex: {
            type: Array,
        },
    },
    data() {
        return {
            echartsData: {
                title: {
                    text: '性别分布',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: '#53ac85',
                    },
                },
                legend: {
                    orient: 'horizontal',
                    itemWidth: 6,
                    itemHeight: 6,
                    bottom: 10,
                    textStyle: {
                        fontSize: 10,
                    },
                    data: ['男', '女'],
                },
                series: [
                    {
                        name: '性别分布',
                        type: 'pie',
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            { value: 335, name: '男' },
                            { value: 310, name: '女' },
                        ],
                    },
                ],
            },
            loading: false,
        }
    },
    computed: {},
    watch: {
        sex: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let data = newVal.map((el) => {
                        return el.sex == 1 ? '男' : '女'
                    })
                    let series = newVal.map((el) => {
                        return { value: el.number, name: el.sex == 1 ? '男' : '女' }
                    })
                    this.echartsData.series[0].data = series
                    this.echartsData.legend.data = data
                }
            },
            deep: true,
        },
    },
    methods: {
        async getExceedData(val) {
            this.loading = true

            // color: ['#5796fe', '#35d495', '#fd3d5e'],

            this.loading = false
        },
    },
    created() {},
    mounted() {},
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
