<template>
    <div class="sanitation-progress">
        <div class="progress" v-loading="loading">
            <div style="textAlign:center">
                <div style="marginBottom:6px;">未完成派单</div>
                <div class="progress-item">
                    <div class="bar-top radius-top un-dispatch" style="height:50%;minHeight:8%;maxHeight:92%;transition: height 1s;"></div>
                    <div class="font-style-top font-color-red tm">{{ data.unDispatch }}</div>
                    <div class="skew"></div>
                    <div class="bar-bottom radius-bottom dispatch" style="height:50%;minHeight:8%;maxHeight:92%;transition: height 1s;"></div>
                    <div class="font-style-bottom font-color-green tm">{{ data.dispatch }}</div>
                </div>
                <div style="marginTop:6px;">完成派单</div>
            </div>
            <div style="textAlign:center">
                <div style="marginBottom:6px;">在线摄像头</div>
                <div class="progress-item">
                    <div class="bar-bottom radius-top camera" style="height:50%;minHeight:8%;maxHeight:92%;transition: height 1s;"></div>
                    <div class="font-style-top font-color-green tm">{{ data.camera }}</div>
                    <div class="skew"></div>
                    <div class="bar-top radius-bottom un-camera" style="height:50%;minHeight:8%;maxHeight:92%;transition: height 1s;"></div>
                    <div class="font-style-bottom font-color-red tm">{{ data.unCamera }}</div>
                </div>
                <div style="marginTop:6px;">离线</div>
            </div>
            <div style="textAlign:center">
                <div style="marginBottom:6px;">离线环卫人数</div>
                <div class="progress-item">
                    <div class="bar-top radius-top un-worker" style="height:50%;minHeight:8%;maxHeight:92%;transition: height 1s;"></div>
                    <div class="font-style-top font-color-red tm">{{ data.unWorker }}</div>
                    <div class="skew"></div>
                    <div class="bar-bottom radius-bottom worker" style="height:50%;minHeight:8%;maxHeight:92%;transition: height 1s;"></div>
                    <div class="font-style-bottom font-color-green tm">{{ data.worker }}</div>
                </div>
                <div style="marginTop:6px;">在线人数</div>
            </div>
        </div>
    </div>
</template>

<script>
var CronJob = require('cron').CronJob
export default {
    components: {},
    data() {
        return {
            data: {
                unWorker: 0,
                worker: 0,
                unCamera: 0,
                camera: 0,
                dispatch: 0,
                unDispatch: 0,
            },
            loading: false
        }
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                    let allDispatch = newVal.unDispatch + newVal.dispatch || 1
                    if(newVal.unDispatch + newVal.dispatch == 0){
                        document.querySelector('.un-dispatch').style.height = '50%'
                        document.querySelector('.dispatch').style.height = '50%'
                    }else{
                        document.querySelector('.un-dispatch').style.height = this.countNum(newVal.dispatch, allDispatch, 2) ? `${this.countNum(newVal.unDispatch, allDispatch, 0)}%` : '100%'
                        document.querySelector('.dispatch').style.height = this.countNum(newVal.unDispatch, allDispatch, 2) ? `${this.countNum(newVal.dispatch, allDispatch, 0)}%` : '100%'
                    }
                    let allCamera = newVal.camera + newVal.unCamera || 1
                    if(newVal.camera + newVal.unCamera == 0){
                        document.querySelector('.camera').style.height = '50%'
                        document.querySelector('.un-camera').style.height = '50%'
                    }else{
                        document.querySelector('.camera').style.height = this.countNum(newVal.unCamera, allCamera, 2) ? `${this.countNum(newVal.camera, allCamera, 0)}%` : '100%'
                        document.querySelector('.un-camera').style.height = this.countNum(newVal.camera, allCamera, 2) ? `${this.countNum(newVal.unCamera, allCamera, 0)}%` : '100%'
                    }
                    let allWorker = newVal.worker + newVal.unWorker || 1
                    if(newVal.worker + newVal.unWorker == 0){
                        document.querySelector('.worker').style.height = '50%'
                        document.querySelector('.un-worker').style.height = '50%'
                    }else{
                        document.querySelector('.worker').style.height = this.countNum(newVal.unWorker, allWorker, 2) ? `${this.countNum(newVal.worker, allWorker, 0)}%` : '100%'
                        document.querySelector('.un-worker').style.height = this.countNum(newVal.worker, allDispatch, 2) ? `${this.countNum(newVal.unWorker, allWorker, 0)}%` : '100%'
                    }
                }
            },
            deep: true,
        }
    },
    methods: {
        mouseEvent(){
            document.querySelector('.sanitation-progress').addEventListener('mouseover',()=>{
                this.$emit('show', 2)
            })
            document.querySelector('.sanitation-progress').addEventListener('mouseout',()=>{
                this.$emit('clear')
            })
        },
        countNum(one, all, fixed = 2) {
            all == 0 ? 1 : all
            return ((one / all) * 100).toFixed(fixed)
        },
        // 订单统计
        async getWorkOrderStatistics() {
            let processed = 0
            let unProcessed = 0
            const res = await this.$http.reqApi('data', 'workOrderStatistics')
            if (!res.error && res.rows) {
                res.rows.forEach((item) => {
                    if (item.status == 3) {
                        processed += item.orders
                    } else {
                        unProcessed += item.orders
                    }
                })
            }
            let all = processed+unProcessed || 1
            this.data = {
                ...this.data,
                dispatch: processed,
                unDispatch: unProcessed,
            }
        },
        async getStatsDevice() {
            const res = await this.$http.reqApi('data', 'statsDevice', {}, 'get', {
                groupBy: 2,
                pageNum: 1,
                pageSize: 1000,
            })
            if (!res.error) {
                this.data = {
                    ...this.data,
                    camera: res.onlineTotal || 0,
                    unCamera: res.offlineTotal || 0,
                }
            }
        },
        async getStatusAll() {
            const res = await this.$http.reqApi('data', 'statusAll')
            if (!res.error) {
                this.data = {
                    ...this.data,
                    unWorker: res.workerNumbers - res.onlineNumbers || 0,
                    worker: res.onlineNumbers || 0,
                }
            }
        },
    },
    mounted() {
        this.mouseEvent()
        this.cron = new CronJob(
            '*/15 * * * * *',
            () => {
                this.getWorkOrderStatistics()
                this.getStatsDevice()
                this.getStatusAll()
            },
            null,
            false,
            'Asia/Chongqing'
        )
        this.cron.start()
        this.loading = true
        this.getWorkOrderStatistics()
        this.getStatsDevice()
        this.getStatusAll()
        this.loading = false
    },
    beforeDestroy() {
        this.cron.stop()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.sanitation-progress {
    .p24;
    height: 100%;

    .progress {
        display: flex;
        justify-content: space-around;
        position: relative;
        top: 50%;
        left: 55%;
        transform: translateX(-50%) translateY(-50%);
        .progress-item {
            width: 25px;
            height: 25rem;
            // background-color: #c1fbf5;
            // #94f1e7
            position: relative;
            margin-left: auto;
            margin-right: auto;
            border-radius: 15px;
            .skew {
                width: 26px;
                height: 10px;
                transform: skewY(-20deg) translateY(-50%);
                position: absolute;
                left: 0;
                z-index: 10;
                background-color: #e5fbf9;
            }
            .bar-top {
                text-align: center;
                width: 100%;
                display: block;
                font-family: arial;
                background-color: #ffcbcc;
                color: #ff777b;
                position: relative;
                z-index: 1;
            }
            .bar-bottom {
                text-align: center;
                width: 100%;
                display: block;
                font-family: arial;
                background-color: #94f1e7;
                color: #0cd0b8;
                position: relative;
                z-index: 1;
            }
            .radius-top {
                border-top-left-radius: 15px;
                border-top-right-radius: 15px;
            }
            .radius-bottom {
                border-bottom-left-radius: 15px;
                border-bottom-right-radius: 15px;
            }

            .font-style-bottom {
                position: absolute;
                bottom: 4px;
                z-index: 20;
                width: 100%;
            }
            .font-style-top {
                position: absolute;
                top: 4px;
                z-index: 20;
                width: 100%;
            }
            .font-color-red {
                color: #ff777b;
            }
            .font-color-green {
                color: #0cd0b8;
            }
        }
    }
}
.sanitation-progress:hover {
    background: #e5fbf9;
}
</style>
