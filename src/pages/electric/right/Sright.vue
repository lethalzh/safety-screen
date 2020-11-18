<template>
    <div class="electric-right" ref="right-container">
        <i 
            class="hidden-icon" 
            :class="hiddenState?'el-icon-caret-right':'el-icon-caret-left always-show'"
            :style="hiddenState?'left: -10px':'left: -42px'"
            @click="transitionMove($refs['right-container'], hiddenState?'right':'recover'); hiddenState = !hiddenState"
        />
        <div class="electric-right-content">
            <violation-list />
            <electric-historical-ele></electric-historical-ele>
        </div>
    </div>
</template>

<script>
import ViolationList from './components/ViolationList'
import ElectricHistoricalEle from './components/ElectricHistoricalEle'
import { transitionMove } from '@/utils/index'
export default {
    components: { ViolationList, ElectricHistoricalEle },
    data() {
        return {
            hiddenState: true
        }
    },
    methods: {transitionMove}
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.electric-right {
    .shadow-light;
    .pr;
    &:hover {
        i {
            display: block
        }
    }
    .electric-right-content {
        .p16;
        z-index: 2;
        height: 100%;
        background: @background;
    }
}
</style>
