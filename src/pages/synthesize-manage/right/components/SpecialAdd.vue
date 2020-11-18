<template>
    <div class="special-add">
        <el-dialog @close="handleClose" class="specia-add-dialog" top="15vw" title="添加设控人员" v-if="dialogVisible" :visible.sync="dialogVisible" width="30vw" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false">
            <el-form label-position="left" ref="speciaForm" :rules="rules" label-width="80px" :model="form" v-loading="loading">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="idNumber">
                    <el-input v-model="form.idNumber"></el-input>
                </el-form-item>
                <el-form-item label="监控类型" prop="mtype">
                    <el-select v-model="form.mtype" placeholder="请选择监控类型" style="width:100%">
                        <el-option v-for="(item,key) of _dict.mtypes" :key="item" :label="item" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="籍贯" prop="nativePlace">
                    <el-input v-model="form.nativePlace"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="form.sex">
                        <el-radio :label="0" :value="0">男</el-radio>
                        <el-radio :label="1" :value="1">女</el-radio>
                        <el-radio :label="2" :value="2">未知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="照片">
                    <el-upload class="avatar-uploader" :action="'http://' + _api.baseUrl + '/safety/file/upfile'" :limit="limit" :file-list="fileList" accept="image/*" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="onError" :on-exceed="onExceed">
                        <div class="delete pr" v-if="imageUrl">
                            <i class="el-icon-delete pa" style="font-size: 16px; right: -12px; top: -12px; z-index: 99999" @click.stop="onRemove"></i>
                            <img :src="imageUrl" class="avatar" width="64" height="64" />
                        </div>

                        <i v-else class="el-icon-plus avatar-uploader-icon" style="font-size: 16px"></i>
                    </el-upload>
                </el-form-item>
                <div class="button-footer">
                    <el-button plain @click="onSubmit">添加</el-button>
                    <el-button @click="handleClose">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'SpecialAdd',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            form: {
                name: null,
                idNumber: null,
                mtype: null,
                nativePlace: null,
                sex: null,
                photo: null,
            },
            limit: 1,
            fileList: [],
            imageUrl: '',
            loading: false,
            rules: {
                name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
                idNumber: [
                    { required: true, message: '请输入身份证号', trigger: 'change' },
                    { pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/, trigger: 'blur', message: '身份证号不合法！' },
                ],
                mtype: [{ required: true, message: '请选择监控类型', trigger: 'change' }],
                nativePlace: [{ required: true, message: '请输入籍贯', trigger: 'change' }],
                sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
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
            this.imageUrl && URL.revokeObjectURL(this.imageUrl)
            this.init()
        },
        onSubmit(){
            this.$refs['speciaForm'].validate((valid) => {
                if (valid) {
                    this.onSubmitData()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async onSubmitData() {
            if (!this.imageUrl) return this.$message.warning('请上传照片！')
            this.loading = true
            const res = await this.$http.reqApi(
                'data',
                'addPeopleMonitoring',
                {
                    ...this.form,
                },
                'post'
            )
            this.loading = false
            if (res && res.result && !res.error) {
                this.$message.success('添加成功')
            } else {
                this.$message.success('添加失败')
            }

            this.$emit('update:dialogVisible', false)
            this.init()
        },
        // 文件上传成功
        handleAvatarSuccess(res, file) {
            // this.form.photo = `http://${this._api.baseUrl}/safety/file/downFile/${res.fileId}`
            this.form.photo = res.fileId
            this.imageUrl = URL.createObjectURL(file.raw)
        },
        // 文件上传失败
        onError() {
            this.$message.error('照片上传失败！')
            this.imageUrl && URL.revokeObjectURL(this.imageUrl)
            this.imageUrl = ''
        },
        // 超出一个
        onExceed() {
            this.$message.error(`请上传不超过${this.limit}张图片！`)
        },
        // 删除文件
        onRemove() {
            this.imageUrl = ''
            this.form.photo = ''
            this.fileList = []
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
