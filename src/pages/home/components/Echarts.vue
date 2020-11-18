<template>
    <div class="echarts">
        <div class="echarts-item">
            <safe-progress :style="{background: colorBlue==1 ?'#e5fbf9' : null}" @show="childHoverChange" @clear="clearHover" />
        </div>
        <div class="echarts-item" >
            <sanitation :style="{background: colorBlue==2 ?'#e5fbf9' : null}" @show="childHoverChange" @clear="clearHover" />
        </div>
        <div class="echarts-item">
            <default @show="hoverChange" @clear="clearHover" :colorBlue="childColorBlue" />
        </div>
        <div class="echarts-item">
            <production :style="{background: colorBlue==3 ?'#e5fbf9' : null}" @show="childHoverChange" @clear="clearHover" />
        </div>
        <div class="echarts-item">
            <floating :style="{background: colorBlue==4 ?'#e5fbf9' : null}" @show="childHoverChange" @clear="clearHover" />
        </div>
    </div>
</template>

<script>
import SafeProgress from './Echarts/SafeProgress'
import Floating from './Echarts/Floating'
import Production from './Echarts/Production'
import Sanitation from './Echarts/Sanitation'
import Default from './Echarts/Default'
export default {
    components: { SafeProgress, Floating, Production, Sanitation, Default },
    data() {
        return {
            colorBlue: '',
            childColorBlue: ''
        }
    },
    methods: {
        hoverChange(val){
            this.colorBlue = val
        },
        childHoverChange(val){
            this.childColorBlue = val
        },
        clearHover(){
            this.childColorBlue = null
            this.colorBlue = null
        }
    },
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.echarts {
    height: 50%;
    width: 100%;
    border: 1px solid @theme-color;
    display: flex;
    flex-wrap: nowrap;
    background-image: url('~@/assets/img/bg-home.png');
    background-position: center 70%;
    background-repeat: no-repeat;
    background-size: 100%;
    .echarts-item {
        width: 20%;
    }
}
</style>
