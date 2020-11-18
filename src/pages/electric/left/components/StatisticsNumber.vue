<template>
    <div class="statistics-number" v-loading="loading">
        <div class="statistics-number-item" v-for="cinfo in cinfos" :key="cinfo.title">
            <div class="title">{{ cinfo.title }}</div>
            <div class="num">
                <svg width="7vw" class="pa" style="overflow: visible; z-index: 9999; pointer-events: none; top:1px; left: 0;">
                    <line x1="0" y1="0" x2="20%" y2="0" style="stroke:#12C9B4;stroke-width:2" />
                    <line x1="0" y1="0" x2="0" y2="10" style="stroke:#12C9B4;stroke-width:2" />
                    <line x1="80%" y1="0" x2="100%" y2="0" style="stroke:#12C9B4;stroke-width:2" />
                    <line x1="100%" y1="0" x2="100%" y2="10" style="stroke:#12C9B4;stroke-width:2" />
                    <line x1="0" y1="33" x2="20%" y2="33" style="stroke:#12C9B4;stroke-width:2" />
                    <line x1="0" y1="33" x2="0" y2="23" style="stroke:#12C9B4;stroke-width:2" />
                    <line x1="80%" y1="33" x2="100%" y2="33" style="stroke:#12C9B4;stroke-width:2" />
                    <line x1="100%" y1="33" x2="100%" y2="23" style="stroke:#12C9B4;stroke-width:2" />
                    <!-- <line x1="10%" y1="0" x2="30%" y2="0" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="39%" y1="0" x2="40%" y2="0" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="96%" y1="0" x2="97%" y2="0" style="stroke:#12C9B4;stroke-width:2" /> -->
                </svg>
                <span
                    style="top: 2.5px"
                    class="pr iconfont"
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
                    v-for="(num, index) in (cinfo.num + '').split('')"
                ></span>
            </div>
        </div>
        <div class="total">违规企业数量：{{ dealAllNum }}</div>
    </div>
</template>

<script>
var CronJob = require('cron').CronJob
export default {
    props: ['countData'],
    data() {
        return {
            loading: false,
            cinfos: [
                { title: '生产设备用电', num: 0 },
                { title: '治污设备用电', num: 0 },
                { title: '设备用电总和', num: 0 },
                { title: '企业数量', num: 0 },
            ],
            dealAllNum: 0,
            cron: null,
        }
    },
    watch: {
        countData: {
            handler(val) {``
                if (val) {
                    this.cinfos[3].num = val.factoryCount > 0 ? val.factoryCount : this.cinfos[3].num
                    this.dealAllNum = val.overproofCount > 0 ? val.overproofCount : this.dealAllNum
                }
            },
            immediate: true,
            deep: true,
        },
    },
    created() {
        this.$bus.$on('updateElectricType',()=>{
            this.getVolToday();
        }).off(this,'updateElectricType')
        // type: this._settings.electricType
    },
    mounted() {
        this.cron = new CronJob(
            '*/15 * * * * *',
            () => {
                this.getVolToday()
            },
            null,
            false,
            'Asia/Chongqing'
        )
        this.cron.start()
        this.getVolToday()
    },
    beforeDestroy() {
        this.cron.stop()
    },
    methods: {
        async getVolToday() {
            const res = await this.$http.reqApi('data', 'voltameterToday', {
                regionId: this._dict.regionRoot.code,
                type: this._settings.electricType
            })
            if (res && !res.error) {
                this.cinfos[0].num = res.dev2 > 0 ? res.dev2.toFixed(0) : this.cinfos[0].num
                this.cinfos[1].num = res.dev1 > 0 ? res.dev1.toFixed(0) : this.cinfos[1].num
                this.cinfos[2].num = res.dev3 > 0 ? res.dev3.toFixed(0) : this.cinfos[2].num
            } else {
                return
            }
        },
    },
}
</script>
<style lang="less" scoped>
@import '~@/assets/number/iconfont.css';
@import (reference) '~@/assets/css/common.less';
.statistics-number {
    height: 30vh;
    overflow-y: hidden;
    z-index: 1;
    .statistics-number-item {
        .flex(row, flex-start, center, nowrap);
        margin-top: 1vh;
        .title {
            min-width: 7vw;
            color: @base-font-color;
        }
        .num {
            .iconfont {
                color: @theme-color-second;
            }
            width: 7vw;
            white-space: nowrap;
            // border: 2px dashed @theme-color;
            .pr;
            padding: 4px 4px;
            .tm;
            white-space: nowrap;
            font-weight: blod;
            font-size: 15px;
            // min-width: 5rem;
            color: @base-font-color;
            &:before {
                content: '';
                .pa;
                .db;
                height: 16px;
                width: 100%;
                top: 10px;
                left: -2px;
                // border-left:2px solid ;
                // border-right:2px solid;
            }
            &:after {
                content: '';
                .pa;
                .db;
                height: 100%;
                width: ~'calc(100% - 20px)';
                top: -2px;
                left: 10px;
                // border-top:2px solid #2A2A2A;
                // border-bottom:2px solid #2A2A2A;
            }
            span {
                font-size: 18px;
                height: 25px;
                .dib;
            }
        }
    }
    .total {
        .pt10;
        color: @theme-color-second;
    }
}
</style>
