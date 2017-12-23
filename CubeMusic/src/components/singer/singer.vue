<template>
  <div class="singer">
    <listview :data="singers"></listview>
  </div>
</template>

<script>
import listview from 'base/listview/listview'
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
const HOT_NAME = '热门歌手'
const HOT_NAME_LENGTH = 10
export default {
  data() {
    return {
      singers: []
    }
  },
  components: {
    listview
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
          console.log(this.singers)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          item: []
        }
      }
      // 填充map
      list.forEach((item, index) => {
        if (index < HOT_NAME_LENGTH) {
          map.hot.item.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        } else {
          var key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              item: []
            }
          }
          map[key].item.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
      })
      // 排序
      let hot = []
      let ret = []
      for (var key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z0-9]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
      // console.log(hot.concat(ret));
    }
  }
}
</script>

<style scoped lang="stylus" ret="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>

