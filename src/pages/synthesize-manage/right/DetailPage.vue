<template>
    <div class="body">
        <div class="detail-page content">
            <div class="top">
                <announcement />
            </div>
            <div class="middle">
                <floating />
            </div>
            <div class="bottom">
                <special />
            </div>
        </div>
    </div>
</template>

<script>
import VideoLive from '@/components/VideoLive'
import Announcement from './components/Announcement'
import Floating from './components/Floating'
import Special from './components/Special'

export default {
    components: { VideoLive, Announcement, Floating, Special },
    data() {
        return {
            url: 'rtmp://58.200.131.2:1935/livetv/hunantv',
            stylewh: { width: '500px', height: '500px' },
            pic: '../../assets/img/sanitation/videoBg1.png',
        }
    },
    computed: {},
    watch: {},
    methods: {},
    created() {},
    mounted() {},
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.body {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    .detail-page {
        height: 100%;
        width: 100%;
        // background: rgba(0, 0, 0, 0.8);
    }
    .content {
        overflow-y: hidden;
    }
    .body::-webkit-scrollbar {
        display: none;
    }
}
</style>
