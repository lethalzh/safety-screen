<template>
    <div class="announcement-detail">
        <el-dialog
            top="15vw"
            title="流动人口详情"
            :visible.sync="dialogVisible"
            width="50vw"
            :before-close="handleClose"
            :append-to-body="true"
            :close-on-click-modal="false"
        >
            <div class="detail">
                <div>
                    <span>姓名</span>
                    <span>{{ info.name }}</span>
                </div>
                <div>
                    <span>性别</span>
                    <span>{{ $getState('dict', 'sex')[info.sex] }}</span>
                </div>
                <div>
                    <span>年龄</span>
                    <span>{{ info.age }}</span>
                </div>
                <div>
                    <span>地址</span>
                    <span>{{ info.addr }}</span>
                </div>
                <div>
                    <span>身份证号</span>
                    <span>{{ info.idNumber }}</span>
                </div>
                <div>
                    <span>电话</span>
                    <span>{{ info.tel }}</span>
                </div>
                <div>
                    <span>公司</span>
                    <span>{{ info.companyName }}</span>
                </div>
                <div>
                    <span>籍贯</span>
                    <span>{{ info.nativePlace }}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "FloatingDetail",
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: ()=> {}
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:dialogVisible', false)
        }
    }
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.detail {
    color: @base-font-color;
    > div {
        .mb10;
        span {
            &:nth-child(2n-1) {
                .dib;
                width: 150px;
            }
            font-size: 14px;
        }
    }
}

</style>