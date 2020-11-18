<template>
	<div class="deal-ledger-alarm-box mt16" :class="{ 'as-component': asComponent, 'give-background': !asComponent }">
		<div class="title" v-if="!asComponent">
			<span>台账处理 {{ company.companyName }}</span>
			<div class="close-button" @click="$emit('close')">X</div>
		</div>
		<div class="ledger-container" v-loading="loading">
			<template v-for="(ltype,index) in ledgerType">
				<div
					class="ledger-type"
                    :style="asComponent?'background: rgba(0,0,0,0) !important; border: 1px solid #000':''"
					:key="index"
					v-if="ltype.ledgerItemList&&ltype.ledgerItemList.length"
				>
					<div class="title">{{$getState('dict','ledgerType')[ltype.type]}}</div>
					<div class="right">
						<div
							class="ledger-item"
							v-for="(ledgerItem,i2) in ltype.ledgerItemList"
							:key="i2"
						>
							<div class="l">{{ledgerItem.content}}</div>
							<div class="r">未提交</div>
						</div>
					</div>
				</div>
			</template>
		</div>
		<div class="sub" v-if="!readonly">
			<div class="opts">
				<div
					class="opt"
					:class="{sel:currentOpt==ii}"
					@click="currentOpt=ii"
					v-for="(i, ii) in $getState('dict', 'ledgerDealWay')"
					:key="ii"
				>{{i}}</div>
			</div>
			<div class="subtn" :class="{ dis:currentOpt === null }" @click="sub" v-loading="subLoading">提交处理</div>
		</div>
	</div>
</template>

<script>
import WinBox from "@/components/WinBox";
import dayjs from "dayjs";
export default {
    props: {
		company: {
			type: Object,
			default: ()=> {}
		},
		asComponent: {
			type: Boolean,
			default: false
        },
        readonly: {
            type: Boolean,
			default: false
        }
	},
    components: { WinBox },
    data() {
        return {
			subLoading: false,
            loading: true,
            ledgerType: {},
            currentOpt: null,
        };
    },
    async mounted() {
        this.loading = true;
        var res = await this.$http.reqApi("data", "lcdetail", {}, "get", {
            companyNo: this.company.companyNo,
            dateTime: dayjs().format("YYYYMMDDHHmmss"),
        });
        this.loading = false;
        if (res && res.rows) {
            res.rows.forEach((t) => {
                t.ledgerItemList &&
                    (t.ledgerItemList = t.ledgerItemList.filter((d) => {
                        return d.stat == 1;
                    }));
            });
            this.ledgerType = res.rows;
        }
    },
    methods: {
        async sub() {
            if (this.currentOpt === null) {
                this.$message.warning("请先选择处理方式");
                return;
            }
            this.subLoading = true;
            var items = [];
            this.ledgerType.forEach((item) => {
                item.ledgerItemList.forEach((m) => {
                    items.push([String(m.id), m.cycleKey, String(m.type)]);
                });
            });
            const res = await this.$http.reqApi(
                "data",
                "dealLedger",
                {
                    companyNo: this.company.companyNo,
                    dwid: +this.currentOpt,
                    ledgerItems: items,
                },
                "post"
            );
            this.subLoading = false;
            if (!res.error) {
                this.$set(this.company, "ledgerStat", 2);
                this.$message.success("处理成功");
                this.$emit('on-deal-success', true)
                setTimeout(() => {
                    if(!this.asComponent)
                        this.$bus.$emit("close-deal-ledger-alarm-win");
                }, 1000);
            } else {
                this.$message.error("处理失败", res.error);
            }
        },
    },
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.as-component {
	padding: 0 !important;
	border: none !important;
}
.give-background {
    background: @background;
    .shadow-light;
}
.deal-ledger-alarm-box {
	.p16;
	// border: 1px solid @theme-color;
	.pr;
	.title {
		.mb16;
		.flex(row, space-between);
		span {
			font-size: 18px;
			margin-right: 64px;
		}
		.close-button {
			border-radius: 50%;
			background: @theme-color;
			width: 24px;
			height: 24px;
			.flex(row, center);
			cursor: pointer;
			color: #fff;
		}
	}
    .ledger-container {
        height: ~"calc(70vh - 60px - 130px)";
        overflow-y: auto;
        &::-webkit-scrollbar {
            display: none;
        }

        .ledger-type {
            .mb16;
			// background: rgba(27, 255, 228, 0.2);
			.warn-color-2;
            border-radius: 5px;
            width: 100%;
            .fb-left-top;
            .title {
                .p10;
                font-size: 15px;
                color: @base-font-color;
            }
            .right {
                border-left: 2px solid #2b5954;
                .fb-box-flex(1);
                .ledger-item {
                    .p10;
					color: @base-font-color;
                    .fb-left-top;
                    .l {
                        .fb-box-flex(1);
                        .pr10;
                    }
                    .r {
                        .tr;
                    }
                }
            }
        }
    }
    .sub {
        width: 100%;
        height: 100px;
        bottom: 0px;
        left: 0px;
        .pt10;
        .fb-left-top;
        .opts {
            .fb-box-flex(1);
            .opt {
                .dib;
                .mr16;
                width: ~"calc(25% - 16px)";
				cursor: pointer;
                z-index: 1;
                border-radius: 5px;
                text-align: center;
                border: 1px solid @theme-color;
                padding: 6px 0;
                &.sel {
                    background:@theme-color;
                    color:#fff;
                }
            }
        }
        .subtn {
            cursor: pointer;
            height: 90px;
            width: 90px;
            border-radius: 5px;
            color: #fff;
            font-size: 15px;
            .fb-center;
            background: @theme-color;
            font-size: 15px;
            .fb;
            border-radius: 5px;
            &.dis {
                color: #fff;
				background: #cecece;
				cursor:not-allowed;
            }
        }
    }
}
</style>
