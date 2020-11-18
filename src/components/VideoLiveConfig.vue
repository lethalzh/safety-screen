<template>
    <div>
        <el-dialog @close="handleClose" title="播放设备配置" :visible.sync="visible" width="45vw" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false">
            <el-form label-position="left" ref="form" :rules="rules" label-width="120px" :model="form">
                <el-form-item label="播放设备名" prop="deviceName">
                    <el-input v-model="form.deviceName"></el-input>
                </el-form-item>
                <el-form-item label="经纬度" prop="longitude">
                    <el-col :span="11">
                        <el-input v-model="form.longitude" type="number"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">
                        <div style="text-align: center">-</div>
                    </el-col>
                    <el-col :span="11">
                        <el-input v-model="form.latitude" type="number"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="播放设备封面">
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
                <div class="button-footer">
                    <el-button @click="onSubmit" style="width: 20%" type="primary">提 交</el-button>
                    <el-button @click="handleClose" style="width: 20%" type="danger">取 消</el-button>
                </div>
            </el-form>
            <el-image-viewer 
                v-if="showViewer" 
                :on-close="()=> {showViewer = false}" 
                :url-list="previewList" 
                key="viewer"
            />
        </el-dialog>
        
    </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
    name: "VideoLiveConfig",
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
                deviceName: '',
                longitude: '',
                latitude: '',
                coverAddr: ''
            },
            showViewer: false,
            previewList: [],
            fileList: [],
            rules: {
                longitude: [{ required: true, message: "请输入经纬度", trigger: 'blur' }],
                deviceName: [{ required: true, message: "请输入设备名", trigger: 'blur' }],
            }
        }
    },
    watch: {
        visible(show) {
            if(!show) {
                this.fileList = []
                Object.keys(this.form).forEach(key=> {
                    this.form[key] = ''
                })
                this.$refs.form.resetFields()
            } else {
                Object.keys(this.current).forEach(key=> {
                    if(key in this.form) {
                        this.form[key] = this.current[key]
                    }
                })
                if(this.current.gps.split(',').length)
                this.previewList = [`http://${this._api.baseUrl}/safety/file/downFile/${this.form.coverAddr}`]
                this.form.longitude = this.current.gps.split(',')[0]
                this.form.latitude = this.current.gps.split(',')[1]
                this.fileList = [{ name: '封面图', url: `http://${this._api.baseUrl}/safety/file/downFile/${this.form.coverAddr}` }]
            }
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:visible', false)
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
                    let rForm = cloneDeep(this.form)
                    rForm.gps = `${rForm.longitude},${rForm.latitude}`
                    delete rForm.longitude
                    delete rForm.latitude
                    const res = await this.$http.reqApi(
                        'camera', 'editDevice',
                        {
                            ...rForm
                        }, 'put', {
                            id: this.current.deviceId
                        }
                    )
                    if(!res.error) {
                        this.$message.success('修改成功！')
                        this.handleClose()
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
            this.form.coverAddr = res.fileId
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
    .el-form-item__label {
        color: #ffffff;
    }
    .el-input__inner {
        background: rgba(27, 255, 228, 0.2);
        border-color: rgba(27, 255, 228, 0.2);
        color: #ffffff;
    }
    .el-dialog {
        background: rgba(42, 42, 42, 0.9) !important;
        .el-dialog__title {
            color: #ffffff;
        }
    }
    
}

</style>