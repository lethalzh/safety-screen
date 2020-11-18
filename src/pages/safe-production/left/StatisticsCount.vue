<template>
    <div class="statistics-count" v-loading="loading">
        <div class="cinfo mb10" v-for="cinfo in cinfos" :key="cinfo.title">
            <div class="title">{{cinfo.title}}</div>
            <div class="num">
				 <svg
					width="5vw"
					class="pa"
					style="overflow: visible; z-index: 9999; pointer-events: none; top: 1px; left: 0"
				>
					<line x1="0" y1="0" x2="20%" y2="0" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="0" y1="0" x2="0" y2="10" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="80%" y1="0" x2="100%" y2="0" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="100%" y1="0" x2="100%" y2="10" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="0" y1="33" x2="20%" y2="33" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="0" y1="33" x2="0" y2="23" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="80%" y1="33" x2="100%" y2="33" style="stroke:#12C9B4;stroke-width:2" />
					<line x1="100%" y1="33" x2="100%" y2="23" style="stroke:#12C9B4;stroke-width:2" />
				</svg>
                <i
                    class="pr iconfont"
					style="top: 2.5px"
                    :class="{'icon-shuzi0':num==0,'icon-shuzi1':num==1,'icon-shuzi2':num==2,'icon-shuzi3':num==3,'icon-shuzi4':num==4,'icon-shuzi5':num==5,'icon-shuzi6':num==6,'icon-shuzi7':num==7,'icon-shuzi8':num==8,'icon-shuzi9':num==9}"
                    v-for="(num, index) in (cinfo.num+'').split('')"
                    :key="index"
                ></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["countData"],
    data() {
        return {
            loading: false,
            cinfos: [
                { title: "登记企业数量", num: 0 },
                { title: "正常企业数量", num: 0 },
                { title: "消防告警数量", num: 0 },
                { title: "台账告警数量", num: 0 },
            ],
            dealAllNum: 0,
        };
    },
    watch: {
        countData: {
            handler(val) {
                if (val) {
                    for (var i of this.cinfos) {
                        if (i.title == "登记企业数量") {
                            i.num = val.num;
                        } else if (i.title == "正常企业数量") {
                            i.num = val.num - val.alarmNum;
                        } else if (i.title == "消防告警数量") {
                            var ff = val.alarmTypeCountNums.filter((item) => {
                                return item.type == 4;
                            });
                            i.num = ff[0].num;
                        } else {
                            i.num = val.ledgerAlarmNum || 0;
                        }
                    }
                }
            },
            immediate: true,
            deep: true,
        },
    }
};
</script>
<style lang="less" scoped>
@import "~@/assets/number/iconfont.css";
@import (reference) "~@/assets/css/common.less";
@media screen and (max-width: 1536px){
    .statistics-count {
        height: 22vh;
    }
}
@media screen and (min-width: 1537px){
    .statistics-count {
        height: 16vh;
    }
}
.statistics-count {
	// height: 20vh;
	.mb24;
    overflow-y: hidden;
    z-index: 1;
    .cinfo {
        .flex(row, flex-start, center);
        .title {
            color: @base-font-color;
            .pr16;
        }
        .num {
            .iconfont {
                color: @theme-color-second;
            }
            width: 5vw;
            white-space: nowrap;
            // border: 2px dashed @theme-color;
            .pr;
            padding: 4px 4px;
            .tm;
            white-space: nowrap;
            font-weight: blod;
            font-size: 15px;
            min-width: 5rem;
            color: @base-font-color;
            &:before {
                content: "";
                .pa;
                .db;
                height: 16px;
                width: 100%;
                top: 10px;
                left: -2px;
                // border-left:2px solid ;
                // border-right:2px solid;
            }
            &:after {
                content: "";
                .pa;
                .db;
                height: 100%;
                width: ~"calc(100% - 20px)";
                top: -2px;
                left: 10px;
                // border-top:2px solid #2A2A2A;
                // border-bottom:2px solid #2A2A2A;
            }
            span {
                font-size: 20px;
                height: 25px;
                .dib;
            }
        }
    }
    .t {
        .pt10;
        color: @base-font-color;
    }
}
</style>
