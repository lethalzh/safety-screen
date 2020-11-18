<template>
    <div class="summary">
        <div class="summary-item" v-for="(item,index) in list" :key="item.key">
            <detail-item :layout="index%2?'top':'bottom'" :info="item" />
        </div>
    </div>
</template>

<script>
import DetailItem from './Summary/DetailItem'
export default {
    components: { DetailItem },
    data() {
        return {
            list: []
        }
    },
    mounted(){
        this.list = this._settings.homeList
    }
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.summary {
    height: calc(50% - 16px);
    width: 100%;
    border: 1px solid @theme-color;
    .mt16;
    .summary-item {
        display: inline-block;
        width: 25%;
        height: 100%;
    }
}
</style>
