<template>
    <div class="map-outer">
        <div id="electric-map-container" v-loading="loading" element-loading-text="地图渲染中..."></div>
        <div class="search-input">
            <company-search @search="search"></company-search>
        </div>
        <company-hint class="bottom-notice" :companyInfo="companyInfo" v-if="showInfoWindow" />
    </div>
</template>

<script>
import CompanyHint from './center/components/CompanyHint'
import CompanySearch from './center/components/CompanySearch'
var CronJob = require('cron').CronJob
import echarts from 'echarts'

export default {
    name: 'Map',
    components: { CompanyHint, CompanySearch },
    data() {
        return {
            cron: null,
            companyInfo: {},
            loading: true,
            companyData: [],
            // 海量点存储列表
            massMarkers: [],
            infoWindow: null,
            showInfoWindow: false,
            showDevInfoWindow: false,
            showLedgerInfoWindow: false,
            showCameraWindow: false,
            pageNum: 1,
            currentTab: '全部',
            searchVal: null,
            initAll: false,
            cardType: 1,
            countData: null,
            regionMarkers: [],
            marker: null,
            regions: [],
            // 公司名字
            textMarkers: [],
        }
    },
    created() {
        this.$bus
            .$on('updateElectricType', () => {
                this.getRegionList()
                this.getList(this._dict.regionRoot.code)
                this.map.setZoomAndCenter(14, [this.$getState('dict', 'regionRootLocation').xy.split(',')[0], this.$getState('dict', 'regionRootLocation').xy.split(',')[1]])
                this.showInfoWindow = false
            })
            .off(this, 'updateElectricType')
    },
    mounted() {
        this.cron = new CronJob(
            '*/15 * * * * *',
            () => {
                if(this.map && this.map.getZoom()<=14){
                    this.getRegionList()
                }
            },
            null,
            false,
            'Asia/Chongqing'
        )
        this.cron.start()
        this.getList(this._dict.regionRoot.code)
        this.showMap()
    },
    beforeDestroy() {
        this.cron.stop()
    },
    watch: {
        regions: {
            handler(newList, oldList) {
                if (JSON.stringify(newList) === JSON.stringify(oldList)) return
                this.drawPieChar()
            },
        }
    },
    methods: {
        async getRegionList() {
            const res = await this.$http.reqApi('data', 'monStatCount', {
                regionParentId: this._dict.regionRoot.code,
                type: this._settings.electricType,
            })
            if (res && res.rows && !res.error) {
                this.regions = res.rows
            } else {
                return
            }
        },
        // 绘制区域饼图
        drawPieChar() {
            if (!Array.isArray(this.regions)) return
            if (this.regionMarkers.length) {
                this.map.remove(this.regionMarkers)
                this.regionMarkers = []
            }
            const recursion = (index, callback = ()=> {}, time = 0)=> {
              if(document.querySelector('#region-chart-' + index)) {
                callback()
                return 
              }
              time < 15 && setTimeout(()=> {
                recursion(index, callback, ++time)
              }, 150)
            }
            this.regions
                .filter((r) => r.factoryCount > 0)
                .forEach((region, index) => {
                    this.marker = new AMap.Marker({
                        content:
                            "<div style='position: relative; overflow: hidden'>" +
                            "<div style='position: absolute;top: 50%; left: 50%; width: 48px; transform: translate(-50%, -50%) scale(.9); color: #fff; font-size: 10px; z-index: 99999;display: flex; flex-direction: column; justify-content: center; align-items: center'>" +
                            '<span>' +
                            region.factoryCount +
                            '</span>' +
                            '<span>' +
                            region.regionName.slice(0, 3) +
                            '<span>' +
                            '</div><div id=region-chart-' +
                            index +
                            " style='width: 48px; height:48px;'></div></div>",
                        position: [region.longitude, region.latitude],
                        offset: new AMap.Pixel(0, 0),
                        extData: region
                    })
                    this.regionMarkers.push(this.marker)
                    this.marker.setMap(this.map)
                    // this.map.setFitView()
                    
                    recursion(index, ()=> {
                        if(this.regionMarkers.length){
                          var pieChart = echarts.init(document.querySelector('#region-chart-' + index))
                          pieChart.setOption({
                              animation: false,
                              color: ['#53cf9a', '#a9a8ab', '#ff041e'],
                              series: [
                                  {
                                      name: '占比',
                                      type: 'pie',
                                      radius: '85%',
                                      center: ['50%', '50%'],
                                      data: [
                                          { value: region.qualifiedCount || 0, name: '正常' },
                                          { value: region.unrunCount || 0, name: '停工' },
                                          { value: region.overproofCount || 0, name: '违规' },
                                      ],
                                      hoverAnimation: false,
                                      label: {
                                          //去除饼图的指示折线label
                                          normal: {
                                              show: false,
                                          },
                                      },
                                  },
                              ],
                          })
                        }
                    })
                    this.marker.on('click', (e)=> {
                        if (region.factoryCount === 0) {
                            alert('该区域下没有企业！')
                            return
                        }
                        this.map.setZoomAndCenter(15, [region.longitude, region.latitude])
                        this.getList(region.regionId, true)
                        this.regionMarkers.forEach(function(marker) {
                            marker.hide()
                        })
                    })
                })
        },
        // 获取公司信息
        // type boolean true 为绘制公司点位
        async getList(regionId, type) {
            const res = await this.$http.reqApi('data', 'companyList', {
                pageNum: 1,
                pageSize: 2000,
                regionId: regionId,
                type: this._settings.electricType,
            })
            if (res && res.rows && !res.error) {
                // if (this.companyData && JSON.stringify(res.rows) === JSON.stringify(this.companyData)) return
                if(type){
                    this.drawMassMarker(res.rows)
                }else{
                    this.companyData = res.rows
                }
            } else {
                return
            }
        },
        search(item, value) {
            if (item && value) {
                this.regionMarkers.forEach((marker) => {
                    if(marker.getExtData().regionId == item.regionId){
                        marker.emit('click')
                    }
                })
                this.showInfoWindow = false
                this.map.setZoomAndCenter(17, [item.longitude, item.latitude])
                this.showInfoWindow = true
                this.companyInfo = item
                
                // this.dreawMarkerSearch(item)
            } else {
                this.showInfoWindow = false
            }
        },
        showMap() {
            this.loading = true
            if (this.map) return
            setTimeout(async () => {
                this.map = new AMap.Map('electric-map-container', {
                    // mapStyle: 'amap://styles/whitesmoke',
                    zoom: 14, //级别
                    center: this.$getState('dict', 'regionRootLocation').xy.split(','), //中心点坐标
                })
                this.loading = false
                this.map.on('zoomchange', () => {
                	if(this.map.getZoom() <= 14) {
                		this.regionMarkers.forEach(function(marker) {
                			marker.show()
                        })
                        this.massMarkers.length && this.map.remove(this.massMarkers)
                        if (this.textMarkers) this.map.remove(this.textMarkers);
                        this.massMarkers = []
                        this.showInfoWindow = false
                        // this.companyData = []
                    }
                })
                // this.mapInited = true
                this.map.on('click', (e) => {
                    this.showInfoWindow = false
                })
                // this.drawMassMarker()
                this.getRegionList()
            }, 1000)
        },
        clearMap() {
            if (this.map) {
                this.map.clearMap()
                this.map.remove(this.massMarkers)
            }
        },
        // 绘制海量点
        drawMassMarker(companyData) {
            if (!this.map) return
            if (this.massMarkers.length > 0) {
                this.map.remove(this.massMarkers)
                this.massMarkers = []
            }
            if (this.textMarkers) this.map.remove(this.textMarkers);
            this.loading = true
            let normalCompanys = [],
                stopCompanys = [],
                violationCompanys = [],
                urlDependOnMonStat = [require('../../assets/img/company-normal.png'), require('../../assets/img/company-lay-off.png'), require('../../assets/img/company-violation.png')]
            companyData.forEach((comp) => {
                if (this.$getState('dict', 'monStat')[comp.monStat] == '正常') {
                    normalCompanys.push({
                        lnglat: [comp.longitude, comp.latitude],
                        info: comp,
                        id: comp.companyNo,
                    })
                } else if (this.$getState('dict', 'monStat')[comp.monStat] == '停工') {
                    stopCompanys.push({
                        lnglat: [comp.longitude, comp.latitude],
                        info: comp,
                        id: comp.companyNo,
                    })
                } else {
                    violationCompanys.push({
                        lnglat: [comp.longitude, comp.latitude],
                        info: comp,
                        id: comp.companyNo,
                    })
                }
                let text = new AMap.Text({
                        text: comp.companyName,
                        style: {
                            "border": "none",
                            "background": "rgba(0, 0, 0, 0)",
                            "position": "relative",
                            "top": "-15px"
                        },
                        position: [comp.longitude, comp.latitude]
                    })
                text.setMap(this.map)
                this.textMarkers.push(text)
            })
            let renderMap = [normalCompanys, stopCompanys, violationCompanys]
            renderMap.forEach((massData, index) => {
                var mass = new AMap.MassMarks(massData, {
                    opacity: 0.8,
                    zIndex: 9999,
                    cursor: 'pointer',
                    style: [
                        {
                            url: urlDependOnMonStat[index],
                            anchor: new AMap.Pixel(4, 16),
                            size: new AMap.Size(32, 32),
                        },
                    ],
                })
                mass.setMap(this.map)
                this.massMarkers.push(mass)
                // 海量点绑定点击事件
                mass.on('click', (e) => {
                    this.companyInfo = e.data.info
                    setTimeout(() => {
                        this.showInfoWindow = true
                    }, 200)
                    this.map.setZoomAndCenter(17, [e.data.info.longitude, e.data.info.latitude])
                })
            })
            // this.map.setFitView()
            this.loading = false
        },
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';

.map-outer {
    .bottom-notice {
        position: absolute;
        bottom: 1rem;
        left: 19vw;
        right: 0;
    }
}
#electric-map-container {
    width: 100vw !important;
    height: 100vh !important;
    .pf;
    left: 0;
    top: 0;
}
</style>
