<template>
    <div class="dispatch-record-container">
        <header class="header">
            <div>
                <span>派单记录</span>
                <img src="@/assets/img/yellowMore.png" alt />
            </div>
            <div class="more cursor-p" @click="showMore(false)">更多&nbsp;></div>
        </header>
        <div class="dispatch-list" v-loading="loading" element-loading-background="rgba(255,255,255,0)">
            <div v-show="!loading && !dispatchList.length" style="fontSize:16px;color:#000;">{{ currentMonitor.sanitationName }}暂无派单记录！</div>
            <div
                class="dispatch-item"
                :class="{'timeout':alarm.status==1, 'received': alarm.status==2, 'finished':alarm.status==3}"
                v-for="alarm in dispatchList"
                :key="alarm.companyNo"
            >
                <div class="top">
                    <span>名称{{ alarm.name }}</span>
                    <div class="status">
                        <el-tag size="mini" style="color: #fff; font-size: 10px" :style="{ backgroundColor: _dict.statusColor[alarm.status], borderColor: _dict.statusColor[alarm.status]  }">{{ _dict.status[alarm.status] || '未知状态' }}</el-tag>
                    </div>
                </div>
                <div class="info">
                    <div class="user">联系人：{{ alarm.dealUserName }}</div>
                    <div class="tel">联系电话：{{ alarm.dealUserTel }}</div>
                    <div class="time">整改期限：{{ $dayjs(alarm.expires).format("YYYY-MM-DD") }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DispatchRecord",
    props: {
        monitorList: {
            type: Array,
            default: ()=> []
        }
    },
    data() {
        return {
            loading: true,
            pageNum: 1,
            dispatchList: [],
            currentMonitor: {},
            once: true
        }
    },
    mounted() {
        this.observeOnce()
        this.$bus.$on("get-dispatch-list",async monitor=> {
            this.currentMonitor = monitor
            await this.getDispatchList(monitor.sid)
            this.showMore(true)
        }).off(this, "get-dispatch-list")
    },
    methods: {
        showMore(state=false) {
            if(!this.dispatchList.length) {
                this.$message.warning("该监控点没有派单记录！")
            }
            this.$bus.$emit("show-alarm-more-dispatch", this.currentMonitor.sid, state)
        },
        async getDispatchList(sid) {
            const res = await this.$http.reqApi("data", "dispatchList", {
                pageNum: 1,
                pageSize: 10,
                id: sid
            })
            this.loading = false
            this.dispatchList = res.rows || []
        },
        observeOnce() {
            const destoryWatch = this.$watch('monitorList', (list)=> {
                list.length && this.getDispatchList(list[0].sid)
                this.currentMonitor = list[0]
                destoryWatch()
            })
        }
    },
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
    header {
        .flex(row, space-between);
    }
    .dispatch-list {
        height: calc(40vh - 80px);
        overflow-y: auto;
        .pt10;
        &::-webkit-scrollbar {
            display: none;
        }
        .dispatch-item {
            .mb10;
            .p10;
            .br(5px);
            .theme-color-7;
            .top {
                .flex(row, space-between);
                span {
                    font-size: 1.2em;
                }
            }
            .info {
                .mt10;
                .flex;
                > * {
                    .db;
                    font-size: 10px;
                    flex: 1;
                }
            }
        }
    }
    .timeout {
        .warn-color-3 !important;
    }
    .received {
        background: rgba(78, 201, 103, .6) !important;
    }
    .finished {
        background: rgba(96, 208, 135, .6) !important;
    }
</style>
