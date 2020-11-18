<template>
    <div class="statistics-bar" v-loading="loading">
        <div class="statistics-bar-item" v-for="count in countps" :key="count.title">
            <div class="title">{{ count.title }}</div>
            <div class="content">
                <process :width="pwidth" :height="8" :radian="count.bfb" color1="#fff" :color2="count.color"></process>
                <div class="percent">{{ (count.bfb * 100).toFixed(2) }}%</div>
            </div>
        </div>
    </div>
</template>

<script>
import Process from './Process'
export default {
    name: 'count2',
    props: ['countData'],
    components: { Process },
    data() {
        return {
            loading: false,
            countps: [
                { title: '合规生产', color: '#76da91', num: 0, bfb: 0 },
                {
                    title: '停工',
                    color: '#a9a9a9',
                    num: 0,
                    bfb: 0,
                },
                {
                    title: '未响应停产',
                    color: '#ff4e18',
                    num: 0,
                    bfb: 0,
                },
                {
                    title: '未开启治污设备',
                    color: '#F2DF54',
                    num: 0,
                    bfb: 0,
                },
                {
                    title: '未响应减产',
                    color: '#ff7e11',
                    num: 0,
                    bfb: 0,
                },
            ],
        }
    },
    
    watch: {
        countData: {
            handler(val) {
                if (val) {
                    this.countps[0].num = val.qualifiedCount || 0
                    this.countps[0].bfb = ((val.qualifiedCount || 0) / (val.factoryCount || 1)).toFixed(2)
                    this.countps[1].num = val.unrunCount || 0
                    this.countps[1].bfb = ((val.unrunCount || 0) / (val.factoryCount || 1)).toFixed(2)
                    this.countps[2].num = val.unStopCount || 0
                    this.countps[2].bfb = ((val.unStopCount || 0) / (val.factoryCount || 1)).toFixed(2)
                    this.countps[3].num = val.unTreatmentCount || 0
                    this.countps[3].bfb = ((val.unTreatmentCount || 0) / (val.factoryCount || 1)).toFixed(2)
                    this.countps[4].num = val.unEnergyCount || 0
                    this.countps[4].bfb = ((val.unEnergyCount || 0) / (val.factoryCount || 1)).toFixed(2)
                }
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        pwidth() {
            return (window.innerWidth - 24 * 2 - 20 * 2) * 0.12 * 0.7
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.statistics-bar {
    height: 30vh;
    z-index: 1;
    .statistics-bar-item {
        height: 5vh;
        color: @base-font-color;
        .pb10;
        .title {
            z-index: 99;
            margin-bottom: 0.5vh;
            margin-top: 0.5vh;
        }
        .content {
            .fb-left;
            .n {
                .fb-box-flex(1);
                .pl16;
                .tr;
            }
        }
        .percent {
            .pl16;
            font-size: 10px;
        }
    }
}
</style>
