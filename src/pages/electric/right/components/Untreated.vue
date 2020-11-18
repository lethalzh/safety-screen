<!--  -->
<template>
    <div class="untreated-list" v-loading="loading">
        <div class="untreated-item" v-for="item in lists" :key="item.companyNo">
            <div class="item-content-left">
                <div class="content-row-1">
                    <div class="company" :title="item.companyName">{{ item.companyName }}</div>
                </div>
                <div class="content-row-2">
                    <div class="name word-ellipsis" :title="item.personInCharge">
                        <span>联系人：{{ item.personInCharge }}</span>
                    </div>
                    <div class="tel" :title="item.contactNumber">联系电话：{{ item.contactNumber }}</div>
                    <div class="count" :title="item.total">违规次数：{{ item.total }}</div>
                </div>
            </div>
            <div class="item-content-right">
                <div class="btn" @click="renderHandle(item)">
                    处理
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { dictByBit } from '@/utils/index'
export default {
    components: {},
    data() {
        return {
            loading: false,
            lists: [],
        }
    },
    methods: {
        renderHandle(val) {
            this.$bus.$emit('violationHandle', val)
        },
        format(value) {
            return dictByBit(this.$getState('dict', 'violationType'), value)
        },
        async getCompanyList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'violationCount', {
                pageNum: 1,
                deal: 0,
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
@media screen and (max-width: 1536px){
    .untreated-list {
        .untreated-item {
            height: calc(100% / 3 - 1rem);
        }
    }
}
@media screen and (min-width: 1537px){
    .untreated-list {
        .untreated-item {
            height: calc(100% * 0.25 - 1rem);
        }
    }
}
.untreated-list {
    height: 100%;
    .untreated-item {
        // height: calc(100% * 0.25 - 1rem);
        .pr;
        z-index: 10;
        .mb10;
        .theme-color-6;
        border-radius: 5px;
        .flex(row, space-between, flex-start, nowrap);
        .item-content-left {
            min-width: 80%;
            max-width: 80%;
            // flex: 0 1 90%;
            .pr;
            .flex(column, flex-start, flex-start);
            z-index: 2;
            border-radius: 4px;
            padding: 1rem;
            cursor: pointer;
            .content-row-1 {
                width: 80%;
                .flex(row, space-between, center, nowrap);
                color: @base-font-color;
                .mb4;
                .company {
                    max-width: 80%;
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
                    span {
                        font-size: 0.7rem;
                        width: 10%;
                    }
                    width: 30%;
                }
                .tel {
                    width: 40%;
                    .word-ellipsis;
                }
                .count {
                    width: 30%;
                    .word-ellipsis;
                }
            }
        }
        .item-content-right {
            .mt10;
            flex: 1;
            .ml24;
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
}
</style>
