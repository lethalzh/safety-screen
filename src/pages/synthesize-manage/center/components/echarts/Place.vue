<!--  -->
<template>
    <div class="partcomwithborder" style="padding:10px">
        <line-echarts :echartsData="echartsData" chartsId="place-pie" v-loading="loading" height="30vh"></line-echarts>
    </div>
</template>

<script>
import LineEcharts from './Echarts'
export default {
    components: {
        LineEcharts,
    },
    props: {
        addr: {
            type: Array,
        },
    },
    data() {
        return {
            echartsData: {
                title: {
                    text: '主要居住地TOP5',
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
                    bottom: 0,
                    textStyle: {
                        fontSize: 10,
                    },
                    data: ['居住地一', '居住地二', '居住地三', '居住地四', '居住地五', '其他'],
                },
                series: [
                    {
                        name: '主要居住地',
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
                            { value: 0, name: '居住地一' },
                            { value: 0, name: '居住地二' },
                            { value: 0, name: '居住地三' },
                            { value: 0, name: '居住地四' },
                            { value: 0, name: '居住地五' },
                            { value: 0, name: '其他' },
                        ],
                    },
                ],
            },
            loading: false,
        }
    },
    computed: {},
    watch: {
        addr: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let data = newVal.map((el) => el.addr)
                    let series = newVal.map((el) => {
                        return { value: el.number, name: el.addr }
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
