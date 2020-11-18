<template functional>
    <div class="info-window normal">
        <div class="info info-right" >
            <div>
                <slot/>
                <div class="cheader">企业：{{ props.monitor.companyName || '' }}</div>
                <div class="cheader">设备名：{{ props.monitor.deviceName || '' }}</div>
            </div>
        </div>
        <div class="circle"></div>
    </div>
</template>

<style lang="less" scoped>
@import url('./mixin.less');
</style>