<template>
    <div class="violation-handle" v-if="handleDisplay">
        <div class="head">
            <div class="title">
                <span>违规处理</span>
            </div>
            <div class="company-name">
                <span>{{ company.companyName || '-' }}</span>
            </div>
            <div class="close">
                <i @click="close" class="el-icon-circle-close"></i>
            </div>
        </div>
        <div class="handle-module">
            <handle-module :company="company" />
        </div>
    </div>
</template>

<script>
import HandleModule from './HandleModule'
export default {
    name: 'violationHandle',
    components: { HandleModule },
    props: ['handleDisplay', 'company'],
    data() {
        return {
            radio: 1,
            checkList: [],
            textarea: '',
            loading: false,
            top: 0,
            cron: null,
        }
    },
    methods: {
        close() {
            this.$emit('handle-show')
        },
    },
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
@height: ~'calc(100vh - 20px - 20px - 20px - (100vh - 20px - 20px) * .10 - 5vh)';
.violation-handle {
    width: 80%;
    margin-top: 2vh;
    margin-left: auto;
    margin-right: auto;
    height: @height;
    // border: 2px solid @theme-color;
    .shadow-light;
    background: @background;

    .p10;
    z-index: 100;
    .handle-module::-webkit-scrollbar {
        display: none;
    }

    .head {
        color: @base-font-color;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        .title {
            flex: 1;
            span {
                font-size: 1.5rem;
            }
        }
        .company-name {
            flex: 2;
            z-index: 9;
            width: 20vw;
            display: flex;
            flex-wrap: nowrap;
            span {
                font-size: 1.5rem;
            }
        }
        .close {
            margin-right: 1rem;
            .el-icon-circle-close:before {
                font-size: 2rem;
            }
            .el-icon-circle-close:hover {
                color: @theme-color;
            }
        }
    }
    .handle-module {
        color: @base-font-color;
        overflow-y: scroll;
        // .theme-color-1;
    }
}
/deep/ .el-loading-mask {
    background-color: @loading-background;
}
</style>
