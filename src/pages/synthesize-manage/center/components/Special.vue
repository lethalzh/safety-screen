<template>
    <div class="special-container">
        <div class="head">
            <div class="left">
                <div style="fontSize:2rem">特殊人员</div>
            </div>
        </div>
        <div class="item" v-loading="loading">
            <div class="item-list" v-for="item in list" :key="item.idNumber">
                <div class="left">
                    <div class="user-info">
                        <div style="minWidth:6rem">{{ item.name }}</div>
                        <div style="minWidth:5rem">{{ $getState('dict', 'sex')[item.sex] }}</div>
                        <div style="minWidth:8rem">年龄：{{ item.age }}</div>
                        <div>籍贯：{{ item.nativePlace }}</div>
                    </div>
                    <div class="user-detail">
                        <div class="">
                            <span class="tag" >{{ $getState('dict', 'mtype')[item.mtype] }}</span>
                        </div>
                        <div class="id word-ellipsis" style="fontSize:0.6rem">
                            <span>身份证号：{{ item.idNumber }}</span>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <el-image class="img" style="width: 50px; height:50px; borderRadius:2px;" :src="renderImg(item.photo)" :preview-src-list="[renderImg(item.photo)]" fit="contain"></el-image>
                </div>
            </div>
        </div>
        <div class="page" style="color: #fff;">
            <el-pagination
                :background="true"
                style="padding-left: 0"
                layout="prev, pager, next"
                :page-size="pageSize"
                @current-change="
                    (page) => {
                        pageNum = page
                        getList()
                    }
                "
                :current-page="pageNum"
                :total="total"
            ></el-pagination>
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            loading: false,
            noMore: false,
            list: [],
            pageNum: 1,
            textHeight: null,
            total: 0, //总共页数
            pageSize: 10, //每页记录数
        }
    },
    methods: {
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
            if (res && res.rows && !res.error) {
                this.list = res.rows
                this.total = res.total || 8
            } else {
                return
            }
        },

    },
    mounted() {
        this.getList()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.special-container {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    .head {
        .fb-left;
        .pb10;
        .pr;
        z-index: 10;
        .left {
            color: @base-font-color;
        }
    }
    .item {
        height: calc(100% - 90px);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;

        .item-list {
            .theme-color-9;
            margin-bottom: 1rem;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            .p10;
            .left {
                flex: 0 0 75%;
                .user-info {
                    display: flex;
                    justify-content: flex-start;
                    > div {
                        padding-right: 16px;
                    }
                    margin-bottom: 10px;
                }
                .user-detail {
                    display: flex;
                    > div {
                        &:first-child {
                            flex: .5;
                        }
                        span {
                            font-size: 0.8rem;
                        }
                    }
                    .tag {
                        font-size: 0.8rem;
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
    .page {
        color: @base-font-color;
        .pr;
        z-index: 101;
        .flex(row, space-between);
        .mt10;
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
    .item /deep/ .el-loading-mask {
        background-color: @loading-background;
    }
}
</style>
