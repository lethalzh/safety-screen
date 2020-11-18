<template>
    <div class="wrapper-container">
        <div style="overflow: hidden" :style="{height : showMore ? 'auto': showHeight + 'px'}">
            <div ref="content">
                <slot>
                </slot>
            </div>
        </div>
    
        <div class="control" v-show="isLongContent" :class="{'show-more' : showMore}">
            <el-button type="text" @click="toggleShowMore">{{ showMore ? '收起' : '显示更多'}}</el-button>
        </div>
    </div>
</template>

<script>

export default {
    props: {
      showHeight: {
        type: Number,
        required: true,
        default: 200
      },
      content: {
        type: String,
        default: '-'
      }
    },
    data () {
      return {
        showMore: false,
        isLongContent: false
      }
    },
    mounted(){
        this.refresh()
    },
    watch: {
      // 每当内容变化时都重新计算一次高度
      content () {
        this.calculateHeight()
      }
    },
    methods: {
      refresh () {
        this.calculateHeight()
      },
      calculateHeight () {
        // $nextTick()，等待内容获取完毕再计算高度，异步处理
        this.$nextTick().then(() => {
          let contentHeight = this.$refs.content.clientHeight
          if (contentHeight > this.showHeight) {
            this.isLongContent = true
          } else {
            this.isLongContent = false
          }
        })
      },
      toggleShowMore () {
        this.showMore = !this.showMore
      }
    }
}
</script>
<style lang='less' scoped>
@import (reference) '~@/assets/css/common.less';
.wrapper-container {
    position: relative;
    padding-bottom: 40px;
 
    .control {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding-top: 40px;
        text-align: center;
        background-image: linear-gradient(-180deg, rgba(98, 210, 162, 0) 0%, rgba(98, 210, 162, 0.9) 50%);
 
        &.show-more {
            padding-top: 0;
            background: none;
        }
    }
    /deep/ .el-button--text{
        color: @base-font-color;
    }
}

</style>