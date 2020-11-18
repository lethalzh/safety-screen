<template>
    <div
        class="info-window"
        :class="state"
    >
        <div class="info info-right" v-if="$parent.showLedgerInfoWindow">
            <div>
                <span>企业：</span>
                {{ companyInfo.companyName || '-' }}
            </div>
            <div>
                <span>企业负责人：{{ companyInfo.concatPerson || '-' }}</span>
                <el-button
                    size="mini"
                    style="background: #ea7974; border: #ea7974; color: #fff"
                    plain
                    @click="$bus.$emit('show-deal-ledger-alarm-win', companyInfo)"
                    v-if="companyInfo.ledgerStat==1"
                >处理</el-button>
                <el-button
                    size="mini"
                    style="background: #ea7974; border: #ea7974; color: #fff"
                    plain
                    @click="$bus.$emit('show-deal-ledger-alarm-win', companyInfo, true)"
                    v-else-if="companyInfo.ledgerStat==2"
                >处理记录</el-button>
            </div>
            <div>
                <span>地址：</span>
                {{ companyInfo.addr || '-' }}
            </div>
            <div v-if="companyInfo.ledgerStat==1">存在台账告警</div>
            <div v-if="companyInfo.ledgerStat==2">台账告警已处理</div>
        </div>
        <div class="info" v-else-if="$parent.showCameraWindow">
            <div>
                <div class="cheader">{{ companyInfo.companyName || '' }}</div>
                <div
                    class="camera-list"
                    v-if="companyCameraMap[companyInfo.companyNo] && companyCameraMap[companyInfo.companyNo].length"
                >
                    <img
                        :src="!camera.coverAddr?'https://vjs.zencdn.net/v/oceans.png':(camera.coverAddr.indexOf('http://') != -1?camera.coverAddr:('http://'+$getState(
                    'api','baseUrl')+'/safety/file/downFile/'+camera.coverAddr))"
                        style="background: #ea7974; border: #ea7974; color: #fff; cursor: pointer"
                        v-for="(camera,index) in companyCameraMap[companyInfo.companyNo]"
                        :key="index"
                        @click="$parent.$refs.videoLive.show(companyCameraMap[companyInfo.companyNo])"
                    />
                </div>
                <div v-else>当前企业下无摄像头</div>
            </div>
        </div>
        <div class="info" v-else-if="$parent.showDevInfoWindow">
            <div>
                <span>当前着火点：</span>
                {{ companyInfo.companyName || '-' }}
            </div>
            <div>
                <span>企业负责人：{{ companyInfo.concatPerson || '-' }}</span>
                <el-button
                    size="mini"
                    plain
                    style="background: #ea7974; border: #ea7974; color: #fff"
                    @click="sendMessage"
                >发送通知</el-button>
            </div>
            <div>
                <span>地址：</span>
                {{ companyInfo.addr || '-' }}
            </div>
        </div>
        <div class="info" v-else>
            <div>
                <span>企业名称：</span>
                {{ companyInfo.companyName || '-' }}
            </div>
            <div>
                <span>企业负责人：{{ companyInfo.concatPerson || '-' }}</span>
            </div>
            <div>
                <span>企业联系电话：{{ companyInfo.concatTel || '-' }}</span>
            </div>
        </div>
        <div class="circle"></div>
    </div>
</template>
<script>
let devEnum = {
    1: '正常', 
    2:'告警',
    4:'离线',
    8:'故障'
}
export default {
    props: {
        companyInfo: {
            type: Object,
            default: () => {},
        },
        companyCameraMap: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {}
    },
    computed: {
        state() {
            return devEnum[this.companyInfo.devStat] === '正常' && this.companyInfo.ledgerStat != 1 ?
            'normal' : 
            devEnum[this.companyInfo.devStat] === '故障' ?
            'something-wrong' : ''
            // return this.$parent.showCameraWindow || 
            // !this.companyInfo.devStat || 
            // devEnum[this.companyInfo.devStat] === '正常' && this.companyInfo.ledgerStat == 0 ?
            // 'normal' : 
            // devEnum[this.companyInfo.devStat] === '故障' ?
            // 'something-wrong' : ''
        }
    },
    methods: {
        sendMessage() {
            this.$emit('send-message')
        }
    },
};
</script>
<style lang="less" scoped>
@import url('./mixin.less');
</style>