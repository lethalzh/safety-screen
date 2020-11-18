<template>
  <div id="synthesize-map-container"></div>
</template>

<script>
export default {
  name: "Map",
  data() {
    return {
      map: null,
      monitorList: []
    };
  },
  mounted() {
    if (this.map) return;
    setTimeout(async () => {
      this.map = new AMap.Map("synthesize-map-container", {
        mapStyle: "amap://styles/whitesmoke",
        zoom: 14, //级别
        center: this.$getState("dict", "regionRootLocation").xy.split(","), //中心点坐标
      });
      await this.getList();
      this.drawCameraMarker();
    }, 800);
  },
  methods: {
    //盖层，显示名称
        draw(list) {
            var layers = new AMap.LabelsLayer({
                zooms: [3, 20],
                zIndex: 1,
                // 开启标注避让，默认为开启，v1.4.15 新增属性
                collision: true,
                // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
                animation: false,
            })
            // this.layer.clear()
            this.map.add(layers)
            list.forEach((el) => {
                if (el.gps) {
                    let labelMarker = new AMap.LabelMarker({
                        position: [el.gps.split(",")[0],el.gps.split(",")[1]],
                        opacity: 1,
                        zooms: [3, 20],
                        text: {
                            content: el.deviceName,
                            direction: "top",
                            offset: [0, -10],
                            style: {
                                fontSize: 12,
                                fillColor: "#666",
                                strokeColor: "transparent",
                                strokeWidth: "5",
                            },
                        }
                    })
                    layers.add(labelMarker)
                }
            })
        },
    setCenterPoint(list) {
      if (!list || !list.length) return;
      for (var comp of list) {
        if (comp.longitude || comp.gps) {
          var xy = null;
          if (comp.gps) xy = [comp.gps.split(",")[0], comp.gps.split(",")[1]];
          else xy = [comp.longitude, comp.latitude];
          this.map.setZoomAndCenter(14, new AMap.LngLat(xy[0], xy[1]));
          break;
        }
      }
    },
    async getList() {
      const res = await this.$http.reqApi("data", "siteDevices", {
        pageNum: 1,
        pageSize: 2000,
      });
      if (res && res.rows) {
        this.monitorList = res.rows;
        this.drawCameraMarker();
        this.setCenterPoint(this.monitorList);
        this.draw(this.monitorList)
      }
    },
    drawCameraMarker() {
      this.monitorList.forEach((monitor) => {
        let path = monitor.gps.split(",");
        if (path[0] && path[1]) {
          let marker = new AMap.Marker({
            content: `<img style="width: 40px; height: 40px;position: relative; z-index: 9999999999999" src="${require("@/assets/img/camera-theme.png")}"></img>`,
            position: [path[0], path[1]],
            // position: [116.843500 - Math.random() / 10, 39.220580 - Math.random() / 10],
            offset: new AMap.Pixel(0, 0),
            extData: monitor,
          }); 
          marker.setMap(this.map);
          marker.on("click", () => {
            this.$bus.$emit("current-video-change", monitor);
            this.$bus.$emit("synthesize-manage-center", "video", monitor);
          });
        }
      });
      // this.map.setFitView()
    },
  },
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
#synthesize-map-container {
  width: 100vw !important;
  height: 100vh !important;
  .pf;
  left: 0;
  top: 0;
}
</style>
