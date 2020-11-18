<template>
    <div class="home-page">
        <echarts-module />
        <summary-module />
    </div>
</template>

<script>
import EchartsModule from './components/Echarts'
import SummaryModule from './components/Summary'
export default {
    components: { EchartsModule, SummaryModule }
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.home-page {
    // .mt32;
    .p16;
    width: 100vw;
    height: 100%;
    overflow: hidden;
}
</style>