<template>
    <div class="map-company-detail-message" :style="{ width }" v-show="show" v-if="render">
        <div class="title">
            <span>发送通知</span>
            <div class="close" @click="close">X</div>
        </div>

        <div>
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="接收对象" prop="tels">
                    <el-select v-model="form.tels" multiple placeholder="请选择接收对象">
                        <el-option v-for="opt in receivePerson" :key="opt.name" :label="opt.name" :value="opt.tel"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="通知方式" prop="sendType">
                    <el-select v-model="form.sendType" placeholder="请选择通知方式">
                        <el-option v-for="opt in options" :key="opt.name" :label="opt.name" :value="opt.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="通知内容" v-if="form.sendType >= 4">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>

            <div class="submit-button">
                <el-button @click="submit" type="primary" style="border: #53ac85; width: 200px" >完成</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { dictByBit } from '@/utils/index'
export default {
    name: "MapCompanyDetailMessage",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        companyNo: {
            required: true
        }
    },
    data() {
       return {
           render: true,
           form: {
               tels: '',
               sendType: 4,
               content: ''
           },
           options: [],
           receivePerson: [],
           rules: {
               tels: [{ required: true, message: '请选择接收对象', trigger: 'blur' }],
               sendType: [{ required: true, message: '请选择发送方式', trigger: 'blur' }]
           },
           width: 0
       }
    },
    watch: {
        show(value) {
            if(value) {
                this.width = document.querySelector('.center-container').offsetWidth - 32 + 'px'
                !this.options.length && this.makeUpSendWay()
                this.getContactPerson()
            } else {
                this.form = {
                    tels: '',
                    sendType: 4,
                    content: ''
                }
            }
        }
    },
    methods: {
        close() {
            this.$emit('update:show', false)
        },
        // 组合发送方式的下拉框
        makeUpSendWay() {
            // 硬编码赋值
            const TOTAL_WAY = Object.keys(this._dict.msgSendType || {}).reduce((prev, next)=> {
                return Number(prev) + Number(next)
            }, 0)
            for(let i = 1; i<=TOTAL_WAY; i++) {
                this.options.push({
                    name: dictByBit(this._dict.msgSendType, i, '+'),
                    value: i
                })
            }
        },
        // 获取报警联系人列表
        async getContactPerson() {
            const res = await this.$http.reqApi("data", "companyContactPerson", {
                companyNo: this.companyNo,
                pageNum: 1,
                pageSize: 1000
            })
            if(res && res.rows) {
                this.receivePerson = res.rows || []
            }
        },
        // 发送消息
        async sendMsg() {
            const res = await this.$http.reqApi('data', 'sendWarnMsg', {
                companyNo: this.companyNo,
                ...this.form
            }, 'post')
            if(res && res.error) {
                this.$message.error('通知发送失败！')
                return
            }
            this.$message.success('通知发送成功！')
            this.close()
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.sendMsg()
                } else {
                    return false
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.map-company-detail-message {
    .pa;
    left: 0;
    width: 100%;
    bottom: 64px;
    background: @background;
    .shadow-light;
    .p16;
    .ml16;
    .title {
        .flex(row, space-between);
        .mb16;
        span {
            font-size: 16px;
        }
    }
    .close {
        border-radius: 50%;
        background: @theme-color;
        width: 24px;
        height: 24px;
        .flex(row, center);
        cursor: pointer;
        color: #fff;
    }
    .submit-button {
        width: 100%;
        .flex(row, center);
    }
}
::v-deep {
    .el-select__caret {
        color: @base-font-color !important;
    }
    .el-input__inner, .el-textarea__inner {
        background: rgba(27, 255, 228, 0);
        border-color: @base-font-color;
        color: @base-font-color;
    }
    input::-webkit-input-placeholder, .el-form-item__label{
        color: @base-font-color;
    }
}
</style>