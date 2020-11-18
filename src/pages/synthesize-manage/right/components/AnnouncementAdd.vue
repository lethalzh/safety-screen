<template>
    <div class="announcement-add">
        <el-dialog @close="handleClose" class="announcement-add-dialog" top="15vw" title="发布公告" v-if="dialogVisible" :visible.sync="dialogVisible" width="30vw" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false">
            <el-form label-position="left" ref="announcementForm" :rules="rules" label-width="80px" :model="form" v-loading="loading">
                <el-form-item label="通知标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="通知内容" prop="content">
                     <el-input :rows="5" type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="通知对象" prop="ttype">
                    <el-select v-model="form.ttype" placeholder="请选择通知对象" style="width:100%">
                         <el-option v-for="(item,key) of _dict.ttype" :key="item" :label="item" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <div class="button-footer">
                    <el-button plain @click="onSubmit">发布</el-button>
                    <el-button @click="handleClose">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'AnnouncementAdd',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            form: {
                title: null,
                content: null,
                ttype: null,
            },
            limit: 1,
            fileList: [],
            imageUrl: '',
            loading: false,
            rules: {
                title: [{ required: true, message: '请输入通知标题', trigger: 'change' }],
                content: [
                    { required: true, message: '请输入通知内容', trigger: 'change' },
                ],
                ttype: [{ required: true, message: '请选择通知对象', trigger: 'change' }],
            },
        }
    },
    methods: {
        init() {
            Object.keys(this.form).forEach((el) => {
                this.form[el] = null
            })
        },
        handleClose() {
            this.$emit('update:dialogVisible', false)
            this.init()
        },
        onSubmit(){
            this.$refs['announcementForm'].validate((valid) => {
                if (valid) {
                    this.onSubmitData()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async onSubmitData() {
            this.loading = true
            let ruid = null;
            if(window.localStorage.getItem('user')){
                ruid = JSON.parse(window.localStorage.getItem('user')).adminId
            }else{
                this.$message.error('登录信息过期，请重新登录')
                return
            }
            const res = await this.$http.reqApi(
                'data',
                'notifySend',
                {
                    ...this.form,
                },
                'post'
            )
            this.loading = false
            if (res && res.result && !res.error) {
                this.$message.success('发布通知成功')
            } else {
                this.$message.error('发布通知失败')
            }

            this.$emit('update:dialogVisible', false)
            this.init()
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.button-footer {
    .flex(row, space-evenly);
}
::v-deep {
    .el-dialog__close {
        color: @base-font-color !important;
        font-size: 16px;
    }
    .el-dialog__title {
        color: @base-font-color !important;
    }
    .el-dialog {
        .el-dialog__title {
            color: #ffffff;
        }
    }
}
/deep/ .el-button {
    .theme-color-3;
    border: 1px solid @theme-color;
    // background-color: @theme-color;
}
/deep/ .el-loading-mask {
    background-color: @loading-background;
}
</style>
