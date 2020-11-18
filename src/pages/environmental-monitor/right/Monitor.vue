<template>
  <div class="monitor-container mt16">
    <div class="monitor-title">
      <span>
        人居环境
        <img
          style="margin-left: 0.5vw"
          src="@/assets/img/yellowMore.png"
          alt="icon"
        />
      </span>

      <div class="chosen-camera">
        <el-select v-model="currentCameraId" size="mini" placeholder="人居环境">
          <el-option
            @click.native="onChoose($event, item)"
            size="mini"
            v-for="item in cameraList"
            :key="item.deviceId"
            :label="item.sanitationName || '-'"
            :value="item.deviceId"
          ></el-option>
        </el-select>
        <el-button class="ml10" size="mini" @click="showConfig = true">配 置</el-button>
      </div>
    </div>

    <div class="camera" v-loading="loading">
      <video-live
        v-if="!!url && renderVideo"
        ref="videoLive"
        :url="url"
        :pic="pic"
        :stylewh="{
          width: '100%',
          height: '25vh',
          dwidth: 'calc(60vw + 32px)',
        }"
      ></video-live>
    </div>

    <div class="footer">
      <div>
        <el-select
          size="small"
          clearable
          v-model="form.dealUser"
          placeholder="请选择派单联系人"
        >
          <el-option
            v-for="item in managerList"
            :key="item.adminId"
            :label="item.name"
            :value="item.adminId"
          ></el-option>
        </el-select>

        <el-select
          size="small"
          style="margin-left: 1vw"
          clearable
          v-model="form.msgSendType"
          placeholder="请选择派单方式"
        >
          <el-option
            v-for="item in msgSendOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div>
        <el-date-picker
          class="mr16"
          size="small"
          clearable
          v-model="form.expires"
          type="datetime"
          placeholder="选择到期时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyyMMddHHmmss"
          :picker-options="pickerOptions"
        >
        </el-date-picker>

        <div>
          <el-checkbox v-model="form.sendToWorker"> 通知环卫工人 </el-checkbox>
          <el-button size="mini" @click="dispatch"> 派单 </el-button>
        </div>
      </div>
    </div>
    <monitor-dispatch-form
      :basic-form="{
        ...form,
        ...(cameraList.find((camera) => camera.deviceId == currentCameraId) ||
          {}),
        ...(managerList.find((manager) => manager.adminId === form.dealUser) ||
          {}),
      }"
      @on-date-change="
        (date) => {
          form.expires = date;
        }
      "
      @on-radio-change="
        (e) => {
          form.sendToWorker = e;
        }
      "
      @success="initForm"
      v-model="formVisible"
    />

    <video-live-config :visible.sync="showConfig" :current="currentPlay || cameraList[0] || {}"/>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { dictByBit } from "@/utils/index";
import VideoLive from "@/components/VideoLive";
import MonitorDispatchForm from "./MonitorDispatchForm";
import VideoLiveConfig from "@/components/VideoLiveConfig";
export default {
  name: "Monitor",
  props: {
    workerList: {
      type: Array,
      default: () => [],
    },
    monitorList: {
      type: Array,
      default: () => [],
    },
  },
  components: { VideoLive, MonitorDispatchForm, VideoLiveConfig },
  data() {
    return {
      loading: false,
      showConfig: false,
      timer: null,
      currentPlay: null,
      currentCameraId: null,
      pic: "../../assets/img/sanitation/videoBg1.png",
      cameraList: [],
      managerList: [],
      msgSendOptions: [],
      form: {
        dealUser: "",
        msgSendType: null,
        expires: "",
        sendToWorker: false,
      },
      formVisible: false,
      url: "",
      renderVideo: true,
      pickerOptions: {
          disabledDate(time) {
              return time.getTime() <= Date.now()-(1000*60*60*24)
          }
      }
    };
  },
  async mounted() {
    this.makeUpSendWay();
    this.$bus
      .$on("camearPlayAddr", (camera) => {
        this.url = camera.playAddr;
        var pic = camera.coverAddr;
        if (pic)
          pic =
            pic.indexOf("http://") != -1
              ? pic
              : `http://${this.$getState(
                  "api",
                  "baseUrl"
                )}/safety/file/downFile/${pic}`;
        this.pic = pic;
        this.getAdminList(camera.sid);
        this.currentCameraId = camera.deviceId;
        this.$bus.$emit("openChooseCamear", camera);
      })
      .off(this, "camearPlayAddr");
  },
  watch: {
    url(value) {
      this.renderVideo = false;
      this.$nextTick(() => {
        this.renderVideo = true;
      });
    },
    monitorList: {
      handler(list) {
        this.cameraList = list;
        if (!this.url) {
          let currentCamera = this.cameraList.find(
            (camera) => this.currentCameraId == camera.deviceId
          );
          !currentCamera && (currentCamera = this.cameraList[0]);
          this.url = currentCamera.playAddr;
          var pic = currentCamera.coverAddr;
          if (pic)
            pic =
              pic.indexOf("http://") != -1
                ? pic
                : `http://${this.$getState(
                    "api",
                    "baseUrl"
                  )}/safety/file/downFile/${pic}`;
          this.pic = pic;
          if (this.cameraList.length) {
            this.currentCameraId = this.cameraList[0].deviceId;
            this.getAdminList(this.cameraList[0].sid);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    // 获取派单方式列表
    makeUpSendWay() {
      // 硬编码赋值
      const TOTAL_WAY = Object.keys(this._dict.msgSendType || {}).reduce(
        (prev, next) => {
          return Number(prev) + Number(next);
        },
        0
      );
      for (let i = 1; i <= TOTAL_WAY; i++) {
        this.msgSendOptions.push({
          name: dictByBit(this._dict.msgSendType, i, "+"),
          value: i,
        });
      }
    },
    initForm() {
      this.form = {
        dealUser: "",
        msgSendType: null,
        expires: "",
        sendToWorker: false,
      };
    },
    // 摄像头下拉框切换
    onChoose($el, item) {
      this.initForm();
      this.getAdminList(item.sid);
      this.currentPlay = item
      this.url = item.playAddr;
      var pic = item.coverAddr;
          if (pic)
            pic =
              pic.indexOf("http://") != -1
                ? pic
                : `http://${this.$getState(
                    "api",
                    "baseUrl"
                  )}/safety/file/downFile/${pic}`;
      this.pic = pic;
      this.$bus.$emit("get-dispatch-list", item);
    },
    // 获取环卫点负责人
    async getAdminList(id) {
      console.warn(this.cameraList.find(camera=> camera.sid = id).adminList)
      this.managerList = (this.cameraList.find(camera=> camera.sid = id) || { adminList: [] }).adminList
      // const res = await this.$http.reqApi("data", "allUserList", {
      //   pageNum: 1,
      //   pageSize: 1000,
      //   sanitationId: id,
      //   role: 4
      // });
      // if (Array.isArray(res)) this.managerList = res;
    },
    // 派单
    dispatch() {
      if (this.form.dealUser && this.form.msgSendType && this.form.expires) {
        this.formVisible = true;
      } else {
        this.$message.warning("请选择联系人、派单方式、日期");
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
@media screen and (max-width: 1536px){
    .monitor-title {
      .mb8;
    }
    .footer {
      > div {
        .mt8;
      }
    }
}
@media screen and (min-width: 1537px){
    .monitor-title {
      .flex(row, space-between);
      .mb16;
    }
    .footer {
      > div {
        .flex(row, space-between);
        .mt16;
      }
    }
}
.monitor-container {
  .monitor-title {
    .flex(row, space-between);
    // .mb16;
  }
  .footer {
    > div {
      .flex(row, space-between);
      // .mt16;
      flex: 1;
      > div {
        width: 100%;
        .flex(row, space-between);
      }
      flex-wrap: nowrap;
    }
  }
}
</style>
