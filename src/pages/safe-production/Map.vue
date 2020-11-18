<template>
    <div class="map-outer">
        <company-search
            @search="onSearch"
            v-model="currentTab"
            @sel="map.setZoomAndCenter(13, [116.73122, 39.121516])"
        />

        <!-- 消防告警滚动横幅 -->
        <fire-warning-tips
            :company-list="warningCompany"
            v-if="!!warningCompany.length"
        />

        <div
            id="safe-map-container"
            v-loading="loading"
            element-loading-text="地图渲染中..."
        >
                    
            <div class="detail-window" v-show="!!currentFocus">
                <!-- 企业点击详情 -->
                <company-detail
                    v-if="currentFocus == '企业'"
                    :company-info="companyInfo"
                    :company-camera-map="companyCameraMap"
                    @send-message="
                        showMessage = true;
                        infoWindow.close();
                    "
                />

                <!-- 摄像头详情 -->
                <camera-detail
                    v-if="currentFocus == '摄像头'"
                    :monitor="cameraInfo"
                >
                    <img
                        :src="
                            !cameraInfo.coverAddr
                                ? 'https://vjs.zencdn.net/v/oceans.png'
                                : cameraInfo.coverAddr.indexOf('http://') != -1
                                ? cameraInfo.coverAddr
                                : 'http://' +
                                  $getState('api', 'baseUrl') +
                                  '/safety/file/downFile/' +
                                  cameraInfo.coverAddr
                        "
                        style="
                            background: #ea7974;
                            border: #ea7974;
                            color: #fff;
                            cursor: pointer;
                        "
                        width="72"
                        height="48"
                        @click="viewVideo"
                    />
                </camera-detail>

                <!-- 消防车详情 -->
                <firetruck-detail
                    v-if="currentFocus == '消防车'"
                    :fire="fireInfo"
                    @get-track-path="(id, path)=> { drawFireTruckTrack(id, path) }"
                    @remove-path="(id)=> { trackLine[id] && map.remove(trackLine[id]) }"
                >
				</firetruck-detail>
            </div>
        </div>
        <company-hint
            class="bottom-notice"
            :companyInfo="companyInfo"
            v-if="!!currentFocus && currentFocus == '企业'"
        />

        <map-company-detail-message
            :show.sync="showMessage"
            :company-no="companyInfo.companyNo"
        />

        <video-live
            ref="videoLive"
            :dialog="true"
            :stylewh="{
                width: '100%',
                height: '400px',
                dwidth: 'calc(60vw + 32px)',
            }"
            pic="//vjs.zencdn.net/v/oceans.png"
        />
    </div>
</template>

<script>
import CompanySearch from "./center/CompanySearch";
import CompanyHint from "./center/CompanyHint";
import VideoLive from "@/components/VideoLive";
import CompanyDetail from "./map-component/MapCompanyDetail";
import CameraDetail from "./map-component/MapCameraDetail";
import FiretruckDetail from "./map-component/MapFiretruckDetail";
import MapCompanyDetailMessage from "./map-component/MapCompanyDetailMessage";
import FireWarningTips from './map-component/FireWarningTips'
import { drawCompanyPie, drawFiretruckPie, showPie, getPieMarkers, caculateMarkerRange } from './map-drawer-hook'
export default {
    name: "Map",
    components: {
        CompanySearch,
        CompanyHint,
        VideoLive,
        CompanyDetail,
        CameraDetail,
        FiretruckDetail,
        MapCompanyDetailMessage,
        FireWarningTips
    },
    props: {
        companyList: {
            type: Array,
            default: ()=> []
        },
        firetruckList: {
            type: Array,
            default: ()=> []
        },
        monitorList: {
            type: Array,
            default: ()=> []
        },
        companyCameraMap: {
            type: Object,
            default: ()=> {}
        },
        currentType: {},
    },
    data() {
        return {
            // 聚合饼图点击的行政区域
            currentRegionId: null,
            companyInfo: {},
            cameraInfo: {},
            fireInfo: {},
            loading: true,
            companyData: [],
            // 企业海量点存储列表
			companyMarkers: [],
			// 消防车点
			firetruckMarkers: [],
			// 摄像头
            cameraMarkers: [],
            // 公司名markers
            textMarkers: [],
            infoWindow: null,
            showDevInfoWindow: false,
            showLedgerInfoWindow: false,
            showCameraWindow: false,
            showMessage: false,
            currentFocus: null,
            currentTab: "全部",
			// 消防车历史轨迹
            trackLine: {},
        };
    },
    watch: {
        // 企业
        companyList: {
            handler(newList, oldList) {
                if (!newList || JSON.stringify(newList) === JSON.stringify(oldList)) return
                if (this.currentTab == "全部") this.drawCompanyMarker();
            },
            immediate: true
        },
        // 摄像头
        monitorList: {
            handler(newList, oldList) {
                if (!newList || JSON.stringify(newList) === JSON.stringify(oldList)) return
                if (this.currentTab == "摄像头") { 
                    this.drawMonitor();
                }
            }
        },
        // 消防车
        firetruckList: {
            handler(newList, oldList) {
                if (!newList || JSON.stringify(newList) === JSON.stringify(oldList)) return
                if (this.currentTab == "消防车") {
                    this.drawFireTruck();
                }
            }
        },
        // tab切换
        currentTab(tab) {
            this.map.clearMap();
            switch (tab) {
                case "全部":
                    drawCompanyPie.call(this, (e)=> { 
                        this.currentRegionId = e.regionId; 
                        this.drawCompanyMarker(); 
                        this.drawMonitor(); 
                        this.map.setZoomAndCenter(14, this.companyMarkers[0].getPosition())
                    });
                    break;
                case "消防车":
                    drawFiretruckPie.call(this, (e)=> { 
                        this.currentRegionId = e.regionId; 
                        this.drawFireTruck(); 
                        this.map.setZoomAndCenter(14, this.firetruckMarkers[0].getPosition())
                    });
                    break;
                case "摄像头":
                    this.drawMonitor();
                    break;
            }
        },
        currentFocus(value) {
            if(value) {
                setTimeout(()=> {
                    document.querySelector('.detail-window').parentNode.parentNode.style['pointer-events'] = 'none'
                }, 1000)
            }
        }
    },
    computed: {
        // 当前是否有着火企业
        warningCompany() {
            return this.companyList.filter(com=> com.devStat == 2)
        }
    },
    async mounted() {
        // 右侧点击后聚焦地图
        this.$bus.$on("map-choose-company", (param) => {
            this.currentTab = "全部";
            this.onSearch('企业', param.company)
        }).off("map-choose-company", this)
        // 
        this.$bus.$on("close-map-hint", () => {
            this.infoWindow && this.infoWindow.close();
            this.closeMapInfoWin();
        }).off("close-map-hint", this)

        // 消防告警弹窗 全局化
        this.$bus.$on('fire-warning-choosed', (type, comp)=> {
            this.onSearch('企业', comp)
        }).off("fire-warning-choosed", this)

        this.showMap();
    },
    methods: {
        showMap() {
            this.loading = true;

            if (this.map) return;
            setTimeout(async () => {
                this.map = new AMap.Map("safe-map-container", {
                    // mapStyle: "amap://styles/whitesmoke",
                    zoom: 12, //级别
                    center: this.$getState(
                        "dict",
                        "regionRootLocation"
                    ).xy.split(","), //中心点坐标
                });
                this.loading = false;
                this.map.on("click", (e) => {
                    this.infoWindow && this.infoWindow.close();
                });
                // 地图监听缩放事件，当缩小时将currentRegionId字段滞空，以此判断当前地图显示饼图还是具体的点
                this.map.on("zoomchange", ()=> {
                    if(this.map.getZoom() <= 12 && this.currentTab != '摄像头') {
                        this.currentRegionId = null
                        this.map.remove([...this.firetruckMarkers, ...this.companyMarkers, ...this.cameraMarkers, ...this.textMarkers])
                        showPie(this.currentTab)
                        this.closeMapInfoWin()
                    }
                })
                this.infoWindow = new AMap.InfoWindow({
                    content: document.querySelector(".detail-window"),
                    isCustom: true, //使用自定义窗体
                    offset: new AMap.Pixel(6, 180)
                });
                this.infoWindow.on("close", () => {
					this.currentFocus = null
                });

                setTimeout(()=> {
                    if(this.$route.params.warnCompany) {
                        this.onSearch('企业', this.$route.params.warnCompany)
                    }
                }, 1000)

                this.drawFireTruck();
                drawCompanyPie.call(this, (e)=> { 
                    this.currentRegionId = e.regionId; 
                    this.drawCompanyMarker(); 
                    this.drawMonitor();
                    this.map.setZoomAndCenter(14, caculateMarkerRange(this.companyMarkers))
                })
            }, 800);
        },
        closeMapInfoWin() {
            this.showDevInfoWindow = false;
            this.showLedgerInfoWindow = false;
            this.showCameraWindow = false;
            this.currentFocus = null;
        },
        // 绘制企业
        drawCompanyMarker() {
            if (!this.map) return;
            if (this.companyMarkers) {
                this.map.remove(this.companyMarkers)
                this.companyMarkers = []
            };
            if (this.textMarkers) this.map.remove(this.textMarkers);
            // 筛选行政区域
            const filterList = this.companyList.filter(comp=> comp.regionId == this.currentRegionId)

            filterList.forEach(comp=> {
                if(comp.longitude && comp.latitude) {
                    let marker = new AMap.Marker({
                        content: `<img style="width: 36px; height: 36px;" src="${comp.devStat == 2? require("../../assets/img/company-on-fire.png"): require("../../assets/img/company-normal.png")}"></img>`,
                        position: [comp.longitude, comp.latitude],
                        offset: new AMap.Pixel(0, -8),
                        extData: comp,
                    })
                    let text = new AMap.Text({
                        text: comp.companyName,
                        style: {
                            "border": "none",
                            "background": "rgba(0, 0, 0, 0)",
                            "position": "relative",
                            "top": "-10px"
                        },
                        position: [comp.longitude, comp.latitude]
                    })
                    text.setMap(this.map)
                    this.textMarkers.push(text)
                    this.companyMarkers.push(marker)
                    marker.on("click", () => {
                        this.closeMapInfoWin();
                        this.currentFocus = "企业";
                        this.companyInfo = comp;
                        this[this.getShowHint(comp, "全部")] = true;
                        this.infoWindow.open(this.map, [
                            comp.longitude,
                            comp.latitude,
                        ]);
                        this.map.setCenter([
                            comp.longitude,
                            comp.latitude,
                        ]);
                    });
                    marker.setMap(this.map);
                }
            })
        },
        // 消防车
        drawFireTruck() {
            if(this.firetruckMarkers) {
                this.map.remove(this.firetruckMarkers)
                this.firetruckMarkers = []
            }
            const filterList = this.firetruckList.filter(fire=> fire.regionId == this.currentRegionId)

            filterList.forEach((fire) => {
                let marker = new AMap.Marker({
                    content: `<img class="${fire.stat != 2?'online-animation':''}" style="width: 32px; height: 38px;" src="${require('@/assets/img/fireCar.png')}"></img>`,
                    position: [fire.longitude, fire.latitude],
                    offset: new AMap.Pixel(0, 4),
                    extData: fire,
                });
				this.firetruckMarkers.push(marker)
                marker.on("click", () => {
                    this.closeMapInfoWin();
                    this.$nextTick(()=> {
                        this.currentFocus = "消防车";
                        this.fireInfo = fire;
                        this.infoWindow.open(this.map, [
                            fire.longitude,
                            fire.latitude,
                        ]);
                        this.map.setCenter([fire.longitude, fire.latitude]);
                    })
				});
				marker.setMap(this.map);
            })
		},
		// 绘制消防车历史轨迹
        drawFireTruckTrack(id, path = []) {
            this.map.setZoomAndCenter(17, [this.fireInfo.longitude, this.fireInfo.latitude])
            setTimeout(()=> {
                this.trackLine[id] = new AMap.Polyline({
                    map: this.map,
                    path: path.reverse(),
                    showDir:true,
                    strokeColor: "#28F",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    // strokeStyle: "solid"  //线样式
                })
            }, 200)
        },
        // 摄像头
        drawMonitor() {
            if(this.cameraMarkers.length) this.map.remove(this.cameraMarkers)
            
            const filterList = this.currentTab == '摄像头' ? this.monitorList : this.monitorList.filter(monitor=> monitor.regionId == this.currentRegionId)

            filterList.forEach((monitor) => {
                if (!monitor.gps) return;
                const gps = [monitor.gps.split(",")[0], monitor.gps.split(",")[1]]
                let marker = new AMap.Marker({
                    content: `<img style="width: 24px; height: 24px;position: relative; z-index: 9999999999999" src="${require("@/assets/img/camera-theme.png")}"></img>`,
                    position: gps,
                    offset: new AMap.Pixel(0, 0),
                    extData: monitor
				});
				this.cameraMarkers.push(marker)
                marker.setMap(this.map);
                marker.on("click", () => {
                    this.closeMapInfoWin();
                    this.currentFocus = "摄像头";
                    this.cameraInfo = monitor;
                    this.infoWindow.open(this.map, gps);
                    this.map.setCenter(gps);
                });
            });
        },
        // 搜索
        onSearch(type, item, value) {
            this.closeMapInfoWin();
            
            // 根据选中企业/消防车/摄像头的regionId来模拟点击(emit)
            if(this.currentTab !== '摄像头') {
                const currentMarkers = getPieMarkers(this.currentTab) || []
                currentMarkers.forEach(marker=> {
                    if(marker.getExtData().regionId == item.regionId) {
                        marker.emit('click')
                    }
                })
            }

            setTimeout(()=> {
                this.map.setZoomAndCenter(15, [
                    type != "摄像头" ? item.longitude : item.gps.split(",")[0],
                    type != "摄像头" ? item.latitude : item.gps.split(",")[1],
                ]);
                this.currentFocus = type
                switch (type) {
                    case "企业":
                        this.companyInfo = item;
                        this[this.getShowHint(item, item.type)] = true;
                        this.infoWindow.open(this.map, [
                            item.longitude,
                            item.latitude,
                        ]);
                        break;
                    case "消防车":
                        this.fireInfo = item;
                        this.infoWindow.open(this.map, [
                            item.longitude,
                            item.latitude,
                        ]);
                        break;
                    default:
                        this.cameraInfo = item;
                        this.infoWindow.open(this.map, [
                            item.gps.split(",")[0],
                            item.gps.split(",")[1],
                        ]);
                }
            }, 100)
        },
        getShowHint(company, type) {
            type = type || this.currentTab;
            if (type == "全部")
                return company.devStat == 2
                    ? "showDevInfoWindow"
                    : "showLedgerInfoWindow";
            else if (type == "摄像头") return "showCameraWindow";
            //消防车暂时没有这个数据
            else if (type == "消防车")
                return company.devStat == 2
                    ? "showDevInfoWindow"
                    : "showLedgerInfoWindow";
        },
        viewVideo() {
            if (!this.companyCameraMap[this.cameraInfo.companyNo])
                return this.$message.error("未找到该摄像头信息");
            this.$refs.videoLive.show(
                this.companyCameraMap[this.cameraInfo.companyNo],
                this.companyCameraMap[this.cameraInfo.companyNo].findIndex(
                    (camera) => camera.deviceId == this.cameraInfo.deviceId
                )
            );
        }
    }
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";

.map-outer {
    .bottom-notice {
        width: 100%;
        position: absolute;
        bottom: 1rem;
        left: 0;
        right: 0;
    }
}
#safe-map-container {
    width: 100vw !important;
    height: 100vh !important;
    .pf;
    left: 0;
    top: 0;

    .mask {
        .pa;
        width: 100vw;
        height: 100vh;
        z-index: 99;
        pointer-events: none;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
    }
    
}
.online-animation {
        animation: flicker 1.5s infinite;
        -webkit-animation: flicker 1.5s infinite;
    }
@keyframes flicker {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0.1;
    }
    to {
        opacity: 1.0;
    }
    
}

</style>

<style>
.online-animation {
        animation: flicker 1.5s infinite;
        -webkit-animation: flicker 1.5s infinite;
    }
@keyframes flicker {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0.1;
    }
    to {
        opacity: 1.0;
    }
    
}
</style>
