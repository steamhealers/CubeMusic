<template>
    <transition name="slide">
        <musicList :songs="songs" :title="title" :bgImage="bgImage"></musicList>
    </transition>
</template>

<script>
import musicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import Song from 'common/js/song'
import { createSong } from 'common/js/song'
export default {
    created() {
        this._getSingerDetail()
    },
    data() {
        return {
            songs: []
        }
    },
    computed: {
        ...mapGetters({
            singer: 'singerGetter'
        }),
        title(){
            return this.singer.name
        },
        bgImage(){
            return this.singer.avatar
        }
    },
    components:{
        musicList
    },
    methods: {
        _getSingerDetail() {
            if (!this.singer.id) {
                this.$router.push({
                    path: '/singer'
                })
                return
            }
            getSingerDetail(this.singer.id).then(res => {
                if (res.code === ERR_OK) {
                    this.singerDetail = res.data
                    this.songs = this._normalSongs(res.data.list)
                }
            }).catch(e => {
                console.log(e);
            })
        },
        _normalSongs(list) {
            let ret = []
            list.forEach((item) => {
                let { musicData } = item
                if (musicData.songid && musicData.albummid) {
                    ret.push(createSong(musicData))
                }
            })
            return ret
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.singer-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-background;
}

.slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
}
</style>