<template>
    <scroll class="listview" :data="data" ref="listview" @scroll="_onScroll" :listenScroll="listenScroll" :probeType="probeType">
            <ul>
                <li class="list-group" v-for="group in data" ref="listGroup">
                    <h2 class="list-group-title">{{group.title}}</h2>
                    <ul>
                        <li class="list-group-item" v-for="item in group.item">
                            <img v-lazy="item.avatar" alt="" class="avatar">
                            <span class="name">{{item.name}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="list-shortcut" @touchstart.prevent.stop="onShotcutTouchStart" @touchmove.prevent.stop="onShotcutTouchMove">
                <ul>
                    <li class="item" v-for="(item,index) in shotcutlist" :data-index="index" :class="{current:currentIndex === index}">{{item}}</li>
                </ul>
            </div>
            <div class="list-fixed" v-show="fixedTitle" ref="fixedTitle">
                <h2 class="fixed-title">{{fixedTitle}}</h2>
            </div>
            <div  class="loading-container" v-show="!data.length">
                <loading></loading>
            </div>
    </scroll>
</template>

<script>
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import { getSingerList } from 'api/singer'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const FIXED_HEIGHT = 30
export default {
    created() {
        this.touch = {}
        this.listenScroll = true
        this.probeType = 3
        this.listHeight = []
    },
    data() {
        return {
            scrollY: -1,
            currentIndex: 0,
            diff: -1
        }
    },
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    components: {
        scroll,
        loading
    },
    methods: {
        // 点击
        onShotcutTouchStart(e) {
            let anchorIndex = getData(e.target, 'index')
            this.touch.first = e.touches[0].pageY
            this.touch.anchorIndex = anchorIndex
            this._scrollTo(anchorIndex)
            console.log(this.currentIndex);
        },
        // 拖动
        onShotcutTouchMove(e) {
            this.touch.second = e.touches[0].pageY
            let delta = (this.touch.second - this.touch.first) / ANCHOR_HEIGHT | 0
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta
            this._scrollTo(anchorIndex)

        },
        _scrollTo(index) {
            if (!index && index !== 0) {
                return
            }
            if (index < 0) {
                index = 0
            } else if (index > this.listHeight.length - 2) {
                index = this.listHeight.length - 2
            }
            this.scrollY = -this.listHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 200)
        },
        _onScroll(pos) {
            this.scrollY = pos.y
        },
        _calculateHeight() {
            this.listHeight = []
            let height = 0
            this.listHeight.push(height)
            const list = this.$refs.listGroup
            for (let i = 0; i < list.length; i++) {
                height += list[i].clientHeight
                this.listHeight.push(height)
            }
        }
    },
    computed: {
        shotcutlist() {
            return this.data.map((group) => {
                return group.title.substring(0, 1)
            })
        },
        fixedTitle() {
            if (this.scrollY > 0) {
                return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            }, 20);
        },
        scrollY(newY) {
            const listHeight = this.listHeight
            if (newY > 0) {
                this.currentIndex = 0
                return
            }
            for (let i = 0; i < listHeight.length - 1; i++) {
                let h1 = listHeight[i]
                let h2 = listHeight[i + 1]
                if (-newY >= h1 && -newY < h2) {
                    this.currentIndex = i
                    this.diff = h2 + newY
                    return
                }
            }
            this.currentIndex = listHeight - 2
        },
        diff(newVal) {
            let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0
            this.$refs.fixedTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
        }
    }
}   
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;

    .list-group {
        padding-bottom: 30px;

        .list-group-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;
        }

        .list-group-item {
            display: flex;
            align-items: center;
            padding: 20px 0 0 30px;

            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }

            .name {
                margin-left: 20px;
                color: $color-text-l;
                font-size: $font-size-medium;
            }
        }
    }

    .list-shortcut {
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 20px 0;
        border-radius: 10px;
        text-align: center;
        background: $color-background-d;
        font-family: Helvetica;

        .item {
            padding: 3px;
            line-height: 1;
            color: $color-text-l;
            font-size: $font-size-small;

            &.current {
                color: $color-theme;
            }
        }
    }

    .list-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;

        .fixed-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;
        }
    }

    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
