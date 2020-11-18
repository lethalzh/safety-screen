<template>
    <el-dialog
        :visible.sync="visible"
        width="30%"
        :before-close="handleClose"
        :close-on-click-modal="false"
    >   
        <template #title>
            <span style="font-size: 28px; color: red">
                消防告警
            </span>
            <i class="el-icon-warning-outline" style="color: red; font-size: 32px"/>
        </template>
        <div class="warn-title">以下企业处于消防告警状态：</div>
        <div class="company-container">
            <div v-for="comp in companyList" :key="comp.companyNo" @click="$emit('on-choose', comp); handleClose()">
                {{ comp.companyName }}
            </div>
        </div>
        <slot/>
    </el-dialog>
</template>
<script>
    export default {
        name: "FireWarningDialog",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            companyList: {
                type: Array,
                default: ()=> []
            }
        },
        data() {
           return {}
        },
        mounted() {},
        methods: {
            handleClose() {
                this.$emit('update:visible', false)
                // 关闭后5分钟后再提示
                this.$setState('settings', 'fireAlarmExpire', Date.now() + 300000)
                this.$emit('pause-alarm', this._settings.fireAlarmExpire)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import (reference) "~@/assets/css/common.less";
    .warn-title {
        font-size: 16px;
        .mb10;
    }
    .company-container {
        max-height: 30vh;
        overflow-y: auto;
        > div {
            .mb10;
            font-size: 16px;
            .cursor-p;
            &:hover {
                .theme-color-8;
            }
        }
    }
</style>