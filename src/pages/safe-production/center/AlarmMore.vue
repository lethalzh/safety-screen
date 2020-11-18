<template>
    <div class="alarm-more">
        <div class="ledger-container" v-loading="loading">
            <div class="ledger-item" v-for="(alarm, index) in ledgerList" :key="alarm.index" :class="{ 'ledger-alarm': alarm.ledgerStat > 0, 'dev-alarm': alarm.devStat == 2 }">
                <div class="base-info">
                    <img class="icon mr10" :src="alarm.icon" />

                    <div class="info-detail">
                        <div class="mb10" style="display: flex">
                            <span class="dib word-ellipsis" style="width: 200px">{{ alarm.companyName }}</span>
                            <span>当前状态：{{(alarm.devStat==2?'消防告警 ':'') + (alarm.ledgerStat==1?'台账告警':alarm.ledgerStat==2?'台账告警-已处理':'')}}</span>
                        </div>
                        <div class="addr">
                            <span>联系人：{{ alarm.concatPerson || '-' }}</span>
                            <span>地址：{{ alarm.addr || '-' }}</span>
                        </div>
                        <template v-if="alarm.ledgerStat == 1">
                            <span class="pr" v-if="currentShowIndex != index" style="cursor: pointer; top: -5px" @click.stop="currentShowIndex = index">展开详情</span>
                            <span class="pr" v-else style="cursor: pointer; top: -5px" @click.stop="currentShowIndex = null">收起</span>
                        </template>
                    </div>

                    <div class="deal-button">
                        <div style="color: #000; cursor: pointer" v-if="alarm.ledgerStat != 1" @click="$bus.$emit('map-choose-company', { company: alarm, type: '全部' })">详情></div>
                        <div v-else sytle="cursor: pointer" class="btn" @click.stop="$bus.$emit('show-deal-ledger-alarm-win', alarm)">处理</div>
                    </div>
                </div>

                <div class="deal-component">
                    <deal-ledger-alarm-box 
                        class="mt10" 
                        v-if="currentShowIndex == index" 
                        :as-component="true" 
                        :company="alarm" 
                        @on-deal-success="currentShowIndex = null; getCompanyList()"
                    />
                </div>
            </div>
        </div>

        <footer class="page-footer mt10" style="color: #fff;">
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
            <el-button @click="$bus.$emit('close-alarm-more-win')" type="primary">关闭</el-button>
        </footer>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import DealLedgerAlarmBox from './DealLedgerAlarmBox'
import AMcompany from '@/assets/img/AMcompany.png'
import ZCcompany from '@/assets/img/ZCcompany.png'
import fireAlarm from '@/assets/img/fireAlarm.png'
export default {
    props: {
        companyList: {
            type: Array,
            default: () => [],
        },
    },
    components: { DealLedgerAlarmBox },
    data() {
        return {
            currentShowIndex: null,
            showDeal: false,
            loading: false,
            pageNum: 1,
            ledgerList: [],
            total: 0, //总共页数
            pageSize: 10, //每页记录数
        }
    },
    watch: {
        companyList: {
            handler(val) {
                if (val) {
                    this.ledgerList = val
                }
            },
            immediate: true,
            deep: true,
        },
    },
    mounted() {
        this.getCompanyList()
    },
    methods: {
        async getCompanyList() {
            this.loading = true
            var res = await this.$http.reqApi(
                'data',
                'safeCompanyList',
                {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                'get',
                {
                    type: 0,
                    dateTime: dayjs().format('YYYYMMDDHHmmss'),
                    stat: 0,
                }
            )
            this.loading = false
            if (res && res.rows) {
                res.rows.map((row) => {
                    if (row.ledgerStat == 0 && row.devStat == 1) {
                        row.icon = ZCcompany
                    } else {
                        //设备告警
                        if (row.devStat == 2) {
                            row.icon = fireAlarm
                        } else if (row.ledgerStat == 1 || row.ledgerStat == 2) {
                            row.icon = AMcompany
                        }
                    }
                })
                this.ledgerList = res.rows
                this.total = res.total || 8
            }
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.alarm-more {
    .mt16;
    .pr;
    z-index: 999;
    height: 75vh;
    width: 100%;
    // border: 2px solid @theme-color-second;
    background: @background;
    .shadow-light;
    .p16;
    .btn {
        .dib;
        padding: 4px 10px 4px 10px;
        color: #fff;
        text-align: center;
        font-size: 10px;
        border-radius: 5px;
        background: #b54645;
    }
    .ledger-container {
        max-height: calc(75vh - 96px);
        &::-webkit-scrollbar {
            display: none;
        }
        overflow-y: auto;
        .icon {
            width: 18px;
            height: 18px;
        }
        .ledger-alarm {
            background: @warn-color-sec !important;
        }
        .dev-alarm {
            background: @warn-color !important;
        }
        .ledger-item {
            .mb10;
            .theme-color-6;
            color: @base-font-color;
            border-radius: 5px;
            .p10;
            .base-info {
                .flex(row, flex-start, flex-start);
                .info-detail {
                    .addr {
                        .dib;
                        > * {
                            .dib;
                            width: 20vw;
                            .word-ellipsis;
                            &:first-child {
                                width: 10vw;
                            }
                        }
                        width: 30vw;
                    }
                }
                .deal-button {
                    flex: 1;
                    text-align: right;
                }
            }
        }
    }
    .page-footer {
        position: absolute !important;
        width: calc(100% - 32px);
        bottom: 16px;
        .flex(row, space-between);
    }
}

::v-deep {
    .el-pager {
        li:not(.disabled).active {
            background: @theme-color !important;
        }
    }
    .btn-next {
        background: rgba(0, 0, 0, 0) !important;
    }
    .btn-prev {
        background: rgba(0, 0, 0, 0) !important;
    }
}
</style>
