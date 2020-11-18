<!--  -->
<template>
    <div class="rank-list" v-loading="loading">
        <div class="rank-item" v-for="alarm in lists" :key="alarm.companyNo">
            <div class="rank-item-content">
                <div class="content-row-1">
                    <div class="company">{{ alarm.companyName }}</div>
                    <div class="count">违规次数：{{ alarm.total }}</div>
                </div>
                <div class="content-row-2">
                    <div class="name">联系人：{{ alarm.personInCharge }}</div>
                    <div class="tel">联系电话：{{ alarm.contactNumber }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            lists: [],
        }
    },
    methods: {
        async getCompanyList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'violationCount', {
                groupBy: 1,
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
    },
    mounted() {
        this.getCompanyList()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.rank-list {
    height: 100%;
    .rank-item {
        .pr;
        .mb10;
        .theme-color-6;
        border-radius: 5px;
        .rank-item-content {
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
                }
                .name {
                    .pr16;
                    .word-ellipsis;
                }
            }
        }
    }
}
</style>
