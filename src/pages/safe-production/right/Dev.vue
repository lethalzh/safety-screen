<template>
	<div class="body" v-loading="loading">
		<div class="head">
		<div class="n">
			<span>物联设备列表</span>
			<img src="@/assets/img/yellowMore.png" alt />
		</div>
		<div class="n select">
			<div class="title" @click="selectShow=!selectShow" ref="title">{{ title?title:(companyList[0]&&companyList[chooseCompanyIndex].companyName) }} <i :class="selectShow ? 'el-icon-caret-top':'el-icon-caret-bottom'"></i></div>
			<div class="companyList" v-show="selectShow">
				<div
					class="item"
					v-for="(item, index) in companyList"
					:key="item && item.companyNo"
					@click="selectToggle(item, index)"
				>{{ item && item.companyName }}</div>
			</div>
		</div>
		</div>
		<div class="nav">
			<div
				:class="{active: currentIndex === index}"
				v-for="(i,index) in nav"
				:key="i.name"
				@click="navClick(index)"
			>{{i.name}}</div>
		</div>
		<div class="dev-list" element-loading-background="rgba(0,0,0,0)" v-loading="listLoading">
			<div v-if="!devs.length" class="no-data">没有数据</div>
			<div v-if="devs.length && !devs.filter(dev=> dev.type == nav[currentIndex].type).length" class="no-data">没有数据</div>
			<div v-show="devs.filter(dev=> dev.type == nav[currentIndex].type).length" class="factory-item" v-for="item in devs.filter(dev=> dev.type == nav[currentIndex].type)" style="cursor: pointer" :key="item.factoryId" >
				<div style="margin: 10px 0;display: flex; justify-content: space-between" @click="item.show = !item.show">
					<span style="font-size: 14px">{{ item.name }}</span>
					<span><i :class="item.show?'el-icon-caret-top':'el-icon-caret-bottom'"></i></span>
				</div>
				<div class="collapse" v-if="item.show">
					<div v-if="!item.factoryDevs.length">没有设备</div>
					<div class="listItem" style="margin-bottom: 8px" v-for="(row,index) in item.factoryDevs" :key="index">
						<div class="left">
							<div>{{ row.deviceName || '-'}}</div>
							<div>{{ row.lastCheckTime ? $dayjs(row.lastCheckTime).format('YYYY.MM.DD HH:mm:ss') : '-' }}</div>
							<el-button type="primary" size="mini" @click="reportVisible = true; currentCheck = { ...row, companyName: companyList[chooseCompanyIndex].companyName }">设备上报</el-button>
							<el-button type="danger" size="mini" plain @click="$bus.$emit('show-dev-report', row.deviceId)">上报记录</el-button>
						</div>
						<div class="right">
							<img :src="formatIcon(row)" alt />
						</div>
					</div>
				</div>
			</div>
		</div>
		<DevReport :visible.sync="reportVisible" :current="currentCheck"/>
	</div>
</template>

<script>
import { deepClone } from "@/utils";
import fireZC from "@/assets/img/fireZC.png";
import dev0 from "@/assets/img/dev0.png";
import dev2 from "@/assets/img/dev2.png";
import dev3 from "@/assets/img/dev3.png";
import fireAlarm from "@/assets/img/fireAlarm.png";
import DevReport from './DevReport'
export default {
	name: "Screen",
	props: {
		companyList: {
			type: Array,
			default: ()=> []
		}
	},
	components: { DevReport },
	data() {
		return {
			title: '',
			loading: false,
			reportVisible: false,
			listLoading: true,
			currentCheck: {},
			nav: [{ name: "库房", type: 1 }, { name: "车间", type: 2 }],
			currentIndex: 0,
			selectShow: false,
			lists: [],
			// itemlist:[],
			itemlist: {},
			devs: [],
			chooseCompanyIndex: 0
		};
	},
	watch: {
		companyList: {
			handler(newValue, oldValue) {
				if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
					this.getDevList(this.companyList[this.chooseCompanyIndex])
				}
			},
			immediate: true
		}
	},
	created() {},
	mounted() {
		this.$bus.$on("map-choose-company", param => {
			this.selectToggle(param.company, this.companyList.findIndex(comp=> comp.companyNo == param.company.companyNo) || 0)
		})
	},
	beforeDestroy() {},
	methods: {
		formatIcon(device) {
			const iconMap = {
				0: 3,
				1: 0,
				2: 2,
				3: 1
			}
			var dtype = this.$getState("dict", "devTypeIcon"),
				icon = null
			Object.keys(dtype).forEach(key=> {
				if(key == device.deviceType) {
					icon = dtype[key]
				}
			})
			if(icon){
				return `http://${this.$getState("api", "baseUrl")}/static${icon.split(',')[iconMap[device.deviceStat]]}`
			}else{
				return ''
			}
		},
		navClick(index) {
			this.currentIndex = index;
		},
		async getDevList(company = {}) {
			var res = await this.$http.reqApi(
				"data",
				"factoryList",
				{pageNum:1,pageSize:1000}, 'get', { companyNo: company.companyNo || this.companyList[0] && this.companyList[0].companyNo }
			);
			this.listLoading = false
			if(Array.isArray(res.rows)) {
				this.devs = res.rows.map(_res=> {
					return {
						..._res,
						show: false
					}
				});
				setTimeout(()=> {
					this.navClick(this.currentIndex)
				})
			} else this.devs = []
		},
		selectToggle(company, index){
			this.chooseCompanyIndex = index
			this.$nextTick(()=> {
				this.title = company.companyName
			})
			this.selectShow = false;
			this.getDevList(company)
		}
	}
};
</script>
<style lang="less" scoped>
	@import (reference) "~@/assets/css/common.less";
	.body {
		.pr;
		height: 35%;
		.pt24;
		overflow-y: hidden;
		.no-data {
			color: @base-font-color;
			text-align: center;
			.pt10;
		}
		.head {
			display: flex;
			justify-content: space-between;
			.n {
				color: @base-font-color;
				z-index: 1;
				.pr;
				&:nth-child(1):after {
					content: "";
					width: 30px;
					height: 2px;
					background: @theme-color;
					margin-top: 2px;
					.db;
					.pa;
				}
				span {
					margin-right: 8px;
				}
			}
			.select {
				position: relative;
				z-index: 99;
				.title {
					text-align: right;
					cursor: pointer;
				}
				.companyList {
					max-height: 200px;
					overflow-y: scroll;
					position: absolute;
					right: 2px;
					top: 24px;
					// .theme-color-6;
					background: @background;
					// .shadow-light;
					box-shadow:#cecece 0px 0px 10px;
					color: @base-font-color;
					border-radius: 5px;
					padding: 6px;
					// height: 100%;
					width: 200px;
					cursor: pointer;
					&::-webkit-scrollbar {
						display: none;
					}
					.item {
						margin-bottom: 8px;
						.word-ellipsis;
						cursor: pointer;
						&:hover {
							.theme-color-8;
							// background: @background;
						}
					}
				}
			}
		}
		.nav {
			.flex(row, space-between);
			margin-top: 8px;
			> div {
				cursor: pointer;
				color: @theme-color-second;
				z-index: 1;
				width: 48%;
				text-align: center;
				border: 1px solid @theme-color-second;
				padding: 6px 0;
			}
			.active {
				.theme-color-10;
			}
		}
		.dev-list {
			overflow-y: scroll;
			&::-webkit-scrollbar {
				display: none;
			}
		
			height: ~"calc(100% - 60px)";
			.factory-item {
				color: @base-font-color;
			}
			.listItem {
				height: ~"calc((100% - 60px) * 0.25)";
				.fb-left;
				width: 100%;
				z-index: 2;
				.pr;
				div {
					color: @base-font-color;
				}
				.left {
					.fb-box-flex(1);
				}
				.right {
					.pl10;
					img {
					width: 20px;
					}
				}
			}
		}
	}
</style>
