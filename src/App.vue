<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import md5 from 'js-md5'
export default {
    name: "App",
    data() {
        return {
            
        }
    },
    methods: {
        // testTokenExpire() {
        //     if(localStorage.getItem('token') && localStorage.getItem('token').split('|')[1]) {
        //         var user = JSON.parse(localStorage.getItem('user'))
        //         if(user){
        //             this.$setState('user','userId',user.adminId)
        //         }
        //         return Date.now() - localStorage.getItem('token').split('|')[1] < this._settings.tokenExpire
        //     }
        //     return false
        // }
    }
};
</script>

<style lang="less">
@import (reference) "./assets/css/common.less";
* {
    font-size: 12px;
}
div {
    box-sizing: border-box;
}
</style>
