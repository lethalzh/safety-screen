<template>
  <div class="container" :style="{ height }">
    <div class="header">
      <div class="title" :style="{color: titleColor}">{{title}}</div>
      <div class="close" @click="close">X</div>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "closeEvent", "height", 'titleColor'],
  data() {
    return {
      loading: false
    };
  },
  methods: {
    close() {
      this.$bus.$emit(this.closeEvent);
      this.$emit("close");
    }
  }
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.container {
  .mt16;
  height: 70vh;
  overflow-y: hidden;
  // .theme-color-6;
  background: @background;
  opacity: .99;
  .shadow-light;
  padding: 20px;
  .pt0;
}
.header {
  height: 60px;
  .fb-left;
  .pl10;
  color: #fff;
  .fb;
  width: 100%;
  .title {
    .fb-box-flex(1);
    font-size: 20px;
  }
  .close {
    cursor: pointer;
    .fb-center;
    color: #000;
    font-size: 15px;
    line-height: 15px;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    background-color: @theme-color-second;
  }
}
.body {
  width: 100%;
  overflow-y: scroll;
  padding-bottom: 20px;
  height: ~"calc(100% - 40px)";
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
