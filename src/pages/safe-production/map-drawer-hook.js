import echarts from 'echarts'
let companyMarkers = [],
    firetruckMarkers = []

// 绘制企业区域饼图
export async function drawCompanyPie(clickFn = ()=> {}) {
    const res = await this.$http.reqApi('data', 'companyCountAlarm', { regionId: this._settings.regionId })
    if (res.error || !Array.isArray(res)) return
    if (companyMarkers.length) this.map.remove(companyMarkers)
    const regions = res.filter(row => row.longitude && row.latitude),
    recursion = (index, callback = () => { }, time = 0) => {
        if (document.querySelector('#region-chart-' + index)) {
            callback()
            return
        }
        time < 40 && setTimeout(() => {
            recursion(index, callback, ++time)
        }, 100)
    }
    
    regions.forEach((region, index) => {
        let marker = new AMap.Marker({
            content: "<div style='position: relative; overflow: hidden'>" +
                "<div style='position: absolute;top: 50%; left: 50%; width: 48px; transform: translate(-50%, -50%) scale(.9); color: #fff; font-size: 10px; z-index: 99999;display: flex; flex-direction: column; justify-content: center; align-items: center'>" +
                "<span>" + region.allNum + "</span>" +
                "<span>" + (region.regionName).slice(0, 3) + "<span>" +
                "</div><div id=region-chart-" + index + " style='width: 48px; height:48px;'></div></div>",
            position: [region.longitude, region.latitude],
            offset: new AMap.Pixel(0, 0),
            extData: region
        })
        companyMarkers.push(marker)
        marker.on('click', ()=> {
            clickFn(region)
            hidePie('全部')
        })
        marker.setMap(this.map)
        recursion(index, ()=> {
            const pieChart = echarts.init(document.querySelector("#region-chart-" + index))
            pieChart.setOption({
                color: ['#53cf9a', '#ff041e'],
                series: [
                    {
                        name: '占比',
                        type: 'pie',
                        radius: '85%',
                        center: ['50%', '50%'],
                        data: [
                            { value: region.numNoAlarm || 0, name: '正常' },
                            { value: region.numAlarm || 0, name: '告警' }
                        ],
                        hoverAnimation: false,
                        label: { 　　　　　　　　　　//去除饼图的指示折线label
                            normal: {
                                show: false,
                            }
                        }
                    }
                ]
            })
        })
    })
}

// 绘制消防车区域饼图
export async function drawFiretruckPie(clickFn = ()=> {}) {
    const res = await this.$http.reqApi('data', 'firetruckCountAlarm', { regionId: this._settings.regionId })
    if (res.error || !Array.isArray(res)) return
    if (firetruckMarkers.length) this.map.remove(firetruckMarkers)
    const regions = res.filter(row => row.longitude && row.latitude),
        recursion = (index, callback = () => { }, time = 0) => {
            if (document.querySelector('#region-chart-fire-' + index)) {
                callback()
                return
            }
            time < 40 && setTimeout(() => {
                recursion(index, callback, ++time)
            }, 100)
        }
    regions.forEach((region, index) => {
        let marker = new AMap.Marker({
            content: "<div style='position: relative; overflow: hidden'>" +
                "<div style='position: absolute;top: 50%; left: 50%; width: 48px; transform: translate(-50%, -50%) scale(.9); color: #fff; font-size: 10px; z-index: 99999;display: flex; flex-direction: column; justify-content: center; align-items: center'>" +
                "<span>" + region.allNum + "</span>" +
                "<span>" + (region.regionName).slice(0, 3) + "<span>" +
                "</div><div id=region-chart-fire-" + index + " style='width: 48px; height:48px;'></div></div>",
            position: [region.longitude, region.latitude],
            offset: new AMap.Pixel(0, 0),
            extData: region
        })
        firetruckMarkers.push(marker)
        marker.on('click', ()=> {
            clickFn(region)
            hidePie('消防车')
        })
        marker.setMap(this.map)
        recursion(index, ()=> {
            const pieChart = echarts.init(document.querySelector("#region-chart-fire-" + index))
            pieChart.setOption({
                color: ['#53cf9a', '#a9a8ab'],
                series: [
                    {
                        name: '占比',
                        type: 'pie',
                        radius: '85%',
                        center: ['50%', '50%'],
                        data: [
                            { value: region.numOnline || 0, name: '在线' },
                            { value: region.numOffline || 0, name: '离线' }
                        ],
                        hoverAnimation: false,
                        label: { 　　　　　　　　　　//去除饼图的指示折线label
                            normal: {
                                show: false,
                            }
                        }
                    }
                ]
            })
        })
    })
}

// 隐藏饼图
export function hidePie(currentTab) {
    switch(currentTab) {
        case '全部': 
            companyMarkers.forEach(cMarker=> {
                cMarker.hide()
            })
            break
        case '消防车': 
            firetruckMarkers.forEach(fMarker=> {
                fMarker.hide()
            })
            break   
        default:
            [...companyMarkers, ...firetruckMarkers].forEach(marker=> {
                marker.hide()
            })     
    }
}

// 显示饼图
export function showPie(currentTab) {
    switch(currentTab) {
        case '全部': 
            companyMarkers.forEach(cMarker=> {
                cMarker.show()
            })
            break
        case '消防车': 
            firetruckMarkers.forEach(fMarker=> {
                fMarker.show()
            })
            break   
        default:
            [...companyMarkers, ...firetruckMarkers].forEach(marker=> {
                marker.show()
            })     
    }
}

// 外部获取Markers
export function getPieMarkers(tags) {
    if(tags == '全部') return companyMarkers
    else if (tags == '消防车') return firetruckMarkers
    else return [...companyMarkers, ...firetruckMarkers]
}

//@ts-check
/**
 * @description 计算传入的marker数组，若marker长度大于2，返回几个marker中最优经纬度展示点(即距离其他几个点直线距离和最近的一个点)
 * @param {Array<any>} markers 
 * @returns { { Q: number, R: number, lat: number, lng: number } }
 */
export function caculateMarkerRange(markers) {
    const rangeQueue = []
    if(markers.length > 2) {
        markers.forEach((mk, index)=> {
            markers.forEach(mk_2=> {
                rangeQueue[index] = Array.isArray(rangeQueue[index])?rangeQueue[index]:[]
                rangeQueue[index].push(mk.getPosition().distance(mk_2.getPosition()))
            })
        })
        const allPointDis = rangeQueue.map(range=> {
            return range.reduce((prev, next)=> {
                return prev + next
            }, 0)
        }), targetIndex = allPointDis.indexOf(
            Math.min.call(...allPointDis)
        )
        return markers[targetIndex].getPosition()
    } else {
        return markers[0].getPosition()
    }
}