<template>
    <div class="body">
        <div class="public-safety content">
            <div class="title" style="color:#ffffff;padding:16px 10px">
                <div class="pr video-title" style="font-size:1.5rem">治安视频</div>
            </div>
            <div class="video-item" v-infinite-scroll="onLoad" :infinite-scroll-disabled="false" infinite-scroll-throttle-delay="1000">
                <div class="video" v-for="(item, index) in list" :key="item.id" @click="renderVideo(item, index)">
                    <div class="btn" v-if="currentPlayIndex != index">
                        <i style="font-size:45px; color:black" class="el-icon-caret-right"></i>
                    </div>
                    <div class="state" v-if="currentPlayIndex == index">正在播放</div>
                    <el-image class="img" style="width: 100%; height: 100%;" :src="!item.coverAddr?'http://vjs.zencdn.net/v/oceans.png':(item.coverAddr.indexOf('http://') != -1?item.coverAddr:('http://'+$getState(
                    'api','baseUrl')+'/safety/file/downFile/'+item.coverAddr))" fit="contain">
                        <div slot="error" class="image-slot" style="width: 100%; height: 100%;">
                            <!-- <div style="text-align: right;margin-top: 20%;color:yellow; margin-right: 20px">
                            加载失败
                        </div> -->
                        </div>
                    </el-image>
                </div>
                <div v-if="loading" class="mb10" style="textAlign: center;">加载中...</div>
                <div v-if="!loading && noMore" class="mb10" style="textAlign: center;">没有更多了</div>
            </div>
        </div>
    </div>
</template>

<script>
// var CronJob = require('cron').CronJob

export default {
    data() {
        return {
            currentPlayIndex: 0,
            pic: '../../assets/img/sanitation/videoBg1.png',
            list: [],
            pageNum: 1,
            pageSize: 10,
            loading: false,
            noMore: false,
        }
    },
    created() {
        this.$bus.$on('synthesize-manage-close-video', () => {
                this.currentPlayIndex = null
            })
            .off(this, 'synthesize-manage-close-video')
    },
    methods: {
        onLoad() {
            if (this.noMore) return
            this.loading = true
            setTimeout(() => {
                this.pageNum++
                this.getList()
            }, 1500)
        },
        async getList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'siteDevices', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            })
            this.loading = false
            if (res && res.rows) {
                if (this.pageNum == 1) {
                    this.$bus.$emit('synthesize-manage-center', 'video', res.rows[0])
                }
                res.rows.length < 10 && (this.noMore = true)
                this.list = this.list.concat(res.rows)
            } else {
                this.noMore = true
                return
            }
        },
        renderVideo(item, index) {
            this.currentPlayIndex = index
            this.$bus.$emit('synthesize-manage-center', 'video', item)
        },
    },
    mounted() {
        // this.cron = new CronJob(
        //     '*/15 * * * * *',
        //     () => {
        //         this.getList()
        //     },
        //     null,
        //     false,
        //     "Asia/Chongqing"
        // )
        // this.cron.start()

        this.$bus
            .$on('current-video-change', (monitor) => {
                if (monitor.constructor.name === 'Object') {
                    this.currentPlayIndex = this.list.findIndex((item) => item.deviceId == monitor.deviceId)
                }
            })
            .off(this, 'current-video-change')
        this.getList()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.body {
    // width: 15vw !important;
    color: @base-font-color;
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    .public-safety {
        height: 100%;
        width: 100%;
        .pl8;
        .pr8;
    }
    .video-title {
        color: @base-font-color;
        &::after {
            content: '';
            width: 30px;
            height: 1px;
            height: 2px;
            background: @theme-color;
            .db;
            .pa;
        }
    }
    .video-item {
        height: calc(100% - 52px);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .video-item::-webkit-scrollbar {
        display: none;
    }
    // .content::-webkit-scrollbar {
    //     display: none;
    // }
    // .content {
    //     height: 100%;
    //     overflow-y: scroll;
    //     -ms-overflow-style: none;
    //     scrollbar-width: none;
    // }
    .video {
        cursor: pointer;
        position: relative;
        margin-bottom: 1rem;
        padding-left: 6px;
        padding-right: 6px;
        height: 20vh;
        .state {
            .pa;
            .p4;
            .theme-color-8;
            border-radius: 5px;
            color: #ffffff;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999;
            font-size: 1.2em;
        }
    }

    .img {
        // position: relative;
        .theme-color-6;
        .image-slot {
            .theme-color-6;
        }
    }
    .btn {
        z-index: 99;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 1);
        position: absolute;
        margin: auto auto; /*水平居中*/
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        cursor: pointer;
    }

    /deep/ .el-image__placeholder {
        background: rgba(255, 255, 255, 1);
    }
}
</style>
