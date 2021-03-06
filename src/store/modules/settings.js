export default {
	mock:false,
	pageSize:6,
	tokenExpire: 24 * 60 * 60 * 1000,
	regionId: 131081204000,
	electricType: 1,
	// 安全生产消防告警时间阈值
	fireAlarmExpire: 0,
	// 主页详情 key用来切换背景图 icon为本地图片 png文件
	homeList: [
		{
			key: 'safe',
			name:'安全生产',
			icon:'safe-home',
			content:'从消防物联设备、台账、视频监控等方面着手，对企业生产安全进行把控和监督，及时处理潜在问题，防患于未然。',
			list: ['安全生产监控数据','台账风险控制项填报情况','企业实时视频监控','实时告警列表','GIS地图跟踪','消防物联设备列表','消防安全制度']
		},
		{
			key: 'env',
			name:'环卫监管',
			icon:'environmental-home',
			content:'利用电子工牌、在线派单系统将线上线下环卫工作联通。通过环卫摄像头的实时画面及时反馈环卫处理成果，缩短环卫管理中间时间。',
			list: ['环卫工人在线数据','环卫摄像头实时监控','环卫工人历史轨迹','电子围栏管控','在线派单监督','一键联络']
		},
		{
			key: 'ele',
			name:'分表计电',
			icon: 'electric-home',
			content:'对企业生产设备、治污设备进行用电监控，利用用电数据及相关数据比例对企业整体状态进行自动判定，监测企业运行状态的变化。',
			list: ['企业生产运行图','用电记录','违规企业']
		},
		{
			key: 'syn',
			name:'综合治理',
			icon:'synthesize-home',
			content:'分析企业上报的人员数据，利用预填报的管控人员数据进行比对、自动触发警告。同时通过对综合摄像头进行人脸识别，高效实现特殊人群管理。',
			list: ['政民联动','在线管控管控人员列表','流动人口图表','通知公告','综合监控摄像头']
		},
	]
}