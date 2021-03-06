import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "../store";
import "./plugins/element.js";
// 引入图标样式
import "./assets/font/iconfont.css";
// 导入全局样式表
import "./assets/css/global.css";
// 引入jsonview组建
import "./plugins/vue-json-pretty.js";
// 引入复制组件
import VueClipboard from "vue-clipboard2";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  VueClipboard
}).$mount("#app");
