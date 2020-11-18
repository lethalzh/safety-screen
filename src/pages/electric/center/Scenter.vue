<template>
    <div class="electric-center">
        <div class="electric-center-content">
            <safe-map ref="map" />
        </div>
    </div>
</template>

<script>
import SafeMap from '../Map'

export default {
    // inject: ['AMap'],
    components: {
        SafeMap,
    },
}
</script>
<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
</style>
