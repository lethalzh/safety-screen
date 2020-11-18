<!--  -->
<template>
    <div class="handle-module">
        <div class="violation-type">
            违规类型 ｜
            <span>未开启治污设备：{{ company.noTreatmentCount || '-' }}</span>
            <span>未响应停产：{{ company.rspStopCount || '-' }}</span>
            <span>未响应减产：{{ company.rspEnergyCount || '-' }}</span>
        </div>
        <div class="mt16">
            <div class="mb10">违规措施</div>
            <div class="measure-radio">
                <el-radio-group v-model="radio" size="small">
                    <el-radio style="border: 1px solid #53ac85;" :label="1" border>{{ dealItem[1] }}</el-radio>
                    <el-radio style="border: 1px solid #53ac85;" :label="2" border>{{ dealItem[2] }}</el-radio>
                    <el-radio style="border: 1px solid #53ac85;" :label="3" border>{{ dealItem[3] }}</el-radio>
                    <el-radio style="border: 1px solid #53ac85;" :label="4" border>{{ dealItem[4] }}</el-radio>
                </el-radio-group>

                <div class="mb10 mt10" style="text-align: left">整改日期</div>
                <div class="limit" v-if="radio == 1">
                    <el-date-picker 
                        v-model="limitTime" 
                        type="date" 
                        size="mini"
                        placeholder="选择整改日期"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </div>
            </div>
        </div>
        <div class="mt16">
            <div class="mb10">处理详情</div>
            <el-checkbox-group v-model="checkList" text-color="#000000">
                <el-checkbox key="1" :label="1">短信转发至企业联系人</el-checkbox>
                <el-checkbox key="2" :label="2">电话拨给企业联系人</el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="mt16">
            <el-input type="textarea" placeholder="请输入处理详情..." v-model="textarea"></el-input>
        </div>
        <div class="complete mt16">
            <div class="btn" @click="handle">
                处理
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['company'],
    components: {},
    data() {
        return {
            radio: 1,
            checkList: [],
            textarea: null,
            showHandle: false,
            loading: false,
            limitTime: null,
            pickerOptions: {
                // 限制最近三天
                disabledDate(time) {
                    return time.getTime() <= Date.now()
                }
            }
        }
    },
    computed: {
        dealItem() {
            return this._dict.deal || {}
        },
    },
    watch: {},
    methods: {
        handle() {
            if (!this.company.companyNo) {
                this.$message.warning('请选择处理的企业')
                return
            }
            if (this.radio == 1 && !this.limitTime) {
                this.$message.warning('请选择整改期限')
                return
            }
            if(this.checkList.length == 0){
                this.$message.warning('请选择传信方式')
            }
            let data = {
                companyNo: this.company.companyNo,
                deal: this.radio,
                dealDes: this.textarea,
                limitTime: this.$dayjs(this.limitTime).format('YYYYMMDDHHmmss'),
            }
            this.handleViolation(data)
        },
        async handleViolation(data) {
            this.loading = true
            var res = await this.$http.reqApi(
                'data',
                'violationHandle',
                {
                    ...data,
                },
                'post',
                {
                    companyId: this.company.companyNo,
                }
            )
            this.loading = false
            if (res && !res.error) {
                this.$message.warn('提交成功')
            }
        },
    },
    created() {},
    mounted() {},
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.handle-module {
    color: @base-font-color;
    .p10;
    .violation-type {
        span {
            padding-right: 20px;
        }
    }
    .complete {
        text-align: center;
        .btn {
            height: 32px;
            line-height: 1;
            margin-left: auto;
            margin-right: auto;
            font-size: 1rem;
            cursor: pointer;
            z-index: 202;
            width: 30%;
            border-radius: 5px;
            text-align: center;
            padding: 10px 0;
            color: @background;
            background-color: @theme-color-second;
        }
    }
    .measure-radio {
        .pr;
        z-index: 200;
        text-align: center;
        .limit {
            text-align: left;
            .mt10;
        }
    }
}

.measure-radio /deep/ .el-radio__input {
    display: none;
}

.measure-radio /deep/ .el-radio {
    margin-right: 10px;
    width: calc((100% - 70px) * 0.25);
    text-align: center;
}
.measure-radio /deep/ .el-radio-group {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.measure-radio /deep/ .el-textarea__inner {
    color: @base-font-color;
    // background-color: null;
    .theme-color-3;
    border: 1px solid @theme-color;
}

/deep/ .el-loading-mask {
    background-color: @loading-background;
}

.measure-radio /deep/ .is-checked {
    .el-radio__label {
        color: @theme-color-second !important;
    }
    .theme-color-4;
}

.limit /deep/ .el-input__inner {
    background-color: rgba(255, 255, 255, 0);
    border: 1px solid @theme-color;
    height: 32px;
}
/deep/  .el-input__inner::placeholder {
        color: @font-black;
        text-align:center;
    }
     /* 谷歌 */
/deep/    .el-input__inner::-webkit-input-placeholder {
        color: @font-black;
        text-align:center;
    }
     /* 火狐 */
/deep/   .el-input__inner:-moz-placeholder {
        color: @font-black;
        text-align:center;
    }
     /*ie*/
/deep/   .el-input__inner:-ms-input-placeholder {
        color: @font-black;
        text-align:center;
    }
/deep/  .el-textarea__inner::placeholder {
        color: @font-black;
    }
     /* 谷歌 */
/deep/    .el-textarea__inner::-webkit-input-placeholder {
        color: @font-black;
    }
     /* 火狐 */
/deep/   .el-textarea__inner:-moz-placeholder {
        color: @font-black;
    }
     /*ie*/
/deep/   .el-textarea__inner:-ms-input-placeholder {
        color: @font-black;
    }
</style>
