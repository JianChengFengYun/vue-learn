import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 1
  },
  mutations: {
    //state从哪儿来
    add(state){
      state.counter++
    }
  },
  actions: {
    // ctx是什么
    add(ctx){
      setTimeout(()=>{
        ctx.commit('add')
      },1000)
    }
  },
  modules: {
  }
})
