<template>
    <div class="violation-unhandled">
        <div class="unhandled-content" v-loading="loading">
            <div class="unhandled-item" v-for="(alarm, key) in lists" :key="alarm.companyNo">
                <div class="item-content">
                    <div class="left">
                        <div class="row-1">
                            <div class="name">
                                {{ alarm.companyName }}
                            </div>
                        </div>
                        <div class="row-2">
                            <div class="concatPerson">联系人：{{ alarm.personInCharge }}</div>
                            <div class="concatTel">联系电话：{{ alarm.contactNumber }}</div>
                            <!-- <div class="concatTel">地址：{{ alarm.contactNumber }}</div> -->
                        </div>
                    </div>
                    <div class="right">
                        <div class="btn" @click="handle(alarm, key)">
                            处理
                        </div>
                    </div>
                </div>
                <div class="detail">
                    <div class="detail-title">
                        <div>未处理的违规(次)：{{ alarm.total }}</div>
                        <div class="detail-more" @click="handleChange(alarm.companyNo, key)">{{ showMore == key ? '收起' : '展开更多' }}</div>
                    </div>
                    <div class="detail-scroll mt10" v-loading="loadingDetail" v-if="showMore == key">
                        <!-- <div class="detail-list" v-infinite-scroll="onLoad(alarm.companyNo)" :infinite-scroll-disabled="busy" infinite-scroll-throttle-delay="200" infinite-scroll-distance="50"> -->
                        <div class="detail-list">
                            <div class="detail-item" v-for="(item, index) in detailLists || []" :key="item.companyNo">
                                <div class="detail-top">{{ index + 1 }}</div>
                                <div class="detail-info">
                                    <div>{{ format(item.violationType) }}</div>
                                    <div>{{ item.violationTime ? $dayjs(item.violationTime).format('YYYY.MM.DD') : '-' }}</div>
                                    <div>{{ item.violationTime ? $dayjs(item.violationTime).format('HH:mm:ss') : '-' }}</div>
                                </div>
                            </div>
                            <div v-if="loadingMore" @click="onLoad(alarm.companyNo)" style="textAlign: center;cursor: pointer;">点击加载更多</div>
                            <div v-if="!loadingMore && noMore" style="textAlign: center">没有更多了</div>
                        </div>
                    </div>
                </div>
                <div class="handle p10" v-if="showDetail == key">
                    <handle-module :key="key" :company="company" style="background: #f5f5f5;"/>
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
                        showDetail = null
                        getCompanyList()
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
import { dictByBit } from '@/utils/index'
import HandleModule from './HandleModule'
export default {
    name: 'violationProcessed',
    components: { HandleModule },
    data() {
        return {
            loading: false,
            loadingDetail: false,
            pageNum: 1,
            lists: [],
            detailLists: [],
            total: 0, //总共页数
            pageSize: 10, //每页记录数
            top: 0,
            cron: null,
            pageNumDetail: 1,
            pageSizeDetail: 5,
            company: {},
            showDetail: null,
            showMore: null,
            noMore: false,
            loadingMore: false,
            busy: false,
        }
    },
    created() {
        this.$bus.$on('updateElectricType',()=>{
            this.getCompanyList();
        })
    },
    mounted() {
        this.getCompanyList()
    },
    methods: {
        onLoad(id) {
            if (this.noMore) return
            this.loadingDetail = true
            setTimeout(() => {
                this.pageNumDetail++
                this.getCompanyListDetail(id)
            }, 1500)
        },
        init() {
            this.pageNumDetail = 1
            this.pageSizeDetail = 5
            this.loadingMore = false
            this.detailLists = []
        },
        handleChange(id, key) {
            this.init()
            if (this.showMore == key) {
                this.showMore = null
            } else {
                this.showMore = key
                this.getCompanyListDetail(id)
            }
        },
        //展开处理部分
        handle(val, index) {
            this.company = val

            if (this.showDetail == index) {
                this.showDetail = null
            } else {
                this.showDetail = index
            }
        },
        format(value) {
            return dictByBit(this.$getState('dict', 'violationType'), value)
        },
        close() {
            this.show = false
        },
        // 获取每个公司的违规情况
        async getCompanyListDetail(companyNo) {
            this.loadingDetail = true
            const res = await this.$http.reqApi('data', 'electViolations', {
                pageNum: this.pageNumDetail,
                pageSize: this.pageSizeDetail,
                deal: 0,
                companyNo,
            })
            this.loadingDetail = false

            if (res && res.rows && !res.error) {
                if (res.rows.length < 5) {
                    this.noMore = true
                    this.loadingMore = false
                } else {
                    this.loadingMore = true
                }

                this.detailLists = this.detailLists.concat(res.rows)
            } else {
                this.loadingMore = false
                this.noMore = true
                return
            }
        },
        async getCompanyList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'violationCount', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                deal: 0,
                type: this._settings.electricType,
                regionIds: this._dict.regionRoot.code
            })
            this.loading = false
            if (res && res.rows && !res.error) {
                this.lists = res.rows
                this.total = res.total || 8
            } else {
                return
            }
        },
    },
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.violation-unhandled {
    height: calc(100% - 70px);
    z-index: 200;
    .unhandled-content::-webkit-scrollbar {
        display: none;
    }
    .page {
        color: @base-font-color;
        .pr;
        z-index: 101;
        .flex(row, space-between);
        .mt10;
    }
    .unhandled-content {
        color: @base-font-color;
        overflow-y: scroll;
        height: calc(100%);
        .unhandled-item {
            .theme-color-3;
            .pr;
            margin-bottom: 1rem;
            align-items: center;
            .item-content {
                border-radius: 0.5rem;
                padding: 10px;
                .flex(row, space-between, center, nowrap);

                .left {
                    flex: 0 1 90%;
                    .row-1 {
                        display: flex;
                        justify-content: space-between;
                        .name {
                            font-size: 1.5rem;
                            font-weight: bold;
                        }
                    }
                    .row-2 {
                        display: flex;
                        margin-top: 0.5rem;
                        justify-content: flex-start;
                        div {
                            margin-right: 1rem;
                        }
                    }
                }

                .right {
                    .btn {
                        font-size: 1rem;
                        cursor: pointer;
                        z-index: 1;
                        width: 40px;
                        border-radius: 5px;
                        text-align: center;
                        padding: 6px 0;
                        color: @background;
                        background-color: @theme-color-second;
                    }
                }
            }
            .detail {
                // overflow: hidden;
                padding: 0px 10px 10px 10px;
                .detail-top {
                    text-align: center;
                    font-size: 1rem;
                    margin: auto 0;
                    line-height: 3vh;
                    font-weight: bold;
                    font-size: 0.8rem;
                    width: 3vh;
                    height: 3vh;
                    color: @theme-color-second;
                    background-color: @theme-color;
                    border: 0.1rem solid @theme-color-second;
                    border-radius: 50%;
                    margin-right: 1rem;
                }
                .detail-scroll {
                    .pr;
                    z-index: 9999;
                    height: 15vh;
                    overflow: hidden;
                    .detail-list {
                        .detail-item {
                            display: flex;
                            align-items: center;
                            background-color: @none-background;
                            padding-bottom: 1rem;
                        }
                        height: 15vh;
                        overflow-y: scroll;
                        -ms-overflow-style: none;
                        scrollbar-width: none;

                        .detail-info {
                            .flex(row, flex-start, center, nowrap);
                            div {
                                margin-right: 3rem;
                            }
                        }
                    }
                }
                .detail-title {
                    .flex(row, space-between, center, nowrap);
                }
                .detail-more {
                    cursor: pointer;
                }

                .detail-list::-webkit-scrollbar {
                    display: none;
                }
            }
            .handle {
                width: 100%;
                color: @base-font-color;
                height: 50%;
                .mt10;
            }
        }
    }
}

/deep/ .el-loading-mask {
    background-color: @loading-background;
}
</style>
