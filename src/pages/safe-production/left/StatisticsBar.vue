<template>
    <div class="statistics-bar mb24">
        <div class="bar-item mb16" v-for="meta of barMeta" :key="meta.title">
            <span class="title">{{ meta.title }}</span>
            <div class="progress-text">
                <el-progress :percentage="meta.percent * 100" :color="meta.color" :show-text="false">
                </el-progress>
                <span>{{ meta.num }}</span>
            </div>
            {{ (meta.percent * 100).toFixed(2) + '%' }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'StatisticsBar',
    props: {
        countData: {
            type: Object,
            default: ()=> {}
        }
    },
    data() {
        return {
            barMeta: [
                { title: '消防告警', color: '#e13325', num: 0, percent: 0, type: 4 },
                { title: '基础管理类台账告警', color: '#f7c845', num: 0, percent: 0, type: 2 },
                { title: '生产设备设施类告警', color: '#ef8737', num: 0, percent: 0, type: 1 },
                { title: '作业安全类台账告警', color: '#12C9B4', num: 0, percent: 0, type: 3 }
            ]
        }
    },
    watch: {
        countData: {
            handler(data) {
                if (data) {
                    let total = data.num||0
                    this.barMeta.map(meta=> {
                        let numObj = data.alarmTypeCountNums.filter((item) => {
                            return item.type == meta.type
                        })[0]
                        meta.num = numObj.num || 0
                        meta.percent = meta.num / (total||1)
                    })
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
@media screen and (max-width: 1536px){
    .statistics-bar {
        height: 34vh;
    }
}
@media screen and (min-width: 1537px){
    // .statistics-bar {
    //     height: 25vh;
    // }
}
.statistics-bar {
    .title {
        font-size: 14px;
    }
    .progress-text {
        .flex(row, space-between);
        >*:first-child {
            flex: 4;
        }
        >*:last-child {
            .ml16;
            flex: 1;
        }
    }
    ::v-deep {
        .el-progress-bar__outer {
            background: #E4E4E4; 
        }
    }
}

</style>
