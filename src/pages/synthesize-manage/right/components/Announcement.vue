<!--  -->
<template>
    <div class="announcement">
        <div class="head">
            <div class="left">
                <span>通知公告</span>
                <img src="@/assets/img/yellowMore.png" alt />
            </div>
            <div class="middle" style="cursor: pointer" @click="dialogVisibleAdd = true">发布</div>
            <div class="more" style="cursor: pointer" @click="showAlarmMore">更多&nbsp;></div>
        </div>
        <div class="item" v-loading="loading">
            <div class="mt10" style="text-align: center" v-if="!list.length">暂无数据</div>
            <div
                class="item-list"
                v-for="item in list"
                :key="item.id"
                style="cursor: pointer"
                @click="
                    dialogVisible = true
                    current = item
                "
            >
                <div class="title">
                    <div class='word-ellipsis' :title="item.title">标题：{{ item.title || '-' }}</div>
                    <div><i class="el-icon-arrow-right"></i></div>
                </div>
                <div class="content">
                    内容：{{ handle(item.content) }}
                </div>
            </div>
            <div style="text-align: center" v-if="list.length">了解更多，请点击更多按钮</div>
        </div>

        <announcement-detail :dialog-visible.sync="dialogVisible" :msg="{ ...current }" />
        <announcement-add :dialog-visible.sync="dialogVisibleAdd" />
    </div>
</template>

<script>
import AnnouncementDetail from './AnnouncementDetail'
import AnnouncementAdd from './AnnouncementAdd'
var CronJob = require('cron').CronJob
export default {
    components: { AnnouncementDetail, AnnouncementAdd },
    data() {
        return {
            dialogVisible: false,
            dialogVisibleAdd: false,
            current: {},
            loading: false,
            list: [],
            pageNum: 1,
            pageSize: 20,
        }
    },
    methods: {
        showAlarmMore() {
            this.$bus.$emit('synthesize-manage-center', 'notify')
        },
        async getList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'notify', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                subType: 6,
                type: 1,
                orderBy:'ctime desc'
            })
            this.loading = false
            if (res && res.rows) {
                this.list = res.rows
            } else {
                return
            }
        },
        handle(val) {
            try {
                let data = JSON.parse(val)
                if (data && data.content) {
                    return data.content
                } else {
                    return ''
                }
            } catch (error) {
                return val
            }
        },
    },
    created() {},
    mounted() {
        this.cron = new CronJob(
            '*/15 * * * * *',
            () => {
                this.getList()
            },
            null,
            false,
            'Asia/Chongqing'
        )
        this.cron.start()
        this.getList()
    },
    beforeDestroy() {
        this.cron.stop()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
/deep/ .el-loading-mask {
    background-color: @loading-background;
}
@media screen and (max-width: 1536px){
    .announcement {
        .item {
            .item-list {
                height: calc((100% - 2rem)  * 0.5);
            }
        }
    }
}
@media screen and (min-width: 1537px){
    .announcement {
        .item {
            .item-list {
                height: calc((100% - 3rem)  * 0.3333);
            }
        }
    }
}
.announcement {
    // height: 40%;
    .p10;
    height: 30vh;
    width: 100%;
    color: @base-font-color;
    overflow-y: hidden;
    .head {
        .fb-left;
        .mb10;
        .pr;
        z-index: 2;
        .left {
            &:after {
                content: '';
                width: 30px;
                height: 2px;
                // background: @theme-color;
                margin-top: 2px;
                .db;
                .pa;
            }
            .fb-box-flex(1);
            .pr10;
            color: @base-font-color;
            span {
                margin-right: 8px;
                // border-bottom: 2px soild @base-font-color;
            }
        }
        .middle {
            margin-right: 1rem;
        }
    }
    .item {
        height: calc(100% - 26px);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;

        .item-list {
            // height: calc((100% - 3rem)  * 0.3333);
            .theme-color-6;
            margin-bottom: 1rem;
            border-radius: 4px;
            .p10;
            .title {
                display: flex;
                justify-content: space-between;
            }
            .content {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
        }
    }

    .item::-webkit-scrollbar {
        display: none;
    }
}
</style>
