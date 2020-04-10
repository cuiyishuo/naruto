import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    interfaceId: ""
  },
  mutations: {
    getInterfaceId(state, interfaceId) {
      window.sessionStorage.setItem("interfaceId", interfaceId);
      state.interfaceId = interfaceId;
    }
  }
});
