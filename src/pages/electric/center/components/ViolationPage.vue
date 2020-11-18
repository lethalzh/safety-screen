<template>
    <div class="violation-page" v-if="moreDisplay">
        <div class="head">
            <div class="title">
                <span>违规企业</span>
            </div>
        </div>
        <div class="type-radio">
            <el-radio-group v-model="radio" size="small" text-color="#ffffff">
                <el-radio style="border: 1px solid #12C9B4;" label="violation-untreated" border>待处理</el-radio>
                <el-radio style="border: 1px solid #12C9B4;" label="violation-processed" border>已处理</el-radio>
                <el-radio style="border: 1px solid #12C9B4;" label="violation-rank" border>违规企业排名</el-radio>
            </el-radio-group>
        </div>
        <div class="component-cutover" v-loading="loading">
            <component :key="radio" :is="radio">
                <el-button @click="close" type="primary">关闭</el-button>
            </component>
        </div>
    </div>
</template>

<script>
import ViolationProcessed from './ViolationProcessed'
import ViolationRank from './ViolationRank'
import ViolationUntreated from './ViolationUnhandled'
export default {
    name: 'violationPage',
    components: { ViolationProcessed, ViolationRank, ViolationUntreated },
    props: ['moreDisplay','opt'],
    data() {
        return {
            radio: 'violation-untreated',
            loading: false,
            cron: null,
            components: [{ name: 'violation-processed' }, { name: 'violation-rank' }, { name: 'violation-untreated' }],
        }
    },
    watch:{
        opt(val){
            console.log('val',`violation-${val}`);
            this.radio = `violation-${val}`
        },
        radio(newVal,oldVal){
            if(newVal!=oldVal) this.$http.requestAbort()
        }
    },
    beforeDestroy() {},
    methods: {
        close() {
            this.$emit('more-show')
        },
    },
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
@height: ~'calc(100vh - 20px - 20px - 20px - (100vh - 20px - 20px) * .10 - 5vh)';
.violation-page {
    width: 80%;
    margin-top: 2vh;
    margin-left: auto;
    margin-right: auto;
    height: @height;
    // border: 2px solid @theme-color-second;
    .shadow-light;
    background: @background;
    z-index: 100;
    .component-cutover::-webkit-scrollbar {
        display: none;
    }

    .head {
        color: @base-font-color;
        display: flex;
        justify-content: space-between;

        .title {
            margin-top: 1rem;
            margin-left: 1rem;
            margin-bottom: 1rem;
            flex: 1;
            span {
                font-size: 1.5rem;
            }
        }
        .close {
            margin-top: 1rem;
            margin-right: 1rem;
            .el-icon-circle-close:before {
                font-size: 2rem;
            }
            .el-icon-circle-close:hover {
                color: @theme-color;
            }
        }
        .type-radio {
            .pr;
            z-index: 200;
            text-align: center;
            .mt16;
        }
    }
    .top {
        text-align: center;
        margin: auto 0;
        line-height: 2.5vh;
        width: 2.5vh;
        height: 2.5vh;
        color: @theme-color;
        border: 0.1rem solid @theme-color;
        border-radius: 50%;
    }
    .component-cutover {
        color: @base-font-color;
        height: calc(100% - 70px);
        overflow-y: scroll;
        .p10;
    }
}
.type-radio /deep/ .el-radio {
    margin-right: 10px;
    margin-left: 10px;
    width: calc((100% - 60px) * 0.3333);
    text-align: center;
    // width: 25%;
}
.type-radio /deep/ .el-radio__input {
    display: none;
}
.type-radio /deep/ .is-checked {
    .el-radio__label {
        color: @theme-color-second !important;
    }
    .theme-color-4;
}

.type-radio /deep/ .el-radio-group {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.type-radio /deep/ .el-textarea__inner {
    color: @base-font-color;
    // background-color: null;
    .theme-color-3;
    border: 1px solid @theme-color-second;
}
</style>
