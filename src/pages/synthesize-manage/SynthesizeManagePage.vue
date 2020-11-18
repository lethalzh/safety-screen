<template>
    <div class="synthesize-manage">
        <div class="content">
            <div class="left">
                <public-safety-video />
            </div>
            <div class="center">
                <video-detail />
            </div>
            <div class="right">
                <detail-page />
            </div>
        </div>
    </div>
</template>
<script>
import PublicSafetyVideo from './left/PublicSafetyVideo'
import VideoDetail from './center/VideoDetail'
import DetailPage from './right/DetailPage'
export default {
    components: {
        PublicSafetyVideo,
        VideoDetail,
        DetailPage,
    },
    name: "SynthesizeManagePage",
    data() {
        return {}
    },
    mounted() {},
    methods: {},
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
@height: ~'calc(100vh - 20px - 20px - (100vh - 20px - 20px) * .10)';
.synthesize-manage {
    .p16;
    .pr;
    width: 100vw;
    height: 100%;
    .content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        .left {
            // flex: 0 1 25%;
            .pr;
            z-index: 9;
            width: 25vw;
            height: 100%;
            background: @background;
            // border: 1px solid @theme-color-second;
            .shadow-light;
            .mr16;
        }
        .center {
            flex: 1;
            // flex: 0 1 50%;
        }
        .right {
            // flex: 0 1 25%;
            .pr;
            z-index: 9;
            width: 25vw;
            height: 100%;
            background: @background;
            background: @background;
            // border: 1px solid @theme-color-second;
            .shadow-light;
            .ml16;
            
        }
    }
}
</style>
