<template>
    <div class="violation-list">
        <div class="head">
            <div class="title">
                <span>企业违规</span>
                <img src="@/assets/img/yellowMore.png" alt />
            </div>
            <div class="more" @click="showMore">更多&nbsp;></div>
        </div>
        <div class="type-radio">
            <el-radio-group v-model="radio" size="small">
                <el-radio label="untreated" border>待处理</el-radio>
                <el-radio label="processed" border>已处理</el-radio>
                <el-radio label="rank" border>违规企业排名</el-radio>
            </el-radio-group>
        </div>
        <div class="component-radio">
            <component :key="radio" :is="radio"></component>
        </div>
    </div>
</template>

<script>
import { deepClone } from '@/utils'
import Rank from './Rank'
import Processed from './Processed'
import Untreated from './Untreated'
export default {
    components: { Rank, Processed, Untreated },
    data() {
        return {
            radio: 'untreated',
            loading: false,
            pageNum: 1,
            lists: [],
            cron: null,
            components: [{ name: 'rank' }, { name: 'processed' }, { name: 'untreated' }],
        }
    },
    methods: {
        showMore() {
            this.$bus.$emit('openViolationRank', this.radio)
        },
    },
    watch:{
        radio(newVal,oldVal){
            if(newVal!=oldVal) this.$http.requestAbort()
        }
    }
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.violation-list {
    width: 100%;
    height: 35vh;
    overflow-y: hidden;
    .type-radio {
        .pr;
        z-index: 2;
        text-align: center;
    }
    .head {
        .fb-left;
        .pb10;
        .pr;
        z-index: 2;
        .title {
            &:after {
                content: '';
                width: 30px;
                height: 1px;
                background: @theme-color;
                margin-top: 2px;
                .db;
                .pa;
            }
            .fb-box-flex(1);
            .pr10;
            color: @base-font-color;
            span {
                margin-right: 8px;
                // border-bottom: 2px soild @theme-color;
            }
        }
        .more {
            color: @base-font-color;
            .tr;
            cursor: pointer;
        }
    }
}
.component-radio::-webkit-scrollbar {
    display: none;
}
.component-radio {
    height: calc(100% - 50px);
    overflow-y: scroll;
    padding-top: 20px;
}
/deep/ .el-loading-mask {
    background: @loading-background;
}
/deep/ .el-radio__input {
    display: none;
}
/deep/ .is-checked {
    .el-radio__label {
        color: @theme-color-second !important;
    }
    .theme-color-4;
}
/deep/ .el-radio {
    margin-right: 0;
    width: calc((100% - 20px) * 0.3333);
    text-align: center;
}
/deep/ .el-radio-group {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}
</style>
