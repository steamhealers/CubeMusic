<template>
    <transition name="slide">
        <musicList :songs="songs" :title="title" :bgImage="bgImage"></musicList>
    </transition>
</template>

<script>
import { ERR_OK } from 'api/config'
import { getSongList } from 'api/recommend'
import musicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { createSong } from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.songListDesc
    },
    bgImage() {
      return this.disc.picUrl
    }
  },
  components: {
    musicList
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if(!this.disc.id){
        this.$router.push('/recommend')
      }
      getSongList(this.disc.id).then(res => {
        if (res.code === ERR_OK) {
          console.log(res.cdlist[0]);
          this.songs = this._normalSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalSongs(list) {
      let ret = []
      list.forEach((musicData) => {
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