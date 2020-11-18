<template>
    <div>
        <win-box title="视频监控" title-color="#000" closeEvent="close-camera-more-win">
            <div class="boxs">
				<template v-for="c in companyList">
					<div
						class="company"
						:key="c.companyNo"
						v-if="companyCameraMap[c.companyNo]"
					>
						<div class="bg"></div>
						<div class="b">
							<div class="title">
								<span>{{c.companyName}}</span>
								<span>{{c.addr}}</span>
							</div>
							<div class="camera-list">
								<div class="no-data" v-if="!companyCameraMap[c.companyNo].length">该企业没有监控设备</div>
								<div
									class="camera"
									v-for="(camera,cIdx) in companyCameraMap[c.companyNo]"
									:key="camera.deviceId"
								>
									<img
										:src="!camera.coverAddr?'https://vjs.zencdn.net/v/oceans.png':(camera.coverAddr.indexOf('http://') != -1?camera.coverAddr:('http://'+$getState(
                    'api','baseUrl')+'/safety/file/downFile/'+camera.coverAddr))"
										@click="$refs.videoLive.show(companyCameraMap[c.companyNo]); cameraClick({index: cIdx,cs:companyCameraMap[c.companyNo]})"
									/>
                                    <div style="font-size:12px;">{{camera.deviceId}}</div>
								</div>
							</div>
						</div>
					</div>
				</template>
            </div>
        </win-box>

		<video-live
            ref="videoLive"
            :dialog="true"
            :stylewh="{width: '100%',height: '400px', dwidth: 'calc(60vw + 32px)'}"
            pic="//vjs.zencdn.net/v/oceans.png"
        >
		</video-live>
    </div>
</template>

<script>
import WinBox from "@/components/WinBox"
import VideoLive from '@/components/VideoLive'
export default {
    props: ["companyList", "companyCameraMap"],
    components: { WinBox, VideoLive },
    data() {
        return {
            loading: false,
            lists: [],
        };
    },
    methods: {
        cameraClick(e) {
            // this.$bus.$emit("close-map-hint");
            // this.$bus.$emit("close-alarm-more-win");
            // this.$bus.$emit("close-camera-more-win");
            // this.$bus.$emit("close-deal-ledger-alarm-win");
            // this.$bus.$emit("lives-addr", e);
        },
    },
};
</script>
<style lang="less" scoped>
	@import (reference) "~@/assets/css/common.less";
	.boxs {
		.flex(row, space-between);
		width: 100%;
        .company {
            .mb16;
            width: ~"calc(50% - 8px)";
            .pr;
            border-radius: 5px;
            .bg {
                border-radius: 5px;
                width: 100%;
                height: 100%;
                .pa;
                top: 0px;
                left: 0px;
                .theme-color-8;
                z-index: 1;
            }
            .b {
                z-index: 2;
                .pr;
				.p16;
                .title {
                    color: @base-font-color;
                    border-bottom: 1px solid #25635b;
					.p10;
					.flex(row, space-between);
					span:first-child {
						font-size: 16px;
					}
                }
                .camera-list {
					// height: ~"calc((((100vw - (12vw + 22vw + 24px + 24px + 40px + 32px)) * 0.5 - 10px) * 0.5 - 10px) * 0.559)";
					height: calc(12vh + 10px);
					overflow-y: auto;
					&::-webkit-scrollbar {
						/*滚动条整体样式*/
						width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
						height: 1px;
						opacity: .5;
					}
					&::-webkit-scrollbar-thumb {
						/*滚动条里面小方块*/
						border-radius: 10px;
						background: rgba(42, 42, 42, 0.7);
					}
					&::-webkit-scrollbar-track {
						/*滚动条里面轨道*/
						.theme-color-9;
						border-radius: 10px;
					}
                    .clear-fix();
					.mt16;
					.no-data {
                        color: @base-font-color;
						width: 100%;
						.pl10;
					}
                    .camera {
                        cursor: pointer;
                        .fl;
						width: ~"calc(50% - 10px)";
                        // height: ~"calc((((100vw - (12vw + 20px + 20px + 22vw + 24px + 24px + 40px + 32px)) * 0.5 - 10px) * 0.5 - 10px) * 0.559)";
                        overflow: hidden;
                        .pr10;
                        .pb10;
						border-radius: 5px;
                        img {
                            border-radius: 5px;
							width: 100%;
							height: calc(12vh - 26px);
                            &:hover {
                                transform: scale(1.2);
                                transition: all 0.3s;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
