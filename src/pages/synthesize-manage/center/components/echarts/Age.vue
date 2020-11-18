<!--  -->
<template>
    <div class="partcomwithborder" style="padding:10px">
        <line-echarts :echartsData="echartsData" chartsId="age-pie" v-loading="loading" height="30vh"></line-echarts>
    </div>
</template>

<script>
import LineEcharts from './Echarts'
export default {
    components: {
        LineEcharts,
    },
    props: {
        age: {
            type: Array,
        },
    },
    data() {
        return {
            echartsData: {
                title: {
                    text: '年龄分布',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: '#53ac85',
                    },
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '10%',
                    top: '10%',
                    containLabel: true,
                },
                legend: {
                    orient: 'horizontal',
                    itemWidth: 6,
                    itemHeight: 6,
                    bottom: 0,
                    textStyle: {
                        fontSize: 10,
                    },
                    data: ['<20岁', '20~30岁', '31~40岁', '41~50岁', '>50岁'],
                },
                series: [
                    {
                        name: '年龄分布',
                        type: 'pie',
                        radius: ['40%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            { value: 335, name: '<20岁' },
                            { value: 310, name: '20~30岁' },
                            { value: 234, name: '31~40岁' },
                            { value: 135, name: '41~50岁' },
                            { value: 548, name: '>50岁' },
                        ],
                    },
                ],
            },
            loading: false,
        }
    },
    computed: {},
    watch: {
        age: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let data = newVal.map((el) => {
                        return this._dict.ageType[el.ageType]
                    })
                    let series = newVal.map((el) => {
                        return { value: el.number, name: this._dict.ageType[el.ageType] }
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
