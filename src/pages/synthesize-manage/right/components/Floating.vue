<!--  -->
<template>
    <div class="floating">
        <div class="head">
            <div class="left">
                <span>流动人口</span>
                <img src="@/assets/img/yellowMore.png" alt />
            </div>
            <!-- <i class="el-icon-refresh-right reload-icon" @click="reload" /> -->
            <i class="el-icon-s-data icon-style" @click="showFloatMore" />
        </div>
        <div class="item" v-infinite-scroll="onLoad" :infinite-scroll-disabled="false" infinite-scroll-throttle-delay="1000">
            <div
                class="item-list"
                v-for="item in list"
                :key="item.idNumber"
                @click="
                    dialogVisible = true
                    current = item
                "
            >
                <div class="title">
                    <div class="user-info">
                        <div>{{ item.name }}</div>
                        <div>{{ $getState('dict', 'sex')[item.sex] }}</div>
                        <div>{{ item.age }}</div>
                        <div>籍贯：{{ item.nativePlace }}</div>
                    </div>
                    <div><i class="el-icon-arrow-right"></i></div>
                </div>
                <div class="content">
                    <div>{{ item.companyName }}</div>
                    <div>企业联系电话：{{ item.concatTel }}</div>
                </div>
            </div>
            <div v-if="loading" style="textAlign: center">加载中...</div>
            <div v-if="!loading && noMore" style="textAlign: center">没有更多了</div>
        </div>

        <floating-detail :dialog-visible.sync="dialogVisible" :info="current" />
    </div>
</template>

<script>
import FloatingDetail from './FloatingDetail'
// var CronJob = require('cron').CronJob
export default {
    components: { FloatingDetail },
    data() {
        return {
            current: {},
            dialogVisible: false,
            loading: false,
            noMore: false,
            list: [],
            pageNum: 1,
            pageSize: 10,
        }
    },
    computed: {},
    watch: {},
    methods: {
        showFloatMore() {
            this.$bus.$emit('synthesize-manage-center', 'float')
        },
        onLoad() {
            if (this.noMore) return
            this.loading = true
            setTimeout(() => {
                this.pageNum++
                this.getList()
            }, 1500)
        },
        async getList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'flowPeople', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            })
            this.loading = false
            if (res && res.rows) {
                res.rows.length < 10 && (this.noMore = true)
                this.list = this.list.concat(res.rows)
            } else {
                this.noMore = true
                return
            }
        },
        reload() {
            this.pageNum = 1
            this.noMore = false
            this.list = []
            this.getList()
        },
    },
    mounted() {
        // this.cron = new CronJob(
        //     '*/15 * * * * *',
        //     () => {
        //         this.getList()
        //     },
        //     null,
        //     false,
        //     "Asia/Chongqing"
        // )
        // this.cron.start()
        this.getList()
    },
    beforeDestroy() {
        // this.cron.stop()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
@media screen and (max-width: 1536px){
    .floating {
        .item {
            .item-list {
                height: calc(100% * 0.5 - 1rem);
            }
        }
    }
}
@media screen and (min-width: 1537px){
    .floating {
        .item {
            .item-list {
                height: calc(100% * 0.3333 - 1rem);
            }
        }
    }
}
.floating {
    height: 26vh;
    overflow-y: hidden;
    .p10;
    width: 100%;
    color: @base-font-color;
    .head {
        .fb-left;
        .pb10;
        .pr;
        .icon-style {
            cursor: pointer;
            color: @theme-color;
        }
        z-index: 2;
        .left {
            &:after {
                content: '';
                width: 30px;
                height: 2px;
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
        height: calc(100% - 35px);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;

        .item-list {
            // height: calc(100% * 0.3333 - 1rem);
            .theme-color-6;
            cursor: pointer;
            margin-bottom: 1rem;
            border-radius: 4px;
            .p10;
            .title {
                display: flex;
                justify-content: space-between;
                .user-info {
                    display: flex;
                    justify-content: flex-start;
                    > div {
                        padding-right: 16px;
                    }
                }
            }
            .content {
                > div {
                    font-size: 0.8rem;
                }
                display: flex;
                justify-content: space-between;
            }
        }
    }

    .item::-webkit-scrollbar {
        display: none;
    }
}
</style>
