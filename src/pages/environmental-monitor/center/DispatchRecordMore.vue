<template>
    <div class="dispatch-container">
        <div class="body" v-loading="loading">
            <div v-if="!lists.length">
                 <el-divider>暂无派单记录</el-divider>
            </div>
            <div v-else>
                <div
                    class="alarm"
                    :class="{'timeout':alarm.status==1, 'received': alarm.status==2, 'finished':alarm.status==3}"
                    :key="alarm.index"
                    v-for="alarm in lists"
                >
                    <div class="content">
                        <img class="icon" :src="alarm.icon" />
                        <div class="cc">
                            <div class="name">名称{{ alarm.name }}</div>
                            <div class="info">
                                <div class="user">
                                    联系人：{{ alarm.dealUserName }}
                                </div>
                                <div class="tel">
                                    联系电话：{{ alarm.dealUserTel }}
                                </div>
                                <div class="time">
                                    整改期限：{{
                                        $dayjs(alarm.expires).format(
                                            "YYYY-MM-DD hh:mm:ss"
                                        )
                                    }}
                                </div>
                                <div v-if="alarm.sendRemark">备注：{{alarm.sendRemark}}</div>
                            </div>
                        </div>
                        <div class="todetail">
                            <div
                                class="btn btn-info"
                                style="background: rgba(67, 172, 135); color: #fff"
                                v-if="alarm.status == 0"
                            >
                                派单中
                            </div>
                            <div
                                class="btn"
                                style="color: #fff"
                                v-if="alarm.status == 1"
                            >
                                已超时
                            </div>
                            <div
                                style="
                                    backgroundcolor: #66cc99;
                                    color: #fff
                                "
                                class="btn btn-accepted"
                                v-if="alarm.status == 2"
                            >
                                已受理
                            </div>
                            <div
                                style="
                                    backgroundcolor: #66cc99;
                                "
                                class="t"
                                v-if="alarm.status == 3"
                            >
                                已处理
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page" style="color: #fff">
            <el-pagination
                :background="true"
                style="padding-left: 0"
                layout="prev, pager, next"
                :page-size="pageSize"
                @current-change="
                    (page) => {
                        pageNum = page
                        getDispatchList()
                    }
                "
                :current-page="pageNum"
                :total="total"
            ></el-pagination>
            <el-button @click="$bus.$emit('closeMoreAlarm')" type="primary">关闭</el-button>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs"
export default {
    props: ["sid"],
    data() {
        return {
            loading: true,
            pageNum: 1,
            lists: [],
            total: 0, //总共页数
            pageSize: 10, //每页记录数
            dataChanged: true
        }
    },
    watch: {
        sid: {
            handler(sid) {
                console.log('sid',sid);
                this.isSid()
                this.getDispatchList(sid)
            },
            // immediate: true,
            deep: true,
        },
    },
    async mounted() {
        this.getDispatchList(this.sid)
        this.refresh()
    },
    beforeDestroy() {},
    methods: {
        isSid() {
            if (this.sid == "") {
                this.$message.error("暂无数据")
                this.$bus.$emit("closeMoreAlarm")
            }
        },
        async getDispatchList(sid) {
            this.loading = true
            const res = await this.$http.reqApi("data", "dispatchList", {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                id: sid,
            })
            this.loading = false
            if (res && res.rows) {
                this.lists = res.rows
                this.total = res.total || 8
            }
            this.lists = res.rows
        },
        refresh() {
            //用于刷新组件，需手动调用
            this.dataChanged = true
            this.$nextTick(() => {
                this.dataChanged = false
            })
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.dispatch-container {
    height: 75vh;
    overflow-y: hidden;
    .pr;
    .mt16;
    // .theme-color-2 !important;
    // border: 1px solid @theme-color-second;
    background: @background;
    .shadow-light;
    .p16;
    .page {
        // height: 60px;
        .pr;
        z-index: 999;
        .flex(row, space-between);
        .mt10;
    }
}
.body::-webkit-scrollbar {
    display: none;
}
.body {
    height: calc(100% - 42px);
    overflow-y: scroll;
    padding-bottom: 20px;
    .alarm {
        .pr;
        .theme-color-7;
        border-radius: 5px;
        .content {
            .pr;
            z-index: 2;
            border-radius: 4px;
            .fb-right-top;
            .p10;
            .mb10;
        }
        .icon {
            .db;
            width: 15px;
            .mr4;
        }
        .cc {
            .fb-box-flex(1);
            .pr10;
            .name {
                .mb4;
                .word-ellipsis;
                // line-height:16px;
            }
            .addr {
                .pb8;
                // line-height:10px;
                font-size: 10px;
                .word-ellipsis;
            }
        }
        .todetail {
            .btn-info {
                .theme-color-10;
            }
            .btn-accepted{
                // .theme-color-1;
                background: #00cd44;
            }
            .t {
                .tr;
                font-size: 10px;
            }
        }
    }
    .btn {
        padding: 4px 10px 4px 10px;
        .tm;
        font-size: 10px;
        border-radius: 5px;
        background: #b54645;
        cursor: pointer;
        &:active {
            opacity: 0.7;
        }
    }
}
::v-deep {
    .el-pager {
        li:not(.disabled).active {
            background: @theme-color !important;
        }
    }
    .btn-next, .btn-prev {
        background: rgba(0, 0, 0, 0) !important;
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
