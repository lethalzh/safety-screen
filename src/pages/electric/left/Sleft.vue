<template>
    <div class="electric-left" ref="left-container">
        <i 
            class="hidden-icon" 
            :class="hiddenState?'el-icon-caret-left':'el-icon-caret-right always-show'"
            :style="hiddenState?'right: -10px':'right: -40px'"
            @click="transitionMove($refs['left-container'], hiddenState?'left':'recover'); hiddenState = !hiddenState"
        />
        <statistics-number ref="numberRefs" :count-data="countData" class="statistics" />
        <statistics-bar ref="barRefs" :count-data="countData" class="statistics" />
    </div>
</template>

<script>
import StatisticsNumber from './components/StatisticsNumber'
import StatisticsBar from './components/StatisticsBar'
import { transitionMove } from '@/utils/index'
var CronJob = require('cron').CronJob
export default {
    components: { StatisticsNumber, StatisticsBar },
    data() {
        return {
            cron: null,
            countData: {},
            hiddenState: true
        }
    },
    created() {
        this.$bus.$on('updateElectricType',()=>{
            this.getList();
        }).off(this,'updateElectricType')
        // type: this._settings.electricType
    },
    mounted() {
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
        this.getList()
    },
    beforeDestroy() {
        this.cron.stop()
    },
    methods: {
        transitionMove,
        async getList() {
            const res = await this.$http.reqApi('data', 'monStatCount', {
                regionId: this._dict.regionRoot.code,
                type: this._settings.electricType
            })
            if (res && res.rows && !res.error) {
                this.countData = res.rows[0]
            } else {
                return
            }
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.electric-left {
    .mr16;
    width: calc(15vw + 20px) !important;
    .shadow-light;
    background: @background;
    .p10;
    &:hover {
        i {
            display: block
        }
    }
    .statistics {
        .pb16;
    }
}
</style>
