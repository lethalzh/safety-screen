<template>
    <div class="dev-report-record">
        <div class="record-container">
            <div v-if="!recordList.length">
                 <el-divider>暂无上报记录</el-divider>
            </div>
            <div v-else>
                <div class="record-item" v-for="record of recordList" :key="record.deviceId">
                    <div><span>设备名</span> <span>{{ record.deviceName || '-' }}</span></div>
                    <div><span>处理人</span> <span>{{ record.repairer || '-' }}</span></div>
                    <div><span>描述</span> <span>{{ record.faultRemark || '-' }}</span></div>
                    <div><span>状态</span> <span>{{ record.finishStatus | finishStatus }}</span></div>

                    <div class="divide"></div>

                    <div v-if="record.publishTime"><span>发布时间</span> <span>{{ $dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') }}</span></div>
                    <div v-if="record.startTime"><span>开始处理时间</span> <span>{{ $dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') }}</span></div>
                    <div v-if="record.endTime"><span>完成处理时间</span> <span>{{ $dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') }}</span></div>
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
                        getRecordList()
                    }
                "
                :current-page="pageNum"
                :total="total"
            ></el-pagination>
            <el-button @click="$bus.$emit('close-dev-report')" type="primary">关闭</el-button>
        </footer>
    </div>
</template>
<script>
export default {
    name: "DevReportRecord",
    props: {
        deviceId: {
            type: [Number, String],
            default: ''
        }
    },
    data() {
       return {
           pageNum: 1,
           pageSize: 10,
           total: 0,
           recordList: []
       }
    },
    watch:{
        deviceId(newVal, oldVal){
            if(newVal!=oldVal){
                this.getRecordList()
            }
        }
    },
    mounted() {
        this.getRecordList()
    },
    filters: {
        finishStatus(value) {
            return value == 1?'完成':'未完成'
        }
    },
    methods: {
        async getRecordList() {
            const res = await this.$http.reqApi(
                'data',
                'devReportRecords',
                {
                    deviceId: this.deviceId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
            )
            if(res && Array.isArray(res.rows)) {
                this.recordList = res.rows
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.dev-report-record {
    .mt16;
    .pr;
    .p16;
    z-index: 999;
    height: 75vh;
    width: 100%;
    background: @background;
    .shadow-light;
    .record-container {
        max-height: calc(75vh - 60px);
        overflow-y: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        .record-item {
            .mb16;
            .theme-color-7;
            .br(5px);
            .p10;
            > div {
                span:first-child {
                    .dib;
                    width: 100px;
                }
            }
            .divide {
                width: 100%;
                background: gray;
                height: 2px;
                .mt10;
                .mb10;
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

</style>