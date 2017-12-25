import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/rank',
    component: Rank
  },
  {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id', component: SingerDetail
    }]
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/search',
    component: Search
  }
]
export default new Router({
  routes
})
