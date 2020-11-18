<template>
    <div class="login-page">
        <div class="login-card">
            <div class="title">智慧东段数据平台指挥中心</div>
            <el-form ref="form" :model="form">
                <el-form-item label="账号">
                    <el-input v-model="form.adminId" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input 
                        @keydown.enter="login()"
                        v-model="form.password" 
                        type="password" 
                        clearable
                        :show-password="true"
                        name="password"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <div class="remember-password">
                        <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
                    </div>
                </el-form-item>
            </el-form>
            <audio :src="require('@/assets/mp3/alarm.mp3')" ref="audio" loop/>
            <div class="login-button mt32">
                <el-button @click="login" v-loading="loading">登录</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { grain } from '@/utils/canvas-grain.js'
import dayjs from 'dayjs'
import md5 from 'js-md5'
import qs from 'qs'

export default {
    name: "LoginPage",
    data() {
        return {
            loading: false,
            rememberMe: true,
            token: '',
            form: {
                adminId: '',
                password: ''
            }
        }
    },
    created() {
        grain()
        if(sessionStorage.getItem('auth-info')) {
            this.form.adminId = JSON.parse(sessionStorage.getItem('auth-info'))[0]
            this.form.password = JSON.parse(sessionStorage.getItem('auth-info'))[1]
        }
    },
    beforeDestroy() {
        document.body.removeChild(document.querySelector('#dynamic-grain'))
    },
    methods: {
        async login() {
            if(!this.form.adminId || !this.form.password) {
                this.$message.error('请将用户名与密码填写完整！')
                return
            }
            this.$refs['audio'].play()
            this.$refs['audio'].pause()
            this.loading = true
            const res = await this.$http.reqApi('data', 'auth', {
                "adminId": this.form.adminId,
                "auth": md5(md5(this.form.adminId)+md5(this.form.password)+md5(dayjs().format('YYYYMMDDHHmmss'))),
                "ts": dayjs().format('YYYYMMDDHHmmss'),
                "role": "1"
            }, 'post')
            if(!res.error) {
                this.$setState('user', 'token', res.token)
                localStorage.setItem('token', res.token)
                await this.getPower()
                // this.$emit('on-login-success', res.token)
                this.$router.push('/screen/home')
            } else {
                console.warn(res)
                this.loading = false
                this.$message.error(res.error.response.data.message)
            }
        },
        async getPower() {
            const res = await this.$http.reqApi('data', 'adminInfo', {}, 'get', { adminId: this.form.adminId })
            this.loading = false
            if(!res.error){
                this.$setState('user','userId',this.form.adminId)
                localStorage.setItem('user',JSON.stringify(res))
                // 权限存储
                sessionStorage.setItem('power', JSON.stringify(res.powers.map(power=> { return power.powerId })))
                sessionStorage.setItem('auth-info', JSON.stringify([this.form.adminId, this.form.password]))
            }
        }
    }
}

</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.login-page {
    background-image: url('~@/assets/img/bg.jpg');
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .login-card {
        .br(10px);
        .shadow-light;
        .pr;
        z-index: 999;
        padding: 32px 24px;
        width: 35vw;
        margin: 0 auto;
        top: 25vh;
        &:after {
            content: "";
            background-color: rgba(255,255,255,0.5);
            .pa;
            .db;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            filter: blur(10px);
        }
        .remember-password {
            .flex(row, flex-end);
        }
        .title {
            font-size: 1.6em;
            text-align: center;
            .pb10;
        }
        .login-button {
            text-align: center;
            > * {
                width: 40%;
            }
        }
    }
}
</style>