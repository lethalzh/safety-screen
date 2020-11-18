<template>
    <div class="violation-processed">
        <div class="processed-content" v-loading="loading">
            <div class="processed-item" v-for="alarm in lists" :key="alarm.companyNo">
                <div class="item-detail">
                    <div class="row-1">
                        <div class="name">
                            {{ alarm.companyName }}
                        </div>
                        <div>处理时间：{{ $dayjs(alarm.dealDate).format('YYYY.MM.DD') }}</div>
                    </div>
                    <div class="row-2">
                        <div class="">违规次数：{{ alarm.dealCount }}</div>
                        <div class="">处理措施：{{ $getState('dict', 'deal')[alarm.deal] }}</div>
                        <div class="">处理人：{{ alarm.dealUser }}</div>
                        <div v-if="alarm.deal==1" class="">处理期限：{{ $dayjs(alarm.limitTime).format('YYYY.MM.DD') }}</div>
                        <div class="">状态：已处理</div>
                    </div>
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
export default {
    name: 'violationProcessed',
    data() {
        return {
            loading: false,
            pageNum: 1,
            lists: [],
            total: 0, //总共页数
            pageSize: 10, //每页记录数
            top: 0,
            cron: null,
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
    beforeDestroy() {},
    methods: {
        format(value) {
            return dictByBit(this.$getState('dict', 'violationType'), value)
        },
        close() {
            this.show = false
        },
        async getCompanyList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'violationHasdel', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
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
.violation-processed {
    height: calc(100% - 70px);
    z-index: 200;
    .processed-content::-webkit-scrollbar {
        display: none;
    }
    .page {
        // height: 60px;
        color: @base-font-color;
        .pr;
        z-index: 101;
        .flex(row, space-between);
        .mt10;
    }
    .processed-content {
        color: @base-font-color;
        height: calc(100%);

        overflow-y: scroll;
        .processed-item {
            .pr;
            display: flex;
            // justify-content: flex-start;
            align-items: center;
            .item-detail {
                border-radius: 0.5rem;
                flex: 1;
                margin-bottom: 1rem;
                .theme-color-3;
                padding: 1.5rem;
                .row-1 {
                    display: flex;
                    justify-content: space-between;
                    .name {
                        font-size: 1.3rem;
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
        }
    }
}
/deep/ .el-loading-mask {
    background-color: @loading-background;
}
</style>
