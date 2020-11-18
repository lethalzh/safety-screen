<template>
    <div class="body">
        <div class="center">
            <!-- 地图 -->
            <safe-map 
                ref="map" 
                :company-camera-map="companyCameraMap" 
                :monitor-list="monitorList" 
                :firetruck-list="firetruckList"
                :company-list="companyList" 
            />
            <!-- 更多告警 -->
            <alarm-more
                class="bg"
                :company-list="alarmCompanyList"
                v-if="showWinName=='alarm-more-box'"
            />
            <!-- 更多视频监控 -->
            <camera-more-box
                class="bg"
                :company-list="companyList"
                :company-camera-map="companyCameraMap"
                v-if="showWinName=='camera-more-box'"
            />
            <!-- 台账处理 -->
            <deal-ledger-alarm-box
                :company="currentCompanyInfo"
                :readonly="ledgerReadonly"
                v-if="showWinName=='show-deal-ledger-alarm-win'"
                @close="showWinName = null"
            />
            <!-- 右下角设备上报记录 -->
            <dev-report-record
                :device-id="deviceId"
                v-if="showWinName=='show-dev-report'"
            />
        </div>
    </div>
</template>

<script>
import SafeMap from "./Map"
import AlarmMore from "./center/AlarmMore"
import DevReportRecord from "./center/DevReportRecord"

import CameraMoreBox from "./center/CameraMoreBox.vue"
import DealLedgerAlarmBox from "./center/DealLedgerAlarmBox.vue"

export default {
    props: ["alarmList", "companyList", "firetruckList", "monitorList", "companyCameraMap"],
    components: {
        SafeMap,
        AlarmMore,
        CameraMoreBox,
        DealLedgerAlarmBox,
        DevReportRecord
    },
    data() {
        return {
            showWinName: false,
            alarmCompanyList: [],
            deviceId: null,
            currentCompanyInfo: null,
            ledgerReadonly: false
        }
    },
    mounted() {
        // 告警更多列表
        this.$bus.$on("show-alarm-more", (alarmCompanyList) => {
            this.showWinName = "alarm-more-box"
            this.alarmCompanyList = alarmCompanyList
        }).off(this, 'show-alarm-more')
        // 摄像头更多列表
        this.$bus.$on("show-camera-more", () => {
            this.showWinName = "camera-more-box"
        }).off(this, "show-camera-more")
        // 台账处理弹窗
        this.$bus.$on("show-deal-ledger-alarm-win", (company, readonly = false) => {
            this.currentCompanyInfo = company
            this.ledgerReadonly = readonly
            this.showWinName = null
            this.$nextTick(()=> {
                this.showWinName = "show-deal-ledger-alarm-win"
                this.$bus.$emit("close-map-hint")
            })
        }).off(this, "show-deal-ledger-alarm-win")
        // 设备上报记录
        this.$bus.$on("show-dev-report", (id) => {
            this.deviceId = id
            this.showWinName = "show-dev-report"
        }).off(this, "show-dev-report")
        
        // 关闭告警更多
        this.$bus.$on("close-alarm-more-win", () => {
            this.showWinName = null
        }).off(this, "close-alarm-more-win")
        // 关闭摄像头更多
        this.$bus.$on("close-camera-more-win", () => {
            this.showWinName = null
        }).off(this, "close-camera-more-win")
        // 关闭台账处理
        this.$bus.$on("close-deal-ledger-alarm-win", () => {
            this.showWinName = null
        }).off(this, "close-deal-ledger-alarm-win")
        // 关闭设备上报记录
        this.$bus.$on("close-dev-report", () => {
            this.showWinName = null
        }).off(this, "show-dev-report")
    }
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.body {
    .center {
        .pl16;
        .pr16;
    }
}
</style>
