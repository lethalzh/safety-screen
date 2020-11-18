<template>
    <div class="detail-item">
        <div class="detail-img" :class="layout == 'top' ? 'img-top' : 'img-bottom'">
            <div class="img-bg" :class="`img-bg-${info.key}`"></div>
        </div>
        <div class="detail-info" :class="layout == 'top' ? 'detail-info-bottom' : 'detail-info-top'">
            <div class="default-info" style="height:100%">
                <div class="tm pt16">
                    <img :src="renderImg(info.icon)" alt />
                </div>
                <div class="tm mt16" style="font-size:1.5rem">
                    {{ info.name }}
                </div>
                <div class="dsc">
                    {{ info.content }}
                </div>
            </div>

            <div class="list pt16" style="height:100%">
                <div class="list-item">
                    <div class="list-item-content" v-for="item in info.list" :key="item">
                        <img src="@/assets/img/yellowMore.png" alt />
                        <span class="ml8">{{ item }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // top 图在顶部 bottom 图在底部
        layout: {
            type: String,
            default: 'top',
        },
        info: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        renderImg(pic){
            return require(`@/assets/img/${pic}.png`) || require('@/assets/img/environmental-home.png')
        }
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.detail-item {
    height: 100%;
    width: 100%;
    position: relative;
    .detail-img {
        height: 40%;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        .img-bg {
            height: 100%;
            width: 100%;
            background-image: url('~@/assets/img/environmental-home-bg.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100%;
        }
        .img-bg-safe {
            background-image: url('~@/assets/img/safe-home-bg.png');
        }
        .img-bg-env {
            background-image: url('~@/assets/img/environmental-home-bg.png');
        }
        .img-bg-ele {
            background-image: url('~@/assets/img/electric-home-bg.png');
        }
        .img-bg-syn {
            background-image: url('~@/assets/img/synthesize-home-bg.png');
        }
    }
    
    .img-top {
        position: absolute;
        left: 0;
        top: 0;
    }
    .img-bottom {
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .detail-info {
        height: 60%;
        width: 100%;
        overflow: hidden;
        .dsc {
            .pt16;
            .pl32;
            .pr32;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
        }
        .default-info {
            transition: 0.6s;
        }
        .list {
            background-color: @normal-color;
            transition: 0.6s;
            // margin:0 auto;
            // text-align:left;
            .list-item {
                text-align: left;
                width: 50%;
                margin: 0 auto;
            }
        }
    }
    .detail-info:hover .default-info,
    .detail-info:hover .list {
        transform: translateY(-100%);
    }
    .img-bg:hover {
        transition: 0.6s;
        background-size: 150%;
    }
    .detail-info-top {
        position: absolute;
        left: 0;
        top: 0;
    }
    .detail-info-bottom {
        position: absolute;
        left: 0;
        bottom: 0;
    }
}
</style>
