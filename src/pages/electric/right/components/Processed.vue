<!--  -->
<template>
    <div class="processed-list" v-loading="loading">
        <div class="processed-item" v-for="alarm in lists" :key="alarm.companyNo">
            <div class="item-content">
                <div class="content-row-1">
                    <div class="company">{{ alarm.companyName }}</div>
                    <div class="count">处理时间:{{ alarm.dealDate ? $dayjs(alarm.dealDate).format('YYYY.MM.DD') : '-' }}</div>
                </div>
                <div class="content-row-2">
                    <div class="count">违规次数:{{ alarm.dealCount }}</div>
                    <div class="name">处理措施:{{ $getState('dict', 'deal')[alarm.deal] }}</div>
                    <div class="tel">处理人:{{ alarm.dealUser }}</div>
                    <div class="tel">整改期限:{{ alarm.limitTime ? $dayjs(alarm.limitTime).format('YYYY.MM.DD') : '-' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { dictByBit } from '@/utils/index'
export default {
    data() {
        return {
            loading: false,
            lists: [],
        }
    },
    methods: {
        format(value) {
            return dictByBit(this.$getState('dict', 'violationType'), value)
        },
        async getCompanyList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'violationHasdel', {
                pageNum: 1,
                pageSize: 15,
                type: this._settings.electricType,
                regionIds: this._dict.regionRoot.code
            })
            this.loading = false
            if (res && res.rows && !res.error) {
                this.lists = res.rows
            } else {
                return
            }
        },
    },
    created() {
        this.$bus.$on('updateElectricType',()=>{
            this.getCompanyList();
        })
        // type: this._settings.electricType
    },
    mounted() {
        this.getCompanyList()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.processed-list{
    height: 100%;
    .processed-item {
        .pr;
        .mb10;
        .theme-color-6;
        border-radius: 5px;
        .item-content {
            .pr;
            .flex(column, flex-start);
            z-index: 2;
            border-radius: 4px;
            padding: 1rem;
            cursor: pointer;
            .content-row-1 {
                width: 100%;
                .flex(row, space-between, center, nowrap);
                color: @base-font-color;
                .mb4;
                .company {
                    max-width: 60%;
                    .word-ellipsis;
                }
            }
            .content-row-2 {
                width: 100%;
                .flex(row, flex-start, center, nowrap);
                color: @base-font-color;
                div {
                    font-size: 0.7rem;
                    .pr10;
                }
                .name {
                    .word-ellipsis;
                }
            }
        }
    }
}
</style>
