<template>
    <div class="search">
        <div class="button-box">
            <div class="search-box">
                <div class="left">
                    <div
                        v-for="(i,index) in nav"
                        :key="index"
                        class="btn"
                        :class="{active: nav.indexOf(currentTab) === index}"
                        @click="navClick(index)"
                    >{{i}}</div>
                </div>
                <div class="search-input">
                    <input class="input" prefix-icon="iconfont el-icon-search" size="mini" clearable @input="onSearch" @focus="showSelect = true" @blur="onBlur" type="text" v-model="searchValue" />
                    <div class="select-frame" v-show="showSelect" :style="{ width }">
                        <div v-if="!searchValue" style="width: 100%; text-align: center; padding: 10px; color: #ffffff">
                            请输入内容进行搜索
                        </div>
                        <div class="result" v-else>
                            <div class="company-list-result">
                                <div class="result-title">符合关键词的企业</div>
                                <div class="no-data" v-if="!filterCompanyList.length">
                                    企业下没有符合关键词
                                    <span style="color: red">{{ searchValue }}</span>
                                    的结果
                                </div>
                                <div
                                    class="result-item"
                                    @click="
                                        $emit('search', item, searchValue)
                                        searchValue = item.companyName
                                        $refs.moreAlarmRef.show = false
                                    "
                                    v-for="(item, index) in filterCompanyList"
                                    :key="item.companyNo + index"
                                >
                                    {{ item.companyName }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="more-alarm-processing">
                <violation-page ref="moreAlarmRef" @more-show="showMoreFunc" :more-display="showMore" :opt="opt" />
                <violation-handle ref="handleRef" @handle-show="showHandleFunc" :handle-display="showHandle" :company="company" />
            </div>
        </div>
    </div>
</template>

<script>
import ViolationPage from './ViolationPage'
import ViolationHandle from './ViolationHandle'

export default {
    name: 'search',
    components: { ViolationPage, ViolationHandle },
    data() {
        return {
            searchValue: '',
            showSelect: false,
            width: 0,
            filterCompanyList: [],
            currentItem: {},
            showMore: false,
            showHandle: false,
            company: {},
            opt: 'untreated',
            nav: ['有证', '无证'],
            currentTab: '有证'
        }
    },
    created() {
        this.$bus
            .$on('openViolationRank', (item) => {
                this.opt = item
                this.showMore = true
                this.showHandle = false
                this.$emit('search')
            })
            .off(this, 'openViolationRank')
        this.$bus
            .$on('violationHandle', (item) => {
                this.company = item
                this.showHandle = true
                this.showMore = false
                this.$emit('search')
            })
            .off(this, 'violationHandle')
    },
    mounted() {
        this.$setState('settings','electricType',1)
        this.width = document.querySelector('.input').offsetWidth + 'px'
    },
    watch: {
        currentTab(newVal,oldVal){
            if(newVal!=oldVal)  this.$bus.$emit("updateElectricType")
        }
    },
    methods: {
        navClick(index) {
            this.currentTab = this.nav[index]
            this.$setState('settings','electricType',index+1)
        },
        showHandleFunc() {
            this.showHandle = false
        },
        showMoreFunc() {
            this.showMore = false
        },
        onBlur() {
            setTimeout(() => {
                this.showSelect = false
            }, 500)
        },
        onSearch() {
            this.filterCompanyList = this.$parent.companyData.filter((company) => {
                return company.companyName.includes(this.searchValue.trim())
            })
        },

        onReset() {
            this.searchValue = ''
        },
    },
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/css/common.less';
@height: ~'calc(100vh - 20px - 20px - 20px - (100vh - 20px - 20px) * .10)';
@media screen and (max-width: 1536px){
    .search {
        .button-box {
            .search-box {
                .left {
                    > div {
                        padding: 3px 0;
                    }
                }
            }
        }
    }
}
@media screen and (min-width: 1537px){
    .search {
        .button-box {
            .search-box {
                .left {
                    > div {
                        padding: 6px 0;
                    }
                }
            }
        }
    }
}
.search {
    .button-box {
        display: flex;
        flex-direction: column;
        .search-box {
            height: 3vh;
            display: flex;
            .left {
                display: flex;
                justify-content: space-between;
                width: 30%;
                > div {
                    cursor: pointer;
                    color: @theme-color-second;
                    z-index: 1;
                    width: 46%;
                    border-radius: 5px;
                    text-align: center;
                    border: 1px solid @theme-color-second;
                    // padding: 6px 0;
                    background: @background;
                }
                .active {
                    .theme-color-10;
                }
            }
            .search-input {
                .pr;
                z-index: 105;
                margin-left: 20px;
                margin-right: 20px;
                width: 70%;
                display: flex;
                justify-content: space-around;
                align-self: stretch;
                input {
                    padding-left: 10px;
                    z-index: 1;
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
            .select-frame {
                // .pr;
                // z-index: 19;
                height: 300px;
                width: 100%;
                border-radius: 10px;
                border: 1px solid #ffffff;
                .theme-color-6;
                .pa;
                top: 40px;
                left: 0;
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

        .more-alarm-processing {
            z-index: 1;
        }
    }
}
</style>
