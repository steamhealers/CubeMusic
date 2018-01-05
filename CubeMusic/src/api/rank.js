import jsonp from 'common/js/jsonp'
import axios from 'axios'
import { commonParams, options } from 'api/config'
export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    format: 'jsonp',
    platform: 'h5',
    uin: 0,
    g_tk: 5381,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    format: 'jsonp',
    platform: 'h5',
    uin: 0,
    g_tk: 5381,
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid
  })
  return jsonp(url, data, options)
}