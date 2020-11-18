<template functional>
	<div>
		<div class="content fire" v-if="props.companyInfo.devStat == 2">
			<span>当前着火点 : {{ props.companyInfo.companyName || '-' }}</span>
			<span>企业负责人 : {{ props.companyInfo.concatPerson || '-' }}</span>
			<span>地址 : {{ props.companyInfo.addr || '-' }}</span>
		</div>

		<div class="content something-wrong" v-else-if="props.companyInfo.devStat == 8">
			<span>企业 : {{ props.companyInfo.companyName || '-' }}</span>
			<span>当前状态：设备故障</span>
			<span>企业负责人 : {{ props.companyInfo.concatPerson || '-' }}</span>
			<span>地址 : {{ props.companyInfo.addr || '-' }}</span>
		</div>

		<div class="content fire" v-else-if="props.companyInfo.ledgerStat == 1">
			<span >企业：{{ props.companyInfo.companyName || '-'  }} 台账告警中</span>
			<span>企业负责人 : {{ props.companyInfo.concatPerson || '-' }}</span>
			<span>地址 : {{ props.companyInfo.addr || '-' }}</span>
		</div>
		
		<div class="content" v-else-if="props.companyInfo.devStat != 2 && props.companyInfo.devStat != 8 && props.companyInfo.ledgerStat != 1">
			<span>企业 : {{ props.companyInfo.companyName || '-' }}</span>
			<span>企业负责人 : {{ props.companyInfo.concatPerson || '-' }}</span>
			<span>地址 : {{ props.companyInfo.addr || '-' }}</span>
		</div>
	</div>
</template>

<style lang="less" scoped>
	@import (reference) '~@/assets/css/common.less';
	.fire {
		// background: @warn-color !important;
		.warn-color-2 !important;
		color: red !important;
	}
	.something-wrong {
		background: rgba(255,255,0, .5) !important;
		border: 1px solid rgba(255,255,0, 1);
		color: @base-font-color;
	}
	.content{
		.pa;
		bottom: 24px;
		z-index: 11;
		width: calc(100% - 32px);//calc(60vw - 32px);
		border: 1px solid @warn-color;
		border-radius: 5px;
		background-color: rgba(27, 255, 228,0.2);
		color: @base-font-color;
		padding: 12px 16px;
		span{
			font-size: 1.5rem;
			margin-right: 1.5rem;
		}
	}
</style>
