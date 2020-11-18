<template>
    <div class="map-outer pl16 pr16">
        <company-search @search="onSearch" v-model="currentTab"/>
        <div
            id="map-container"
            v-loading="loading"
            element-loading-text="地图渲染中..."
        ></div> 
        <dispatch-record-more v-if="showWinName" :sid="sid" />
        <div class="info-window" ref="showRef" v-show="showInfoWindow">
            <div class="info-center">
                <div class="info-bottom">
                    <div class="img" v-if="userInfo.adminId">
                        <el-image
                            style="width: 5vw; height: 8vh"
                            :src="`http://${this._api.baseUrl}/safety/file/downFile/${userInfo.frontPhoto}`"
                            fit
                        ></el-image>
                    </div>
                    <div class="info-box">
                        <div class="info-user" v-if="userInfo.adminId">
                            <div class="detail">
                                <span>{{ userInfo.name }}</span>
                            </div>
                            <div class="detail">
                                <span>{{ userInfo.age }}岁</span>
                            </div>
                            <div class="detail">
                                <span>{{
                                    userInfo.sex == 1 ? "男" : "女"
                                }}</span>
                            </div>
                        </div>
                        <div class="info-user" v-if="userInfo.gps">
                            <div class="detail">
                                <span>{{ userInfo.sanitationName }}</span>
                            </div>
                        </div>
                        <div class="info-tel" v-if="userInfo.adminId">
                            <div class="detail">
                                <span>联系电话： {{ userInfo.phone }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="checkbox" v-if="userInfo.adminId">
                    <el-checkbox
                        v-model="electronicFence"
                        @change="chooseEnclosure"
                        >电子围栏</el-checkbox
                    >
                    <el-checkbox
                        v-model="historicalTrackList[userInfo.index].status"
                        @change="chooseHistoryTrack"
                        >历史轨迹</el-checkbox
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CompanySearch from "./center/CompanySearch"
import DispatchRecordMore from "./center/DispatchRecordMore"
export default {
    name: "Map",
    components: { CompanySearch, DispatchRecordMore },
    props: {
        workerList: {
            type: Array,
            default: ()=> []
        },
        monitorList: {
            type: Array,
            default: ()=> []
        }
    },
    data() {
        return {
            loading: true,
            electronicFence: false,
            historicalTrack: false,
            // 海量点存储列表
            massMarkers: [],
            
            showWinName: false,
            camearMarkers: [],
            infoWindow: null,
            showInfoWindow: false,
            pageNum: 1,
            currentTab: "全部",
            sid: "",
            currentFocus: null,
            userInfo: {},
            pic: "",
            railId: "",
            polygon: [],
            circle: [],
            layer: {
                worker: null,
                monitor: null,
            },
            isFalse: true,
            // 历史轨迹按钮状态
            historicalTrackList: [],
            // 历史轨迹
            trackLineList: [],
            workerListNew: []
        }
    },
    watch: {
        workerList: {
            handler(newList, oldList) {
                if (!newList||JSON.stringify(newList) === JSON.stringify(oldList) && this.massMarkers.length) return
                console.log('更新');
                this.historicalTrackList = this.workerList.map(el=>{
                    return {
                        cardId: el.cardId,
                        adminId: el.adminId,
                        status: false
                    }
                })
                if (this.currentTab == "全部" || this.currentTab == "环卫工人")
                    this.workerListMarker()
                    this.loading = false
            },
        },
        monitorList: {
            handler(newList, oldList) {
                if (!newList||JSON.stringify(newList) === JSON.stringify(oldList) && this.camearMarkers.length) return
                if (this.currentTab == "全部" || this.currentTab == "摄像头")
                    this.drawMonitor()
                    this.loading = false
            },
        },
        // userInfo(value) {
        //     this.electronicFence = false
        //     this.historicalTrack = false
        //     this.map.remove(this.trackLine)
        // },
        currentTab(tab) {
            switch (tab) {
                case "全部":
                    this.clearMap()
                    this.workerListMarker()
                    this.drawMonitor()
                    this.setCenterPoint(this.monitorList)

                    break
                case "环卫工人":
                    this.clearMap()
                    this.workerListMarker()
                    this.setCenterPoint(this.workerList)
                    break
                case "摄像头":
                    this.clearMap()
                    this.drawMonitor()
                    this.setCenterPoint(this.monitorList)
                    break
            }
        },
    },
    async mounted() {
        this.showMap()
        this.$bus.$on("map-choose-company", (param) => {
            this.currentTab = "全部"
            this.closeMapInfoWin()
            this.infoWindow.close()
            this.map.setZoomAndCenter(12, [
                param.company.longitude,
                param.company.latitude,
            ])
        })
        this.$bus.$on("show-alarm-more-dispatch", (sid, state) => {
            this.sid = sid
            if(!state){
                this.showWinName = true
            }
        })
        this.$bus.$on("closeMoreAlarm", (val) => {
            this.showWinName = false
        })
        this.$bus.$on("openChooseCamear", (el) => {
            this.openCamear(el)
        })
    },
    methods: {
        setCenterPoint(list) {
            if(!list||!list.length) return
            for (var comp of list) {
                if (comp.longitude || comp.gps) {
                    var xy = null;
                    if (comp.gps) xy = [comp.gps.split(",")[0], comp.gps.split(",")[1]];
                    else xy = [comp.longitude, comp.latitude];
                    this.map.setZoomAndCenter(
                        12,
                        new AMap.LngLat(xy[0],xy[1])
                    );
                    break;
                }
            }
        },
        showMap() {
            this.loading = true
            if (this.map) return
            setTimeout(async () => {
                this.map = new AMap.Map("map-container", {
                    // mapStyle: "amap://styles/whitesmoke",
                    zoom: 12, //级别
                    center: this.$getState('dict','regionRootLocation').xy.split(","), //中心点坐标
                    // features: ["bg", "road", "building"],
                })
                this.workerListMarker()
                this.drawMonitor()
            }, 800)
        },
        closeMapInfoWin() {
            this.currentFocus = null
            this.polygon = []
            this.circle = []
            this.electronicFence = false
            // this.historicalTrack = false
        },
        clearMap() {
            if (this.map) {
                this.map.clearMap()
                // this.layer.clear()
                this.trackLineList = []
                this.historicalTrackList = this.workerList.map(el=>{
                    return {
                        cardId: el.cardId,
                        adminId: el.adminId,
                        status: false
                    }
                })
                this.map.remove(this.layer["worker"])
                this.map.remove(this.layer["monitor"])
                this.map.remove(this.massMarkers)
                this.map.remove(this.camearMarkers)
            }
        },
        // 绘制海量点
        // 工人
        workerListMarker() {
            if (!this.map || !this.workerList.length) return
            let companys = []
            this.map.remove(this.massMarkers)
            if(this.layer["worker"])
            this.map.remove(this.layer["worker"])
            var style = []
            this.workerListNew = this.workerList.map((el,key)=>{return{ ...el, index: key }})
            this.workerListNew.forEach((comp, index) => {
                // console.log(comp, "环卫工人A")
                // this.pic = comp.frontPhoto

                if (comp.longitude && comp.latitude) {
                    style.push({
                        url: comp.frontPhoto?`http://${this._api.baseUrl}/safety/file/downFile/${comp.frontPhoto}`:require("../../assets/img/defalut-avatar.png"),
                        anchor: new AMap.Pixel(0, 2),
                        size: new AMap.Size(28, 28)
                    })
                    companys.push({
                        lnglat: [comp.longitude, comp.latitude],
                        info: comp,
                        id: comp.adminId,
                        style: index
                    })
                }
            })
            var mass = new AMap.MassMarks(companys, {
                opacity: 1,
                zIndex: 9999,
                cursor: "pointer",
                style: style
            })
            var frameMass = new AMap.MassMarks(companys, {
                zIndex: 1000,
                cursor: "pointer",
                style: [{
                    url: require("@/assets/img/worker-box.png"),
                    anchor: new AMap.Pixel(10, 2),
                    size: new AMap.Size(48, 48),
                }]
            })
            var circleMass = new AMap.MassMarks(companys, {
                zIndex: 10000,
                cursor: "pointer",
                style: [{
                    url: require("../../assets/img/circle.png"),
                    anchor: new AMap.Pixel(6, 6),
                    size: new AMap.Size(40, 40),
                }]
            })
            frameMass.setMap(this.map)
            circleMass.setMap(this.map)
            mass.setMap(this.map)
            this.massMarkers.push(mass, frameMass, circleMass)
            // 图标上点位名称
            this.draw("worker", this.workerList)
            // 海量点绑定点击事件
            circleMass.on("click", (e) => {
                // console.log(e, "工人")
                this.currentFocus = "工人"
                const longitude = e.data.lnglat.R
                const latitude = e.data.lnglat.Q
                this.railId = e.data.info.railId
                // userInfo是环卫工人信息
                this.userInfo = e.data.info
                this.showInfoWindow = true
                let infowindow = new AMap.InfoWindow({
                    isCustom: true,
                    content: this.$refs.showRef,
                    closeWhenClickMap: true,
                    position: [longitude, latitude],
                })
                infowindow.on("close", ()=> {
                    this.electronicFence = false
                    this.map.remove(this.polygon)
                    this.map.remove(this.circle)
                    this.closeMapInfoWin()
                })
                infowindow.open(this.map)
            })
            // this.map.setFitView()
        },
        // 覆盖层，显示点位名称
        draw(type, list) {
            let itemList = list.map((el) => {
                return {
                    ...el,
                    name: el.sanitationName || el.name,
                    longitude: el.gps ? el.gps.split(",")[0] : el.longitude,
                    latitude: el.gps ? el.gps.split(",")[1] : el.latitude,
                }
            })
            this.layer[type] = new AMap.LabelsLayer({
                zooms: [3, 20],
                zIndex: 1,
                // 开启标注避让，默认为开启，v1.4.15 新增属性
                collision: true,
                // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
                animation: false,
            })
            // this.layer.clear()
            this.map.add(this.layer[type])
            itemList.map((el, index) => {
                if (el.longitude && el.latitude) {
                    let labelMarker = new AMap.LabelMarker({
                        position: [el.longitude, el.latitude],
                        opacity: 1,
                        zooms: [3, 20],
                        text: {
                            content: el.name,
                            direction: "top",
                            offset: [0, -10],
                            style: {
                                fontSize: 12,
                                fillColor: "#666",
                                strokeColor: "transparent",
                                strokeWidth: "5",
                            },
                        },
                        extData: {
                            index: index,
                        },
                    })
                    this.layer[type].add(labelMarker)
                }
            })
        },
        // 摄像头
        drawMonitor() {
            if (!this.map) return
            let monitors = []
            this.map.remove(this.camearMarkers)
            if(this.layer["monitor"])
                this.map.remove(this.layer["monitor"])
            this.monitorList.forEach((monitor) => {
                if(monitor.gps && monitor.gps.split(',').length)
                    monitors.push({
                        lnglat: [monitor.gps.split(",")[0], monitor.gps.split(",")[1]],
                        name: "@/assets/img/camear.png",
                        // name: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                        offset: new AMap.Pixel(0, 0),
                        info: monitor
                    })
            })
            var massMarker = new AMap.MassMarks(monitors, {
                opacity: 0.8,
                zIndex: 9999,
                cursor: "pointer",
                style: [
                    {
                        url: require("@/assets/img/camera-theme.png"),
                        anchor: new AMap.Pixel(4, 16),
                        size: new AMap.Size(40, 40),
                    },
                ]
            })

            massMarker.setMap(this.map)
            this.draw("monitor", this.monitorList)
            this.camearMarkers.push(massMarker)
            // 海量点绑定点击事件
            massMarker.on("click", (e) => {
                // console.log(e)
                //摄像头视频地址
                this.$bus.$emit("camearPlayAddr", e.data.info)
                //对应环卫点ID
                this.$bus.$emit("get-dispatch-list", e.data.info)
                this.userInfo = e.data.info
                this.showInfoWindow = true
                let infowindow = new AMap.InfoWindow({
                    isCustom: true,
                    content: this.$refs.showRef,
                    closeWhenClickMap: true,
                    position: [
                        e.data.info.gps.split(",")[0],
                        e.data.info.gps.split(",")[1],
                    ],
                })
                infowindow.open(this.map)
            })
            this.$bus.$emit("cameraNum", this.monitorList.length)
            // this.map.setFitView()
        },
        // 对应电子围栏(多边形)
        drawPolygon(path) {
            this.polygon = new AMap.Polygon({
                path: path,
                strokeColor: "#1FE0C9",
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                fillColor: "#2C5A55",
                zIndex: 50,
            })
            this.map.add(this.polygon)
            // 缩放地图到合适的视野级别
            this.map.setFitView([this.polygon])
            var polyEditor = new AMap.PolyEditor(this.map, this.polygon)
            this.map.add(this.polygon)
        },
        // 对应电子围栏（圆形）
        drawCircle(center, radius) {
            // console.log("画圆")
            this.circle = new AMap.Circle({
                center,
                radius, //半径
                borderWeight: 3,
                strokeColor: "#53ac85",
                strokeOpacity: 1,
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                strokeStyle: "dashed",
                strokeDasharray: [10, 10],
                // 线样式还支持 'dashed'
                fillColor: "#53ac85",
                zIndex: 50,
            })
            this.map.add(this.circle)
            // 缩放地图到合适的视野级别
            this.map.setFitView([this.circle])
        },
        // 绘制历史轨迹
        drawTrack(path = [], workerCardId) {
            let line = new AMap.Polyline({
                map: this.map,
                path: path.reverse(),
                showDir:true,
                strokeColor: "#28F",  //线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 6,      //线宽
                // strokeStyle: "solid"  //线样式
            })
            this.trackLineList.push({cardId: workerCardId, trackLine: line})
        },
        // 搜索
        onSearch(type, item, value) {
            // console.log(type, item, value, "滴滴滴滴滴滴滴滴滴滴滴")
            this.closeMapInfoWin()
            this.map.setZoomAndCenter(12, [
                type != "摄像头" ? item.longitude : item.gps.split(",")[0],
                type != "摄像头" ? item.latitude : item.gps.split(",")[1],
            ])
            switch (type) {
                case "工人":
                    this.currentFocus = "工人"
                    this.showInfoWindow = true
                    this.userInfo = item
                    this.railId = item.railId
                    let infowindow = new AMap.InfoWindow({
                        isCustom: true,
                        content: this.$refs.showRef,
                        closeWhenClickMap: true,
                        position: [item.longitude, item.latitude],
                    })
                    infowindow.open(this.map)
                    break
                default:
                    this.currentFocus = "摄像头"
                    let infowindow2 = new AMap.InfoWindow({
                        isCustom: true,
                        closeWhenClickMap: true,
                        position: [
                            item.gps.split(",")[0],
                            item.gps.split(",")[1],
                        ],
                    })
                    infowindow2.open(this.map)
            }
        },
        // 选择摄像头
        openCamear(e) {
            // console.log(e, "map   aaaaaaaaaaaaaaaaaaaaaaaaaaa")
            this.userInfo = e
            this.showInfoWindow = true
            let infowindow = new AMap.InfoWindow({
                isCustom: true,
                content: this.$refs.showRef,
                closeWhenClickMap: true,
                position: [e.gps.split(",")[0], e.gps.split(",")[1]],
            })
            this.map.setZoomAndCenter(15, [
                e.gps.split(",")[0],
                e.gps.split(",")[1],
            ])
            infowindow.open(this.map)
        },
        // 选中电子围栏事件
        chooseEnclosure() {
            if (this.electronicFence) {
                this.getElectronicFence(this.railId)
            } else {
                this.map.remove(this.polygon)
                this.map.remove(this.circle)
                // this.closeMapInfoWin()
            }
        },
        // 选中历史轨迹
        chooseHistoryTrack(value) {
            let status = this.trackLineList.filter(el=>{
                return el.cardId == this.userInfo.cardId
            })
            if(value) {
                if(status.length > 0){
                    status[0].trackLine.show()
                }else{
                    this.getHistoryTrack(this.userInfo.cardId)
                }
            } else {
                if(status[0]) status[0].trackLine.hide()
            }
        },
        // 环卫工人电子围栏信息
        async getElectronicFence(id) {
            const res = await this.$http.reqApi("data", "historicalTrack", { id }),
                  edgeLngLat = res.coordinates.split(';').filter(coor=>{return !!coor}).map(coor=> {
                      return coor.split(',')
                  })

            if(this._dict.railType[res.railType] === '圆形') {
                res.centerCoordinate && this.drawCircle(res.centerCoordinate.split(',').map(Number), res.radius || 300)
            } else {
                this.drawPolygon(edgeLngLat)
            }        
        },
        // 环卫工人运动轨迹信息
        async getHistoryTrack(workerCardId) {
            const res = await this.$http.reqApi("data", "workerHistoryTrack", { pageNum: 1, pageSize: 2000 }, 'get', {
                // TODO:去掉0
                // workerCardId: '0' + workerCardId
                workerCardId
            })
            if(res && Array.isArray(res.rows)) {
                if(!res.rows.length) return this.$message.warning('暂无轨迹信息！')
                this.drawTrack(res.rows.map(row=> {
                    if(row.longitude && row.latitude)
                        return [
                            row.longitude, 
                            row.latitude
                        ]
                }), workerCardId)
            } 
        }
    }
}
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.map-outer {
    height: calc(100vh - 132px);
}
#map-container {
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
    .info-window {
        .pr;
        z-index: 100;
        &.normal {
            .circle {
                background: rgba(27, 255, 228, 0.2);
                border: 1px solid #2b5954;
                &::before {
                    background: #2b5954;
                }
            }
            .info {
                border: 1px solid #2b5954;
                background: rgba(27, 255, 228, 0.2);
                &::before {
                    background: #2b5954;
                }
            }
        }
        .circle {
            .pr;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            border: 1px solid red;
            background: rgba(237, 97, 78, 0.3);
            animation: expand 1s linear;
            &::before {
                content: "";
                .pa;
                top: -50px;
                left: 270px;
                display: block;
                height: 250px;
                width: 1px;
                background: red;
                transform: rotate(60deg);
            }
        }
        .info {
            border: 1px solid red;
            background: rgba(237, 97, 78, 0.3);
            width: 300px;
            min-height: 120px;
            .flex(column, center, flex-start);
            .p10;
            .pa;
            right: -394px;
            top: -107px;
            color: #fff;
            animation: rec 1s linear;
            > div {
                width: 100%;
                &:nth-child(2n) {
                    .mt10;
                    .mb10;
                }
                &:nth-child(2) {
                    .flex(row, space-between);
                }
            }
            span {
                .word-ellipsis;
            }
            &::before {
                content: "";
                .pa;
                top: 0;
                left: -16px;
                display: block;
                height: 120px;
                width: 1px;
                background: red;
                animation: rec 1s linear;
            }
            .camera-list {
                .pt10;
                img {
                    border-radius: 5px;
                    margin-right: 20px;
                    .mb10;
                    width: ~"calc(50% - 20px)";
                }
            }
            .cheader {
                .pt10;
                .pb10;
                border-bottom: 1px solid #083a34;
            }
        }
    }
    @keyframes expand {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }
    @keyframes rec {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .info-window {
        width: 15vw;
        background-color: #fff;

        &::after {
            .pa;
            content: "";
            border-top: 10px solid white;
            border-right: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-left: 10px solid transparent;
            left: 50%;
            bottom: -20px;
            transform: translateX(-50%);
        }

        .info-center {
            display: flex;
            flex-direction: column;
            font-size: 20px;

            .info-bottom {
                padding: 1rem;
                display: flex;
                flex-direction: row;
                margin-bottom: 1vh;
                .img {
                    width: 5vw;
                    height: 6vh;
                    margin-right: 1vw;
                }
                .info-box {
                    .info-user {
                        display: flex;
                        .detail {
                            margin-right: 1vw;
                        }
                    }
                    .info-tel {
                        margin-top: 2.8vh;
                    }
                }
            }
            .checkbox {
                padding: 1rem;
                display: flex;
                justify-content: space-around;
            }
        }
    }
}
</style>
