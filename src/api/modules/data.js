export default {
    auth: {
        url: '/safety/user/auth',
        noToken: true
    },
    // 管理员列表
    adminUserList: {
        url: '/safety/user/admin-list'
    },
    // 用户信息
    adminInfo: {
        url: '/safety/user/admins/{adminId}'
    },
    // 所有联系人列表
    allUserList: {
        url: '/safety/user/admin-list-all'
    },
    // 枚举值
    enums: {
        url: "/safety/comm/enums"
    },
    //统计数据
    countData: {
        url: '/safety/app/zf/count/{dateTime}/{stat}'
    },
    //企业列表
    safeCompanyList: {
        url: '/safety/app/zf/companys/{dateTime}/{type}/{stat}'
    },
    // 设备上报维护
    devReport: {
        url: '/safety/device/repair/save'
    },
    // 设备维护记录列表
    devReportRecords: {
        url: '/safety/device/repair/list'
    },
    //环卫工人列表
    workerList: {
        url: '/safety/sanitation/worker/list'
    },
    // 环卫工人历史轨迹
    workerHistoryTrack: {
        url: '/safety/sanitation/worker/old/{workerCardId}'
    },
    // 工单统计
    workOrderStatistics: {
        url: "/safety/sanitation/stats/order"
    },
    // 环卫摄像头列表
    cameraList: {
        url: "/safety/sanitation/devices/list"
    },
    // 点位联系人列表(通过摄像头ID进行查询)
    adminList: {
        url: "/safety/sanitation/admin-list"
    },
    // 派单列表（通过点位ID查询）
    dispatchList: {
        url: "/safety/sanitation/order/list"
    },
    // 环卫工人电子围栏信息
    historicalTrack: {
        url: "/safety/sanitation/rail/get"
    },
    // 环卫点位工单更新
    workOrderUpdate: {
        url: "/safety/sanitation/order/update"
    },
    // 派单
    dispatchOrder: {
        url: "/safety/sanitation/order/save"
    },
    // 上一周期的企业台账填写详情
    lcdetail: {
        url: '/safety/ledger/lcdetail/{companyNo}/{dateTime}'
    },
    // 台账记录列表
    ledgerRecordList: {
        url: '/safety/ledger/report-record-list'
    },
    // 台账记录
    ledgerRecord: {
        url: '/safety/ledger/dealr/detail/{lcdrid}'
    },
    // 企业报警联系人列表
    companyContactPerson: {
        url: '/safety/msg/safety-contacts'
    },
    // 手动报警发送通知
    sendWarnMsg: {
        url: '/safety/company/fire-alarm'
    },
    // 监控视频
    articleList: {
        url: ''
    },
    // 厂房
    factoryList: {
        url: '/safety/company/get-factorys/{companyNo}'
    },
    //物联设备列表
    devList: {
        url: '/safety/company/list/videoDevice'
    },
    // 天气
    weather: {
        url: '/safety/comm/weather/{city}'
    },
    
    dealLedger: {
        url: "/safety/ledger/dealr/deal"
    },
    // 流动人口
    flowPeople: {
        url: "/safety/govern/people/flowPeople/list"
    },
    // 设控人员
    peopleMonitoring: {
        url: "/safety/govern/people/peopleMonitoring/list"
    },
    // 通知列表
    notify: {
        url: "/safety/govern/notify/list"
    },
    // 公安发送公告到所有企业，政府人员
    notifySend: {
        url: "/safety/govern/notify/send"
    },
    // 获取治安监控摄像头列表
    siteDevices: {
        url: '/safety/govern/site/devices/list'
    },
    // 
    site: {
        url: "/safety/govern/site/list"
    },
    // 消防车列表
    firetruckList: {
        url: '/gpsInfo/gpsdev/list'
    },
    // 消防车历史轨迹列表
    firetruckTrack: {
        url: '/gpsInfo/gps-local/list'
    },
    // 分表计电
    // 今日电量详情
    voltameterToday: {
        url: '/api/safety/elect/v1.0/voltameter-today'
    },
    // 获取当前区域状态
    monStatCount: {
        url: '/api/safety/elect/v1.0/mon-stat-count'
    },
    //违规统计
    electViolations: {
        url: '/api/safety/elect/v1.0/violations'
    },
    //违规列表
    violationCount: {
        url: '/api/safety/elect/v1.0/violation-count'
    },
    //企业电量
    voltameter: {
        url: '/api/safety/elect/v1.0/voltameter'
    },
    //企业电量列表
    electric: {
        url: '/api/safety/elect/v1.0/electric'
    },
    // 企业列表
    companyList: {
        url: '/api/safety/elect/v1.0/com'
    },
    // 企业负责人列表
    companyManagerList: {
        url: '/safety/company/admins'
    },
    // 企业告警未告警统计
    companyCountAlarm: {
        url: '/safety/company/count/alarm'
    },
    // 消防车在线离线统计
    firetruckCountAlarm: {
        url: '/gpsInfo/gpsdev/count'
    },
    //新增设控人员信息
    addPeopleMonitoring: {
        url: '/safety/govern/people/add/peopleMonitoring'
    },

    // 分表计电 已处理企业信息
    violationHasdel: {
        url: '/api/safety/elect/v1.0/violation/hasdel'
    },

    // 统计流动人口
    flowPeopleCount: {
        url: '/safety/govern/people/flowPeople/count'
    },

    // 分表计电处理违规
    violationHandle: {
        url: '/api/safety/elect/v1.0/com/{companyId}/violation'
    },
    // 文件上传
    fileUpload: {
        url: '/safety/file/upfile'
    },

    // 摄像头状态统计
    statsDevice: {
        url: '/safety/sanitation/stats/device'
    },
    // 环卫整体统计
    statusAll: {
        url: '/safety/sanitation/status/all'
    }
}