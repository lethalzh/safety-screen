<template>
  <div class="video-page">
      <el-button @click="close()">退出监控</el-button>
    <div class="vc">
      <div class="title">环卫</div>
      <div class="content">
        <div class="video" v-for="(v, index) in hwList" :key="index">
          <video-live
            :ref="index + 'h'"
            :url="v.playAddr"
            :pic="v.coverAddr"
            :stylewh="{
              width: '100%',
              height: '25vh',
            }"
          ></video-live>
          <div class="name">{{ v.deviceName }}-{{ v.deviceId }}</div>
          <div class="name" v-if="v.rplayAddr">{{ v.rplayAddr }}</div>
        </div>
      </div>
    </div>

    <div class="vc">
      <div class="title">企业</div>
      <div class="content">
        <div class="video" v-for="(v, index) in companyList" :key="index">
          <video-live
            :ref="index + 'c'"
            :url="v.playAddr"
            :pic="v.coverAddr"
            :stylewh="{
              width: '100%',
              height: '25vh',
            }"
          ></video-live>
          <div class="name">{{ v.deviceName }}-{{ v.deviceId }}</div>
          <div class="name" v-if="v.rplayAddr">{{ v.rplayAddr }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VideoLive from "@/components/VideoLive";
export default {
  name: "allVideoPage",
  components: { VideoLive },
  data() {
    return {
      hwList: [],
      companyList: [],
    };
  },
  async created() {
    await this.queryHw();
    await this.queryCompany();
    setTimeout(() => {
      this.setPlayAddr(this.hwList, (i) => {
        return `${i}h`;
      });
      this.setPlayAddr(this.companyList, (i) => {
        return `${i}c`;
      });
    }, 3000);
  },
  methods: {
      close(){
          this.$emit('close')
      },
    setPlayAddr(videos, fun) {
      videos.forEach((v, i) => {
        this.$set(v, "rplayAddr", this.$refs[fun(i)][0].getPlayAddr());
      });
    },
    async queryHw() {
      var res = await this.$http.reqApi("data", "cameraList");
      if (res && res.rows) {
        res.rows = res.rows.filter((row) => !!row.sid);
        this.hwList = res.rows;
      }
    },
    async queryCompany() {
      var res = await this.$http.reqApi("data", "devList", {
        pageNum: 1,
        pageSize: 2000,
      });
      if (res && res.rows) {
        this.companyList = res.rows;
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.video-page {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: #fff;
  .vc {
    padding: 16px 16px 32px 16px;
    width: 100%;
    .title {
      .p16;
      .mb16;
      font-size: 20px;
      background:#dabf85;
    }
    .content {
      .clear-fix;
      .video {
        width: 25%;
        .pb16;
        .pr16;
        .fl;
        .name {
          .pt10;
          .pl10;
          .pr10;
          word-break:break-all;
          background:#e7e4e4
        }
      }
    }
  }
}
</style>