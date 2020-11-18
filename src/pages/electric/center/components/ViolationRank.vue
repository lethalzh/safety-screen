<template>
    <div class="violation-rank">
        <div class="rank-content" v-loading="loading">
            <div class="rank-item" v-for="(alarm, index) in lists" :key="alarm.companyNo">
                <div class="top">{{ handleTop(index) }}</div>
                <div class="item-detail">
                    <div class="row-1">
                        <div class="name">
                            {{ alarm.companyName }}
                        </div>
                        <div class="ledgerStat">违规次数：{{ alarm.total }}</div>
                    </div>
                    <div class="row-2">
                        <div class="concatPerson">联系人：{{ alarm.personInCharge }}</div>
                        <div class="concatTel">联系电话：{{ alarm.contactNumber }}</div>
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
import { deepClone } from '@/utils'
export default {
    name: 'violationRank',
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
        handleTop(val) {
            return (this.pageNum - 1) * this.pageSize + (val + 1)
        },
        close() {
            this.show = false
        },
        async getCompanyList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'violationCount', {
                groupBy: 1,
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
.violation-rank {
    height: calc(100% - 70px);
    z-index: 200;
    .rank-content::-webkit-scrollbar {
        display: none;
    }
    .top {
        text-align: center;
        line-height: 5vh;
        font-weight: bold;
        width: 5vh;
        height: 5vh;
        color: @theme-color-second;
        border: 0.1rem solid @theme-color-second;
        border-radius: 50%;
        margin-right: 1rem;
        margin-bottom: 1rem;
    }
    .page {
        // height: 60px;
        color: @base-font-color;
        .pr;
        z-index: 101;
        .flex(row, space-between);
        .mt10;
    }
    .rank-content {
        color: @base-font-color;
        height: calc(100%);

        overflow-y: scroll;
        .rank-item {
            .pr;
            display: flex;
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
