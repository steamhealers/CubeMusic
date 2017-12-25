import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import router from './router'
import lazyload from 'vue-lazyload'
import store from './store'
Vue.use(lazyload, {
  loading: require('common/image/default.png')
})
fastclick.attach(document.body)

// import vConsole from 'vconsole'

// Vue.use(VueLazyload, {
//   loading: require('common/image/default.png')
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: c => c(App)
})
