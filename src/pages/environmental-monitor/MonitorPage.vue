<template>
  <div class="monitor">
    <div class="content">
      <div class="left">
        <statistics />
      </div>
      <env-map
        class="center"
        :monitor-list="monitorList"
        :worker-list="workerList"
      />
      <div class="right" ref="right-container">
        <i 
          class="hidden-icon" 
          :class="hiddenState?'el-icon-caret-right':'el-icon-caret-left always-show'"
          :style="hiddenState?'left: -10px':'left: -42px'"
          @click="transitionMove($refs['right-container'], hiddenState?'right':'recover'); hiddenState = !hiddenState"
        />
        <dispatch-record :monitor-list="monitorList" />
        <monitor :worker-list="workerList" :monitor-list="monitorList" />
      </div>
    </div>
  </div>
</template>
<script>
import EnvMap from "./Map";
import Statistics from "./left/Statistics";
import DispatchRecord from "./right/DispatchRecord";
import Monitor from "./right/Monitor";
import dayjs from "dayjs";
import { transitionMove } from '@/utils/index'

export default {
  name: "MonitorPage",
  components: {
    Statistics,
    DispatchRecord,
    Monitor,
    EnvMap,
  },
  data() {
    return {
      //环卫工人列表
      workerList: [],
      // 监控列表
      monitorList: [],
      timer: null,
      hiddenState: true
    };
  },
  async mounted() {
    // 轮询
    await this.polling(async () => {
      await this.getData();
    }, 15000);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = -1;
  },
  methods: {
    transitionMove,
  async polling(fn, delay) {
    await fn();
    if (this.timer == -1) return;
    this.timer = setTimeout(async () => {
      clearTimeout(this.timer);
      await this.polling(fn, delay);
    }, delay);
  },
    async getData() {
      await this.getWorkerList();
      await this.getMonitorList();
    },
    // 获取环卫工人列表
    async getWorkerList() {
      const res = await this.$http.reqApi("data", "workerList", {
        pageNum: 1,
        pageSize: 1000,
      });
      if (res && res.rows) {
        if (
          this.workerList &&
          JSON.stringify(this.workerList) == JSON.stringify(res.rows)
        ) {
          return;
        }
        this.workerList = res.rows;
      } //else this.workerList = res.rows;
    },
    // 摄像头列表
    async getMonitorList() {
      var res = await this.$http.reqApi("data", "cameraList");
      if (res && res.rows) {
        res.rows = res.rows.filter((row) => !!row.sid);
        if (
          this.monitorList &&
          JSON.stringify(this.monitorList) == JSON.stringify(res.rows)
        ) {
          return;
        }
        this.monitorList = res.rows;
      } //else this.monitorList = [];
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
@height:~'calc(90vh - 20px - 20px - (90vh - 20px - 20px) * .10)';
.monitor {
  .p16;
  width: 100vw;
  // height: 100vh;
  height: 100%;
  .content {
    height: 100%;
    width: 100%;
    .flex(row, space-between, flex-start);
    .left {
      flex: 0.6;
      .pr;
      z-index: 99;
    }
    .center {
      flex: 2;
    }
    .right {
      height: 100%;
      flex: 1;
      .pr;
      z-index: 99;
      background: @background;
      .shadow-light;
      .p10;
      &:hover {
        i {
            display: block
        }
      }
    }
  }

  #fire-alarm-map {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
  }
}
</style>