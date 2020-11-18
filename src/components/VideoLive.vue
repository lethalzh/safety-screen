<template>
    <div class="video-live">
        <el-dialog
            v-if="dialog"
            :title="title || '监控'"
            :visible.sync="dialogVisible"
            :width="'50vw' || stylewh.dwidth"
            :before-close="handleClose"
            :append-to-body="true"
            :close-on-click-modal="false"
        >
            <video
                v-if="showVideo"
                :id="vid"
                class="video-js vjs-default-skin videoStyle vjs-big-play-centered vjs-fluid"
                controls
                preload="auto"
                :style="{
                    height: stylewh.height || '100%',
                    width: stylewh.width || '100%',
                }"
                :poster="currentPoster || pic"
                data-setup='{"fluid":true}'
            >
                <source :src="currentPlay || url" type="video/rtmp" />
            </video>
            <div slot="footer" class="dialog-footer">
                <slot name="footer-left">
                    <el-select
                        v-model="currentDeviceId"
                        placeholder="请选择播放的设备"
                        @change="onChange"
                    >
                        <el-option
                            v-for="item in selectOptions"
                            :key="item.deviceId"
                            :label="item.deviceName"
                            :value="item.deviceId"
                        ></el-option>
                    </el-select>
                </slot>
                <a
                    ref="launchFlash"
                    href="http://www.adobe.com/go/getflashplayer"
                    style="color: #ffffff"
                    v-show="!hasFlash"
                    >无法播放?点击启动flash</a
                >
                <div>
                    <el-button type="primary" @click="handleConfig"
                        >配 置</el-button
                    >
                    <el-button type="primary" @click="handleClose"
                        >关 闭</el-button
                    >
                </div>
            </div>
        </el-dialog>
        <video
            v-else-if="vid"
            :id="vid"
            class="video-js vjs-default-skin videoStyle vjs-big-play-centered vjs-fluid"
            controls
            preload="auto"
            :style="{
                height: stylewh.height || '100%',
                width: stylewh.width || '100%',
            }"
            data-setup='{"fluid":true}'
            :poster="currentPoster || pic"
        >
            <source :src="currentPlay" type="video/rtmp" />
        </video>

        <video-live-config :visible.sync="showConfig" :current="selectOptions[currentIndex]"/>
    </div>
</template>

<script>
import { flashChecker } from "@/utils/index";
import VideoLiveConfig from "./VideoLiveConfig";
export default {
    name: "videoLive",
    props: {
        stylewh: {
            type: Object,
        }, //视频大小 {width:xx,height:xx, dwidth:xx (dialog模式时传，弹窗宽度)}
        url: {
            type: String,
            default: "",
        }, //视频地址
        pic: String, //视频封面
        title: String,
        //true/false  是否是弹窗模式， 弹窗模式下，需要调用 组件的show()方法，弹窗显示视频播放器， 在窗口关闭时，会发close事件
        //在存在多条监控记录都可弹窗时， 只需要共用一个videoLive组件，点击每条记录后，先更新 url，pic 这两个属性，然后调用show()方法弹窗即可。
        //false时，页面直接显示组件
        dialog: {
            type: Boolean,
            default: false,
        },
        videoId: {
            type: String,
        }
    },
    components: { VideoLiveConfig },
    watch: {
        url: {
            handler(val) {
                if (!val) return;
                this.currentPlay =
                    val.indexOf("111.11.14.107") != -1
                        ? /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
                              location.hostname
                          )
                            ? val.replace("111.11.14.107", location.hostname)
                            : val
                        : val;
                console.log(">>>>>>play addr", this.currentPlay);
            },
            immediate: true
        },
        pic: {
            handler(val) {
                if (!val) return;
                if (val)
                    val =
                        val.indexOf("http://") != -1
                            ? val
                            : `http://${this.$getState(
                                  "api",
                                  "baseUrl"
                              )}/safety/file/downFile/${val}`;
                console.log(">>>>>>>>>", val);
                this.currentPoster = val;
            },
            immediate: true
        }
    },
    data() {
        return {
            vid: null,
            player: null,
            dialogVisible: false,
            showVideo: false,
            // id: 'video' + Date.now() + (Math.random() * 100).toFixed(0),
            selectOptions: [],
            currentPoster: null,
            currentPlay: null,
            currentDeviceId: null,
            hasFlash: flashChecker().hasFlash,
            showConfig: false,
            currentIndex: 0
        };
    },
    methods: {
        getPlayAddr() {
            return this.currentPlay;
        },
        handleClose() {
            if (this.player) this.player.dispose();
            this.player = null;
            this.dialogVisible = false;
            this.showVideo = false;
            this.$emit("close");
        },
        handleConfig() {
            this.showConfig = true;
        },
        show(options, index = 0) {
            this.selectOptions = options;
            this.currentIndex = index
            var pic = options[index].coverAddr;
            if (pic)
                pic =
                    pic.indexOf("http://") != -1
                        ? pic
                        : `http://${this.$getState(
                              "api",
                              "baseUrl"
                          )}/safety/file/downFile/${pic}`;
            this.currentPoster = pic;
            this.currentPlay =
                options[index].playAddr.indexOf("111.11.14.107") != -1
                    ? /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
                          location.hostname
                      )
                        ? options[index].playAddr.replace(
                              "111.11.14.107",
                              location.hostname
                          )
                        : options[index].playAddr
                    : options[index].playAddr;
            console.log(">>>>>>play addr", this.currentPlay);
            this.dialogVisible = true;
            if (!this.player) {
                this.showVideo = true;
                setTimeout(() => {
                    this.player = videojs(this.vid);
                }, 500);
            } else {
                this.player.dispose();
                this.showVideo = false;
                setTimeout(() => {
                    this.showVideo = true;
                    setTimeout(() => {
                        this.showVideo = true;
                        this.player = videojs(this.vid);
                    }, 1000);
                }, 500);
            }
        },
        onChange(e) {
            for (var m in this.selectOptions) {
                if (this.selectOptions[m].deviceId == e) {
                    this.currentDeviceId = this.selectOptions[m].deviceId;
                    this.show(this.selectOptions, m);
                    return;
                }
            }
        },
        onVideoInitError(times = 0, error = null) {
            if (times === 3) return;
            try {
                this.player = videojs(this.vid);
            } catch (err) {
                console.log("第", times, err);
                setTimeout(() => {
                    this.onVideoInitError(++times, err);
                }, 1000);
            }
        },
    },
    mounted() {
        this.vid =
            this.videoId ||
            `video${Date.now()}${(Math.random() * 1000000).toFixed(0)}`;
        if (!this.dialog) {
            setTimeout(() => {
                // this.player = videojs(this.id)
                this.onVideoInitError();
            });
        }
    },
    beforeDestroy() {
        if (this.player) this.player.dispose();
        this.player = null;
    },
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.dialog-footer {
    .flex(row, space-between);
}
.el-button {
    background: @button-color;
    border-color: @button-color;
}
::v-deep {
    .el-input__inner {
        background: rgba(27, 255, 228, 0.2);
        border-color: rgba(27, 255, 228, 0.2);
        color: #ffffff;
    }
    .el-dialog {
        background: @video-background;
        .el-dialog__title {
            color: #ffffff;
        }
    }
}

</style>
