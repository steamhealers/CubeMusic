<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list" ref="list">
          <h1 class="list-title">热门歌曲推荐</h1>
          <ul>
            <li class="item" v-for="item in discList" @click="selectItem(item)">
              <div class="icon">
                <img @load="loadImage" v-lazy="item.picUrl" width="60" height="60" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{item.songListDesc}}</h2>
                <p class="desc" v-html="item.songListAuthor"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div  class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import slider from 'base/slider/slider'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  components: {
    slider,
    scroll,
    loading
  },
  created() {
    this._getRecommend()
    // this._getDiscList()
  },
  methods: {
    ...mapMutations({
      'setDisc': 'SET_DISC'
    }),
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
          this.discList = res.data.songList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // _getDiscList() {
    //   getDiscList().then(res => {
    //     if (res.code === ERR_OK) {
    //       this.discList = res.data.songList
    //       console.log(this.discList);
    //     }
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // },
    loadImage() {
      if (!this.isLoaded) {
        this.$refs.scroll.refresh()
        this.isLoaded = true
      }
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? 60 : 0
      this.$refs.recommend.style.paddingBottom = `${bottom}px`
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `recommend/${item.id}`
      })
      this.setDisc(item)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
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