<template>
    <div class="statistics" v-loading="loading">
        <div class="statistics-item" v-for="cinfo in cinfos" :key="cinfo.index">
            <div class="title">{{ cinfo.title }}</div>
            <div class="num">
                <span
                    class="iconfont"
                    v-for="(num, index) in (cinfo.num + '').split('')"
                    :key="index"
                    :class="{
                        'icon-shuzi0': num == 0,
                        'icon-shuzi1': num == 1,
                        'icon-shuzi2': num == 2,
                        'icon-shuzi3': num == 3,
                        'icon-shuzi4': num == 4,
                        'icon-shuzi5': num == 5,
                        'icon-shuzi6': num == 6,
                        'icon-shuzi7': num == 7,
                        'icon-shuzi8': num == 8,
                        'icon-shuzi9': num == 9,
                    }"
                ></span>
            </div>
        </div>
        <div class="count">派单处理次数 {{ dealAllNum }}次</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            timer: null,
            cinfos: [
                { title: "环卫工人数量", num: 0 },
                { title: "环卫摄像头数", num: 0 },
            ],
            dealAllNum: 0
        }
    },
    async mounted() {
        // 轮询
        await this.polling(async () => {
            await this.queryAllData10s()
        }, 15000)
        this.$bus.$on("cameraNum", num => {
            this.cinfos[1].num = num > 0?(this.cinfos[1].num = num):this.cinfos[1].num
        })
    },
    beforeDestroy() {
        clearTimeout(this.timer)
        this.timer = -1
    },
    methods: {
        async polling(fn, delay) {
            await fn();
            if (this.timer == -1) return;
            this.timer = setTimeout(async () => {
                clearTimeout(this.timer);
                await this.polling(fn, delay);
            }, delay);
        },
        async queryAllData10s() {
            this.getWorkerList();
            this.getWorkOrderStatistics();
        },
        // 环卫工人列表
        async getWorkerList() {
            const res = await this.$http.reqApi("data", "workerList", {
                pageNum: 1,
                pageSize: 1000,
            })
            this.cinfos[0].num = res.total > 0?(this.cinfos[0].num = res.total):this.cinfos[0].num
            // console.log("环卫工人列表",  this.cinfos[0].num)
        },
        // 订单统计
        async getWorkOrderStatistics() {
            let processed = 0;
            const res = await this.$http.reqApi("data", "workOrderStatistics")
            res.rows &&
                res.rows.forEach((item, index) => {
                    if (item.status == 2) {
                        processed += item.orders
                    }
                })
            this.dealAllNum = processed || 0
        },
    },
};
</script>
<style lang="less" scoped>
@import "~@/assets/number/iconfont.css";
@import (reference) "~@/assets/css/common.less";
.statistics {
    .shadow-light;
    background: @background;
    .p10;
    .statistics-item {
        .flex;
        .mb16;
        .title {
            font-size: 14px;
            .mr10;
        }
        .iconfont {
            color: @theme-color-second;
            font-size: 18px;
        }
        .num {
            background: linear-gradient(
                        to bottom,
                        @theme-color-second 0px,
                        @theme-color-second 2px,
                        transparent 3px,
                        transparent 100%
                    )
                    left top no-repeat,
                linear-gradient(
                        to right,
                        @theme-color-second 0px,
                        @theme-color-second 2px,
                        transparent 3px,
                        transparent 100%
                    )
                    left top no-repeat,
                linear-gradient(
                        to bottom,
                        @theme-color-second 0px,
                        @theme-color-second 2px,
                        transparent 3px,
                        transparent 100%
                    )
                    right top no-repeat,
                linear-gradient(
                        to left,
                        @theme-color-second 0px,
                        @theme-color-second 2px,
                        transparent 3px,
                        transparent 100%
                    )
                    right top no-repeat,
                linear-gradient(
                        to top,
                        @theme-color-second 0px,
                        @theme-color-second 2px,
                        transparent 3px,
                        transparent 100%
                    )
                    left bottom no-repeat,
                linear-gradient(
                        to right,
                        @theme-color-second 0px,
                        @theme-color-second 2px,
                        transparent 3px,
                        transparent 100%
                    )
                    left bottom no-repeat,
                linear-gradient(
                        to top,
                        @theme-color-second 0px,
                        @theme-color-second 2px,
                        transparent 3px,
                        transparent 100%
                    )
                    right bottom no-repeat,
                linear-gradient(
                        to left,
                        @theme-color-second 0px,
                        @theme-color-second 2px,
                        transparent 3px,
                        transparent 100%
                    )
                    right bottom no-repeat;
            background-size: 16px 16px;
            padding: 10px 12px;
        }
    }
    .count {
        font-size: 14px;
    }
}
</style>
