<!--  -->
<template>
    <div class="special">
        <div class="head">
            <div class="left">
                <span>特殊人员</span>
                <img src="@/assets/img/yellowMore.png" alt />
            </div>
            <div class="more" style="cursor: pointer" @click="showSpecialMore">更多&nbsp;></div>
        </div>
        <div class="item">
            <div class="mt10" style="text-align: center" v-if="!list.length">暂无数据</div>
            <div class="item-list" v-for="item in list" :key="item.idNumber">
                <div class="left">
                    <div class="user-info">
                        <div>{{ item.name }}</div>
                        <div>{{ $getState('dict', 'sex')[item.sex] }}</div>
                        <div>{{ item.age }}</div>
                        <div>籍贯：{{ item.nativePlace }}</div>
                    </div>
                    <div class="user-detail">
                        <div class="tag word-ellipsis">
                            <span>{{ $getState('dict', 'mtype')[item.mtype] }}</span>
                        </div>
                        <div class="id word-ellipsis">
                            <span>身份证号：{{ item.idNumber }}</span>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <el-image class="img" style="width: 50px; height:50px; borderRadius:2px;" :src="renderImg(item.photo)" :preview-src-list="[renderImg(item.photo)]" fit="contain"></el-image>
                </div>
            </div>
            <div style="text-align: center">了解更多，请点击更多按钮</div>
           
        </div>
        <div class="bottom">
            <el-button plain @click="dialogVisible = true">
                添加
            </el-button>
        </div>
        <special-add :dialog-visible.sync="dialogVisible" />
    </div>
</template>

<script>
import SpecialAdd from './SpecialAdd'
var CronJob = require('cron').CronJob
export default {
    components: { SpecialAdd },
    data() {
        return {
            loading: false,
            pic: '../../assets/img/sanitation/videoBg1.png',
            noMore: false,
            list: [],
            pageNum: 1,
            pageSize: 20,
            dialogVisible: false,
        }
    },
    computed: {},
    watch: {},
    methods: {
        showSpecialMore() {
            this.$bus.$emit('synthesize-manage-center', 'special')
        },
        renderImg(photo) {
            return `http://${this._api.baseUrl}/safety/file/downFile/${photo}`
        },
        async getList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'peopleMonitoring', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            })
            this.loading = false
            if (res && res.rows) {
                this.list = res.rows
            } else {
                return
            }
        },
    },
    mounted() {
        this.cron = new CronJob(
            '*/15 * * * * *',
            () => {
                this.getList()
            },
            null,
            false,
            "Asia/Chongqing"
        )
        this.cron.start()
        this.getList()
    },
    beforeDestroy() {
        this.cron.stop()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
@media screen and (max-width: 1536px){
    .special {
        .item {
            .item-list {
                height: calc(100% * 1 - 1rem);
            }
        }
    }
}
@media screen and (min-width: 1537px){
    .special {
        .item {
            .item-list {
                height: calc(100% * 0.5 - 1rem);
            }
        }
    }
}
.special {
    height: 34vh;
    overflow-y: hidden;
    .p10;
    width: 100%;
    color: @base-font-color;
    .head {
        .fb-left;
        .pb10;
        .pr;
        z-index: 2;
        .left {
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
                // border-bottom: 2px soild @base-font-color;
            }
        }
        .reload-icon {
            transition: 1s;
            cursor: pointer;
            font-size: 16px;
            &:hover {
                transform: rotate(360deg);
            }
        }
    }
    .item {
        height: calc(100% - 80px - 40px);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;

        .item-list {
            // height: calc(100% * 0.5 - 1rem);
            .theme-color-6;
            margin-bottom: 1rem;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items:center;
            .p10;
            .left {
                flex: 0 0 75%;
                .user-info {
                    display: flex;
                    justify-content: flex-start;
                    > div {
                        font-size: 1.3rem;
                        padding-right: 16px;
                    }
                    margin-bottom: 10px;
                }
                .user-detail {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    > div {
                        span {
                            .db;
                            font-size: 1rem;
                        }
                    }
                    .tag {
                        color: @base-font-color;
                        padding: 2px;
                        border: 1px solid @base-font-color;
                        border-radius: 5px;
                    }
                    
                }
            }
            .right {
                flex: 0 1 auto;
                text-align: right;
            }
        }
    }

    .item::-webkit-scrollbar {
        display: none;
    }
    .bottom {
        padding-top: 5px;
        padding-right: 5px;
        text-align: right;
    }
    /deep/ .el-button {
        .theme-color-3;
        border: 1px solid @theme-color;
        padding: 6px 12px;
        // background-color: @theme-color;
    }
    .right /deep/ .el-image__error {
        font-size: 1rem;
    }
    .right /deep/ .el-image-viewer__close {
        position: relative;
        top: 100px;
        left: 90vw;
    }
    .right /deep/ .el-icon-circle-close {
        font-size: 40px;
    }
}
</style>
