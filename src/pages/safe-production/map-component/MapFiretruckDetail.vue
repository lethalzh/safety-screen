<template>
    <div class="firetruck-detail" :class="fire.stat == 1?'online':''">
        <div class="info-window normal">
        <div class="info info-right" >
            <div>
                <div class="cheader">所属消防队：{{ fire.belong || '-' }}</div>
                <div class="cheader">车牌号：{{ fire.carCode || '-' }}</div>
                <div class="cheader">当前状态：{{ fire.stat == 1?'在线':'离线' }}</div>
                <div class="cheader">司机：{{ fire.driver || '-' }}</div>
                <div class="cheader">司机电话：{{ fire.driverTel || '-' }}</div>
                <div class="cheader">载重：{{ fire.waterStorage || '0' }}</div>
                <el-checkbox class="mt10" v-model="historyTrack" @change="onCheckChange">历史轨迹</el-checkbox>
                <div class="operate">
                    <el-date-picker
                        v-model="time"
                        size="mini"
                        style="width: 100%"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyyMMddHHmmss"
                        :picker-options="pickerOptions"
                        @change="onDateChange"
                    >
                    </el-date-picker>
                </div>
            </div>
        </div>
        <div class="circle"></div>
    </div>
    </div>
</template>

<script>
    export default {
        name: "MapFiretruckDetail",
        props: {
            fire: {
                type: Object,
                default: ()=> {}
            }
        },
        data() {
            return {
                id: null,
                time: "",
                historyTrack: false,
                pickerOptions: {
                    // 限制最近三天
                    disabledDate(time) {
                        return time.getTime() < Date.now() - (24 * 7 * 3600 * 1000) || time.getTime() > Date.now()
                    }
                }
            }
        },
        created() {
            this.id = Date.now()
        },
        beforeDestroy() {
            this.$emit('remove-path', this.id)
        },
        methods: {
            async getHistoryTrack(time = []) {
                const res = await this.$http.reqApi('data', 'firetruckTrack', {
                    deviceNum: this.fire.deviceNum,
                    startTime: time[0] || this.$dayjs(Date.now() - 720 * 60 * 60 * 1000).format('YYYYMMDDHHmmss'),
                    endTime: time[1] || this.$dayjs().endOf('day').format('YYYYMMDDHHmmss'),
                    pageNum: 1,
                    pageSize: 200
                })
                if(!res.error && Array.isArray(res.rows)) {
                    if(!res.rows.length) return this.$message.warning('暂无轨迹信息！')
                    this.$emit('get-track-path', this.id, res.rows.map(row=> {
                        if(row.longitude && row.latitude)
                            return [
                                row.longitude,
                                row.latitude
                            ]
                    }))
                } else {
                    this.$emit('remove-path', this.id)
                    this.$message.error('获取轨迹信息失败！')
                }
            },
            onCheckChange() {
                if(this.historyTrack) {
                    this.getHistoryTrack()
                } else {
                    this.$emit('remove-path', this.id)
                }
            },
            onDateChange() {
                this.historyTrack = true
                this.getHistoryTrack(this.time)
            }
        }
    }
</script>

<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
@import url('./mixin.less');
.operate {
    .mt10;
    // .flex(row, space-between);
}
.info:before {
    height: 180px !important;
}
.circle:before {
    top: -2px !important;
    height: 230px !important;
    transform: rotate(70deg) !important;
}
.online {
    .circle {
        .theme-color-2 !important;
        border: 1px solid @theme-color !important;
        &::before {
            background: @theme-color !important;
        }
    }
    .info {
        border: 1px solid @theme-color !important;
        .theme-color-2 !important;
        &::before {
            background: @theme-color !important;

        }
    }
}
</style>