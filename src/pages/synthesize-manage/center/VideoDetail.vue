<template>
    <div class="body">
        <div class="video-detail">
            <video-map ref="map"></video-map>
            <div class="video" v-if="openWindow == 'video'">
                <video-live v-if="openWindow == 'video'" ref="videoLive" :stylewh="stylewh" :url="url" :pic="pic" />

                <div class="info-bar">
                    <div class="current-video" v-if="currentPlay">
                        <span>当前播放：{{ currentPlay.siteName }}</span>
                        <span>设备编号：{{ currentPlay.deviceId }}</span>
                    </div>
                    <div>
                        <el-button type="primary" @click="showConfig = true">配 置</el-button>
                        <el-button type="primary" @click="closeVideo">关 闭</el-button>
                    </div>
                </div>
            </div>
            <div class="notify" v-if="openWindow == 'notify' && onShow">
                <notify v-if="openWindow == 'notify'">
                    <el-button @click="onClose" type="primary">关闭</el-button>
                </notify>
            </div>
            <div class="float" v-if="openWindow == 'float' && onShow">
                <float v-if="openWindow == 'float'">
                    <div class="close" @click="onClose">X</div>
                </float>
            </div>
            <div class="notify" v-if="openWindow == 'special' && onShow">
                <special v-if="openWindow == 'special'">
                    <el-button @click="onClose" type="primary">关闭</el-button>
                </special>
            </div>
        </div>
        <video-live-config :visible.sync="showConfig" :current="currentPlay"/>
    </div>
</template>

<script>
import VideoMap from './components/Map.vue'
import Float from './components/Float'
import Notify from './components/Notify.vue'
import Special from './components/Special.vue'
import videoLive from '@/components/VideoLive'
import VideoLiveConfig from "@/components/VideoLiveConfig";
import _ from 'lodash'

export default {
    components: {
        VideoMap,
        videoLive,
        Notify,
        Float,
        Special,
        VideoLiveConfig
    },
    data() {
        return {
            // url: 'rtmp://122.112.160.217:1935/live/13108124421327999001@34020000001320000001',
            url: '',
            stylewh: { width: '500', height: '500' },
            // :stylewh="{ width: '100%', height: '400px', dwidth: 'calc(60vw + 32px)' }"
            pic: '@/assetssanitation/videoBg1.png',
            openWindow: '',
            loading: true,
            onShow: false,
            currentPlay: {},
            showConfig: false
        }
    },
    created() {
        this.$bus
            .$on('synthesize-manage-center', (type, item) => {
                if (item && !item.playAddr) {
                    this.debounceMessage('找不视频地址，无法播放')
                    return
                }
                this.openWindow = type
                if (item) {
                    this.openWindow = ''
                    setTimeout(() => {
                        this.openWindow = type
                        var pic = item.coverAddr
                        if (pic) pic = pic.indexOf('http://') != -1 ? pic : `http://${this.$getState('api', 'baseUrl')}/safety/file/downFile/${pic}`
                        this.pic = pic
                        this.url = item.playAddr
                        this.currentPlay = item
                    })
                } else if (type && !item) {
                    this.onShow = true
                    this.$bus.$emit('synthesize-manage-close-video')
                }
            })
            .off(this, 'synthesize-manage-center')
    },
    methods: {
        closeVideo() {
            this.openWindow = ''
            this.$bus.$emit('synthesize-manage-close-video')
        },
        debounceMessage: _.debounce(function(text) {
            this.$message.warning(text)
        }, 200),
        onClose() {
            this.onShow = false
        },
    },
    mounted() {},
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.body {
    width: 100%;
    height: 100%;
    .center {
        .pl16;
        .pr16;
    }
    .video-detail {
        width: 100%;
        height: 100%;
        .video {
            color: @base-font-color;
            .pr;
            z-index: 9;
            width: 100%;
            overflow-y: hidden;
            background: @video-background;
            padding: 20px;
            opacity: 1;
            .info-bar {
                .mt16;
                .flex(row, space-between);
            }
            .current-video {
                color: #ffffff;
                span {
                    .mr24;
                    font-size: 14px;
                }
            }
            .el-button {
                background: @button-color;
                border-color: @button-color;
            }
        }
        .notify {
            color: @base-font-color;
            .pr;
            z-index: 10;
            width: 100%;
            height: 100%;
            .shadow-light;
            overflow-y: hidden;
            // .theme-color-1;
            background: @background;
            padding: 12px;
            .close {
                position: absolute;
                right: 2rem;
                top: 2rem;
                z-index: 15;
            }
        }
    }
    /deep/ .el-loading-mask {
        background: @video-background;
    }
    .close {
        cursor: pointer;
        .fb-center;
        color: #000;
        font-size: 15px;
        line-height: 15px;
        height: 30px;
        width: 30px;
        border-radius: 100%;
        background-color: aquamarine;
    }
    .float {
        color: @base-font-color;
        .pr;
        z-index: 9;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        opacity: 1;
    }
}
</style>
