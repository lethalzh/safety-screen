<template>
    <!-- 滚动横幅 -->
    <div class="fire-warning-tips" @mouseover="speed = 0" @mouseleave="speed = 500">
        <div class="text-container">
            以下企业发生消防告警：
            <span :data-index="index" class="text mr16" v-for="(item, index) in companyList" :key="item.companyNo">{{ item.companyName }}</span>
        </div>
    </div>
</template>
<script>
    export default {
        name: "FireWarningTips",
        props: {
            companyList: {
                type: Array,
                default: ()=> []
            }
        },
        data() {
           return {
               cancelId: null,
               speed: 500
           }
        },
        mounted() {
            const scrollText = document.querySelector('.text-container'),
                width = scrollText.offsetWidth
                  
            const req = ()=> {
                this.cancelId = requestAnimationFrame(()=> {
                    if(scrollText.offsetLeft > -width) {
                        scrollText.style.left = scrollText.offsetLeft - this.speed + 'px'
                        req()
                    } else {
                        scrollText.style.transition = 'none'
                        scrollText.style.left = document.querySelector('.fire-warning-tips').offsetWidth + 'px'
                        setTimeout(()=> {
                            scrollText.style.transition = '5s linear';
                            req()
                        }, 100)
                    }
                })
            }
            req()
        },
        beforeDestroy() {
            cancelAnimationFrame(this.cancelId)
        }
    }
</script>
<style lang="less" scoped>
    @import (reference) "~@/assets/css/common.less";
    .fire-warning-tips {
        width: 100%;
        .mt16;
        background: #f9818a;
        color: #ffffff;
        .br(5px);
        padding: 8px 10px;
        overflow: hidden !important;
        white-space: nowrap;
        .pr;
        z-index: 9;
        height: 30px;
        line-height: 1;

        .text-container {
            .dib;
            .mr16;
            .pa;
            font-size: 14px;
            // animation: horizonMove 5s linear infinite;
            transition: 5s linear;
            span {
                font-size: 14px;
            }
        }
    }
</style>