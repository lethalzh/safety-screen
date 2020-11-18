<template>
    <div class="safe-progress">
        <div class="progress" v-loading="loading">
            <div style="textAlign:center">
                <div class="progress-item-red">
                    <div class="bar fire" style="height:0%;transition: height 1s;">
                        <div class="tm" style="position: absolute;bottom: 4px;width: 100%">{{ data.fire }}</div>
                    </div>
                </div>
                <div style="marginTop:6px;">消防告警</div>
            </div>
            <div style="textAlign:center">
                <div class="progress-item">
                    <div class="bar company" style="height:0%;transition: height 1s;">
                        <div class="tm" style="position: absolute;bottom: 4px;width: 100%">{{ data.company }}</div>
                    </div>
                </div>
                <div style="marginTop:6px;">企业数量</div>
            </div>
            <div style="textAlign:center">
                <div class="progress-item-red">
                    <div class="bar ledger" style="height:0%;transition: height 1s;">
                        <div class="tm" style="position: absolute;bottom: 4px;width: 100%">{{ data.ledger }}</div>
                    </div>
                </div>
                <div style="marginTop:6px;">台账告警</div>
            </div>
        </div>
    </div>
</template>

<script>
var CronJob = require('cron').CronJob
export default {
    data() {
        return {
            data: {
                fire: 0,
                company: 0,
                ledger: 0,
            },
            loading: false
        }
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                    const value = (val)=>{
                        return val > 100 ? '100%' : `${val}%` 
                    }
                    document.querySelector('.fire').style.height =value(newVal.fire)
                    document.querySelector('.company').style.height =value(newVal.company)
                    document.querySelector('.ledger').style.height =value(newVal.ledger)
                }
            },
            deep: true,
            // immediate:true
        }
    },
    methods: {
        mouseEvent(){
            document.querySelector('.safe-progress').addEventListener('mouseover',()=>{
                this.$emit('show', 1) 
            })
            document.querySelector('.safe-progress').addEventListener('mouseout',()=>{
                this.$emit('clear')
            })
        },
        async getCountData() {
            let res = await this.$http.reqApi("data", "countData", {}, 'get', {
                dateTime: this.$dayjs().format("YYYYMMDDHHmmss"),
                stat: 0
            })
            if(!res.error) {
                let num = res.alarmTypeCountNums.filter(el=>{return el.type==4})
                this.data = {
                    fire: num[0].num,
                    company: res.num,
                    ledger: res.ledgerAlarmNum,
                }
            }
        },
    },
    mounted() {
        this.mouseEvent()
        this.cron = new CronJob(
            '*/15 * * * * *',
            () => {
                this.getCountData()
            },
            null,
            false,
            'Asia/Chongqing'
        )
        this.cron.start()
        this.loading = true
        this.getCountData()
        this.loading = false
    },
    beforeDestroy() {
        this.cron.stop()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.safe-progress {
    .p24;
    height: 100%;

    .progress {
        display: flex;
        justify-content: space-around;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        .progress-item {
            margin-top: calc(1rem + 12px);
            width: 30px;
            height: 25rem;
            background-color: #c1fbf5;
            // #94f1e7
            // border: 1px solid #ccc;
            position: relative;
            margin-left: auto;
            margin-right: auto;
            border-radius: 15px;
            overflow: hidden;
            .bar {
                border-radius: 15px;
                text-align: center;
                width: 100%;
                display: block;
                font-family: arial;
                background-color: #94f1e7;
                color: #fff;
                position: absolute;
                bottom: 0;
            }
        }
        .progress-item-red {
            margin-top: calc(1rem + 12px);
            width: 15px;
            height: 25rem;
            background-color: #ffcbcc;
            // #ff7277
            position: relative;
            margin-left: auto;
            margin-right: auto;
            border-radius: 7.5px;
            overflow: hidden;
            .bar {
                text-align: center;
                width: 100%;
                display: block;
                font-family: arial;
                background-color: #ff7277;
                color: #fff;
                position: absolute;
                bottom: 0;
                border-radius: 7.5px;
            }
        }
    }
}
.safe-progress:hover {
    background: #e5fbf9;
}
.font-style-bottom {
    position: absolute;
    bottom: 4px;
    left: 20%;
    // text-align: center;
}
</style>
