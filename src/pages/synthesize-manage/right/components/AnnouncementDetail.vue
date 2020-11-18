<template>
    <div class="announcement-detail">
        <el-dialog
            top="15vw"
            :title="`标题：${msg.title}` || '消息详情'"
            :visible.sync="dialogVisible"
            width="50vw"
            :before-close="handleClose"
            :append-to-body="true"
            :close-on-click-modal="false"
        >
        <div>
            <div class="title">
                <span style="font-size:1rem">接收对象：{{ msg.ttype == 1 ? '企业' : '用户' }}</span>
                <span class="ml10" style="font-size:1rem">时间：{{ msg.ctime ? $dayjs(msg.ctime).format('YYYY-MM-DD HH:mm:ss') : '-'}}</span>
            </div>
            <text-show-more :showHeight="50" :content="msg.content">
                <div class="content">
                    内容：{{ handle(msg.content) || '-' }}
                </div>
            </text-show-more>
        </div>
            
        </el-dialog>
    </div>
</template>
<script>
import TextShowMore from './TextShowMore.vue'

export default {
    name: "AnnouncementDetail",
    components: { TextShowMore },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        msg: {
            type: Object,
            default: ()=> {}
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:dialogVisible', false)
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
    }
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.title {
    color: @base-font-color;
}
.content {
    .mt10;
    color: @base-font-color;
    font-size: 14px;
}
::v-deep {
    // .el-dialog__close {
    //     color: @base-font-color !important;
    //     font-size: 16px;
    // }
    // .el-dialog__title {
    //     color: @base-font-color !important;
    // }
    // .el-dialog {
    //     .theme-color-9;
    //     .el-dialog__title {
    //         color: #ffffff;
    //     }
    // }
    .el-dialog__body{
        padding: 15px 20px;
    }
}
</style>