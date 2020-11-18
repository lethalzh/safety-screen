<template>
    <div class="electric">
        <div class="electric-content">
            <sleft class="content-left"></sleft>
            <scenter class="content-center"></scenter>
            <sright class="content-right"></sright>
        </div>
    </div>
</template>

<script>
import Sleft from './left/Sleft.vue'
import Scenter from './center/Scenter.vue'
import Sright from './right/Sright.vue'
export default {
    name: 'Electric',
    components: {
        Sleft,
        Scenter,
        Sright,
    },
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
@height: ~'calc(100vh - 20px - 20px - (100vh - 20px - 20px) * .10)';
.electric {
    .p16;
    .pr;
    z-index: 2;
    width: 100vw;
    height: 100%;
    .electric-content { 
        height: 100%;
        display: flex;
        width: 100%;
        position: relative;
        flex-wrap: nowrap;
        left: 0;
        .content-left {
            .pr;
            z-index: 9;
            width: 18vw;
        }
        .content-center {
            flex: 1;
        }
        .content-right {
            z-index: 9;
            width: 24%;
            height: 100%;
        }
    }
}
</style>
