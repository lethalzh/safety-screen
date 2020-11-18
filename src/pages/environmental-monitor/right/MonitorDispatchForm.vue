<template>
    <el-dialog title="派单" :visible.sync="_visible" append-to-body width="55vw">
        <el-form ref="addForm" :model="addForm" label-width="110px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="派单时间">
                        <div style="font-size: 14px"> {{ $dayjs().format("YYYY-MM-DD hh:mm:ss") }} </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="处理人姓名">
                        <el-input class="input" v-model="addForm.dealUserName" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

             <el-row>
                <el-col :span="12">
                    <el-form-item label="到期时间">
                        <!-- <div style="font-size: 14px"> {{ $dayjs(addForm.expires).format("YYYY-MM-DD HH:mm:ss") || '-' }} </div> -->
                        <el-date-picker
                            class="mr16"
                            size="small"
                            clearable
                            v-model="addForm.expires"
                            type="datetime"
                            placeholder="选择到期时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyyMMddHHmmss"
                            @change="$emit('on-date-change', addForm.expires)"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="处理人电话">
                        <el-input class="input" v-model="addForm.dealUserTel" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="点位截图">
                <el-upload
                    class="avatar-uploader"
                    :action="'http://' + _api.baseUrl + '/safety/file/upfile'"
                    :limit="1"
                    :file-list="fileList"
                    accept="image/*"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :on-error="onError"
                    :on-exceed="onExceed"
                >
                    <div class="delete pr" v-if="imgUrl">
                        <i class="el-icon-delete pa" style="font-size: 16px; right: -12px; top: -12px; z-index: 99999" @click.stop="onRemove"></i>
                        <img :src="imgUrl" class="avatar" width="128" height="72">
                    </div>
                    
                    <i v-else class="el-icon-plus avatar-uploader-icon" style="font-size: 16px"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="派单备注">
                <el-input
                    class="input"
                    type="textarea"
                    v-model="addForm.sendRemark"
                    size="medium"
                ></el-input>
            </el-form-item>

            <el-form-item label="通知环卫工人">
                <el-radio-group v-model="addForm.sendToWorker" @change="$emit('on-radio-change', addForm.sendToWorker)">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="_visible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'
export default {
    name: "MonitorDispatchForm",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        basicForm: {
            type: Object,
            required: true,
            default: ()=> {}
        }
    },
    model: {
        prop: 'visible',
        event: 'update'
    },
    computed: {
        _visible: {
            get() {
                return this.visible
            },
            set(show) {
                this.$emit('update', show)
            }
        }
    },
    watch: {
        visible(show) {
            if(show) {
                Object.keys(this.basicForm).forEach(key=> {
                    if(key in this.addForm)
                        this.$set(this.addForm, key, this.basicForm[key])
                })
                this.addForm.dealUserName = this.basicForm.name
                this.addForm.dealUserTel = this.basicForm.tel
            } else {
                Object.keys(this.addForm).forEach(key=> {
                    this.$set(this.addForm, key, '')
                })
                this.fileList = []
            }
        }
    },
    data() {
        return {
            fileList: [],
            imgUrl: "",
            addForm: {
                dealUser: "",
                dealUserName: "",
                msgSendType: "",
                dealUserTel: "",
                expires: '',
                sid: "",
                sendToWorker: false,
                picUrl: ""
            },
        }
    },
    methods: {
        // 提交派单
        async submit() {
            let form = cloneDeep(this.addForm)
            delete form.dealUserName
            delete form.dealUserTel
            const res = await this.$http.reqApi(
                "data",
                "dispatchOrder",
                form,
                "post"
            )
            if (!res || res.error) {
                this.$message.error("派单失败,请稍后再试!")
                return
            }
            this.$message.success("派单成功!")
            this.$bus.$emit("get-dispatch-list", this.basicForm)
            this._visible = false
        },
        // 文件上传成功
        handleAvatarSuccess(res, file) {
            this.addForm.picUrl = res.fileId
            this.imgUrl = URL.createObjectURL(file.raw)
        },
        // 文件上传失败
        onError() {
            this.$message.error('照片上传失败！')
            this.imgUrl && URL.revokeObjectURL(this.addForm.picUrl)
            this.imgUrl = ''
        },
        // 超出一个
        onExceed() {
            this.$message.error(`请上传不超过1张图片！`)
        },
        // 删除文件
        onRemove() {
            this.addForm.picUrl = ""
            this.imgUrl = ""
            this.fileList = []
        }
    },
};
</script>