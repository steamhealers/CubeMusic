<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import musicList from 'components/music-list/music-list'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { Song, createSong } from 'common/js/song'
export default {
    data() {
        return {
            songs: [],
            rank:true
        }
    },
    computed: {
        ...mapGetters([
            'topList'
        ]),
        title() {
            return this.topList.topTitle
        },
        bgImage() {
            if (this.songs.length) {
                return this.songs[0].image
            }
            return ''
        }
    },
    components: {
        musicList
    },
    created() {
        this._getMusicList()
    },
    methods: {
        _getMusicList() {
            if (!this.topList.id) {
                this.$router.push({
                    path: '/rank'
                })
            }
            getMusicList(this.topList.id).then(res => {
                if (res.code === ERR_OK) {
                    console.log(res);
                    this.songs = this._normalSongs(res.songlist)
                }
            })
        },
        _normalSongs(list) {
            let ret = []
            list.forEach((item) => {
                if (item.data.songid && item.data.albummid) {
                    ret.push(createSong(item.data))
                }
            })
            return ret
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
}
</style>