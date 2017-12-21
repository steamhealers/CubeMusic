import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import router from './router'
fastclick.attach(document.body)

// import vConsole from 'vconsole'

// Vue.use(VueLazyload, {
//   loading: require('common/image/default.png')
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  render: c => c(App)
})
