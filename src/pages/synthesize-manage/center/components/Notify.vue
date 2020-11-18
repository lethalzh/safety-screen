<template>
    <div class="notify-container">
        <div class="head">
            <div class="left">
                <div style="fontSize:2rem">通知公告</div>
            </div>
        </div>
        <div class="item" v-if="!list.length">
            <el-divider>暂无通知公告</el-divider>
        </div>
        <div v-else class="item" v-loading="loading">
            <div class="text more" ref="more">
                占位
            </div>
            <div class="content item-list" v-show="list.length" v-for="(item, index) in list" :key="index">
                <div class="title">
                    <div style="font-size:1.5rem">标题：{{ item.title || '标题' }}</div>
                    <div style="font-size:0.8rem">接收对象：{{ item.ttype == 1 ? '企业' : '用户' }}</div>
                    <div style="font-size:0.8rem">时间：{{ item.ctime ? $dayjs(item.ctime).format('YYYY-MM-DD HH:mm:ss') : '-'}}</div>
                </div>
                <div class="text">
                    <div :class="{ retract: item.status }" :style="{ 'max-height': item.status ? textHeight : '' }" ref="textContainer">
                        {{ handleContent(item.content) }}
                    </div>
                    
                </div>
                <div class="btn">
                    <p v-if="Object.prototype.toString.call(item.status) =='[object Boolean]'" @click="item.status = !item.status">
                        <i :class="item.status?'el-icon-plus':'el-icon-minus'">{{ item.status ? '展开' : '收起' }}</i>
                    </p>
                </div>
            </div>
        </div>
       
        <div class="page" style="color: #fff;">
            <el-pagination
                :background="true"
                style="padding-left: 0"
                layout="prev, pager, next"
                :page-size="pageSize"
                @current-change="
                    (page) => {
                        pageNum = page
                        getList()
                    }
                "
                :current-page="pageNum"
                :total="total"
            ></el-pagination>
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            loading: false,
            noMore: false,
            list: [],
            pageNum: 1,
            textHeight: null,
            total: 0, //总共页数
            pageSize: 10, //每页记录数
        }
    },
    computed: {},
    watch: {},
    methods: {
        handleContent(val) {
            try {
                let data = JSON.parse(val)
                if (data && data.content) {
                    return data.content
                } else {
                    return ''
                }
            } catch (error) {
                return val
            }
        },
        async getList() {
            this.loading = true
            const res = await this.$http.reqApi('data', 'notify', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                type: 1,
                subType: 6,
                orderBy:'ctime desc'
            })
            this.loading = false
            if (res && res.rows && !res.error) {
                this.list = res.rows
                this.total = res.total || 8
                this.handle()
            } else {
                return
            }
        },
        calculateText() {
            // 获取一行文字的height 计算当前文字比较列表文字
            let oneHeight = this.$refs.more.scrollHeight
            let twoHeight = oneHeight * 2 || 40
            this.textHeight = `${twoHeight}px`
            let txtDom = this.$refs.textContainer
            for (let i = 0; i < txtDom.length; i++) {
                let curHeight = txtDom[i].offsetHeight
                if (curHeight > twoHeight) {
                    this.$set(this.list, i, Object.assign({}, this.list[i], { status: true }))
                } else {
                    this.$set(this.list, i, Object.assign({}, this.list[i], { status: null }))
                }
            }
        },
        handle() {
            this.list.forEach((ele, index) => {
                this.$set(this.list, index, Object.assign({}, ele, { status: null }))
            })
            // DOM 加载完执行
            this.$nextTick(() => {
                this.calculateText()
            })

            window.onresize = () => {
                this.list.forEach((ele, index) => {
                    this.$set(this.list, index, Object.assign({}, ele, { status: null }))
                })
                setTimeout(() => {
                    this.calculateText()
                }, 0)
            }
        },
    },
    created() {},
    mounted() {
        this.getList()
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
.notify-container {
    height: 100%;
    width: 100%;
    color: @base-font-color;
    overflow-y: hidden;
    .head {
        .fb-left;
        .pb10;
        .pr;
        z-index: 10;
        .left {
            color: @base-font-color;
        }
    }
    .item {
        height: calc(100% - 90px);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;

        .item-list {
            .theme-color-9;
            margin-bottom: 1rem;
            border-radius: 4px;
            .p10;
        }
    }

    .item::-webkit-scrollbar {
        display: none;
    }
    .page {
        color: @base-font-color;
        .pr;
        z-index: 101;
        .flex(row, space-between);
        .mt10;
    }
    //省略部分样式
    .content {
        color: @base-font-color;
        // display: flex;
        margin-bottom: 30px;
    }

    .text {
        color: @base-font-color;
        position: relative;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 2px;
        // color: #666666;
    }

    .retract {
        color: @base-font-color;
        position: relative;
        overflow: hidden;
    }

    .retract:after {
        color: @base-font-color;
        content: '...';
        text-align: right;
        // content:''; 
        position: absolute;
        bottom: 0;
        right: 10px;
        height: 2rem;
        width: 40px;
        // margin-left: 20px;
        // background: linear-gradient(90deg, rgba(98, 210, 162, 0) 0%, rgba(98, 210, 162, 0.9) 30%);
        background: linear-gradient(to right, transparent, rgba(98, 210, 162, 1) 45%);
    }

    .btn {
        margin-right: 10px;
        text-align: right;
        font-size: 14px;
        line-height: 19px;
        letter-spacing: 2px;
        color: #ffad41;
        cursor: pointer;
    }

    .more {
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 2px;
        color: #666666;
        visibility: hidden;
    }
    .item /deep/ .el-loading-mask {
        background-color: @loading-background;
    }
}
</style>
