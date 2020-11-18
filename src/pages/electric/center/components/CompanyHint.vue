<template>
    <div>
        <div
            class="company-hint-content"
            :class="{
                'normal-color': company.monStat == 0,
                'alarm-color': company.monStat == 1,
                'stop-color': company.monStat == 2,
            }"
            v-if="isViolation"
        >
            <span>企业编号 : {{ company.companyNo }}</span>
            <span>{{ company.companyName }}</span>
            <span v-if="company.monStat == 0">目前企业一切正常</span>
            <span v-if="company.monStat == 2">目前企业已经停工</span>
            <span v-if="company.monStat == 1">违规类型：{{ _dict.violationType[company.violationType] }}</span>
            <!-- <span v-if="company.monStat== 2">违规时间：类型A</span> -->
        </div>
    </div>
</template>

<script>
export default {
    props: ['companyInfo'],
    data() {
        return {
            isViolation: false,
            company: {},
        }
    },
    watch: {
        companyInfo: {
            handler(val) {
                this.isViolation = false
                if (val) {
                    this.isViolation = true
                    this.company = val
                }
            },
            immediate: true,
            deep: true,
        },
    },
    created() {},
    methods: {},
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.company-hint-content {
    .pr;
    z-index: 11;
    width: 65%;
    border-radius: 5px;
    padding: 12px 16px;
    span {
        font-size: 1.5rem;
        margin-right: 1.5rem;
    }
}
.alarm-color {
    color: @warn-font-color;
    border: 1px solid @warn-font-color;
    .warn-color-3;
}
.normal-color {
    color: @theme-color-second;
    border: 1px solid @theme-color;
    .theme-color-3;
}
.stop-color {
    color: @base-font-color;
    border: 1px solid @base-font-color;
    background-color: @stop-color;
}
</style>
