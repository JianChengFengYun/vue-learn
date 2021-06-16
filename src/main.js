import Vue from 'vue'
import App from './App.vue'
import router from './krouter'
import store from './kstore'
import Notice from "@/components/Notice.vue";
import create from "@/utils/create";

Vue.config.productionTip = false

Vue.prototype.$notice = function(options){
  const comp = create(Notice, options)
  comp.show()
  return comp;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
