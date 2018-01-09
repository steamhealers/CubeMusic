import jsonp from 'common/js/jsonp'
import { commonParams, options } from 'api/config'
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
export function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const data = Object.assign({}, commonParams, {
    catZhida: zhida ? 1 : 0,
    perpage,
    w: query,
    n: perpage,
    p: page,
    g_tk: 5381,
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all'
  })
  return jsonp(url, data, options)
}
