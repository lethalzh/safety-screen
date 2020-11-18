<template>
    <div>
        <div v-if="vertical" class="process" :style="{ width: width + 'px', height: (height || 15) + 'px' }">
            <div class="p1" :style="{ background: color1, 'border-radius': (height || 15) * 0.5 + 'px' }">
                <div
                    class="p2"
                    :style="{
                        'margin-top': height - height * radian + 'px',
                        background: color2,
                        height: height * radian + 'px',
                        'border-radius': (width || 15) * 0.5 + 'px',
                    }"
                ></div>
            </div>
        </div>
        <div v-else class="process" :style="{ width: width + 'px', height: (height || 15) + 'px' }">
            <div class="p1" :style="{ background: color1, 'border-radius': (height || 15) * 0.5 + 'px' }">
                <div
                    class="p2"
                    :style="{
                        background: color2,
                        width: width * radian + 'px',
                        'border-radius': (height || 15) * 0.5 + 'px',
                    }"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'width', //组件宽
        'radian', //环的进度
        'color1', //环底色
        'color2', //环前景色
        'height',
        'vertical', //horizontal水平,vertical垂直
    ],
    data() {
        return {}
    },
    methods: {},
    mounted() {},
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.process {
    .p1 {
        width: 100%;
        height: 100%;
        .pr;
        z-index: 1;
        overflow: hidden;
        background: #e4e4e4 !important;
    }
    .p2 {
        .pr;
        z-index: 2;
        height: 100%;
    }
}
</style>
