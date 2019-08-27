import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    isSignIn: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user; //firebaseが返したユーザー情報
    },
    setSignIn(state, flag) {
      state.isSignIn = flag //ログインしてるかどうか
    }
  },
  getters: {

  },
  actions: {
    
  },
  plugins: [createPersistedState()]//reloadしてもstate状態維持
})
