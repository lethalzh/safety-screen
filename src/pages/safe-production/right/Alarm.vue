<template>
  <div class="container">
    <div class="head">
      <div class="n">
        <span>告警处理</span>
        <img src="@/assets/img/yellowMore.png" alt />
      </div>
      <div class="more" @click="showAlarmMore">更多&nbsp;></div>
    </div>
    <div class="body" v-loading="loading" element-loading-background="rgba(0,0,0,0)">
      <template v-for="alarm in lists.slice(0,10)">
        <div
          class="alarm"
          :class="{'ledger-alarm':alarm.devStat!=2 && alarm.ledgerStat > 0,'dev-alarm':alarm.devStat == 2}"
          :key="alarm.companyNo"
          v-if="!(alarm.devStat==1 && alarm.ledgerStat==0)"
        >
          <div class="bg"></div>
          <div class="content">
            <img class="icon" :src="alarm.icon" />
            <div class="cc" @click="$bus.$emit('map-choose-company', {company:alarm,type:'全部'})">
              <div class="name">{{alarm.companyName}}</div>
              <div class="addr">地址: {{alarm.addr}}</div>
            </div>
            <div class="todetail">
              <div
                class="btn"
                v-if="alarm.devStat!=2 && alarm.ledgerStat==1"
                @click="$bus.$emit('show-deal-ledger-alarm-win', alarm)"
              >处理</div>
              <div class="t" v-else  @click="$bus.$emit('map-choose-company', {company:alarm,type:'全部'})">详情></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
import AMcompany from "@/assets/img/AMcompany.png";
import ZCcompany from "@/assets/img/ZCcompany.png";
import fireAlarm from "@/assets/img/fireAlarm.png";
export default {
  props: ["companyList"],
  data() {
    return {
      loading: true,
      pageNum: 1,
      lists: []
    };
  },
  watch: {
    companyList: {
      handler(val) {
        val = val || [];
        this.lists = deepClone(val);
        this.getCompanyList();
        this.loading = false
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {},
  methods: {
    showAlarmMore() {
      this.$bus.$emit("close-map-hint");
      this.$bus.$emit("close-video-win");
      this.$bus.$emit("close-camera-more-win");
      this.$bus.$emit("show-alarm-more", this.lists);
    },
    async getCompanyList() {
      for (var i of this.lists) {
        if (i.ledgerStat == 0 && i.devStat == 1) {
          this.$set(i, "icon", ZCcompany);
        } else {
          //设备告警
          if (i.devStat == 2) {
            this.$set(i, "icon", fireAlarm);
          } else if (i.ledgerStat == 1 || i.ledgerStat == 2) {
            this.$set(i, "icon", AMcompany);
          }
        }
      }
      this.pageNum++;
    }
  }
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
@media screen and (max-width: 1536px){
    .ledger-alarm {
        height: ~"calc(100% / 3 - 10px)";
    }
}
@media screen and (min-width: 1537px){
    .ledger-alarm {
        height: ~"calc(25% - 10px)";
    }
}
.container {
  height: 35%;
  overflow-y: hidden;
  .head {
    .fb-left;
    .pb10;
    .pr;
    z-index: 2;
    .n {
      &:after {
        content: "";
        width: 30px;
        height: 2px;
        background: @theme-color;
        margin-top: 2px;
        .db;
        .pa;
      }
      .fb-box-flex(1);
      .pr10;
      color: @base-font-color;
      span {
        margin-right: 8px;
        // border-bottom: 2px soild @base-font-color;
      }
    }
    .more {
      color: @base-font-color;
      .tr;
      cursor: pointer;
    }
  }
}
.body::-webkit-scrollbar {
  display: none;
}
.body {
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 20px;
  .alarm {
    .pr;
    .bg {
      .pa;
      // background-color: pink;
      // opacity: 0.2;
      .theme-color-8;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      z-index: 1;
      border-radius: 5px;
    }
    .content {
      .pr;
      z-index: 2;
      border-radius: 4px;
      .fb-right-top;
      .p10;
      .mb10;
      cursor: pointer;
    }
    .icon {
      .db;
      width: 15px;
      .mr4;
    }
    .cc {
      .fb-box-flex(1);
      color: @base-font-color;
      .pr10;
      .name {
        .mb4;
        .word-ellipsis;
        // line-height:16px;
      }
      .addr {
        .pb8;
        // line-height:10px;
        font-size: 10px;
        .word-ellipsis;
      }
    }
    .todetail {
      .t {
        .tr;
        font-size: 10px;
      }
      .btn {
        padding: 4px 10px 4px 10px;
        color: #fff;
        .tm;
        font-size: 10px;
        border-radius: 5px;
        background: #b54645;
      }
    }
    &.ledger-alarm {
      // height: ~"calc(25% - 10px)";
      .mb10;
      .bg {
        background: @warn-color-sec;
      }
      .todetail {
        color: @base-font-color;
      }
    }
    &.dev-alarm {
      .bg {
        background: @warn-color;
      }
      .t {
        color: #b54645;
      }
    }
  }
}
</style>
