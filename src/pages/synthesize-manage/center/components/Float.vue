<template>
    <div class="float-container">
        <div class="title">
            <div style="font-size: 2rem">流动人口统计图</div>
            <slot/>
        </div>
        <div class="regional-rank p10" v-loading="loading">
            <float-rank :place="nativePlace" />
        </div>
        <div class="statistics">
            <div class="place p10">
                <place :addr="addr" v-loading="loading" />
            </div>
            <div class="age p10">
                <age :age="age" v-loading="loading" />
            </div>
            <div class="sex p10">
                <sex :sex="sex" v-loading="loading" />
            </div>
        </div>
    </div>
</template>

<script>
import FloatRank from './echarts/FloatRank'
import Age from './echarts/Age'
import Sex from './echarts/Sex'
import Place from './echarts/Place'
export default {
    components: {
        FloatRank,
        Age,
        Sex,
        Place,
    },
    data() {
        return {
            loading: false,
            nativePlace: [],
            addr: [],
            age: [],
            sex: [],
        }
    },
    computed: {},
    watch: {},
    methods: {
        async getData() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'flowPeopleCount', {})
            this.loading = false
            if (res && !res.error) {
                this.nativePlace = res.nativePlace
                this.addr = res.addr
                this.age = res.age
                this.sex = res.sex
            } else {
                return
            }
        },
    },
    created() {},
    mounted() {
        this.getData()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.float-container {
    background: @background;
    // border: 2px solid @theme-color;
    .shadow-light;
    height: 100%;
    width: 100%;
    color: @base-font-color;
    overflow-y: hidden;
    .title {
        .flex(row, space-between);
        .p10;
        .pr;
        z-index: 10;
        .left {
            color: @base-font-color;
        }
    }
    .statistics {
        .flex(row, space-between, center, nowrap);
        .place {
            flex: 1;
        }
        .age {
            flex: 1;
        }
        .sex {
            flex: 1;
        }
    }
    .regional-rank /deep/ .el-loading-mask {
        background-color: @loading-background;
    }
    .statistics /deep/ .el-loading-mask {
        background-color: @loading-background;
    }
}

</style>
