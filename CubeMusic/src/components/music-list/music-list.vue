<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" ref="playBtn" @click="randomItem">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放歌曲</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll :data="songs" class="list" ref="list" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="_onScroll">
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import songList from 'base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-fliter')
const RESERVE_HEIGHT = 40
export default {
  mixins: [playlistMixin],
  components: {
    scroll,
    songList,
    loading
  },
  computed: {
    bgStyle() {
      return `background-image:url('${this.bgImage}')`
    }
  },
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollY: -1
    }
  },
  props: {
    songs: {
      type: Array,
      default: []
    },
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  created() {
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minImageHeight = -this.imageHeight + RESERVE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    back() {
      this.$router.back()
    },
    _onScroll(pos) {
      this.scrollY = pos.y
      console.log(this.scrollY);
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    randomItem() {
      this.randomPlay({
        list: this.songs
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? 60 : 0
      this.$refs.list.$el.style.bottom = `${bottom}px`
      this.$refs.list.refresh()
    }
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0
      let scale = 1
      let blur = 0
      let transformY = Math.max(this.minImageHeight, newY)
      this.$refs.bgLayer.style[transform] = `translate3d(0,${transformY}px,0)`

      if (newY < this.minImageHeight) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVE_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex

      let percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
        this.$refs.bgImage.style[backdrop] = `blur(${blur})`
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    // z-index: 100;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
