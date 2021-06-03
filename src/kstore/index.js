import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from './kvuex'

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
    add({commit}){
      setTimeout(()=>{
        commit('add')
      },1000)
    }
  },
  modules: {
  }
})
