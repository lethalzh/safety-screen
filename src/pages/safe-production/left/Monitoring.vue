<template>
    <div class="container">
        <div class="header">
            <div class="n">视频监控</div>
            <div class="more" @click="showMore">更多&nbsp;></div>
        </div>
        <div class="body" v-loading="loading">
            <template v-for="company in companyList">
                <div class="company" :key="company.companyNo" v-if="companyList">
                    <div
                        class="name"
                        @click="$bus.$emit('map-choose-company', {company:company,type:'摄像头'})"
                    >{{ company.companyName }}</div>
                    <div
                        class="cameras"
                        v-if="Array.isArray(companyCameraMap[company.companyNo])"
                    >
                        <div class="camera-item" v-for="(camera,index) in companyCameraMap[company.companyNo].slice(0, 3)" :key="camera.deviceId">
                            <img
                                src="@/assets/img/camera-theme.png"
                                width="16"
                                height="16"
                                @click="$refs.videoLive.show(companyCameraMap[company.companyNo], index)"
                            />
                        </div>
                    </div>
                    <span style="color: #000;" v-if="companyCameraMap[company.companyNo] && companyCameraMap[company.companyNo].length > 3">+{{ companyCameraMap[company.companyNo].length - 3 }}</span>
                </div>
            </template>
        </div>

        <video-live
            ref="videoLive"
            :dialog="true"
            :stylewh="{width: '100%',height: '400px', dwidth: 'calc(60vw + 32px)'}"
            pic="//vjs.zencdn.net/v/oceans.png"
        />
    </div>
</template>

<script>
import VideoLive from '@/components/VideoLive'
export default {
    props: {
        companyList: {
            type: Array,
            default: ()=> []
        },
        companyCameraMap: {
            type: Object,
            default: ()=> {}
        }
    },
    components: { VideoLive },
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        cameraClick(e) {
            this.$bus.$emit("close-map-hint")
            this.$bus.$emit("close-alarm-more-win")
            this.$bus.$emit("close-camera-more-win")
            this.$bus.$emit("close-deal-ledger-alarm-win")
            this.$bus.$emit("lives-addr", e)
        },
        showMore() {
            this.$bus.$emit("close-map-hint")
            this.$bus.$emit("close-video-win")
            this.$bus.$emit("close-alarm-more-win")
            this.$bus.$emit("close-deal-ledger-alarm-win")
            this.$bus.$emit("show-camera-more")
        }
    },
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
@media screen and (max-width: 1536px){
    .container {
        height: calc(100% - 34vh - 22vh - 48px);
    }
}
@media screen and (min-width: 1537px){
    .container {
        height: 36vh;
    }
}
.container {
    // height: 36vh;
    overflow-y: hidden;
    .header {
        .fb-left;
        .pb10;
        .n {
            .fb-box-flex(1);
            .pr10;
            color: @base-font-color;
        }
        .more {
            color: @base-font-color;
            .tr;
            cursor: pointer;
        }
    }
    .body {
    height: calc(100% - 26px);
    overflow-y: scroll;
    padding-bottom: 20px;
    .company {
        .fb-left;
        .mb10;
        &:hover {
            .theme-color-4;
        }
        .name {
            cursor: pointer;
            color: @base-font-color;
            .word-ellipsis;
            .pr16;
            .fb-box-flex(1);
        }
        .cameras {
            .pl10;
            .word-ellipsis;
            .tr;
            cursor: pointer;
            .flex;
            .camera-item {
                width: 15px;
                .mr4;
            }
        }
    }
}
}
.body::-webkit-scrollbar {
    display: none;
}

</style>
