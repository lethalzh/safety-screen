<template>
    <el-dialog @close="handleClose" class="announcement-add-dialog" title="设备上报" :visible.sync="visible" width="45vw" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false">
        <el-form label-position="left" ref="form" :rules="rules" label-width="120px" :model="form">
            <el-form-item label="设备名称">
                <el-input v-model="current.deviceName" disabled></el-input>
            </el-form-item>
            <el-form-item label="故障类型" prop="faultType">
                <el-select v-model="form.faultType" placeholder="请选择故障类型" style="width:100%">
                    <el-option v-for="item in devFaultOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="处理人类型" prop="repairerType">
                <el-select v-model="form.repairerType" placeholder="请选择处理单位" style="width:100%" @change="onTargetChange">
                    <el-option v-for="(item, key) of targetOptions" :key="item.value" :label="item.name" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="处理人" prop="repairer">
                <el-select v-model="form.repairer" placeholder="请选处理人" style="width:100%">
                    <el-option v-for="item of dealUserList" :key="item.adminId" :label="item.name" :value="item.adminId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备图片">
                <el-upload
                    :action="`http://${_api.baseUrl}/safety/file/upfile`"
                    list-type="picture-card"
                    :on-preview="onPreview"
                    :on-success="onSuccess"
                    :file-list="fileList"
                    :limit="1"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="描述" prop="faultRemark">
                <el-input :rows="5" type="textarea" v-model="form.faultRemark"></el-input>
            </el-form-item>
            <div class="button-footer">
                <el-button @click="onSubmit" style="width: 20%" type="primary">上报</el-button>
                <el-button @click="handleClose" style="width: 20%" type="danger">取消</el-button>
            </div>
        </el-form>
        <el-image-viewer 
            v-if="showViewer" 
            :on-close="()=> {showViewer = false}" 
            :url-list="previewList" 
            key="viewer"
        />
    </el-dialog>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
    name: "DevReport",
    components: { ElImageViewer },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        current: {
            type: Object,
            default: ()=> {}
        }
    },
    data() {
        return {
            form: {
                faultRemark: '',
                repairer: '',
                repairerType: '',
                faultType: '',
                faultPicture: ''
            },
            showViewer: false,
            previewList: [],
            dealUserList: [],
            devFaultOptions: [],
            fileList: [],
            rules: {
                repairerType: [{ required: true, message: "请选择处理人类型", trigger: 'blur' }],
                repairer: [{ required: true, message: "请选择处理人", trigger: 'blur' }],
                faultRemark: [{ required: true, message: "请输入故障描述", trigger: 'blur' }],
                faultType: [{ required: true, message: "请选择故障类型", trigger: 'blur' }]
            }
        }
    },
    computed: {
        targetOptions() {
            return  [
                { name: `企业（${this.current.companyName}）`, value: 4 },
                { name: '报修人员', value: 6  }
            ]
        }
    },
    watch: {
        visible(show) {
            if(!show) {
                this.fileList = []
                Object.keys(this.form).forEach(key=> {
                    this.form[key] = ''
                })
                this.form.faultPicture = ''
                this.$refs.form.resetFields()
            } else {
                Object.keys(this._dict.devFault).forEach(key=> {
                    this.devFaultOptions.push({
                        value: key,
                        label: this._dict.devFault[key]
                    })
                })
            }
        },
        '_dict.devFault': {
            handler(dictionary) {
                Object.keys(dictionary).forEach(key=> {
                    this.devFaultOptions.push({
                        value: key,
                        label: dictionary[key]
                    })
                })
            },
            deep: true
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:visible', false)
        },
        onTargetChange(value) {
            this.dealUserList = []
            this.form.repairer = ''
            if(value === 1) {
                this.getPersonList(6)
            } else {
                this.getCompanyPerson()
            }
        },
        async getPersonList(roleId) {
            const res = await this.$http.reqApi('data', 'allUserList', { role: roleId })
            if(res) {
                this.dealUserList = res
            }
        },
        async getCompanyPerson() {
            const res = await this.$http.reqApi('data', 'companyManagerList', { companyNo: this.current.companyNo })
            if(res) {
                console.log(res)
            }
        },
        onSubmit() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    var res = await this.$http.reqApi(
                        'data', 'devReport',
                        {
                            deviceId: this.current.deviceId,
                            faultCompany: this.current.companyNo,
                            ...this.form,
                        }, 'post'
                    )
                    if(!res.error) {
                        console.log(res)
                    } else {
                        const errorMessage = res.error.response.data.message
                        this.$message.error(errorMessage || '提交失败！')
                    }
                } else {
                    this.$message.error('请将必填项正确填写完整！')
                }
            })
        },
        onSuccess(res, file) {
            this.form.faultPicture = res.fileId
            this.previewList = [URL.createObjectURL(file.raw)]
        },
        onPreview() {
            this.showViewer = true
        },
    }
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.button-footer {
    .flex(row, space-around);
    text-align: center;
}
::v-deep {
    [class^="el-icon"] {
        font-size: 16px !important;
    }
    .el-icon-circle-close {
        font-size: 32px !important;
        color: #ffffff;
    }
}
</style>