<template>
    <div class="body" v-loading="loading">
        <div class="header">
            <div class="left">
                <div
                    v-for="(i,index) in nav"
                    :key="index"
                    class="btn"
                    :class="{active: nav.indexOf(_currentTab) === index}"
                    @click="navClick(index)"
                >{{i}}</div>
            </div>
            <div class="right">
                <input
                    class="select-input"
                    slot="reference"
                    @input="onSearch"
                    @focus="showSelect = true"
                    @blur="onBlur"
                    type="text"
                    style="padding-left: 10px"
                    v-model="searchValue"
                />
                <div class="select-frame" v-show="showSelect" :style="{ width }">
                    <div
                        v-if="!searchValue"
                        style="width: 100%; text-align: center; padding: 10px; color: #ffffff"
                    >请输入内容进行搜索</div>
                    <div class="result" v-else>
                        <div
                            class="camera-result"
                            v-if="currentTab == '环卫工人' || currentTab == '全部'"
                        >
                            <div class="result-title">符合关键词的环卫工人</div>
                            <div class="no-data" v-if="!filterUserList.length">
                                环卫工人下没有符合关键词
                                <span style="color: red">{{ searchValue }}</span>的结果
                            </div>
                            <div
                                class="result-item"
                                @click="$emit('search', '工人', item, searchValue)"
                                v-for="(item, index) in filterUserList"
                                :key="item.name + index"
                            >{{item.name}}</div>
                        </div>

                        <div class="camera-result" v-if="currentTab == '全部' || currentTab == '摄像头'">
                            <div class="result-title">符合关键词的摄像头</div>
                            <div class="no-data" v-if="!filterMonitorList.length">
                                摄像头下没有符合关键词
                                <span style="color: red">{{ searchValue }}</span>的结果
                            </div>
                            <div
                                class="result-item"
                                @click="$emit('search', '摄像头', item, searchValue)"
                                v-for="(item, index) in filterMonitorList"
                                :key="item.sanitationName + index"
                            >{{item.sanitationName}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import md5 from "js-md5"
export default {
    // name: "Screen",
    // components:{search},
    props: {
        currentTab: {
            type: String,
        },
    },
    model: {
        prop: "currentTab",
        event: "update",
    },
    computed: {
        _currentTab: {
            get() {
                return this.currentTab
            },
            set(value) {
                this.$emit("update", value)
            },
        },
    },
    data() {
        return {
            loading: false,
            nav: ["全部", "环卫工人", "摄像头"],
            searchValue: "",
            showSelect: false,
            width: 0,
            filterUserList: [],
            filterMonitorList: [],
        }
    },
    watch: {},

    created() {},
    mounted() {
        this.width = document.querySelector(".select-input").offsetWidth + "px"
    },
    beforeDestroy() {},
    methods: {
        onBlur() {
            setTimeout(() => {
                this.showSelect = false
            }, 500)
        },
        navClick(index) {
            this._currentTab = this.nav[index]
        },
        onSearch() {
            this.filterUserList = this.$parent.workerListNew.filter((user) => {
                return user.name.includes(this.searchValue.trim())
            })
            this.filterMonitorList = this.$parent.monitorList.filter(
                (monitor) => {
                    return monitor.deviceName.includes(this.searchValue.trim())
                }
            )
        },
    },
}
</script>

<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";

.header {
    .pr;
    width: 100%;
    z-index: 11;
    display: flex;
    align-items: center;
    .left {
        display: flex;
        justify-content: space-between;
        width: 40%;
        > div {
            cursor: pointer;
            color: @theme-color-second;
            z-index: 1;
            width: 30%;
            border-radius: 5px;
            text-align: center;
            border: 1px solid @theme-color-second;
            padding: 6px 0;
        }
        .active {
            .theme-color-10;
        }
    }
    .right {
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-self: stretch;
        margin-left: 1.6rem;
        input {
            width: 100%;
            background: none;
            outline: none;
            border: 1px solid @theme-color-second;
            border-radius: 5px;
            color: @base-font-color;
            font-size: 1rem;
	        background: @background;
        }
    }
    .btn {
        border-color: @theme-color;
	    background: @background;
        &:active {
            background: #cecece;
        }
    }
    .select-frame {
        height: 300px;
        border-radius: 10px;
        border: 1px solid #ffffff;
        .theme-color-6;
        .pa;
        top: 40px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    .result {
        > div {
            .p10;
            color: #ffffff;
            .result-title {
                font-size: 14px;
            }
        }
        .result-item {
            cursor: pointer;
            .pt5;
            .pb5;
            &:hover {
                background: rgba(42, 42, 42, 0.5);
            }
        }
    }
}
</style>